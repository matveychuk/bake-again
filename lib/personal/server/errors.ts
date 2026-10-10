import type { PersonalErrorCode } from '../contracts.ts';

export class PersonalError extends Error {
  readonly code: PersonalErrorCode;
  readonly status: number;
  constructor(code: PersonalErrorCode, status: number) {
    super(code);
    this.name = 'PersonalError';
    this.code = code;
    this.status = status;
  }
}
