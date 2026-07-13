# 3D Color Cylinder Carousel - Premium Integration Guide

## Overview
This is a production-ready, GPU-accelerated 3D Color Cylinder Carousel component built with React, Framer Motion, and Tailwind CSS. It delivers 60fps performance with advanced physics for dragging, momentum, and snap-to-grid behavior.

## ✨ Key Features

- **GPU-Accelerated Physics**: Uses Framer Motion's `useMotionValue` and `useTransform` for direct GPU rendering, bypassing React's virtual DOM
- **Perfect 3D Cylinder Math**: 24 colors positioned with precise `rotateY` and `translateZ` transforms
- **Drag & Momentum**: Natural flick-to-spin behavior with customizable decay
- **Smart Snap-to-Center**: Automatically snaps to the nearest 15-degree increment using spring physics
- **Visual Indicators**: Glowing notch indicator + selection ring for perfect UX
- **Premium Styling**: Gradient backgrounds, light effects, and smooth animations

## 🚀 Installation

### 1. Install Framer Motion (if not already installed)
```bash
npm install framer-motion
# or
yarn add framer-motion
# or
pnpm add framer-motion
```

### 2. Verify Dependencies
Ensure your `package.json` includes:
```json
{
  "dependencies": {
    "react": "^18.0.0",
    "framer-motion": "^10.16.0 or higher",
    "next": "^14.0.0"
  }
}
```

## 📁 File Structure
```
components/
  └── ColorCylinderCarousel.tsx    (Main component)

app/
  └── color-carousel-demo/
      └── page.tsx                 (Demo page)
```

## 🎯 Usage

### Basic Implementation
```tsx
import { ColorCylinderCarousel } from '@/components/ColorCylinderCarousel';

export default function MyPage() {
  return <ColorCylinderCarousel />;
}
```

### With Color Selection Callback
```tsx
import { ColorCylinderCarousel } from '@/components/ColorCylinderCarousel';
import { useState } from 'react';

export default function MyPage() {
  const [selectedColor, setSelectedColor] = useState<string>('#FF1744');

  const handleColorSelect = (color: string, index: number) => {
    setSelectedColor(color);
    console.log(`Selected: ${color} at index ${index}`);
    
    // Use selected color here
    // e.g., update product preview, send to API, etc.
  };

  return (
    <div>
      <ColorCylinderCarousel onColorSelect={handleColorSelect} />
      <div 
        style={{ background: selectedColor }} 
        className="w-64 h-64 rounded-lg"
      />
    </div>
  );
}
```

## ⚙️ Configuration

### Adjustable Parameters (in component)

```tsx
// Sensitivity of drag input (higher = faster rotation)
const DRAG_SENSITIVITY = 0.5;  // Range: 0.1-1.0

// Cylinder radius (larger = more spacing between colors)
const CYLINDER_RADIUS = 350;   // Range: 250-500px

// Spring animation stiffness/damping (for snap behavior)
// Modify the Framer Motion dragTransition property:
dragTransition={{
  power: 0.3,           // Momentum power (0-1)
  timeConstant: 200,    // Decay time in ms (100-400)
  restDelta: 10,        // When to stop animation (pixels)
}}
```

### Customizing Colors
Replace the `COLORS` array in the component:
```tsx
const COLORS = [
  '#FF1744', '#F50057', // ... your colors here
];
```

## 🔧 Advanced Customization

### Add Custom Styling
Modify the component's className strings for your brand:
- Change `from-slate-900 via-slate-800 to-slate-900` background
- Adjust indicator color from `#00FF88` to your brand color
- Modify shadow/glow effects

### Disable Auto-Snap
For manual selection only:
```tsx
// Comment out the snap logic in handleDragEnd
// and rely only on onClick selections
```

### Change Number of Colors
Update `COLORS` array length and the component will automatically calculate correct angles:
```tsx
const COLORS = [/* your colors */]; // Can be any number
const TOTAL_COLORS = COLORS.length;
const ANGLE_PER_COLOR = 360 / TOTAL_COLORS;
```

## 📊 Performance Optimization

### ✅ Why This Achieves 60fps

1. **useMotionValue**: Tracks drag input at 60fps without re-rendering React
2. **useTransform**: Maps drag value to rotation without expensive calculations
3. **GPU Acceleration**: CSS 3D transforms are hardware-accelerated
4. **Memoization**: Color swatches don't re-render on drag
5. **will-change**: CSS property hints browser to optimize animations

### Performance Monitoring
```tsx
// Chrome DevTools: Performance > Record > Drag cylinder
// Look for:
// - Green FPS indicator (60fps)
// - Smooth transform timeline
// - No style recalculations during drag
```

## 🎨 Theming

### Dark Mode (Default)
The component uses a dark gradient background. For custom backgrounds, wrap it:
```tsx
<div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
  <ColorCylinderCarousel />
</div>
```

### Light Mode
Create a variant by modifying colors:
```tsx
// Change: from-slate-900 → from-slate-100
// Change: #00FF88 indicator → #FF1744
```

## 🐛 Troubleshooting

### Issue: Carousel jumps on drag start
**Solution**: Ensure `dragElastic` is set to 0.2 for smooth initiation

### Issue: Colors blur when rotating
**Solution**: Add `backfaceVisibility: 'hidden'` (already included)

### Issue: Snapping feels slow/fast
**Solution**: Adjust `dragTransition.timeConstant` (lower = faster):
```tsx
dragTransition={{
  power: 0.3,
  timeConstant: 100,  // Faster (was 200)
  restDelta: 10,
}}
```

### Issue: Indicator not visible
**Solution**: Ensure z-index values don't conflict. Check parent container's `perspective` property.

### Issue: Performance drops on low-end devices
**Solution**: Reduce number of colors or increase `dragElastic`:
```tsx
// Reduce colors
const COLORS = COLORS.slice(0, 12); // 12 instead of 24

// Or increase elastic for less frequent updates
dragElastic={0.5}  // was 0.2
```

## 🔗 Integration Examples

### Color Picker for E-Commerce
```tsx
const [selectedColor, setSelectedColor] = useState('');

<ColorCylinderCarousel 
  onColorSelect={(color) => {
    setSelectedColor(color);
    updateProductVariant(color);
  }}
/>
```

### Design System Color Tool
```tsx
<div className="grid grid-cols-2 gap-4">
  <div>
    <ColorCylinderCarousel onColorSelect={setCurrentColor} />
  </div>
  <div className="flex flex-col gap-4">
    <div 
      className="h-64 rounded-lg shadow-lg"
      style={{ background: currentColor }}
    />
    <button onClick={() => copyToClipboard(currentColor)}>
      Copy {currentColor}
    </button>
  </div>
</div>
```

### Theme Customizer
```tsx
const [primaryColor, setPrimaryColor] = useState('#FF1744');

<div className="space-y-4">
  <label>Primary Color</label>
  <ColorCylinderCarousel onColorSelect={(color) => setPrimaryColor(color)} />
  
  <div className="mt-4 p-4 rounded-lg" style={{ background: primaryColor }}>
    Preview with {primaryColor}
  </div>
</div>
```

## 📱 Responsive Behavior

The component maintains its size and positioning. For responsive sizes:
```tsx
<div className="w-full h-full md:w-96 md:h-96">
  <ColorCylinderCarousel />
</div>
```

## 📈 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ❌ IE 11 (uses CSS 3D transforms)

## 🎓 Technical Deep Dive

### 3D Math Explained
Each color swatch uses:
```css
transform: rotateY(index * 15deg) translateZ(350px);
```
This positions items on a cylinder surface where:
- `rotateY`: Angle around vertical axis (360° / 24 colors = 15° each)
- `translateZ`: Distance from center (radius of cylinder)

### Motion Value Flow
```
User Drag Input
    ↓
dragX (MotionValue)
    ↓
useTransform(dragX → rotateY)
    ↓
GPU Renders Transform
    ↓
60fps Smooth Animation
```

### Snap-to-Grid Algorithm
1. Calculate current rotation: `currentRotation = dragX * DRAG_SENSITIVITY`
2. Find nearest 15° increment: `Math.round(rotation / 15) * 15`
3. Calculate pixel offset needed to reach it
4. Animate using Framer Motion spring physics

## 🎉 You're All Set!

The carousel is production-ready. Simply integrate it into your application and enjoy GPU-accelerated 3D color selection!

For issues or enhancements, refer to:
- Framer Motion Docs: https://www.framer.com/motion/
- CSS 3D Transforms: https://developer.mozilla.org/en-US/docs/Web/CSS/transform
