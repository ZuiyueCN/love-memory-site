/* eslint-disable @next/next/no-img-element */

import { CalendarHeart, HeartHandshake } from "lucide-react";
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
    <div className="timeline-tree relative">
      <div className="timeline-tree-root" aria-hidden="true">
        <HeartHandshake className="size-5" />
      </div>

      <div className="space-y-8 lg:space-y-12">
        {events.map((event, index) => {
          const isRightSide = index % 2 === 0;

          return (
            <article
              key={event.id}
              className={`scroll-reveal timeline-tree-item relative grid gap-4 pl-14 lg:grid-cols-[minmax(0,1fr)_88px_minmax(0,1fr)] lg:items-center lg:pl-0 ${
                isRightSide ? "lg:[&_.timeline-tree-content]:col-start-3" : "lg:[&_.timeline-tree-content]:col-start-1"
              }`}
            >
              <span className="timeline-tree-branch" aria-hidden="true" />
              <span className="timeline-pulse timeline-tree-node absolute left-0 top-2 grid size-10 place-items-center rounded-2xl bg-white text-coral shadow-lift lg:left-1/2 lg:top-1/2 lg:size-14 lg:-translate-x-1/2 lg:-translate-y-1/2">
                <CalendarHeart className="size-5" />
              </span>

              <div className="timeline-tree-content soft-card shine-surface rounded-android p-5 sm:p-6">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-coral">{formatDate(event.happenedAt)}</p>
                <h3 className="mt-2 text-xl font-black text-ink">{event.title}</h3>
                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-rosewood/76">{event.body}</p>

                {event.photo ? (
                  <div className="mt-5 overflow-hidden rounded-[24px] bg-mist shadow-lift transition duration-300 hover:-translate-y-1 hover:shadow-soft">
                    <img
                      src={event.photo.imageUrl}
                      alt={event.photo.title}
                      loading="lazy"
                      className="h-auto w-full object-contain transition duration-700 hover:scale-[1.025]"
                    />
                  </div>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
