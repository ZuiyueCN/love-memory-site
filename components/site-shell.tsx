import Link from "next/link";
import { CalendarHeart, Camera, Heart, Home, Images, LockKeyhole, MessageCircleHeart, Sparkles } from "lucide-react";
import { getCurrentAdminEmail } from "@/lib/auth";
import { RestoreScroll } from "@/components/restore-scroll";
import { ScrollProgress } from "@/components/scroll-progress";

const navItems = [
  { href: "/", label: "首页", icon: Home },
  { href: "/album", label: "相册", icon: Camera },
  { href: "/timeline", label: "时间线", icon: CalendarHeart },
  { href: "/moments", label: "动态", icon: Images },
  { href: "/guestbook", label: "留言", icon: MessageCircleHeart }
];

export async function SiteShell({ children }: { children: React.ReactNode }) {
  const adminEmail = await getCurrentAdminEmail();

  return (
    <div className="relative min-h-screen overflow-hidden pb-24 md:pb-8">
      <RestoreScroll />
      <ScrollProgress />
      <div className="ambient-layer" aria-hidden="true" />
      <header className="sticky top-0 z-40 border-b border-white/50 bg-cream/72 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="group flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-white/80 text-coral shadow-lift transition duration-300 group-hover:rotate-[-8deg] group-hover:scale-105">
              <Heart className="size-5 fill-current" />
            </span>
            <span>
              <span className="block text-sm font-black text-ink sm:text-base">我们的纪念册</span>
              <span className="hidden text-xs text-rosewood/70 sm:block">把日子写成甜甜的故事</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="ghost-button nav-pill px-4 py-2 text-sm">
                <item.icon className="size-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          <Link href={adminEmail ? "/admin" : "/login"} className="primary-button px-4 py-2 text-sm">
            {adminEmail ? <Sparkles className="size-4" /> : <LockKeyhole className="size-4" />}
            {adminEmail ? "管理" : "主人登录"}
          </Link>
        </div>
      </header>

      <div className="relative z-10">{children}</div>

      <nav className="fixed inset-x-3 bottom-4 z-50 grid grid-cols-5 rounded-[26px] border border-white/70 bg-white/78 p-2 shadow-soft backdrop-blur-2xl md:hidden">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-[20px] text-xs font-bold text-rosewood transition hover:bg-blush/18"
          >
            <item.icon className="size-5" />
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
