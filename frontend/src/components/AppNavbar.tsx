"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SideRays from "./SideRays/SideRays";
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
          {/* Left: Brand Logo Full Lockup (logo_full.jpg) */}
          <div className="navbar-left-group">
            <Link 
              href="/#overview" 
              onClick={(e) => handleNavClick(e, "overview")}
              className="navbar-brand-clean"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/logo_full.png" 
                alt="PalmoAI" 
                className="navbar-brand-full-img"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.endsWith('/logo_full.jpg')) {
                    target.src = '/logo_full.jpg';
                  }
                }}
              />
            </Link>
          </div>

          {/* Center Navigation Links: Overview, Technology, Benchmarks */}
          <nav className="navbar-links">
            <Link
              href="/#overview"
              onClick={(e) => handleNavClick(e, "overview")}
              className={`navbar-link ${pathname === "/" && currentSection === "overview" ? "active" : ""}`}
            >
              <span>Overview</span>
              {pathname === "/" && currentSection === "overview" && (
                <span className="navbar-active-cyan-bar" />
              )}
            </Link>
            <Link
              href="/#analysis"
              onClick={(e) => handleNavClick(e, "analysis")}
              className={`navbar-link ${pathname === "/" && currentSection === "analysis" ? "active" : ""}`}
            >
              <span>Technology</span>
              {pathname === "/" && currentSection === "analysis" && (
                <span className="navbar-active-cyan-bar" />
              )}
            </Link>
            <Link
              href="/#benchmarks"
              onClick={(e) => handleNavClick(e, "benchmarks")}
              className={`navbar-link ${pathname === "/" && (currentSection === "benchmarks" || currentSection === "benchmark") ? "active" : ""}`}
            >
              <span>Benchmarks</span>
              {pathname === "/" && (currentSection === "benchmarks" || currentSection === "benchmark") && (
                <span className="navbar-active-cyan-bar" />
              )}
            </Link>
          </nav>

          {/* Right Action: Open Diagnostic Studio Pill Button */}
          <div className="navbar-actions">
            <a 
              href="/#analysis"
              onClick={(e) => handleNavClick(e, "analysis")}
              className="navbar-cta-pill"
            >
              <span>Open Diagnostic Studio</span>
              <span className="navbar-cta-arrow">&rarr;</span>
            </a>
          </div>
        </div>
      </header>
    </>
  );
};
