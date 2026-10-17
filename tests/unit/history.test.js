import { test } from 'node:test';
import assert from 'node:assert/strict';
import { historyOf, RECURRING_FIXES } from '../../tools/history.mjs';

const TITLE = 'async confirmation';
const mr = (iid, title, state = 'merged') => ({ iid, title, state });
const issue = (iid, title) => ({ iid, title });

test('merged fixes and earlier issues of the test are listed in order', () => {
  const h = historyOf(
    TITLE,
    [mr(11, `Fix flaky test: ${TITLE} (pipeline 2)`), mr(3, `Fix flaky test: ${TITLE} (pipeline 1)`)],
    [issue(10, `Real regression: ${TITLE} (pipeline 3)`), issue(9, `Quarantined: ${TITLE} (pipeline 4)`)],
  );
  assert.deepEqual(h, { fixes: ['!3', '!11'], updates: [], quarantines: ['#9'], regressions: ['#10'], environment: [], recurring: true });
});

test('a test whose title only contains another one is not mixed up', () => {
  const h = historyOf(TITLE, [mr(1, `Fix flaky test: ${TITLE} after reload (pipeline 1)`), mr(2, `Fix flaky test: slow ${TITLE} (pipeline 2)`)], []);
  assert.deepEqual(h.fixes, []);
});

test(`a test becomes recurring at ${RECURRING_FIXES} merged fixes`, () => {
  const fixes = (n) => Array.from({ length: n }, (_, i) => mr(i + 1, `Fix flaky test: ${TITLE} (pipeline ${i})`));
  assert.equal(historyOf(TITLE, fixes(RECURRING_FIXES - 1), []).recurring, false);
  assert.equal(historyOf(TITLE, fixes(RECURRING_FIXES), []).recurring, true);
});

test('a fix merge request that ended in quarantine does not count as a fix', () => {
  const h = historyOf(
    TITLE,
    [mr(9, `Fix flaky test: ${TITLE} (pipeline 4)`), mr(20, `Fix flaky test: ${TITLE} (pipeline 7)`)],
    [issue(9, `Quarantined: ${TITLE} (pipeline 4)`)],
  );
  assert.deepEqual([h.fixes, h.quarantines, h.recurring], [['!20'], ['#9'], false]);
});

test('update merge requests and unmerged fixes do not count as fixes', () => {
  const h = historyOf(
    TITLE,
    [mr(6, `Update test after app change: ${TITLE} (pipeline 1)`), mr(8, `Fix flaky test: ${TITLE} (pipeline 2)`, 'closed'), mr(9, `Fix flaky test: ${TITLE} (pipeline 3)`)],
    [],
  );
  assert.deepEqual([h.fixes, h.updates, h.recurring], [['!9'], ['!6'], false]);
});
