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

export function buildVerdict(report, { pipelineId, sha, runs, root }) {
  if (!report || !Array.isArray(report.suites)) throw new Error('the Playwright JSON report has no suites');
  const testDir = report.config?.rootDir ?? root;
  const byTest = new Map();
  for (const suite of report.suites) {
    for (const spec of specsOf(suite)) {
      const file = relative(root, join(testDir, spec.file));
      const key = `${file}\u0000${spec.title}`;
      const entry = byTest.get(key) ?? { file, title: spec.title, passed: 0, failed: 0, trace: null, error: null, error_at: null };
      for (const test of spec.tests) {
        for (const result of test.results) {
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
  const tests = [...byTest.values()]
    .filter((t) => t.passed + t.failed > 0)
    .map((t) => ({ ...t, verdict: t.passed === 0 ? 'real' : 'flaky' }));
  if (tests.length === 0) throw new Error('the report has no test results, so there is nothing to judge');
  return { pipeline_id: pipelineId, sha, runs, tests };
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
  const [reportPath, outPath] = args;
  if (!reportPath || !outPath) {
    console.error('usage: node tools/verdict.mjs --failed <e2e-report.json> | <report.json> <verdict.json>');
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
    return 0;
  } catch (err) {
    console.error(`flake-verdict: ${err.message}. No verdict written.`);
    return 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) process.exitCode = main(process.argv.slice(2));
