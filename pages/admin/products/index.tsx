import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { filterProducts, getTotalProductCount, getAllCategories } from '../../../lib/db';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ConfirmationModal from '../../../components/admin/ConfirmationModal';

interface Product {
  id: number;
  title: string;
  price: number;
  condition: 'new' | 'used';
  stock: number;
  sku: string;
  images: string[];
  category_id: number;
  category_name?: string; // Joined from categories table
}

interface Category {
  id: number;
  name: string;
}

interface AdminProductsPageProps {
  initialProducts: Product[];
  totalProducts: number;
  currentPage: number;
  limit: number;
  categories: Category[];
}

export default function AdminProductsPage({
  initialProducts,
  totalProducts,
  currentPage,
  limit,
  categories,
}: AdminProductsPageProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState((router.query.searchQuery as string) || '');
  const [selectedCategory, setSelectedCategory] = useState((router.query.category_id as string) || '');
  const [selectedCondition, setSelectedCondition] = useState((router.query.condition as string) || '');
  const [sortBy, setSortBy] = useState((router.query.sortBy as string) || 'newest');
  const totalPages = Math.ceil(totalProducts / limit);

  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [showConditionModal, setShowConditionModal] = useState(false);
  const [stockChangeValue, setStockChangeValue] = useState(0);
  const [newConditionValue, setNewConditionValue] = useState<'new' | 'used'>('new');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const queryString = new URLSearchParams(router.query as Record<string, string>).toString();
      const res = await fetch(`/api/admin/products?${queryString}`);
      const data = await res.json();
      setProducts(data.products);
      setLoading(false);
    };

    fetchProducts();
  }, [router.query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newQuery = { ...router.query, searchQuery: searchTerm, page: '1' };
    if (!searchTerm) delete newQuery.searchQuery;
    router.push({ query: newQuery });
  };

  const handleFilterChange = (param: string, value: string) => {
    const newQuery = { ...router.query, [param]: value, page: '1' };
    if (!value) delete newQuery[param];
    router.push({ query: newQuery });
  };

  const handleSortChange = (param: string) => {
    const newSortBy = sortBy === param ? (param.includes('price') ? (sortBy === 'price_low_high' ? 'price_high_low' : 'price_low_high') : 'newest') : param;
    router.push({ query: { ...router.query, sortBy: newSortBy, page: '1' } });
    setSortBy(newSortBy);
  };

  const handlePageChange = (page: number) => {
    router.push({ query: { ...router.query, page: page.toString() } });
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedProductIds(products.map((p) => p.id));
    } else {
      setSelectedProductIds([]);
    }
  };

  const handleSelectProduct = (productId: number) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleDeleteClick = (productId: number) => {
    setSelectedProductIds([productId]); // Select only this product for single delete
    setShowDeleteModal(true);
  };

  const handleBulkDeleteClick = () => {
    if (selectedProductIds.length === 0) {
      alert('Please select products to delete.');
      return;
    }
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch('/api/admin/products/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_many', productIds: selectedProductIds }),
      });
      if (res.ok) {
        setProducts(products.filter((p) => !selectedProductIds.includes(p.id)));
        setSelectedProductIds([]);
        setShowDeleteModal(false);
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Failed to delete products.');
      }
    } catch (error) {
      console.error('Error deleting products:', error);
      alert('Error deleting products.');
    }
  };

  const handleBulkStockUpdate = async () => {
    if (selectedProductIds.length === 0) {
      alert('Please select products to update stock.');
      return;
    }
    setShowStockModal(true);
  };

  const confirmStockUpdate = async () => {
    try {
      const res = await fetch('/api/admin/products/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_stock_many', productIds: selectedProductIds, value: stockChangeValue }),
      });
      if (res.ok) {
        // Re-fetch products to show updated stock
        router.reload();
        setShowStockModal(false);
        setStockChangeValue(0);
        setSelectedProductIds([]);
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Failed to update stock.');
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Error updating stock.');
    }
  };

  const handleBulkConditionChange = async () => {
    if (selectedProductIds.length === 0) {
      alert('Please select products to change condition.');
      return;
    }
    setShowConditionModal(true);
  };

  const confirmConditionChange = async () => {
    try {
      const res = await fetch('/api/admin/products/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_condition_many', productIds: selectedProductIds, value: newConditionValue }),
      });
      if (res.ok) {
        // Re-fetch products to show updated condition
        router.reload();
        setShowConditionModal(false);
        setSelectedProductIds([]);
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Failed to change condition.');
      }
    } catch (error) {
      console.error('Error changing condition:', error);
      alert('Error changing condition.');
    }
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
    }).format(value);
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Product Management</h1>

      <div className="flex justify-between items-center mb-6">
        <form onSubmit={handleSearch} className="flex space-x-2">
          <input
            type="text"
            placeholder="Search by title or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border rounded-md"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            Search
          </button>
        </form>

        <Link href="/admin/products/new" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
          Add New Product
        </Link>
      </div>

      <div className="flex space-x-4 mb-6">
        <select
          value={selectedCategory}
          onChange={(e) => handleFilterChange('category_id', e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          value={selectedCondition}
          onChange={(e) => handleFilterChange('condition', e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="">All Conditions</option>
          <option value="new">New</option>
          <option value="used">Used</option>
        </select>
      </div>

      {selectedProductIds.length > 0 && (
        <div className="flex space-x-4 mb-6 p-4 bg-gray-100 rounded-md">
          <span className="font-semibold">{selectedProductIds.length} products selected:</span>
          <button onClick={handleBulkDeleteClick} className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">
            Delete Selected
          </button>
          <button onClick={handleBulkStockUpdate} className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600">
            Update Stock
          </button>
          <button onClick={handleBulkConditionChange} className="bg-purple-500 text-white px-3 py-1 rounded-md hover:bg-purple-600">
            Change Condition
          </button>
        </div>
      )}

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedProductIds.length === products.length && products.length > 0}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('title')}
                >
                  Title {sortBy === 'title' && '↑↓'}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('price_low_high')}
                >
                  Price {sortBy.includes('price') && '↑↓'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <input
                      type="checkbox"
                      checked={selectedProductIds.includes(product.id)}
                      onChange={() => handleSelectProduct(product.id)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.images && product.images.length > 0 && (
                      <Image src={product.images[0]} alt={product.title} width={40} height={40} objectFit="cover" className="rounded" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatPrice(product.price)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{product.condition}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.category_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/admin/products/${product.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                      Edit
                    </Link>
                    <button onClick={() => handleDeleteClick(product.id)} className="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 rounded-lg ${
                page === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Confirm Delete"
        message={`Are you sure you want to delete ${selectedProductIds.length} product(s)? This action cannot be undone.`}
        confirmText="Delete"
      />

      {/* Stock Update Modal */}
      <ConfirmationModal
        isOpen={showStockModal}
        onClose={() => setShowStockModal(false)}
        onConfirm={confirmStockUpdate}
        title="Update Stock"
        message={
          <div>
            <p className="mb-2">Enter value to add/subtract from stock for {selectedProductIds.length} product(s):</p>
            <input
              type="number"
              value={stockChangeValue}
              onChange={(e) => setStockChangeValue(parseInt(e.target.value, 10))}
              className="w-full p-2 border rounded-md"
              placeholder="e.g., 10 or -5"
            />
          </div>
        }
        confirmText="Update"
      />

      {/* Condition Change Modal */}
      <ConfirmationModal
        isOpen={showConditionModal}
        onClose={() => setShowConditionModal(false)}
        onConfirm={confirmConditionChange}
        title="Change Condition"
        message={
          <div>
            <p className="mb-2">Select new condition for {selectedProductIds.length} product(s):</p>
            <select
              value={newConditionValue}
              onChange={(e) => setNewConditionValue(e.target.value as 'new' | 'used')}
              className="w-full p-2 border rounded-md"
            >
              <option value="new">New</option>
              <option value="used">Used</option>
            </select>
          </div>
        }
        confirmText="Change"
      />
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session || session.user?.role !== 'admin') {
    return {
      redirect: {
        destination: '/unauthorized',
        permanent: false,
      },
    };
  }

  const { page = '1', limit = '10', sortBy = 'newest', searchQuery = '', category_id = '', condition = '' } = context.query;

  const filters: any = {
    page: parseInt(page as string, 10),
    limit: parseInt(limit as string, 10),
    sortBy: sortBy as string,
  };
  if (searchQuery) filters.searchQuery = searchQuery as string;
  if (category_id) filters.category_id = parseInt(category_id as string, 10);
  if (condition) filters.condition = condition as 'new' | 'used';

  try {
    const productsRes = await fetch(
      `${process.env.NEXTAUTH_URL}/api/admin/products?${new URLSearchParams(filters).toString()}`, {
        headers: {
          Cookie: context.req.headers.cookie || '', // Pass cookies for session
        },
      }
    );
    const productsData = await productsRes.json();

    const categoriesRes = await fetch(`${process.env.NEXTAUTH_URL}/api/categories`, {
      headers: {
        Cookie: context.req.headers.cookie || '', // Pass cookies for session
      },
    });
    const categoriesData = await categoriesRes.json();

    // Map category names to products
    const productsWithCategoryNames = productsData.products.map((p: any) => ({
      ...p,
      category_name: categoriesData.find((cat: any) => cat.id === p.category_id)?.name || 'N/A',
    }));

    return {
      props: {
        initialProducts: productsWithCategoryNames,
        totalProducts: productsData.totalProducts,
        currentPage: filters.page,
        limit: filters.limit,
        categories: categoriesData,
      },
    };
  } catch (error) {
    console.error('Error fetching admin products:', error);
    return {
      props: {
        initialProducts: [],
        totalProducts: 0,
        currentPage: 1,
        limit: 10,
        categories: [],
      },
    };
  }
};