'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext'; // Import useCart
import { FaShoppingCart } from 'react-icons/fa'; // Import cart icon

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/categories', label: 'Categories' },
  { href: '/search', label: 'Search' },
  { href: '/login', label: 'Account' },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartItems } = useCart(); // Use cart context
  const totalItemsInCart = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const MobileMenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  );
  
  const CloseMenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
            AutoStore
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors">
                {link.label}
              </Link>
            ))}
            {/* Cart Icon for Desktop */}
            <Link href="/cart" className="relative px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors">
              <FaShoppingCart className="w-5 h-5" />
              {totalItemsInCart > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {totalItemsInCart}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button and Cart Icon */}
          <div className="md:hidden flex items-center space-x-4">
            {/* Cart Icon for Mobile */}
            <Link href="/cart" className="relative p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <FaShoppingCart className="w-6 h-6" />
              {totalItemsInCart > 0 && (
                <span className="absolute -top-0 -right-0 bg-red-600 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {totalItemsInCart}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <CloseMenuIcon />
              ) : (
                <MobileMenuIcon />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {/* Cart Link for Mobile Menu */}
            <Link
              href="/cart"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors relative"
            >
              Cart
              {totalItemsInCart > 0 && (
                <span className="absolute top-1/2 -translate-y-1/2 right-3 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItemsInCart}
                </span>
              )}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
