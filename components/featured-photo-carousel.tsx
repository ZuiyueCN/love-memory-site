"use client";

/* eslint-disable @next/next/no-img-element */

import { MapPin, Star } from "lucide-react";
import { PreviewLink } from "@/components/preview-link";

type FeaturedPhoto = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  takenAt: string;
  location: string | null;
  category: string;
  isFeatured: boolean;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(new Date(value));
}

export function FeaturedPhotoCarousel({ photos }: { photos: FeaturedPhoto[] }) {
  const shouldAnimate = photos.length > 1;

  return (
    <div className="featured-marquee group relative mt-8 overflow-hidden rounded-[34px] border border-white/72 bg-white/46 py-5 shadow-soft backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-cream/95 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-cream/95 to-transparent" />

      <div className="no-scrollbar featured-marquee-scroll overflow-x-auto px-5 sm:px-8">
        <div className={shouldAnimate ? "featured-marquee-track flex w-max" : "flex w-max"}>
          <FeaturedPhotoSet photos={photos} />
          {shouldAnimate ? <FeaturedPhotoSet photos={photos} ariaHidden /> : null}
        </div>
      </div>
    </div>
  );
}

function FeaturedPhotoSet({ photos, ariaHidden = false }: { photos: FeaturedPhoto[]; ariaHidden?: boolean }) {
  return (
    <div className="flex gap-5 pr-5" aria-hidden={ariaHidden}>
      {photos.map((photo) => (
        <PreviewLink
          key={`${photo.id}-${ariaHidden ? "copy" : "main"}`}
          href={`/album/${photo.id}`}
          className="soft-card photo-card-hover shine-surface group/card w-[82vw] shrink-0 overflow-hidden rounded-android sm:w-[430px] lg:w-[460px]"
          ariaLabel={`查看精选照片 ${photo.title}`}
          tabIndex={ariaHidden ? -1 : undefined}
        >
          <div className="relative grid aspect-[4/3] place-items-center overflow-hidden bg-mist">
            <img
              src={photo.imageUrl}
              alt={photo.title}
              loading="lazy"
              className="h-full w-full object-cover transition duration-700 ease-out group-hover/card:scale-[1.035] group-hover/card:saturate-[1.08]"
            />
            <div className="absolute left-4 top-4 flex gap-2">
              <span className="premium-chip rounded-full bg-white/84 px-3 py-1 text-xs font-bold text-rosewood shadow-sm backdrop-blur">
                {photo.category}
              </span>
              {photo.isFeatured ? (
                <span className="premium-chip grid size-8 place-items-center rounded-full bg-white/84 text-coral shadow-sm backdrop-blur transition duration-300 group-hover/card:rotate-12 group-hover/card:scale-110">
                  <Star className="size-4 fill-current" />
                </span>
              ) : null}
            </div>
          </div>

          <div className="p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-lg font-black leading-snug text-ink transition duration-300 group-hover/card:text-rosewood">{photo.title}</h3>
              <span className="shrink-0 text-xs font-bold text-coral">{formatDate(photo.takenAt)}</span>
            </div>
            {photo.description ? <p className="mt-2 line-clamp-2 text-sm leading-6 text-rosewood/74">{photo.description}</p> : null}
            {photo.location ? (
              <p className="mt-4 flex items-center gap-1.5 text-xs font-bold text-rosewood/62">
                <MapPin className="size-4" />
                {photo.location}
              </p>
            ) : null}
          </div>
        </PreviewLink>
      ))}
    </div>
  );
}
