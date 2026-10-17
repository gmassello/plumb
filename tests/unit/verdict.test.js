import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildVerdict, failedLocations, infraMatch, infraOf, loadErrorVerdict, proven, realFiles, toJunit, unreproduced, withBase, withSuite } from '../../tools/verdict.mjs';

const ROOT = '/w';
const OPTS = { pipelineId: 42, sha: 'abc1234', runs: 10, root: ROOT };
const ERROR = {
  message: 'Error: \u001b[2mexpect(\u001b[22mreceived).toBe(expected)\n\nExpected: "Booking \u001b[7mconfirmed\u001b[27m"\nReceived: "Booking pending"',
  location: { file: `${ROOT}/tests/e2e/booking.spec.ts`, line: 13, column: 66 },
};

function spec(file, title, status) {
  const attachments = status === 'passed' ? [] : [{ name: 'trace', path: `${ROOT}/test-results/${title}/trace.zip` }];
  return {
    title,
    file,
    line: 7,
    tests: [{ status: status === 'passed' ? 'expected' : 'unexpected', results: [{ status, attachments, ...(status === 'passed' ? {} : { error: ERROR }) }] }],
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
    error: 'Error: expect(received).toBe(expected)\n\nExpected: "Booking confirmed"\nReceived: "Booking pending"',
    error_at: 'tests/e2e/booking.spec.ts:13',
    verdict: 'flaky',
    order: null,
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

test('a real test gets the result of its runs on the parent commit, or null when the parent lacks it', () => {
  const v = buildVerdict(report([
    ['booking.spec.ts', 'async confirmation', times(10, 'failed')],
    ['modal.spec.ts', 'booking from the confirmation modal', times(10, 'failed')],
    ['timezone.spec.ts', 'late slot', [...times(4, 'passed'), ...times(6, 'failed')]],
  ]), OPTS);
  assert.deepEqual(realFiles(v), ['tests/e2e/booking.spec.ts', 'tests/e2e/modal.spec.ts']);
  const parent = report([['booking.spec.ts', 'async confirmation', times(3, 'passed')]]);
  const out = withBase(v, parent, { sha: 'def5678', root: ROOT });
  assert.deepEqual(out.tests.map((t) => [t.title, t.base]), [
    ['async confirmation', { sha: 'def5678', passed: 3, runs: 3 }],
    ['booking from the confirmation modal', null],
    ['late slot', undefined],
  ]);
});

test('the junit report has one test case per run, so GitLab counts every repetition', () => {
  const v = buildVerdict(report([['booking.spec.ts', 'async <confirmation>', [...times(3, 'passed'), ...times(2, 'failed')]]]), OPTS);
  const out = toJunit(v, 'flake-verdict');
  assert.match(out, /<testsuite name="flake-verdict" tests="5" failures="2">/);
  assert.equal(out.match(/<testcase /g).length, 5);
  assert.equal(out.match(/<failure /g).length, 2);
  assert.match(out, /name="async &lt;confirmation&gt; \[run 5\/5\]"/);
});

const seq = (pattern) => [...pattern].map((c) => (c === 'P' ? 'passed' : 'failed'));
const orderOf = (pattern) => buildVerdict(report([['modal.spec.ts', 'booking from the confirmation modal', seq(pattern)]]), OPTS).tests[0];

test('passing the first runs and failing every later one is a state leak; a scattered flaky run is not', () => {
  assert.equal(orderOf('PPFFFFFFFF').order, 'state-leak');
  assert.equal(orderOf('PFFFFFFFFF').order, 'state-leak');
  assert.equal(orderOf('PFFFFPPPPP').order, null);
  assert.equal(orderOf('PPPPPPPPFF').order, null);
  const real = orderOf('FFFFFFFFFF');
  assert.deepEqual([real.verdict, real.order], ['real', null]);
});

test('a test that passes every isolated run is suite-only, and gets the result of its full-suite runs', () => {
  const v = buildVerdict(report([['modal.spec.ts', 'booking from the confirmation modal', seq('PPPPPPPPPP')]]), OPTS);
  assert.equal(v.tests[0].order, 'suite-only');
  assert.equal(unreproduced(v), true);
  const suites = ['F', 'P', 'F'].map((s) => report([
    ['booking.spec.ts', 'async confirmation', ['passed']],
    ['modal.spec.ts', 'booking from the confirmation modal', seq(s)],
  ]));
  assert.deepEqual(withSuite(v, suites, { root: ROOT }).tests[0].suite, { passed: 1, runs: 3 });
  assert.equal(unreproduced(buildVerdict(report([['modal.spec.ts', 'x', seq('PFPFPFPFPF')]]), OPTS)), false);
});

test('infrastructure errors are recognised; errors a commit can cause, like a refused connection or a server that does not start, are not', () => {
  assert.equal(infraMatch('Error: ENOSPC: no space left on device, write').pattern, 'no space left');
  assert.equal(infraMatch('Error: getaddrinfo EAI_AGAIN registry.npmjs.org').pattern, 'DNS failure');
  assert.equal(infraMatch('Error: getaddrinfo ENOTFOUND bookng.local'), null);
  assert.equal(infraMatch('Error: Timed out waiting 30000ms from config.webServer.'), null);
  assert.equal(infraMatch('browserType.launch: Executable does not exist'), null);
  assert.equal(infraMatch('Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:8080/'), null);
  assert.equal(infraMatch('connect ECONNREFUSED 127.0.0.1:8080'), null);
  assert.deepEqual(infraOf({ errors: [{ message: 'Error: ENOSPC: no space left on device, write' }], suites: [] }), {
    pattern: 'no space left',
    message: 'Error: ENOSPC: no space left on device, write',
  });
  assert.equal(infraOf(report([['booking.spec.ts', 'async confirmation', ['failed']]])), null);
});

test('a spec that fails to load becomes one real test named after the file; a report with failed tests does not', () => {
  const broken = { errors: [{ message: "Error: Cannot find module './missing'", location: { file: `${ROOT}/tests/e2e/modal.spec.ts`, line: 2, column: 1 } }], suites: [] };
  assert.deepEqual(loadErrorVerdict(broken, OPTS), {
    pipeline_id: 42,
    sha: 'abc1234',
    runs: 1,
    tests: [{ file: 'tests/e2e/modal.spec.ts', title: 'tests/e2e/modal.spec.ts failed to load', passed: 0, failed: 1, trace: null, error: "Error: Cannot find module './missing'", error_at: 'tests/e2e/modal.spec.ts:2', verdict: 'real', order: null }],
  });
  const anonymous = { errors: [{ message: `Error: Cannot find module '${ROOT}/tests/e2e/missing' imported from ${ROOT}/tests/e2e/modal.spec.ts`, location: { file: '<anonymous>', line: 1, column: 1 } }], suites: [] };
  const t = loadErrorVerdict(anonymous, OPTS).tests[0];
  assert.deepEqual([t.file, t.title, t.error_at], ['tests/e2e/modal.spec.ts', 'tests/e2e/modal.spec.ts failed to load', null]);
  assert.equal(loadErrorVerdict({ ...report([['booking.spec.ts', 'async confirmation', ['failed']]]), errors: broken.errors }, OPTS), null);
  assert.equal(loadErrorVerdict(report([['booking.spec.ts', 'async confirmation', ['failed']]]), OPTS), null);
});

test('skipped and interrupted runs are not counted as runs', () => {
  const v = buildVerdict(report([['booking.spec.ts', 'async confirmation', ['passed', 'failed', 'skipped', 'interrupted']]]), OPTS);
  assert.deepEqual([v.tests[0].passed, v.tests[0].failed, v.tests[0].verdict], [1, 1, 'flaky']);
});

test('a proof holds only when every test passed every run; a skipped run or one failure breaks it', () => {
  const P = { ...OPTS, runs: 3 };
  assert.equal(proven(buildVerdict(report([['booking.spec.ts', 'async confirmation', ['passed', 'passed', 'passed']]]), P)), true);
  assert.equal(proven(buildVerdict(report([['booking.spec.ts', 'async confirmation', ['passed', 'failed', 'passed']]]), P)), false);
  assert.throws(() => buildVerdict(report([['booking.spec.ts', 'async confirmation', ['skipped', 'skipped', 'skipped']]]), P), /nothing to judge/);
  assert.equal(proven(buildVerdict(report([['booking.spec.ts', 'async confirmation', ['passed', 'skipped', 'passed']]]), P)), false);
  assert.equal(proven(buildVerdict(report([['booking.spec.ts', 'async confirmation', ['passed', 'passed']]]), P)), false);
  assert.equal(proven({ runs: 3, tests: [] }), false);
});
