"use client";

import { useActionState } from "react";
import { LockKeyhole, Mail } from "lucide-react";
import { loginAction } from "@/app/actions";
import { SubmitButton } from "@/components/forms/submit-button";

const initialState = {
  ok: false,
  message: ""
};

export function LoginForm() {
  const [state, action] = useActionState(loginAction, initialState);

  return (
    <form action={action} className="space-y-4">
      <label className="block">
        <span className="mb-2 flex items-center gap-2 text-sm font-bold text-rosewood">
          <Mail className="size-4" />
          主人邮箱
        </span>
        <input className="field" type="email" name="email" placeholder="you@example.com" required />
      </label>
      <label className="block">
        <span className="mb-2 flex items-center gap-2 text-sm font-bold text-rosewood">
          <LockKeyhole className="size-4" />
          登录密码
        </span>
        <input className="field" type="password" name="password" placeholder="输入管理密码" required />
      </label>
      {state.message ? (
        <p className={`rounded-2xl px-4 py-3 text-sm font-bold ${state.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {state.message}
        </p>
      ) : null}
      <SubmitButton className="primary-button w-full">进入管理后台</SubmitButton>
    </form>
  );
}
