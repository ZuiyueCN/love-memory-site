"use client";

import { useActionState } from "react";
import { Images } from "lucide-react";
import { createMomentPostAction } from "@/app/actions";
import { SubmitButton } from "@/components/forms/submit-button";

const initialState = {
  ok: false,
  message: ""
};

export function CreateMomentForm() {
  const [state, action] = useActionState(createMomentPostAction, initialState);

  return (
    <form action={action} className="soft-card rounded-android p-5">
      <div className="flex items-center gap-2">
        <Images className="size-5 text-coral" />
        <h2 className="text-lg font-black text-ink">发布组图动态</h2>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-2 block text-sm font-bold text-rosewood">组图照片</span>
          <input
            className="field file:mr-3 file:rounded-full file:border-0 file:bg-blush/25 file:px-4 file:py-2 file:text-sm file:font-bold file:text-rosewood"
            type="file"
            name="photos"
            accept="image/*"
            multiple
            required
          />
          <span className="mt-2 block text-xs font-bold text-rosewood/60">最多 9 张，每张 4MB 以内。发布后会同步保存到相册的“动态”分类。</span>
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-rosewood">标题</span>
          <input className="field" name="title" placeholder="比如：周末约会九宫格" required />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-rosewood">日期</span>
          <input className="field" type="date" name="postedAt" required />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-2 block text-sm font-bold text-rosewood">地点</span>
          <input className="field" name="location" placeholder="可选，比如：杭州西湖" />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-2 block text-sm font-bold text-rosewood">正文</span>
          <textarea className="field min-h-28 resize-y" name="body" placeholder="像朋友圈一样写下这一组照片的故事" required />
        </label>
      </div>
      {state.message ? (
        <p className={`mt-4 rounded-2xl px-4 py-3 text-sm font-bold ${state.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {state.message}
        </p>
      ) : null}
      <SubmitButton className="primary-button mt-5 w-full">发布组图动态</SubmitButton>
    </form>
  );
}
