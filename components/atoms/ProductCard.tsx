interface ProductCardProps {
  title: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string;
  onClick?: () => void;
}

export default function ProductCard({ title, description, price, category, imageUrl, onClick }: ProductCardProps) {
  return (
    <article
      onClick={onClick}
      className="cursor-pointer overflow-hidden rounded-[1.75rem] border border-slate-700/70 bg-slate-900/90 p-5 shadow-xl shadow-slate-950/20 transition hover:-translate-y-0.5 hover:border-cyan-400/40"
    >
      <div className="aspect-[4/3] w-full overflow-hidden rounded-[1.5rem] bg-slate-800">
        <img src={imageUrl} alt={title} className="h-full w-full object-cover" />
      </div>
      <div className="mt-5 space-y-3">
        <span className="inline-flex rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
          {category}
        </span>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="text-sm leading-6 text-slate-400">{description}</p>
        <div className="mt-4 flex items-center justify-between gap-4">
          <span className="text-lg font-semibold text-white">{price}</span>
          <span className="text-xs uppercase tracking-[0.24em] text-slate-400">Ready to ship</span>
        </div>
      </div>
    </article>
  );
}
