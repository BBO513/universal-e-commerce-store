
import { GetServerSideProps } from 'next';
import { getSession, useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../../components/Layout'; // Assuming a general layout component
import FadeAspectImage from '../../../components/FadeAspectImage';

interface OrderItem {
  product_id: number;
  title: string;
  quantity: number;
  price_at_purchase: number;
  images: string[];
  condition: string;
}

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  postcode: string;
}

interface OrderDetail {
  id: number;
  user_id: number;
  total: number;
  status: string;
  stripe_payment_id: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  shipping_address: ShippingAddress;
  items: OrderItem[];
}

interface OrderDetailPageProps {
  order: OrderDetail | null;
}

export default function OrderDetailPage({ order }: OrderDetailPageProps) {
  const { data: session } = useSession();

  if (!session) {
    return (
      <Layout>
        <div className="container mx-auto p-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>Please log in to view your order details.</p>
          <Link href="/login" className="text-blue-500 hover:underline">
            Go to Login
          </Link>
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="container mx-auto p-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <p>The order you are looking for does not exist or you do not have permission to view it.</p>
          <Link href="/account/orders" className="text-blue-500 hover:underline">
            Back to Orders
          </Link>
        </div>
      </Layout>
    );
  }

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
    }).format(value);
  };

  // Simple status timeline (can be enhanced with more complex logic)
  const statusTimeline = [
    { status: 'pending', label: 'Order Placed' },
    { status: 'processing', label: 'Processing' },
    { status: 'shipped', label: 'Shipped' },
    { status: 'delivered', label: 'Delivered' },
    { status: 'cancelled', label: 'Cancelled' },
  ];

  const currentStatusIndex = statusTimeline.findIndex(s => s.status === order.status);

  return (
    <Layout>
      <Head>
        <title>Order #{order.id} Details</title>
      </Head>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Order Details: #{order.id}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Customer Info */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
            <p><strong>Name:</strong> {order.customer_name}</p>
            <p><strong>Email:</strong> {order.customer_email}</p>
          </div>

          {/* Shipping Address */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            <p>{order.shipping_address.street}</p>
            <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postcode}</p>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <p><strong>Total:</strong> {formatPrice(order.total)}</p>
            <p><strong>Status:</strong> <span className="capitalize">{order.status}</span></p>
            <p><strong>Created At:</strong> {new Date(order.created_at).toLocaleString()}</p>
            <p><strong>Payment ID:</strong> {order.stripe_payment_id || 'N/A'}</p>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="flex items-center">
                        {item.images && item.images.length > 0 && (
                          <FadeAspectImage
                            src={item.images[0]}
                            alt={item.title}
                            aspect="aspect-square"
                            wrapperClassName="w-10 mr-2"
                            className="rounded-2xl"
                          />
                        )}
                        {item.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatPrice(item.price_at_purchase)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatPrice(item.quantity * item.price_at_purchase)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Order Status Timeline</h2>
          <div className="flex justify-between items-center relative">
            <div className="absolute left-0 right-0 h-1 bg-gray-200 top-1/2 -translate-y-1/2"></div>
            {statusTimeline.map((s, index) => (
              <div key={s.status} className="relative flex flex-col items-center z-10">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    index <= currentStatusIndex ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {index + 1}
                </div>
                <p className="mt-2 text-sm text-center">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link href="/account/orders" className="inline-block bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300">
          Back to All Orders
        </Link>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const { id } = context.query;

  if (typeof id !== 'string') {
    return { notFound: true };
  }

  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/account/orders/${id}`, {
      headers: {
        Cookie: context.req.headers.cookie || '', // Pass cookies for session
      },
    });

    if (res.ok) {
      const order = await res.json();
      return {
        props: {
          order: JSON.parse(JSON.stringify(order)), // Serialize for Next.js
        },
      };
    } else {
      console.error('Failed to fetch user order details:', res.status, res.statusText);
      return {
        notFound: true,
      };
    }
  } catch (error) {
    console.error('Error in getServerSideProps for user order detail page:', error);
    return {
      notFound: true,
    };
  }
};
