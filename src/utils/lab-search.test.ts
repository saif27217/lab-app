import test from 'node:test';
import assert from 'node:assert';
import { searchTests, highlightSegments, badgeFor, LAB_TEST_RECORDS } from './lab-search.ts';

test.describe('lab-search');

test('searchTests finds urinary tests', () => {
  const r = searchTests('urinary');
  assert.ok(r.length > 5);
  assert.ok(r.every((t) => String(t.name).toLowerCase().includes('urinary')));
});

test('searchTests is case-insensitive and capped at 15', () => {
  const r = searchTests('c');
  assert.ok(r.length === 15);
});

test('empty query returns nothing', () => {
  assert.deepEqual(searchTests('   '), []);
});

test('name prefix outranks substring', () => {
  const r = searchTests('zinc');
  assert.equal(r[0].name, 'ZINC');
});

test('code search works', () => {
  const r = searchTests('t8834');
  assert.ok(r.some((t) => t.code === 'T8834'));
});

test('badgeFor maps proc types', () => {
  assert.equal(searchTests('ZINC').map(badgeFor)[0], 'In-house');
});

test('every outsourced test carries a vendor', () => {
  assert.ok(LAB_TEST_RECORDS.filter((t) => t.proc_type === 'OutSource')
    .every((t) => !!t.b2b));
});

test('highlightSegments splits at match (case-insensitive)', () => {
  const segs = highlightSegments('ZINC', 'zin');
  assert.equal(segs[0].part, 'ZIN');
  assert.equal(segs[0].hit, true);
});

test('no match returns single plain segment', () => {
  const segs = highlightSegments('IRON', 'zin');
  assert.equal(segs.length, 1);
  assert.equal(segs[0].hit, false);
});
