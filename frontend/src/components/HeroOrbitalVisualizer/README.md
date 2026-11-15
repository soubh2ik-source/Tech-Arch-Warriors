# Hero Orbital Feature Visualizer

This folder encapsulates all files, styles, and types related to the **Hero Orbital Feature Visualizer** (interactive orbital diagram showcasing pulmonary lungs and satellite feature cards).

## Files in this Directory
- **`HeroOrbitalVisualizer.tsx`**: Main React component containing static central anatomical SVG lungs, radial ambient glows, rotating orbital track, 5 equidistant satellite badges, and decorative callout annotations.
- **`HeroOrbitalVisualizer.css`**: Complete dedicated stylesheet for orbital rotation, breath pulse, counter-rotation of cards, atmospheric rings, and responsive placement.
- **`types.ts`**: TypeScript definitions for the orbital slots, badges, and props.
- **`index.ts`**: Barrel export exposing `HeroOrbitalVisualizer` and alias `OrbitingLungsShowcase`.

## Satellites / Badges
1. **CT Scan Analysis** (Top slot)
2. **Risk Prediction** (Top-Right slot)
3. **Clinical Insights** (Bottom-Right slot)
4. **Tri-Ensemble AI Models** (Bottom-Left slot)
5. **Nodule Detection** (Top-Left slot)

## Usage
```tsx
import { HeroOrbitalVisualizer } from "@/components/HeroOrbitalVisualizer";

export function Hero() {
  return (
    <div className="hero-side-art">
      <HeroOrbitalVisualizer />
    </div>
  );
}
```
