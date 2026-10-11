import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildVerdict, failedLocations } from '../../tools/verdict.mjs';

const ROOT = '/w';
const OPTS = { pipelineId: 42, sha: 'abc1234', runs: 10, root: ROOT };

function spec(file, title, status) {
  const attachments = status === 'passed' ? [] : [{ name: 'trace', path: `${ROOT}/test-results/${title}/trace.zip` }];
  return {
    title,
    file,
    line: 7,
    tests: [{ status: status === 'passed' ? 'expected' : 'unexpected', results: [{ status, attachments }] }],
  };
}

function report(runs) {
  const byFile = new Map();
  for (const [file, title, statuses] of runs) {
    const specs = byFile.get(file) ?? [];
    for (const s of statuses) specs.push(spec(file, title, s));
    byFile.set(file, specs);
  }
  return {
    config: { rootDir: `${ROOT}/tests/e2e` },
    suites: [...byFile].map(([file, specs]) => ({ title: file, file, specs })),
  };
}

const times = (n, s) => Array(n).fill(s);

test('a test that passes 7 of 10 re-runs is flaky', () => {
  const v = buildVerdict(report([['booking.spec.ts', 'async confirmation', [...times(7, 'passed'), ...times(3, 'failed')]]]), OPTS);
  assert.equal(v.pipeline_id, 42);
  assert.equal(v.runs, 10);
  assert.deepEqual(v.tests, [{
    file: 'tests/e2e/booking.spec.ts',
    title: 'async confirmation',
    passed: 7,
    failed: 3,
    trace: 'test-results/async confirmation/trace.zip',
    verdict: 'flaky',
  }]);
});

test('a test that fails all 10 re-runs is a real regression', () => {
  const v = buildVerdict(report([['booking.spec.ts', 'async confirmation', [...times(9, 'failed'), 'timedOut']]]), OPTS);
  assert.equal(v.tests[0].passed, 0);
  assert.equal(v.tests[0].failed, 10);
  assert.equal(v.tests[0].verdict, 'real');
});

test('two failed tests each keep their own counts', () => {
  const v = buildVerdict(report([
    ['booking.spec.ts', 'async confirmation', [...times(6, 'passed'), ...times(4, 'failed')]],
    ['modal.spec.ts', 'booking from the confirmation modal', times(10, 'failed')],
  ]), OPTS);
  assert.deepEqual(v.tests.map((t) => [t.title, t.passed, t.failed, t.verdict]), [
    ['async confirmation', 6, 4, 'flaky'],
    ['booking from the confirmation modal', 0, 10, 'real'],
  ]);
});

test('only the tests that failed in e2e are picked for re-runs, by file and line', () => {
  const e2e = report([
    ['booking.spec.ts', 'async confirmation', ['failed']],
    ['timezone.spec.ts', 'late slot', ['passed']],
  ]);
  assert.deepEqual(failedLocations(e2e, ROOT), ['tests/e2e/booking.spec.ts:7']);
  const green = report([['timezone.spec.ts', 'late slot', ['passed']]]);
  assert.throws(() => failedLocations(green, ROOT), /no failed tests/);
});

test('a report with no test results is refused', () => {
  assert.throws(() => buildVerdict({ config: {}, suites: [] }, OPTS), /nothing to judge/);
  assert.throws(() => buildVerdict({}, OPTS), /no suites/);
});

test('a missing report writes no verdict and exits 1', () => {
  const dir = mkdtempSync(join(tmpdir(), 'verdict-'));
  const out = join(dir, 'verdict.json');
  assert.throws(
    () => execFileSync('node', ['tools/verdict.mjs', join(dir, 'report.json'), out], { stdio: 'pipe' }),
    (err) => err.status === 1 && /No verdict written/.test(err.stderr.toString()),
  );
  writeFileSync(join(dir, 'empty.json'), '{"suites": []}');
  assert.throws(() => execFileSync('node', ['tools/verdict.mjs', join(dir, 'empty.json'), out], { stdio: 'pipe' }));
  assert.equal(existsSync(out), false);
});
