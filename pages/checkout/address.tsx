import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import AddressForm from '../../components/AddressForm';
import { useCheckout } from '../../context/CheckoutContext';

interface Address {
  id: number;
  street: string;
  city: string;
  state: string;
  postcode: string;
  is_default: boolean;
}

interface CheckoutAddressPageProps {
  initialAddresses: Address[];
}

export default function CheckoutAddressPage({ initialAddresses }: CheckoutAddressPageProps) {
  const router = useRouter();
  const { setSelectedAddress } = useCheckout();
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Set initial selected address to default if available, or first one
    if (initialAddresses.length > 0) {
      const defaultAddress = initialAddresses.find((addr) => addr.is_default);
      setSelectedAddressId(defaultAddress ? defaultAddress.id : initialAddresses[0].id);
    }
  }, [initialAddresses]);

  const handleAddAddress = async (addressData: any) => {
    const res = await fetch('/api/address', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(addressData),
    });
    if (res.ok) {
      const newAddress = await res.json();
      setAddresses((prev) => [...prev, newAddress]);
      setSelectedAddressId(newAddress.id);
      setShowAddressForm(false);
    } else {
      // Handle error
      console.error('Failed to add address');
    }
  };

  const handleContinue = () => {
    const addressToSave = addresses.find((addr) => addr.id === selectedAddressId);
    if (addressToSave) {
      setSelectedAddress(addressToSave);
      router.push('/checkout/shipping');
    } else {
      setError('Please select an address or add a new one.');
    }
  };

  return (
    <div className="container mx-auto p-4 pb-20 md:pb-4"> {/* Added pb-20 for mobile nav bar */}
      <h1 className="text-3xl font-bold mb-6">Shipping Address</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {addresses.map((address) => (
          <div
            key={address.id}
            className={`p-4 border rounded-lg cursor-pointer flex items-center ${
              selectedAddressId === address.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'
            }`}
            onClick={() => setSelectedAddressId(address.id)}
          >
            <input
              type="radio"
              name="selectedAddress"
              id={`address-${address.id}`}
              checked={selectedAddressId === address.id}
              onChange={() => setSelectedAddressId(address.id)}
              className="mr-2 min-w-[24px] min-h-[24px]" // Larger radio button
            />
            <label htmlFor={`address-${address.id}`} className="font-semibold flex-grow py-2"> {/* Larger tap area for label */}
              {address.street}, {address.city}, {address.state} {address.postcode}
            </label>
            {address.is_default && <span className="ml-2 px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-full">Default</span>}
          </div>
        ))}
      </div>

      <button
        onClick={() => setShowAddressForm(!showAddressForm)}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors mb-8 min-h-[44px] min-w-[44px]"
      >
        {showAddressForm ? 'Cancel Add Address' : 'Add New Address'}
      </button>

      {showAddressForm && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Add New Address</h2>
          <AddressForm onSubmit={handleAddAddress} onCancel={() => setShowAddressForm(false)} />
        </div>
      )}

      <button
        onClick={handleContinue}
        className="w-full bg-green-600 text-white text-xl font-bold py-3 rounded-lg hover:bg-green-700 transition-colors min-h-[44px]"
      >
        Continue to Shipping Method
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

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/address`, {
    headers: {
      Cookie: context.req.headers.cookie || '', // Pass cookies for session
    },
  });

  let initialAddresses: Address[] = [];
  if (res.ok) {
    initialAddresses = await res.json();
  } else {
    console.error('Failed to fetch addresses:', res.status, res.statusText);
  }

  return {
    props: {
      initialAddresses,
    },
  };
};