'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

const DEFAULT_COLORS = [
  '#FF1744', '#F50057', '#D500F9', '#651FFF',
  '#2979F3', '#1976D2', '#0097A7', '#00796B',
  '#388E3C', '#7CB342', '#FBC02D', '#FFA000',
  '#FF6F00', '#E65100', '#D84315', '#BF360C',
  '#E91E63', '#9C27B0', '#673AB7', '#3F51B5',
  '#00BCD4', '#009688', '#4CAF50', '#CDDC39',
];

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const c = hex.replace('#', '');
  return {
    r: parseInt(c.substring(0, 2), 16),
    g: parseInt(c.substring(2, 4), 16),
    b: parseInt(c.substring(4, 6), 16),
  };
}

interface ColorCylinderCarouselProps {
  colors?: { name: string; value: string }[];
  defaultValue?: string;
  onColorSelect?: (color: string, index: number) => void;
}

const CYLINDER_RADIUS = 240;
const SWATCH_WIDTH = 72;
const SWATCH_HEIGHT = 100;
const HALF_SWATCH_W = SWATCH_WIDTH / 2;
const HALF_SWATCH_H = SWATCH_HEIGHT / 2;
const DRAG_SENSITIVITY = 0.45;

export const ColorCylinderCarousel: React.FC<ColorCylinderCarouselProps> = ({
  colors,
  defaultValue,
  onColorSelect,
}) => {
  const resolvedColors = useMemo(() => {
    if (colors && colors.length > 0) return colors;
    return DEFAULT_COLORS.map((value, i) => ({ name: value, value }));
  }, [colors]);

  const totalColors = resolvedColors.length;
  const anglePerColor = 360 / totalColors;

  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const initialized = useRef(false);

  const dragX = useMotionValue(0);
  const rotateY = useTransform(dragX, (value) => (value * DRAG_SENSITIVITY) % 360);

  const defaultValueIndex = useMemo(() => {
    if (!defaultValue) return -1;
    return resolvedColors.findIndex((c) => c.value === defaultValue);
  }, [defaultValue, resolvedColors]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const idx = defaultValueIndex >= 0 ? defaultValueIndex : 0;
    setSelectedIndex(idx);
    if (idx !== 0) {
      const offsetPx = (idx * anglePerColor) / DRAG_SENSITIVITY;
      dragX.set(offsetPx);
    }
  }, []);

  const handleDragEnd = (_event: any, info: any) => {
    const currentRotation = (info.offset.x * DRAG_SENSITIVITY) % 360;
    const normalized = currentRotation < 0 ? currentRotation + 360 : currentRotation;
    const nearestIncrement = Math.round(normalized / anglePerColor) * anglePerColor;
    const nearestIndex =
      ((Math.round(normalized / anglePerColor) % totalColors) + totalColors) % totalColors;
    const pixelsNeeded = (nearestIncrement - normalized) / DRAG_SENSITIVITY;
    dragX.set(dragX.get() + pixelsNeeded);
    setSelectedIndex(nearestIndex);
    if (onColorSelect) {
      onColorSelect(resolvedColors[nearestIndex].value, nearestIndex);
    }
  };

  const selectedColor = resolvedColors[selectedIndex].value;

  return (
    <div className="w-full flex flex-col items-center select-none">
      <div
        className="relative w-full max-w-[440px] aspect-[4/3] rounded-[2rem] overflow-hidden"
        style={{
          background:
            'linear-gradient(145deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.85) 50%, rgba(15,23,42,0.95) 100%)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow:
            '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05) inset, 0 1px 0 rgba(255,255,255,0.08) inset',
        }}
      >
        <div
          ref={containerRef}
          className="absolute inset-0"
          style={{ perspective: '1000px' }}
        >
          {/* Ambient radial glow behind cylinder */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              width: '320px',
              height: '320px',
              background: `radial-gradient(circle, ${selectedColor}18 0%, transparent 70%)`,
              borderRadius: '50%',
              filter: 'blur(40px)',
              transition: 'background 0.5s ease',
            }}
          />

          {/* Neon notch — front-center indicator */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex flex-col items-center gap-1">
            <div
              style={{
                width: '3px',
                height: '18px',
                borderRadius: '2px',
                background: `linear-gradient(to bottom, ${selectedColor}, ${selectedColor}88)`,
                boxShadow: `0 0 14px ${selectedColor}cc, 0 0 28px ${selectedColor}66, inset 0 0 4px rgba(255,255,255,0.4)`,
                transition: 'background 0.5s ease, box-shadow 0.5s ease',
              }}
            />
            <div
              style={{
                width: '48px',
                height: '48px',
                background: `radial-gradient(circle, ${selectedColor}40 0%, transparent 70%)`,
                borderRadius: '50%',
                filter: 'blur(12px)',
                marginTop: '-36px',
                transition: 'background 0.5s ease',
              }}
            />
          </div>

          {/* 3D Cylinder */}
          <motion.div
            drag="x"
            dragElastic={0.15}
            dragMomentum
            onDragEnd={handleDragEnd}
            dragTransition={{ power: 0.25, timeConstant: 200, restDelta: 10 }}
            style={{
              x: dragX,
              rotateY,
              transformStyle: 'preserve-3d',
              transformOrigin: 'center center 0px',
              position: 'absolute',
              inset: 0,
              cursor: 'grab',
            }}
            className="active:cursor-grabbing"
          >
            {resolvedColors.map((color, index) => {
              const angle = index * anglePerColor;
              const isSelected = index === selectedIndex;
              const rgb = hexToRgb(color.value);

              return (
                <div
                  key={`cc-${index}`}
                  className="absolute"
                  style={{
                    left: '50%',
                    top: '50%',
                    marginLeft: -HALF_SWATCH_W,
                    marginTop: -HALF_SWATCH_H - 8,
                    width: SWATCH_WIDTH,
                    height: SWATCH_HEIGHT,
                    transform: `rotateY(${angle}deg) translateZ(${CYLINDER_RADIUS}px)`,
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                  }}
                >
                  <motion.div
                    className="w-full h-full rounded-2xl cursor-pointer relative overflow-hidden"
                    style={{ background: color.value }}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => {
                      const targetPx = (index * anglePerColor) / DRAG_SENSITIVITY;
                      animate(dragX, targetPx, {
                        type: 'spring',
                        stiffness: 120,
                        damping: 18,
                      });
                      setSelectedIndex(index);
                      if (onColorSelect) {
                        onColorSelect(color.value, index);
                      }
                    }}
                  >
                    {/* Glass-like top shine */}
                    <div
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(255,255,255,0.28) 0%, transparent 45%, transparent 100%)',
                      }}
                    />

                    {/* Deep realistic shadow — layered for physical 3D depth */}
                    <div
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      style={{
                        boxShadow: isSelected
                          ? [
                              `0 0 40px ${color.value}cc`,
                              `0 0 80px ${color.value}55`,
                              `0 18px 32px -8px rgba(${rgb.r},${rgb.g},${rgb.b},0.6)`,
                              `0 4px 8px rgba(0,0,0,0.4)`,
                              `inset 0 0 18px rgba(255,255,255,0.35)`,
                              `inset 0 -2px 6px rgba(0,0,0,0.3)`,
                              `inset 0 1px 2px rgba(255,255,255,0.25)`,
                            ].join(', ')
                          : [
                              `0 16px 28px -6px rgba(${rgb.r},${rgb.g},${rgb.b},0.45)`,
                              `0 3px 6px rgba(0,0,0,0.3)`,
                              `inset 0 0 12px rgba(255,255,255,0.18)`,
                              `inset 0 -2px 4px rgba(0,0,0,0.25)`,
                              `inset 0 1px 1px rgba(255,255,255,0.2)`,
                            ].join(', '),
                        transition: 'box-shadow 0.4s ease',
                      }}
                    />

                    {/* Selection ring — white border pulse */}
                    {isSelected && (
                      <div
                        className="absolute inset-[3px] rounded-2xl pointer-events-none animate-pulse"
                        style={{
                          border: '2px solid rgba(255,255,255,0.85)',
                          borderRadius: '14px',
                          boxShadow: `inset 0 0 12px rgba(255,255,255,0.3), 0 0 18px ${color.value}`,
                        }}
                      />
                    )}

                    {/* Edge darkening for 3D cylinder curvature feel */}
                    <div
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      style={{
                        background:
                          'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.15) 100%)',
                      }}
                    />

                    {/* Hex label */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span
                        className="text-white font-bold text-[11px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] tracking-wider"
                      >
                        {color.value.toUpperCase()}
                      </span>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </motion.div>

          {/* Center focus ring */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 30 }}>
            <div
              className="rounded-full"
              style={{
                width: '100px',
                height: '100px',
                border: '1px solid rgba(255,255,255,0.06)',
                background: `radial-gradient(circle, ${selectedColor}10 0%, transparent 70%)`,
                boxShadow: `inset 0 0 30px ${selectedColor}15`,
                transition: 'background 0.5s ease, box-shadow 0.5s ease',
              }}
            />
          </div>
        </div>
      </div>

      {/* Selected color label */}
      <div className="mt-4 text-center space-y-1">
        <p
          className="text-sm font-bold tracking-[0.25em] uppercase transition-colors duration-500"
          style={{ color: selectedColor }}
        >
          {resolvedColors[selectedIndex]?.name ?? selectedColor}
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">
          {selectedColor.toUpperCase()}
        </p>
      </div>
    </div>
  );
};

export default ColorCylinderCarousel;
