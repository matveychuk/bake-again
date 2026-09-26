import assert from 'node:assert/strict';
import test from 'node:test';
import { softenButter } from '../techniques/soften-butter.ts';

void test('keeps the butter-softening guide concise and source-free', () => {
  for (const technique of Object.values(softenButter)) {
    assert.equal('provenance' in technique, false);
    assert.equal('source' in technique, false);
    assert.match(technique.equipment, /glass|ceramic|склян|кераміч|vidrio/i);
    assert.match(
      technique.steps.map(([, body]) => body).join(' '),
      /cube|кубик|dado/i,
    );
  }
});
