export default function HeroSkeleton() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-900/95 p-6 shadow-2xl shadow-slate-950/25 transition-all duration-500 ease-in-out animate-shimmer">
      <div className="aspect-[16/9] w-full rounded-2xl bg-slate-800" />
      <div className="absolute inset-x-0 bottom-0 px-6 pb-8">
        <div className="rounded-2xl border border-slate-700/80 bg-slate-950/80 p-5 backdrop-blur-md">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Constructing your storefront...</p>
        </div>
      </div>
    </section>
  );
}
