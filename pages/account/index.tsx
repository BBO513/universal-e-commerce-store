
import { GetServerSideProps } from 'next';
import { getSession, useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout'; // Assuming a general layout component

interface Address {
  id: number;
  type: string;
  street: string;
  city: string;
  state: string;
  postcode: string;
  is_default: boolean;
}

interface Order {
  id: number;
  total: number;
  status: string;
  created_at: string;
}

interface UserProfile {
  id: number;
  name: string;
  email: string;
  addresses: Address[];
  recentOrders: Order[];
}

interface AccountPageProps {
  userProfile: UserProfile | null;
}

export default function AccountPage({ userProfile }: AccountPageProps) {
  const { data: session } = useSession();

  if (!session) {
    return (
      <Layout>
        <div className="container mx-auto p-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>Please log in to view your account details.</p>
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

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
    }).format(value);
  };

  return (
    <Layout>
      <Head>
        <title>My Account - {userProfile.name}</title>
      </Head>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">My Account</h1>

        {/* User Info */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
          <p className="text-lg"><strong>Name:</strong> {userProfile.name}</p>
          <p className="text-lg"><strong>Email:</strong> {userProfile.email}</p>
          <Link href="/account/edit"> {/* Link to a future edit profile page */}
            <a className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              Edit Profile
            </a>
          </Link>
        </div>

        {/* Saved Addresses */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4">Saved Addresses</h2>
          {userProfile.addresses.length === 0 ? (
            <p>No addresses saved yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userProfile.addresses.map((address) => (
                <div key={address.id} className="border p-4 rounded-md">
                  <p className="font-semibold capitalize">{address.type} Address {address.is_default && '(Default)'}</p>
                  <p>{address.street}</p>
                  <p>{address.city}, {address.state} {address.postcode}</p>
                  {/* Add edit/delete address buttons here */}
                </div>
              ))}
            </div>
          )}
          <Link href="/account/addresses"> {/* Link to a future address management page */}
            <a className="mt-4 inline-block bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
              Manage Addresses
            </a>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4">Recent Orders</h2>
          {userProfile.recentOrders.length === 0 ? (
            <p>You have no recent orders.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userProfile.recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatPrice(order.total)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{order.status}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link href={`/account/orders/${order.id}`}> {/* Link to a future order detail page */}
                          <a className="text-indigo-600 hover:text-indigo-900">View Details</a>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Link href="/account/orders"> {/* Link to a future all orders page */}
            <a className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              View All Orders
            </a>
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
      console.error('Failed to fetch user profile:', res.status, res.statusText);
      return {
        props: {
          userProfile: null,
        },
      };
    }
  } catch (error) {
    console.error('Error in getServerSideProps for account page:', error);
    return {
      props: {
        userProfile: null,
      },
    };
  }
};
