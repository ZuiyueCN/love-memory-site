"use client";

import { useEffect, useRef, useState } from "react";
import { Music2, Pause, Play } from "lucide-react";

const defaultMusicUrl = "/music/background.mp3";
const musicTimeKey = "love_music_current_time";
const musicPausedKey = "love_music_user_paused";

export function BackgroundMusicPlayer({ src = defaultMusicUrl }: { src?: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const savedTime = Number(sessionStorage.getItem(musicTimeKey) || "0");
    if (Number.isFinite(savedTime) && savedTime > 0) {
      audio.currentTime = savedTime;
    }

    function removeInteractionListeners() {
      document.removeEventListener("pointerdown", playAfterFirstInteraction);
      document.removeEventListener("keydown", playAfterFirstInteraction);
      document.removeEventListener("touchstart", playAfterFirstInteraction);
    }

    async function playAfterFirstInteraction(event: Event) {
      const currentAudio = audioRef.current;
      const target = event.target;

      if (target instanceof Element && target.closest("[data-music-control='true']")) {
        return;
      }

      if (!currentAudio || hasError || sessionStorage.getItem(musicPausedKey) === "true") {
        return;
      }

      try {
        await currentAudio.play();
        setIsPlaying(true);
        removeInteractionListeners();
      } catch {
        setIsPlaying(false);
      }
    }

    document.addEventListener("pointerdown", playAfterFirstInteraction);
    document.addEventListener("keydown", playAfterFirstInteraction);
    document.addEventListener("touchstart", playAfterFirstInteraction);

    return () => {
      removeInteractionListeners();
    };
  }, [hasError, src]);

  async function togglePlayback() {
    const audio = audioRef.current;

    if (!audio || hasError) {
      return;
    }

    if (audio.paused) {
      try {
        sessionStorage.setItem(musicPausedKey, "false");
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
      return;
    }

    sessionStorage.setItem(musicPausedKey, "true");
    audio.pause();
    setIsPlaying(false);
  }

  return (
    <div className="fixed bottom-24 right-4 z-50 md:bottom-6">
      <audio
        ref={audioRef}
        src={src}
        preload="none"
        loop
        onError={() => {
          setHasError(true);
          setIsPlaying(false);
        }}
        onTimeUpdate={(event) => {
          sessionStorage.setItem(musicTimeKey, String(event.currentTarget.currentTime));
        }}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          void togglePlayback();
        }}
        data-music-control="true"
        disabled={hasError}
        className="music-button group"
        aria-label={isPlaying ? "暂停背景音乐" : "播放背景音乐"}
        title={hasError ? "请先放入背景音乐文件" : isPlaying ? "暂停背景音乐" : "播放背景音乐"}
      >
        <span className="music-button-orbit" aria-hidden="true" />
        <Music2 className="size-4" />
        {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
      </button>
    </div>
  );
}
