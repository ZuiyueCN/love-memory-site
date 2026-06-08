"use client";

import { type FormEvent, useActionState, useState } from "react";
import { ImagePlus } from "lucide-react";
import { createPhotoAction } from "@/app/actions";
import { compressImageFile } from "@/components/forms/image-compression";
import { readPhotoTakenDate } from "@/components/forms/photo-date";
import { SubmitButton } from "@/components/forms/submit-button";

const initialState = {
  ok: false,
  message: ""
};

export function CreatePhotoForm() {
  const [state, action] = useActionState(createPhotoAction, initialState);
  const [compressionMessage, setCompressionMessage] = useState("");
  const [dateMessage, setDateMessage] = useState("");
  const [isCompressing, setIsCompressing] = useState(false);

  async function handlePhotoChange(event: FormEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    const form = input.form;
    const dateInput = form?.elements.namedItem("takenAt");

    if (!(dateInput instanceof HTMLInputElement)) {
      return;
    }

    const takenDate = await readPhotoTakenDate(file);

    if (takenDate) {
      dateInput.value = takenDate;
      setDateMessage(`已自动识别拍摄日期：${takenDate}`);
    } else {
      setDateMessage("没有读到照片拍摄日期，可以手动选择。");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;

    if (form.dataset.compressed === "true") {
      delete form.dataset.compressed;
      return;
    }

    event.preventDefault();
    const input = form.elements.namedItem("photo");

    if (!(input instanceof HTMLInputElement) || !input.files?.[0]) {
      return;
    }

    setCompressionMessage("正在压缩图片，请稍等...");
    setIsCompressing(true);

    try {
      const originalSize = input.files[0].size;
      const compressedFile = await compressImageFile(input.files[0]);
      const transfer = new DataTransfer();
      transfer.items.add(compressedFile);
      input.files = transfer.files;

      setCompressionMessage(compressedFile.size < originalSize ? "图片已自动压缩并转成普通 JPG，正在上传..." : "图片已转成普通 JPG，正在上传...");
      form.dataset.compressed = "true";
      setIsCompressing(false);
      requestAnimationFrame(() => {
        form.requestSubmit();
      });
    } catch (error) {
      setCompressionMessage(error instanceof Error ? error.message : "图片压缩失败，请换一张照片再试。");
      setIsCompressing(false);
    }
  }

  return (
    <form action={action} onSubmit={handleSubmit} className="soft-card rounded-android p-5">
      <div className="flex items-center gap-2">
        <ImagePlus className="size-5 text-coral" />
        <h2 className="text-lg font-black text-ink">添加照片</h2>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-2 block text-sm font-bold text-rosewood">照片文件</span>
          <input
            className="field file:mr-3 file:rounded-full file:border-0 file:bg-blush/25 file:px-4 file:py-2 file:text-sm file:font-bold file:text-rosewood"
            type="file"
            name="photo"
            accept="image/*"
            onChange={handlePhotoChange}
            required
          />
          <span className="mt-2 block text-xs font-bold text-rosewood/60">照片会在上传前自动转成普通 JPG，大图会压缩到 4MB 以内，避免 HDR 闪烁。</span>
          {dateMessage ? <span className="mt-2 block text-xs font-black text-coral">{dateMessage}</span> : null}
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
      {compressionMessage ? <p className="mt-4 rounded-2xl bg-blush/16 px-4 py-3 text-sm font-bold text-rosewood">{compressionMessage}</p> : null}
      <SubmitButton className="primary-button mt-5 w-full" disabled={isCompressing}>
        {isCompressing ? "正在压缩图片..." : "上传并保存照片"}
      </SubmitButton>
    </form>
  );
}
