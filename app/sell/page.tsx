'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Home, ShoppingBag, User, Package, Wand2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { listItem } from './actions';

const NAV_ITEMS = [
  { id: 'home', icon: Home, label: 'Home', href: '/' },
  { id: 'sell', icon: Package, label: 'Sell', href: '/sell', active: true },
  { id: 'orders', icon: ShoppingBag, label: 'Orders', href: '/account/orders' },
  { id: 'profile', icon: User, label: 'Profile', href: '/account' },
];

export default function SellPage() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isListing, setIsListing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const MOCK_ITEMS = [
    'Vintage Silver Wristwatch',
    'Sony WH-1000XM5 Headphones',
    'Ceramic Pour-Over Coffee Set',
    'Red Nike Running Shoes',
    'Apple Magic Keyboard',
    'Mid-Century Desk Lamp',
    'Polaroid Instant Camera',
    'Mechanical Gaming Keyboard',
    'Leather Messenger Bag',
    'Kindle Paperwhite e-Reader',
    'Bose Bluetooth Speaker',
    'Retro Vinyl Record Collection',
    'Yoga Mat + Accessories Bundle',
    'Samsung Galaxy Tablet',
    'Handmade Leather Journal',
  ];

  const handleMagicIdentify = () => {
    const randomItem = MOCK_ITEMS[Math.floor(Math.random() * MOCK_ITEMS.length)];
    setTitle(randomItem);
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhoto(url);
      setPhotoFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPhoto(url);
      setPhotoFile(file);
    }
  };

  const handleList = async () => {
    if (!photoFile || !title || !price || isListing) return;

    setIsListing(true);

    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(photoFile);
    });

    const formData = new FormData();
    formData.append('photo', base64);
    formData.append('title', title);
    formData.append('price', price);

    const result = await listItem(formData);

    setIsListing(false);

    if (result.success) {
      setShowSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 2800);
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col bg-black text-white font-sans select-none overflow-hidden">
      {/* Viewfinder / Photo Area — Top 60% */}
      <div
        className="relative flex-1 flex items-center justify-center bg-neutral-900 cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoSelect}
        />

        {photo ? (
          <>
            <img
              src={photo}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none"
            />
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              onClick={(e) => {
                e.stopPropagation();
                setPhoto(null);
                setPhotoFile(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center shadow-lg z-20"
            >
              <X className="w-5 h-5 text-white" />
            </motion.button>
          </>
        ) : (
          <motion.div
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-3"
          >
            <div className="w-20 h-20 rounded-full border-2 border-white/20 flex items-center justify-center">
              <Plus className="w-10 h-10 text-white/40" />
            </div>
            <p className="text-sm text-white/40 font-medium tracking-wide">Tap to add a photo</p>
          </motion.div>
        )}
      </div>

      {/* Bottom Sheet — Bottom 40% */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 35, delay: 0.1 }}
        className="bg-white dark:bg-neutral-900 rounded-t-[28px] px-6 pt-6 pb-4 flex flex-col gap-5 shadow-2xl shadow-black/30"
        style={{ minHeight: '40%' }}
      >
        {/* Title Input */}
        <div className="border-b border-neutral-200 dark:border-neutral-800 pb-3 flex items-center gap-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What are you selling?"
            className="flex-1 text-2xl font-bold bg-transparent text-black dark:text-white placeholder:text-neutral-300 dark:placeholder:text-neutral-600 outline-none"
          />
          <motion.button
            animate={
              !title
                ? { scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] }
                : { scale: 1, opacity: 0.3 }
            }
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            onClick={handleMagicIdentify}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-md shadow-purple-500/20"
          >
            <Wand2 className="w-5 h-5" />
          </motion.button>
        </div>
        {/* Price Input */}
        <div className="flex items-center border-b border-neutral-200 dark:border-neutral-800 pb-3">
          <span className="text-4xl font-black text-neutral-300 dark:text-neutral-600 mr-1">$</span>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0"
            min="0"
            step="0.01"
            className="w-full text-4xl font-black bg-transparent text-black dark:text-white placeholder:text-neutral-300 dark:placeholder:text-neutral-600 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>

        {/* Spacer for the fixed button */}
        <div className="h-20" />
      </motion.div>

      {/* List Button — Fixed Bottom */}
      <div className="absolute bottom-[72px] left-0 right-0 px-4 z-30">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleList}
          disabled={(!photo && !title && !price) || isListing}
          className={`w-full h-[64px] rounded-t-[20px] text-xl font-bold tracking-wide uppercase transition-all ${
            photo || title || price
              ? isListing
                ? 'bg-neutral-600 text-neutral-400'
                : 'bg-white text-black shadow-2xl shadow-black/40'
              : 'bg-neutral-800 text-neutral-500'
          }`}
        >
          {isListing ? 'Listing...' : 'List My Item'}
        </motion.button>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="h-[72px] bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-around px-4 z-40 safe-area-bottom">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 min-w-[56px] ${
                item.active
                  ? 'text-black dark:text-white'
                  : 'text-neutral-400 dark:text-neutral-600'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-[10px] font-semibold tracking-wide">{item.label}</span>
            </a>
          );
        })}
      </div>

      {/* Success Overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center gap-6"
          >
            {/* Animated Checkmark */}
            <motion.svg
              width="100"
              height="100"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.circle
                cx="50"
                cy="50"
                r="46"
                stroke="#22C55E"
                strokeWidth="4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
              <motion.path
                d="M30 50 L44 64 L70 36"
                stroke="#22C55E"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.5, ease: 'easeOut' }}
              />
            </motion.svg>

            {/* Success Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="text-center"
            >
              <motion.p
                className="text-4xl font-black text-white tracking-tight"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.0, type: 'spring', stiffness: 300 }}
              >
                Boom!
              </motion.p>
              <motion.p
                className="text-lg font-medium text-neutral-400 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.4 }}
              >
                You&apos;re live.
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
