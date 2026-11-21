"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SideRays from "./SideRays/SideRays";
import CardNav, { CardNavItem } from "./CardNav/CardNav";

interface AppNavbarProps {
  activeSection?: string;
  onSelectSection?: (sectionId: string) => void;
}

export const AppNavbar: React.FC<AppNavbarProps> = ({
  activeSection = "overview",
  onSelectSection
}) => {
  const pathname = usePathname();
  const [currentSection, setCurrentSection] = useState(activeSection);
  const [backendStatus, setBackendStatus] = useState<{
    connected: boolean;
    backbones?: number;
    latency?: number;
  }>({ connected: false });

  // Monitor backend health
  useEffect(() => {
    let isMounted = true;
    const checkBackend = async () => {
      try {
        const t0 = performance.now();
        const res = await fetch("/api/health");
        const t1 = performance.now();
        if (res.ok && isMounted) {
          const data = await res.json();
          setBackendStatus({
            connected: Boolean(data.python_backend),
            backbones: data.total_backbones_active || (data.python_backend ? 3 : 0),
            latency: Math.round(t1 - t0)
          });
        } else if (isMounted) {
          setBackendStatus({ connected: false });
        }
      } catch {
        if (isMounted) setBackendStatus({ connected: false });
      }
    };

    checkBackend();
    const interval = setInterval(checkBackend, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    setCurrentSection(activeSection);
  }, [activeSection]);

  // Track active section on scroll if on home page
  useEffect(() => {
    if (pathname !== "/") return;

    const handleScroll = () => {
      const sections = ["overview", "analysis", "benchmarks", "benchmark"];
      const scrollPos = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setCurrentSection(sectionId === "benchmark" ? "benchmarks" : sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    if (pathname === "/") {
      e.preventDefault();
      setCurrentSection(sectionId);
      if (onSelectSection) {
        onSelectSection(sectionId);
      } else {
        const el = document.getElementById(sectionId) || (sectionId === "benchmarks" ? document.getElementById("benchmark") : null);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }
  };

  // Curated clinical navigation cards for CardNav
  const navItems: CardNavItem[] = [
    {
      label: "Overview & Platform",
      description: "AI-assisted clinical diagnostic workstation for thoracic oncology.",
      links: [
        { label: "Clinical Overview", href: "/#overview" },
        { label: "Tri-Ensemble Pipeline", href: "/#overview" },
        { label: "Clinical Architecture", href: "/#benchmarks" }
      ]
    },
    {
      label: "Diagnostic Studio",
      description: "Real-time chest CT inference across 4 histopathological categories.",
      links: [
        { label: "Upload & Classify Scan", href: "/#analysis" },
        { label: "Pathology Subtypes (Adeno/Squamous/Large Cell)", href: "/#analysis" },
        { label: "Generate Clinical Report", href: "/#analysis" }
      ]
    },
    {
      label: "Holdout Benchmarks",
      description: "Validation on 315 unseen holdout patients with 99.62% cancer sensitivity.",
      links: [
        { label: "Holdout Performance Metrics", href: "/#benchmarks" },
        { label: "Confusion Matrix & ROC", href: "/#benchmarks" },
        { label: "315 Patient Summary", href: "/#benchmarks" }
      ]
    }
  ];

  // Quick 1-click links on the main bar
  const quickLinks = [
    {
      label: "Overview",
      href: "/#overview",
      active: pathname === "/" && currentSection === "overview",
      onClick: (e: React.MouseEvent<HTMLAnchorElement>) => handleNavClick(e, "overview")
    },
    {
      label: "Technology",
      href: "/#analysis",
      active: pathname === "/" && currentSection === "analysis",
      onClick: (e: React.MouseEvent<HTMLAnchorElement>) => handleNavClick(e, "analysis")
    },
    {
      label: "Benchmarks",
      href: "/#benchmarks",
      active: pathname === "/" && (currentSection === "benchmarks" || currentSection === "benchmark"),
      onClick: (e: React.MouseEvent<HTMLAnchorElement>) => handleNavClick(e, "benchmarks")
    }
  ];

  // Brand Logo Lockup positioned on the left side
  const brandLogo = (
    <div className="navbar-brand-clean">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src="/logo_full.png" 
        alt="PulmoAI" 
        className="navbar-brand-full-img"
        onError={(e) => {
          const target = e.currentTarget;
          if (!target.src.endsWith('/logo_full.jpg')) {
            target.src = '/logo_full.jpg';
          }
        }}
      />
    </div>
  );

  return (
    <>
      <header className="site-navbar">
        {/* SideRays WebGL background — absolute fill behind navbar content */}
        <div className="navbar-siderays-bg" aria-hidden="true">
          <SideRays
            rayColor1="#02ffe0"
            rayColor2="#ffffff"
            origin="right"
            speed={1.2}
            intensity={2.5}
            spread={4}
            density={10}
            followMouse={false}
            blend={0.5}
            tilt={-20}
            falloff={0.3}
            glow={0.75}
            opacity={0.9}
          />
        </div>

        <div className="navbar-container">
          {/* CardNav with branding docked on the left, quick links + menu toggle, and CTA button */}
          <CardNav
            logo={brandLogo}
            logoAlt="PulmoAI"
            logoHref="/#overview"
            logoPosition="left"
            quickLinks={quickLinks}
            items={navItems}
            cta={{
              label: "Open Diagnostic Studio →",
              href: "/#analysis",
              onClick: (e) => handleNavClick(e as any, "analysis")
            }}
            cardEffect="rise"
            openOn="click"
            surface="glass"
            stagger={0.12}
            bounce={0.25}
            cardHeight={185}
            maxWidth={1360}
            theme="pulmo"
            linkComponent={Link}
            onLinkClick={(link, _item, event) => {
              if (link.href && link.href.startsWith("/#")) {
                const sec = link.href.replace("/#", "");
                handleNavClick(event as any, sec);
              }
            }}
          />
        </div>
      </header>
    </>
  );
};

export default AppNavbar;
