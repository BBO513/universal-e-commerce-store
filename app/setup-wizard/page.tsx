'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Store,
  Palette,
  Link2,
  CreditCard,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { saveWizardSettings } from './actions';

const STEPS = [
  { id: 1, label: 'Brand', icon: Store },
  { id: 2, label: 'Theme', icon: Palette },
  { id: 3, label: 'Connect', icon: Link2 },
  { id: 4, label: 'Payments', icon: CreditCard },
];

const COLOR_PALETTE = [
  { name: 'Navy', value: '#0F4B5F' },
  { name: 'Indigo', value: '#4338CA' },
  { name: 'Emerald', value: '#047857' },
  { name: 'Rose', value: '#E11D48' },
  { name: 'Amber', value: '#D97706' },
  { name: 'Violet', value: '#7C3AED' },
  { name: 'Slate', value: '#334155' },
  { name: 'Teal', value: '#0D9488' },
];

const SOCIAL_PLATFORMS = [
  { id: 'instagram', label: 'Instagram', color: '#E4405F', prefix: '@' },
  { id: 'tiktok', label: 'TikTok', color: '#000000', prefix: '@' },
  { id: 'x', label: 'X (Twitter)', color: '#1DA1F2', prefix: '@' },
  { id: 'facebook', label: 'Facebook', color: '#1877F2', prefix: 'facebook.com/' },
];

interface WizardData {
  storeName: string;
  primaryColor: string;
  socialLinks: Record<string, string>;
  stripeConnected: boolean;
}

export default function SetupWizardPage() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [connected, setConnected] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const [wizardData, setWizardData] = useState<WizardData>({
    storeName: '',
    primaryColor: '#0F4B5F',
    socialLinks: {},
    stripeConnected: false,
  });

  const updateField = useCallback((field: keyof WizardData, value: any) => {
    setWizardData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const updateSocialLink = (platform: string, value: string) => {
    setWizardData((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value },
    }));
  };

  const handleConnect = async (platform: string) => {
    setConnecting(platform);
    await new Promise((r) => setTimeout(r, 1500));
    setConnected((prev) => [...prev, platform]);
    setConnecting(null);
  };

  const nextStep = () => {
    setDirection(1);
    setStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const isStepComplete = (s: number) => {
    switch (s) {
      case 0: return wizardData.storeName.trim().length > 0;
      case 1: return true;
      case 2: return connected.length > 0;
      case 3: return true;
      default: return false;
    }
  };

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Progress Stepper */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const isActive = i <= step;
              const isCurrent = i === step;
              return (
                <div key={s.id} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <motion.div
                      animate={{
                        scale: isCurrent ? 1.1 : 1,
                        backgroundColor: isActive
                          ? wizardData.primaryColor
                          : 'rgb(226 232 240)',
                      }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-500 ${
                        !isActive && 'dark:bg-slate-700'
                      }`}
                    >
                      {isActive ? (
                        <Icon className="w-5 h-5 text-white" />
                      ) : (
                        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                          {s.id}
                        </span>
                      )}
                    </motion.div>
                    <span
                      className={`mt-2 text-xs font-medium whitespace-nowrap ${
                        isCurrent
                          ? 'text-slate-900 dark:text-white'
                          : isActive
                          ? 'text-slate-600 dark:text-slate-300'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="flex-1 h-0.5 mx-3 mt-[-1rem]">
                      <motion.div
                        className="h-full rounded-full"
                        animate={{
                          backgroundColor: i < step ? wizardData.primaryColor : 'rgb(226 232 240)',
                        }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Card */}
        <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl shadow-2xl shadow-slate-200/50 dark:shadow-black/30">
          <div className="p-8 md:p-10">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                {/* Step 0: Store Name */}
                {step === 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{ backgroundColor: wizardData.primaryColor + '20' }}
                      >
                        <Store className="w-6 h-6" style={{ color: wizardData.primaryColor }} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                          Name your store
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                          This will appear on your storefront and receipts.
                        </p>
                      </div>
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        value={wizardData.storeName}
                        onChange={(e) => updateField('storeName', e.target.value)}
                        placeholder='e.g. "Nova Threads" or "Gear Lab"'
                        className="w-full px-5 py-4 text-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-shadow"
                        style={{ '--tw-ring-color': wizardData.primaryColor } as React.CSSProperties}
                        autoFocus
                      />
                      {wizardData.storeName.trim() && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute right-4 top-1/2 -translate-y-1/2"
                        >
                          <Check className="w-5 h-5 text-emerald-500" />
                        </motion.div>
                      )}
                    </div>

                    {wizardData.storeName.trim() && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30"
                      >
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
                          Preview
                        </p>
                        <p
                          className="text-3xl font-extrabold"
                          style={{ color: wizardData.primaryColor }}
                        >
                          {wizardData.storeName}
                        </p>
                        <p className="text-slate-400 text-sm mt-1">
                          yourstore.com
                        </p>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Step 1: Theme Colors */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{ backgroundColor: wizardData.primaryColor + '20' }}
                      >
                        <Palette className="w-6 h-6" style={{ color: wizardData.primaryColor }} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                          Pick your palette
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                          Choose an accent color that defines your brand.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                      {COLOR_PALETTE.map((color) => (
                        <motion.button
                          key={color.value}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => updateField('primaryColor', color.value)}
                          className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 transition-shadow ${
                            wizardData.primaryColor === color.value
                              ? 'ring-4 ring-offset-2 ring-offset-white dark:ring-offset-slate-800 shadow-lg'
                              : 'hover:shadow-md'
                          }`}
                          style={{
                            backgroundColor: color.value,
                            '--tw-ring-color': color.value,
                          } as React.CSSProperties}
                        >
                          {wizardData.primaryColor === color.value && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                            >
                              <Check className="w-5 h-5 text-white drop-shadow-sm" />
                            </motion.div>
                          )}
                          <span className="text-[10px] font-medium text-white/80">
                            {color.name}
                          </span>
                        </motion.button>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-500 dark:text-slate-400">Custom hex:</span>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700"
                          style={{ backgroundColor: wizardData.primaryColor }}
                        />
                        <input
                          type="text"
                          value={wizardData.primaryColor}
                          onChange={(e) => updateField('primaryColor', e.target.value)}
                          className="w-28 px-3 py-1.5 text-sm font-mono bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-300"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div
                        className="p-4 rounded-xl text-sm font-semibold text-center transition-colors"
                        style={{ backgroundColor: wizardData.primaryColor, color: '#fff' }}
                      >
                        Primary
                      </div>
                      <div
                        className="p-4 rounded-xl text-sm font-semibold text-center transition-colors"
                        style={{ backgroundColor: wizardData.primaryColor + '20', color: wizardData.primaryColor }}
                      >
                        Soft
                      </div>
                      <div
                        className="p-4 rounded-xl text-sm font-semibold text-center transition-colors border"
                        style={{ borderColor: wizardData.primaryColor + '40', color: wizardData.primaryColor }}
                      >
                        Outline
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Social Links */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{ backgroundColor: wizardData.primaryColor + '20' }}
                      >
                        <Link2 className="w-6 h-6" style={{ color: wizardData.primaryColor }} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                          Connect your socials
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                          Link your accounts to auto-generate social previews.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {SOCIAL_PLATFORMS.map((platform) => {
                        const isConnected = connected.includes(platform.id);
                        const isLoading = connecting === platform.id;

                        return (
                          <motion.div
                            key={platform.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: SOCIAL_PLATFORMS.indexOf(platform) * 0.1 }}
                            className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                              isConnected
                                ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20'
                                : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                          >
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold"
                              style={{ backgroundColor: platform.color }}
                            >
                              {platform.label.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-slate-900 dark:text-white text-sm">
                                {platform.label}
                              </p>
                              {isConnected ? (
                                <p className="text-emerald-600 dark:text-emerald-400 text-xs truncate">
                                  Connected
                                </p>
                              ) : (
                                <div className="flex items-center gap-1.5 mt-1">
                                  <span className="text-slate-400 text-xs">{platform.prefix}</span>
                                  <input
                                    type="text"
                                    placeholder="username"
                                    value={wizardData.socialLinks[platform.id] || ''}
                                    onChange={(e) => updateSocialLink(platform.id, e.target.value)}
                                    className="flex-1 px-2 py-0.5 text-xs bg-transparent border-b border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-slate-500"
                                  />
                                </div>
                              )}
                            </div>
                            {isConnected ? (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center"
                              >
                                <Check className="w-4 h-4 text-white" />
                              </motion.div>
                            ) : (
                              <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => handleConnect(platform.id)}
                                disabled={isLoading}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                                  isLoading
                                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-500 cursor-wait'
                                    : 'text-white hover:shadow-lg'
                                }`}
                                style={isLoading ? {} : { backgroundColor: platform.color }}
                              >
                                {isLoading ? (
                                  <>
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    Connecting
                                  </>
                                ) : (
                                  'Connect'
                                )}
                              </motion.button>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>

                    {connected.length === 4 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800 text-center"
                      >
                        <Sparkles className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                          All platforms connected!
                        </p>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Step 3: Stripe Connect Placeholder */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{ backgroundColor: wizardData.primaryColor + '20' }}
                      >
                        <CreditCard className="w-6 h-6" style={{ color: wizardData.primaryColor }} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                          Connect Stripe
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                          Accept payments from day one. Just add your keys in <code className="text-xs bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">.env.local</code>.
                        </p>
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-900/20 text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto">
                        <CreditCard className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                          Stripe will be configured in <code className="text-sm bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">.env.local</code>
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
                          Set <code className="text-xs bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded">STRIPE_SECRET_KEY</code> and{' '}
                          <code className="text-xs bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code>{' '}
                          to enable live payments.
                        </p>
                      </div>
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-xs font-mono text-slate-600 dark:text-slate-300">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        Test mode ready
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 text-white text-center space-y-3">
                      <Sparkles className="w-8 h-8 mx-auto text-amber-400" />
                      <h3 className="text-xl font-bold">You're all set!</h3>
                      <p className="text-slate-400 text-sm">
                        Your store <strong className="text-white">{wizardData.storeName || 'My Store'}</strong> is
                        ready. Click finish to save your settings and launch.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between px-8 md:px-10 pb-8 md:pb-10">
            <button
              onClick={prevStep}
              disabled={step === 0}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                step === 0
                  ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            {step < STEPS.length - 1 ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={nextStep}
                disabled={!isStepComplete(step)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: isStepComplete(step) ? wizardData.primaryColor : '#94A3B8',
                }}
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={async () => {
                  setIsSaving(true);
                  const fd = new FormData();
                  fd.append('storeName', wizardData.storeName || 'My Store');
                  fd.append('primaryColor', wizardData.primaryColor);
                  fd.append('socialLinks', JSON.stringify(wizardData.socialLinks));
                  const result = await saveWizardSettings(fd);
                  if (result.success) {
                    router.push('/');
                  } else {
                    alert('Failed to save: ' + (result.error || 'Unknown error'));
                    setIsSaving(false);
                  }
                }}
                disabled={isSaving}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all shadow-lg ${
                  isSaving ? 'opacity-60 cursor-wait' : ''
                }`}
                style={{ backgroundColor: wizardData.primaryColor }}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Finish Setup
                  </>
                )}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
