import type { AssistantErrorCode } from '../contracts.ts';

export class AssistantServiceError extends Error {
  readonly code: AssistantErrorCode;
  readonly httpStatus: number;
  readonly retryable: boolean;
  readonly retryAfterSeconds: number | null;

  constructor(
    code: AssistantErrorCode,
    httpStatus: number,
    retryable = false,
    retryAfterSeconds: number | null = null,
    options?: ErrorOptions,
  ) {
    super(code, options);
    this.name = 'AssistantServiceError';
    this.code = code;
    this.httpStatus = httpStatus;
    this.retryable = retryable;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}
