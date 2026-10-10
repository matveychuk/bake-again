import type { PersonalResponseV1 } from '../contracts.ts';
import { isPersonalKey, isPersonalKind } from '../validation.ts';
import { PersonalError } from './errors.ts';
import {
  isVerifiedIdentityShape,
  type PersonalAuthenticator,
} from './identity.ts';
import type { PersonalRepository } from './repository.ts';

export function createPersonalRecordHandler(deps: {
  auth: PersonalAuthenticator;
  repository: () => Promise<PersonalRepository>;
}) {
  return async (request: Request): Promise<Response> => {
    const requestId = crypto.randomUUID(); // Do not reflect caller-controlled log IDs.
    const headers: Record<string, string> = {
      'cache-control': 'private, no-store',
      vary: 'Cookie, Authorization',
      'content-type': 'application/json; charset=utf-8',
      'x-content-type-options': 'nosniff',
    };
    const respond = (body: PersonalResponseV1, status: number) =>
      new Response(JSON.stringify(body), { status, headers });
    try {
      if (request.method !== 'GET') {
        headers.allow = 'GET';
        throw new PersonalError('METHOD_NOT_ALLOWED', 405);
      }
      const identity = await deps.auth.authenticate(request);
      if (identity === null) throw new PersonalError('AUTH_REQUIRED', 401);
      if (!isVerifiedIdentityShape(identity))
        throw new PersonalError('SERVICE_UNAVAILABLE', 503);
      const query = new URL(request.url).searchParams;
      if (
        [...query.keys()].some((k) => k !== 'kind' && k !== 'key') ||
        query.getAll('kind').length !== 1 ||
        query.getAll('key').length !== 1
      )
        throw new PersonalError('INVALID_REQUEST', 400);
      const kind = query.get('kind'),
        key = query.get('key');
      if (!isPersonalKind(kind) || !isPersonalKey(key))
        throw new PersonalError('INVALID_REQUEST', 400);
      const repo = await deps.repository();
      const accountId = await repo.resolveAccount(identity);
      if (!accountId) throw new PersonalError('ACCOUNT_UNAVAILABLE', 403);
      const record = await repo.readRecord(accountId, kind, key);
      if (!record) throw new PersonalError('NOT_FOUND', 404);
      return respond({ schemaVersion: 1, requestId, ok: true, record }, 200);
    } catch (error) {
      const known =
        error instanceof PersonalError
          ? error
          : new PersonalError('SERVICE_UNAVAILABLE', 503);
      // Never return/log raw provider/SQL errors, subjects, email or private payloads.
      return respond(
        {
          schemaVersion: 1,
          requestId,
          ok: false,
          error: {
            code: known.code,
            retryable: known.code === 'SERVICE_UNAVAILABLE',
          },
        },
        known.status,
      );
    }
  };
}
