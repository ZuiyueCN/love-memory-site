"use client";

import { BackgroundMusicPlayer } from "@/components/background-music-player";

export function PersistentClientShell() {
  const musicUrl = process.env.NEXT_PUBLIC_BACKGROUND_MUSIC_URL || "/music/background.mp3";

  return <BackgroundMusicPlayer src={musicUrl} />;
}
