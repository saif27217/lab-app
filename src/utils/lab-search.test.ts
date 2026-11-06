import test from 'node:test';
import assert from 'node:assert';
import { searchTests, highlightSegments } from './lab-search.ts';

test.describe('lab-search');

test('searchTests finds urinary tests', () => {
  const r = searchTests('urinary');
  assert.ok(r.length > 5);
  assert.ok(r.every((t) => t.toLowerCase().includes('urinary')));
});

test('searchTests is case-insensitive and capped', () => {
  const r = searchTests('zinc', 2);
  assert.ok(r.length <= 2);
});

test('empty query returns nothing', () => {
  assert.deepEqual(searchTests('   '), []);
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
