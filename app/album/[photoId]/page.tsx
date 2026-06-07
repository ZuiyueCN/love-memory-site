/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { PhotoCommentForm } from "@/components/photo-gallery";
import { PreviewCloseButton } from "@/components/preview-close-button";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function safeReturnTo(value: string | undefined) {
  if (value && value.startsWith("/") && !value.startsWith("//")) {
    return value;
  }

  return "/album";
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(value);
}

export default async function PhotoPreviewPage({
  params,
  searchParams
}: {
  params: Promise<{ photoId: string }>;
  searchParams: Promise<{ returnTo?: string; scrollY?: string }>;
}) {
  const [{ photoId }, query] = await Promise.all([params, searchParams]);
  const returnTo = safeReturnTo(query.returnTo);
  const scrollQuery = query.scrollY ? `&scrollY=${encodeURIComponent(query.scrollY)}` : "";

  const [photo, orderedPhotos] = await Promise.all([
    prisma.photo.findUnique({
      where: { id: photoId },
      include: {
        comments: {
          orderBy: { createdAt: "desc" }
        }
      }
    }),
    prisma.photo.findMany({
      orderBy: { takenAt: "desc" },
      select: { id: true, title: true }
    })
  ]);

  if (!photo) {
    notFound();
  }

  const currentIndex = orderedPhotos.findIndex((item) => item.id === photo.id);
  const previousPhoto = currentIndex > 0 ? orderedPhotos[currentIndex - 1] : null;
  const nextPhoto = currentIndex >= 0 && currentIndex < orderedPhotos.length - 1 ? orderedPhotos[currentIndex + 1] : null;
  const photoPosition = currentIndex >= 0 ? currentIndex + 1 : 1;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_18%_8%,rgba(247,183,200,0.24),transparent_26rem),linear-gradient(135deg,#fff8f3,#f2ebe6)] px-3 py-3 text-ink sm:px-5 sm:py-5">
      <div className="mx-auto flex min-h-[calc(100dvh-1.5rem)] max-w-7xl flex-col overflow-hidden rounded-[30px] border border-white/72 bg-white/68 shadow-soft backdrop-blur-2xl sm:min-h-[calc(100dvh-2.5rem)] lg:grid lg:grid-cols-[minmax(0,1fr)_380px]">
        <section className="relative grid min-h-[58dvh] place-items-center bg-ink px-3 py-16 sm:px-6 lg:min-h-0">
          <PreviewCloseButton returnTo={returnTo} scrollY={query.scrollY} />

          {previousPhoto ? (
            <Link
              href={`/album/${previousPhoto.id}?returnTo=${encodeURIComponent(returnTo)}${scrollQuery}`}
              replace
              scroll={false}
              className="absolute left-3 z-10 grid size-11 place-items-center rounded-full bg-white/84 text-rosewood shadow-soft transition hover:-translate-x-0.5"
              aria-label="上一张"
            >
              <ChevronLeft className="size-5" />
            </Link>
          ) : null}

          <img
            src={photo.imageUrl}
            alt={photo.title}
            className="max-h-[calc(100dvh-9rem)] max-w-full rounded-[22px] object-contain shadow-[0_24px_70px_rgba(0,0,0,0.34)]"
          />

          {nextPhoto ? (
            <Link
              href={`/album/${nextPhoto.id}?returnTo=${encodeURIComponent(returnTo)}${scrollQuery}`}
              replace
              scroll={false}
              className="absolute right-3 z-10 grid size-11 place-items-center rounded-full bg-white/84 text-rosewood shadow-soft transition hover:translate-x-0.5"
              aria-label="下一张"
            >
              <ChevronRight className="size-5" />
            </Link>
          ) : null}

          <div className="absolute bottom-4 rounded-full bg-white/90 px-4 py-2 text-xs font-black text-rosewood shadow-soft">
            {photoPosition} / {orderedPhotos.length}
          </div>
        </section>

        <aside className="max-h-none overflow-y-auto p-5 sm:p-6 lg:max-h-[calc(100dvh-2.5rem)]">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-coral">{formatDate(photo.takenAt)}</p>
          <h1 className="mt-3 text-3xl font-black leading-tight text-ink">{photo.title}</h1>
          {photo.description ? <p className="mt-4 whitespace-pre-line text-sm leading-7 text-rosewood/76">{photo.description}</p> : null}

          <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold text-rosewood/68">
            <span className="rounded-full bg-blush/18 px-3 py-1.5">{photo.category}</span>
            {photo.location ? <span className="rounded-full bg-white/70 px-3 py-1.5">{photo.location}</span> : null}
            <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-1.5">
              <MessageCircle className="size-3.5" />
              {photo.comments.length} 条评论
            </span>
          </div>

          <div className="mt-7 space-y-3">
            <h2 className="text-sm font-black text-ink">评论</h2>
            {photo.comments.length > 0 ? (
              photo.comments.map((comment) => (
                <div key={comment.id} className="rounded-[20px] bg-white/70 p-3 shadow-sm">
                  <p className="text-sm font-black text-rosewood">{comment.author}</p>
                  <p className="mt-1 text-sm leading-6 text-rosewood/76">{comment.body}</p>
                </div>
              ))
            ) : (
              <p className="rounded-[20px] bg-white/56 p-4 text-sm text-rosewood/64">还没有评论。</p>
            )}
          </div>

          <PhotoCommentForm photoId={photo.id} />
        </aside>
      </div>
    </main>
  );
}
