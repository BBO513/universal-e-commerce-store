import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import AdminLayout from '../../../../components/admin/AdminLayout';
import Link from 'next/link';
import { Product, Vehicle } from '../../../../lib/db'; // Assuming Product and Vehicle interfaces are exported

interface ProductWithVehicles extends Product {
  compatibleVehicles: Vehicle[];
}

export default function ProductVehiclesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id: productId } = router.query;

  const [product, setProduct] = useState<ProductWithVehicles | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchMake, setSearchMake] = useState('');
  const [searchModel, setSearchModel] = useState('');
  const [searchYear, setSearchYear] = useState('');
  const [searchResults, setSearchResults] = useState<Vehicle[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin');
    } else if (session && session.user && session.user.role !== 'admin') {
      router.push('/unauthorized');
    }
  }, [session, status, router]);

  useEffect(() => {
    if (productId && session?.user?.role === 'admin') {
      fetchProductAndVehicles();
    }
  }, [productId, session]);

  const fetchProductAndVehicles = async () => {
    setLoading(true);
    setError('');
    try {
      const productRes = await fetch(`/api/products/${productId}`);
      if (!productRes.ok) {
        throw new Error('Failed to fetch product details');
      }
      const productData = await productRes.json();

      const compatibleVehiclesRes = await fetch(`/api/products/${productId}/vehicles`); // New API endpoint needed
      if (!compatibleVehiclesRes.ok) {
        throw new Error('Failed to fetch compatible vehicles');
      }
      const compatibleVehiclesData = await compatibleVehiclesRes.json();

      setProduct({ ...productData, compatibleVehicles: compatibleVehiclesData.vehicles });
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching product and vehicles.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchVehicles = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setSearchLoading(true);
    setError('');
    try {
      const query = new URLSearchParams();
      if (searchMake) query.append('make', searchMake);
      if (searchModel) query.append('model', searchModel);
      if (searchYear) query.append('year', searchYear);

      const res = await fetch(`/api/vehicles/search?${query.toString()}`);
      if (!res.ok) {
        throw new Error('Failed to search vehicles');
      }
      const data = await res.json();
      setSearchResults(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred during vehicle search.');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleAddCompatibility = async (vehicleId: number) => {
    if (!product?.id) return;
    setError('');
    try {
      const res = await fetch('/api/vehicles/map', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: parseInt(product.id, 10), vehicleId }),
      });
      if (!res.ok) {
        throw new Error('Failed to add compatibility');
      }
      alert('Compatibility added!');
      fetchProductAndVehicles(); // Re-fetch to update list
      setSearchResults([]); // Clear search results
    } catch (err: any) {
      setError(err.message || 'An error occurred while adding compatibility.');
    }
  };

  const handleRemoveCompatibility = async (vehicleId: number) => {
    if (!product?.id) return;
    setError('');
    try {
      const res = await fetch('/api/vehicles/map', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: parseInt(product.id, 10), vehicleId }),
      });
      if (!res.ok) {
        throw new Error('Failed to remove compatibility');
      }
      alert('Compatibility removed!');
      fetchProductAndVehicles(); // Re-fetch to update list
    } catch (err: any) {
      setError(err.message || 'An error occurred while removing compatibility.');
    }
  };

  if (status === 'loading' || loading) {
    return <AdminLayout><div className="text-center py-8">Loading...</div></AdminLayout>;
  }

  if (error) {
    return <AdminLayout><div className="text-center py-8 text-red-500">{error}</div></AdminLayout>;
  }

  if (!product) {
    return <AdminLayout><div className="text-center py-8">Product not found.</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Manage Vehicle Compatibility for &quot;{product.title}&quot;</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Current Compatible Vehicles</h2>
        {product.compatibleVehicles && product.compatibleVehicles.length > 0 ? (
          <ul className="space-y-2">
            {product.compatibleVehicles.map((vehicle) => (
              <li key={vehicle.id} className="flex justify-between items-center p-3 border rounded-md">
                <span>{vehicle.make} {vehicle.model} ({vehicle.year_start}-{vehicle.year_end})</span>
                <button
                  onClick={() => handleRemoveCompatibility(vehicle.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No vehicles currently mapped to this product.</p>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Search and Add Vehicles</h2>
        <form onSubmit={handleSearchVehicles} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="searchMake" className="block text-sm font-medium text-gray-700">Make</label>
            <input
              type="text"
              id="searchMake"
              value={searchMake}
              onChange={(e) => setSearchMake(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="searchModel" className="block text-sm font-medium text-gray-700">Model</label>
            <input
              type="text"
              id="searchModel"
              value={searchModel}
              onChange={(e) => setSearchModel(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="searchYear" className="block text-sm font-medium text-gray-700">Year</label>
            <input
              type="number"
              id="searchYear"
              value={searchYear}
              onChange={(e) => setSearchYear(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="md:col-span-3">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
              disabled={searchLoading}
            >
              {searchLoading ? 'Searching...' : 'Search Vehicles'}
            </button>
          </div>
        </form>

        {searchResults.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-3">Search Results</h3>
            <ul className="space-y-2">
              {searchResults.map((vehicle) => (
                <li key={vehicle.id} className="flex justify-between items-center p-3 border rounded-md">
                  <span>{vehicle.make} {vehicle.model} ({vehicle.year_start}-{vehicle.year_end})</span>
                  <button
                    onClick={() => handleAddCompatibility(vehicle.id)}
                    className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                    disabled={product?.compatibleVehicles?.some(v => v.id === vehicle.id)}
                  >
                    {product?.compatibleVehicles?.some(v => v.id === vehicle.id) ? 'Already Mapped' : 'Add Compatibility'}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}