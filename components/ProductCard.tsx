
import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  images: string[];
  condition: 'new' | 'used';
  stock: number;
  brand?: string;
  model_compatibility?: string[];
  vehicle_year_start?: number;
  vehicle_year_end?: number;
  selectedVehicle: SelectedVehicle | null;
}

interface SelectedVehicle {
  make: string;
  model: string;
  year: number;
}

export default function ProductCard({ id, title, price, images, condition, stock, brand, model_compatibility, vehicle_year_start, vehicle_year_end, selectedVehicle }: ProductCardProps) {
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

  const checkCompatibility = (productBrand?: string, productModelCompatibility?: string[], productYearStart?: number, productYearEnd?: number, vehicle: SelectedVehicle | null) => {
    if (!vehicle) return false;

    // Check brand compatibility
    const brandMatch = !productBrand || productBrand.toLowerCase() === vehicle.make.toLowerCase();
    if (!brandMatch) return false;

    // Check model compatibility
    const modelMatch = !productModelCompatibility || productModelCompatibility.some(
      (model) => model.toLowerCase() === vehicle.model.toLowerCase()
    );
    if (!modelMatch) return false;

    // Check year compatibility
    const yearMatch = (!productYearStart || vehicle.year >= productYearStart) &&
                      (!productYearEnd || vehicle.year <= productYearEnd);
    
    return brandMatch && modelMatch && yearMatch;
  };

  const fitsVehicle = checkCompatibility(brand, model_compatibility, vehicle_year_start, vehicle_year_end, selectedVehicle);

  return (
    <Link href={`/product/${id}`} className="block border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out overflow-hidden">
      <div className="relative w-full h-48 bg-gray-100">
        {images && images.length > 0 ? (
          <Image
            src={images[0]}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 ease-in-out hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">{title}</h3>
        {fitsVehicle && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
            Fits Your Vehicle!
          </span>
        )}
        <p className="text-gray-600 text-sm mt-1">{formatPrice(price)}</p>
        <div className="flex items-center justify-between mt-2">
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded ${
              condition === 'new' ? 'bg-blue-500 text-white' : 'bg-purple-500 text-white'
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
