"use client";

import { useActionState } from "react";
import { Send } from "lucide-react";
import { createGuestbookMessageAction } from "@/app/actions";
import { SubmitButton } from "@/components/forms/submit-button";

const initialState = {
  ok: false,
  message: ""
};

export function GuestbookForm() {
  const [state, action] = useActionState(createGuestbookMessageAction, initialState);

  return (
    <form action={action} className="glass-panel rounded-android p-5">
      <h2 className="text-lg font-black text-ink">写一条留言</h2>
      <div className="mt-4 grid gap-4">
        <input className="field" name="author" placeholder="你的昵称" required maxLength={24} />
        <textarea className="field min-h-28 resize-y" name="body" placeholder="留下祝福、建议或者一句悄悄话" required maxLength={500} />
      </div>
      {state.message ? (
        <p className={`mt-4 rounded-2xl px-4 py-3 text-sm font-bold ${state.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {state.message}
        </p>
      ) : null}
      <SubmitButton className="primary-button mt-5 w-full">
        <Send className="size-4" />
        发布留言
      </SubmitButton>
    </form>
  );
}
