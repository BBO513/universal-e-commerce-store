
import Link from 'next/link';
import FadeAspectImage from './FadeAspectImage';

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  images: string[];
  condition: 'new' | 'used';
  stock: number;
  brand?: string;
}

export default function ProductCard({ id, title, price, images, condition, stock, brand }: ProductCardProps) {
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
    }).format(value);
  };

  const getStockBadge = (currentStock: number) => {
    if (currentStock === 0) {
      return <span className="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded">Out of stock</span>;
    } else if (currentStock < 10) {
      return <span className="bg-yellow-500 text-white text-xs font-semibold px-2 py-0.5 rounded">Low stock</span>;
    } else {
      return <span className="bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded">In stock</span>;
    }
  };

  return (
    <Link
      href={`/product/${id}`}
      className="group block card-surface hover:-translate-y-0.5"
    >
      {images && images.length > 0 ? (
        <FadeAspectImage
          src={images[0]}
          alt={title}
          aspect="aspect-square"
          wrapperClassName="w-full"
          className="group-hover:scale-105"
        />
      ) : (
        <div className="w-full aspect-square flex items-center justify-center text-slate-400 rounded-3xl bg-slate-100">No Image</div>
      )}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-950 truncate">{title}</h3>
        </div>
        <p className="text-slate-700 text-base mt-4">{formatPrice(price)}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full text-white ${
              condition === 'new' ? 'bg-boutique-accent' : 'bg-slate-500'
            }`}
          >
            {condition === 'new' ? 'New' : 'Used'}
          </span>
          {getStockBadge(stock)}
        </div>
      </div>
    </Link>
  );
}
