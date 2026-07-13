'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Check, CreditCard, Link2, Palette, Store } from 'lucide-react';
import { ColorCylinderCarousel } from '@/components/ColorCylinderCarousel';
import { readUniversalStoreData, writeUniversalStoreData } from '@/lib/demo-store';

const STEPS = [
  { id: 1, label: 'Store Name', icon: Store },
  { id: 2, label: 'Theme', icon: Palette },
  { id: 3, label: 'Socials', icon: Link2 },
  { id: 4, label: 'Payments', icon: CreditCard },
];

interface WizardData {
  storeName: string;
  themeColor: string;
  socials: Record<string, string>;
  stripe: boolean;
}

const DEFAULT_WIZARD_DATA: WizardData = {
  storeName: '',
  themeColor: '#0F4B5F',
  socials: {},
  stripe: false,
};

export default function SetupWizardPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [wizardData, setWizardData] = useState<WizardData>(DEFAULT_WIZARD_DATA);

  useEffect(() => {
    const existing = readUniversalStoreData();
    if (existing.settings) {
      setWizardData({
        storeName: existing.settings.storeName ?? '',
        themeColor: existing.settings.themeColor ?? '#0F4B5F',
        socials: existing.settings.socials ?? {},
        stripe: Boolean(existing.settings.stripe),
      });
    }
  }, []);

  const handleStoreNameKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && wizardData.storeName.trim()) {
      event.preventDefault();
      nextStep();
    }
  };

  const nextStep = () => {
    setDirection(1);
    setStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const handleColorSelect = (color: string) => {
    setWizardData((prev) => ({ ...prev, themeColor: color }));
    window.setTimeout(() => nextStep(), 700);
  };

  const updateSocial = (platform: string, value: string) => {
    setWizardData((prev) => ({
      ...prev,
      socials: { ...prev.socials, [platform]: value },
    }));
  };

  const handleFinishSetup = () => {
    setIsSaving(true);
    const payload = {
      settings: {
        storeName: wizardData.storeName.trim() || 'My Store',
        themeColor: wizardData.themeColor,
        socials: wizardData.socials,
        stripe: wizardData.stripe,
      },
      products: readUniversalStoreData().products,
    };

    writeUniversalStoreData(payload);
    router.push('/');
  };

  const stepLabel = useMemo(() => STEPS[step]?.label ?? 'Setup', [step]);

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Universal Store Setup</p>
          <h1 className="mt-2 text-2xl font-semibold">{stepLabel}</h1>
        </div>

        <div className="flex items-center justify-between gap-2">
          {STEPS.map((item, index) => {
            const Icon = item.icon;
            const isActive = index <= step;
            return (
              <div key={item.id} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full border ${isActive ? 'border-white/0' : 'border-white/20'}`}
                  style={{ backgroundColor: isActive ? wizardData.themeColor : '#1f2937' }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-center text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-5 shadow-2xl shadow-black/30">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={{ opacity: 0, x: direction > 0 ? 24 : -24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -24 : 24 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              {step === 0 && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Name your store</h2>
                    <p className="text-sm text-slate-400">This will appear across your storefront and receipts.</p>
                  </div>
                  <div className="relative">
                    <input
                      autoFocus
                      value={wizardData.storeName}
                      onChange={(event) => setWizardData((prev) => ({ ...prev, storeName: event.target.value }))}
                      onKeyDown={handleStoreNameKeyDown}
                      placeholder='e.g. "Northwind Motors"'
                      className="min-h-[56px] w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-base text-white outline-none ring-0"
                    />
                    {wizardData.storeName.trim() && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Check className="h-5 w-5 text-emerald-400" />
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!wizardData.storeName.trim()}
                    className="min-h-[56px] w-full rounded-2xl px-4 py-3 text-base font-semibold text-white disabled:opacity-50"
                    style={{ backgroundColor: wizardData.themeColor }}
                  >
                    Next
                  </button>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Choose a theme color</h2>
                    <p className="text-sm text-slate-400">The carousel updates your storefront accent instantly.</p>
                  </div>
                  <ColorCylinderCarousel
                    defaultValue={wizardData.themeColor}
                    onColorSelect={handleColorSelect}
                  />
                  <button
                    type="button"
                    onClick={nextStep}
                    className="min-h-[56px] w-full rounded-2xl px-4 py-3 text-base font-semibold text-white"
                    style={{ backgroundColor: wizardData.themeColor }}
                  >
                    Next
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Add your socials</h2>
                    <p className="text-sm text-slate-400">Instagram, Facebook, and TikTok are all supported.</p>
                  </div>
                  <div className="space-y-3">
                    {['instagram', 'facebook', 'tiktok'].map((platform) => (
                      <label key={platform} className="block">
                        <span className="mb-2 block text-sm uppercase tracking-[0.2em] text-slate-400">{platform}</span>
                        <input
                          value={wizardData.socials[platform] ?? ''}
                          onChange={(event) => updateSocial(platform, event.target.value)}
                          placeholder={platform === 'instagram' || platform === 'tiktok' ? '@yourhandle' : 'facebook.com/yourpage'}
                          className="min-h-[56px] w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-base text-white outline-none"
                        />
                      </label>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="min-h-[56px] w-full rounded-2xl px-4 py-3 text-base font-semibold text-white"
                    style={{ backgroundColor: wizardData.themeColor }}
                  >
                    Next
                  </button>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Connect payments</h2>
                    <p className="text-sm text-slate-400">Stripe is mocked for now, but your setup is ready to go live.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setWizardData((prev) => ({ ...prev, stripe: true }))}
                    className="min-h-[56px] w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-base font-semibold text-white"
                  >
                    {wizardData.stripe ? 'Stripe Connected' : 'Connect Stripe (Mock)'}
                  </button>
                  <button
                    type="button"
                    onClick={handleFinishSetup}
                    disabled={isSaving}
                    className="min-h-[56px] w-full rounded-2xl px-4 py-3 text-base font-semibold text-white"
                    style={{ backgroundColor: wizardData.themeColor }}
                  >
                    {isSaving ? 'Saving…' : 'Finish Setup'}
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
