import assert from 'node:assert/strict';
import test from 'node:test';
import { preparedAnswerExchange } from './prepared-answer.ts';

void test('a prepared answer makes no network request and seeds the next typed question without a Tested claim', () => {
  const original = globalThis.fetch;
  globalThis.fetch = () => { throw new Error('Prepared answers must not call AI'); };
  try {
    const answer = { id: 'eggs', question: 'When should I stop adding egg?', answer: 'When the dough falls slowly in a heavy ribbon.' };
    const result = preparedAnswerExchange(answer, []);
    assert.deepEqual(result.history, [{ role: 'user', text: answer.question }, { role: 'assistant', text: answer.answer }]);
    assert.deepEqual(result.blocks, [{ kind: 'explanation', text: answer.answer, status: null, references: [] }]);
  } finally { globalThis.fetch = original; }
});
