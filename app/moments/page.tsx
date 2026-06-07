import { EmptyState } from "@/components/empty-state";
import { MomentFeed } from "@/components/moment-feed";
import { SectionHeading } from "@/components/section-heading";
import { SiteShell } from "@/components/site-shell";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function MomentsPage() {
  const posts = await prisma.momentPost.findMany({
    orderBy: { postedAt: "desc" },
    include: {
      photos: {
        orderBy: { order: "asc" }
      }
    }
  });

  const formattedPosts = posts.map((post) => ({
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

  return (
    <SiteShell>
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Moments" title="组图动态" body="像朋友圈一样，用一组照片记录一次约会、一场旅行或一个普通但开心的日子。" />
        <div className="mt-8">
          {formattedPosts.length > 0 ? (
            <MomentFeed posts={formattedPosts} />
          ) : (
            <EmptyState title="还没有组图动态" body="主人可以在后台发布最多 9 张照片组成的动态。" />
          )}
        </div>
      </main>
    </SiteShell>
  );
}
