"use client";

import { useRef, useState } from "react";
import { Music2, Pause, Play } from "lucide-react";

const defaultMusicUrl = "/music/background.mp3";

export function BackgroundMusicPlayer({ src = defaultMusicUrl }: { src?: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  async function togglePlayback() {
    const audio = audioRef.current;

    if (!audio || hasError) {
      return;
    }

    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
      return;
    }

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
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />
      <button
        type="button"
        onClick={togglePlayback}
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
