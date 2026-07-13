'use client';

import { useEffect, useState } from 'react';
import { readUniversalStoreData } from '@/lib/demo-store';
import PremiumHero from '@/components/PremiumHero';
import ProductCard from '@/components/ProductCard';

export default function HomePage() {
  const [hydrated, setHydrated] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({ storeName: '', themeColor: '#0F4B5F' });

  useEffect(() => {
    const loadStoreData = async () => {
      const data = readUniversalStoreData();

      setProducts(data.products ?? []);
      setSettings(data.settings ?? { storeName: '', themeColor: '#0F4B5F' });
      setHydrated(true);
    };

    void loadStoreData();
  }, []);

  const storeConfigured = Boolean(settings.storeName && settings.storeName.trim());
  const hasProducts = products.length > 0;
  const freshDrops = products.slice(0, 4);
  const moreGoods = products.slice(4);

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950">
        <div className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center px-6 py-24">
          <div className="flex items-center gap-3 rounded-full border border-zinc-200 bg-white px-5 py-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-white" />
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">Loading storefront…</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <PremiumHero
        storeName={settings.storeName || 'My Store'}
        primaryColor={settings.themeColor || '#0F4B5F'}
      />

      <div className="mx-auto max-w-7xl px-6 pb-24">
        {hydrated && hasProducts && (
          <>
            <section className="mb-24">
              <div className="mb-10 flex items-center gap-3">
                <span className="h-2 w-2 animate-pulse rounded-full" style={{ backgroundColor: settings.themeColor }} />
                <p className="text-xs font-medium uppercase tracking-[0.32em] text-zinc-400 sm:text-sm">Fresh Drops</p>
              </div>
              <h2 className="mb-10 font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
                Just Listed
              </h2>
              <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
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

            {moreGoods.length > 0 && (
              <section>
                <p className="mb-10 text-xs font-medium uppercase tracking-[0.32em] text-zinc-400 sm:text-sm">Explore All</p>
                <div className="grid grid-cols-2 gap-6 md:grid-cols-3 md:gap-8 lg:grid-cols-4">
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
          </>
        )}

        {hydrated && !hasProducts && (
          <section className="py-24 text-center">
            {!storeConfigured ? (
              <>
                <h2 className="mb-4 font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
                  Launch your store
                </h2>
                <p className="text-lg font-medium tracking-wide text-zinc-400 dark:text-zinc-600">
                  Set your store name and branding first, then start adding products.
                </p>
                <a
                  href="/setup-wizard"
                  className="mt-6 inline-flex min-h-[56px] items-center justify-center rounded-full px-8 py-3 text-sm font-semibold tracking-wide text-white"
                  style={{ backgroundColor: settings.themeColor }}
                >
                  Launch Your Store
                </a>
              </>
            ) : (
              <>
                <h2 className="mb-4 font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
                  Your store is live
                </h2>
                <p className="text-lg font-medium tracking-wide text-zinc-400 dark:text-zinc-600">
                  Everything is set up. Now let&apos;s add your very first product.
                </p>
                <a
                  href="/sell"
                  className="mt-6 inline-flex min-h-[56px] items-center justify-center rounded-full px-8 py-3 text-sm font-semibold tracking-wide text-white"
                  style={{ backgroundColor: settings.themeColor }}
                >
                  Add My First Product
                </a>
              </>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
