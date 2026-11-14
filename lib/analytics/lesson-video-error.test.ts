import assert from 'node:assert/strict';
import test from 'node:test';
import { sanitizeAnalyticsPayload } from './umami.ts';
import {
  isFacebookBrowser,
  mediaErrorCode,
  PlaybackError,
  playbackFailure,
} from '../lessons/video-diagnostics.ts';
import {
  lessonStepSummaries,
  napoleonLesson,
} from '../../content/commerce/lessons/napoleon.ts';

void test('video diagnostics keep reviewed codes and campaign only, never raw exception/UA/URL', () => {
  const event = {
    name: 'lesson_video_error',
    url: '/uk/urok/napoleon?fbclid=private&token=secret#secret',
    data: {
      stepId: 's08-baked-layers',
      orientation: 'vertical',
      errorCode: 'hls_network',
      httpStatus: 403,
      isFacebook: true,
      fallback: 'stream',
      src: 'fb-ad-napoleon-krok8',
      userAgent: 'private',
      message: 'secret',
      token: 'secret',
      mediaUrl: 'secret',
    },
  };
  const result = sanitizeAnalyticsPayload('event', event);
  assert(result);
  assert.deepEqual(result.data, {
    stepId: 's08-baked-layers',
    orientation: 'vertical',
    errorCode: 'hls_network',
    httpStatus: 403,
    isFacebook: true,
    fallback: 'stream',
    src: 'fb-ad-napoleon-krok8',
  });
  assert(!/private|secret|fbclid/.test(JSON.stringify(result)));
  assert.equal(
    sanitizeAnalyticsPayload('event', { ...event, url: '/uk' }),
    false,
  );
  assert.equal(
    sanitizeAnalyticsPayload('event', {
      ...event,
      data: { ...event.data, errorCode: 'https://private' },
    }),
    false,
  );
  const withoutStatus = sanitizeAnalyticsPayload('event', {
    ...event,
    data: { ...event.data, httpStatus: 0, isFacebook: false, src: 'private' },
  });
  assert(withoutStatus);
  assert.equal(
    (withoutStatus.data as Record<string, unknown>).isFacebook,
    false,
  );
  assert.equal(
    (withoutStatus.data as Record<string, unknown>).httpStatus,
    undefined,
  );
  assert.equal((withoutStatus.data as Record<string, unknown>).src, undefined);
});

void test('Facebook WebView detection and native/API failure categories', () => {
  for (const suffix of ['[FBAN/FB4A;FBAV/490]', '[FB_IAB/FB4A;]', 'FBIOS'])
    assert(isFacebookBrowser(`Mozilla/5.0 ${suffix}`));
  assert(!isFacebookBrowser('Mozilla/5.0 Chrome/130 Safari/537.36'));
  assert.equal(mediaErrorCode(3), 'media_decode');
  assert.equal(mediaErrorCode(4), 'media_unsupported');
  assert.equal(mediaErrorCode(999), 'media_unknown');
  assert.deepEqual(
    playbackFailure(
      new PlaybackError('Do not send this', {
        errorCode: 'playback_http',
        httpStatus: 503,
      }),
    ),
    { errorCode: 'playback_http', httpStatus: 503 },
  );
  assert.deepEqual(
    playbackFailure(new DOMException('private URL', 'TimeoutError')),
    { errorCode: 'playback_timeout' },
  );
});

void test('only free step has an API-independent fallback; private IDs stay server-side', () => {
  const summaries = lessonStepSummaries();
  assert.deepEqual(
    summaries.filter((s) => s.fallback).map((s) => s.stepId),
    ['s08-baked-layers'],
  );
  for (const step of napoleonLesson.steps.filter((s) => !s.free)) {
    assert(!JSON.stringify(summaries).includes(step.videos.uk!.wide.uid));
    assert(!JSON.stringify(summaries).includes(step.videos.uk!.vertical.uid));
  }
});
