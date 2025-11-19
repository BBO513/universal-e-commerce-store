
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useCheckout } from '../../context/CheckoutContext';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

interface ShippingMethod {
  name: string;
  description: string;
  price: number;
}

const shippingOptions: ShippingMethod[] = [
  { name: 'Standard', description: '3-6 days', price: 9.95 },
  { name: 'Express', description: '1-3 days', price: 14.95 },
  { name: 'Pickup', description: 'Free', price: 0.00 },
];

export default function CheckoutShippingPage() {
  const router = useRouter();
  const { selectedShippingMethod, setSelectedShippingMethod, selectedAddress } = useCheckout();
  const [selectedOption, setSelectedOption] = useState<string>(selectedShippingMethod?.name || '');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!selectedAddress) {
      router.push('/checkout/address'); // Redirect if no address selected
    }
  }, [selectedAddress, router]);

  const handleContinue = () => {
    const method = shippingOptions.find((option) => option.name === selectedOption);
    if (method) {
      setSelectedShippingMethod(method);
      router.push('/checkout/review');
    } else {
      setError('Please select a shipping method.');
    }
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
    }).format(value);
  };

  if (!selectedAddress) {
    return null; // Or a loading spinner, as redirect will happen in useEffect
  }

  return (
    <div className="container mx-auto p-4 pb-20 md:pb-4"> {/* Added pb-20 for mobile nav bar */}
      <h1 className="text-3xl font-bold mb-6">Shipping Method</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}

      <div className="space-y-4 mb-8">
        {shippingOptions.map((option) => (
          <div
            key={option.name}
            className={`p-4 border rounded-lg cursor-pointer flex items-center ${
              selectedOption === option.name ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'
            }`}
            onClick={() => setSelectedOption(option.name)}
          >
            <input
              type="radio"
              name="shippingMethod"
              id={option.name}
              checked={selectedOption === option.name}
              onChange={() => setSelectedOption(option.name)}
              className="mr-2 min-w-[24px] min-h-[24px]" // Larger radio button
            />
            <label htmlFor={option.name} className="font-semibold flex-grow py-2"> {/* Larger tap area for label */}
              {option.name} ({option.description}) - {formatPrice(option.price)}
            </label>
          </div>
        ))}
      </div>

      <button
        onClick={handleContinue}
        className="w-full bg-green-600 text-white text-xl font-bold py-3 rounded-lg hover:bg-green-700 transition-colors min-h-[44px]"
      >
        Continue to Order Review
      </button>
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
    props: {}, // No server-side data needed for static options
  };
};
