import Link from 'next/link';
import { categories, getProductsByCategory } from '@/lib/config';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

const CategoryPage = ({ params }: CategoryPageProps) => {
  const products = getProductsByCategory(params.slug);
  const category = categories.find((item) => item.slug === params.slug);

  if (!category) {
    return (
      <div className="min-h-screen bg-slate-950 py-16 text-center text-slate-200">
        <p className="text-lg font-semibold">Category not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-12 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">{category.name}</p>
            <h1 className="mt-3 text-4xl font-semibold text-white">{category.name}</h1>
            <p className="mt-4 max-w-2xl text-slate-400">{category.description}</p>
          </div>
          <p className="text-sm text-slate-500">{products.length} product{products.length === 1 ? '' : 's'}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group block overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-900/80 shadow-xl shadow-slate-950/40 transition hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-slate-800/95"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-slate-700">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <span className="inline-flex rounded-full bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-cyan-200">
                  {product.categoryName}
                </span>
                <h2 className="mt-4 text-2xl font-semibold text-white">{product.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">{product.description}</p>
                <div className="mt-6 flex items-center justify-between text-sm text-slate-300">
                  <span className="font-semibold text-white">${product.price.toFixed(2)}</span>
                  <span>{product.stock} in stock</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
