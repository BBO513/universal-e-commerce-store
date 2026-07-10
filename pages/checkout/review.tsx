import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useCheckout } from '../../context/CheckoutContext';
import FadeAspectImage from '../../components/FadeAspectImage';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

export default function CheckoutReviewPage() {
  const router = useRouter();
  const { cartItems, cartSubtotal, cartGST, cartTotal, loading: cartLoading } = useCart();
  const { selectedAddress, selectedShippingMethod } = useCheckout();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
    }).format(value);
  };

  useEffect(() => {
    if (!selectedAddress) {
      router.push('/checkout/address');
    }
    if (!selectedShippingMethod) {
      router.push('/checkout/shipping');
    }
    if (cartItems.length === 0 && !cartLoading) {
      router.push('/cart');
    }
  }, [selectedAddress, selectedShippingMethod, cartItems, cartLoading, router]);

  const totalIncludingShipping = cartTotal + (selectedShippingMethod?.price || 0);

  if (cartLoading || !selectedAddress || !selectedShippingMethod || cartItems.length === 0) {
    return <div className="container mx-auto p-4 text-center">Loading order review...</div>;
  }

  const handleProceedToPayment = async () => {
    setIsProcessingPayment(true);
    setPaymentError(null);

    try {
      const res = await fetch('/api/checkout/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems: cartItems.map(item => ({
            productId: item.product_id,
            quantity: item.quantity,
            priceAtPurchase: item.price,
            title: item.title,
            images: item.images,
            condition: item.condition,
          })),
          shippingAddress: selectedAddress,
          shippingMethod: selectedShippingMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPaymentError(data.message || 'Failed to create payment intent.');
        setIsProcessingPayment(false);
        return;
      }

      router.push(`/checkout/payment?client_secret=${data.clientSecret}`);
    } catch (error) {
      console.error('Error proceeding to payment:', error);
      setPaymentError('An unexpected error occurred. Please try again.');
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="container mx-auto p-4 pb-20 md:pb-4"> {/* Added pb-20 for mobile nav bar */}
      <h1 className="text-3xl font-bold mb-6">Order Review</h1>

      {paymentError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {paymentError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Your Items</h2>
          <div className="border rounded-lg bg-white shadow-sm">
            {cartItems.map((item) => (
              <div key={item.cart_item_id} className="flex items-center p-4 border-b last:border-b-0">
                <FadeAspectImage
                  src={item.images?.[0] || '/placeholder-image.png'}
                  alt={item.title}
                  aspect="aspect-square"
                  wrapperClassName="w-20 flex-shrink-0"
                  className="rounded-2xl"
                />
                <div className="flex-grow">
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-gray-600 text-sm">Condition: {item.condition}</p>
                  <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                </div>
                <p className="font-bold">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <h2 className="text-2xl font-bold mb-4">Summary</h2>
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <div className="mb-4">
              <h3 className="font-semibold text-lg mb-2">Shipping Address</h3>
              <p>{selectedAddress.street}</p>
              <p>{selectedAddress.city}, {selectedAddress.state} {selectedAddress.postcode}</p>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-lg mb-2">Shipping Method</h3>
              <p>{selectedShippingMethod.name} ({selectedShippingMethod.description})</p>
              <p className="font-bold">{formatPrice(selectedShippingMethod.price)}</p>
            </div>

            <div className="border-t border-gray-300 pt-4 mt-4 space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span>{formatPrice(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>GST (10%):</span>
                <span>{formatPrice(cartGST)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping:</span>
                <span>{formatPrice(selectedShippingMethod.price)}</span>
              </div>
              <div className="flex justify-between font-bold text-xl border-t border-gray-300 pt-4 mt-4">
                <span>Order Total:</span>
                <span>{formatPrice(totalIncludingShipping)}</span>
              </div>
            </div>

            <button
              onClick={handleProceedToPayment}
              className="w-full bg-green-600 text-white text-xl font-bold py-3 rounded-lg hover:bg-green-700 transition-colors mt-6 min-h-[44px]"
              disabled={isProcessingPayment}
            >
              {isProcessingPayment ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session || !session.user || !session.user.id) {
    return {
      redirect: {
        destination: '/login', // Redirect to login if not authenticated
        permanent: false,
      },
    };
  }

  return {
    props: {}, // No server-side data needed directly, context handles it
  };
};