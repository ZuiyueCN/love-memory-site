import { EmptyState } from "@/components/empty-state";
import { SectionHeading } from "@/components/section-heading";
import { SiteShell } from "@/components/site-shell";
import { TimelineList } from "@/components/timeline-list";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function TimelinePage() {
  const events = await prisma.timelineEvent.findMany({
    orderBy: [{ order: "asc" }, { happenedAt: "desc" }],
    include: {
      photo: {
        select: {
          imageUrl: true,
          title: true
        }
      }
    }
  });

  return (
    <SiteShell>
      <main className="scroll-reveal mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Timeline" title="恋爱时间线" body="从第一次心动到每一个纪念日，把重要节点按顺序放进同一条故事线。" />
        <div className="mt-9">
          {events.length > 0 ? (
            <TimelineList events={events} />
          ) : (
            <EmptyState title="还没有时间线" body="登录后台添加第一个恋爱节点后，这里会开始记录你们的故事。" />
          )}
        </div>
      </main>
    </SiteShell>
  );
}
