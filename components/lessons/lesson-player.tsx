'use client';
/* oxlint-disable next/no-img-element -- source image is prepared WebP through media:prepare */
/* oxlint-disable jsx-a11y/media-has-caption -- silent draft clips; captions track is rendered when narration captions exist in manifest */
/* oxlint-disable react/react-compiler -- synchronizes media query, local progress and asynchronous playback sources with external browser state */
import { useCallback, useEffect, useRef, useState } from 'react';
import type Hls from 'hls.js';
import { Check, LockKeyhole } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trackEvent } from '@/lib/analytics/umami';
import styles from './lesson.module.css';
export type StepSummary = {
  stepId: string;
  n: number;
  title: string;
  durationSec: number;
  free: boolean;
  status: 'draft' | 'final';
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
}: {
  steps: StepSummary[];
  access: boolean;
  preview?: boolean;
}) {
  const free = steps.find((s) => s.free)!;
  const [index, setIndex] = useState(access ? 0 : steps.indexOf(free));
  const [orientation, setOrientation] = useState<'wide' | 'vertical'>('wide');
  const [playback, setPlayback] = useState<Playback | null>(null);
  const [error, setError] = useState('');
  const [continuous, setContinuous] = useState(access);
  const [resume, setResume] = useState<Progress | null>(null);
  const [watched, setWatched] = useState<string[]>([]);
  const video = useRef<HTMLVideoElement>(null);
  const cache = useRef(new Map<string, Playback>());
  const pendingSeek = useRef({ time: 0, play: false });
  const activeId = useRef('');
  const completed = useRef(new Set<string>());
  const retryCount = useRef(0);
  const step = steps[index];
  const open = useCallback(
    (i: number, autoplay = false, time = 0) => {
      if (i < 0 || i >= steps.length || (!access && !steps[i].free)) return;
      if (!autoplay) video.current?.pause();
      pendingSeek.current = { time, play: autoplay };
      retryCount.current = 0;
      setIndex(i);
      setError('');
      if (!preview) history.replaceState(null, '', `#${steps[i].stepId}`);
      // Explicit repeat of the current step still seeks correctly.
      if (video.current && activeId.current === steps[i].stepId) {
        video.current.currentTime = time;
        if (autoplay) void video.current.play().catch(() => undefined);
      }
    },
    [access, preview, steps],
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
      if (i >= 0) open(i);
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
      throw new Error(
        response.status === 401 || response.status === 403
          ? 'Увійди за email покупки, щоб відкрити урок.'
          : 'Відео ще готується. Спробуй пізніше.',
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
        if (!cancelled) setError(e.message);
      });
    if (access && steps[index + 1])
      void fetchPlayback(steps[index + 1].stepId).catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [access, fetchPlayback, index, preview, step.stepId, steps]);
  useEffect(() => {
    const element = video.current;
    if (!element || !playback) return;
    let hls: Hls | undefined;
    let cancelled = false;
    const url = playback[orientation].hls;
    const restore = () => {
      const { time, play } = pendingSeek.current;
      element.currentTime = Math.min(
        time,
        Math.max(0, element.duration - 0.05),
      );
      if (play) void element.play().catch(() => undefined);
    };
    element.addEventListener('loadedmetadata', restore, { once: true });
    async function attach() {
      if (element!.canPlayType('application/vnd.apple.mpegurl')) {
        element!.src = url;
        element!.load();
      } else {
        const { default: HlsPlayer } = await import('hls.js');
        if (cancelled) return;
        if (!HlsPlayer.isSupported()) {
          setError(
            'Цей браузер не підтримує відео. Спробуй Safari або Chrome.',
          );
          return;
        }
        hls = new HlsPlayer();
        hls.loadSource(url);
        hls.attachMedia(element!);
        hls.on(HlsPlayer.Events.ERROR, (_, data) => {
          if (data.fatal) void refreshSource();
        });
      }
    }
    void attach().catch(() =>
      setError('Не вдалося відкрити відео. Спробуй ще раз.'),
    );
    return () => {
      cancelled = true;
      element.removeEventListener('loadedmetadata', restore);
      hls?.destroy();
      element.removeAttribute('src');
      element.load();
    };
    // The callback reads the active source through this effect's closure.
    async function refreshSource() {
      if (retryCount.current++ >= 1) {
        setError('Не вдалося відтворити відео. Спробуй ще раз.');
        return;
      }
      pendingSeek.current = {
        time: element!.currentTime,
        play: !element!.paused,
      };
      try {
        const data = await fetchPlayback(step.stepId, true);
        if (!cancelled) setPlayback(data);
      } catch {
        if (!cancelled) setError('Увійди ще раз або спробуй пізніше.');
      }
    }
  }, [fetchPlayback, orientation, playback, step.stepId]);
  async function retry() {
    retryCount.current = 0;
    setError('');
    pendingSeek.current = {
      time: video.current?.currentTime ?? 0,
      play: false,
    };
    try {
      setPlayback(await fetchPlayback(step.stepId, true));
    } catch (e) {
      setError((e as Error).message);
    }
  }
  function saveProgress() {
    const v = video.current;
    if (!v || !playback || activeId.current !== step.stepId) return;
    if (
      v.duration > 0 &&
      v.currentTime / v.duration >= 0.9 &&
      !completed.current.has(step.stepId)
    ) {
      completed.current.add(step.stepId);
      setWatched([...completed.current]);
      trackEvent('lesson_step_complete', { stepId: step.stepId });
    }
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
    <div className={styles.workspace}>
      <div className={styles.view}>
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
        <div className={styles.frame}>
          {preview || (!playback && error) ? (
            <img
              className={styles.placeholder}
              src="/media/recipes/gluten-free-napoleon/lesson-banner-2026-10-31/napoleon-banner-poster-crop-360x450.webp"
              alt="Шаруватий Наполеон без глютену, шматочок на виделці"
            />
          ) : (
            <video
              className={styles.video}
              ref={video}
              controls
              playsInline
              preload="metadata"
              aria-label={`${step.n}. ${step.title}`}
              poster={
                playback?.[orientation].thumbnail ??
                '/media/recipes/gluten-free-napoleon/lesson-banner-2026-10-31/napoleon-banner-poster-crop-360x450.webp'
              }
              onPlay={() =>
                trackEvent('lesson_step_play', {
                  stepId: step.stepId,
                  orientation,
                })
              }
              onTimeUpdate={saveProgress}
              onPause={saveProgress}
              onError={() => {
                if (playback && retryCount.current++ < 1) {
                  pendingSeek.current = {
                    time: video.current?.currentTime ?? 0,
                    play: !video.current?.paused,
                  };
                  void fetchPlayback(step.stepId, true)
                    .then(setPlayback)
                    .catch(() =>
                      setError('Не вдалося відтворити відео. Спробуй ще раз.'),
                    );
                } else if (playback)
                  setError('Не вдалося відтворити відео. Спробуй ще раз.');
              }}
              onEnded={() => {
                saveProgress();
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
          <h2>
            {step.n}. {step.title}
          </h2>
          {step.status === 'draft' && access && (
            <p>Чорновий монтаж · без голосу</p>
          )}
        </div>
        {error && (
          <div aria-live="polite" className={styles.notice}>
            {error}{' '}
            <Button variant="outline" onClick={() => void retry()}>
              Спробувати ще раз
            </Button>
          </div>
        )}
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
              {continuous ? 'Дивитися підряд: увімкнено' : 'Дивитися підряд: вимкнено'}
            </Button>
          </div>
        )}
        <noscript>
          <p>Для перегляду увімкни JavaScript.</p>
        </noscript>
      </div>
      <section
        aria-labelledby={preview ? 'lesson-preview-steps' : 'lesson-steps'}
      >
        <h2
          className={styles.stepsTitle}
          id={preview ? 'lesson-preview-steps' : 'lesson-steps'}
        >
          Що в уроці
        </h2>
        <ol className={styles.steps} data-lesson-controls>
          {steps.map((s, i) => (
            <li
              className={styles.step}
              id={preview ? undefined : s.stepId}
              key={s.stepId}
            >
              {access || s.free ? (
                <button
                  type="button"
                  aria-current={i === index ? 'step' : undefined}
                  onClick={() => {
                    open(i);
                    if (!access)
                      video.current?.scrollIntoView({
                        block: 'center',
                        behavior: 'smooth',
                      });
                  }}
                >
                  <span>{s.n}</span>
                  <span className={styles.stepTitle}>
                    {s.title}
                    {s.free && !access && <small> · безкоштовно</small>}
                  </span>
                  <span className={styles.meta}>{stamp(s.durationSec)}</span>
                  {watched.includes(s.stepId) && (
                    <span className={styles.meta}>
                      <Check size={16} aria-hidden="true" /> Переглянуто
                    </span>
                  )}
                </button>
              ) : (
                <div className={styles.locked}>
                  <span>{s.n}</span>
                  <span className={styles.stepTitle}>{s.title}</span>
                  <span className={styles.meta}>{stamp(s.durationSec)}</span>
                  <LockKeyhole size={16} aria-label="Потрібен доступ" />
                </div>
              )}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
