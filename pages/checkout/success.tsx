
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import FadeAspectImage from '../../components/FadeAspectImage';
import Link from 'next/link';
import { getSession } from 'next-auth/react';

interface OrderItem {
  product_id: number;
  quantity: number;
  price_at_purchase: number;
  title: string;
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
}

interface OrderSuccessPageProps {
  order: Order | null;
}

export default function OrderSuccessPage({ order }: OrderSuccessPageProps) {
  const router = useRouter();
  const [estimatedDelivery, setEstimatedDelivery] = useState('');

  useEffect(() => {
    // Simulate estimated delivery time
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5); // 5 days from now
    setEstimatedDelivery(deliveryDate.toDateString());
  }, []);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
    }).format(value);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!order) {
    return (
      <div className="container mx-auto p-4 pb-20 md:pb-4 text-center"> {/* Added pb-20 for mobile nav bar */}
        <h1 className="text-3xl font-bold mb-4">Order Not Found</h1>
        <p className="text-gray-600 mb-6">There was an issue retrieving your order details.</p>
        <Link href="/" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors min-h-[44px] inline-flex items-center justify-center">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 pb-20 md:pb-4"> {/* Added pb-20 for mobile nav bar */}
      <h1 className="text-3xl font-bold text-green-600 mb-4">Order Confirmed!</h1>
      <p className="text-lg text-gray-700 mb-6">Thank you for your purchase. Your order has been placed successfully.</p>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-4">Order #{order.id}</h2>
        <p className="text-gray-600 mb-2">Status: <span className="font-semibold capitalize">{order.status}</span></p>
        <p className="text-gray-600 mb-2">Order Total: <span className="font-bold">{formatPrice(order.total)}</span></p>
        {estimatedDelivery && <p className="text-gray-600 mb-4">Estimated Delivery: <span className="font-semibold">{estimatedDelivery}</span></p>}

        <h3 className="text-xl font-bold mb-3">Order Summary</h3>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.product_id} className="flex items-center border-b pb-4 last:border-b-0 last:pb-0">
              <FadeAspectImage
              src={item.images?.[0] || '/placeholder-image.png'}
              alt={item.title}
              aspect="aspect-square"
              wrapperClassName="w-16 flex-shrink-0"
              className="rounded-2xl"
            />
              <div className="flex-grow">
                <p className="font-semibold">{item.title}</p>
                <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                <p className="text-gray-600 text-sm">Price: {formatPrice(item.price_at_purchase)}</p>
              </div>
              <p className="font-bold">{formatPrice(item.price_at_purchase * item.quantity)}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={handlePrint}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors min-h-[44px]"
          >
            Print Order
          </button>
        </div>
      </div>

      <div className="text-center">
        <Link href="/" className="inline-block bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors min-h-[44px]">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session || !session.user || !session.user.id) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const { orderId } = context.query;

  if (typeof orderId !== 'string') {
    return { notFound: true };
  }

  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/orders/${orderId}`, {
      headers: {
        Cookie: context.req.headers.cookie || '', // Pass cookies for session
      },
    });

    if (!res.ok) {
      console.error(`Failed to fetch order ${orderId}:`, res.status, res.statusText);
      return { props: { order: null } };
    }

    const order = await res.json();

    return {
      props: {
        order,
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps for order success page:', error);
    return { props: { order: null } };
  }
};
