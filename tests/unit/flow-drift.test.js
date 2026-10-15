import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { drift } from '../../tools/flow-drift.mjs';

const FLOW = readFileSync('.gitlab/duo/triage-flow.yml', 'utf8');

test('identical definitions have no drift', () => {
  assert.deepEqual(drift(FLOW, FLOW), []);
});

test('trailing whitespace alone is not drift', () => {
  const spaced = FLOW.split('\n').map((l) => `${l}  `).join('\n') + '\n\n';
  assert.deepEqual(drift(FLOW, spaced), []);
});

test('a duplicated block in the published flow is drift and shows the lines', () => {
  const lines = FLOW.split('\n');
  const pasted = [...lines.slice(0, 14), ...lines.slice(2, 14), ...lines.slice(14)].join('\n');
  const diff = drift(FLOW, pasted);
  assert.ok(diff.length > 0);
  assert.match(diff[0], /^15 repo: /);
});
