import { pathToFileURL } from 'node:url';

const FLOW_BRANCH = /^(fix|update)\/(\d+)-/;

export function flowMergeRequest(mergeRequests) {
  for (const mr of mergeRequests ?? []) {
    const match = mr.state === 'merged' && FLOW_BRANCH.exec(mr.source_branch ?? '');
    if (match) return { mr, pipelineId: Number(match[2]) };
  }
  return null;
}

export function stateLabel(quarantined) {
  return quarantined ? 'triage::quarantined' : 'triage::merged';
}

function testOf(verdict, mrTitle) {
  const tests = verdict?.tests ?? [];
  return tests.find((t) => mrTitle.includes(`: ${t.title} (pipeline`)) ?? tests[0] ?? null;
}

function rate(test, runs) {
  return `${test.passed}/${runs}`;
}

export function buildSummary({ mr, original, verdict, proof, quarantined, url, deployPipelineUrl }) {
  if (!mr) return null;
  const test = testOf(verdict, mr.title);
  const proofTest = testOf(proof, mr.title);
  const lines = [`**Flaky-test loop summary** for pipeline [${original.id}](${original.web_url})`, ''];
  lines.push(
    test
      ? `- Failed test: \`${test.title}\` · ${rate(test, verdict.runs)} re-runs passed · verdict \`${test.verdict}\``
      : '- Failed test: verdict.json unavailable',
  );
  lines.push(`- Merge request: [!${mr.iid}](${mr.web_url}) ${mr.title}`);
  if (quarantined) {
    lines.push(
      proofTest
        ? `- Proof: the fix passed ${rate(proofTest, proof.runs)} runs, so the test was quarantined instead`
        : '- Proof: the fix was not proven, so the test was quarantined instead',
    );
  } else {
    lines.push(proofTest ? `- Proof: ${rate(proofTest, proof.runs)} runs passed` : '- Proof: proof.json unavailable');
  }
  lines.push(`- Deployed: ${url} ([deploy pipeline](${deployPipelineUrl}))`);
  return `${lines.join('\n')}\n`;
}

async function api(path, init = {}) {
  const res = await fetch(`${process.env.CI_API_V4_URL}/projects/${process.env.CI_PROJECT_ID}/${path}`, {
    ...init,
    headers: { 'PRIVATE-TOKEN': process.env.MERGE_BOT_TOKEN, 'Content-Type': 'application/json', ...init.headers },
  });
  if (!res.ok) throw new Error(`${init.method ?? 'GET'} ${path} returned HTTP ${res.status}`);
  return res.json();
}

async function artifact(pipelineId, jobName, file) {
  const jobs = await api(`pipelines/${pipelineId}/jobs?per_page=100`);
  const job = jobs.find((j) => j.name === jobName);
  if (!job) return null;
  try {
    return await api(`jobs/${job.id}/artifacts/${file}`);
  } catch {
    return null;
  }
}

async function main() {
  for (const name of ['CI_API_V4_URL', 'CI_PROJECT_ID', 'CI_COMMIT_SHA', 'MERGE_BOT_TOKEN', 'APP_URL']) {
    if (!process.env[name]) {
      console.error(`summary: ${name} is not set. No summary posted.`);
      return 1;
    }
  }
  const found = flowMergeRequest(await api(`repository/commits/${process.env.CI_COMMIT_SHA}/merge_requests`));
  if (!found) {
    console.log('summary: this commit does not come from a flow merge request, so there is no run to summarise.');
    return 0;
  }
  const original = await api(`pipelines/${found.pipelineId}`);
  const verdict = await artifact(found.pipelineId, 'flake-verdict', 'verdict.json');
  const mrPipelines = await api(`merge_requests/${found.mr.iid}/pipelines`);
  let proof = null;
  let quarantined = false;
  for (const [i, pipeline] of mrPipelines.entries()) {
    proof = await artifact(pipeline.id, 'fix-proof', 'proof.json');
    if (proof) {
      quarantined = i > 0;
      break;
    }
  }
  const note = buildSummary({
    mr: found.mr,
    original,
    verdict,
    proof,
    quarantined,
    url: process.env.APP_URL,
    deployPipelineUrl: process.env.CI_PIPELINE_URL,
  });
  console.log(note);
  if (process.env.SUMMARY_DRY_RUN) return 0;
  await api(`repository/commits/${original.sha}/comments`, { method: 'POST', body: JSON.stringify({ note }) });
  console.log(`summary: posted on commit ${original.sha}`);
  const label = stateLabel(quarantined);
  await api(`merge_requests/${found.mr.iid}`, { method: 'PUT', body: JSON.stringify({ add_labels: label }) });
  console.log(`summary: labelled !${found.mr.iid} ${label}`);
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().then(
    (code) => (process.exitCode = code),
    (err) => {
      console.error(`summary: ${err.message}. No summary posted.`);
      process.exitCode = 1;
    },
  );
}
