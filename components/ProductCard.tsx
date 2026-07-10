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
    <Link
      href={`/product/${id}`}
      className="group block"
    >
      <div className="relative overflow-hidden rounded-3xl bg-zinc-100 dark:bg-zinc-900 mb-4">
        {images && images.length > 0 ? (
          <img
            src={images[0]}
            alt={title}
            className="w-full aspect-square object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full aspect-square flex items-center justify-center text-zinc-400 dark:text-zinc-600 text-sm font-medium">
            No Image
          </div>
        )}
        {showAddToCart && stock > 0 && (
          <button
            onClick={handleAddToCart}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg shadow-black/10 hover:bg-white dark:hover:bg-zinc-800"
            aria-label="Add to cart"
          >
            <Plus className="w-5 h-5 text-zinc-900 dark:text-white" />
          </button>
        )}
      </div>
      <div className="px-1">
        <h3 className="text-sm sm:text-base font-bold tracking-tight text-zinc-900 dark:text-white truncate font-[family-name:var(--font-heading)]">
          {title}
        </h3>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 tracking-wide">
          {formatPrice(price)}
        </p>
      </div>
    </Link>
  );
}
