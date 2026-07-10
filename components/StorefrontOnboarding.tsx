'use client';

import { useEffect, useState } from 'react';
import GuidePanel from './atoms/GuidePanel';
import HeroSkeleton from './atoms/HeroSkeleton';
import HeroSection from './atoms/HeroSection';
import ProductCard from './atoms/ProductCard';
import SkeletonCard from './atoms/SkeletonCard';
import PrimaryButton from './atoms/PrimaryButton';

const genericStorefrontTemplate = {
  hero: {
    headline: 'Welcome to your new storefront. Start selling today.',
    subheadline:
      'A clean, professional storefront ready to showcase products and convert customers from the first interaction.',
  },
  products: [
    {
      id: 'featured-product-1',
      title: 'Featured Product 1',
      description: 'A compelling product your customers can buy right away.',
      price: '$49.00',
      category: 'Featured',
      imageUrl: 'https://via.placeholder.com/600x450?text=Featured+Product+1',
    },
    {
      id: 'featured-product-2',
      title: 'Featured Product 2',
      description: 'A polished offering with strong visual appeal and clear value.',
      price: '$69.00',
      category: 'Featured',
      imageUrl: 'https://via.placeholder.com/600x450?text=Featured+Product+2',
    },
    {
      id: 'featured-product-3',
      title: 'Featured Product 3',
      description: 'A customer-ready item that supports a strong conversion path.',
      price: '$99.00',
      category: 'Featured',
      imageUrl: 'https://via.placeholder.com/600x450?text=Featured+Product+3',
    },
  ],
};

const industryTemplates: Record<string, typeof genericStorefrontTemplate> = {
  'General E-commerce': genericStorefrontTemplate,
  Fashion: {
    hero: {
      headline: 'Launch your fashion storefront today.',
      subheadline: 'Present your apparel and accessories with a polished, customer-first design.',
    },
    products: [
      {
        id: 'featured-product-1',
        title: 'Featured Product 1',
        description: 'A stylish bestseller your audience will love.',
        price: '$59.00',
        category: 'Fashion',
        imageUrl: 'https://via.placeholder.com/600x450?text=Featured+Product+1',
      },
      {
        id: 'featured-product-2',
        title: 'Featured Product 2',
        description: 'A premium item designed to elevate your collection.',
        price: '$79.00',
        category: 'Fashion',
        imageUrl: 'https://via.placeholder.com/600x450?text=Featured+Product+2',
      },
      {
        id: 'featured-product-3',
        title: 'Featured Product 3',
        description: 'A core piece that turns browsers into buyers.',
        price: '$119.00',
        category: 'Fashion',
        imageUrl: 'https://via.placeholder.com/600x450?text=Featured+Product+3',
      },
    ],
  },
  Electronics: {
    hero: {
      headline: 'Start selling electronics with a confident storefront.',
      subheadline: 'Showcase gadgets and accessories with sharp product presentation and clear calls to action.',
    },
    products: [
      {
        id: 'featured-product-1',
        title: 'Featured Product 1',
        description: 'A standout electronics item with modern appeal.',
        price: '$89.00',
        category: 'Electronics',
        imageUrl: 'https://via.placeholder.com/600x450?text=Featured+Product+1',
      },
      {
        id: 'featured-product-2',
        title: 'Featured Product 2',
        description: 'A high-value gadget offering clear benefits.',
        price: '$129.00',
        category: 'Electronics',
        imageUrl: 'https://via.placeholder.com/600x450?text=Featured+Product+2',
      },
      {
        id: 'featured-product-3',
        title: 'Featured Product 3',
        description: 'A reliable product built for easy purchase decisions.',
        price: '$179.00',
        category: 'Electronics',
        imageUrl: 'https://via.placeholder.com/600x450?text=Featured+Product+3',
      },
    ],
  },
};

const getStorefrontTemplate = (industry: string) => {
  return industryTemplates[industry] ?? genericStorefrontTemplate;
};

export default function StorefrontOnboarding() {
  const [isAssembling, setIsAssembling] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [readyTimestamp, setReadyTimestamp] = useState<number | null>(null);
  const [userActionCount, setUserActionCount] = useState(0);

  const userIndustry =
    typeof window !== 'undefined'
      ? ((window as any).USER_INDUSTRY as string | undefined) ?? 'General E-commerce'
      : 'General E-commerce';

  const storefrontData = getStorefrontTemplate(userIndustry);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsAssembling(false);
      setIsReady(true);
      setReadyTimestamp(Date.now());
    }, 5000);

    return () => window.clearTimeout(timer);
  }, []);

  const handleCardClick = () => {
    setUserActionCount((current) => current + 1);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(148,163,184,0.12),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(100,116,139,0.10),_transparent_28%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col gap-10 px-6 py-10 lg:px-8">
        <GuidePanel
          status={isAssembling ? 'Assembling your storefront' : 'Storefront ready'}
          title={isAssembling ? 'Constructing your storefront...' : 'Your launch-ready draft is complete'}
          body={
            isAssembling
              ? 'A professional storefront wireframe is being built for you. The hero, products, and launch CTA will arrive any moment.'
              : 'Done. I’ve populated your first three featured products and set up your layout. You can click any card to edit it, or hit Launch right now.'
          }
          isReady={isReady}
          readyTimestamp={readyTimestamp}
          userActionCount={userActionCount}
          storefrontSnapshot={storefrontData}
        />

        <main className="grid gap-10 xl:grid-cols-[1.1fr_0.9fr]">
          <section className={`space-y-8 transition-all duration-500 ease-in-out ${isAssembling ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            {isAssembling ? (
              <HeroSkeleton />
            ) : (
              <HeroSection
                headline={storefrontData.hero.headline}
                subheadline={storefrontData.hero.subheadline}
              />
            )}

            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.32em] text-cyan-300">Featured inventory</p>
                  <h2 className="mt-3 text-3xl font-semibold text-white">First three featured products</h2>
                </div>
                {!isAssembling && (
                  <span className="rounded-full bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
                    Populated
                  </span>
                )}
              </div>

              <div className={`grid gap-6 md:grid-cols-3 transition-all duration-500 ease-in-out ${isAssembling ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                {isAssembling ? (
                  Array.from({ length: 3 }).map((_, index) => <SkeletonCard key={index} />)
                ) : (
                  storefrontData.products.map((product) => (
                    <ProductCard
                      key={product.id}
                      title={product.title}
                      description={product.description}
                      price={product.price}
                      category={product.category}
                      imageUrl={product.imageUrl}
                      onClick={handleCardClick}
                    />
                  ))
                )}
              </div>
            </div>
          </section>

          <section className="space-y-8">
            <div className="rounded-[2rem] border border-slate-700/70 bg-slate-900/95 p-6 shadow-2xl shadow-slate-950/15">
              <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Launch readiness</p>
              <div className="mt-4 space-y-4">
                <div className="rounded-[1.75rem] bg-slate-950/70 px-5 py-4 text-sm text-slate-300">
                  <p className="font-medium text-white">Primary CTA status</p>
                  <p className="mt-2 text-sm text-slate-400">
                    {isAssembling
                      ? 'Launch is locked until the storefront is fully assembled.'
                      : 'Your storefront is assembled. You can now launch a real preview.'}
                  </p>
                </div>
                <div className="rounded-[1.75rem] bg-slate-950/70 px-5 py-4 text-sm text-slate-300">
                  <p className="font-medium text-white">Why this matters</p>
                  <p className="mt-2 text-sm text-slate-400">
                    A stable skeleton keeps the page visually consistent and prevents UI flicker while onboarding the first draft.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>

        <div className="pointer-events-none relative h-24" />
      </div>

      <div className="fixed inset-x-0 bottom-6 flex justify-center px-6 sm:px-10">
        <PrimaryButton disabled={isAssembling}>{isAssembling ? 'Launch Store' : 'Launch My Store'}</PrimaryButton>
      </div>
    </div>
  );
}
