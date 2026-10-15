import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildSummary, flowMergeRequest, stateLabel } from '../../tools/summary.mjs';

const TITLE = 'async confirmation';
const MR = { iid: 3, state: 'merged', source_branch: 'fix/2936535281-async-confirmation', title: `Fix flaky test: ${TITLE} (pipeline 2936535281)`, web_url: 'https://gitlab.example/mr/3' };
const ORIGINAL = { id: 2936535281, sha: 'abc1234', web_url: 'https://gitlab.example/pipelines/2936535281' };
const VERDICT = { runs: 10, tests: [{ title: 'other', passed: 9, verdict: 'flaky' }, { title: TITLE, passed: 7, verdict: 'flaky' }] };
const RUN = { mr: MR, original: ORIGINAL, verdict: VERDICT, url: 'https://booking.example', deployPipelineUrl: 'https://gitlab.example/pipelines/99' };

test('a proven fix links the pipeline, the merge request, the proof and the live URL', () => {
  const note = buildSummary({ ...RUN, proof: { runs: 50, tests: [{ title: TITLE, passed: 50 }] }, quarantined: false });
  assert.match(note, /pipeline \[2936535281\]\(https:\/\/gitlab\.example\/pipelines\/2936535281\)/);
  assert.match(note, /`async confirmation` · 7\/10 re-runs passed/);
  assert.match(note, /\[!3\]\(https:\/\/gitlab\.example\/mr\/3\)/);
  assert.match(note, /Proof: 50\/50 runs passed/);
  assert.match(note, /Deployed: https:\/\/booking\.example/);
});

test('a quarantined test reports the failed proof instead of a pass', () => {
  const note = buildSummary({ ...RUN, proof: { runs: 50, tests: [{ title: TITLE, passed: 33 }] }, quarantined: true });
  assert.match(note, /the fix passed 33\/50 runs, so the test was quarantined instead/);
});

test('a commit that does not come from a flow merge request has no summary', () => {
  assert.equal(flowMergeRequest([{ ...MR, source_branch: 'feature/x' }, { ...MR, state: 'opened' }]), null);
  assert.deepEqual(flowMergeRequest([MR]), { mr: MR, pipelineId: 2936535281 });
  assert.equal(buildSummary({ ...RUN, mr: null }), null);
});

test('the merged merge request gets the scoped state label of how the loop ended', () => {
  assert.equal(stateLabel(false), 'triage::merged');
  assert.equal(stateLabel(true), 'triage::quarantined');
});
