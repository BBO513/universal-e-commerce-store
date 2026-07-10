'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { FaTrashAlt } from 'react-icons/fa'; // Assuming react-icons is installed
import FadeAspectImage from './FadeAspectImage';

const Cart: React.FC = () => {
  const { cartItems, updateItem, removeItem, cartTotal, loading } = useCart();

  if (loading) {
    return <div className="p-4 text-center">Loading cart...</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-600">Your cart is empty.</p>
        <Link href="/search" className="mt-4 inline-block text-blue-600 hover:underline">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Shopping Cart</h2>
      <div className="space-y-4">
        {cartItems.map((item) => (
          <div key={item.cart_item_id} className="flex items-center border-b pb-4">
            <FadeAspectImage
              src={item.images[0] || '/placeholder.jpg'}
              alt={item.title}
              aspect="aspect-square"
              wrapperClassName="w-20 mr-4"
              className="rounded-2xl"
            />
            <div className="flex-grow">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-gray-600">${item.price.toFixed(2)}</p>
              <div className="flex items-center mt-1">
                <label htmlFor={`quantity-${item.cart_item_id}`} className="sr-only">Quantity</label>
                <input
                  id={`quantity-${item.cart_item_id}`}
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateItem(item.cart_item_id, parseInt(e.target.value, 10))}
                  className="w-16 border border-gray-300 rounded-md text-center py-1"
                />
                <button
                  onClick={() => removeItem(item.cart_item_id)}
                  className="ml-4 text-red-500 hover:text-red-700"
                >
                  <FaTrashAlt />
                </button>
              </div>
            </div>
            <div className="text-lg font-semibold">${(item.price * item.quantity).toFixed(2)}</div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t flex justify-between items-center">
        <span className="text-xl font-bold">Total:</span>
        <span className="text-xl font-bold">${cartTotal.toFixed(2)}</span>
      </div>
      <div className="mt-6">
        <Link href="/checkout" className="w-full block text-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
};

export default Cart;
