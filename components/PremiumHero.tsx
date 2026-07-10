'use client';

interface PremiumHeroProps {
  storeName: string;
  primaryColor?: string;
}

export default function PremiumHero({ storeName, primaryColor = '#0F4B5F' }: PremiumHeroProps) {
  const accentRgb = hexToRgb(primaryColor);

  return (
    <section className="relative flex items-center justify-center min-h-[70vh] overflow-hidden bg-zinc-950">
      <div className="absolute inset-0 mesh-gradient" />

      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, rgba(${accentRgb}, 0.08) 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <p
          className="text-xs sm:text-sm uppercase tracking-[0.40em] mb-6 font-medium"
          style={{ color: primaryColor }}
        >
          Store
        </p>
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-white leading-[0.95]">
          {storeName}
        </h1>
        <p className="mt-8 text-base sm:text-lg text-zinc-500 max-w-xl mx-auto leading-relaxed tracking-wide">
          Discover unique products from our community.
        </p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-zinc-950 to-transparent pointer-events-none" />

      <style jsx>{`
        .mesh-gradient {
          background:
            radial-gradient(at 20% 30%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
            radial-gradient(at 80% 20%, rgba(168, 85, 247, 0.12) 0%, transparent 50%),
            radial-gradient(at 40% 70%, rgba(236, 72, 153, 0.10) 0%, transparent 50%),
            radial-gradient(at 70% 80%, rgba(34, 211, 238, 0.10) 0%, transparent 50%),
            radial-gradient(at 10% 50%, rgba(250, 204, 21, 0.06) 0%, transparent 50%);
          animation: meshShift 20s ease-in-out infinite alternate;
        }

        @keyframes meshShift {
          0% {
            background-position: 0% 0%, 100% 0%, 0% 100%, 100% 100%, 50% 50%;
          }
          100% {
            background-position: 5% 5%, 95% -5%, -5% 95%, 105% 105%, 50% 50%;
          }
        }
      `}</style>
    </section>
  );
}

function hexToRgb(hex: string): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}
