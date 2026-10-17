import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export const RECURRING_FIXES = 2;

const MR_KINDS = [
  ['fixes', 'Fix flaky test'],
  ['updates', 'Update test after app change'],
];
const ISSUE_KINDS = [
  ['quarantines', 'Quarantined'],
  ['regressions', 'Real regression'],
  ['environment', 'Environment change broke'],
];

function refs(items, prefix, title, mark) {
  return items
    .filter((i) => i.title.startsWith(`${prefix}: ${title} (pipeline`))
    .sort((a, b) => a.iid - b.iid)
    .map((i) => `${mark}${i.iid}`);
}

export function historyOf(title, mergeRequests, issues) {
  const history = {};
  for (const [key, prefix] of MR_KINDS) history[key] = refs(mergeRequests.filter((m) => m.state === 'merged'), prefix, title, '!');
  for (const [key, prefix] of ISSUE_KINDS) history[key] = refs(issues, prefix, title, '#');
  return { ...history, recurring: history.fixes.length >= RECURRING_FIXES };
}

async function search(kind, title) {
  const api = process.env.CI_API_V4_URL ?? 'https://gitlab.com/api/v4';
  const project = process.env.CI_PROJECT_ID ?? '87376478';
  const state = kind === 'merge_requests' ? 'merged' : 'all';
  const res = await fetch(`${api}/projects/${project}/${kind}?state=${state}&in=title&search=${encodeURIComponent(title)}&per_page=100`);
  if (!res.ok) throw new Error(`the ${kind} API returned HTTP ${res.status}`);
  return res.json();
}

async function main(path) {
  if (!path) {
    console.error('usage: node tools/history.mjs <verdict.json>');
    return 2;
  }
  let verdict;
  try {
    verdict = JSON.parse(readFileSync(path, 'utf8'));
  } catch (err) {
    console.log(`history: cannot read ${path} (${err.message}), so no history was added.`);
    return 0;
  }
  try {
    for (const t of verdict.tests ?? []) {
      t.history = historyOf(t.title, await search('merge_requests', t.title), await search('issues', t.title));
      console.log(`history: "${t.title}" fixed ${t.history.fixes.length} time(s) before${t.history.recurring ? ', recurring' : ''}.`);
    }
  } catch (err) {
    console.log(`history: ${err.message}, so ${path} keeps no history.`);
    return 0;
  }
  writeFileSync(path, `${JSON.stringify(verdict, null, 2)}\n`);
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) process.exitCode = await main(process.argv[2]);
