
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { getProductsWithInventory } from '../../../lib/db';
import { useState } from 'react';
import ConfirmationModal from '../../../components/admin/ConfirmationModal';

interface ProductInventory {
  id: number;
  sku: string;
  title: string;
  stock: number;
}

interface InventoryHistoryEntry {
  id: number;
  product_id: number;
  change_quantity: number;
  reason: string;
  created_at: string;
  product_title: string;
  sku: string;
}

interface AdminInventoryPageProps {
  products: ProductInventory[];
}

export default function AdminInventoryPage({ products: initialProducts }: AdminInventoryPageProps) {
  const [products, setProducts] = useState<ProductInventory[]>(initialProducts);
  const [showStockUpdateModal, setShowStockUpdateModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [stockChange, setStockChange] = useState(0);
  const [stockReason, setStockReason] = useState('');
  const [updateError, setUpdateError] = useState<string | null>(null);

  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [inventoryHistory, setInventoryHistory] = useState<InventoryHistoryEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const handleOpenStockUpdateModal = (productId: number) => {
    setSelectedProductId(productId);
    setStockChange(0);
    setStockReason('');
    setUpdateError(null);
    setShowStockUpdateModal(true);
  };

  const handleUpdateStock = async () => {
    if (selectedProductId === null || stockReason.trim() === '') {
      setUpdateError('Please provide a reason for the stock change.');
      return;
    }
    setUpdateError(null);

    try {
      const res = await fetch('/api/admin/inventory/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProductId,
          change: stockChange,
          reason: stockReason,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setProducts((prevProducts) =>
          prevProducts.map((p) => (p.id === selectedProductId ? { ...p, stock: data.newStock } : p))
        );
        setShowStockUpdateModal(false);
      } else {
        const errorData = await res.json();
        setUpdateError(errorData.message || 'Failed to update stock.');
      }
    } catch (error: any) {
      console.error('Error updating stock:', error);
      setUpdateError(error.message || 'An unexpected error occurred.');
    }
  };

  const handleViewHistory = async (productId: number) => {
    setSelectedProductId(productId);
    setHistoryLoading(true);
    setShowHistoryModal(true);
    try {
      const res = await fetch(`/api/admin/inventory/history/${productId}`);
      if (res.ok) {
        const data = await res.json();
        setInventoryHistory(data);
      } else {
        console.error('Failed to fetch inventory history');
        setInventoryHistory([]);
      }
    } catch (error) {
      console.error('Error fetching inventory history:', error);
      setInventoryHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Inventory Management</h1>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.sku}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.stock}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {product.stock < 5 && product.stock > 0 && (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Low Stock
                    </span>
                  )}
                  {product.stock === 0 && (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Out of Stock
                    </span>
                  )}
                  {product.stock >= 5 && (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      In Stock
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleOpenStockUpdateModal(product.id)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Update Stock
                  </button>
                  <button
                    onClick={() => handleViewHistory(product.id)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    View History
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stock Update Modal */}
      <ConfirmationModal
        isOpen={showStockUpdateModal}
        onClose={() => setShowStockUpdateModal(false)}
        onConfirm={handleUpdateStock}
        title="Update Product Stock"
        message={
          <div>
            {updateError && <p className="text-red-500 text-sm mb-2">{updateError}</p>}
            <p className="mb-2">Change stock for product ID: {selectedProductId}</p>
            <input
              type="number"
              value={stockChange}
              onChange={(e) => setStockChange(parseInt(e.target.value, 10))}
              className="w-full p-2 border rounded-md mb-2"
              placeholder="e.g., 10 (add) or -5 (subtract)"
            />
            <textarea
              value={stockReason}
              onChange={(e) => setStockReason(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Reason for stock change (e.g., 'Received new shipment', 'Sold out')"
              rows={3}
            ></textarea>
          </div>
        }
        confirmText="Update Stock"
      />

      {/* Inventory History Modal */}
      <ConfirmationModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        onConfirm={() => setShowHistoryModal(false)} // No confirm action needed, just close
        title={`Inventory History for Product ID: ${selectedProductId}`}
        message={
          historyLoading ? (
            <p>Loading history...</p>
          ) : inventoryHistory.length === 0 ? (
            <p>No history found for this product.</p>
          ) : (
            <div className="max-h-60 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inventoryHistory.map((entry) => (
                    <tr key={entry.id}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{entry.change_quantity > 0 ? `+${entry.change_quantity}` : entry.change_quantity}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{entry.reason}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{new Date(entry.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
        confirmText="Close"
        cancelText="" // Hide cancel button
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

  try {
    const products = await getProductsWithInventory();
    return {
      props: {
        products: JSON.parse(JSON.stringify(products)),
      },
    };
  } catch (error) {
    console.error('Error fetching products with inventory:', error);
    return {
      props: {
        products: [],
      },
    };
  }
};
