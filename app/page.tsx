import { getProducts } from '@/lib/db';
import PremiumHero from '@/components/PremiumHero';
import ProductCard from '@/components/ProductCard';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let products: any[] = [];

  try {
    products = await getProducts();
  } catch {
    products = [];
  }

  const freshDrops = products.slice(0, 4);
  const moreGoods = products.slice(4);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <PremiumHero />

      <div className="max-w-7xl mx-auto px-6 pb-24">
        {freshDrops.length > 0 && (
          <section className="mb-24">
            <div className="flex items-center gap-3 mb-10">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs sm:text-sm uppercase tracking-[0.32em] text-zinc-400 font-medium">
                Fresh Drops
              </p>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white mb-10 font-[family-name:var(--font-heading)]">
              Just Listed
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {freshDrops.map((product) => (
                <ProductCard
                  key={product.id}
                  id={String(product.id)}
                  title={product.title}
                  price={Number(product.price)}
                  images={product.images || []}
                  condition={product.condition || 'new'}
                  stock={product.stock ?? 1}
                  brand={product.brand}
                  showAddToCart
                />
              ))}
            </div>
          </section>
        )}

        {moreGoods.length > 0 && (
          <section>
            <p className="text-xs sm:text-sm uppercase tracking-[0.32em] text-zinc-400 mb-10 font-medium">
              Explore All
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {moreGoods.map((product) => (
                <ProductCard
                  key={product.id}
                  id={String(product.id)}
                  title={product.title}
                  price={Number(product.price)}
                  images={product.images || []}
                  condition={product.condition || 'new'}
                  stock={product.stock ?? 1}
                  brand={product.brand}
                  showAddToCart
                />
              ))}
            </div>
          </section>
        )}

        {products.length === 0 && (
          <section className="text-center py-32">
            <p className="text-zinc-400 dark:text-zinc-600 text-lg font-medium tracking-wide">
              No products yet. Be the first to list something.
            </p>
            <a
              href="/sell"
              className="inline-block mt-6 px-8 py-3 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold tracking-wide hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
            >
              List Your Item
            </a>
          </section>
        )}
      </div>
    </div>
  );
}
