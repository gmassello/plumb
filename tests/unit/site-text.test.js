import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { TEXT, textFor } from '../../site/text.js';

test('English and Spanish have the same keys and no empty value', () => {
  assert.deepEqual(Object.keys(TEXT.es).sort(), Object.keys(TEXT.en).sort());
  for (const lang of ['en', 'es']) {
    for (const [key, value] of Object.entries(TEXT[lang])) assert.ok(value.trim(), `${lang}.${key} is empty`);
  }
});

test('every key the page uses exists in the copy', () => {
  const html = readFileSync(new URL('../../site/index.html', import.meta.url), 'utf8');
  const used = [...html.matchAll(/data-t(?:-alt|-label)?="([a-z0-9_]+)"/g)].map((m) => m[1]);
  assert.ok(used.length > 50);
  for (const key of used) assert.ok(key in TEXT.en, `${key} is missing`);
});

test('an unknown language falls back to English', () => {
  assert.equal(textFor('fr').hero_cta, TEXT.en.hero_cta);
  assert.equal(textFor('es').hero_cta, TEXT.es.hero_cta);
});
