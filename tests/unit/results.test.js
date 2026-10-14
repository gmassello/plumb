import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { buildResults, causeOf, pipelineOf } from '../../tools/results.mjs';

const verdict = (title, passed, v) => ({ runs: 10, tests: [{ title, passed, verdict: v }] });
const pipeline = (id, v, extra = {}) => ({ id, verdict: v, causes: ['async-wait'], items: [], proof: null, ...extra });
const RUN = { sessions: [], updateMerges: 0, generatedAt: '2026-10-14' };

test('three recorded pipelines are listed with id, test, pass rate and verdict', () => {
  const md = buildResults({
    ...RUN,
    pipelines: [
      pipeline(1, verdict('async confirmation', 3, 'flaky'), {
        items: [{ ref: '!10', web_url: 'u', state: 'merged' }],
        proof: { runs: 50, tests: [{ passed: 50 }] },
      }),
      pipeline(2, verdict('two visitors', 6, 'flaky')),
      pipeline(3, verdict('late slot', 0, 'real')),
    ],
  });
  assert.match(md, /\[1\]\(.*\/pipelines\/1\) \| `async confirmation` 3\/10 flaky \| 1 \| async-wait \| \[!10\]\(u\) merged \| 50\/50 \|/);
  assert.match(md, /`two visitors` 6\/10 flaky/);
  assert.match(md, /`late slot` 0\/10 real/);
});

test('QA-06 lists each run with the expected and chosen cause and the right total', () => {
  const sessions = [
    ...[1, 2, 3].map((i) => ({ id: i, pipeline: 2940411157, cause: 'regression' })),
    ...[4, 5, 6].map((i) => ({ id: i, pipeline: 2944325042, cause: 'environment' })),
    ...[7, 8, 9].map((i) => ({ id: i, pipeline: 2944391258, cause: 'app-change' })),
    { id: 10, pipeline: 2944438629, cause: 'test-data' },
    { id: 11, pipeline: 2944438629, cause: 'test-data' },
    { id: 12, pipeline: 2944438629, cause: 'regression' },
    { id: 13, pipeline: 2948453748, cause: 'async-wait' },
  ];
  const md = buildResults({ ...RUN, pipelines: [], sessions });
  assert.match(md, /\| 12 \| 2944438629 \| test-data \| regression \| \*\*no\*\* \|/);
  assert.match(md, /Right cause: \*\*11\/12\*\*/);
  assert.doesNotMatch(md, /\| 13 \| 2948453748/);
});

test('a pipeline whose artifacts expired is listed, not dropped', () => {
  const md = buildResults({ ...RUN, pipelines: [pipeline(7, null)] });
  assert.match(md, /\[7\]\(.*\) \| artifacts expired \|/);
});

test('the pipeline id and the cause are read from the payload and the final answer', () => {
  assert.equal(pipelineOf('{"object_kind":"pipeline","object_attributes":{"id":2944325042,"iid":52}}'), 2944325042);
  assert.equal(pipelineOf('no payload'), null);
  assert.equal(causeOf('Cause: environment\n\nCreated issue #8'), 'environment');
  assert.equal(causeOf('Cause: async-wait · quarantined'), 'async-wait');
  assert.equal(causeOf('I opened an issue'), null);
});

test('without glab the script exits non-zero and writes nothing', () => {
  const run = spawnSync(process.execPath, ['tools/results.mjs'], { env: { PATH: '' }, encoding: 'utf8' });
  assert.equal(run.status, 1);
  assert.match(run.stderr, /glab is not installed\. Nothing written\./);
});
