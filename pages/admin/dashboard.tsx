
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getDashboardMetrics, getRevenueByDay, getOrdersByDay } from '../../lib/db';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardProps {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  lowStockCount: number;
  revenueChartData: { labels: string[]; datasets: { label: string; data: number[]; borderColor: string; backgroundColor: string; }[] };
  ordersChartData: { labels: string[]; datasets: { label: string; data: number[]; backgroundColor: string; }[] };
}

export default function AdminDashboard({
  totalRevenue,
  totalOrders,
  totalCustomers,
  lowStockCount,
  revenueChartData,
  ordersChartData,
}: DashboardProps) {
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
    }).format(value);
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '',
      },
    },
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-500">Total Revenue (30 Days)</h2>
          <p className="text-3xl font-bold text-green-600">{formatPrice(totalRevenue)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-500">Total Orders (30 Days)</h2>
          <p className="text-3xl font-bold text-blue-600">{totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-500">Total Customers (30 Days)</h2>
          <p className="text-3xl font-bold text-purple-600">{totalCustomers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-500">Low Stock Items</h2>
          <p className="text-3xl font-bold text-red-600">{lowStockCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Revenue Over Last 30 Days</h2>
          <Line options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'Revenue Over Last 30 Days' } } }} data={revenueChartData} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Orders Over Last 30 Days</h2>
          <Bar options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'Orders Over Last 30 Days' } } }} data={ordersChartData} />
        </div>
      </div>
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
    const metrics = await getDashboardMetrics();
    const revenueData = await getRevenueByDay();
    const ordersData = await getOrdersByDay();

    const labels = Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      return d.toLocaleDateString('en-AU', { month: 'short', day: 'numeric' });
    });

    const revenueMap = new Map(revenueData.map((item: any) => [new Date(item.date).toLocaleDateString('en-AU', { month: 'short', day: 'numeric' }), parseFloat(item.revenue)]));
    const ordersMap = new Map(ordersData.map((item: any) => [new Date(item.date).toLocaleDateString('en-AU', { month: 'short', day: 'numeric' }), parseInt(item.orders_count, 10)]));

    const revenueChartDatasets = [{
      label: 'Revenue',
      data: labels.map(label => revenueMap.get(label) || 0),
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
    }];

    const ordersChartDatasets = [{
      label: 'Orders',
      data: labels.map(label => ordersMap.get(label) || 0),
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    }];

    return {
      props: {
        totalRevenue: metrics.totalRevenue,
        totalOrders: metrics.totalOrders,
        totalCustomers: metrics.totalCustomers,
        lowStockCount: metrics.lowStockCount,
        revenueChartData: { labels, datasets: revenueChartDatasets },
        ordersChartData: { labels, datasets: ordersChartDatasets },
      },
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return {
      props: {
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        lowStockCount: 0,
        revenueChartData: { labels: [], datasets: [] },
        ordersChartData: { labels: [], datasets: [] },
      },
    };
  }
};
