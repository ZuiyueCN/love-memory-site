"use client";

import { useActionState } from "react";
import { ImagePlus } from "lucide-react";
import { createPhotoAction } from "@/app/actions";
import { SubmitButton } from "@/components/forms/submit-button";

const initialState = {
  ok: false,
  message: ""
};

export function CreatePhotoForm() {
  const [state, action] = useActionState(createPhotoAction, initialState);

  return (
    <form action={action} className="soft-card rounded-android p-5">
      <div className="flex items-center gap-2">
        <ImagePlus className="size-5 text-coral" />
        <h2 className="text-lg font-black text-ink">添加照片</h2>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-2 block text-sm font-bold text-rosewood">照片文件</span>
          <input className="field file:mr-3 file:rounded-full file:border-0 file:bg-blush/25 file:px-4 file:py-2 file:text-sm file:font-bold file:text-rosewood" type="file" name="photo" accept="image/*" required />
          <span className="mt-2 block text-xs font-bold text-rosewood/60">建议上传 4MB 以内的 JPG / PNG / WebP 图片。</span>
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-rosewood">标题</span>
          <input className="field" name="title" placeholder="比如：第一次一起看海" required />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-rosewood">日期</span>
          <input className="field" type="date" name="takenAt" required />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-rosewood">地点</span>
          <input className="field" name="location" placeholder="城市 / 餐厅 / 景点" />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-rosewood">分类</span>
          <input className="field" name="category" defaultValue="日常" required />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-2 block text-sm font-bold text-rosewood">描述</span>
          <textarea className="field min-h-24 resize-y" name="description" placeholder="写下这张照片背后的故事" />
        </label>
        <label className="flex items-center gap-3 rounded-2xl bg-white/62 px-4 py-3 text-sm font-bold text-rosewood">
          <input type="checkbox" name="isFeatured" className="size-5 accent-coral" />
          设为首页精选
        </label>
      </div>
      {state.message ? (
        <p className={`mt-4 rounded-2xl px-4 py-3 text-sm font-bold ${state.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {state.message}
        </p>
      ) : null}
      <SubmitButton className="primary-button mt-5 w-full">上传并保存照片</SubmitButton>
    </form>
  );
}
