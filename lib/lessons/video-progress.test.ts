import assert from 'node:assert/strict';
import test from 'node:test';
import { sanitizeAnalyticsPayload } from '../analytics/umami.ts';
import { updateVideoCoverage, type VideoCoverage } from './video-progress.ts';

const played = (...ranges: [number, number][]): TimeRanges => ({
  length: ranges.length,
  start: (i) => ranges[i][0],
  end: (i) => ranges[i][1],
});

void test('coverage ignores fast-forward and duplicates, joins source changes, and reaches 100 on end', () => {
  const coverage: VideoCoverage = { ranges: [], milestone: 0 };
  const record = (ranges: TimeRanges, duration = 40, ended = false) =>
    updateVideoCoverage(coverage, ranges, duration, ended).map(
      (p) => p.milestone,
    );
  assert.deepEqual(record(played([0, 10])), [10, 25]);
  assert.deepEqual(record(played([0, 10], [39, 40]), 40, true), []);
  assert.deepEqual(record(played([0, 10]), 40), []);
  assert.deepEqual(record(played([10, 30])), [50, 75]);
  assert.deepEqual(record(played([30, 40])), [90]);
  assert.deepEqual(record(played([30, 40]), 40, true), [100]);
  assert.deepEqual(record(played([0, 40]), 40, true), []);
});

void test('watch analytics preserves checkpoints, player, and allowlisted campaign only', () => {
  const event = {
    name: 'lesson_video_progress',
    url: 'https://bakeagain.com/uk/urok/napoleon?fbclid=private#hidden',
    data: {
      milestone: 25,
      watchedSeconds: 10,
      stepId: 's08-baked-layers',
      player: 'stream',
      startMode: 'autoplay',
      variant: 'krok8',
      orientation: 'vertical',
      src: 'fb-ad-napoleon-krok8',
      email: 'private',
      token: 'private',
    },
  };
  const result = sanitizeAnalyticsPayload('event', event);
  assert(result);
  assert.deepEqual(result.data, {
    milestone: 25,
    watchedSeconds: 10,
    stepId: 's08-baked-layers',
    player: 'stream',
    startMode: 'autoplay',
    variant: 'krok8',
    orientation: 'vertical',
    src: 'fb-ad-napoleon-krok8',
  });
  assert.equal(result.url, '/uk/urok/napoleon');
  assert.equal(
    sanitizeAnalyticsPayload('event', { ...event, url: '/uk' }),
    false,
  );
  for (const fields of [
    { milestone: 99 },
    { watchedSeconds: -1 },
    { watchedSeconds: 1.5 },
    { player: 'unknown' },
  ])
    assert.equal(
      sanitizeAnalyticsPayload('event', {
        ...event,
        data: { ...event.data, ...fields },
      }),
      false,
    );
});

void test('sound analytics is limited to step 8 and carries the original start mode', () => {
  const event = {
    name: 'lesson_video_unmute',
    url: '/uk/urok/napoleon',
    data: {
      stepId: 's08-baked-layers',
      orientation: 'wide',
      player: 'native',
      startMode: 'autoplay',
      variant: 'default',
      src: 'fb-ad-napoleon-krok8',
      volume: 0.9,
    },
  };
  const result = sanitizeAnalyticsPayload('event', event);
  assert(result);
  assert.deepEqual(result.data, {
    stepId: 's08-baked-layers',
    orientation: 'wide',
    player: 'native',
    startMode: 'autoplay',
    variant: 'default',
    src: 'fb-ad-napoleon-krok8',
  });
  assert.equal(
    sanitizeAnalyticsPayload('event', {
      ...event,
      data: { ...event.data, stepId: 's01-sour-cream-base' },
    }),
    false,
  );
});
