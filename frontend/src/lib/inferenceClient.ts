/**
 * PulmoVision AI - Next.js Resilient Inference Client
 * Integrates with PulmoAI 2-Tier Modality Gatekeeper
 */

import { PredictionResult, SampleScan, ValidationErrorPayload, ValidationResult } from "@/types/medical";

export class ModalityValidationError extends Error {
  errorPayload: ValidationErrorPayload;

  constructor(payload: ValidationErrorPayload) {
    super(payload?.message || "Out-of-distribution image modality rejected by Gatekeeper");
    this.name = "ModalityValidationError";
    this.errorPayload = payload;
  }
}

export async function requestPrediction(imageDataUrl: string, sample?: SampleScan | null): Promise<PredictionResult> {
  const res = await fetch("/api/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      image_data: imageDataUrl,
      sample_id: sample ? sample.id : undefined
    })
  });

  if (res.status === 422) {
    const errorJson = await res.json();
    throw new ModalityValidationError(errorJson.error);
  }

  if (!res.ok) {
    throw new Error(`Inference request failed with status ${res.status}`);
  }

  return await res.json();
}

export async function validateScan(imageDataUrl: string, sample?: SampleScan | null): Promise<ValidationResult> {
  try {
    const res = await fetch("/api/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image_data: imageDataUrl,
        sample_id: sample ? sample.id : undefined
      })
    });

    const data = await res.json();
    if (res.status === 422 || !data.valid) {
      return { valid: false, error: data.error };
    }
    return { valid: true, telemetry: data.telemetry };
  } catch (err) {
    return {
      valid: false,
      error: {
        code: "NETWORK_ERROR",
        title: "Connection Error",
        message: "Failed to reach modality gatekeeper.",
        telemetry: {}
      }
    };
  }
}
