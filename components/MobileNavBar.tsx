import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaHome, FaThLarge, FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const MobileNavBar: React.FC = () => {
  const router = useRouter();
  const { cartItems } = useCart();
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const navItems = [
    { name: 'Home', icon: FaHome, path: '/' },
    { name: 'Categories', icon: FaThLarge, path: '/categories' }, // Assuming a /categories page
    { name: 'Cart', icon: FaShoppingCart, path: '/cart' },
    { name: 'Account', icon: FaUserCircle, path: '/account' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 md:hidden">
      <div className="flex justify-around h-16">
        {navItems.map((item) => (
          <Link 
            href={item.path} 
            key={item.name}
            className={`flex flex-col items-center justify-center flex-grow text-gray-600 hover:text-blue-600 transition-colors duration-200 ${
              router.pathname === item.path ? 'text-blue-600' : ''
            }`}
          >
            <div className="relative text-2xl mb-1">
              <item.icon />
              {item.name === 'Cart' && cartItemCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </div>
            <span className="text-xs">{item.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default MobileNavBar;
