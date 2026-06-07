import Link from "next/link";
import { ArrowRight, Camera, Images, Sparkles } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { FeaturedPhotoCarousel } from "@/components/featured-photo-carousel";
import { MomentFeed } from "@/components/moment-feed";
import { SectionHeading } from "@/components/section-heading";
import { SiteShell } from "@/components/site-shell";
import { TimelineList } from "@/components/timeline-list";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredPhotos, timelineEvents, recentMoments, totalPhotos, momentCount, messageCount] = await Promise.all([
    prisma.photo.findMany({
      where: { isFeatured: true },
      orderBy: { takenAt: "desc" },
      take: 12
    }),
    prisma.timelineEvent.findMany({
      orderBy: [{ order: "asc" }, { happenedAt: "desc" }],
      include: { photo: { select: { imageUrl: true, title: true } } },
      take: 4
    }),
    prisma.momentPost.findMany({
      orderBy: { postedAt: "desc" },
      include: {
        photos: {
          orderBy: { order: "asc" }
        }
      },
      take: 3
    }),
    prisma.photo.count(),
    prisma.momentPost.count(),
    prisma.guestbookMessage.count()
  ]);
  const formattedMoments = recentMoments.map((post) => ({
    id: post.id,
    title: post.title,
    body: post.body,
    postedAt: post.postedAt.toISOString(),
    location: post.location,
    photos: post.photos.map((photo) => ({
      id: photo.id,
      imageUrl: photo.imageUrl,
      order: photo.order
    }))
  }));
  const formattedFeaturedPhotos = featuredPhotos.map((photo) => ({
    id: photo.id,
    title: photo.title,
    description: photo.description,
    imageUrl: photo.imageUrl,
    takenAt: photo.takenAt.toISOString(),
    location: photo.location,
    category: photo.category,
    isFeatured: photo.isFeatured
  }));

  return (
    <SiteShell>
      <main>
        <section className="mx-auto min-h-[calc(100vh-72px)] max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="scroll-reveal hero-banner relative overflow-hidden rounded-[40px] px-5 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
            <div className="hero-orbit hero-orbit-a" />
            <div className="hero-orbit hero-orbit-b" />
            <div className="hero-orbit hero-orbit-c" />
            <div className="relative z-10 mx-auto max-w-5xl text-center">
              <div className="premium-chip mx-auto inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/64 px-4 py-2 text-sm font-bold text-rosewood shadow-sm backdrop-blur">
                <Sparkles className="size-4 text-coral" />
                只属于我们的生活记录
              </div>
              <h1 className="mx-auto mt-7 max-w-5xl text-5xl font-black leading-[1.02] text-ink sm:text-6xl lg:text-7xl">
                把每一次心动，都收藏进这里。
              </h1>
              <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-rosewood/76 sm:text-lg">
                这里是照片、纪念日、旅行、日常和小情绪组成的恋爱纪念册。访客可以安静浏览，而主人登录后可以继续添加新的故事。
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href="/album" className="primary-button">
                  <Camera className="size-5" />
                  看我们的相册
                </Link>
                <Link href="/moments" className="ghost-button">
                  <Images className="size-5" />
                  看最新动态
                </Link>
              </div>
            </div>

            <div className="relative z-10 mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["照片", `${totalPhotos}`],
                ["时间节点", `${timelineEvents.length}`],
                ["组图动态", `${momentCount}`],
                ["留言", `${messageCount}`]
              ].map(([label, value]) => (
                <div key={label} className="glass-panel stat-card rounded-[24px] p-4 transition duration-300 hover:-translate-y-1">
                  <p className="text-2xl font-black text-ink">{value}</p>
                  <p className="mt-1 text-xs font-bold text-rosewood/62">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="scroll-reveal mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <SectionHeading eyebrow="Featured" title="精选照片" body="把最想反复看的瞬间放在首页，像手机相册里被置顶的小幸福。" />
            <Link href="/album" className="ghost-button self-start sm:self-auto">
              全部照片
              <ArrowRight className="size-4" />
            </Link>
          </div>
          {featuredPhotos.length > 0 ? (
            <FeaturedPhotoCarousel photos={formattedFeaturedPhotos} />
          ) : (
            <div className="mt-8">
              <EmptyState title="还没有精选照片" body="登录主人后台后，上传照片并勾选精选，它们就会出现在这里。" />
            </div>
          )}
        </section>

        <section className="scroll-reveal mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <SectionHeading eyebrow="Moments" title="最近动态" body="把一组组照片和当时的心情放进时间流里。" />
            <Link href="/moments" className="ghost-button self-start sm:self-auto">
              全部动态
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-8">
            {formattedMoments.length > 0 ? (
              <div className="mx-auto max-w-3xl">
                <MomentFeed posts={formattedMoments} />
              </div>
            ) : (
              <EmptyState title="还没有动态" body="登录后台发布组图动态后，这里会像空间动态流一样展示出来。" />
            )}
          </div>
        </section>

        <section className="scroll-reveal stagger-1 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Timeline" title="恋爱时间线" body="用时间把每一次相遇、旅行、纪念日和普通日子串起来。" />
          <div className="mt-8">
            {timelineEvents.length > 0 ? (
              <TimelineList events={timelineEvents} />
            ) : (
              <EmptyState title="时间线还在等待第一条故事" body="登录后台添加纪念节点后，这里会自动生成漂亮的时间线。" />
            )}
          </div>
        </section>

      </main>
    </SiteShell>
  );
}
