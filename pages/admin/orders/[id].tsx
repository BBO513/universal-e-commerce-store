
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { getOrderById } from '../../../../lib/db';
import { useState } from 'react';
import ConfirmationModal from '../../../components/admin/ConfirmationModal';

interface OrderItem {
  product_id: number;
  title: string;
  quantity: number;
  price_at_purchase: number;
  images: string[];
  condition: string;
}

interface Order {
  id: number;
  user_id: number;
  total: number;
  status: string;
  stripe_payment_id: string;
  created_at: string;
  items: OrderItem[];
  customer_name?: string; // Assuming this will be joined from users table
  customer_email?: string; // Assuming this will be joined from users table
  shipping_address?: any; // Placeholder for shipping address details
}

interface AdminOrderDetailPageProps {
  order: Order;
}

export default function AdminOrderDetailPage({ order: initialOrder }: AdminOrderDetailPageProps) {
  const [order, setOrder] = useState<Order>(initialOrder);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState(order.status);

  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundAmount, setRefundAmount] = useState(order.total);

  const handleUpdateStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const updatedOrder = await res.json();
        setOrder(updatedOrder);
        setShowStatusModal(false);
      } else {
        const errorData = await res.json();
        setError(errorData.message || 'Failed to update order status.');
      }
    } catch (err: any) {
      console.error('Error updating order status:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleIssueRefund = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'POST', // Using POST for refund action
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentIntentId: order.stripe_payment_id, amount: refundAmount }),
      });

      if (res.ok) {
        alert('Refund initiated successfully!');
        setShowRefundModal(false);
        // Optionally update order status to 'refunded' or similar
        // setOrder(prev => ({ ...prev, status: 'refunded' }));
      } else {
        const errorData = await res.json();
        setError(errorData.message || 'Failed to issue refund.');
      }
    } catch (err: any) {
      console.error('Error issuing refund:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
    }).format(value);
  };

  if (!order) {
    return (
      <AdminLayout>
        <h1 className="text-3xl font-bold mb-6">Order Not Found</h1>
        <p>The order you are looking for does not exist.</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Order Details: #{order.id}</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Customer Info */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
          <p><strong>Name:</strong> {order.customer_name || 'N/A'}</p>
          <p><strong>Email:</strong> {order.customer_email || 'N/A'}</p>
          {/* Add more customer details if available */}
        </div>

        {/* Shipping Address */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
          {order.shipping_address ? (
            <>
              <p>{order.shipping_address.street}</p>
              <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postcode}</p>
            </>
          ) : (
            <p>N/A</p>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <p><strong>Total:</strong> {formatPrice(order.total)}</p>
          <p><strong>Status:</strong> <span className="capitalize">{order.status}</span></p>
          <p><strong>Created At:</strong> {new Date(order.created_at).toLocaleString()}</p>
          <p><strong>Stripe Payment ID:</strong> {order.stripe_payment_id || 'N/A'}</p>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Items Ordered</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {order.items.map((item) => (
                <tr key={item.product_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatPrice(item.price_at_purchase)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatPrice(item.quantity * item.price_at_purchase)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Actions */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Order Actions</h2>
        <div className="flex flex-wrap gap-4">
          <select
            value={order.status}
            onChange={(e) => setNewStatus(e.target.value)}
            className="p-2 border rounded-md"
            disabled={loading}
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            onClick={() => setShowStatusModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            disabled={loading || newStatus === order.status}
          >
            Update Status
          </button>

          <button
            onClick={() => setShowRefundModal(true)}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            disabled={loading || !order.stripe_payment_id || order.status === 'cancelled'}
          >
            Issue Refund
          </button>
        </div>
      </div>

      {/* Status Update Confirmation Modal */}
      <ConfirmationModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        onConfirm={handleUpdateStatus}
        title="Confirm Status Update"
        message={`Are you sure you want to change the order status to "${newStatus}"?`}
        confirmText="Update"
      />

      {/* Refund Confirmation Modal */}
      <ConfirmationModal
        isOpen={showRefundModal}
        onClose={() => setShowRefundModal(false)}
        onConfirm={handleIssueRefund}
        title="Confirm Refund"
        message={
          <div>
            <p className="mb-2">Are you sure you want to issue a refund for this order?</p>
            <p className="mb-2">Enter refund amount (max: {formatPrice(order.total)}):</p>
            <input
              type="number"
              value={refundAmount}
              onChange={(e) => setRefundAmount(parseFloat(e.target.value))}
              max={order.total}
              min={0.01}
              step="0.01"
              className="w-full p-2 border rounded-md"
            />
          </div>
        }
        confirmText="Issue Refund"
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

  const { id } = context.query;

  if (typeof id !== 'string') {
    return { notFound: true };
  }

  try {
    const order = await getOrderById(parseInt(id, 10));

    if (!order) {
      return { notFound: true };
    }

    // In a real application, you would also fetch customer info and shipping address
    // For now, we'll mock them or assume they are part of the order object
    const customerInfo = { name: 'John Doe', email: 'john.doe@example.com' }; // Mock
    const shippingAddress = { street: '123 Main St', city: 'Anytown', state: 'NSW', postcode: '2000' }; // Mock

    return {
      props: {
        order: JSON.parse(JSON.stringify({
          ...order,
          customer_name: customerInfo.name,
          customer_email: customerInfo.email,
          shipping_address: shippingAddress,
        })),
      },
    };
  } catch (error) {
    console.error('Error fetching order details:', error);
    return { notFound: true };
  }
};
