import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import AdminLayout from '../../../components/admin/AdminLayout';
import Link from 'next/link';
import { Review } from '../../../lib/db'; // Assuming Review interface is exported from lib/db

interface AdminReview extends Review {
  product_title: string;
  author_name: string;
}

export default function AdminReviewsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [productIdFilter, setProductIdFilter] = useState('');
  const [userIdFilter, setUserIdFilter] = useState('');
  const [isApprovedFilter, setIsApprovedFilter] = useState<string>('all'); // 'all', 'true', 'false'
  const [selectedReviews, setSelectedReviews] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin'); // Redirect to admin login if not authenticated
    } else if (session && session.user && session.user.role !== 'admin') {
      router.push('/unauthorized'); // Redirect if not an admin
    }
  }, [session, status, router]);

  useEffect(() => {
    if (session?.user?.role === 'admin') {
      fetchReviews();
    }
  }, [page, limit, productIdFilter, userIdFilter, isApprovedFilter, session]);

  const fetchReviews = async () => {
    setLoading(true);
    setError('');
    try {
      const query = new URLSearchParams();
      query.append('page', page.toString());
      query.append('limit', limit.toString());
      if (productIdFilter) query.append('productId', productIdFilter);
      if (userIdFilter) query.append('userId', userIdFilter);
      if (isApprovedFilter !== 'all') query.append('isApproved', isApprovedFilter);

      const response = await fetch(`/api/admin/reviews?${query.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      const data = await response.json();
      setReviews(data.reviews);
      setTotalReviews(data.totalReviews);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching reviews.');
    } finally {
      setLoading(false);
    }
  };

  const handleModeration = async (reviewIds: number[], status: 'approve' | 'reject') => {
    setError('');
    try {
      const response = await fetch('/api/reviews/moderate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviewIds, status }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${status} reviews`);
      }
      alert(`Reviews ${status}d successfully!`);
      setSelectedReviews([]); // Clear selection
      fetchReviews(); // Re-fetch reviews to update the list
    } catch (err: any) {
      setError(err.message || `An error occurred while ${status}ing reviews.`);
    }
  };

  const handleCheckboxChange = (reviewId: number) => {
    setSelectedReviews((prevSelected) =>
      prevSelected.includes(reviewId)
        ? prevSelected.filter((id) => id !== reviewId)
        : [...prevSelected, reviewId]
    );
  };

  const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedReviews(reviews.map((review) => review.id));
    } else {
      setSelectedReviews([]);
    }
  };

  const totalPages = Math.ceil(totalReviews / limit);

  if (status === 'loading' || loading) {
    return <AdminLayout><div className="text-center py-8">Loading...</div></AdminLayout>;
  }

  if (error) {
    return <AdminLayout><div className="text-center py-8 text-red-500">{error}</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Review Moderation</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-wrap gap-4 items-center">
        <div>
          <label htmlFor="productIdFilter" className="block text-sm font-medium text-gray-700">Product ID</label>
          <input
            type="text"
            id="productIdFilter"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={productIdFilter}
            onChange={(e) => setProductIdFilter(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="userIdFilter" className="block text-sm font-medium text-gray-700">User ID</label>
          <input
            type="text"
            id="userIdFilter"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={userIdFilter}
            onChange={(e) => setUserIdFilter(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="isApprovedFilter" className="block text-sm font-medium text-gray-700">Status</label>
          <select
            id="isApprovedFilter"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={isApprovedFilter}
            onChange={(e) => setIsApprovedFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="false">Pending</option>
            <option value="true">Approved</option>
          </select>
        </div>
        <button
          onClick={fetchReviews}
          className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
        >
          Apply Filters
        </button>
      </div>

      {/* Bulk Actions */}
      {selectedReviews.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex gap-4 items-center">
          <span className="font-semibold">{selectedReviews.length} reviews selected:</span>
          <button
            onClick={() => handleModeration(selectedReviews, 'approve')}
            className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
          >
            Bulk Approve
          </button>
          <button
            onClick={() => handleModeration(selectedReviews, 'reject')}
            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700"
          >
            Bulk Reject
          </button>
        </div>
      )}

      {/* Reviews Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  onChange={handleSelectAllChange}
                  checked={selectedReviews.length === reviews.length && reviews.length > 0}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reviews.map((review) => (
              <tr key={review.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    checked={selectedReviews.includes(review.id)}
                    onChange={() => handleCheckboxChange(review.id)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{review.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <Link href={`/product/${review.product_id}`} className="text-blue-600 hover:underline">
                    {review.product_title}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{review.author_name} (ID: {review.user_id})</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{review.rating}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{review.title}</td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{review.comment}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      review.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {review.is_approved ? 'Approved' : 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(review.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {!review.is_approved && (
                    <button
                      onClick={() => handleModeration([review.id], 'approve')}
                      className="text-green-600 hover:text-green-900 mr-3"
                    >
                      Approve
                    </button>
                  )}
                  {review.is_approved && (
                    <button
                      onClick={() => handleModeration([review.id], 'reject')}
                      className="text-yellow-600 hover:text-yellow-900 mr-3"
                    >
                      Reject
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-md hover:bg-gray-400 disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-md hover:bg-gray-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </AdminLayout>
  );
}