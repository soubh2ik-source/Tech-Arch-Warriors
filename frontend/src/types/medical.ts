/**
 * PulmoVision AI - TypeScript Medical Diagnostic Domain Types
 */

export type DiagnosticClass = 
  | "Adenocarcinoma"
  | "Large Cell Carcinoma"
  | "Normal (Healthy Lung)"
  | "Squamous Cell Carcinoma";

export interface ClinicalProfile {
  subtype: string;
  location: string;
  hallmarks: string;
  risk_level: string;
  recommended_action: string;
  zero_missed_status: string;
}

export interface BackboneResult {
  name: string;
  ensemble_weight: number;
  top_class: DiagnosticClass;
  confidence: number;
  role: string;
}

export interface PredictionResult {
  prediction: DiagnosticClass;
  confidence: number;
  probabilities: Record<DiagnosticClass, number>;
  profile: ClinicalProfile;
  backbones: {
    xception: BackboneResult;
    efficientnet: BackboneResult;
    densenet: BackboneResult;
  };
  consensus: {
    algorithm: string;
    weights: string;
    tta_applied: string;
    benchmark_accuracy: string;
    cancer_sensitivity: string;
  };
  clahe_preview?: string;
  metadata?: {
    original_dimensions: string;
    analyzed_resolution: string;
    processing_latency_ms: number;
    timestamp: string;
  };
  source?: "python_backend" | "in_browser_analytical_engine";
}

export interface SampleScan {
  id: string;
  title: string;
  category: string;
  patientId: string;
  path: string;
  histology: string;
  verifiedGroundTruth: DiagnosticClass;
}

export interface ActiveScan {
  name: string;
  dataUrl: string;
  isSample: boolean;
  sampleId?: string | null;
  meta?: SampleScan | null;
}

export interface ViewportState {
  zoom: number;
  panX: number;
  panY: number;
  showCrosshairs: boolean;
  claheEnhanced: boolean;
  invertGrayscale: boolean;
  windowPreset: "lung" | "mediastinal" | "standard";
}

export interface ClinicianUser {
  name: string;
  role: string;
  department: string;
  licenseId: string;
  badgeNumber: string;
  isLoggedIn: boolean;
}

export interface ValidationErrorPayload {
  code: "CORRUPT_FILE" | "INVALID_ASPECT_RATIO" | "NON_GRAYSCALE_IMAGE" | "INVALID_MODALITY_FOV" | "OUT_OF_DISTRIBUTION_ANATOMY" | "LOW_DIAGNOSTIC_CONFIDENCE" | string;
  title: string;
  message: string;
  telemetry: {
    aspect_ratio?: number;
    chroma_variance?: number;
    corner_intensity?: number;
    thoracic_contrast?: number;
    cosine_similarity?: number;
    ood_threshold?: number;
    max_confidence?: number;
    shannon_entropy?: number;
    tier1_latency_ms?: number;
    tier2_latency_ms?: number;
    total_gatekeeper_latency_ms?: number;
    [key: string]: any;
  };
}

export interface ValidationResult {
  valid: boolean;
  error?: ValidationErrorPayload;
  telemetry?: Record<string, any>;
}
