"use client";

import { usePathname, useRouter } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";

type PreviewLinkProps = {
  href: string;
  className?: string;
  ariaLabel?: string;
  tabIndex?: number;
  children: ReactNode;
};

export function PreviewLink({ href, className, ariaLabel, tabIndex, children }: PreviewLinkProps) {
  const pathname = usePathname();
  const router = useRouter();

  function openPreview(event: MouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }

    event.preventDefault();
    const target = `${href}?returnTo=${encodeURIComponent(pathname)}&scrollY=${Math.round(window.scrollY)}`;
    router.push(target);
  }

  return (
    <a href={`${href}?returnTo=${encodeURIComponent(pathname)}`} onClick={openPreview} className={className} aria-label={ariaLabel} tabIndex={tabIndex}>
      {children}
    </a>
  );
}
