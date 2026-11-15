"use client";

import React from "react";

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
              <div className="hero-metric-number">90.16%</div>
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

        {/* Right Column: High-Precision CT Scan View with HUD */}
        <div className="hero-editorial-right">
          <div className="hero-ct-frame">
            <img 
              src="/hero_ct_scan.png" 
              alt="Thoracic Axial CT Radiograph Image Analysis" 
              className="hero-ct-image"
            />
          </div>

          {/* Telemetry Footer Row with Bar and Circuit Accent */}
          <div className="hero-ct-telemetry-row">
            <div className="hero-ct-telemetry-left">
              <div className="hero-ct-cyan-bar" />
              <div className="hero-ct-telemetry-text">
                <span className="hero-ct-telemetry-title">CT IMAGE ANALYSIS</span>
                <span className="hero-ct-telemetry-subtitle">Tri-ensemble model &bull; 4-class classification</span>
              </div>
            </div>

            {/* Subtle Circuit Vector Accent */}
            <div className="hero-ct-circuit-vector" aria-hidden="true">
              <svg width="140" height="32" viewBox="0 0 140 32" fill="none">
                <path d="M0 22 L35 22 L55 6 L120 6" stroke="#38bdf8" strokeWidth="1.2" opacity="0.75" />
                <circle cx="0" cy="22" r="2.5" fill="#00c2cb" />
                <path d="M120 6 L135 6" stroke="#7dd3fc" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
                <circle cx="137" cy="6" r="2" fill="#38bdf8" opacity="0.8" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
