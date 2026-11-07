import { LAB_TESTS, LAB_TEST_RECORDS as RAW_TESTS } from './labTests.ts';

// Typed catalogue loaded from the JSON emitted by scripts/extract_test_menu.py.
// Kept as data so the searchable name list (LAB_TESTS) and the rich records stay in sync.
export interface Test {
  code: string;
  name: string;
  dept?: string;
  proc_type: string;      // Local | OutSource | Branch Transfer
  mode?: string;          // Routine | Scheduled
  b2b?: string;           // vendor for outsourced tests
  sra_sca_tat?: number;
  sra_sca_stat?: number;
  dept_tat?: number;
  dept_stat?: number;
  appr_tat?: number;
  appr_stat?: number;
  tat?: string;
  stat?: string;
  interpretation?: string;
  pre_analytical?: string;
  ref_ranges?: string;
  refs?: string;
}

export const LAB_TEST_RECORDS: readonly Test[] = RAW_TESTS;

export function badgeFor(t: Test): string {
  if (t.proc_type === 'Local') return 'In-house';
  if (t.proc_type === 'OutSource') return 'Outsourced';
  return 'Branch';
}

export function vendorFor(t: Test): string {
  if (t.proc_type === 'Local') return 'Vijaya Diagnostic Centre';
  return t.b2b || '';
}

export function searchTests(query: string, limit = 15): Test[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const scored: [number, Test][] = [];
  for (const t of LAB_TEST_RECORDS) {
    const name = t.name.toLowerCase();
    let score: number | null = null;
    if (name.startsWith(q)) score = 0;
    else if (name.includes(q)) score = 1;
    else if (t.code && t.code.toLowerCase().startsWith(q)) score = 2;
    else if (t.dept && t.dept.toLowerCase().includes(q)) score = 3;
    else if (t.interpretation && t.interpretation.toLowerCase().includes(q)) score = 4;
    if (score !== null) scored.push([score, t]);
  }
  scored.sort((a, b) => a[0] - b[0] || a[1].name.localeCompare(b[1].name));
  return scored.slice(0, limit).map(([, t]) => t);
}

export function highlightSegments(text: string, query: string): { part: string; hit: boolean }[] {
  const q = query.trim();
  if (!q) return [{ part: text, hit: false }];
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return [{ part: text, hit: false }];
  return [
    ...(idx > 0 ? [{ part: text.slice(0, idx), hit: false }] : []),
    { part: text.slice(idx, idx + q.length), hit: true },
    ...(idx + q.length < text.length ? [{ part: text.slice(idx + q.length), hit: false }] : []),
  ];
}
