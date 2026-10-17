import { test } from 'node:test';
import assert from 'node:assert/strict';
import { check, quarantinedTitles } from '../../tools/quarantine.mjs';

const RACE = 'two visitors book the same slot at the same time';
const issue = (title, expires, iid = 9) => ({ iid, title: `Quarantined: ${title} (pipeline 2944554222)`, description: `Expires: ${expires}\n\nCause: concurrency` });

test('the repo quarantines the race test, within its expiry date', () => {
  const titles = quarantinedTitles();
  assert.deepEqual(titles, [RACE]);
  assert.deepEqual(check(titles, [issue(RACE, '2026-10-27')], '2026-10-16', 2), { expired: [], missing: [], over: false });
});

test('a quarantine is expired on its expiry date and after it', () => {
  assert.deepEqual(check([RACE], [issue(RACE, '2026-10-27')], '2026-10-27', 2).expired, [{ title: RACE, iid: 9, expires: '2026-10-27' }]);
  assert.equal(check([RACE], [issue(RACE, '2026-10-27')], '2026-10-28', 2).expired.length, 1);
});

test('a quarantined test without its issue is missing', () => {
  assert.deepEqual(check(['late slot'], [issue(RACE, '2026-10-27')], '2026-10-16', 2).missing, ['late slot']);
});

test('more quarantined tests than the cap is over', () => {
  const titles = ['a', 'b', 'c'];
  const r = check(titles, titles.map((t, i) => issue(t, '2026-12-01', i)), '2026-10-16', 2);
  assert.equal(r.over, true);
  assert.deepEqual([r.expired, r.missing], [[], []]);
});
