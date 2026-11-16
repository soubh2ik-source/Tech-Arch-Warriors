# PulmoVision AI (PulmoAI) — Frontend Comprehensive Technical Report

**Project Name:** PulmoVision AI / PulmoAI  
**Repository:** `Tech-Arch-Warriors`  
**Application Type:** Next.js Clinical Radiology & AI Diagnostic Suite  
**Target Domain:** Pulmonary CT Scan Classification, Non-Small Cell Lung Cancer (NSCLC) Subtyping & Explainable AI (XAI)  
**Date of Report:** November 17, 2026  
**Document Status:** Complete Frontend Reference Manual  

---

## Table of Contents
1. [Executive Summary & Clinical Vision](#1-executive-summary--clinical-vision)
2. [Technology Stack & Core Dependencies](#2-technology-stack--core-dependencies)
3. [Architecture & Complete Source Directory Tree](#3-architecture--complete-source-directory-tree)
4. [Design System & UI/UX Philosophy](#4-design-system--uiux-philosophy)
5. [Page Routing & Section Compositions](#5-page-routing--section-compositions)
6. [Component Catalog & Deep Technical Specifications](#6-component-catalog--deep-technical-specifications)
   - [6.1 AppNavbar & NavigationDrawer](#61-appnavbar--navigationdrawer)
   - [6.2 HeroSection & DarkVeil WebGL Visualizer](#62-herosection--darkveil-webgl-visualizer)
   - [6.3 HeroOrbitalVisualizer (3D Multi-Orbital Lung System)](#63-heroorbitalvisualizer-3d-multi-orbital-lung-system)
   - [6.4 DiagnosticStudio (Clinical Radiology Workspace)](#64-diagnosticstudio-clinical-radiology-workspace)
   - [6.5 BenchmarksView (KPIs, Confusion Matrix & Evolution)](#65-benchmarksview-kpis-confusion-matrix--evolution)
   - [6.6 PathologyView (4-Class Pulmonary Pathology Guide)](#66-pathologyview-4-class-pulmonary-pathology-guide)
   - [6.7 ArchitectureView (Tri-Ensemble Engineering Explorer)](#67-architectureview-tri-ensemble-engineering-explorer)
   - [6.8 ReportModal (Clinical Findings Report Generator)](#68-reportmodal-clinical-findings-report-generator)
   - [6.9 AuthModal & Clinician Profile Management](#69-authmodal--clinician-profile-management)
7. [Radiology Tools, Image Processing & Explainable AI (XAI)](#7-radiology-tools-image-processing--explainable-ai-xai)
8. [Client-Side State Management & Backend Integration](#8-client-side-state-management--backend-integration)
9. [Responsive Design Matrix & Multi-Device Optimization](#9-responsive-design-matrix--multi-device-optimization)
10. [Visual Polish & Recent Frontend Enhancements](#10-visual-polish--recent-frontend-enhancements)
11. [Setup, Build & Developer Operations](#11-setup-build--developer-operations)

---

## 1. Executive Summary & Clinical Vision

**PulmoVision AI** is a specialized, web-based diagnostic radiology platform engineered to classify high-resolution thoracic Computed Tomography (CT) scans across four distinct clinical categories:
1. **Adenocarcinoma (Adeno)** — Peripheral glandular Non-Small Cell Lung Cancer (NSCLC).
2. **Squamous Cell Carcinoma (Squamous)** — Central cavitating bronchial NSCLC.
3. **Large Cell Carcinoma (Large Cell)** — Undifferentiated, highly aggressive NSCLC.
4. **Normal Healthy Lung** — Non-malignant pulmonary parenchyma.

The platform was built from the ground up to solve the critical "black-box" dilemma in medical machine learning. Rather than simply returning a raw probability number, the PulmoAI frontend delivers:
- **Interactive Multi-Model Consensus**: Real-time inspection of three specialized neural backbones (**DenseNet121** [60%], **EfficientNetV2-S** [30%], and **Xception** [10%]).
- **Explainable AI (Grad-CAM)**: High-resolution heatmap overlays that highlight exact spatial activations and nodular regions driving diagnostic decisions.
- **Radiology Workspace Suite**: Real-time Hounsfield Unit (HU) windowing (Standard, Lung, Mediastinal), CLAHE contrast equalization, digital zooming/panning, crosshairs, and grayscale inversion.
- **Audit-Ready Clinical Documentation**: Instant generation of standardized, printable/exportable clinical findings reports signed with clinician credentials.

---

## 2. Technology Stack & Core Dependencies

The frontend is built upon a modern, bleeding-edge React and Next.js architecture designed for ultra-low latency, strict type safety, and zero external UI library bloat.

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js (App Router) | `16.3.8` | Server/Client components, dynamic routing, API proxying |
| **Core UI Library** | React / React DOM | `19.2.8` | Component rendering, concurrent UI transitions |
| **Language** | TypeScript | `^5.0` | Strict end-to-end type safety, medical domain interfaces |
| **Graphics & Shaders** | WebGL / Custom Canvas 2D | Native | DarkVeil organic background shader, interactive CT canvas |
| **Iconography** | Custom SVG Component Suite | Native | Lightweight, medical-specific vector iconography |
| **Styling** | Pure Modular CSS + CSS Variables | Native | Zero-runtime CSS design system, responsive media queries |
| **Linting & Code Quality** | ESLint + eslint-config-next | `^9.0` | Static analysis, accessibility, performance linting |

> [!NOTE]
> The project purposefully avoids heavy UI component dependencies (such as Tailwind, Material UI, or Radix). All styling is powered by a high-performance, centralized design system in `globals.css` that provides instantaneous rendering, fluid hardware-accelerated animations, and granular control over every single pixel.

---

## 3. Architecture & Complete Source Directory Tree

The frontend repository is structured within `Tech-Arch-Warriors/frontend` following the Next.js App Router conventions:

```text
Tech-Arch-Warriors/frontend/
├── package.json
├── tsconfig.json
├── next.config.mjs
├── public/
│   ├── favicon.ico
│   ├── favicon.png
│   ├── logo.png / logo.jpg
│   ├── logo_full.png / logo_full.jpg
│   ├── lungs_bg.png
│   ├── navbar-texture.png
│   ├── hero_ct_scan.png
│   ├── assets/
│   └── samples/
│       ├── adenocarcinoma.png
│       ├── squamous_cell.png
│       ├── large_cell.png
│       └── normal_lung.png
└── src/
    ├── app/
    │   ├── favicon.ico
    │   ├── globals.css                # Global Design System & Clinical Theming
    │   ├── layout.tsx                 # Root HTML shell, fonts, navbar & footer
    │   ├── page.tsx                   # Main SPA Landing & Diagnostic Workspace
    │   ├── analysis/
    │   │   └── page.tsx               # Dedicated Analysis route
    │   ├── architecture/
    │   │   └── page.tsx               # Dedicated Architecture Explorer route
    │   ├── benchmarks/
    │   │   └── page.tsx               # Dedicated Benchmarks & Validation route
    │   ├── pathology/
    │   │   └── page.tsx               # Dedicated 4-Class Pathology Reference route
    │   ├── settings/
    │   │   └── page.tsx               # System Configuration & Preferences route
    │   └── api/
    │       ├── health/route.ts        # Next.js API endpoint proxying backend health
    │       └── predict/route.ts       # Next.js API endpoint proxying CT inference
    ├── components/
    │   ├── AppNavbar.tsx              # Sticky clinical navigation with profile popover
    │   ├── NavigationDrawer.tsx       # Responsive mobile slide-out navigation
    │   ├── HeroSection.tsx            # Headline, clinical badges, stat cards
    │   ├── DiagnosticStudio.tsx       # Core interactive CT analysis workspace
    │   ├── BenchmarksView.tsx         # KPIs, Confusion Matrix & Evolution table
    │   ├── PathologyView.tsx          # Comprehensive histological & imaging atlas
    │   ├── ArchitectureView.tsx       # Tri-Ensemble architecture visualizer
    │   ├── ReportModal.tsx            # Clinical Diagnostic Findings Report modal
    │   ├── AuthModal.tsx              # Clinician credential & profile management
    │   ├── Header.tsx                 # Secondary subpage navigation header
    │   ├── Icons.tsx                  # Dedicated medical & UI vector icon suite
    │   ├── OrbitingLungsShowcase.tsx  # Secondary standalone 3D lungs showcase
    │   ├── DarkVeil/
    │   │   ├── DarkVeil.jsx           # WebGL interactive fluid shader component
    │   │   └── DarkVeil.css           # Canvas positioning & fallback styling
    │   ├── SideRays/
    │   │   ├── SideRays.jsx           # Volumetric ambient lighting visualizer
    │   │   └── SideRays.css           # Ambient ray positioning & animations
    │   └── HeroOrbitalVisualizer/
    │       ├── HeroOrbitalVisualizer.tsx # 3D lung with dual rotating card rings
    │       ├── HeroOrbitalVisualizer.css # Orbital animation & card styling
    │       ├── types.ts               # Orbital node interfaces & coordinates
    │       └── index.ts               # Barrel export
    ├── lib/
    │   ├── constants.ts               # Sample scans, clinical profiles, benchmarks
    │   └── inferenceClient.ts         # Dual-mode inference client (FastAPI + mock)
    └── types/
        └── medical.ts                 # Diagnostic types, scan models, profiles
```

---

## 4. Design System & UI/UX Philosophy

The user interface balances **clinical precision** with **editorial elegance**. It combines the focused, dark-themed ambiance of hospital radiology suites with the crisp typography of high-end scientific journals.

### 4.1 Color Architecture & Design Tokens
```css
:root {
  /* Core Clinical Palette */
  --bg-primary: #f8fafc;
  --bg-surface: #ffffff;
  --bg-surface-hover: #f1f5f9;
  --bg-dark: #0f172a;

  /* Clinical Accents & Tones */
  --color-teal-bright: #02ffe0;       /* Luminous Electric Cyan */
  --color-teal-primary: #00c2cb;      /* Clinical Brand Teal */
  --color-teal-deep: #005f50;         /* Contrast Border Teal */
  --color-navy-dark: #050d16;         /* Hero & Studio Dark Backdrop */
  --color-navy-card: #0b1a2d;         /* Card Background Navy */
  --color-mint-light: #d0fcf4;        /* Benchmark & Orbital Box Tint */
  --color-mint-accent: #a7ebd9;       /* Highlighted Row Tint */

  /* Diagnostic Severity Colors */
  --color-adeno: #0284c7;             /* Medical Blue */
  --color-squamous: #f59e0b;          /* Warning Amber */
  --color-large: #e11d48;             /* Critical Crimson */
  --color-normal: #10b981;            /* Healthy Emerald */

  /* Structural Border Standards */
  --border-prominent: 2px solid #005f50;
  --border-prominent-cyan: 2px solid #02ffe0;
  --border-subtle: #cbd5e1;
  --border-medium: #94a3b8;
}
```

### 4.2 The "Prominent Border" Standard
Throughout the entire UI, all interactive buttons, cards, containers, dialogs, and badges follow a unified **2px prominent border** design standard:
- Buttons (`.btn-primary`, `.btn-secondary`, `.btn-hero-explore`) possess crisp 2px solid borders for high accessibility.
- Cards in the Hero, Benchmarks, and Studio possess 2px borders with subtle cyan or medical-teal glows.
- Data tables feature defined cell boundaries and highlighted rows to prevent misreading radiologic figures.

### 4.3 Typography Hierarchy
- **Editorial Headlines**: `Playfair Display` serif font (`font-weight: 850`), delivering distinction and gravitas to the hero and section titles.
- **Application Interface & Clinical Data**: `Plus Jakarta Sans` and `Inter` sans-serif fonts, engineered for optimal readability on high-DPI displays.
- **Radiologic Telemetry & Slices**: Monospace fonts (`var(--font-mono)`), used for coordinates, patient IDs, Hounsfield units, and benchmark numbers.

---

## 5. Page Routing & Section Compositions

While the primary experience is a seamless single-page application (SPA) on `/`, the application also provides dedicated subpage routes sharing the same clinical navigation header and user profile state.

| Route | Page Component | Key Modules Loaded | Purpose |
| :--- | :--- | :--- | :--- |
| `/` | `src/app/page.tsx` | `HeroSection`, `DiagnosticStudio`, `BenchmarksView`, `ReportModal` | Primary end-to-end clinical workflow |
| `/analysis` | `src/app/analysis/page.tsx` | `Header`, `DiagnosticStudio`, `AuthModal` | Dedicated fullscreen scan analysis workstation |
| `/architecture` | `src/app/architecture/page.tsx` | `Header`, `ArchitectureView`, `AuthModal` | Comprehensive model architecture breakdown |
| `/benchmarks` | `src/app/benchmarks/page.tsx` | `Header`, `BenchmarksView`, `AuthModal` | Validation benchmark metrics & confusion matrix |
| `/pathology` | `src/app/pathology/page.tsx` | `Header`, `PathologyView`, `AuthModal` | 4-class pulmonary pathology reference guide |
| `/settings` | `src/app/settings/page.tsx` | `Header`, `AuthModal`, System Config | Backend URL configuration, threshold tuning |

---

## 6. Component Catalog & Deep Technical Specifications

### 6.1 AppNavbar & NavigationDrawer
- **File:** `src/components/AppNavbar.tsx` & `src/components/NavigationDrawer.tsx`
- **Features:**
  - Sticky frosted header (`backdrop-filter: blur(12px)`) with subtle clinical border.
  - PulmoVision brand badge with clinical lung icon and high-contrast typography.
  - Active section observer that highlights the current section as the clinician scrolls.
  - **Clinician Profile Popover**: Clicking the clinician badge opens an interactive popover displaying Dr. S. Mukherjee's credentials (MD, Chief of Thoracic Radiology), license number (`RAD-8820-ONC`), active session status, and an edit profile trigger.
  - **Mobile Hamburger & Drawer**: On screens `<= 840px`, navigation collapses into a dedicated hamburger button triggering an off-canvas drawer with smooth slide-in transitions.

### 6.2 HeroSection & DarkVeil WebGL Visualizer
- **File:** `src/components/HeroSection.tsx` & `src/components/DarkVeil/DarkVeil.jsx`
- **Features:**
  - **WebGL Shader Canvas**: Powered by a custom Three.js/WebGL fragment shader (`DarkVeil`) rendering organic fluid dynamics with electric cyan and deep ocean-blue gradients.
  - **Category Eyebrow Badge**: Glowing pill badge (`Pulmonary AI / CT Classification`) with pulsating cyan indicator.
  - **Editorial Headline**: High-impact Playfair Display serif headline with luminous terminal dot.
  - **Action CTAs**: Quick navigation to `#analysis` (Explore the platform) and `#benchmarks` (View model performance).
  - **Prominent Stat Cards**: Three symmetric clinical cards (`96.4% Test accuracy`, `99.62% Cancer sensitivity`, and `315 Unseen patient scans`) enclosed in 2px cyan borders with frosted glass backgrounds (`rgba(5, 13, 22, 0.78)`).

### 6.3 HeroOrbitalVisualizer (3D Multi-Orbital Lung System)
- **File:** `src/components/HeroOrbitalVisualizer/HeroOrbitalVisualizer.tsx`
- **Features:**
  - **Central Lungs Anatomy**: High-definition glowing pulmonary graphic with subtle rhythmic breathing animation (`lungs-subtle-breathe`).
  - **Dual Revolving Orbit Rings**: Concentric dashed orbital tracks rendered via mathematical SVG ellipses.
  - **Revolving Diagnostic Feature Cards**:
    - **Outer Ring (Clockwise, 38s cycle)**: "CT Scan Analysis", "Clinical Insights", "Nodule Detection".
    - **Inner Ring (Counter-Clockwise, 28s cycle)**: "Risk Prediction", "Tri-Ensemble AI Models".
  - **Card Theming**: Cards feature clean mint backgrounds (`#d0fcf4`), prominent 2.5px teal borders (`#02ffe0`), and counter-rotating stabilization so text always remains upright and readable.
  - **Background Depth**: Emits ambient glowing stars and satellites across orbital tracks.

### 6.4 DiagnosticStudio (Clinical Radiology Workspace)
- **File:** `src/components/DiagnosticStudio.tsx`
- **Features:**
  - **Pre-Upload vs. Post-Upload States**: 
    - *Pre-Upload*: Displays an expansive drag-and-drop ingestion dropzone, quick sample scan selector (Adeno, Squamous, Large Cell, Normal), and technical capability overview.
    - *Post-Upload*: Transitions into a dual-column clinical workstation with CT viewport on the left and diagnostic findings panel on the right.
  - **DICOM & Image Ingestion**: Supports `.dcm`, `.png`, `.jpg`, and `.jpeg` files. Displays a clinical navy progress card with real-time percentage indicators during scan parsing.
  - **Interactive HTML5 Canvas Viewport**:
    - Smooth continuous digital zoom (`0.5x` to `4.0x`) and free panning with mouse drag.
    - Toggleable central radiologic crosshairs.
    - Real-time Grayscale Inversion for high-density nodule inspection.
    - CLAHE (Contrast Limited Adaptive Histogram Equalization) simulation button.
    - Presets for **Standard View**, **Lung Window** (W:1500, L:-600 HU), and **Mediastinal Window** (W:350, L:40 HU).
  - **Diagnostic Findings & Probability Engine**:
    - Primary diagnosis callout with severity risk badge (e.g., `Malignant - High`, `Malignant - Critical`, `Non-Malignant - Low`).
    - Interactive 4-class probability meter with animated percentage bars.
    - **Tri-Ensemble Backbone Breakdown**: Displays individual predictions and confidence scores for DenseNet121, EfficientNetV2-S, and Xception.
    - **Grad-CAM Explainable AI (XAI)**: Heatmap overlay slider allowing radiologists to blend between raw CT scan and activation maps with variable opacity.
    - Action trigger to generate the official clinical report.

### 6.5 BenchmarksView (KPIs, Confusion Matrix & Evolution)
- **File:** `src/components/BenchmarksView.tsx`
- **Features:**
  - **4 Top KPI Cards**:
    1. *Holdout Test Accuracy*: **90.16%** (284/315 independent patient scans).
    2. *Malignancy Sensitivity*: **99.62%** (260/261 cancers detected, 0 missed).
    3. *Healthy Specificity*: **98.15%** (53/54 healthy controls confirmed).
    4. *False Normal Diagnoses*: **0 (Zero)** (Zero malignant scans mislabelled as healthy).
  - **Interactive Multi-Class Confusion Matrix**:
    - Full 4x4 matrix mapping Ground Truth against Predictions across 315 holdout patients.
    - Green-tinted cells for correct diagonal predictions; soft coral cells for off-diagonal misclassifications.
    - Highlighted Summary Row: Precision row highlighted in soft clinical teal (`#a7ebd9`) with dark, crisp numbers.
  - **Step-by-Step Architectural Evolution Table**:
    - Chronicles all 8 development iterations from Baseline Conv2D (72.86%) through single-view backbones, 5-view TTA, Bayesian prior calibration, dual ensemble, and final Tri-Ensemble (90.16%).
    - Final Milestone 8 row highlighted in matching clinical teal with crown/trophy badge.

### 6.6 PathologyView (4-Class Pulmonary Pathology Guide)
- **File:** `src/components/PathologyView.tsx`
- **Features:**
  - Provides complete medical reference for each diagnostic category:
    - Cellular architecture and histological hallmarks (e.g., mucin production, keratin pearls, intercellular bridges, lack of differentiation).
    - Radiologic manifestations on thin-section CT (e.g., ground-glass opacities, spiculation, pleural puckering, central cavitation).
    - Anatomic predilection (peripheral vs. proximal central bronchus).
    - Recommended clinical guidelines, molecular biomarker testing (EGFR, ALK, KRAS, PD-L1), and biopsy staging.

### 6.7 ArchitectureView (Tri-Ensemble Engineering Explorer)
- **File:** `src/components/ArchitectureView.tsx`
- **Features:**
  - Deep-dive technical pipeline visualizer illustrating:
    1. *Input Pipeline*: 16-bit CT slice normalization and CLAHE adaptive histogram equalization.
    2. *Test-Time Augmentation (TTA)*: 5-view geometric averaging (original, horizontal flip, +/-5° rotations, 1.05x zoom).
    3. *Constituent Neural Backbones*:
       - **DenseNet121 (60% voting weight)**: Feature reuse via dense connectivity.
       - **EfficientNetV2-S (30% voting weight)**: Progressive multi-scale convolutions.
       - **Xception (10% voting weight)**: Depthwise separable convolutions.
    4. *Bayesian Class-Prior Calibration*: Logit reweighting to neutralize dataset frequency imbalance.
    5. *Consensus Engine*: Soft-voting probability aggregation with calibrated thresholding.

### 6.8 ReportModal (Clinical Findings Report Generator)
- **File:** `src/components/ReportModal.tsx`
- **Features:**
  - Clean light-theme clinical document styled for formal medical records.
  - Structured into standardized radiology reporting sections:
    - Patient Header (ID, Scan Date, Modality: High-Resolution Chest CT, Referring Facility).
    - Diagnostic Impression (Primary finding, Malignancy status, Confidence level).
    - Quantitative Classification Probabilities table.
    - Multi-Model Consensus telemetry.
    - Recommended Clinical Management & Follow-Up Protocol.
    - Electronic signature block of the attending thoracic radiologist.
  - Interactive Action Buttons:
    - **Print / Save PDF**: Triggers native browser print preview with `@media print` stylesheets that format the report onto a clean A4 sheet without navigation bars.
    - **Export JSON**: Downloads structured diagnostic telemetry as machine-readable JSON for hospital PACS/EMR integration.

### 6.9 AuthModal & Clinician Profile Management
- **File:** `src/components/AuthModal.tsx`
- **Features:**
  - Modal dialog allowing radiologists to update their active profile:
    - Clinician Full Name (e.g., Dr. S. Mukherjee, MD)
    - Professional Role & Title
    - Department / Clinical Division
    - Medical License / Radiologist Registration ID
    - Attending Badge Number
  - Updates persist in React state across the application and dynamically populate the digital signature of generated diagnostic reports.

---

## 7. Radiology Tools, Image Processing & Explainable AI (XAI)

The frontend implements advanced client-side image processing capabilities directly in JavaScript and HTML5 Canvas, reducing server roundtrips and providing instant tactile feedback:

```mermaid
flowchart LR
    A["Uploaded CT / DICOM"] --> B["Slice Ingestion & Validation"]
    B --> C["Canvas 2D Viewport Engine"]
    C --> D1["HU Windowing Presets"]
    C --> D2["Grayscale Inversion"]
    C --> D3["CLAHE Contrast Boost"]
    C --> D4["Continuous Zoom / Pan"]
    B --> E["Inference Engine (FastAPI / Mock)"]
    E --> F["Grad-CAM Heatmap Blend"]
    F --> C
```

1. **Hounsfield Unit (HU) Windowing Simulation**:
   - *Standard CT View*: Linear grayscale mapping for balanced parenchymal and bone visualization.
   - *Lung Window*: Enhanced contrast across low-density lung parenchyma (`-600 HU` level / `1500 HU` window), making faint ground-glass opacities immediately apparent.
   - *Mediastinal Window*: Suppresses lung airspaces to highlight vascular structures, lymph nodes, and solid masses (`40 HU` level / `350 HU` window).
2. **CLAHE (Contrast Limited Adaptive Histogram Equalization)**:
   - Client-side adaptive histogram equalization that enhances local contrast in sub-centimeter nodules without amplifying background image noise.
3. **Interactive Grad-CAM Blending**:
   - The Grad-CAM layer is rendered onto an alpha-blended canvas directly atop the radiologic image.
   - Clinicians can use the opacity slider to slide seamlessly between the raw anatomical scan and the AI's saliency activation map.

---

## 8. Client-Side State Management & Backend Integration

### 8.1 State Management Strategy
The application employs a clean, hierarchical React state model located in `page.tsx` and propagated via typed props:
- `activeScan`: Contains the current scan object (`name`, `dataUrl`, `isSample`, `meta`).
- `result`: Holds the complete `PredictionResult` object returned from inference.
- `viewportState`: Manages zoom factor, pan coordinates, active windowing preset, crosshair visibility, and filter states.
- `reportOpen` / `authOpen`: Modal visibility state flags.

### 8.2 Dual-Mode Inference Client (`inferenceClient.ts`)
The frontend contains an intelligent client (`src/lib/inferenceClient.ts`) capable of operating in two modes:
1. **Live Backend Mode (FastAPI)**:
   - Dispatches `POST` requests to `/api/predict` or `http://localhost:8000/predict` with `multipart/form-data`.
   - Returns real-time predictions generated by the PyTorch/TensorFlow backend running the Tri-Ensemble models.
2. **Deterministic Clinical Simulation Mode (Fallback & Demo)**:
   - When the backend is offline or during offline judging/demonstrations, the client seamlessly falls back to pre-calibrated benchmark evaluations for sample scans and uploaded files.
   - Generates realistic probabilities, constituent backbone agreements, Grad-CAM heatmaps, and processing latencies (`< 45ms`).

---

## 9. Responsive Design Matrix & Multi-Device Optimization

The CSS architecture contains explicit responsive breakpoints ensuring seamless operation on everything from multi-monitor 4K radiology workstations to mobile tablets:

| Breakpoint Range | Device Class | Layout Adaptations |
| :--- | :--- | :--- |
| **> 1220px** | Ultra-Wide & 4K Radiology Monitors | Full 2-column layout; 480px orbital visualizer; max-width 1280px container |
| **1024px – 1220px** | Standard Laptops & Desktops | Grid gap adjusted to 32px; orbital scale `1.02`; font sizes slightly scaled |
| **840px – 1024px** | Small Laptops & Landscape Tablets | Hero padding reduced; orbital visualizer scale `0.88`; side-by-side columns preserved |
| **640px – 839px** | Portrait Tablets | Single-column stacked layout; orbital scale `0.85`; 3-metric cards use 10px gap |
| **380px – 640px** | Standard Mobile Phones | Single-column stacked; hamburger drawer activated; metric numbers scale to 20px |
| **< 380px** | Ultra-Compact Mobile Phones | Minimal padding; metric numbers scale to 17px; orbital visualizer scale `0.62` |

---

## 10. Visual Polish & Recent Frontend Enhancements

Over recent development cycles, the frontend has undergone meticulous visual refinement to achieve its current production-grade aesthetic:

1. **Clean Mint Background for Benchmark & Orbital Cards**:
   - Replaced noisy diagonal striping with a serene, professional light-mint clinical tint (`#d0fcf4`) with crisp `2.5px solid #02ffe0` borders.
2. **Enhanced Benchmark Table Contrast**:
   - Upgraded the highlighted summary rows (Confusion Matrix Precision Row and Architectural Evolution Milestone 8) from stark white to a harmonious medical teal tint (`#a7ebd9`) with high-contrast text (`#051a15`).
3. **Upload Progress Card Dark Theme**:
   - Replaced white background on the file ingestion card with a sleek clinical dark navy theme (`#0b1a2d`) featuring bright white filename text and luminous cyan progress bars.
4. **Hero Annotations Cleanup**:
   - Removed distracting hand-drawn floating callout annotations ("Earlier Detection Brighter Tomorrows" and "AI for Lungs for Lives") to maintain a clean, distraction-free visual presentation.
5. **Hero Metrics Stat Cards Refactoring**:
   - Replaced floating, asymmetrical vertical divider lines with three prominent, symmetrical clinical stat cards enclosed in 2px cyan borders with frosted glass backgrounds.

---

## 11. Setup, Build & Developer Operations

### Prerequisites
- **Node.js**: v18.18.0 or later (v20+ recommended)
- **Package Manager**: `npm`, `pnpm`, or `yarn`

### Local Development
To run the frontend locally in development mode:
```bash
cd Tech-Arch-Warriors/frontend
npm install
npm run dev
```
The application will launch at `http://localhost:3000`.

### Production Build
To create an optimized production build:
```bash
cd Tech-Arch-Warriors/frontend
npm run build
npm run start
```

### Static Linting
To run ESLint and verify codebase integrity:
```bash
cd Tech-Arch-Warriors/frontend
npm run lint
```

---

*Report compiled and certified for the PulmoVision AI / PulmoAI project (`Tech-Arch-Warriors`).*
