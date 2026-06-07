"use client";

import { useActionState } from "react";
import { CalendarPlus } from "lucide-react";
import { createTimelineAction } from "@/app/actions";
import { SubmitButton } from "@/components/forms/submit-button";

type PhotoOption = {
  id: string;
  title: string;
};

const initialState = {
  ok: false,
  message: ""
};

export function CreateTimelineForm({ photos }: { photos: PhotoOption[] }) {
  const [state, action] = useActionState(createTimelineAction, initialState);

  return (
    <form action={action} className="soft-card rounded-android p-5">
      <div className="flex items-center gap-2">
        <CalendarPlus className="size-5 text-coral" />
        <h2 className="text-lg font-black text-ink">添加时间线</h2>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-rosewood">标题</span>
          <input className="field" name="title" placeholder="比如：在一起的第一天" required />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-rosewood">日期</span>
          <input className="field" type="date" name="happenedAt" required />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-rosewood">排序</span>
          <input className="field" type="number" name="order" defaultValue="0" />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-rosewood">关联照片</span>
          <select className="field" name="photoId" defaultValue="">
            <option value="">不关联照片</option>
            {photos.map((photo) => (
              <option key={photo.id} value={photo.id}>
                {photo.title}
              </option>
            ))}
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-2 block text-sm font-bold text-rosewood">正文</span>
          <textarea className="field min-h-28 resize-y" name="body" placeholder="记录这一刻发生了什么" required />
        </label>
      </div>
      {state.message ? (
        <p className={`mt-4 rounded-2xl px-4 py-3 text-sm font-bold ${state.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {state.message}
        </p>
      ) : null}
      <SubmitButton className="primary-button mt-5 w-full">保存时间线节点</SubmitButton>
    </form>
  );
}
