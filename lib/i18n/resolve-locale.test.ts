import assert from 'node:assert/strict';
import test from 'node:test';
import {
  resolveLocaleFromAcceptLanguage,
  resolveLocaleFromBrowserLanguages,
} from './resolve-locale.ts';

void test('chooses the first supported Accept-Language entry by quality', () => {
  assert.equal(
    resolveLocaleFromAcceptLanguage('fr-CA, es-MX;q=0.9, uk-UA;q=0.8'),
    'es',
  );
});

void test('ignores unsupported and zero-quality language entries', () => {
  assert.equal(
    resolveLocaleFromAcceptLanguage('de;q=1, uk-UA;q=0, en-GB;q=0.5'),
    'en',
  );
});

void test('falls back to Ukrainian when no supported language is available', () => {
  assert.equal(resolveLocaleFromAcceptLanguage('pl-PL, de-DE;q=0.8'), 'uk');
});

void test('matches browser languages by their supported base language', () => {
  assert.equal(resolveLocaleFromBrowserLanguages(['fr-FR', 'uk-UA', 'en-US']), 'uk');
});
