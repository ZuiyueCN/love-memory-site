/* eslint-disable @next/next/no-img-element */

import { CalendarHeart } from "lucide-react";
import { formatDate } from "@/lib/format";

type TimelineEvent = {
  id: string;
  title: string;
  body: string;
  happenedAt: Date;
  photo: {
    imageUrl: string;
    title: string;
  } | null;
};

export function TimelineList({ events }: { events: TimelineEvent[] }) {
  return (
    <div className="relative space-y-5 before:absolute before:left-5 before:top-4 before:h-[calc(100%-2rem)] before:w-px before:bg-coral/24 sm:before:left-7">
      {events.map((event) => (
        <article key={event.id} className="scroll-reveal relative grid gap-4 pl-14 sm:grid-cols-[1fr_240px] sm:gap-6 sm:pl-20">
          <span className="timeline-pulse absolute left-0 top-2 grid size-10 place-items-center rounded-2xl bg-white text-coral shadow-lift sm:size-14">
            <CalendarHeart className="size-5" />
          </span>
          <div className="soft-card shine-surface rounded-android p-5 sm:p-6">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-coral">{formatDate(event.happenedAt)}</p>
            <h3 className="mt-2 text-xl font-black text-ink">{event.title}</h3>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-rosewood/76">{event.body}</p>
          </div>
          {event.photo ? (
            <div className="overflow-hidden rounded-android bg-mist shadow-lift transition duration-300 hover:-translate-y-1 hover:shadow-soft">
              <img
                src={event.photo.imageUrl}
                alt={event.photo.title}
                loading="lazy"
                className="h-auto w-full object-contain transition duration-700 hover:scale-[1.025]"
              />
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}
