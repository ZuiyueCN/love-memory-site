import { Heart } from "lucide-react";
import { GuestbookForm } from "@/components/forms/guestbook-form";
import { SectionHeading } from "@/components/section-heading";
import { SiteShell } from "@/components/site-shell";
import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function GuestbookPage() {
  const messages = await prisma.guestbookMessage.findMany({
    orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }]
  });

  return (
    <SiteShell>
      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[360px_1fr] lg:px-8">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <SectionHeading eyebrow="Guestbook" title="留言板" body="朋友、家人或者你们自己，都可以在这里留下祝福和生活里的小话。" />
          <div className="mt-6">
            <GuestbookForm />
          </div>
        </div>

        <section className="grid gap-4">
          {messages.map((message) => (
            <article key={message.id} className="soft-card rounded-android p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black text-ink">{message.author}</h2>
                  <p className="mt-1 text-xs font-bold text-coral">{formatDate(message.createdAt)}</p>
                </div>
                {message.isPinned ? (
                  <span className="premium-chip inline-flex items-center gap-1 rounded-full bg-blush/22 px-3 py-1 text-xs font-black text-rosewood">
                    <Heart className="size-3.5 fill-current text-coral" />
                    置顶
                  </span>
                ) : null}
              </div>
              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-rosewood/76">{message.body}</p>
            </article>
          ))}
          {messages.length === 0 ? (
            <div className="glass-panel rounded-android p-10 text-center text-sm font-bold text-rosewood/70">还没有留言。</div>
          ) : null}
        </section>
      </main>
    </SiteShell>
  );
}
