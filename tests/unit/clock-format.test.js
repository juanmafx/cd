import assert from 'node:assert/strict';
import { test } from 'node:test';
import { formatClockTime } from '../../src/domain/clock-format.js';

test('formats local time as hours:minutes:seconds:milliseconds', () => {
  assert.equal(formatClockTime(new Date(2026, 0, 2, 13, 14, 15, 167)), '13:14:15:167');
});

test('keeps the original unpadded field format', () => {
  assert.equal(formatClockTime(new Date(2026, 0, 2, 3, 4, 5, 6)), '3:4:5:6');
});

test('handles midnight', () => {
  assert.equal(formatClockTime(new Date(2026, 0, 2, 0, 0, 0, 0)), '0:0:0:0');
});
