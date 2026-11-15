export type OrbitalSlot = 
  | "top" 
  | "top-right" 
  | "bottom-right" 
  | "bottom-left" 
  | "top-left";

export interface OrbitalFeatureBadge {
  id: string;
  title: string;
  subtitle: string;
  slot: OrbitalSlot;
  iconType: "scanner" | "risk" | "clinical" | "ensemble" | "nodule";
}

export interface HeroOrbitalVisualizerProps {
  className?: string;
  isPaused?: boolean;
}
