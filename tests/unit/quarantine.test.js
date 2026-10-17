import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { check, quarantinedTitles } from '../../tools/quarantine.mjs';

const RACE = 'two visitors book the same slot at the same time';
const issue = (title, expires, iid = 9) => ({ iid, title: `Quarantined: ${title} (pipeline 2944554222)`, description: `Expires: ${expires}\n\nCause: concurrency` });

test('only tests tagged @quarantine are listed, and one within its expiry date passes', () => {
  const dir = mkdtempSync(join(tmpdir(), 'quarantine-'));
  writeFileSync(join(dir, 'a.spec.ts'), `test('${RACE} @quarantine', async () => {});\ntest('late slot', async () => {});\n`);
  writeFileSync(join(dir, 'b.spec.ts'), "test(\"async confirmation @quarantine\", async () => {});\n");
  writeFileSync(join(dir, 'notes.txt'), `test('ignored @quarantine', async () => {});\n`);
  const titles = quarantinedTitles(dir);
  rmSync(dir, { recursive: true });
  assert.deepEqual(titles, [RACE, 'async confirmation']);
  assert.deepEqual(check([RACE], [issue(RACE, '2026-10-27')], '2026-10-16', 2), { expired: [], missing: [], over: false });
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
