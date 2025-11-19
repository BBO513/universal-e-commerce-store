
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { filterOrders, getTotalOrderCount } from '../../../lib/db';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Order {
  id: number;
  customer_name: string;
  customer_email: string;
  total: number;
  status: string;
  created_at: string;
  stripe_payment_id: string;
}

interface AdminOrdersPageProps {
  initialOrders: Order[];
  totalOrders: number;
  currentPage: number;
  limit: number;
}

export default function AdminOrdersPage({
  initialOrders,
  totalOrders,
  currentPage,
  limit,
}: AdminOrdersPageProps) {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState((router.query.status as string) || '');
  const [startDate, setStartDate] = useState((router.query.startDate as string) || '');
  const [endDate, setEndDate] = useState((router.query.endDate as string) || '');
  const [sortBy, setSortBy] = useState((router.query.sortBy as string) || 'newest');
  const totalPages = Math.ceil(totalOrders / limit);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const queryString = new URLSearchParams(router.query as Record<string, string>).toString();
      const res = await fetch(`/api/admin/orders?${queryString}`);
      const data = await res.json();
      setOrders(data.orders);
      setLoading(false);
    };

    fetchOrders();
  }, [router.query]);

  const handleFilterChange = (param: string, value: string) => {
    const newQuery = { ...router.query, [param]: value, page: '1' };
    if (!value) delete newQuery[param];
    router.push({ query: newQuery });
  };

  const handleSortChange = (param: string) => {
    const newSortBy = sortBy === param ? (param.includes('total') ? (sortBy === 'total_asc' ? 'total_desc' : 'total_asc') : 'newest') : param;
    router.push({ query: { ...router.query, sortBy: newSortBy, page: '1' } });
    setSortBy(newSortBy);
  };

  const handlePageChange = (page: number) => {
    router.push({ query: { ...router.query, page: page.toString() } });
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
    }).format(value);
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Order Management</h1>

      <div className="flex space-x-4 mb-6">
        <select
          value={selectedStatus}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <input
          type="date"
          value={startDate}
          onChange={(e) => handleFilterChange('startDate', e.target.value)}
          className="p-2 border rounded-md"
          placeholder="Start Date"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => handleFilterChange('endDate', e.target.value)}
          className="p-2 border rounded-md"
          placeholder="End Date"
        />
      </div>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Email</th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('total_asc')}
                >
                  Total {sortBy.includes('total') && '↑↓'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customer_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customer_email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatPrice(order.total)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{order.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.stripe_payment_id || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/admin/orders/${order.id}`} className="text-indigo-600 hover:text-indigo-900">
                      View
                    </Link>
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

  const { page = '1', limit = '10', status = '', startDate = '', endDate = '', sortBy = 'newest' } = context.query;

  const filters: any = {
    page: parseInt(page as string, 10),
    limit: parseInt(limit as string, 10),
    sortBy: sortBy as string,
  };
  if (status) filters.status = status as string;
  if (startDate) filters.startDate = startDate as string;
  if (endDate) filters.endDate = endDate as string;

  try {
    const ordersRes = await fetch(
      `${process.env.NEXTAUTH_URL}/api/admin/orders?${new URLSearchParams(filters).toString()}`, {
        headers: {
          Cookie: context.req.headers.cookie || '', // Pass cookies for session
        },
      }
    );
    const ordersData = await ordersRes.json();

    return {
      props: {
        initialOrders: ordersData.orders,
        totalOrders: ordersData.totalOrders,
        currentPage: filters.page,
        limit: filters.limit,
      },
    };
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return {
      props: {
        initialOrders: [],
        totalOrders: 0,
        currentPage: 1,
        limit: 10,
      },
    };
  }
};
