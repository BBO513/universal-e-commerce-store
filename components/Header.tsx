
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useTranslation } from 'next-i18next';

export default function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const { cartItems } = useCart();
  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const { t } = useTranslation('common');
  const { locale, locales, asPath } = router;
  const { currency, setCurrency } = useCurrency();
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const currencyDropdownRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?query=${searchTerm}`);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
      if (currencyDropdownRef.current && !currencyDropdownRef.current.contains(event.target as Node)) {
        setIsCurrencyDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [langDropdownRef, currencyDropdownRef]);

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold min-h-[44px] flex items-center"> {/* Added min-h and flex for tap target */}
          <Link href="/" className="px-2 py-1 rounded-md hover:bg-gray-700 transition-colors">
            My Store
          </Link>
        </div>
        <div className="flex-grow mx-4">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search for parts..."
              className="w-full p-2 rounded text-black min-h-[44px]" // Added min-h for tap target
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </div>
        <nav className="hidden md:flex items-center space-x-4"> {/* Hidden on mobile */}
          <Link href="/cart" className="flex items-center relative px-2 py-1 rounded-md hover:bg-gray-700 transition-colors min-h-[44px]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {totalCartItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalCartItems}
              </span>
            )}
            <span className="ml-2">Cart</span>
          </Link>
          <Link href="/account" className="px-2 py-1 rounded-md hover:bg-gray-700 transition-colors min-h-[44px] flex items-center">
            Account
          </Link>
          <div className="relative" ref={langDropdownRef}>
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="px-2 py-1 rounded-md hover:bg-gray-700 transition-colors min-h-[44px] flex items-center"
            >
              {locale.toUpperCase()}
            </button>
            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-md shadow-lg">
                {locales.map((loc) => (
                  <Link key={loc} href={asPath} locale={loc} className="block px-4 py-2 text-sm text-white hover:bg-gray-700">
                    {loc.toUpperCase()}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className="relative" ref={currencyDropdownRef}>
            <button
              onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
              className="px-2 py-1 rounded-md hover:bg-gray-700 transition-colors min-h-[44px] flex items-center"
            >
              {currency}
            </button>
            {isCurrencyDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-md shadow-lg">
                <button onClick={() => setCurrency('AUD')} className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700">
                  AUD
                </button>
                <button onClick={() => setCurrency('USD')} className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700">
                  USD
                </button>
                <button onClick={() => setCurrency('EUR')} className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700">
                  EUR
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
