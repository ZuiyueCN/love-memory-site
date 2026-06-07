import { Heart } from "lucide-react";

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="glass-panel rounded-android px-6 py-12 text-center">
      <div className="mx-auto grid size-14 place-items-center rounded-3xl bg-blush/20 text-coral">
        <Heart className="size-6 fill-current" />
      </div>
      <h2 className="mt-5 text-xl font-black text-ink">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-rosewood/72">{body}</p>
    </div>
  );
}
