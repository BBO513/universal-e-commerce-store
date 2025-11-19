
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

interface FiltersProps {
  initialMinPrice?: number;
  initialMaxPrice?: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function Filters({ initialMinPrice = 0, initialMaxPrice = 1000 }: FiltersProps) {
  const router = useRouter();
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [condition, setCondition] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [brand, setBrand] = useState('');
  const [modelCompatibility, setModelCompatibility] = useState('');
  const [vehicleYearStart, setVehicleYearStart] = useState('');
  const [vehicleYearEnd, setVehicleYearEnd] = useState('');
  const [category, setCategory] = useState('');

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<string[]>([]);

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };

    // Fetch unique brands
    const fetchBrands = async () => {
      try {
        const res = await fetch('/api/products/brands'); // Assuming this API exists
        if (res.ok) {
          const data = await res.json();
          setBrands(data.brands);
        }
      } catch (err) {
        console.error('Failed to fetch brands:', err);
      }
    };

    fetchCategories();
    fetchBrands();
  }, []);

  useEffect(() => {
    // Initialize filters from URL query params on component mount
    const { minPrice, maxPrice, condition, sortBy, brand, modelCompatibility, vehicleYearStart, vehicleYearEnd, category } = router.query;
    if (minPrice) setMinPrice(parseFloat(minPrice as string));
    if (maxPrice) setMaxPrice(parseFloat(maxPrice as string));
    if (condition) setCondition(condition as string);
    if (sortBy) setSortBy(sortBy as string);
    if (brand) setBrand(brand as string);
    if (modelCompatibility) setModelCompatibility(modelCompatibility as string);
    if (vehicleYearStart) setVehicleYearStart(vehicleYearStart as string);
    if (vehicleYearEnd) setVehicleYearEnd(vehicleYearEnd as string);
    if (category) setCategory(category as string);
  }, [router.query]);

  const applyFilters = () => {
    const newQuery: { [key: string]: any } = { ...router.query };

    // Price Range
    if (minPrice !== initialMinPrice) newQuery.minPrice = minPrice;
    else delete newQuery.minPrice;

    if (maxPrice !== initialMaxPrice) newQuery.maxPrice = maxPrice;
    else delete newQuery.maxPrice;

    // Condition
    if (condition) newQuery.condition = condition;
    else delete newQuery.condition;

    // Sort By
    if (sortBy !== 'newest') newQuery.sortBy = sortBy;
    else delete newQuery.sortBy;

    // Brand
    if (brand) newQuery.brand = brand;
    else delete newQuery.brand;

    // Model Compatibility
    if (modelCompatibility) newQuery.modelCompatibility = modelCompatibility;
    else delete newQuery.modelCompatibility;

    // Vehicle Year Start
    if (vehicleYearStart) newQuery.vehicleYearStart = vehicleYearStart;
    else delete newQuery.vehicleYearStart;

    // Vehicle Year End
    if (vehicleYearEnd) newQuery.vehicleYearEnd = vehicleYearEnd;
    else delete newQuery.vehicleYearEnd;

    // Category
    if (category) newQuery.category_id = category; // Use category_id for backend
    else delete newQuery.category_id;

    // Reset page to 1 when filters change
    newQuery.page = '1';

    router.push({
      pathname: router.pathname,
      query: newQuery,
    });
  };

  return (
    <div className="w-full md:w-64 p-4 bg-gray-100 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Filters</h3>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">Brand</label>
        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="">All Brands</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">Model Compatibility</label>
        <input
          type="text"
          placeholder="e.g., Civic, Accord (comma-separated)"
          value={modelCompatibility}
          onChange={(e)          => setModelCompatibility(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">Vehicle Year Range</label>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            placeholder="From"
            value={vehicleYearStart}
            onChange={(e) => setVehicleYearStart(e.target.value)}
            className="w-1/2 p-2 border rounded-md"
          />
          <span>-</span>
          <input
            type="number"
            placeholder="To"
            value={vehicleYearEnd}
            onChange={(e) => setVehicleYearEnd(e.target.value)}
            className="w-1/2 p-2 border rounded-md"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">Condition</label>
        <div className="flex flex-col">
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio"
              name="condition"
              value=""
              checked={condition === ''}
              onChange={() => setCondition('')}
            />
            <span className="ml-2">Any</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio"
              name="condition"
              value="new"
              checked={condition === 'new'}
              onChange={() => setCondition('new')}
            />
            <span className="ml-2">New</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio"
              name="condition"
              value="used"
              checked={condition === 'used'}
              onChange={() => setCondition('used')}
            />
            <span className="ml-2">Used</span>
          </label>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">Price Range</label>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(parseFloat(e.target.value))}
            className="w-1/2 p-2 border rounded-md"
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
            className="w-1/2 p-2 border rounded-md"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">Sort By</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="newest">Newest</option>
          <option value="price_low_high">Price: Low to High</option>
          <option value="price_high_low">Price: High to Low</option>
        </select>
      </div>

      <button
        onClick={applyFilters}
        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
      >
        Apply Filters
      </button>
    </div>
  );
}
