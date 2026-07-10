export default function SkeletonCard() {
  return (
    <article className="overflow-hidden rounded-xl border border-slate-700/70 bg-slate-900/95 p-5 shadow-xl shadow-slate-950/20 transition-all duration-500 ease-in-out animate-shimmer">
      <div className="aspect-[4/3] w-full rounded-xl bg-slate-800" />
      <div className="mt-5 space-y-3">
        <div className="h-5 w-3/4 rounded-full bg-slate-800" />
        <div className="h-4 w-1/2 rounded-full bg-slate-800" />
        <div className="flex items-center justify-between gap-4">
          <div className="h-4 w-1/4 rounded-full bg-slate-800" />
          <div className="h-4 w-1/3 rounded-full bg-slate-800" />
        </div>
      </div>
    </article>
  );
}
