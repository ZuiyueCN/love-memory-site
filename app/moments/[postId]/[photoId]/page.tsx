/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { PreviewCloseButton } from "@/components/preview-close-button";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function safeReturnTo(value: string | undefined) {
  if (value && value.startsWith("/") && !value.startsWith("//")) {
    return value;
  }

  return "/moments";
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(value);
}

export default async function MomentPhotoPreviewPage({
  params,
  searchParams
}: {
  params: Promise<{ postId: string; photoId: string }>;
  searchParams: Promise<{ returnTo?: string; scrollY?: string }>;
}) {
  const [{ postId, photoId }, query] = await Promise.all([params, searchParams]);
  const returnTo = safeReturnTo(query.returnTo);
  const scrollQuery = query.scrollY ? `&scrollY=${encodeURIComponent(query.scrollY)}` : "";

  const post = await prisma.momentPost.findUnique({
    where: { id: postId },
    include: {
      photos: {
        orderBy: { order: "asc" }
      }
    }
  });

  if (!post) {
    notFound();
  }

  const activeIndex = post.photos.findIndex((photo) => photo.id === photoId);
  const activePhoto = activeIndex >= 0 ? post.photos[activeIndex] : null;

  if (!activePhoto) {
    notFound();
  }

  const previousPhoto = activeIndex > 0 ? post.photos[activeIndex - 1] : null;
  const nextPhoto = activeIndex < post.photos.length - 1 ? post.photos[activeIndex + 1] : null;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_18%_8%,rgba(247,183,200,0.24),transparent_26rem),linear-gradient(135deg,#fff8f3,#f2ebe6)] px-3 py-3 text-ink sm:px-5 sm:py-5">
      <div className="mx-auto flex min-h-[calc(100dvh-1.5rem)] max-w-7xl flex-col overflow-hidden rounded-[30px] border border-white/72 bg-white/68 shadow-soft backdrop-blur-2xl sm:min-h-[calc(100dvh-2.5rem)] lg:grid lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="relative grid min-h-[66dvh] place-items-center bg-ink px-3 py-16 sm:px-6 lg:min-h-0">
          <PreviewCloseButton returnTo={returnTo} scrollY={query.scrollY} />

          {previousPhoto ? (
            <Link
              href={`/moments/${post.id}/${previousPhoto.id}?returnTo=${encodeURIComponent(returnTo)}${scrollQuery}`}
              replace
              scroll={false}
              className="absolute left-3 z-10 grid size-11 place-items-center rounded-full bg-white/84 text-rosewood shadow-soft transition hover:-translate-x-0.5"
              aria-label="上一张"
            >
              <ChevronLeft className="size-5" />
            </Link>
          ) : null}

          <img
            src={activePhoto.imageUrl}
            alt={`${post.title} 第 ${activeIndex + 1} 张`}
            className="max-h-[calc(100dvh-9rem)] max-w-full rounded-[22px] object-contain shadow-[0_24px_70px_rgba(0,0,0,0.34)]"
          />

          {nextPhoto ? (
            <Link
              href={`/moments/${post.id}/${nextPhoto.id}?returnTo=${encodeURIComponent(returnTo)}${scrollQuery}`}
              replace
              scroll={false}
              className="absolute right-3 z-10 grid size-11 place-items-center rounded-full bg-white/84 text-rosewood shadow-soft transition hover:translate-x-0.5"
              aria-label="下一张"
            >
              <ChevronRight className="size-5" />
            </Link>
          ) : null}

          <div className="absolute bottom-4 rounded-full bg-white/90 px-4 py-2 text-xs font-black text-rosewood shadow-soft">
            {activeIndex + 1} / {post.photos.length}
          </div>
        </section>

        <aside className="max-h-none overflow-y-auto p-5 sm:p-6 lg:max-h-[calc(100dvh-2.5rem)]">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-coral">{formatDate(post.postedAt)}</p>
          <h1 className="mt-3 text-3xl font-black leading-tight text-ink">{post.title}</h1>
          {post.location ? (
            <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-xs font-bold text-rosewood">
              <MapPin className="size-3.5" />
              {post.location}
            </p>
          ) : null}
          <p className="mt-5 whitespace-pre-line text-sm leading-7 text-rosewood/76">{post.body}</p>

          <div className="mt-7 grid grid-cols-4 gap-2">
            {post.photos.map((photo, index) => (
              <Link
                key={photo.id}
                href={`/moments/${post.id}/${photo.id}?returnTo=${encodeURIComponent(returnTo)}${scrollQuery}`}
                replace
                scroll={false}
                className={`overflow-hidden rounded-[14px] bg-mist ring-offset-2 ring-offset-cream transition ${
                  photo.id === activePhoto.id ? "ring-2 ring-coral" : "opacity-70 hover:opacity-100"
                }`}
                aria-label={`查看第 ${index + 1} 张`}
              >
                <img src={photo.imageUrl} alt={`${post.title} 缩略图 ${index + 1}`} className="aspect-square w-full object-cover" />
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}
