import Link from 'next/link';
import { categories } from '@/lib/config';

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-slate-950 py-12 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Product categories</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Browse all categories
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300">
            Explore every category powered directly from the storefront configuration.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group block rounded-[1.5rem] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/40 transition hover:-translate-y-1 hover:border-cyan-300/20 hover:bg-slate-800/90"
            >
              <div className="flex flex-col h-full">
                <h2 className="text-2xl font-semibold text-white">{category.name}</h2>
                <p className="mt-4 text-slate-400 flex-grow">{category.description}</p>
                <div className="mt-6 flex items-center justify-between text-sm font-semibold text-cyan-200">
                  <span>{category.count} product{category.count === 1 ? '' : 's'}</span>
                  <span>View products →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
