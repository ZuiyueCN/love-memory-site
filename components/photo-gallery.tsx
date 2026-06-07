"use client";

/* eslint-disable @next/next/no-img-element */

import { useMemo, useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { useActionState } from "react";
import { createPhotoCommentAction } from "@/app/actions";
import { PreviewLink } from "@/components/preview-link";

type GalleryPhoto = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  takenAt: string;
  location: string | null;
  category: string;
  isFeatured: boolean;
  comments: {
    id: string;
    author: string;
    body: string;
    createdAt: string;
  }[];
};

const initialState = {
  ok: false,
  message: ""
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(new Date(value));
}

export function PhotoCommentForm({ photoId }: { photoId: string }) {
  const [state, action] = useActionState(createPhotoCommentAction, initialState);

  return (
    <form action={action} className="mt-4 grid gap-3 rounded-[22px] bg-white/58 p-3">
      <input type="hidden" name="photoId" value={photoId} />
      <input className="field py-2 text-sm" name="author" placeholder="你的昵称" required maxLength={24} />
      <textarea className="field min-h-20 resize-y py-2 text-sm" name="body" placeholder="写一句评论" required maxLength={300} />
      {state.message ? (
        <p className={`text-xs font-bold ${state.ok ? "text-green-700" : "text-red-600"}`}>{state.message}</p>
      ) : null}
      <button className="primary-button px-4 py-2 text-sm" type="submit">
        <Send className="size-4" />
        发布评论
      </button>
    </form>
  );
}

export function PhotoGallery({ photos, categories }: { photos: GalleryPhoto[]; categories: string[] }) {
  const [activeCategory, setActiveCategory] = useState("全部");

  const filteredPhotos = useMemo(() => {
    if (activeCategory === "全部") {
      return photos;
    }

    return photos.filter((photo) => photo.category === activeCategory);
  }, [activeCategory, photos]);

  return (
    <>
      <div className="mt-7 flex flex-wrap gap-2">
        {["全部", ...categories].map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => {
              setActiveCategory(category);
            }}
            className={`premium-chip rounded-full px-4 py-2 text-sm font-black transition duration-300 hover:-translate-y-0.5 ${
              activeCategory === category ? "bg-rosewood text-white" : "bg-white/72 text-rosewood"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {filteredPhotos.length > 0 ? (
        <div className="scroll-reveal stagger-1 mt-8 columns-1 gap-5 sm:columns-2 lg:columns-3">
          {filteredPhotos.map((photo) => (
            <article
              key={photo.id}
              className="soft-card photo-card-hover shine-surface group mb-5 break-inside-avoid overflow-hidden rounded-android"
            >
              <PreviewLink
                href={`/album/${photo.id}`}
                className="block w-full cursor-zoom-in overflow-hidden bg-mist text-left"
                ariaLabel={`放大预览 ${photo.title}`}
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  loading="lazy"
                  className="h-auto w-full object-contain transition duration-700 ease-out group-hover:scale-[1.025] group-hover:saturate-[1.08]"
                />
              </PreviewLink>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-black text-ink transition duration-300 group-hover:text-rosewood">{photo.title}</h3>
                  <span className="shrink-0 text-xs font-bold text-coral">{formatDate(photo.takenAt)}</span>
                </div>
                {photo.description ? <p className="mt-2 text-sm leading-6 text-rosewood/74">{photo.description}</p> : null}
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-bold text-rosewood/62">
                  <span className="rounded-full bg-blush/18 px-3 py-1">{photo.category}</span>
                  {photo.location ? <span>{photo.location}</span> : null}
                  <span className="inline-flex items-center gap-1">
                    <MessageCircle className="size-3.5" />
                    {photo.comments.length}
                  </span>
                </div>
                {photo.comments.length > 0 ? (
                  <div className="mt-4 space-y-2 rounded-[20px] bg-white/50 p-3">
                    {photo.comments.slice(0, 3).map((comment) => (
                      <p key={comment.id} className="text-xs leading-5 text-rosewood/76">
                        <span className="font-black text-rosewood">{comment.author}：</span>
                        {comment.body}
                      </p>
                    ))}
                  </div>
                ) : null}
                <PhotoCommentForm photoId={photo.id} />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-android bg-white/64 p-8 text-center text-sm font-bold text-rosewood/70">
          这个分类还没有照片。
        </div>
      )}

    </>
  );
}
