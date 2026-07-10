interface HeroSectionProps {
  headline: string;
  subheadline: string;
}

export default function HeroSection({ headline, subheadline }: HeroSectionProps) {
  return (
    <article className="relative overflow-hidden rounded-3xl border border-slate-700/70 bg-slate-900/95 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.35)] transition-all duration-500 ease-in-out">
      <div className="aspect-[16/9] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(148,163,184,0.16),_transparent_35%)]" />
      </div>
      <div className="mt-8 rounded-3xl border border-slate-700/70 bg-slate-950/90 p-8 backdrop-blur-md">
        <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Your high-end storefront</p>
        <h1 className="mt-4 text-5xl font-bold tracking-tight text-white sm:text-6xl">{headline}</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">{subheadline}</p>
      </div>
    </article>
  );
}
