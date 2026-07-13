# 3D Color Cylinder Carousel - Quick Start

## Installation (< 2 minutes)

### 1. Install Framer Motion
```bash
npm install framer-motion@latest
```

### 2. Component Files Already in Place
- ✅ `/components/ColorCylinderCarousel.tsx` - Main component
- ✅ `/app/color-carousel-demo/page.tsx` - Demo page

### 3. View the Demo
```bash
npm run dev
```
Then visit: `http://localhost:3000/color-carousel-demo`

## Basic Usage

```tsx
import { ColorCylinderCarousel } from '@/components/ColorCylinderCarousel';

export default function YourPage() {
  return <ColorCylinderCarousel />;
}
```

## With Selection Callback

```tsx
import { ColorCylinderCarousel } from '@/components/ColorCylinderCarousel';

export default function ProductPage() {
  const handleColorSelect = (color: string, index: number) => {
    console.log(`User selected: ${color}`);
    // Update your product color here
  };

  return (
    <ColorCylinderCarousel onColorSelect={handleColorSelect} />
  );
}
```

## Key Features ✨

| Feature | How It Works |
|---------|-------------|
| **60fps Performance** | Framer Motion's `useMotionValue` bypasses React renders |
| **Perfect 3D Cylinder** | 24 colors using `rotateY(index*15°) translateZ(350px)` |
| **Smooth Dragging** | GPU-accelerated transforms, no jank |
| **Auto-Snap** | Snaps to nearest color with spring physics |
| **Visual Indicator** | Glowing notch shows selected color |
| **Momentum Physics** | Flick-to-spin with natural decay |

## Customization

### Change Colors
Edit the `COLORS` array in `ColorCylinderCarousel.tsx`:
```tsx
const COLORS = [
  '#YOUR_COLOR_1',
  '#YOUR_COLOR_2',
  // Add as many as needed
];
```

### Adjust Physics
```tsx
// More sensitive to drag
const DRAG_SENSITIVITY = 1.0;  // was 0.5

// Faster snap-back
dragTransition={{
  power: 0.3,
  timeConstant: 100,  // was 200
  restDelta: 10,
}}
```

### Change Cylinder Radius
```tsx
const CYLINDER_RADIUS = 450;  // was 350 (larger = more spread out)
```

### Hide Info Panel
Remove the info panel div at the bottom of the component JSX

### Custom Indicator Color
Change the `#00FF88` hex value to your brand color in the indicator div styling

## Performance Notes

- ✅ Uses CSS 3D transforms (hardware accelerated)
- ✅ No re-renders during drag via `useMotionValue`
- ✅ Optimized for 60fps on modern devices
- ✅ Tested on Chrome, Firefox, Safari, Edge

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Jittery animation | Ensure Framer Motion is latest version (`npm install framer-motion@latest`) |
| Colors not snapping | Check `ANGLE_PER_COLOR` calculation is 360/length |
| Indicator not visible | Verify z-index: 50 on indicator div |
| Slow on mobile | Reduce `TOTAL_COLORS` or increase `dragElastic` |

## Architecture

```
ColorCylinderCarousel.tsx
├── Parent Container (perspective: 1200px)
│   ├── Visual Indicator (notch)
│   └── Inner Carousel Div (transform-style: preserve-3d)
│       └── 24 Color Swatches
│           ├── 3D Position: rotateY + translateZ
│           ├── Drag Listeners
│           └── Selection State
└── Info Panel
```

## GPU Acceleration Explained

```jsx
// ❌ SLOW: React re-renders on every mouse move
const [rotation, setRotation] = useState(0);
onMouseMove={(e) => setRotation(e.clientX)}

// ✅ FAST: Framer Motion talks directly to GPU
const dragX = useMotionValue(0);
const rotateY = useTransform(dragX, (value) => value * 0.5);
```

## Deploy to Production

No special configuration needed! The component works on:
- Vercel
- Netlify
- Any Next.js 14 hosting

## Questions?

See the full guide: `/docs/COLOR_CAROUSEL_GUIDE.md`
