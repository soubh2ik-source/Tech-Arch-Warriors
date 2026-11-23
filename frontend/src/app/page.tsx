"use client";

import React, { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { DiagnosticStudio } from "@/components/DiagnosticStudio";
import { BenchmarksView } from "@/components/BenchmarksView";
import { ReportModal } from "@/components/ReportModal";
import DarkVeil from "@/components/DarkVeil/DarkVeil";
import WarpText from "@/components/WarpText";
import GlassSurface from "@/components/GlassSurface/GlassSurface";
import { PredictionResult, ActiveScan } from "@/types/medical";

export default function Home() {
  // Start with no active scan — DiagnosticStudio will show pre-upload state
  const [activeScan, setActiveScan] = useState<ActiveScan | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [reportOpen, setReportOpen] = useState(false);

  return (
    <div className="home-container">
      {/* 1. Overview Section */}
      <section id="overview" className="section-anchor">
        <HeroSection />
      </section>

      {/* 2. Analysis Section */}
      <section id="analysis" className="section-anchor section-analysis-clean">
        <div className="section-analysis-container">
          <DiagnosticStudio 
            onOpenReport={() => setReportOpen(true)}
            result={result}
            setResult={setResult}
            activeScan={activeScan}
            setActiveScan={setActiveScan}
          />
        </div>
      </section>

      {/* 3. Benchmark Section: Matches Hero Section Background */}
      <section id="benchmarks" className="section-anchor section-benchmark">
        <span id="benchmark" />
        {/* DarkVeil WebGL background matching Hero Section (scaled up to remain visible around cards) */}
        <div className="benchmark-darkveil-bg" aria-hidden="true">
          <DarkVeil
            color="#02ffe0"
            speed={0.45}
            scale={3.0}
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

        <div className="section-container" style={{ position: "relative", zIndex: 1 }}>
          <div className="section-header-row benchmark-header-row">
            <div className="section-title-wrap benchmark-title-wrap">
              {/* Badge rotated 90 degrees on the left beside the word "Validation" */}
              <div className="benchmark-vertical-badge-wrap">
                <GlassSurface
                  className="hero-category-badge hero-category-badge-vertical"
                  width="fit-content"
                  height={32}
                  borderRadius={9999}
                  distortionScale={0}
                  displace={2.5}
                  backgroundOpacity={0}
                >
                  <span className="hero-category-dot" />
                  <span className="hero-category-text">315 INDEPENDENT HOLDOUT PATIENTS</span>
                </GlassSurface>
              </div>

              <h2 className="sr-only">Validation Benchmarks & Holdout Results</h2>
              <WarpText
                text="Validation Benchmarks & Holdout Results"
                align="left"
                warpStrength={0.1}
                warpScale={2}
                speed={0.8}
                lens="pinch"
                pointerInfluence={0.18}
                pointerStrength={0}
                refraction={0.025}
                chromatic={0.5}
                idleDrift={0}
                ripple
                clickRipple
                intro
                fontSize={109}
                fontWeight={800}
                style={{ height: "54px", width: "100%" }}
                color="#02ffe0"
                fontFamily="'Playfair Display', Georgia, serif"
                letterSpacing="-0.04em"
                lineHeight={1}
              />
            </div>
          </div>

          <BenchmarksView />
        </div>
      </section>

      {/* Clean Light-Theme Clinical Report Modal */}
      <ReportModal 
        isOpen={reportOpen}
        result={result} 
        scan={activeScan} 
        user={{
          name: "Dr. S. Mukherjee, MD",
          role: "Chief of Thoracic Radiology & Oncology",
          department: "Pulmonary Diagnostic Center",
          licenseId: "RAD-8820-ONC",
          badgeNumber: "HACK-2026-V1",
          isLoggedIn: true
        }}
        onClose={() => setReportOpen(false)} 
      />
    </div>
  );
}
