'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
/* oxlint-disable react/react-compiler -- registers external media callbacks */
import { LessonSoundButton } from './lesson-sound-button';
import styles from './lesson.module.css';

type StreamPlayer = {
  addEventListener: (name: string, listener: () => void) => void;
  destroy: () => void;
  muted: boolean;
  volume: number;
  duration: number;
  played: TimeRanges;
  paused: boolean;
  play: () => Promise<void>;
};
type StreamFactory = (frame: HTMLIFrameElement) => StreamPlayer;
let sdk: Promise<StreamFactory | undefined> | undefined;
function loadStreamSdk() {
  const browser = window as Window & { Stream?: StreamFactory };
  if (browser.Stream) return Promise.resolve(browser.Stream);
  return (sdk ??= new Promise<StreamFactory | undefined>((resolve) => {
    const script = document.createElement('script');
    const finish = () => {
      clearTimeout(timer);
      resolve(browser.Stream);
    };
    const timer = setTimeout(finish, 2000);
    script.src = 'https://embed.cloudflarestream.com/embed/sdk.latest.js';
    script.async = true;
    script.onload = finish;
    script.onerror = finish;
    document.head.appendChild(script);
  }));
}

export function LessonStreamFallback({
  url,
  title,
  autoplay,
  onPlaying,
  onProgress,
  onUnmute,
}: {
  url: string;
  title: string;
  autoplay: boolean;
  onPlaying: (automatic: boolean) => void;
  onUnmute: () => void;
  onProgress: (played: TimeRanges, duration: number, ended: boolean) => void;
}) {
  const [showSound, setShowSound] = useState(false);
  const [ready, setReady] = useState(false);
  const factory = useRef<StreamFactory>(undefined);
  const iframe = useRef<HTMLIFrameElement>(null);
  const player = useRef<StreamPlayer>(null);
  const attempted = useRef(false);
  const automatic = useRef(false);
  const callbacks = useRef({ onPlaying, onProgress, onUnmute });
  useLayoutEffect(() => {
    callbacks.current = { onPlaying, onProgress, onUnmute };
  }, [onPlaying, onProgress, onUnmute]);
  useEffect(() => {
    let cancelled = false;
    void loadStreamSdk().then((create) => {
      if (cancelled) return;
      factory.current = create;
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  useLayoutEffect(() => {
    if (!ready || !iframe.current || !factory.current) return;
    const stream = factory.current(iframe.current);
    player.current = stream;
    attempted.current = false;
    automatic.current = false;
    let started = false;
    let ended = false;
    let previousMute: boolean | undefined;
    const syncSound = () => {
      if (!started) return;
      const muted = stream.muted || stream.volume === 0;
      if (previousMute && !muted) callbacks.current.onUnmute();
      if (previousMute !== muted) setShowSound(muted);
      previousMute = muted;
    };
    const watch = () => {
      // Forwarding `playing` is preferred; actual played ranges also prove playback.
      if (!started && stream.played.length > 0) begin();
      if (started)
        callbacks.current.onProgress(stream.played, stream.duration, ended);
      syncSound();
    };
    const begin = () => {
      if (started) return;
      started = true;
      callbacks.current.onPlaying(automatic.current);
      syncSound();
    };
    stream.addEventListener('playing', begin);
    stream.addEventListener('volumechange', syncSound);
    stream.addEventListener('timeupdate', () => watch());
    stream.addEventListener('pause', () => watch());
    stream.addEventListener('ended', () => {
      ended = true;
      watch();
    });
    return () => {
      stream.destroy();
      player.current = null;
    };
  }, [ready, url]);
  useEffect(() => {
    const stream = player.current;
    if (!autoplay || !stream || attempted.current || !stream.paused) return;
    attempted.current = true;
    automatic.current = true;
    stream.muted = true;
    void stream.play().catch(() => {
      if (player.current !== stream) return;
      automatic.current = false;
      if (stream.paused) stream.muted = false;
    });
  }, [autoplay, ready, url]);
  if (!ready) return <div className={styles.video} aria-busy="true" />;
  return (
    <div className={styles.videoStage}>
      <iframe
        ref={iframe}
        className={`${styles.video} ${styles.streamFallback}`}
        src={url}
        title={title}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
      {showSound && (
        <LessonSoundButton
          onClick={() => {
            const stream = player.current;
            if (!stream) return;
            if (stream.volume === 0) stream.volume = 1;
            stream.muted = false;
            iframe.current?.focus({ preventScroll: true });
          }}
        />
      )}
    </div>
  );
}
