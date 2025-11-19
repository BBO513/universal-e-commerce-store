
import { GetServerSideProps } from 'next';
import { getSession, useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout'; // Assuming a general layout component
import { useState, useEffect } from 'react';
import ConfirmationModal from '../../components/admin/ConfirmationModal'; // Reusing admin modal

interface Address {
  id: number;
  type: string;
  street: string;
  city: string;
  state: string;
  postcode: string;
  is_default: boolean;
}

interface UserProfile {
  id: number;
  name: string;
  email: string;
  addresses: Address[];
}

interface AccountSettingsPageProps {
  userProfile: UserProfile | null;
}

export default function AccountSettingsPage({ userProfile: initialUserProfile }: AccountSettingsPageProps) {
  const { data: session, update: updateSession } = useSession();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(initialUserProfile);

  const [name, setName] = useState(userProfile?.name || '');
  const [email, setEmail] = useState(userProfile?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [selectedDefaultAddress, setSelectedDefaultAddress] = useState<number | null>(
    userProfile?.addresses.find(addr => addr.is_default)?.id || null
  );

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name);
      setEmail(userProfile.email);
      setSelectedDefaultAddress(userProfile.addresses.find(addr => addr.is_default)?.id || null);
    }
  }, [userProfile]);

  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch('/api/account/update-info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUserProfile(prev => prev ? { ...prev, name: updatedUser.name, email: updatedUser.email } : null);
        updateSession({ user: { name: updatedUser.name, email: updatedUser.email } }); // Update session
        setMessage('Profile information updated successfully!');
      } else {
        const errorData = await res.json();
        setError(errorData.message || 'Failed to update profile information.');
      }
    } catch (err: any) {
      console.error('Error updating profile info:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/account/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (res.ok) {
        setMessage('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        const errorData = await res.json();
        setError(errorData.message || 'Failed to change password.');
      }
    } catch (err: any) {
      console.error('Error changing password:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDefaultAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    if (!selectedDefaultAddress) {
      setError('Please select an address to set as default.');
      setLoading(false);
      return;
    }

    try {
      // Reusing the existing setDefaultAddress API from address management
      const res = await fetch(`/api/address/set-default`, { // Assuming this API exists or will be created
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addressId: selectedDefaultAddress }),
      });

      if (res.ok) {
        const updatedAddress = await res.json();
        setUserProfile(prev => {
          if (!prev) return null;
          const updatedAddresses = prev.addresses.map(addr =>
            addr.id === updatedAddress.id ? { ...addr, is_default: true } : { ...addr, is_default: false }
          );
          return { ...prev, addresses: updatedAddresses };
        });
        setMessage('Default address updated successfully!');
      } else {
        const errorData = await res.json();
        setError(errorData.message || 'Failed to update default address.');
      }
    } catch (err: any) {
      console.error('Error updating default address:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <Layout>
        <div className="container mx-auto p-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>Please log in to view your account settings.</p>
          <Link href="/login" className="text-blue-500 hover:underline">
            Go to Login
          </Link>
        </div>
      </Layout>
    );
  }

  if (!userProfile) {
    return (
      <Layout>
        <div className="container mx-auto p-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <p>Unable to load your user profile. Please try again later.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Account Settings - {userProfile.name}</title>
      </Head>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Account Settings</h1>

        {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">{message}</div>}
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}

        {/* Change Name and Email */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
          <form onSubmit={handleUpdateInfo} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Information'}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <input
                type="password"
                id="confirmNewPassword"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>

        {/* Update Default Address */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4">Default Shipping Address</h2>
          <form onSubmit={handleUpdateDefaultAddress} className="space-y-4">
            {userProfile.addresses.length === 0 ? (
              <p>No addresses saved. <Link href="/account/addresses" className="text-blue-500 hover:underline">Add one now</Link>.</p>
            ) : (
              <select
                value={selectedDefaultAddress || ''}
                onChange={(e) => setSelectedDefaultAddress(parseInt(e.target.value, 10))}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              >
                <option value="">Select a default address</option>
                {userProfile.addresses.map((addr) => (
                  <option key={addr.id} value={addr.id}>
                    {addr.street}, {addr.city}, {addr.state} {addr.postcode} {addr.is_default && '(Current Default)'}
                  </option>
                ))}
              </select>
            )}
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              disabled={loading || !selectedDefaultAddress}
            >
              {loading ? 'Updating...' : 'Set Default Address'}
            </button>
          </form>
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

  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/account/profile`, {
      headers: {
        Cookie: context.req.headers.cookie || '', // Pass cookies for session
      },
    });

    if (res.ok) {
      const userProfile = await res.json();
      return {
        props: {
          userProfile: JSON.parse(JSON.stringify(userProfile)), // Serialize for Next.js
        },
      };
    } else {
      console.error('Failed to fetch user profile for settings:', res.status, res.statusText);
      return {
        props: {
          userProfile: null,
        },
      };
    }
  } catch (error) {
    console.error('Error in getServerSideProps for account settings page:', error);
    return {
      props: {
        userProfile: null,
      },
    };
  }
};
