import assert from 'node:assert/strict';
import test from 'node:test';
import { appendAssistantExchange, compactAssistantText } from './assistant-history.ts';

void test('assistant history keeps only four short messages', () => {
  const history = appendAssistantExchange(
    [
      { role: 'user', text: 'one' },
      { role: 'assistant', text: 'two' },
      { role: 'user', text: 'three' },
      { role: 'assistant', text: 'four' },
    ],
    'five',
    'six',
  );
  assert.deepEqual(history.map(({ text }) => text), ['three', 'four', 'five', 'six']);
});

void test('assistant history normalizes whitespace and respects the API text bound', () => {
  const compact = compactAssistantText(`  hello\n\n${'x'.repeat(2000)}  `);
  assert.equal(compact.startsWith('hello x'), true);
  assert.equal(compact.length, 1500);
});
