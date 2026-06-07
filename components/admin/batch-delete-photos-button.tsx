"use client";

import { Trash2 } from "lucide-react";
import { useFormStatus } from "react-dom";

export function BatchDeletePhotosButton({ formId }: { formId: string }) {
  const { pending } = useFormStatus();

  function getPhotoCheckboxes() {
    return Array.from(document.querySelectorAll<HTMLInputElement>(`input[name="photoIds"][form="${formId}"]`));
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <label className="inline-flex items-center gap-2 rounded-full bg-white/72 px-3 py-2 text-xs font-black text-rosewood">
        <input
          type="checkbox"
          className="size-4 accent-coral"
          onChange={(event) => {
            getPhotoCheckboxes().forEach((checkbox) => {
              checkbox.checked = event.currentTarget.checked;
            });
          }}
        />
        全选当前列表
      </label>
      <button
        type="submit"
        disabled={pending}
        onClick={(event) => {
          const selectedCount = getPhotoCheckboxes().filter((checkbox) => checkbox.checked).length;

          if (selectedCount === 0) {
            event.preventDefault();
            window.alert("请先勾选要删除的照片。");
            return;
          }

          if (!window.confirm(`确认删除选中的 ${selectedCount} 张照片吗？删除后不可恢复。`)) {
            event.preventDefault();
          }
        }}
        className="inline-flex items-center justify-center gap-1 rounded-full border border-red-200 bg-red-50 px-3 py-2 text-xs font-black text-red-600 transition hover:bg-red-100 disabled:opacity-60"
      >
        <Trash2 className="size-3.5" />
        {pending ? "处理中" : "删除选中照片"}
      </button>
    </div>
  );
}
