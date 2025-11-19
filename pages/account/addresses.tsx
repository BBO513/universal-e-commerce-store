
import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Layout from '../../components/Layout';
import AddressForm from '../../components/AddressForm';
import ConfirmationModal from '../../components/admin/ConfirmationModal';
import Head from 'next/head';

// Define the Address type
interface Address {
  id: number;
  street: string;
  city: string;
  state: string;
  postcode: string;
  is_default: boolean;
}

// Define the props for the page
interface AddressesPageProps {
  initialAddresses: Address[];
}

export default function AddressesPage({ initialAddresses }: AddressesPageProps) {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setAddresses(initialAddresses);
  }, [initialAddresses]);

  const fetchAddresses = async () => {
    try {
      const res = await fetch('/api/account/address');
      if (!res.ok) throw new Error('Failed to fetch addresses');
      const data = await res.json();
      setAddresses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  const handleOpenModal = (address: Address | null = null) => {
    setSelectedAddress(address);
    setIsModalOpen(true);
    setError(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAddress(null);
    setError(null);
  };

  const handleSubmitAddress = async (addressData: any) => {
    const url = addressData.id ? `/api/account/address/${addressData.id}` : '/api/account/address';
    const method = addressData.id ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addressData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to save address');
      }

      await fetchAddresses();
      handleCloseModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  const handleDeleteClick = (address: Address) => {
    setAddressToDelete(address);
    setIsConfirmationModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!addressToDelete) return;

    try {
      const res = await fetch(`/api/account/address/${addressToDelete.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete address');
      }

      await fetchAddresses();
      setIsConfirmationModalOpen(false);
      setAddressToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  const handleSetDefault = async (addressId: number) => {
    try {
      const res = await fetch(`/api/account/address/set-default`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addressId }),
      });
      if (!res.ok) throw new Error('Failed to set default address');
      await fetchAddresses();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  return (
    <Layout>
      <Head>
        <title>Manage Addresses</title>
      </Head>
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Addresses</h1>
          <button
            onClick={() => handleOpenModal()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New Address
          </button>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {addresses.length > 0 ? (
            addresses.map((address) => (
              <div key={address.id} className={`p-6 rounded-lg shadow-md ${address.is_default ? 'border-2 border-blue-500 bg-blue-50' : 'bg-white'}`}>
                <div className="flex justify-between items-start">
                  <div className="font-semibold">
                    {address.is_default && <span className="text-sm text-blue-600 block mb-2">Default Address</span>}
                    <p>{address.street}</p>
                    <p>{address.city}, {address.state} {address.postcode}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => handleOpenModal(address)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                    <button onClick={() => handleDeleteClick(address)} className="text-red-600 hover:text-red-900">Delete</button>
                  </div>
                </div>
                {!address.is_default && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="mt-4 text-sm text-blue-600 hover:underline"
                  >
                    Set as Default
                  </button>
                )}
              </div>
            ))
          ) : (
            <p>You have no saved addresses.</p>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-100 p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">{selectedAddress ? 'Edit Address' : 'Add New Address'}</h2>
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
            <AddressForm
              initialData={selectedAddress || { street: '', city: '', state: '', postcode: '', is_default: false }}
              onSubmit={handleSubmitAddress}
              onCancel={handleCloseModal}
            />
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete this address? This action cannot be undone.`}
      />
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

  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/account/address`, {
      headers: {
        Cookie: context.req.headers.cookie || '',
      },
    });

    let initialAddresses: Address[] = [];
    if (res.ok) {
      initialAddresses = await res.json();
    } else {
      console.error("Failed to fetch addresses, using empty array.");
    }

    return {
      props: {
        session,
        initialAddresses: JSON.parse(JSON.stringify(initialAddresses)),
      },
    };
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return {
      props: {
        session,
        initialAddresses: [],
      },
    };
  }
};
