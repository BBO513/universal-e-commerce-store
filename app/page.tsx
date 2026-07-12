import { getProducts, getStoreSettings } from '@/lib/db';
import { hydrateFromCookie } from '@/lib/demo-store';
import { cookies } from 'next/headers';
import PremiumHero from '@/components/PremiumHero';
import ProductCard from '@/components/ProductCard';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let products: any[] = [];
  let settings: any = { store_name: 'My Store', primary_color: '#0F4B5F' };
  let storeConfigured = false;

  try {
    const demoCookie = cookies().get('demo_data')?.value;
    if (demoCookie) {
      hydrateFromCookie(demoCookie);
    }
  } catch {
    // cookie not available
  }

  try {
    products = await getProducts();
    console.log('HOMEPAGE: Reading demo_data cookie, products count:', products.length);
  } catch {
    products = [];
  }

  try {
    const dbSettings = await getStoreSettings();
    if (dbSettings) {
      settings = dbSettings;
      storeConfigured = dbSettings.store_name !== 'My Store' && dbSettings.store_name !== '';
    }
  } catch {
    // Fall back to defaults already set
  }

  const freshDrops = products.slice(0, 4);
  const moreGoods = products.slice(4);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <PremiumHero
        storeName={settings.store_name}
        primaryColor={settings.primary_color}
      />

      <div className="max-w-7xl mx-auto px-6 pb-24">
        {freshDrops.length > 0 && (
          <section className="mb-24">
            <div className="flex items-center gap-3 mb-10">
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: settings.primary_color }}
              />
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
            {!storeConfigured ? (
              <>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4 font-[family-name:var(--font-heading)]">
                  Welcome. Let's build your business.
                </h2>
                <p className="text-zinc-400 dark:text-zinc-600 text-lg font-medium tracking-wide">
                  Before you can sell, we need to set up your store's name and branding.
                </p>
                <a
                  href="/setup-wizard"
                  className="inline-block mt-6 px-8 py-3 rounded-full text-white text-sm font-semibold tracking-wide transition-colors hover:opacity-90"
                  style={{ backgroundColor: settings.primary_color }}
                >
                  Launch My Store
                </a>
              </>
            ) : (
              <>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4 font-[family-name:var(--font-heading)]">
                  Your store is live!
                </h2>
                <p className="text-zinc-400 dark:text-zinc-600 text-lg font-medium tracking-wide">
                  Everything is set up. Now let's add your very first product.
                </p>
                <a
                  href="/sell"
                  className="inline-block mt-6 px-8 py-3 rounded-full text-white text-sm font-semibold tracking-wide transition-colors hover:opacity-90"
                  style={{ backgroundColor: settings.primary_color }}
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
