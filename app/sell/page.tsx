'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, ImagePlus, Package, ShoppingBag, User, Home } from 'lucide-react';
import { readUniversalStoreData, writeUniversalStoreData } from '@/lib/demo-store';

const NAV_ITEMS = [
  { id: 'home', icon: Home, label: 'Home', href: '/' },
  { id: 'sell', icon: Package, label: 'Sell', href: '/sell', active: true },
  { id: 'orders', icon: ShoppingBag, label: 'Orders', href: '/account/orders' },
  { id: 'profile', icon: User, label: 'Profile', href: '/account' },
];

export default function SellPage() {
  const [photo, setPhoto] = useState<string>('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [isListing, setIsListing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const priceInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(reader.result as string);
    };
    reader.readAsDataURL(file);
    setPhotoFile(file);
  };

  const handleList = async () => {
    if (!title.trim() || !price.trim() || !photo || isListing) return;

    setIsListing(true);

    const current = readUniversalStoreData();
    const newProduct = {
      id: Date.now(),
      title: title.trim(),
      price: Number(price),
      images: [photo],
      created_at: new Date().toISOString(),
    };

    await writeUniversalStoreData({
      settings: current.settings,
      products: [newProduct, ...current.products],
    });

    setIsListing(false);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-4 text-white">
      <div className="mx-auto flex max-w-2xl flex-col gap-4 rounded-[32px] border border-white/10 bg-slate-900/80 p-4 shadow-2xl shadow-black/30">
        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">List an item</p>
            <h1 className="text-xl font-semibold">Sell in seconds</h1>
          </div>
          <div className="rounded-2xl bg-white/10 p-3">
            <Camera className="h-5 w-5 text-white" />
          </div>
        </div>

        <label className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-[28px] border border-dashed border-white/15 bg-slate-800/80 px-4 text-center">
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoSelect} />
          {photo ? (
            <img src={photo} alt="Selected preview" className="h-full w-full rounded-[24px] object-cover" />
          ) : (
            <>
              <div className="rounded-full bg-white/10 p-4">
                <ImagePlus className="h-7 w-7" />
              </div>
              <div>
                <p className="text-base font-semibold">Add a photo</p>
                <p className="text-sm text-slate-400">Tap here to choose an image from your device.</p>
              </div>
            </>
          )}
        </label>

        <div className="space-y-3 rounded-[24px] border border-white/10 bg-slate-800/70 p-4">
          <input
            autoFocus
            enterKeyHint="next"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                priceInputRef.current?.focus();
              }
            }}
            placeholder="What are you selling?"
            className="min-h-[56px] w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-base text-white outline-none"
          />
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3">
            <span className="text-lg font-semibold text-slate-400">$</span>
            <input
              ref={priceInputRef}
              type="number"
              inputMode="numeric"
              enterKeyHint="done"
              min="0"
              step="0.01"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  handleList();
                }
              }}
              placeholder="0"
              className="min-h-[56px] w-full rounded-none bg-transparent text-lg font-semibold text-white outline-none"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleList}
          disabled={!photo || !title.trim() || !price.trim() || isListing}
          className="min-h-[56px] w-full rounded-2xl bg-white px-4 py-3 text-base font-semibold text-slate-950 disabled:opacity-50"
        >
          {isListing ? 'Listing…' : 'List My Item'}
        </button>
      </div>

      <nav className="mx-auto mt-4 flex max-w-2xl items-center justify-around rounded-[24px] border border-white/10 bg-slate-900/80 px-3 py-3 shadow-lg shadow-black/20">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.id}
              href={item.href}
              className={`flex min-w-[56px] flex-col items-center gap-1 rounded-2xl px-3 py-2 ${item.active ? 'bg-white/10 text-white' : 'text-slate-400'}`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </a>
          );
        })}
      </nav>
    </div>
  );
}
