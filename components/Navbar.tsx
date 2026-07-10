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
  const { cartItems } = useCart();
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
    <nav className="bg-white text-slate-950 border-b border-slate-200 shadow-boutiqueSoft">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="text-2xl font-semibold tracking-tight text-slate-950 transition-colors hover:text-boutique-accent">
            My Store
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-full text-slate-600 transition duration-300 ease-in-out hover:text-slate-950 hover:bg-slate-100"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/cart"
              className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full text-slate-700 bg-slate-50 border border-slate-200 transition duration-300 ease-in-out hover:bg-slate-100 hover:text-slate-950"
            >
              <FaShoppingCart className="w-4 h-4" />
              <span>Cart</span>
              {totalItemsInCart > 0 && (
                <span className="absolute -top-1 -right-1 bg-boutique-accent text-white text-[10px] font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItemsInCart}
                </span>
              )}
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-3">
            <Link
              href="/cart"
              className="relative inline-flex items-center justify-center rounded-full p-2 text-slate-600 bg-slate-100 hover:bg-slate-200 transition duration-300 ease-in-out"
            >
              <FaShoppingCart className="w-5 h-5" />
              {totalItemsInCart > 0 && (
                <span className="absolute -top-1 -right-1 bg-boutique-accent text-white text-[10px] font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItemsInCart}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-full p-2 text-slate-600 bg-slate-100 hover:bg-slate-200 transition duration-300 ease-in-out"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? <CloseMenuIcon /> : <MobileMenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 shadow-boutiqueSoft">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block rounded-2xl px-4 py-3 text-base font-medium text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition duration-300 ease-in-out"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/cart"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-2xl px-4 py-3 text-base font-medium text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition duration-300 ease-in-out relative"
            >
              Cart
              {totalItemsInCart > 0 && (
                <span className="absolute top-4 right-4 bg-boutique-accent text-white text-[10px] font-semibold rounded-full h-5 w-5 flex items-center justify-center">
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
