import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildSummary, flowMergeRequest, quarantinedBy, stateLabel } from '../../tools/summary.mjs';

const TITLE = 'async confirmation';
const MR = { iid: 3, state: 'merged', source_branch: 'fix/2936535281-async-confirmation', title: `Fix flaky test: ${TITLE} (pipeline 2936535281)`, web_url: 'https://gitlab.example/mr/3' };
const ORIGINAL = { id: 2936535281, sha: 'abc1234', web_url: 'https://gitlab.example/pipelines/2936535281' };
const VERDICT = { runs: 10, tests: [{ title: 'other', passed: 9, failed: 1, verdict: 'flaky' }, { title: TITLE, passed: 7, failed: 3, verdict: 'flaky' }] };
const RUN = { mr: MR, original: ORIGINAL, verdict: VERDICT, url: 'https://booking.example', deployPipelineUrl: 'https://gitlab.example/pipelines/99' };

test('a proven fix links the pipeline, the merge request, the proof and the live URL', () => {
  const note = buildSummary({ ...RUN, proof: { runs: 50, tests: [{ title: TITLE, passed: 50, failed: 0 }] }, quarantined: false });
  assert.match(note, /pipeline \[2936535281\]\(https:\/\/gitlab\.example\/pipelines\/2936535281\)/);
  assert.match(note, /`async confirmation` · 7\/10 re-runs passed/);
  assert.match(note, /\[!3\]\(https:\/\/gitlab\.example\/mr\/3\)/);
  assert.match(note, /Proof: 50\/50 runs passed/);
  assert.match(note, /Deployed: https:\/\/booking\.example/);
});

test('a quarantined test reports the failed proof instead of a pass', () => {
  const note = buildSummary({ ...RUN, proof: { runs: 50, tests: [{ title: TITLE, passed: 33, failed: 17 }] }, quarantined: true });
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

test('a merge request is quarantined when its proof came from a later pipeline or its title says so', () => {
  assert.equal(quarantinedBy(MR, 0), false);
  assert.equal(quarantinedBy(MR, -1), false);
  assert.equal(quarantinedBy(MR, 1), true);
  assert.equal(quarantinedBy({ ...MR, title: `Quarantine recurring flaky test: ${TITLE} (pipeline 2936535281)` }, -1), true);
});

test('a recurring test quarantined without a fix names its earlier fixes', () => {
  const history = { fixes: ['!3', '!10', '!11'], recurring: true };
  const verdict = { runs: 10, tests: [{ title: TITLE, passed: 4, failed: 6, verdict: 'flaky', history }] };
  const note = buildSummary({ ...RUN, verdict, proof: null, quarantined: true });
  assert.match(note, /Proof: none, the test was fixed 3 times before \(!3, !10, !11\), so it was quarantined without another fix/);
});
