export function SectionHeading({
  eyebrow,
  title,
  body
}: {
  eyebrow: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-coral">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-black leading-tight text-ink sm:text-4xl">{title}</h2>
      {body ? <p className="mt-4 text-sm leading-7 text-rosewood/72 sm:text-base">{body}</p> : null}
    </div>
  );
}
