"use client";

/* eslint-disable @next/next/no-img-element */

import { MapPin } from "lucide-react";
import { PreviewLink } from "@/components/preview-link";

type MomentPost = {
  id: string;
  title: string;
  body: string;
  postedAt: string;
  location: string | null;
  photos: {
    id: string;
    imageUrl: string;
    order: number;
  }[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(new Date(value));
}

export function MomentFeed({ posts }: { posts: MomentPost[] }) {
  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <article key={post.id} className="soft-card scroll-reveal rounded-android p-5 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-coral">{formatDate(post.postedAt)}</p>
              <h2 className="mt-2 text-2xl font-black text-ink">{post.title}</h2>
            </div>
            {post.location ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/72 px-3 py-1 text-xs font-bold text-rosewood">
                <MapPin className="size-3.5" />
                {post.location}
              </span>
            ) : null}
          </div>
          <p className="mt-4 whitespace-pre-line text-sm leading-7 text-rosewood/76">{post.body}</p>
          <div className={`mt-5 grid gap-2 ${post.photos.length === 1 ? "grid-cols-1" : "grid-cols-3"}`}>
            {post.photos.map((photo, photoIndex) => (
              <PreviewLink
                key={photo.id}
                href={`/moments/${post.id}/${photo.id}`}
                className="overflow-hidden rounded-[18px] bg-mist text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lift"
                ariaLabel={`单独查看 ${post.title} 第 ${photoIndex + 1} 张`}
              >
                <img
                  src={photo.imageUrl}
                  alt={post.title}
                  loading="lazy"
                  className={`${post.photos.length === 1 ? "max-h-[720px] object-contain" : "aspect-square object-cover"} w-full transition duration-700 hover:scale-[1.035]`}
                />
              </PreviewLink>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
