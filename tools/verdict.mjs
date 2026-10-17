import { readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { pathToFileURL } from 'node:url';

function* specsOf(suite) {
  for (const spec of suite.specs ?? []) yield spec;
  for (const child of suite.suites ?? []) yield* specsOf(child);
}

export function failedLocations(report, root) {
  if (!report || !Array.isArray(report.suites)) throw new Error('the e2e report has no suites');
  const testDir = report.config?.rootDir ?? root;
  const locations = new Set();
  for (const suite of report.suites) {
    for (const spec of specsOf(suite)) {
      if (spec.tests.some((t) => t.status === 'unexpected')) {
        locations.add(`${relative(root, join(testDir, spec.file))}:${spec.line}`);
      }
    }
  }
  if (locations.size === 0) throw new Error('the e2e report has no failed tests, so there is nothing to re-run');
  return [...locations];
}

function countByTest(report, root) {
  if (!report || !Array.isArray(report.suites)) throw new Error('the Playwright JSON report has no suites');
  const testDir = report.config?.rootDir ?? root;
  const byTest = new Map();
  for (const suite of report.suites) {
    for (const spec of specsOf(suite)) {
      const file = relative(root, join(testDir, spec.file));
      const key = `${file}\u0000${spec.title}`;
      const entry = byTest.get(key) ?? { file, title: spec.title, passed: 0, failed: 0, trace: null, error: null, error_at: null, seq: [] };
      for (const test of spec.tests) {
        for (const result of test.results) {
          entry.seq.push(result.status === 'passed');
          if (result.status === 'passed') {
            entry.passed += 1;
            continue;
          }
          entry.failed += 1;
          const trace = result.attachments?.find((a) => a.name === 'trace' && a.path);
          if (!entry.trace && trace) entry.trace = relative(root, trace.path);
          if (!entry.error && result.error?.message) {
            entry.error = result.error.message.replace(/\u001b\[[0-9;]*m/g, '').slice(0, 500);
            const at = result.error.location;
            if (at) entry.error_at = `${relative(root, at.file)}:${at.line}`;
          }
        }
      }
      byTest.set(key, entry);
    }
  }
  return byTest;
}

export function orderOf({ seq, passed, failed }) {
  if (failed === 0) return 'suite-only';
  const firstFail = seq.indexOf(false);
  return firstFail > 0 && failed > passed && seq.slice(firstFail).every((ok) => !ok) ? 'state-leak' : null;
}

export function buildVerdict(report, { pipelineId, sha, runs, root }) {
  const tests = [...countByTest(report, root).values()]
    .filter((t) => t.passed + t.failed > 0)
    .map(({ seq, ...t }) => ({ ...t, verdict: t.passed === 0 ? 'real' : 'flaky', order: orderOf({ seq, ...t }) }));
  if (tests.length === 0) throw new Error('the report has no test results, so there is nothing to judge');
  return { pipeline_id: pipelineId, sha, runs, tests };
}

export function withBase(verdict, baseReport, { sha, root }) {
  const byTest = countByTest(baseReport, root);
  const tests = verdict.tests.map((t) => {
    if (t.verdict !== 'real') return t;
    const b = byTest.get(`${t.file}\u0000${t.title}`);
    return { ...t, base: b && b.passed + b.failed > 0 ? { sha, passed: b.passed, runs: b.passed + b.failed } : null };
  });
  return { ...verdict, tests };
}

export function withSuite(verdict, suiteReports, { root }) {
  const counts = suiteReports.map((r) => countByTest(r, root));
  const tests = verdict.tests.map((t) => {
    if (t.order !== 'suite-only') return t;
    const runs = counts.map((c) => c.get(`${t.file}\u0000${t.title}`)).filter((c) => c && c.passed + c.failed > 0);
    return { ...t, suite: { passed: runs.filter((c) => c.failed === 0).length, runs: runs.length } };
  });
  return { ...verdict, tests };
}

export function unreproduced(verdict) {
  return verdict.tests.some((t) => t.order === 'suite-only');
}

const INFRA = [
  ['no space left', /ENOSPC|no space left on device/i],
  ['out of memory', /ENOMEM|heap out of memory|Cannot allocate memory/i],
  ['DNS failure', /EAI_AGAIN/],
  ['network down', /net::ERR_INTERNET_DISCONNECTED|net::ERR_NETWORK_CHANGED/],
];

export function infraMatch(text) {
  const hit = INFRA.find(([, re]) => re.test(text));
  if (!hit) return null;
  const line = text.split('\n').find((l) => hit[1].test(l)) ?? text;
  return { pattern: hit[0], message: line.replace(/\u001b\[[0-9;]*m/g, '').trim().slice(0, 300) };
}

export function infraOf(report) {
  const messages = (report?.errors ?? []).map((e) => e.message ?? '');
  for (const suite of report?.suites ?? []) {
    for (const spec of specsOf(suite)) {
      for (const test of spec.tests) for (const r of test.results) if (r.status !== 'passed') messages.push(r.error?.message ?? '');
    }
  }
  for (const m of messages) {
    const hit = infraMatch(m);
    if (hit) return hit;
  }
  return null;
}

export function loadErrorVerdict(report, { pipelineId, sha, root }) {
  const errors = report?.errors ?? [];
  if (errors.length === 0) return null;
  for (const suite of report.suites ?? []) for (const spec of specsOf(suite)) if (spec.tests.some((t) => t.status === 'unexpected')) return null;
  const { message = '', location } = errors[0];
  const at = location?.file.endsWith('.spec.ts') ? location : null;
  const path = at?.file ?? /[^\s'"]+\.spec\.ts/.exec(message)?.[0];
  const file = path ? relative(root, path) : null;
  const test = {
    file,
    title: `${file ?? 'a spec'} failed to load`,
    passed: 0,
    failed: 1,
    trace: null,
    error: message.replace(/\u001b\[[0-9;]*m/g, '').slice(0, 500),
    error_at: at ? `${file}:${at.line}` : null,
    verdict: 'real',
    order: null,
  };
  return { pipeline_id: pipelineId, sha, runs: 1, tests: [test] };
}

export function proven(verdict) {
  return verdict.tests.length > 0 && verdict.tests.every((t) => t.failed === 0 && t.passed === verdict.runs);
}

export function realFiles(verdict) {
  return [...new Set(verdict.tests.filter((t) => t.verdict === 'real').map((t) => t.file))];
}

const xml = (text) => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function toJunit(verdict, suite) {
  const cases = [];
  for (const t of verdict.tests) {
    const total = t.passed + t.failed;
    for (let i = 1; i <= total; i++) {
      const name = xml(`${t.title} [run ${i}/${total}]`);
      const open = `  <testcase classname="${xml(t.file)}" name="${name}"`;
      cases.push(i <= t.passed ? `${open}/>` : `${open}>\n    <failure message="${xml(t.error ?? 'failed')}"/>\n  </testcase>`);
    }
  }
  const failures = verdict.tests.reduce((n, t) => n + t.failed, 0);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<testsuite name="${xml(suite)}" tests="${cases.length}" failures="${failures}">\n${cases.join('\n')}\n</testsuite>\n`;
}

function readReport(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (err) {
    console.error(`flake-verdict: cannot read ${path} (${err.message}); Playwright probably crashed before writing it. No verdict written.`);
    return null;
  }
}

function main(args) {
  if (args[0] === '--failed' && args[1]) {
    const report = readReport(args[1]);
    if (!report) return 1;
    try {
      console.log(failedLocations(report, process.cwd()).join(' '));
      return 0;
    } catch (err) {
      console.error(`flake-verdict: ${err.message}. No verdict written.`);
      return 1;
    }
  }
  if (args[0] === '--infra' && args[1] && args[2]) {
    const report = readReport(args[1]);
    if (!report) return 1;
    const infra = infraOf(report);
    if (infra) {
      const verdict = { pipeline_id: Number(process.env.CI_PIPELINE_ID) || null, sha: process.env.CI_COMMIT_SHA ?? null, runs: 0, infra, tests: [] };
      writeFileSync(args[2], `${JSON.stringify(verdict, null, 2)}\n`);
      console.log(infra.pattern);
    }
    return 0;
  }
  if (args[0] === '--load-error' && args[1] && args[2]) {
    const report = readReport(args[1]);
    if (!report) return 1;
    const verdict = loadErrorVerdict(report, { pipelineId: Number(process.env.CI_PIPELINE_ID) || null, sha: process.env.CI_COMMIT_SHA ?? null, root: process.cwd() });
    if (verdict) {
      writeFileSync(args[2], `${JSON.stringify(verdict, null, 2)}\n`);
      console.log(verdict.tests[0].file ?? 'unknown spec');
    }
    return 0;
  }
  if (args[0] === '--unreproduced' && args[1]) {
    const verdict = readReport(args[1]);
    if (!verdict) return 1;
    if (unreproduced(verdict)) console.log('suite-only');
    return 0;
  }
  if (args[0] === '--suite' && args[1] && args[2]) {
    const verdict = readReport(args[1]);
    if (!verdict) return 1;
    const reports = args.slice(2).map(readReport).filter(Boolean);
    try {
      writeFileSync(args[1], `${JSON.stringify(withSuite(verdict, reports, { root: process.cwd() }), null, 2)}\n`);
      return 0;
    } catch (err) {
      console.error(`flake-verdict: ${err.message}. verdict.json left without the full-suite result.`);
      return 1;
    }
  }
  if (args[0] === '--proven' && args[1]) {
    const verdict = readReport(args[1]);
    return verdict && proven(verdict) ? 0 : 1;
  }
  if (args[0] === '--real' && args[1]) {
    const verdict = readReport(args[1]);
    if (!verdict) return 1;
    console.log(realFiles(verdict).join(' '));
    return 0;
  }
  if (args[0] === '--base' && args[1] && args[2]) {
    const baseReport = readReport(args[1]);
    const verdict = readReport(args[2]);
    if (!baseReport || !verdict) return 1;
    try {
      const out = withBase(verdict, baseReport, { sha: process.env.BASE_SHA ?? null, root: process.env.BASE_ROOT ?? process.cwd() });
      writeFileSync(args[2], `${JSON.stringify(out, null, 2)}\n`);
      return 0;
    } catch (err) {
      console.error(`flake-verdict: ${err.message}. verdict.json left without the parent commit result.`);
      return 1;
    }
  }
  const [reportPath, outPath, junitPath] = args;
  if (!reportPath || !outPath) {
    console.error('usage: node tools/verdict.mjs --failed <e2e-report.json> | --infra <e2e-report.json> <verdict.json> | --load-error <e2e-report.json> <verdict.json> | --real <verdict.json> | --proven <proof.json> | --unreproduced <verdict.json> | --suite <verdict.json> <suite-report.json>... | --base <base-report.json> <verdict.json> | <report.json> <verdict.json> [<junit.xml>]');
    return 2;
  }
  const report = readReport(reportPath);
  if (!report) return 1;
  try {
    const verdict = buildVerdict(report, {
      pipelineId: Number(process.env.CI_PIPELINE_ID) || null,
      sha: process.env.CI_COMMIT_SHA ?? null,
      runs: Number(process.env.VERDICT_RUNS) || 10,
      root: process.cwd(),
    });
    writeFileSync(outPath, `${JSON.stringify(verdict, null, 2)}\n`);
    if (junitPath) writeFileSync(junitPath, toJunit(verdict, process.env.CI_JOB_NAME ?? 'verdict'));
    return 0;
  } catch (err) {
    console.error(`flake-verdict: ${err.message}. No verdict written.`);
    return 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) process.exitCode = main(process.argv.slice(2));
