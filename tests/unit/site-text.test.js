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

test('the page ships the English copy before the script runs', () => {
  const html = readFileSync(new URL('../../site/index.html', import.meta.url), 'utf8');
  const unescape = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&amp;/g, '&');
  const elements = [...html.matchAll(/data-t="([a-z0-9_]+)"[^>]*>([^<]*)</g)];
  assert.equal(elements.length, [...html.matchAll(/data-t="/g)].length);
  for (const [, key, text] of elements) assert.equal(unescape(text), TEXT.en[key], `${key} differs from TEXT.en`);
  for (const [, key, value] of html.matchAll(/data-t-(?:alt|label)="([a-z0-9_]+)"[^>]*?(?:alt|aria-label)="([^"]*)"/g)) {
    assert.equal(unescape(value), TEXT.en[key], `${key} differs from TEXT.en`);
  }
});

test('an unknown language falls back to English', () => {
  assert.equal(textFor('fr').hero_cta, TEXT.en.hero_cta);
  assert.equal(textFor('es').hero_cta, TEXT.es.hero_cta);
});
