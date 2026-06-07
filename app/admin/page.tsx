import { LogOut, Sparkles } from "lucide-react";
import Link from "next/link";
import { logoutAction } from "@/app/actions";
import {
  CommentAdminList,
  GuestbookAdminList,
  MomentAdminList,
  PhotoAdminList,
  TimelineAdminList
} from "@/components/admin/admin-lists";
import { CreateMomentForm } from "@/components/forms/create-moment-form";
import { CreatePhotoForm } from "@/components/forms/create-photo-form";
import { CreateTimelineForm } from "@/components/forms/create-timeline-form";
import { SectionHeading } from "@/components/section-heading";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const email = await requireAdmin();
  const [photos, events, momentPosts, comments, guestbookMessages] = await Promise.all([
    prisma.photo.findMany({ orderBy: { takenAt: "desc" } }),
    prisma.timelineEvent.findMany({ orderBy: [{ order: "asc" }, { happenedAt: "desc" }] }),
    prisma.momentPost.findMany({
      orderBy: { postedAt: "desc" },
      include: {
        photos: {
          orderBy: { order: "asc" }
        }
      }
    }),
    prisma.photoComment.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        photo: {
          select: {
            title: true
          }
        }
      },
      take: 80
    }),
    prisma.guestbookMessage.findMany({
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
      take: 80
    })
  ]);

  const photoOptions = photos.map((photo) => ({
    id: photo.id,
    title: photo.title
  }));

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="glass-panel rounded-[34px] p-5 sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-black text-rosewood">
                <Sparkles className="size-4 text-coral" />
                已登录：{email}
              </div>
              <div className="mt-5">
                <SectionHeading eyebrow="Admin" title="纪念册管理后台" body="这里负责添加、编辑和删除公开页面中的照片、动态、时间线、评论和留言。" />
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/" className="ghost-button">
                返回首页
              </Link>
              <form action={logoutAction}>
                <button className="primary-button" type="submit">
                  <LogOut className="size-4" />
                  退出登录
                </button>
              </form>
            </div>
          </div>
        </header>

        <section className="mt-6 grid gap-5 xl:grid-cols-2">
          <CreatePhotoForm />
          <CreateTimelineForm photos={photoOptions} />
        </section>

        <section className="mt-6">
          <CreateMomentForm />
        </section>

        <section className="mt-6 grid gap-5">
          <PhotoAdminList photos={photos} />
          <MomentAdminList posts={momentPosts} />
          <TimelineAdminList events={events} photos={photos} />
          <CommentAdminList comments={comments} />
          <GuestbookAdminList messages={guestbookMessages} />
        </section>
      </div>
    </main>
  );
}
