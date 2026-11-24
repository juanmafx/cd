import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const schema = readFileSync(new URL('../../db/schema.sql', import.meta.url), 'utf8');

test('schema defines the optional request event table', () => {
  assert.match(schema, /CREATE TABLE IF NOT EXISTS request_events/);
});

test('schema stores no client identifiers', () => {
  assert.doesNotMatch(schema, /\b(ip|ip_address|user_agent|email|phone)\b/i);
});
