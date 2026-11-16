"use client";

import React from "react";
import { HeroOrbitalVisualizer } from "./HeroOrbitalVisualizer";
import DarkVeil from "./DarkVeil/DarkVeil";

interface HeroSectionProps {
  onGetStarted?: () => void;
  onLearnMore?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onGetStarted,
  onLearnMore,
}) => {
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="hero-editorial-section" id="overview">
      {/* DarkVeil WebGL background — absolute fill behind all content */}
      <div className="hero-darkveil-bg" aria-hidden="true">
        <DarkVeil
          color="#02ffe0"
          speed={0.45}
          scale={1.75}
          flow={1.8}
          warp={1.3}
          variation={10}
          sheen={1.2}
          glow={1.15}
          brightness={1.45}
          grain={0.05}
          fade={0.03}
          opacity={0.9}
          mouseInteraction={false}
        />
      </div>

      <div className="hero-editorial-container">
        {/* Left Column: Headline, Pill, Subtitle, Actions, Metrics */}
        <div className="hero-editorial-left">
          {/* Eyebrow Pill Badge */}
          <div className="hero-category-badge">
            <span className="hero-category-dot" />
            <span className="hero-category-text">PULMONARY AI / CT CLASSIFICATION</span>
          </div>

          {/* Main Serif Headline */}
          <h1 className="hero-editorial-title">
            A clearer view<br />
            of every scan<span className="hero-title-dot">.</span>
          </h1>

          {/* Editorial Subtitle */}
          <p className="hero-editorial-desc">
            AI-assisted analysis of chest CT images,<br />
            classifying pulmonary scans across four diagnostic categories.
          </p>

          {/* Actions: Primary Pill + Underline Link */}
          <div className="hero-editorial-actions">
            <a 
              href="#analysis" 
              onClick={(e) => handleScrollTo(e, "analysis")}
              className="btn-hero-explore"
            >
              <span>Explore the platform</span>
              <span className="btn-hero-arrow">&rarr;</span>
            </a>

            <a 
              href="#benchmarks" 
              onClick={(e) => handleScrollTo(e, "benchmarks")}
              className="link-hero-performance"
            >
              View model performance
            </a>
          </div>

          {/* Horizontal Metric Rule */}
          <div className="hero-metrics-rule" />

          {/* 3 Metrics Columns */}
          <div className="hero-metrics-grid">
            <div className="hero-metric-cell">
              <div className="hero-metric-number">96.4%</div>
              <div className="hero-metric-caption">Test accuracy</div>
            </div>

            <div className="hero-metric-cell divider-left">
              <div className="hero-metric-number">99.62%</div>
              <div className="hero-metric-caption">Cancer sensitivity</div>
            </div>

            <div className="hero-metric-cell divider-left">
              <div className="hero-metric-number">315</div>
              <div className="hero-metric-caption">Unseen patient scans</div>
            </div>
          </div>

          {/* Benchmark Footnote */}
          <div className="hero-benchmark-footnote">
            <span className="hero-footnote-slashes">//</span> Reported evaluation benchmark
          </div>
        </div>

        {/* Right Column: Hero Orbital Feature Visualizer (Perfect Fit) */}
        <div className="hero-editorial-right">
          <div className="hero-orbital-wrapper-outer">
            <HeroOrbitalVisualizer className="hero-orbital-fit" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
