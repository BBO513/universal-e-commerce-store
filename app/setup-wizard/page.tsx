'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';
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
  Shield,
  Lock,
} from 'lucide-react';
import { saveWizardSettings } from './actions';

const STEPS = [
  { id: 1, label: 'Brand', icon: Store },
  { id: 2, label: 'Theme', icon: Palette },
  { id: 3, label: 'Connect', icon: Link2 },
  { id: 4, label: 'Payments', icon: CreditCard },
];

const WHEEL_COLORS = [
  { name: 'Crimson',   value: '#DC143C' },
  { name: 'Tangerine', value: '#FF6B35' },
  { name: 'Amber',     value: '#F5A623' },
  { name: 'Gold',      value: '#E5A100' },
  { name: 'Lime',      value: '#7CB342' },
  { name: 'Emerald',   value: '#2E7D32' },
  { name: 'Mint',      value: '#26A69A' },
  { name: 'Teal',      value: '#00897B' },
  { name: 'Cyan',      value: '#00ACC1' },
  { name: 'Sky',       value: '#42A5F5' },
  { name: 'Navy',      value: '#1565C0' },
  { name: 'Indigo',    value: '#3949AB' },
  { name: 'Violet',    value: '#7C3AED' },
  { name: 'Plum',      value: '#8E24AA' },
  { name: 'Magenta',   value: '#C2185B' },
  { name: 'Rose',      value: '#E91E63' },
  { name: 'Coral',     value: '#FF5252' },
  { name: 'Ruby',      value: '#B71C1C' },
  { name: 'Slate',     value: '#546E7A' },
  { name: 'Graphite',  value: '#37474F' },
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

  const handleFinish = async () => {
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
  };

  const TOTAL = 20;
  const SECTOR = 360 / TOTAL;
  const SENSITIVITY = 1.5;

  const dragX = useMotionValue(0);
  const [rotation, setRotation] = useState(0);

  const getFrontIndex = (deg: number) => {
    const n = ((deg % 360) + 360) % 360;
    return Math.round(n / SECTOR) % TOTAL;
  };

  useEffect(() => {
    if (step === 1) {
      const idx = WHEEL_COLORS.findIndex((c) => c.value === wizardData.primaryColor);
      if (idx >= 0) {
        const deg = idx * SECTOR;
        dragX.set(deg / SENSITIVITY);
        setRotation(deg);
      }
    }
  }, [step]);

  const handleDragEnd = (_: any, info: { offset: { x: number } }) => {
    const deg = info.offset.x * SENSITIVITY;
    const nearestDeg = Math.round(deg / SECTOR) * SECTOR;
    const snapX = nearestDeg / SENSITIVITY;

    animate(dragX, snapX, {
      type: 'spring',
      stiffness: 100,
      damping: 16,
      mass: 0.3,
      onUpdate: (latest) => setRotation(latest * SENSITIVITY),
    });

    const idx = getFrontIndex(nearestDeg);
    updateField('primaryColor', WHEEL_COLORS[idx].value);
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

  useEffect(() => {
    if (step !== 1) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        nextStep();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [step]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col items-center justify-center px-4 pt-12 pb-28">
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
                        enterKeyHint="done"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && wizardData.storeName.trim()) {
                            e.preventDefault();
                            nextStep();
                          }
                        }}
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
                          Pick a color
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                          Flick the wheel to find your vibe.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <div
                        className="relative w-full h-72 flex items-center justify-center cursor-grab active:cursor-grabbing"
                        style={{ perspective: '900px' }}
                      >
                        {/* Ambient glow behind wheel */}
                        <div
                          className="absolute w-32 h-32 rounded-full blur-[60px] opacity-50 transition-colors duration-500"
                          style={{ backgroundColor: wizardData.primaryColor }}
                        />
                        {/* Top/bottom alignment indicators */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-5 bg-white/80 dark:bg-white/60 rounded-full z-10 shadow-sm" />
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-5 bg-white/80 dark:bg-white/60 rounded-full z-10 shadow-sm" />

                        {/* Draggable wheel surface */}
                        <motion.div
                          drag="x"
                          dragMomentum
                          dragElastic={0}
                          dragTransition={{ power: 0.12, timeConstant: 350 }}
                          style={{ x: dragX }}
                          onDrag={(_, info) => setRotation(info.offset.x * SENSITIVITY)}
                          onDragEnd={handleDragEnd}
                          className="absolute inset-0 flex items-center justify-center touch-none select-none"
                          whileTap={{ cursor: 'grabbing' }}
                        >
                          <div
                            className="absolute inset-0 flex items-center justify-center"
                            style={{
                              transformStyle: 'preserve-3d',
                              transform: `rotateY(${rotation}deg) translate3d(0,0,0)`,
                              WebkitTransform: `rotateY(${rotation}deg) translate3d(0,0,0)`,
                            }}
                          >
                            {WHEEL_COLORS.map((color, i) => {
                              const baseAngle = SECTOR * i;
                              const chipAngle = (((baseAngle - rotation) % 360) + 360) % 360;
                              const absAngle = chipAngle > 180 ? 360 - chipAngle : chipAngle;
                              const depth = Math.cos((absAngle * Math.PI) / 180);
                              const scale = 0.35 + depth * 0.65;
                              const opacity = 0.08 + depth * 0.92;
                              const isFront = absAngle < SECTOR * 0.75;
                              const isBack = absAngle > 90;
                              const blurAmount = isBack ? (absAngle - 90) * 0.06 : 0;

                              return (
                                <div
                                  key={i}
                                  className="absolute"
                                  style={{
                                    transform: `rotateY(${baseAngle}deg) translateZ(190px) translate3d(0,0,0)`,
                                    WebkitTransform: `rotateY(${baseAngle}deg) translateZ(190px) translate3d(0,0,0)`,
                                  }}
                                >
                                  <div
                                    className="relative rounded-full"
                                    style={{
                                      width: `${36 + scale * 30}px`,
                                      height: `${36 + scale * 30}px`,
                                      opacity,
                                      filter: blurAmount > 0 ? `blur(${blurAmount.toFixed(1)}px)` : undefined,
                                      transform: `scale(${scale})`,
                                      transition: 'filter 0.1s ease',
                                    }}
                                  >
                                    {/* Color circle */}
                                    <div
                                      className="absolute inset-0 rounded-full"
                                      style={{ backgroundColor: color.value }}
                                    />
                                    {/* Glassmorphism sheen for front chip */}
                                    {isFront && (
                                      <>
                                        <div
                                          className="absolute inset-0 rounded-full"
                                          style={{
                                            background: `linear-gradient(135deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.1) 40%, transparent 60%, rgba(0,0,0,0.15) 100%)`,
                                          }}
                                        />
                                        <div
                                          className="absolute top-[12%] left-[20%] w-[30%] h-[20%] rounded-full"
                                          style={{
                                            background: 'radial-gradient(ellipse, rgba(255,255,255,0.6) 0%, transparent 70%)',
                                          }}
                                        />
                                      </>
                                    )}
                                    {/* Shadow ring for front chip */}
                                    <div
                                      className="absolute inset-0 rounded-full"
                                      style={{
                                        boxShadow: isFront
                                          ? `0 0 50px ${color.value}70, 0 0 100px ${color.value}20, 0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.5)`
                                          : absAngle < 45
                                          ? `0 0 20px ${color.value}30, 0 2px 8px rgba(0,0,0,0.2)`
                                          : '0 1px 4px rgba(0,0,0,0.1)',
                                      }}
                                    />
                                    {/* White border ring for front chip */}
                                    <div
                                      className="absolute inset-0 rounded-full"
                                      style={{
                                        border: isFront
                                          ? '2.5px solid rgba(255,255,255,0.9)'
                                          : '1px solid rgba(255,255,255,0.25)',
                                      }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      </div>

                      <motion.p
                        className="mt-4 text-sm font-bold tracking-widest uppercase"
                        animate={{ color: wizardData.primaryColor }}
                        transition={{ duration: 0.4 }}
                      >
                        {WHEEL_COLORS[getFrontIndex(rotation)]?.name}
                      </motion.p>
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
                                : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30'
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
                                whileTap={{ scale: 0.97 }}
                                onClick={() => handleConnect(platform.id)}
                                disabled={isLoading}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                                  isLoading
                                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-500 cursor-wait'
                                    : 'text-white'
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

                {/* Step 3: Stripe Connect */}
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
                          Set up payments
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                          Accept credit cards and digital wallets in seconds.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-center py-4">
                      {!wizardData.stripeConnected ? (
                        <>
                          <p className="text-zinc-400 dark:text-zinc-500 text-sm font-medium mb-6 text-center">
                            Connect your Stripe account to start getting paid.
                          </p>
                          {connecting === 'stripe' ? (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="flex flex-col items-center gap-4"
                            >
                              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#635BFF] via-[#7B6FFF] to-[#9180FF] flex items-center justify-center shadow-lg shadow-[#635BFF]/30">
                                <Loader2 className="w-8 h-8 text-white animate-spin" />
                              </div>
                              <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">
                                Connecting to Stripe...
                              </p>
                            </motion.div>
                          ) : (
                            <motion.button
                              whileTap={{ scale: 0.97 }}
                              onClick={() => {
                                setConnecting('stripe');
                                setTimeout(() => {
                                  setConnecting(null);
                                  updateField('stripeConnected', true);
                                }, 2000);
                              }}
                              className="w-full max-w-sm bg-gradient-to-r from-[#635BFF] via-[#7B6FFF] to-[#9180FF] text-white font-semibold text-base py-4 px-6 rounded-2xl shadow-lg shadow-[#635BFF]/25 transition-shadow flex items-center justify-center gap-3"
                            >
                              <svg
                                className="w-6 h-6"
                                viewBox="0 0 24 25"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M13.5 3.5L3 14H10.5V22L21 11.5H13.5V3.5Z"
                                  fill="currentColor"
                                />
                              </svg>
                              Connect with Stripe
                            </motion.button>
                          )}
                        </>
                      ) : (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                          className="flex flex-col items-center gap-3"
                        >
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                            <Check className="w-10 h-10 text-white" />
                          </div>
                          <p className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">
                            Stripe Connected
                          </p>
                          <p className="text-zinc-400 dark:text-zinc-500 text-sm">
                            You're ready to accept payments from day one.
                          </p>
                        </motion.div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800">
                        <Shield className="w-4 h-4 text-zinc-500 dark:text-zinc-400 flex-shrink-0" />
                        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400 leading-tight">
                          Bank-level security
                        </span>
                      </div>
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800">
                        <Lock className="w-4 h-4 text-zinc-500 dark:text-zinc-400 flex-shrink-0" />
                        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400 leading-tight">
                          256-bit encryption
                        </span>
                      </div>
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800">
                        <Check className="w-4 h-4 text-zinc-500 dark:text-zinc-400 flex-shrink-0" />
                        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400 leading-tight">
                          PCI-DSS compliant
                        </span>
                      </div>
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800">
                        <CreditCard className="w-4 h-4 text-zinc-500 dark:text-zinc-400 flex-shrink-0" />
                        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400 leading-tight">
                          All major cards
                        </span>
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
        </div>
      </div>

      {/* Navigation - Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 px-4 py-4 w-full max-w-2xl mx-auto">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={prevStep}
            disabled={step === 0}
            className={`flex items-center justify-center w-12 h-12 rounded-2xl flex-shrink-0 transition-opacity ${
              step === 0
                ? 'opacity-0 pointer-events-none'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>

          {step < STEPS.length - 1 ? (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={nextStep}
              disabled={!isStepComplete(step)}
              className="flex-1 h-14 rounded-2xl text-lg font-bold text-white flex items-center justify-center gap-2 disabled:opacity-40"
              style={{
                backgroundColor: isStepComplete(step) ? wizardData.primaryColor : '#94A3B8',
              }}
            >
              Continue
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleFinish}
              disabled={isSaving}
              className="flex-1 h-14 rounded-2xl text-lg font-bold text-white flex items-center justify-center gap-2 disabled:opacity-60"
              style={{ backgroundColor: wizardData.primaryColor }}
            >
              {isSaving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Finish Setup
                </>
              )}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
