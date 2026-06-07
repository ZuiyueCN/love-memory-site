"use client";

import { Trash2 } from "lucide-react";
import { useFormStatus } from "react-dom";

export function DeleteButton({ label = "删除" }: { label?: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(event) => {
        if (!window.confirm("确认删除这条内容吗？")) {
          event.preventDefault();
        }
      }}
      className="inline-flex items-center justify-center gap-1 rounded-full border border-red-200 bg-red-50 px-3 py-2 text-xs font-black text-red-600 transition hover:bg-red-100 disabled:opacity-60"
    >
      <Trash2 className="size-3.5" />
      {pending ? "处理中" : label}
    </button>
  );
}
