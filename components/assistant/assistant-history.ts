import type { AssistantRequestV1 } from '@/lib/assistant/contracts';
import {
  ASSISTANT_MAX_HISTORY_MESSAGE_CHARACTERS,
  ASSISTANT_MAX_HISTORY_MESSAGES,
} from '../../lib/assistant/limits.ts';

export const ASSISTANT_HISTORY_LIMIT = ASSISTANT_MAX_HISTORY_MESSAGES;
export const ASSISTANT_HISTORY_TEXT_LIMIT =
  ASSISTANT_MAX_HISTORY_MESSAGE_CHARACTERS;

export function compactAssistantText(text: string) {
  return text
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, ASSISTANT_HISTORY_TEXT_LIMIT);
}

export function appendAssistantExchange(
  history: AssistantRequestV1['history'],
  question: string,
  answer: string,
): AssistantRequestV1['history'] {
  return [
    ...history,
    { role: 'user' as const, text: compactAssistantText(question) },
    { role: 'assistant' as const, text: compactAssistantText(answer) },
  ]
    .filter((message) => message.text.length > 0)
    .slice(-ASSISTANT_HISTORY_LIMIT);
}
