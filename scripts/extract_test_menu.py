#!/usr/bin/env python3
"""Checkpointed extraction of test_menu.xlsx -> normalized lab_tests_records.json.
Stages: CP0 checksum -> CP1 per-sheet JSONL (flush 50, resume marker) -> CP2 validation -> CP3 merge."""
import openpyxl, json, hashlib, os, sys
from pathlib import Path

XLSX = Path('/home/sak/.hermes/cache/scratch/test_menu.xlsx')
OUT = Path('/home/sak/.hermes/cache/scratch/extract')
OUT.mkdir(exist_ok=True)
PROGRESS = OUT / 'progress.json'

def load_progress():
    if PROGRESS.exists():
        return json.load(open(PROGRESS))
    return {'cp0': None, 'sheets_done': [], 'merge': None}

def save_progress(p):
    tmp = PROGRESS.with_suffix('.tmp')
    json.dump(p, open(tmp, 'w'))
    os.replace(tmp, PROGRESS)

def cp0(p):
    if p['cp0']:
        return p[0] if False else None
    h = hashlib.sha256(XLSX.read_bytes()).hexdigest()
    p['cp0'] = {'sha256': h, 'bytes': XLSX.stat().st_size}
    save_progress(p)

FIELDS = {  # master Biochem header (exact, incl trailing spaces) -> record key
 'Service Code': 'code', 'Service Name': 'name', 'Department Name': 'dept',
 'Processing Type': 'proc_type', 'Schedule Mode': 'mode', 'OutSource B2B Name': 'b2b',
 'SRA SCA TAT Min': 'sra_sca_tat', 'SRA SCA STAT Min': 'sra_sca_stat',
 'Department TAT Min': 'dept_tat', 'Department STAT Min': 'dept_stat',
 'Approval TAT Min': 'appr_tat', 'Approval STAT Min': 'appr_stat',
 'TAT(DD:HH:MM)': 'tat', 'STAT(DD:HH:MM)': 'stat',
 'Interpretation/Limitations for the Test report': 'interpretation',
 'Pre-analytical Requirements': 'pre_analytical',
 'Reference Range Notes': 'ref_ranges', 'References / Sources': 'refs',
}

def clean_text(v):
    if v is None: return None
    s = str(v)
    s = __import__('re').sub(r'\*\*(.+?)\*\*', r'\1', s, flags=__import__('re').DOTALL)
    s = s.replace('\r\n', '\n').rstrip(' \t')
    s = __import__('re').sub(r'\n{3,}', '\n\n', s)
    return s or None

def header_map(hdr):
    def key(h):
        if h is None: return None
        s = str(h).strip()
        return FIELDS.get(s)
    return {i: key(h) for i, h in enumerate(hdr) if key(h)}

def cp1(p):
    wb = openpyxl.load_workbook(XLSX)
    for ws in wb.worksheets:
        if ws.title in p['sheets_done']:
            continue
        rows = ws.iter_rows(values_only=True)
        try:
            hdr = next(rows)
        except StopIteration:
            p['sheets_done'].append(ws.title); save_progress(p); continue
        idx = header_map(hdr)
        slug = __import__('re').sub(r'[^A-Za-z0-9]+', '_', ws.title).strip('_')
        outp = OUT / f"{slug}.jsonl"
        n = 0
        with open(outp, 'w') as f:
            for r in rows:
                if not any(v is not None and str(v).strip() for v in r):
                    continue
                rec = {}
                for i, k in idx.items():
                    if i >= len(r):
                        continue
                    v = r[i]
                    if isinstance(v, str) or v is None:
                        v = clean_text(v)
                    elif hasattr(v, 'strftime') or hasattr(v, 'hour'):
                        v = str(v)
                    if v is not None:
                        rec[k] = v
                if not rec.get('name'):
                    continue
                f.write(json.dumps(rec, ensure_ascii=False) + '\n')
                n += 1
                if n % 50 == 0:
                    f.flush()
        p['sheets_done'].append(ws.title)
        save_progress(p)
        print(f"CP1 {ws.title}: {n} records -> {outp}")

def cp2_validate(p):
    master = [json.loads(l) for l in open(OUT / 'Biochem.jsonl')]
    codes = [m.get('code') or '' for m in master]
    assert len(codes) == 518 and len(set(codes)) == 518, f"master {len(codes)} rows / {len(set(codes))} unique"
    cats = {}
    for f, exp in [('Out_Source.jsonl', 249), ('In_house_Routine.jsonl', 211), ('Scheduled_Inhouse.jsonl', 57)]:
        recs = [json.loads(l) for l in open(OUT / f)]
        assert len(recs) == exp, f"{f}: {len(recs)} != {exp}"
        codeset = set(codes)
        missing = [r.get('code') or '' for r in recs if (r.get('code') or '') not in codeset]
        assert not missing, f"codes not in master: {missing[:5]}"
        cats[f] = recs
    local = sum(1 for m in master if m.get('proc_type') == 'Local')
    outs = sum(1 for m in master if m.get('proc_type') == 'OutSource')
    br = sum(1 for m in master if m.get('proc_type') == 'Branch Transfer')
    assert (local, outs, br) == (268, 249, 1), (local, outs, br)
    no_interp = [m['code'] for m in master if not m.get('interpretation')]
    print(f"CP2 OK: 518 unique; Local/OutSource/Branch = {local}/{outs}/{br}; no-interp count: {len(no_interp)}")

def cp3_merge(p):
    master = [json.loads(l) for l in open(OUT / 'Biochem.jsonl')]
    enriched = {}
    for l in open(OUT / 'Biochem_Enriched.jsonl'):
        e = json.loads(l)
        if e.get('code'):
            enriched[e['code']] = e
    n_over = 0
    for m in master:
        e = enriched.get(m.get('code'))
        if e:
            for k in ('interpretation', 'pre_analytical', 'ref_ranges', 'refs'):
                if not m.get(k) and e.get(k):
                    m[k] = e[k]; n_over += 1
    for m in master:
        for k in ('name', 'code', 'dept', 'proc_type', 'mode'):
            m[k] = (m.get(k) or '').strip()
    master.sort(key=lambda m: m['name'].lower())
    outp = OUT / 'lab_tests_records.json'
    json.dump(master, open(outp, 'w'), ensure_ascii=False, indent=0)
    p['merge'] = {'records': len(master), 'overrides': n_over, 'bytes': outp.stat().st_size}
    save_progress(p)
    print(f"CP3: {len(master)} records, {n_over} enriched-overrides, {outp.stat().st_size} bytes")

if __name__ == '__main__':
    p = load_progress()
    print(f"resume: cp0={bool(p['cp0'])} sheets_done={p['sheets_done']} merge={bool(p['merge'])}")
    cp0(p); cp1(p); cp2_validate(p)
    if not p['merge']:
        cp3_merge(p)
    else:
        print(f"CP3 cached: {p['merge']}")
