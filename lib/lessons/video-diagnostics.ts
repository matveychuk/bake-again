/** Only categories, never the full user agent, URL, token or exception text. */
export function isFacebookBrowser(userAgent: string) {
  return /FBAN|FB_IAB|FBAV|FBIOS/i.test(userAgent);
}

export const lessonVideoErrorCodes = [
  'playback_http',
  'playback_network',
  'playback_timeout',
  'hls_load',
  'hls_unsupported',
  'hls_network',
  'hls_media',
  'hls_other',
  'media_aborted',
  'media_network',
  'media_decode',
  'media_unsupported',
  'media_unknown',
  'play_not_allowed',
  'play_failed',
  'startup_timeout',
] as const;
export type LessonVideoErrorCode = (typeof lessonVideoErrorCodes)[number];
export type LessonVideoFailure = {
  errorCode: LessonVideoErrorCode;
  httpStatus?: number;
};

export function mediaErrorCode(code?: number): LessonVideoErrorCode {
  return (
    (
      {
        1: 'media_aborted',
        2: 'media_network',
        3: 'media_decode',
        4: 'media_unsupported',
      } as const
    )[code as 1 | 2 | 3 | 4] ?? 'media_unknown'
  );
}

export class PlaybackError extends Error {
  readonly diagnostic: LessonVideoFailure;
  constructor(message: string, diagnostic: LessonVideoFailure) {
    super(message);
    this.diagnostic = diagnostic;
  }
}

export function playbackFailure(error: unknown): LessonVideoFailure {
  if (error instanceof PlaybackError) return error.diagnostic;
  return {
    errorCode:
      error instanceof Error && error.name === 'TimeoutError'
        ? 'playback_timeout'
        : 'playback_network',
  };
}
