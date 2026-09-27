import type { PreparedStepAnswer } from '../../content/recipes/step-help.ts';
import type { AssistantBlock, AssistantRequestV1 } from '../../lib/assistant/contracts.ts';
import { appendAssistantExchange } from './assistant-history.ts';

/** No provider, fetch, calculation, evidence badge or action proposal on this path. */
export function preparedAnswerExchange(answer: PreparedStepAnswer, history: AssistantRequestV1['history']) {
  const blocks: AssistantBlock[] = [{ kind: 'explanation', text: answer.answer, status: null, references: [] }];
  return { blocks, history: appendAssistantExchange(history, answer.question, answer.answer) };
}
