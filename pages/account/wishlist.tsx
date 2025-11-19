import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import ProductCard from '../../components/ProductCard';
import { Product } from '../../lib/db'; // Assuming Product interface is exported from lib/db
import { useCart } from '../../context/CartContext'; // Import useCart

interface WishlistItem extends Product {
  wishlist_id: number; // Add wishlist_id for potential removal
}

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { addItem } = useCart(); // Get addItem from useCart
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/login'); // Redirect to login if not authenticated
      return;
    }

    fetchWishlist();
  }, [session, status, router]);

  const fetchWishlist = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/wishlist');
      if (!response.ok) {
        throw new Error('Failed to fetch wishlist');
      }
      const data = await response.json();
      setWishlist(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching your wishlist.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    setError('');
    try {
      const response = await fetch('/api/wishlist/remove', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove product from wishlist');
      }
      // alert('Product removed from wishlist!'); // Removed alert for smoother UX
      fetchWishlist(); // Re-fetch wishlist to update the list
    } catch (err: any) {
      setError(err.message || 'An error occurred while removing from wishlist.');
    }
  };

  const handleMoveToCart = async (product: WishlistItem) => {
    setError('');
    try {
      // Add to cart
      addItem(parseInt(product.id, 10), 1); // Add 1 quantity to cart
      alert(`${product.title} added to cart!`);

      // Remove from wishlist
      await handleRemoveFromWishlist(product.id);
    } catch (err: any) {
      setError(err.message || 'An error occurred while moving product to cart.');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <Layout>
        <div className="container mx-auto p-4 text-center">Loading wishlist...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto p-4 text-center text-red-500">{error}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>
        {wishlist.length === 0 ? (
          <p className="text-center text-gray-600">Your wishlist is empty.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <div key={product.id} className="relative group"> {/* Added group for hover effects */}
                <ProductCard
                  id={product.id}
                  title={product.title}
                  price={product.price}
                  images={product.images}
                  condition={product.condition}
                  stock={product.stock}
                />
                <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => handleMoveToCart(product)}
                    className="bg-blue-600 text-white rounded-full p-2 shadow-md hover:bg-blue-700 transition-colors"
                    title="Move to Cart"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleRemoveFromWishlist(product.id)}
                    className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                    title="Remove from Wishlist"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
