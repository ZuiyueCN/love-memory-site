"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";

export function PreviewCloseButton({ returnTo, scrollY }: { returnTo: string; scrollY?: string }) {
  const router = useRouter();

  function getCloseTarget() {
    const url = new URL(returnTo, window.location.origin);

    if (scrollY) {
      url.searchParams.set("restoreScroll", scrollY);
    }

    return `${url.pathname}${url.search}${url.hash}`;
  }

  return (
    <button
      type="button"
      onClick={() => {
        router.replace(getCloseTarget(), { scroll: false });
      }}
      className="absolute right-4 top-4 z-10 grid size-11 place-items-center rounded-full bg-white/92 text-rosewood shadow-soft transition hover:-translate-y-0.5"
      aria-label="关闭预览"
    >
      <X className="size-5" />
    </button>
  );
}
