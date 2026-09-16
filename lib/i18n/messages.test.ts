import assert from 'node:assert/strict';
import test from 'node:test';
import { getUiMessages } from './messages.ts';

void test('provides localized recipe scaling controls for every supported locale', () => {
  assert.equal(getUiMessages('en').scaling.title, 'Adjust recipe');
  assert.equal(getUiMessages('es').scaling.title, 'Ajustar receta');
  assert.equal(getUiMessages('uk').scaling.title, 'Змінити кількість');

  assert.equal(
    getUiMessages('es').scaling.availableIngredient('Harina Schär Mix B'),
    'Cantidad disponible de Harina Schär Mix B',
  );
  assert.equal(
    getUiMessages('uk').scaling.calculatedResult('0,5'),
    '0,5× від записаної бази. Якщо виходить дробова кількість яєць або інших цілих одиниць, перевірте її вручну.',
  );
});
