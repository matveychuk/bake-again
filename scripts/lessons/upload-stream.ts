import { createReadStream } from 'node:fs';
import { readFile, writeFile, readdir, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { Upload } from 'tus-js-client';
import {
  napoleonLesson,
  validStreamUid,
  type LessonMedia,
  type LessonVideo,
} from '../../content/commerce/lessons/napoleon.ts';
const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    prune: { type: 'boolean' },
    reviewed: { type: 'boolean' },
    final: { type: 'boolean' },
  },
});
const file = resolve('content/commerce/lessons/napoleon.media.json');
const historyFile = resolve(
  'content/commerce/lessons/napoleon.stream-history.json',
);
const account = process.env.CF_STREAM_ACCOUNT_ID;
const apiToken = process.env.CLOUDFLARE_STREAM_API_TOKEN;
if (!account || !/^[a-f0-9]{32}$/.test(account) || !apiToken)
  throw new Error('Set CF_STREAM_ACCOUNT_ID and CLOUDFLARE_STREAM_API_TOKEN');
const base = `https://api.cloudflare.com/client/v4/accounts/${account}/stream`;
const origins = [
  'bakeagain.com',
  ...(process.env.CF_STREAM_ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
];
async function api(path: string, method = 'GET', body?: unknown) {
  const r = await fetch(base + path, {
    method,
    headers: {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    signal: AbortSignal.timeout(30000),
  });
  if (!r.ok) throw new Error(`Stream HTTP ${r.status}`);
  const data = (await r.json()) as {
    success: boolean;
    result: {
      uid: string;
      duration: number;
      readyToStream: boolean;
      requireSignedURLs?: boolean;
      allowedOrigins?: string[];
      status?: { state?: string };
    };
  };
  if (!data.success) throw new Error('Stream request failed');
  return data.result;
}
const current = JSON.parse(await readFile(file, 'utf8')) as LessonMedia;
type History = { uid: string; replacedAt: string; deletedAt?: string }[];
let history: History;
try {
  history = JSON.parse(await readFile(historyFile, 'utf8')) as History;
} catch (e) {
  if ((e as NodeJS.ErrnoException).code !== 'ENOENT') throw e;
  history = [];
}
if (values.prune) {
  if (!values.reviewed || positionals.length)
    throw new Error(
      'Prune separately after checking new playback: --prune --reviewed',
    );
  const retained = new Set(
    Object.values(current).flatMap((s) => [s.uk.wide.uid, s.uk.vertical.uid]),
  );
  // Validate the current replacement before deleting any previously recorded lesson UID.
  for (const uid of retained) {
    const v = await api(`/${uid}`);
    if (!v.readyToStream) throw new Error('Replacement not ready');
  }
  if (!retained.size) throw new Error('No current manifest; refuse prune');
  for (const old of history.filter(
    (v) => !v.deletedAt && !retained.has(v.uid),
  )) {
    if (!validStreamUid(old.uid)) throw new Error('Invalid history UID');
    const r = await fetch(`${base}/${old.uid}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${apiToken}` },
      signal: AbortSignal.timeout(30000),
    });
    if (!r.ok && r.status !== 404)
      throw new Error(`Delete failed: ${r.status}`);
    old.deletedAt = new Date().toISOString();
    await writeFile(historyFile, JSON.stringify(history, null, 2) + '\n');
  }
  console.log('Recorded obsolete lesson videos pruned.');
} else {
  if (positionals.length !== 1)
    throw new Error(
      'Provide a folder of napoleon-uk-<stepId>-wide|vertical.mp4 files',
    );
  const folder = resolve(positionals[0]);
  const names = (await readdir(folder)).filter((n) => n.endsWith('.mp4'));
  const plans = new Map<string, { wide?: string; vertical?: string }>();
  for (const name of names) {
    const match = /^napoleon-uk-(s\d{2}-[a-z-]+)-(wide|vertical)\.mp4$/.exec(
      name,
    );
    if (!match || !napoleonLesson.steps.some((s) => s.stepId === match[1]))
      throw new Error(`Unexpected video filename: ${name}`);
    const entry = plans.get(match[1]) ?? {};
    entry[match[2] as 'wide' | 'vertical'] = resolve(folder, name);
    plans.set(match[1], entry);
  }
  if (!plans.size || [...plans.values()].some((p) => !p.wide || !p.vertical))
    throw new Error('Every supplied step needs both versions');
  const next = structuredClone(current);
  for (const [stepId, paths] of plans) {
    const step = napoleonLesson.steps.find((s) => s.stepId === stepId)!;
    const videos = {} as { wide: LessonVideo; vertical: LessonVideo };
    for (const orientation of ['wide', 'vertical'] as const) {
      const path = paths[orientation]!;
      const size = (await stat(path)).size;
      let uid = '';
      // TUS for all sizes: bounded 50 MiB chunks, including files over 200 MB.
      await new Promise<void>((resolveUpload, reject) => {
        const upload = new Upload(createReadStream(path), {
          endpoint: base,
          uploadSize: size,
          chunkSize: 50 * 1024 * 1024,
          headers: { Authorization: `Bearer ${apiToken}` },
          retryDelays: [0, 1000, 3000, 5000],
          metadata: {
            name: `napoleon-uk-${stepId}-${orientation}`,
            requireSignedURLs: step.free ? '' : 'true',
            allowedOrigins: origins.join(','),
          },
          onAfterResponse: (_request, response) => {
            const id = response.getHeader('stream-media-id');
            if (id) uid = id;
          },
          onError: () =>
            reject(new Error(`Upload failed: ${stepId} ${orientation}`)),
          onSuccess: () => {
            uid ||= upload.url?.split('/').at(-1) ?? '';
            resolveUpload();
          },
        });
        upload.start();
      });
      if (!validStreamUid(uid))
        throw new Error('Stream did not return a valid UID');
      console.log({ phase: 'uploaded', stepId, orientation, uid });
      await api(`/${uid}`, 'POST', {
        requireSignedURLs: !step.free,
        allowedOrigins: origins,
      });
      let v = await api(`/${uid}`);
      for (let i = 0; !v.readyToStream && i < 240; i++) {
        if (v.status?.state === 'error')
          throw new Error(`Encoding failed: ${uid}`);
        await new Promise((r) => setTimeout(r, 5000));
        v = await api(`/${uid}`);
      }
      if (
        !v.readyToStream ||
        !Number.isFinite(v.duration) ||
        v.duration <= 0 ||
        v.requireSignedURLs !== !step.free
      )
        throw new Error('Video readiness/privacy check failed');
      videos[orientation] = {
        provider: 'cloudflare-stream',
        uid,
        durationSec: v.duration,
      };
      console.log({ stepId, orientation, uid, durationSec: v.duration });
    }
    if (Math.abs(videos.wide.durationSec - videos.vertical.durationSec) > 0.5)
      throw new Error(
        `Duration mismatch: ${stepId}. Existing manifest preserved.`,
      );
    next[stepId] = {
      uk: { ...current[stepId]?.uk, ...videos },
      status: values.final ? 'final' : 'draft',
    };
  }
  const keep = new Set(
    Object.values(next).flatMap((s) => [s.uk.wide.uid, s.uk.vertical.uid]),
  );
  for (const s of Object.values(current))
    for (const v of [s.uk.wide, s.uk.vertical])
      if (!keep.has(v.uid) && !history.some((h) => h.uid === v.uid))
        history.push({ uid: v.uid, replacedAt: new Date().toISOString() });
  await writeFile(historyFile, JSON.stringify(history, null, 2) + '\n');
  await writeFile(file + '.tmp', JSON.stringify(next, null, 2) + '\n');
  const { rename } = await import('node:fs/promises');
  await rename(file + '.tmp', file);
  console.log(
    'Manifest updated. Check playback before a separate --prune --reviewed run.',
  );
}
