/** Local previews are allowed only in a development build on a loopback host. */
export function isLocalDevelopment(host: string | null, environment: string | undefined): boolean {
  if (environment !== 'development' || !host) return false;
  // An exact allowlist also rejects forwarded hosts, userinfo and malformed ports.
  return /^(localhost|127\.0\.0\.1|\[::1\])(?::\d{1,5})?$/i.test(host);
}
