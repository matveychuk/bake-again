import { LessonError } from './payhip.ts';
import {
  validStreamUid,
  type LessonVideo,
} from '../../content/commerce/lessons/napoleon.ts';
const encode = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
const json64 = (v: unknown) =>
  encode(new TextEncoder().encode(JSON.stringify(v)));
export async function streamToken(
  uid: string,
  keyId: string,
  jwk: JsonWebKey,
  now = Math.floor(Date.now() / 1000),
) {
  if (!validStreamUid(uid) || !keyId) throw new LessonError(503);
  const header = json64({ alg: 'RS256', kid: keyId });
  const payload = json64({
    sub: uid,
    kid: keyId,
    exp: now + 14400,
    nbf: now - 30,
    downloadable: false,
  });
  const key = await crypto.subtle.importKey(
    'jwk',
    jwk,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const data = `${header}.${payload}`;
  return `${data}.${encode(new Uint8Array(await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(data))))}`;
}
export async function videoPlayback(
  video: LessonVideo,
  free: boolean,
  bindings: Record<string, unknown>,
) {
  if (!validStreamUid(video.uid)) throw new LessonError(503);
  let id = video.uid;
  if (!free) {
    if (
      typeof bindings.CF_STREAM_SIGNING_KEY_ID !== 'string' ||
      typeof bindings.CF_STREAM_SIGNING_KEY_JWK !== 'string'
    )
      throw new LessonError(503);
    // Cloudflare returns its JWK base64-encoded; also accept JSON for dashboard entry.
    const raw = bindings.CF_STREAM_SIGNING_KEY_JWK;
    id = await streamToken(
      id,
      bindings.CF_STREAM_SIGNING_KEY_ID,
      JSON.parse(raw.startsWith('{') ? raw : atob(raw)),
    );
  }
  const base = `https://videodelivery.net/${id}`;
  return {
    hls: `${base}/manifest/video.m3u8`,
    dash: `${base}/manifest/video.mpd`,
    thumbnail: `${base}/thumbnails/thumbnail.jpg`,
  };
}
