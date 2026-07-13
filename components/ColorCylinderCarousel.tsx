'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const DEFAULT_COLORS = [
  '#FF1744',
  '#F50057',
  '#D500F9',
  '#651FFF',
  '#2979F3',
  '#1976D2',
  '#0097A7',
  '#00796B',
  '#388E3C',
  '#7CB342',
  '#FBC02D',
  '#FFA000',
  '#FF6F00',
  '#E65100',
  '#D84315',
  '#BF360C',
  '#E91E63',
  '#9C27B0',
  '#673AB7',
  '#3F51B5',
  '#00BCD4',
  '#009688',
  '#4CAF50',
  '#CDDC39',
];

interface ColorCylinderCarouselProps {
  colors?: { name: string; value: string }[];
  defaultValue?: string;
  onColorSelect?: (color: string, index: number) => void;
}

export const ColorCylinderCarousel: React.FC<ColorCylinderCarouselProps> = ({
  colors,
  defaultValue,
  onColorSelect,
}) => {
  const resolvedColors = useMemo(() => {
    if (colors && colors.length > 0) {
      return colors;
    }

    return DEFAULT_COLORS.map((value) => ({ name: value, value }));
  }, [colors]);

      const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeIndexRef = useRef(0);
  const onColorSelectRef = useRef(onColorSelect);
  onColorSelectRef.current = onColorSelect;
  const [activeIndex, setActiveIndex] = useState(0);

  const defaultValueIndex = useMemo(() => {
    if (!defaultValue) {
      return 0;
    }

    return resolvedColors.findIndex((color) => color.value === defaultValue);
  }, [defaultValue, resolvedColors]);

    const updateActiveIndex = useCallback(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const viewportCenter = container.scrollLeft + container.clientWidth / 2;
    let nearestIndex = activeIndexRef.current;
    let nearestDistance = Number.POSITIVE_INFINITY;

    itemRefs.current.forEach((item, index) => {
      if (!item) {
        return;
      }

      const itemCenter = item.offsetLeft + item.offsetWidth / 2;
      const distance = Math.abs(itemCenter - viewportCenter);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    if (nearestIndex !== activeIndexRef.current) {
      activeIndexRef.current = nearestIndex;
      setActiveIndex(nearestIndex);
      // Fire the callback immediately on scroll interaction, never on mount
      const color = resolvedColors[nearestIndex];
      if (color) {
        onColorSelectRef.current?.(color.value, nearestIndex);
      }
    }
  }, [resolvedColors]);

    useEffect(() => {
    const initialIndex = defaultValueIndex >= 0 ? defaultValueIndex : 0;
    activeIndexRef.current = initialIndex;
    setActiveIndex(initialIndex);

    const frame = window.requestAnimationFrame(() => {
      const target = itemRefs.current[initialIndex];
      target?.scrollIntoView({ behavior: 'auto', inline: 'center', block: 'nearest' });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [defaultValueIndex]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const handleScroll = () => {
      window.requestAnimationFrame(updateActiveIndex);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => container.removeEventListener('scroll', handleScroll);
  }, [updateActiveIndex]);

    // No separate effect needed — onColorSelect is fired from updateActiveIndex
  // which only runs on scroll events, never on mount.


  const handleSelect = (index: number) => {
    const target = itemRefs.current[index];
    target?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  };

  const selectedColor = resolvedColors[activeIndex]?.value ?? '#0F4B5F';

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="relative w-full overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/80 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${selectedColor}22 0%, transparent 70%)`,
            filter: 'blur(20px)',
            transition: 'background 300ms ease',
          }}
        />

        <div
          ref={containerRef}
          data-testid="color-carousel-track"
          className="relative z-10 flex gap-4 overflow-x-auto px-2 py-6 scrollbar-none"
          style={{
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            perspective: '1000px',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {resolvedColors.map((color, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={`${color.value}-${index}`}
                ref={(element) => {
                  itemRefs.current[index] = element;
                }}
                type="button"
                data-testid={`color-option-${index}`}
                aria-label={`Select ${color.value}`}
                onClick={() => handleSelect(index)}
                className="group relative flex h-[220px] w-[140px] flex-shrink-0 items-end justify-center overflow-hidden rounded-[1.7rem] border border-white/15 bg-slate-900/80 p-3 text-left shadow-[0_20px_45px_rgba(0,0,0,0.3)] transition-all duration-300 ease-out"
                style={{
                  scrollSnapAlign: 'center',
                  scrollSnapStop: 'always',
                  transform: isActive
                    ? 'scale(1.2) translateZ(50px)'
                    : 'scale(0.8) translateZ(-100px) rotateY(35deg)',
                  opacity: isActive ? 1 : 0.4,
                  filter: isActive ? 'none' : 'blur(2px)',
                  borderColor: isActive ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.2)',
                  boxShadow: isActive
                    ? `0 0 0 3px rgba(255,255,255,0.9), 0 0 40px ${color.value}88, 0 18px 45px rgba(0,0,0,0.35)`
                    : '0 10px 25px rgba(0,0,0,0.28)',
                  transformStyle: 'preserve-3d',
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background: color.value,
                    transition: 'transform 300ms ease, box-shadow 300ms ease',
                  }}
                />

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.35),transparent_50%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),transparent_45%,rgba(0,0,0,0.28))]" />
                <div className="absolute inset-x-3 bottom-3 rounded-full border border-white/20 bg-slate-950/60 px-3 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.25em] text-white backdrop-blur">
                  {color.value.toUpperCase()}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-300" style={{ color: selectedColor }}>
          {resolvedColors[activeIndex]?.name ?? selectedColor}
        </p>
        <p className="mt-1 text-xs font-mono uppercase tracking-[0.2em] text-slate-500">
          {selectedColor.toUpperCase()}
        </p>
      </div>
    </div>
  );
};

export default ColorCylinderCarousel;
