'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Plus } from 'lucide-react';

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  images: string[];
  condition: 'new' | 'used';
  stock: number;
  brand?: string;
  showAddToCart?: boolean;
}

export default function ProductCard({
  id,
  title,
  price,
  images,
  condition,
  stock,
  brand,
  showAddToCart,
}: ProductCardProps) {
  const { addItem } = useCart();

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(parseInt(id, 10), 1);
  };

  return (
    <Link href={`/product/${id}`} className="group block">
      <div className="relative mb-4 overflow-hidden rounded-3xl bg-zinc-100 dark:bg-zinc-900">
        {images && images.length > 0 ? (
          <img
            src={images[0]}
            alt={title}
            className="aspect-square w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex aspect-square w-full items-center justify-center text-sm font-medium text-zinc-400 dark:text-zinc-600">
            No Image
          </div>
        )}
        {showAddToCart && stock > 0 && (
          <button
            onClick={handleAddToCart}
            className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow-lg shadow-black/10 dark:bg-zinc-950/95"
            aria-label="Add to cart"
          >
            <Plus className="h-5 w-5 text-zinc-900 dark:text-white" />
          </button>
        )}
      </div>
      <div className="px-1">
        <h3 className="truncate text-sm font-bold tracking-tight text-zinc-900 dark:text-white sm:text-base font-[family-name:var(--font-heading)]">
          {title}
        </h3>
        <p className="mt-1 text-sm tracking-wide text-zinc-500 dark:text-zinc-400">{formatPrice(price)}</p>
      </div>
    </Link>
  );
}
