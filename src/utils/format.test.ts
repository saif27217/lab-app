import { strict as assert } from 'node:assert';
import { formatReading } from './format.ts';
import { describe, test } from 'node:test';

describe('formatReading', () => {
  test('formats with decimals', () => {
    assert.equal(formatReading({ value: 42.1987, unit: 'mg/dL', decimals: 2 }), '42.20 mg/dL');
  });
  test('defaults to 1 decimal', () => {
    assert.equal(formatReading({ value: 3.0001, unit: 'mmol/L' }), '3.0 mmol/L');
  });
  test('handles Infinity', () => {
    assert.equal(formatReading({ value: Number.POSITIVE_INFINITY, unit: 'g/dL' }), '— g/dL');
  });
});
