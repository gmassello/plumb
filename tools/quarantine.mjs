import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const DIR = 'tests/e2e';

export function quarantinedTitles(dir = DIR) {
  const titles = [];
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.spec.ts')).sort()) {
    for (const m of readFileSync(join(dir, file), 'utf8').matchAll(/\b(?:test|describe)(?:\.\w+)*\(\s*(['"`])([\s\S]*?)\1/g)) {
      if (m[2].includes('@quarantine')) titles.push(m[2].replace(/\s*@quarantine\b/g, '').replace(/\s+/g, ' ').trim());
    }
  }
  return titles;
}

export function check(titles, issues, today, max) {
  const expired = [];
  const missing = [];
  for (const title of titles) {
    const issue = issues.find((i) => i.title.startsWith(`Quarantined: ${title} (pipeline`));
    if (!issue) {
      missing.push(title);
      continue;
    }
    const expires = (issue.description ?? '').match(/^Expires: (\d{4}-\d{2}-\d{2})/m)?.[1];
    if (!expires || expires <= today) expired.push({ title, iid: issue.iid, expires: expires ?? null });
  }
  return { expired, missing, over: titles.length > max };
}

async function quarantineIssues() {
  const api = process.env.CI_API_V4_URL ?? 'https://gitlab.com/api/v4';
  const project = process.env.CI_PROJECT_ID ?? '87376478';
  const res = await fetch(`${api}/projects/${project}/issues?in=title&search=Quarantined&state=all&per_page=100`);
  if (!res.ok) throw new Error(`the issues API returned HTTP ${res.status}`);
  return res.json();
}

async function main() {
  const max = Number(process.env.QUARANTINE_MAX ?? 2);
  const today = process.env.TODAY ?? new Date().toISOString().slice(0, 10);
  const titles = quarantinedTitles();
  console.log(`quarantine-check: ${titles.length} quarantined test(s), at most ${max} allowed.`);
  if (titles.length === 0) return 0;
  let issues;
  try {
    issues = await quarantineIssues();
  } catch (err) {
    console.log(`quarantine-check: cannot read the Quarantined issues (${err.message}), so expiry dates are unchecked.`);
    return 3;
  }
  const { expired, missing, over } = check(titles, issues, today, max);
  for (const e of expired) console.log(`quarantine-check: "${e.title}" expired on ${e.expires ?? 'an unreadable date'} (#${e.iid}). Fix it or remove the test.`);
  for (const t of missing) console.log(`quarantine-check: "${t}" is tagged @quarantine but has no "Quarantined:" issue.`);
  if (over) {
    console.log(`quarantine-check: ${titles.length} tests are quarantined, more than the ${max} allowed. Fix one before quarantining another.`);
    return 1;
  }
  if (expired.length || missing.length) return 3;
  console.log('quarantine-check: every quarantine has an issue and is within its expiry date.');
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) process.exitCode = await main();
