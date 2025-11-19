
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { getAllUsersWithOrderCount } from '../../../lib/db';
import { useState } from 'react';
import ConfirmationModal from '../../../components/admin/ConfirmationModal';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  banned: boolean;
  created_at: string;
  order_count: number;
}

interface AdminUsersPageProps {
  initialUsers: User[];
}

export default function AdminUsersPage({ initialUsers }: AdminUsersPageProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [userToModify, setUserToModify] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<'customer' | 'admin'>('customer');

  const [showBanModal, setShowBanModal] = useState(false);
  const [isBanning, setIsBanning] = useState(false); // true for ban, false for unban

  const handleAction = async (userId: number, action: 'promote' | 'demote' | 'ban' | 'unban') => {
    setLoading(true);
    setError(null);
    try {
      let body: any = {};
      if (action === 'promote') {
        body.role = 'admin';
      } else if (action === 'demote') {
        body.role = 'customer';
      } else if (action === 'ban') {
        body.banned = true;
      } else if (action === 'unban') {
        body.banned = false;
      }

      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUsers((prevUsers) =>
          prevUsers.map((u) => (u.id === userId ? { ...u, ...updatedUser } : u))
        );
      } else {
        const errorData = await res.json();
        setError(errorData.message || `Failed to ${action} user.`);
      }
    } catch (err: any) {
      console.error(`Error ${action} user:`, err);
      setError(err.message || `An unexpected error occurred while ${action}ing user.`);
    } finally {
      setLoading(false);
      setShowRoleModal(false);
      setShowBanModal(false);
      setUserToModify(null);
    }
  };

  const openRoleModal = (user: User, role: 'customer' | 'admin') => {
    setUserToModify(user);
    setNewRole(role);
    setShowRoleModal(true);
  };

  const openBanModal = (user: User, ban: boolean) => {
    setUserToModify(user);
    setIsBanning(ban);
    setShowBanModal(true);
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">User Management</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}

      {loading ? (
        <p>Loading users...</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {user.banned ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Banned</span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.order_count}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {user.role === 'customer' ? (
                      <button
                        onClick={() => openRoleModal(user, 'admin')}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                        disabled={loading}
                      >
                        Promote to Admin
                      </button>
                    ) : (
                      <button
                        onClick={() => openRoleModal(user, 'customer')}
                        className="text-yellow-600 hover:text-yellow-900 mr-4"
                        disabled={loading}
                      >
                        Demote to Customer
                      </button>
                    )}
                    {user.banned ? (
                      <button
                        onClick={() => openBanModal(user, false)}
                        className="text-green-600 hover:text-green-900"
                        disabled={loading}
                      >
                        Unban
                      </button>
                    ) : (
                      <button
                        onClick={() => openBanModal(user, true)}
                        className="text-red-600 hover:text-red-900"
                        disabled={loading}
                      >
                        Ban
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmationModal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        onConfirm={() => userToModify && handleAction(userToModify.id, newRole === 'admin' ? 'promote' : 'demote')}
        title={`Confirm Role Change for ${userToModify?.name}`}
        message={`Are you sure you want to change ${userToModify?.name}'s role to ${newRole}?`}
        confirmText="Confirm"
      />

      <ConfirmationModal
        isOpen={showBanModal}
        onClose={() => setShowBanModal(false)}
        onConfirm={() => userToModify && handleAction(userToModify.id, isBanning ? 'ban' : 'unban')}
        title={`Confirm User ${isBanning ? 'Ban' : 'Unban'} for ${userToModify?.name}`}
        message={`Are you sure you want to ${isBanning ? 'ban' : 'unban'} ${userToModify?.name}?`}
        confirmText={isBanning ? 'Ban User' : 'Unban User'}
      />
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
    const users = await getAllUsersWithOrderCount();
    return {
      props: {
        initialUsers: JSON.parse(JSON.stringify(users)),
      },
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    return {
      props: {
        initialUsers: [],
      },
    };
  }
};
