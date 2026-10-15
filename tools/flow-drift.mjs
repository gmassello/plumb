import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const ITEM = 'gid://gitlab/Ai::Catalog::Item/1017874';
const FILE = '.gitlab/duo/triage-flow.yml';

function lines(text) {
  return (text ?? '').replace(/\s+$/, '').split('\n').map((l) => l.replace(/\s+$/, ''));
}

export function drift(repo, published) {
  const a = lines(repo);
  const b = lines(published);
  const diff = [];
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (a[i] === b[i]) continue;
    if (a[i] !== undefined) diff.push(`${i + 1} repo:      ${a[i]}`);
    if (b[i] !== undefined) diff.push(`${i + 1} published: ${b[i]}`);
  }
  return diff;
}

async function published() {
  const token = process.env.MERGE_BOT_TOKEN;
  const res = await fetch(`${process.env.CI_API_GRAPHQL_URL ?? 'https://gitlab.com/api/graphql'}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { 'PRIVATE-TOKEN': token } : {}) },
    body: JSON.stringify({ query: `{ aiCatalogItem(id: "${ITEM}") { latestVersion { versionName ... on AiCatalogFlowVersion { definition } } } }` }),
  });
  if (!res.ok) throw new Error(`GraphQL returned HTTP ${res.status}`);
  const version = (await res.json()).data?.aiCatalogItem?.latestVersion;
  if (!version?.definition) throw new Error(`the catalog item ${ITEM} has no readable definition`);
  return version;
}

async function main() {
  const version = await published();
  const diff = drift(readFileSync(FILE, 'utf8'), version.definition);
  if (diff.length === 0) {
    console.log(`flow-drift: ${FILE} matches the published flow (version ${version.versionName}).`);
    return 0;
  }
  console.error(`flow-drift: ${FILE} differs from the published flow (version ${version.versionName}) on ${diff.length} lines. Publish the repo version or revert the UI edit:`);
  console.error(diff.slice(0, 40).join('\n'));
  return 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().then(
    (code) => (process.exitCode = code),
    (err) => {
      console.error(`flow-drift: ${err.message}.`);
      process.exitCode = 1;
    },
  );
}
