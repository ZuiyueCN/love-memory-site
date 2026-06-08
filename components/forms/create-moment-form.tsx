"use client";

import { type FormEvent, useActionState, useState } from "react";
import { Images } from "lucide-react";
import { createMomentPostAction } from "@/app/actions";
import { compressImageFiles } from "@/components/forms/image-compression";
import { readPhotoTakenDate } from "@/components/forms/photo-date";
import { SubmitButton } from "@/components/forms/submit-button";

const initialState = {
  ok: false,
  message: ""
};

export function CreateMomentForm() {
  const [state, action] = useActionState(createMomentPostAction, initialState);
  const [compressionMessage, setCompressionMessage] = useState("");
  const [dateMessage, setDateMessage] = useState("");
  const [isCompressing, setIsCompressing] = useState(false);

  async function handlePhotosChange(event: FormEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    const form = input.form;
    const dateInput = form?.elements.namedItem("postedAt");

    if (!(dateInput instanceof HTMLInputElement)) {
      return;
    }

    const takenDate = await readPhotoTakenDate(file);

    if (takenDate) {
      dateInput.value = takenDate;
      setDateMessage(`已根据第一张照片识别日期：${takenDate}`);
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
    const input = form.elements.namedItem("photos");

    if (!(input instanceof HTMLInputElement) || !input.files?.length) {
      return;
    }

    setCompressionMessage(`正在压缩 ${input.files.length} 张图片，请稍等...`);
    setIsCompressing(true);

    try {
      const originalTotalSize = Array.from(input.files).reduce((total, file) => total + file.size, 0);
      const compressedFiles = await compressImageFiles(input.files);
      const compressedTotalSize = compressedFiles.reduce((total, file) => total + file.size, 0);
      const transfer = new DataTransfer();

      for (const file of compressedFiles) {
        transfer.items.add(file);
      }

      input.files = transfer.files;
      setCompressionMessage(compressedTotalSize < originalTotalSize ? "组图已自动压缩并转成普通 JPG，正在上传..." : "组图已转成普通 JPG，正在上传...");
      form.dataset.compressed = "true";
      setIsCompressing(false);
      requestAnimationFrame(() => {
        form.requestSubmit();
      });
    } catch (error) {
      setCompressionMessage(error instanceof Error ? error.message : "图片压缩失败，请换一组照片再试。");
      setIsCompressing(false);
    }
  }

  return (
    <form action={action} onSubmit={handleSubmit} className="soft-card rounded-android p-5">
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
            onChange={handlePhotosChange}
            required
          />
          <span className="mt-2 block text-xs font-bold text-rosewood/60">最多 9 张，照片会在上传前自动转成普通 JPG，大图会压缩到每张 4MB 以内，避免 HDR 闪烁。</span>
          {dateMessage ? <span className="mt-2 block text-xs font-black text-coral">{dateMessage}</span> : null}
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
      {compressionMessage ? <p className="mt-4 rounded-2xl bg-blush/16 px-4 py-3 text-sm font-bold text-rosewood">{compressionMessage}</p> : null}
      <SubmitButton className="primary-button mt-5 w-full" disabled={isCompressing}>
        {isCompressing ? "正在压缩组图..." : "发布组图动态"}
      </SubmitButton>
    </form>
  );
}
