import Link from "next/link";
import { Heart, ShieldCheck } from "lucide-react";
import { LoginForm } from "@/components/forms/login-form";
import { getCurrentAdminEmail } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const email = await getCurrentAdminEmail();

  if (email) {
    redirect("/admin");
  }

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link href="/" className="mx-auto mb-6 flex w-max items-center gap-3 text-sm font-black text-rosewood">
          <span className="grid size-11 place-items-center rounded-2xl bg-white/80 text-coral shadow-lift">
            <Heart className="size-5 fill-current" />
          </span>
          返回纪念册
        </Link>
        <section className="glass-panel rounded-[34px] p-6 sm:p-8">
          <div className="mb-7 text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-3xl bg-blush/20 text-coral">
              <ShieldCheck className="size-7" />
            </div>
            <h1 className="mt-5 text-3xl font-black text-ink">主人登录</h1>
            <p className="mt-3 text-sm leading-7 text-rosewood/70">登录后可以上传照片、编辑时间线和记录新的生活片段。</p>
          </div>
          <LoginForm />
        </section>
      </div>
    </main>
  );
}
