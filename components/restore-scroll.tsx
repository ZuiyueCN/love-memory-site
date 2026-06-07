"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

export function RestoreScroll() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const url = new URL(window.location.href);
    const scrollY = url.searchParams.get("restoreScroll");

    if (!scrollY) {
      return;
    }

    const parsedScrollY = Number(scrollY);
    if (!Number.isFinite(parsedScrollY)) {
      return;
    }

    const html = document.documentElement;
    const previousScrollBehavior = html.style.scrollBehavior;

    html.style.scrollBehavior = "auto";
    window.scrollTo({ top: parsedScrollY, behavior: "auto" });

    url.searchParams.delete("restoreScroll");
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);

    requestAnimationFrame(() => {
      html.style.scrollBehavior = previousScrollBehavior;
    });
  }, [pathname]);

  return null;
}
