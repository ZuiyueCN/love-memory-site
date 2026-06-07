import { EmptyState } from "@/components/empty-state";
import { PhotoGallery } from "@/components/photo-gallery";
import { SectionHeading } from "@/components/section-heading";
import { SiteShell } from "@/components/site-shell";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AlbumPage() {
  const photos = await prisma.photo.findMany({
    orderBy: { takenAt: "desc" },
    include: {
      comments: {
        orderBy: { createdAt: "desc" }
      }
    }
  });
  const categories = [...new Set(photos.map((photo) => photo.category))];
  const galleryPhotos = photos.map((photo) => ({
    id: photo.id,
    title: photo.title,
    description: photo.description,
    imageUrl: photo.imageUrl,
    takenAt: photo.takenAt.toISOString(),
    location: photo.location,
    category: photo.category,
    isFeatured: photo.isFeatured,
    comments: photo.comments.map((comment) => ({
      id: comment.id,
      author: comment.author,
      body: comment.body,
      createdAt: comment.createdAt.toISOString()
    }))
  }));

  return (
    <SiteShell>
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="scroll-reveal flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading eyebrow="Album" title="我们的照片墙" body="按时间倒序展示所有生活瞬间，手机和电脑上都会保持舒服的浏览节奏。" />
        </div>

        {photos.length > 0 ? (
          <PhotoGallery photos={galleryPhotos} categories={categories} />
        ) : (
          <div className="mt-8">
            <EmptyState title="相册还是空的" body="主人登录后上传照片，这里会自动生成高级感照片墙。" />
          </div>
        )}
      </main>
    </SiteShell>
  );
}
