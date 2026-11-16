'use client';
/* oxlint-disable next/no-img-element -- source image is prepared WebP through media:prepare */
/* oxlint-disable jsx-a11y/media-has-caption -- silent draft clips; captions track is rendered when narration captions exist in manifest */
/* oxlint-disable react/react-compiler -- synchronizes media query, local progress and asynchronous playback sources with external browser state */
import {
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import type Hls from 'hls.js';
import { LockKeyhole, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StepMarker } from '@/components/ui/step-marker';
import { LessonHighlights } from './lesson-highlights';
import { LessonSoundButton } from './lesson-sound-button';
import { LessonStreamFallback } from './lesson-stream-fallback';
import { useLessonVariant } from './lesson-variant';
import {
  updateVideoCoverage,
  type VideoCoverage,
  type VideoPlayer,
  type VideoStartMode,
} from '@/lib/lessons/video-progress';
import { trackEvent } from '@/lib/analytics/umami';
import {
  isFacebookBrowser,
  mediaErrorCode,
  PlaybackError,
  playbackFailure,
  type LessonVideoFailure,
} from '@/lib/lessons/video-diagnostics';
import styles from './lesson.module.css';
export type StepSummary = {
  stepId: string;
  n: number;
  title: string;
  durationSec: number;
  free: boolean;
  status: 'draft' | 'final';
  posters?: { wide?: string; vertical?: string };
  fallback?: { wide: string; vertical: string };
};
type Source = { hls: string; dash: string; thumbnail: string };
type Playback = {
  wide: Source;
  vertical: Source;
  expiresAt: number;
  captionsVtt?: string;
};
type Progress = { stepId: string; time: number; watched: string[] };
const key = 'ba:lesson:napoleon:progress:v1';
const stamp = (s: number) =>
  `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const portraitQuery = '(orientation: portrait) and (max-width: 699px)';
const fallbackPoster =
  '/media/recipes/gluten-free-napoleon/lesson-banner-2026-10-31/napoleon-banner-poster-crop-360x450.webp';
async function enterFullscreen(video: HTMLVideoElement | null) {
  if (!video) return;
  try {
    if (video.requestFullscreen) await video.requestFullscreen();
    else
      (
        video as HTMLVideoElement & { webkitEnterFullscreen?: () => void }
      ).webkitEnterFullscreen?.();
  } catch {
    /* Automatic fullscreen is optional; native controls remain available. */
  }
}

export function LessonPlayer({
  steps,
  access,
  preview = false,
  autoplayPreview = false,
  previewSoundControl = false,
  previewWatchedStepId,
  previewFinished = false,
  previewBrowserHelp = false,
  purchaseAction,
  inlinePurchase,
  hideSteps = false,
  replayHeading,
  afterVideo,
}: {
  steps: StepSummary[];
  access: boolean;
  preview?: boolean;
  autoplayPreview?: boolean;
  previewSoundControl?: boolean;
  previewWatchedStepId?: string;
  previewFinished?: boolean;
  previewBrowserHelp?: boolean;
  /** Offer on the end screen after the free step. */
  purchaseAction?: ReactNode;
  /** Offer under the free-step video. */
  inlinePurchase?: ReactNode;
  /** The step overview is rendered elsewhere on the page. */
  hideSteps?: boolean;
  /** Visible heading above the free-step video. */
  replayHeading?: string;
  afterVideo?: ReactNode;
}) {
  const free = steps.find((s) => s.free)!;
  const [index, setIndex] = useState(access ? 0 : steps.indexOf(free));
  const variant = useLessonVariant();
  const [autoplayVisible, setAutoplayVisible] = useState(false);
  const autoplayTried = useRef(false);
  const manualPlay = useRef(false);
  const [nativeMuted, setNativeMuted] = useState(false);
  const previousMute = useRef<boolean | undefined>(undefined);
  const startMode = useRef<VideoStartMode>('manual');
  const playMetrics = useRef(
    new Map<
      string,
      { startMode: VideoStartMode; coverage: VideoCoverage; unmuted: boolean }
    >(),
  );
  const [orientation, setOrientation] = useState<'wide' | 'vertical'>('wide');
  const [playback, setPlayback] = useState<Playback | null>(null);
  const [error, setError] = useState('');
  const [facebook, setFacebook] = useState(false);
  const [fallbackStep, setFallbackStep] = useState<string | null>(null);
  const recoveryStarted = useRef(false);
  const startupTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const sourceFailure = useRef<(failure: LessonVideoFailure) => void>(
    () => undefined,
  );
  const [continuous, setContinuous] = useState(access);
  const [resume, setResume] = useState<Progress | null>(null);
  const [watched, setWatched] = useState<string[]>([]);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const frame = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const posterButton = useRef<HTMLButtonElement>(null);
  const cache = useRef(new Map<string, Playback>());
  const pendingSeek = useRef({ time: 0, play: false });
  const activeId = useRef('');
  const completed = useRef(new Set<string>());
  const retryCount = useRef(0);
  const step = steps[index];
  const poster =
    step.posters?.[orientation] ?? playback?.[orientation].thumbnail;
  const fallbackUrl =
    fallbackStep === step.stepId && step.free
      ? step.fallback?.[orientation]
      : undefined;
  const mayAutoplay =
    autoplayVisible && autoplayPreview && step.free && !access && !preview;
  const introPoster =
    !fallbackUrl && !access && !preview && !started && !error
      ? step.posters?.wide
      : undefined;
  const previewStepsId = useId();
  const stepsId = preview ? previewStepsId : 'lesson-steps';
  const showFreeOffer = !access && step.free && Boolean(purchaseAction);
  const showEndScreen =
    showFreeOffer && (finished || (preview && previewFinished));
  const clearStartupTimer = useCallback(() => {
    clearTimeout(startupTimer.current);
    startupTimer.current = undefined;
  }, []);
  const reportFailure = useCallback(
    (failure: LessonVideoFailure) => {
      if (preview) return;
      trackEvent('lesson_video_error', {
        ...failure,
        stepId: step.stepId,
        orientation,
        isFacebook: isFacebookBrowser(navigator.userAgent),
        fallback: step.free && step.fallback ? 'stream' : 'none',
      });
    },
    [orientation, preview, step],
  );
  const activateFallback = useCallback(
    (failure: LessonVideoFailure) => {
      if (recoveryStarted.current) return;
      recoveryStarted.current = true;
      clearStartupTimer();
      reportFailure(failure);
      if (step.free && step.fallback) {
        video.current?.pause();
        setFinished(false);
        setError('');
        setFallbackStep(step.stepId);
      } else {
        setError('Не вдалося відтворити відео. Спробуй ще раз.');
      }
    },
    [clearStartupTimer, reportFailure, step],
  );
  function waitForPlayback() {
    clearStartupTimer();
    startupTimer.current = setTimeout(
      () => sourceFailure.current({ errorCode: 'startup_timeout' }),
      15000,
    );
  }
  useEffect(() => {
    setFacebook(isFacebookBrowser(navigator.userAgent));
    return clearStartupTimer;
  }, [clearStartupTimer]);
  const open = useCallback(
    (i: number, autoplay = false, time = 0) => {
      if (i < 0 || i >= steps.length || (!access && !steps[i].free)) return;
      if (!autoplay) video.current?.pause();
      if (autoplay) startMode.current = 'continuous';
      else if (activeId.current !== steps[i].stepId)
        startMode.current = 'manual';
      pendingSeek.current = { time, play: autoplay };
      retryCount.current = 0;
      recoveryStarted.current = false;
      clearStartupTimer();
      setFallbackStep(null);
      setIndex(i);
      setError('');
      setFinished(false);
      if (!preview) history.replaceState(null, '', `#${steps[i].stepId}`);
      // Explicit repeat of the current step still seeks correctly.
      if (video.current && activeId.current === steps[i].stepId) {
        video.current.currentTime = time;
        if (autoplay) void video.current.play().catch(() => undefined);
      }
    },
    [access, clearStartupTimer, preview, steps],
  );
  useEffect(() => {
    const media = matchMedia(portraitQuery);
    setOrientation(media.matches ? 'vertical' : 'wide');
    const change = () => {
      pendingSeek.current = {
        time: video.current?.currentTime ?? 0,
        play: !!video.current && !video.current.paused,
      };
      setOrientation(media.matches ? 'vertical' : 'wide');
      if (!preview) trackEvent('lesson_orientation_switch');
      if (
        !media.matches &&
        matchMedia('(orientation: landscape) and (max-width: 999px)').matches &&
        video.current &&
        !video.current.paused
      )
        void enterFullscreen(video.current);
    };
    media.addEventListener('change', change);
    const hashChange = () => {
      const i = steps.findIndex((s) => `#${s.stepId}` === location.hash);
      if (i < 0) return;
      open(i);
      if (steps[i].free) frame.current?.scrollIntoView({ block: 'start' });
    };
    hashChange();
    window.addEventListener('hashchange', hashChange);
    if (access && !preview)
      try {
        const saved = JSON.parse(
          localStorage.getItem(key) ?? 'null',
        ) as Progress | null;
        if (
          saved &&
          steps.some((s) => s.stepId === saved.stepId) &&
          Number.isFinite(saved.time) &&
          saved.time >= 0 &&
          Array.isArray(saved.watched)
        ) {
          saved.watched = saved.watched.filter((id) =>
            steps.some((s) => s.stepId === id),
          );
          setWatched(saved.watched);
          completed.current = new Set(saved.watched);
          if (!location.hash) setResume(saved);
        }
      } catch {
        /* Progress is optional. */
      }
    return () => {
      media.removeEventListener('change', change);
      window.removeEventListener('hashchange', hashChange);
    };
  }, [access, open, preview, steps]);
  const fetchPlayback = useCallback(async (id: string, force = false) => {
    const cached = cache.current.get(id);
    if (!force && cached && cached.expiresAt > Date.now() + 60000)
      return cached;
    const response = await fetch(
      `/api/lessons/napoleon/playback?step=${encodeURIComponent(id)}`,
      { cache: 'no-store', signal: AbortSignal.timeout(12000) },
    );
    if (!response.ok)
      throw new PlaybackError(
        response.status === 401 || response.status === 403
          ? 'Увійди за email покупки, щоб відкрити урок.'
          : 'Відео ще готується. Спробуй пізніше.',
        { errorCode: 'playback_http', httpStatus: response.status },
      );
    const data = (await response.json()) as Playback;
    cache.current.set(id, data);
    return data;
  }, []);
  useEffect(() => {
    if (preview) return;
    let cancelled = false;
    setPlayback(null);
    activeId.current = step.stepId;
    fetchPlayback(step.stepId)
      .then((data) => {
        if (!cancelled) setPlayback(data);
      })
      .catch((e) => {
        if (!cancelled) {
          activateFallback(playbackFailure(e));
        }
      });
    if (access && steps[index + 1])
      void fetchPlayback(steps[index + 1].stepId).catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [
    access,
    fetchPlayback,
    index,
    preview,
    step.stepId,
    steps,
    activateFallback,
  ]);
  useEffect(() => {
    const element = video.current;
    if (preview || fallbackUrl) return;
    let hls: Hls | undefined;
    let cancelled = false;
    let handlingFailure = false;
    const fail = async (failure: LessonVideoFailure) => {
      if (cancelled || handlingFailure) return;
      handlingFailure = true;
      clearStartupTimer();
      if (step.free || retryCount.current++ >= 1) {
        activateFallback(failure);
        return;
      }
      reportFailure(failure);
      pendingSeek.current = {
        time: element?.currentTime ?? 0,
        play: !!element && !element.paused,
      };
      try {
        const data = await fetchPlayback(step.stepId, true);
        if (!cancelled) setPlayback(data);
      } catch (reason) {
        if (!cancelled) activateFallback(playbackFailure(reason));
      }
    };
    sourceFailure.current = (failure) => {
      void fail(failure);
    };
    const restore = () => {
      if (!element) return;
      const { time, play } = pendingSeek.current;
      if (Number.isFinite(element.duration))
        element.currentTime = Math.min(
          time,
          Math.max(0, element.duration - 0.05),
        );
      if (play) {
        clearStartupTimer();
        startupTimer.current = setTimeout(() => {
          void fail({ errorCode: 'startup_timeout' });
        }, 15000);
      }
      if (play)
        void element.play().catch((reason: unknown) => {
          if (
            cancelled ||
            (reason instanceof Error && reason.name === 'AbortError')
          )
            return;
          void fail({
            errorCode:
              reason instanceof Error && reason.name === 'NotAllowedError'
                ? 'play_not_allowed'
                : 'play_failed',
          });
        });
    };
    element?.addEventListener('loadedmetadata', restore, { once: true });
    async function attach() {
      if (!element || !playback) return;
      const url = playback[orientation].hls;
      if (element.canPlayType('application/vnd.apple.mpegurl')) {
        element.src = url;
        element.load();
      } else {
        const { default: HlsPlayer } = await import('hls.js');
        if (cancelled) return;
        if (!HlsPlayer.isSupported()) {
          void fail({ errorCode: 'hls_unsupported' });
          return;
        }
        hls = new HlsPlayer();
        hls.on(HlsPlayer.Events.ERROR, (_, data) => {
          if (data.fatal)
            void fail({
              errorCode:
                data.type === HlsPlayer.ErrorTypes.NETWORK_ERROR
                  ? 'hls_network'
                  : data.type === HlsPlayer.ErrorTypes.MEDIA_ERROR
                    ? 'hls_media'
                    : 'hls_other',
              httpStatus: data.response?.code,
            });
        });
        hls.loadSource(url);
        hls.attachMedia(element);
      }
    }
    void attach().catch(() => {
      if (!cancelled) void fail({ errorCode: 'hls_load' });
    });
    return () => {
      cancelled = true;
      sourceFailure.current = () => undefined;
      element?.removeEventListener('loadedmetadata', restore);
      hls?.destroy();
      element?.removeAttribute('src');
      element?.load();
    };
  }, [
    clearStartupTimer,
    fallbackUrl,
    fetchPlayback,
    orientation,
    playback,
    preview,
    reportFailure,
    step,
    activateFallback,
  ]);
  useEffect(() => {
    if (
      !autoplayPreview ||
      access ||
      preview ||
      !frame.current ||
      !('IntersectionObserver' in window)
    )
      return;
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    const update = () =>
      setAutoplayVisible(visible && !document.hidden && !reducedMotion.matches);
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.intersectionRatio >= 0.5;
        update();
      },
      { threshold: 0.5 },
    );
    observer.observe(frame.current);
    document.addEventListener('visibilitychange', update);
    reducedMotion.addEventListener('change', update);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', update);
      reducedMotion.removeEventListener('change', update);
    };
  }, [access, autoplayPreview, preview]);
  useEffect(() => {
    const element = video.current;
    if (!mayAutoplay || !playback || fallbackUrl || !element || error) return;
    let cancelled = false;
    const start = () => {
      if (autoplayTried.current || manualPlay.current || !element.paused)
        return;
      autoplayTried.current = true;
      startMode.current = 'autoplay';
      element.muted = true;
      void element.play().catch((reason: unknown) => {
        if (cancelled || manualPlay.current) return;
        if (reason instanceof Error && reason.name === 'AbortError') {
          autoplayTried.current = false;
          return;
        }
        clearStartupTimer();
        if (reason instanceof Error && reason.name === 'NotAllowedError') {
          // Browser autoplay policy is expected. The poster remains a Play button.
          startMode.current = 'manual';
          element.muted = false;
          return;
        }
        sourceFailure.current({ errorCode: 'play_failed' });
      });
    };
    if (element.readyState >= HTMLMediaElement.HAVE_METADATA) start();
    else element.addEventListener('loadedmetadata', start, { once: true });
    return () => {
      cancelled = true;
      element.removeEventListener('loadedmetadata', start);
    };
  }, [
    clearStartupTimer,
    error,
    fallbackUrl,
    mayAutoplay,
    orientation,
    playback,
  ]);
  function recordPlaying(player: VideoPlayer, mode: VideoStartMode) {
    if (preview || playMetrics.current.has(step.stepId)) return;
    playMetrics.current.set(step.stepId, {
      startMode: mode,
      coverage: { ranges: [], milestone: 0 },
      unmuted: false,
    });
    trackEvent('lesson_step_play', {
      stepId: step.stepId,
      orientation,
      player,
      startMode: mode,
      variant,
    });
  }
  function recordUnmute(player: VideoPlayer) {
    const metrics = playMetrics.current.get(step.stepId);
    if (!metrics || metrics.unmuted || !step.free) return;
    metrics.unmuted = true;
    trackEvent('lesson_video_unmute', {
      stepId: step.stepId,
      orientation,
      player,
      startMode: metrics.startMode,
      variant,
    });
  }
  function recordProgress(
    played: TimeRanges,
    duration: number,
    player: VideoPlayer,
    ended: boolean,
  ) {
    const metrics = playMetrics.current.get(step.stepId);
    if (!metrics) return;
    for (const progress of updateVideoCoverage(
      metrics.coverage,
      played,
      duration,
      ended,
    )) {
      trackEvent('lesson_video_progress', {
        stepId: step.stepId,
        orientation,
        player,
        startMode: metrics.startMode,
        variant,
        ...progress,
      });
      if (progress.milestone === 90 && !completed.current.has(step.stepId)) {
        completed.current.add(step.stepId);
        setWatched([...completed.current]);
        trackEvent('lesson_step_complete', { stepId: step.stepId });
      }
    }
  }
  async function retry() {
    retryCount.current = 0;
    recoveryStarted.current = false;
    setFallbackStep(null);
    clearStartupTimer();
    setError('');
    pendingSeek.current = {
      time: video.current?.currentTime ?? 0,
      play: false,
    };
    try {
      setPlayback(await fetchPlayback(step.stepId, true));
    } catch (e) {
      activateFallback(playbackFailure(e));
    }
  }
  function saveProgress(ended = false) {
    const v = video.current;
    if (!v || !playback || activeId.current !== step.stepId) return;
    recordProgress(v.played, v.duration, 'native', ended);
    if (access && !preview)
      try {
        localStorage.setItem(
          key,
          JSON.stringify({
            stepId: step.stepId,
            time: v.currentTime,
            watched: [...completed.current],
          }),
        );
      } catch {
        /* Optional browser-only progress. */
      }
  }
  return (
    <div
      className={styles.workspace}
      data-free-preview={!access || undefined}
      data-single={hideSteps || undefined}
    >
      <div className={styles.view}>
        {replayHeading && (
          <h2 className={styles.replayTitle}>{replayHeading}</h2>
        )}
        {resume && (
          <div className={styles.notice}>
            <p>
              Продовжити з кроку{' '}
              {steps.find((s) => s.stepId === resume.stepId)?.n} (
              {stamp(resume.time)})?
            </p>
            <Button
              variant="outline"
              onClick={() => {
                open(
                  steps.findIndex((s) => s.stepId === resume.stepId),
                  false,
                  resume.time,
                );
                setResume(null);
              }}
            >
              Продовжити
            </Button>{' '}
            <Button variant="ghost" onClick={() => setResume(null)}>
              Почати спочатку
            </Button>
          </div>
        )}
        <div className={styles.frame} ref={frame}>
          <div className={styles.videoStage} data-lesson-controls>
            {fallbackUrl ? (
              <LessonStreamFallback
                key={fallbackUrl}
                url={fallbackUrl}
                title={`Крок ${step.n}. ${step.title} — резервний відеоплеєр`}
                autoplay={
                  mayAutoplay &&
                  !manualPlay.current &&
                  !playMetrics.current.has(step.stepId)
                }
                onPlaying={(automatic) =>
                  recordPlaying('stream', automatic ? 'autoplay' : 'manual')
                }
                onUnmute={() => recordUnmute('stream')}
                onProgress={(played, duration, ended) =>
                  recordProgress(played, duration, 'stream', ended)
                }
              />
            ) : preview || (!playback && error) ? (
              <img
                className={styles.placeholder}
                src={poster ?? fallbackPoster}
                alt={
                  poster && step.free
                    ? 'Готові шаруваті коржі Наполеона на тарілці'
                    : 'Шаруватий Наполеон без глютену, шматочок на виделці'
                }
              />
            ) : (
              <video
                className={styles.video}
                ref={video}
                controls={!showEndScreen && !introPoster}
                playsInline
                preload="metadata"
                aria-label={`${step.n}. ${step.title}`}
                aria-hidden={introPoster ? true : undefined}
                poster={poster ?? fallbackPoster}
                onPlay={() => {
                  waitForPlayback();
                  if (showFreeOffer) setFinished(false);
                }}
                onPlaying={(event) => {
                  if (!playback || activeId.current !== step.stepId) return;
                  recordPlaying('native', startMode.current);
                  clearStartupTimer();
                  if (access || !step.free) return;
                  const muted =
                    event.currentTarget.muted ||
                    event.currentTarget.volume === 0;
                  previousMute.current = muted;
                  setNativeMuted(muted);
                  setStarted(true);
                  if (document.activeElement === posterButton.current) {
                    requestAnimationFrame(() =>
                      video.current?.focus({ preventScroll: true }),
                    );
                  }
                }}
                onVolumeChange={(event) => {
                  if (access || !step.free || !started || fallbackUrl) return;
                  const muted =
                    event.currentTarget.muted ||
                    event.currentTarget.volume === 0;
                  if (previousMute.current && !muted) recordUnmute('native');
                  previousMute.current = muted;
                  setNativeMuted(muted);
                }}
                onTimeUpdate={() => saveProgress()}
                onWaiting={waitForPlayback}
                onPause={() => {
                  clearStartupTimer();
                  saveProgress();
                }}
                onError={() => {
                  if (video.current?.error && playback)
                    sourceFailure.current({
                      errorCode: mediaErrorCode(video.current.error.code),
                    });
                }}
                onEnded={() => {
                  saveProgress(true);
                  if (showFreeOffer) {
                    setFinished(true);
                    const element = video.current as
                      | (HTMLVideoElement & {
                          webkitDisplayingFullscreen?: boolean;
                          webkitExitFullscreen?: () => void;
                        })
                      | null;
                    if (document.fullscreenElement === element && element) {
                      void document.exitFullscreen().catch(() => undefined);
                    } else if (element?.webkitDisplayingFullscreen) {
                      element.webkitExitFullscreen?.();
                    }
                  }
                  if (continuous && access && index < steps.length - 1)
                    open(index + 1, true);
                }}
                onKeyDown={(event) => {
                  if (event.altKey || event.ctrlKey || event.metaKey) return;
                  const v = event.currentTarget;
                  if (event.key === ' ') {
                    event.preventDefault();
                    if (v.paused) void v.play().catch(() => undefined);
                    else v.pause();
                  }
                  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                    event.preventDefault();
                    v.currentTime = Math.max(
                      0,
                      Math.min(
                        v.duration || 0,
                        v.currentTime + (event.key === 'ArrowRight' ? 5 : -5),
                      ),
                    );
                  }
                  if (['n', 'N', 'p', 'P'].includes(event.key)) {
                    event.preventDefault();
                    open(index + (event.key.toLowerCase() === 'n' ? 1 : -1));
                  }
                }}
              >
                {playback?.captionsVtt && (
                  <track
                    key={playback.captionsVtt}
                    kind="captions"
                    srcLang="uk"
                    label="Українські"
                    src={playback.captionsVtt}
                    default
                  />
                )}
              </video>
            )}
            {introPoster && (
              <button
                ref={posterButton}
                type="button"
                className={styles.playPreview}
                aria-label={`Відтворити крок ${step.n}. ${step.title}`}
                onClick={() => {
                  const element = video.current;
                  if (!element) return;
                  manualPlay.current = true;
                  startMode.current = 'manual';
                  element.muted = false;
                  pendingSeek.current = { time: 0, play: true };
                  waitForPlayback();
                  void element.play().catch((reason: unknown) => {
                    if (
                      !element.currentSrc ||
                      (reason instanceof DOMException &&
                        reason.name === 'AbortError')
                    )
                      return;
                    pendingSeek.current.play = false;
                    sourceFailure.current({
                      errorCode:
                        reason instanceof Error &&
                        reason.name === 'NotAllowedError'
                          ? 'play_not_allowed'
                          : 'play_failed',
                    });
                  });
                }}
              >
                <picture>
                  {step.posters?.vertical && (
                    <source
                      media={portraitQuery}
                      srcSet={step.posters.vertical}
                    />
                  )}
                  <img
                    className={styles.placeholder}
                    src={introPoster}
                    alt="Готові шаруваті коржі Наполеона на тарілці"
                  />
                </picture>
                <span className={styles.playIcon}>
                  <Play size={24} fill="currentColor" aria-hidden="true" />
                </span>
              </button>
            )}
            {(previewSoundControl ||
              (!fallbackUrl &&
                !access &&
                started &&
                nativeMuted &&
                !showEndScreen &&
                !error)) && (
              <LessonSoundButton
                preview={previewSoundControl}
                onClick={() => {
                  const element = video.current;
                  if (!element) return;
                  element.muted = false;
                  if (element.volume === 0) element.volume = 1;
                  element.focus({ preventScroll: true });
                }}
              />
            )}
            {showEndScreen && (
              <div className={styles.endScreen}>
                <output className={styles.endMessage}>
                  <strong>
                    Це крок {step.n} з {steps.length}.
                  </strong>{' '}
                  У повному уроці покажу:
                </output>
                <LessonHighlights />
                <div className={styles.actions}>
                  {purchaseAction}
                  <Button
                    variant="secondary"
                    disabled={preview}
                    onClick={() => {
                      const element = video.current;
                      if (!element) return;
                      element.currentTime = 0;
                      void element.play().catch(() => setFinished(false));
                    }}
                  >
                    Дивитися ще раз
                  </Button>
                </div>
              </div>
            )}
          </div>
          <h2 className={access ? undefined : 'sr-only'}>
            {step.n}. {step.title}
          </h2>
          {step.status === 'draft' && access && (
            <p>Чорновий монтаж · без голосу</p>
          )}
        </div>
        {(facebook || previewBrowserHelp) && (
          <div className={styles.notice}>
            <p>
              Відкрито у Facebook. Якщо відео не запускається, натисни меню ⋮
              або ⋯ → «Відкрити в браузері» та вибери Chrome або Safari.
            </p>
          </div>
        )}
        {fallbackUrl && (
          <div className={styles.notice} aria-live="polite">
            <p>
              Увімкнули резервний плеєр. Якщо відео стоїть на паузі, натисни ▶.
              Якщо воно не запускається, відкрий цю сторінку у Chrome або
              Safari.
            </p>
            <Button variant="outline" onClick={() => void retry()}>
              Спробувати основний плеєр
            </Button>
          </div>
        )}
        {error && (
          <div aria-live="polite" className={styles.notice}>
            {error}{' '}
            <Button variant="outline" onClick={() => void retry()}>
              Спробувати ще раз
            </Button>
          </div>
        )}
        {showFreeOffer && inlinePurchase && (
          <div className={styles.previewPurchase}>{inlinePurchase}</div>
        )}
        {!access && afterVideo}
        {access && (
          <div className={styles.controls} data-lesson-controls>
            <Button
              variant="outline"
              disabled={index === 0}
              onClick={() => open(index - 1)}
            >
              ‹ Попередній
            </Button>
            <Button
              variant="outline"
              disabled={index === steps.length - 1}
              onClick={() => open(index + 1)}
            >
              Наступний ›
            </Button>
            <Button
              variant="outline"
              onClick={() => void enterFullscreen(video.current)}
            >
              На весь екран
            </Button>
            <Button
              variant="outline"
              aria-pressed={continuous}
              onClick={() => {
                setContinuous(!continuous);
              }}
            >
              {continuous
                ? 'Дивитися підряд: увімкнено'
                : 'Дивитися підряд: вимкнено'}
            </Button>
          </div>
        )}
        <noscript>
          <p>Для перегляду увімкни JavaScript.</p>
        </noscript>
      </div>
      {!hideSteps && (
        <section aria-labelledby={stepsId}>
          <h2 className={styles.stepsTitle} id={stepsId}>
            Що в уроці
          </h2>
          <ol className={styles.steps} data-lesson-controls>
            {steps.map((s, i) => {
              const current = i === index;
              const isWatched = preview
                ? previewWatchedStepId === s.stepId
                : watched.includes(s.stepId);
              const row = (
                <>
                  <StepMarker
                    number={s.n}
                    current={current}
                    completed={isWatched}
                    completedLabel="Переглянуто"
                  />
                  <span className={styles.stepTitle}>
                    {s.title}
                    {s.free && !access && <small> · безкоштовно</small>}
                  </span>
                  <span className={styles.meta}>
                    {stamp(Math.round(s.durationSec))}
                  </span>
                </>
              );
              return (
                <li
                  className={styles.step}
                  id={preview ? undefined : s.stepId}
                  key={s.stepId}
                >
                  {access || s.free ? (
                    <button
                      type="button"
                      aria-current={current ? 'step' : undefined}
                      onClick={() => {
                        open(i);
                        if (!access)
                          video.current?.scrollIntoView({
                            block: 'center',
                            behavior: 'smooth',
                          });
                      }}
                    >
                      {row}
                    </button>
                  ) : (
                    <div className={styles.locked}>
                      {row}
                      <LockKeyhole size={16} aria-label="Потрібен доступ" />
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </section>
      )}
    </div>
  );
}

/** Read-only step overview for the description page; the free step links to the player. */
export function LessonStepOverview({ steps }: { steps: StepSummary[] }) {
  // One overview per page; a fixed id avoids useId drift around server slots.
  const id = 'lesson-steps-overview';
  return (
    <section aria-labelledby={id}>
      <h2 className={styles.stepsTitle} id={id}>
        Що в уроці
      </h2>
      <ol className={styles.steps}>
        {steps.map((s) => {
          const row = (
            <>
              <StepMarker number={s.n} current={false} completed={false} />
              <span className={styles.stepTitle}>
                {s.title}
                {s.free && <small> · безкоштовно</small>}
              </span>
              <span className={styles.meta}>
                {stamp(Math.round(s.durationSec))}
              </span>
            </>
          );
          return (
            <li className={styles.step} key={s.stepId}>
              {s.free ? (
                <a
                  className={styles.stepLink}
                  href={`#${s.stepId}`}
                  onClick={() => {
                    // A repeated click does not change the hash; replay the jump.
                    if (location.hash === `#${s.stepId}`)
                      window.dispatchEvent(new HashChangeEvent('hashchange'));
                  }}
                >
                  {row}
                </a>
              ) : (
                <div className={styles.locked}>
                  {row}
                  <LockKeyhole size={16} aria-label="Потрібен доступ" />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
