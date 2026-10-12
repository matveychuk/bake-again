/** Select only reviewed copy; never expose provider messages or credential data. */
export function passwordErrorKey(error: unknown) {
  if (!error || typeof error !== 'object') return 'error';
  const { code, name, status } = error as {
    code?: unknown;
    name?: unknown;
    status?: unknown;
  };
  if (code === 'same_password') return 'passwordUnchanged';
  if (code === 'weak_password') return 'passwordWeak';
  if (status === 429) return 'rateLimited';
  if (
    name === 'AuthSessionMissingError' ||
    code === 'session_not_found' ||
    code === 'session_expired' ||
    code === 'refresh_token_not_found' ||
    code === 'refresh_token_already_used' ||
    code === 'reauthentication_needed'
  )
    return 'passwordSessionExpired';
  if (name === 'AuthRetryableFetchError') return 'passwordConnectionError';
  return 'error';
}
