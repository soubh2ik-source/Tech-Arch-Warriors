"use client";

import React, { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { DiagnosticStudio } from "@/components/DiagnosticStudio";
import { BenchmarksView } from "@/components/BenchmarksView";
import { ReportModal } from "@/components/ReportModal";
import DarkVeil from "@/components/DarkVeil/DarkVeil";
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
        {/* DarkVeil WebGL background matching Hero Section */}
        <div className="benchmark-darkveil-bg" aria-hidden="true">
          <DarkVeil
            color="#02ffe0"
            speed={1}
            scale={1.25}
            flow={1.5}
            warp={1}
            variation={10}
            sheen={1}
            glow={0.75}
            brightness={1.25}
            grain={0.07}
            fade={0.5}
            opacity={0.5}
            mouseInteraction={false}
          />
        </div>

        <div className="section-container" style={{ position: "relative", zIndex: 1 }}>
          <div className="section-header-row">
            <div className="section-title-wrap">
              <span className="section-eyebrow">CLINICAL PERFORMANCE</span>
              <h2 className="section-title">Validation Benchmarks & Holdout Results</h2>
            </div>
            <div className="section-pill-badge">
              <span>315 Independent Holdout Patients</span>
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
