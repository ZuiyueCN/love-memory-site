import Image from "next/image";
import {
  deleteGuestbookMessageAction,
  deleteMomentPostAction,
  deletePhotoCommentAction,
  deletePhotoAction,
  deletePhotosAction,
  deleteTimelineAction,
  toggleGuestbookPinAction,
  updatePhotoAction,
  updateTimelineAction
} from "@/app/actions";
import { BatchDeletePhotosButton } from "@/components/admin/batch-delete-photos-button";
import { DeleteButton } from "@/components/admin/delete-button";
import { SubmitButton } from "@/components/forms/submit-button";
import { formatDate } from "@/lib/format";

type Photo = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  takenAt: Date;
  location: string | null;
  category: string;
  isFeatured: boolean;
};

type PhotoComment = {
  id: string;
  author: string;
  body: string;
  createdAt: Date;
  photo: {
    title: string;
  };
};

type MomentPost = {
  id: string;
  title: string;
  body: string;
  postedAt: Date;
  location: string | null;
  photos: {
    id: string;
    imageUrl: string;
    order: number;
  }[];
};

type GuestbookMessage = {
  id: string;
  author: string;
  body: string;
  isPinned: boolean;
  createdAt: Date;
};

type TimelineEvent = {
  id: string;
  title: string;
  body: string;
  happenedAt: Date;
  order: number;
  photoId: string | null;
};

function dateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function PhotoAdminList({ photos }: { photos: Photo[] }) {
  return (
    <section className="soft-card rounded-android p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-black text-ink">照片管理</h2>
          <p className="mt-1 text-xs font-bold text-rosewood/60">勾选多张照片后，可以一次性删除。</p>
        </div>
        {photos.length > 0 ? (
          <form id="batch-delete-photos" action={deletePhotosAction} className="flex justify-end">
            <BatchDeletePhotosButton formId="batch-delete-photos" />
          </form>
        ) : null}
      </div>
      <div className="mt-5 space-y-4">
        {photos.map((photo) => (
          <article key={photo.id} className="relative rounded-[24px] border border-rosewood/10 bg-white/64 p-4">
            <label className="absolute left-3 top-3 z-10 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-xs font-black text-rosewood shadow-sm backdrop-blur">
              <input type="checkbox" name="photoIds" value={photo.id} form="batch-delete-photos" className="size-4 accent-coral" />
              选择
            </label>
            <div className="grid gap-4 lg:grid-cols-[160px_1fr]">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-mist">
                <Image src={photo.imageUrl} alt={photo.title} fill sizes="160px" className="object-cover" />
              </div>
              <form action={updatePhotoAction.bind(null, photo.id)} className="grid gap-3 sm:grid-cols-2">
                <input className="field" name="title" defaultValue={photo.title} aria-label="照片标题" required />
                <input className="field" type="date" name="takenAt" defaultValue={dateInputValue(photo.takenAt)} aria-label="拍摄日期" required />
                <input className="field" name="location" defaultValue={photo.location || ""} placeholder="地点" aria-label="地点" />
                <input className="field" name="category" defaultValue={photo.category} aria-label="分类" required />
                <textarea className="field min-h-20 resize-y sm:col-span-2" name="description" defaultValue={photo.description || ""} aria-label="描述" />
                <div className="flex flex-wrap items-center justify-between gap-3 sm:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-rosewood">
                    <input type="checkbox" name="isFeatured" defaultChecked={photo.isFeatured} className="size-5 accent-coral" />
                    首页精选
                  </label>
                  <div className="flex gap-2">
                    <SubmitButton className="ghost-button px-4 py-2 text-xs">保存修改</SubmitButton>
                  </div>
                </div>
              </form>
            </div>
            <form action={deletePhotoAction.bind(null, photo.id)} className="mt-3 flex justify-end">
              <DeleteButton />
            </form>
          </article>
        ))}
        {photos.length === 0 ? <p className="text-sm text-rosewood/70">还没有照片，先在上方上传第一张。</p> : null}
      </div>
    </section>
  );
}

export function TimelineAdminList({ events, photos }: { events: TimelineEvent[]; photos: Photo[] }) {
  return (
    <section className="soft-card rounded-android p-5">
      <h2 className="text-lg font-black text-ink">时间线管理</h2>
      <div className="mt-5 space-y-4">
        {events.map((event) => (
          <article key={event.id} className="rounded-[24px] border border-rosewood/10 bg-white/64 p-4">
            <form action={updateTimelineAction.bind(null, event.id)} className="grid gap-3 sm:grid-cols-2">
              <input className="field" name="title" defaultValue={event.title} aria-label="时间线标题" required />
              <input className="field" type="date" name="happenedAt" defaultValue={dateInputValue(event.happenedAt)} aria-label="发生日期" required />
              <input className="field" type="number" name="order" defaultValue={event.order} aria-label="排序" />
              <select className="field" name="photoId" defaultValue={event.photoId || ""} aria-label="关联照片">
                <option value="">不关联照片</option>
                {photos.map((photo) => (
                  <option key={photo.id} value={photo.id}>
                    {photo.title}
                  </option>
                ))}
              </select>
              <textarea className="field min-h-24 resize-y sm:col-span-2" name="body" defaultValue={event.body} aria-label="正文" required />
              <div className="flex flex-wrap justify-between gap-3 sm:col-span-2">
                <span className="text-xs font-bold text-rosewood/60">{formatDate(event.happenedAt)}</span>
                <SubmitButton className="ghost-button px-4 py-2 text-xs">保存修改</SubmitButton>
              </div>
            </form>
            <form action={deleteTimelineAction.bind(null, event.id)} className="mt-3 flex justify-end">
              <DeleteButton />
            </form>
          </article>
        ))}
        {events.length === 0 ? <p className="text-sm text-rosewood/70">还没有时间线节点。</p> : null}
      </div>
    </section>
  );
}

export function MomentAdminList({ posts }: { posts: MomentPost[] }) {
  return (
    <section className="soft-card rounded-android p-5">
      <h2 className="text-lg font-black text-ink">组图动态管理</h2>
      <div className="mt-5 space-y-4">
        {posts.map((post) => (
          <article key={post.id} className="rounded-[24px] border border-rosewood/10 bg-white/64 p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
              <div>
                <p className="text-xs font-black text-coral">{formatDate(post.postedAt)}</p>
                <h3 className="mt-1 text-lg font-black text-ink">{post.title}</h3>
                <p className="mt-2 line-clamp-3 whitespace-pre-line text-sm leading-6 text-rosewood/72">{post.body}</p>
                {post.location ? <p className="mt-2 text-xs font-bold text-rosewood/60">{post.location}</p> : null}
              </div>
              <div className="grid w-full grid-cols-6 gap-1.5 lg:w-56">
                {post.photos.slice(0, 6).map((photo) => (
                  <div key={photo.id} className="relative aspect-square overflow-hidden rounded-xl bg-mist">
                    <Image src={photo.imageUrl} alt={post.title} fill sizes="80px" className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
            <form action={deleteMomentPostAction.bind(null, post.id)} className="mt-3 flex justify-end">
              <DeleteButton />
            </form>
          </article>
        ))}
        {posts.length === 0 ? <p className="text-sm text-rosewood/70">还没有组图动态。</p> : null}
      </div>
    </section>
  );
}

export function CommentAdminList({ comments }: { comments: PhotoComment[] }) {
  return (
    <section className="soft-card rounded-android p-5">
      <h2 className="text-lg font-black text-ink">相册评论管理</h2>
      <div className="mt-5 space-y-3">
        {comments.map((comment) => (
          <article key={comment.id} className="rounded-[22px] border border-rosewood/10 bg-white/64 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-black text-ink">{comment.author}</p>
                <p className="mt-1 text-xs font-bold text-coral">
                  {formatDate(comment.createdAt)} · {comment.photo.title}
                </p>
                <p className="mt-2 text-sm leading-6 text-rosewood/74">{comment.body}</p>
              </div>
              <form action={deletePhotoCommentAction.bind(null, comment.id)} className="shrink-0">
                <DeleteButton />
              </form>
            </div>
          </article>
        ))}
        {comments.length === 0 ? <p className="text-sm text-rosewood/70">还没有评论。</p> : null}
      </div>
    </section>
  );
}

export function GuestbookAdminList({ messages }: { messages: GuestbookMessage[] }) {
  return (
    <section className="soft-card rounded-android p-5">
      <h2 className="text-lg font-black text-ink">留言板管理</h2>
      <div className="mt-5 space-y-3">
        {messages.map((message) => (
          <article key={message.id} className="rounded-[22px] border border-rosewood/10 bg-white/64 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-black text-ink">
                  {message.author}
                  {message.isPinned ? <span className="ml-2 rounded-full bg-blush/20 px-2 py-0.5 text-xs text-coral">置顶</span> : null}
                </p>
                <p className="mt-1 text-xs font-bold text-coral">{formatDate(message.createdAt)}</p>
                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-rosewood/74">{message.body}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <form action={toggleGuestbookPinAction.bind(null, message.id, !message.isPinned)}>
                  <button type="submit" className="ghost-button px-3 py-2 text-xs">
                    {message.isPinned ? "取消置顶" : "置顶"}
                  </button>
                </form>
                <form action={deleteGuestbookMessageAction.bind(null, message.id)}>
                  <DeleteButton />
                </form>
              </div>
            </div>
          </article>
        ))}
        {messages.length === 0 ? <p className="text-sm text-rosewood/70">还没有留言。</p> : null}
      </div>
    </section>
  );
}
