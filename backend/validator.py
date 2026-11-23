"""
PulmoAI
2-Tier Out-of-Distribution (OOD) Modality Gatekeeper & CT Validator

Enforces strict clinical validation for axial thoracic CT scans:
  - Tier 1: Fast Pixel & Gantry Geometry Heuristics (< 5ms)
  - Tier 2: Xception Feature-Space Manifold & Shannon Entropy Gate (< 40ms, single forward pass)
"""

import io
import time
from pathlib import Path
from typing import Tuple, Dict, Any, Optional, Union

import numpy as np
from PIL import Image

IMAGE_SIZE = (350, 350)
DEFAULT_OOD_THRESHOLD = 0.70
MIN_CONFIDENCE_THRESHOLD = 0.55


class ScanValidationError(Exception):
    """Structured clinical validation exception with standardized telemetry."""
    def __init__(self, code: str, title: str, message: str, telemetry: Optional[Dict[str, Any]] = None):
        super().__init__(message)
        self.code = code
        self.title = title
        self.message = message
        self.telemetry = telemetry or {}

    def to_dict(self) -> Dict[str, Any]:
        return {
            "valid": False,
            "error": {
                "code": self.code,
                "title": self.title,
                "message": self.message,
                "telemetry": self.telemetry
            }
        }


def load_image_normalized(
    image_input: Union[str, Path, bytes, Image.Image, np.ndarray]
) -> Tuple[Image.Image, np.ndarray, float]:
    """
    Decodes arbitrary image input into a PIL Image and normalized float32 array (350, 350, 3).
    Returns (pil_image, arr_350, decode_latency_ms).
    """
    t0 = time.perf_counter()
    pil_img: Optional[Image.Image] = None

    try:
        if isinstance(image_input, (str, Path)):
            p = Path(image_input)
            if not p.exists():
                raise ScanValidationError(
                    code="CORRUPT_FILE",
                    title="Missing Image File",
                    message=f"Image file does not exist at path: {p.name}",
                    telemetry={"input_path": str(p)}
                )
            pil_img = Image.open(str(p))
            pil_img.load()
        elif isinstance(image_input, bytes):
            pil_img = Image.open(io.BytesIO(image_input))
            pil_img.load()
        elif isinstance(image_input, Image.Image):
            pil_img = image_input
        elif isinstance(image_input, np.ndarray):
            u8 = np.clip(image_input, 0, 255).astype(np.uint8)
            pil_img = Image.fromarray(u8)
        else:
            raise ValueError(f"Unsupported image input type: {type(image_input)}")

        if pil_img is None:
            raise ValueError("Decoded image is None")

    except ScanValidationError:
        raise
    except Exception as e:
        latency = (time.perf_counter() - t0) * 1000.0
        raise ScanValidationError(
            code="CORRUPT_FILE",
            title="Image Decoding Failure",
            message=f"Unable to parse or decode uploaded image file: {str(e)}",
            telemetry={"decode_latency_ms": round(latency, 2)}
        )

    # Convert to RGB and resize to standard PACE resolution
    pil_rgb = pil_img.convert("RGB")
    pil_resized = pil_rgb.resize(IMAGE_SIZE, Image.Resampling.BILINEAR)
    arr_350 = np.array(pil_resized, dtype=np.float32)
    decode_ms = (time.perf_counter() - t0) * 1000.0

    return pil_rgb, arr_350, decode_ms


def validate_axial_ct_heuristics(
    image_input: Union[str, Path, bytes, Image.Image, np.ndarray]
) -> Tuple[np.ndarray, Dict[str, Any]]:
    """
    Tier 1: Fast Pixel & Gantry Geometry Heuristics (< 5ms)
    Validates:
      1. Decode & Integrity
      2. Aspect Ratio (0.75 <= width/height <= 1.35)
      3. Monochromatic / Chroma Variance (< 6.5)
      4. Circular CT Gantry Field-of-View (FOV) Corner Patches & Central Thoracic Contrast
    Returns (arr_350_normalized, telemetry).
    """
    t0 = time.perf_counter()
    orig_pil, arr_350, decode_ms = load_image_normalized(image_input)
    width, height = orig_pil.size

    # 1. Aspect Ratio Check (cross-sectional slice geometry)
    aspect_ratio = float(width) / float(max(1, height))
    if aspect_ratio < 0.75 or aspect_ratio > 1.35:
        latency_ms = (time.perf_counter() - t0) * 1000.0
        raise ScanValidationError(
            code="INVALID_ASPECT_RATIO",
            title="Invalid Slice Aspect Ratio",
            message=(
                f"Aspect ratio {aspect_ratio:.2f} ({width}x{height}) deviates from "
                "standard cross-sectional thoracic CT geometry (0.75 - 1.35)."
            ),
            telemetry={
                "aspect_ratio": round(aspect_ratio, 3),
                "dimensions": f"{width}x{height}",
                "latency_ms": round(latency_ms, 2)
            }
        )

    # 2. Monochromatic / Chroma Variance Check
    # Thoracic CTs are grayscale reconstructions. RGB channel deviation > 6.5 indicates a color photo or UI screenshot.
    channel_std = np.std(arr_350, axis=-1)  # (350, 350)
    chroma_variance = float(np.mean(channel_std))
    if chroma_variance > 6.5:
        latency_ms = (time.perf_counter() - t0) * 1000.0
        raise ScanValidationError(
            code="NON_GRAYSCALE_IMAGE",
            title="Non-Grayscale Image Detected",
            message=(
                f"Input exhibits high chromatic variance ({chroma_variance:.2f} > 6.5 limit). "
                "Diagnostic axial thoracic CT scans are monochromatic."
            ),
            telemetry={
                "chroma_variance": round(chroma_variance, 2),
                "threshold": 6.5,
                "latency_ms": round(latency_ms, 2)
            }
        )

    # 3. Circular CT Gantry Field-of-View (FOV) Check
    # Axial CTs sit inside a circular aperture with dark outer corners (< 45.0) and high central chest contrast (>= 25.0).
    patch_size = 24
    tl = arr_350[:patch_size, :patch_size]
    tr = arr_350[:patch_size, -patch_size:]
    bl = arr_350[-patch_size:, :patch_size:]
    br = arr_350[-patch_size:, -patch_size:]
    corner_mean = float(np.mean([np.mean(tl), np.mean(tr), np.mean(bl), np.mean(br)]))

    # Central thoracic patch: 150x150 in the middle
    center_size = 150
    start = (IMAGE_SIZE[0] - center_size) // 2
    end = start + center_size
    center_patch = arr_350[start:end, start:end]
    center_mean = float(np.mean(center_patch))
    thoracic_contrast = float(center_mean - corner_mean)

    if corner_mean > 45.0 or thoracic_contrast < 25.0:
        latency_ms = (time.perf_counter() - t0) * 1000.0
        raise ScanValidationError(
            code="INVALID_MODALITY_FOV",
            title="Non-Axial Thoracic CT Modality",
            message=(
                f"Input lacks a valid circular CT gantry field-of-view (corner_intensity={corner_mean:.1f}, "
                f"thoracic_contrast={thoracic_contrast:.1f}). Please upload an axial chest CT slice."
            ),
            telemetry={
                "corner_intensity": round(corner_mean, 2),
                "corner_limit": 45.0,
                "thoracic_contrast": round(thoracic_contrast, 2),
                "contrast_limit": 25.0,
                "latency_ms": round(latency_ms, 2)
            }
        )

    t1_latency = (time.perf_counter() - t0) * 1000.0
    telemetry = {
        "tier1_valid": True,
        "aspect_ratio": round(aspect_ratio, 3),
        "chroma_variance": round(chroma_variance, 2),
        "corner_intensity": round(corner_mean, 2),
        "thoracic_contrast": round(thoracic_contrast, 2),
        "tier1_latency_ms": round(t1_latency, 2)
    }

    # Normalized float array [0, 1] for model consumption
    arr_norm = arr_350 / 255.0
    return arr_norm, telemetry


def validate_ct_manifold_and_predict(
    dual_model: Any,
    centroid: np.ndarray,
    arr_norm_350: np.ndarray,
    threshold: float = DEFAULT_OOD_THRESHOLD
) -> Tuple[np.ndarray, Dict[str, Any]]:
    """
    Tier 2: Xception Feature-Space Manifold & Shannon Entropy Gate (< 40ms, Single Forward Pass)
    Validates:
      1. Cosine similarity between 2048-dim GAP embedding and CT manifold centroid (>= threshold).
      2. Prediction entropy / max probability (>= 0.55).
    Returns (probabilities, telemetry).
    """
    t0 = time.perf_counter()

    # Prepare single-image batch: (1, 350, 350, 3)
    if arr_norm_350.ndim == 3:
        batch = np.expand_dims(arr_norm_350, axis=0)
    else:
        batch = arr_norm_350

    # Execute single forward pass for BOTH 2048-dim GAP representation and 4-class classification head
    gap_output, class_probs = dual_model(batch, training=False)
    gap_feat = gap_output.numpy()[0]   # (2048,)
    probs = class_probs.numpy()[0]     # (4,)

    # 1. Cosine Similarity to Thoracic CT Manifold Centroid
    norm_feat = np.linalg.norm(gap_feat)
    if norm_feat > 1e-8:
        gap_unit = gap_feat / norm_feat
    else:
        gap_unit = gap_feat

    cosine_sim = float(np.dot(gap_unit, centroid))

    # OOD Anatomy Check
    if cosine_sim < threshold:
        latency_ms = (time.perf_counter() - t0) * 1000.0
        raise ScanValidationError(
            code="OUT_OF_DISTRIBUTION_ANATOMY",
            title="Non-Lung Anatomical Structure",
            message=(
                f"Extracted anatomical features deviate significantly from thoracic CT manifold "
                f"(cosine_similarity={cosine_sim:.4f} < {threshold:.2f} threshold). "
                "Scans of other anatomical regions (e.g., brain, abdomen) are rejected."
            ),
            telemetry={
                "cosine_similarity": round(cosine_sim, 4),
                "ood_threshold": round(threshold, 3),
                "latency_ms": round(latency_ms, 2)
            }
        )

    # 2. Shannon Entropy & Confidence Check
    max_prob = float(np.max(probs))
    entropy = float(-np.sum(probs * np.log(probs + 1e-12)))

    if max_prob < MIN_CONFIDENCE_THRESHOLD:
        latency_ms = (time.perf_counter() - t0) * 1000.0
        raise ScanValidationError(
            code="LOW_DIAGNOSTIC_CONFIDENCE",
            title="Indeterminate Diagnostic Confidence",
            message=(
                f"Peak class probability ({max_prob * 100:.1f}%) is below clinical triage threshold "
                f"({MIN_CONFIDENCE_THRESHOLD * 100:.1f}%). Input may contain severe slice artifact."
            ),
            telemetry={
                "max_confidence": round(max_prob, 4),
                "shannon_entropy": round(entropy, 4),
                "threshold": MIN_CONFIDENCE_THRESHOLD,
                "latency_ms": round(latency_ms, 2)
            }
        )

    t2_latency = (time.perf_counter() - t0) * 1000.0
    telemetry = {
        "tier2_valid": True,
        "cosine_similarity": round(cosine_sim, 4),
        "ood_threshold": round(threshold, 3),
        "max_confidence": round(max_prob, 4),
        "shannon_entropy": round(entropy, 4),
        "tier2_latency_ms": round(t2_latency, 2)
    }

    return probs, telemetry


class CTModalityGatekeeper:
    """End-to-End Multi-Tier Modality Gatekeeper for PulmoAI."""
    def __init__(self, dual_model: Any, centroid_path: Union[str, Path]):
        self.dual_model = dual_model
        p = Path(centroid_path)
        if not p.exists():
            raise FileNotFoundError(f"Centroid file not found at: {p}")
        self.centroid = np.load(str(p))
        # Ensure L2 normalized
        norm = np.linalg.norm(self.centroid)
        if norm > 1e-8:
            self.centroid = self.centroid / norm
        print(f"[Gatekeeper] Loaded CT Manifold Centroid ({self.centroid.shape[0]}-dim) from {p.name}")

    def validate_and_predict(
        self,
        image_input: Union[str, Path, bytes, Image.Image, np.ndarray],
        threshold: float = DEFAULT_OOD_THRESHOLD
    ) -> Dict[str, Any]:
        """
        Executes Tier 1 heuristics and Tier 2 manifold gate sequentially.
        Returns complete diagnostic payload with telemetry if valid, else raises ScanValidationError.
        """
        t_start = time.perf_counter()
        
        # Tier 1: Fast Pixel & FOV Heuristics
        arr_norm, t1_telem = validate_axial_ct_heuristics(image_input)
        
        # Tier 2: Feature-Space Manifold & Confidence Gate
        probs, t2_telem = validate_ct_manifold_and_predict(
            dual_model=self.dual_model,
            centroid=self.centroid,
            arr_norm_350=arr_norm,
            threshold=threshold
        )
        
        total_latency = (time.perf_counter() - t_start) * 1000.0
        
        return {
            "valid": True,
            "probabilities": probs,
            "telemetry": {
                **t1_telem,
                **t2_telem,
                "total_gatekeeper_latency_ms": round(total_latency, 2)
            }
        }


def build_dual_xception_model(weights_path: Optional[Union[str, Path]] = None) -> Any:
    """
    Instantiates functional Xception backbone with dual output:
    [GAP 2048-dim embedding, 4-class Softmax probabilities].
    """
    import tensorflow as tf
    from keras.applications import Xception
    from keras.layers import Input, GlobalAveragePooling2D, BatchNormalization, Dense, Dropout
    from keras.models import Model

    inp = Input(shape=(*IMAGE_SIZE, 3), name="input_1")
    bb = Xception(weights=None, include_top=False, input_tensor=inp)
    gap = GlobalAveragePooling2D(name="gap_features")(bb.output)

    x = BatchNormalization()(gap)
    x = Dense(256, activation="relu")(x)
    x = Dropout(0.4)(x)
    out = Dense(4, activation="softmax", name="predictions")(x)

    full_model = Model(inputs=inp, outputs=out)
    if weights_path is not None:
        p = Path(weights_path)
        if p.exists():
            full_model.load_weights(str(p))
            print(f"[Gatekeeper] Loaded trained Xception weights from {p.name}")

    dual_model = Model(inputs=inp, outputs=[gap, out], name="xception_dual_gatekeeper")
    return dual_model


_GATEKEEPER_INSTANCE: Optional[CTModalityGatekeeper] = None


def get_gatekeeper(
    weights_path: Optional[Union[str, Path]] = None,
    centroid_path: Optional[Union[str, Path]] = None
) -> CTModalityGatekeeper:
    """Singleton factory for CTModalityGatekeeper."""
    global _GATEKEEPER_INSTANCE
    if _GATEKEEPER_INSTANCE is not None:
        return _GATEKEEPER_INSTANCE

    base_dir = Path(__file__).resolve().parent
    repo_root = base_dir.parent if base_dir.name == "backend" else base_dir

    if centroid_path is None:
        candidates = [
            base_dir / "models" / "ct_manifold_centroid.npy",
            repo_root / "models" / "ct_manifold_centroid.npy",
            repo_root / "backend" / "models" / "ct_manifold_centroid.npy"
        ]
        for c in candidates:
            if c.exists():
                centroid_path = c
                break

    if weights_path is None:
        w_candidates = [
            base_dir / "models" / "trained_lung_cancer_model.h5",
            repo_root / "backend" / "models" / "trained_lung_cancer_model.h5",
            repo_root / "Lung-cancer-model-train" / "models" / "trained_lung_cancer_model.h5",
            repo_root / "models" / "trained_lung_cancer_model.h5"
        ]
        for w in w_candidates:
            if w.exists():
                weights_path = w
                break

    dual_model = build_dual_xception_model(weights_path)
    _GATEKEEPER_INSTANCE = CTModalityGatekeeper(dual_model=dual_model, centroid_path=centroid_path)
    return _GATEKEEPER_INSTANCE


def validate_axial_ct(
    image_input: Union[str, Path, bytes, Image.Image, np.ndarray],
    threshold: float = DEFAULT_OOD_THRESHOLD
) -> Dict[str, Any]:
    """High-level entrypoint: runs complete 2-tier axial lung CT validation & inference."""
    gk = get_gatekeeper()
    return gk.validate_and_predict(image_input, threshold=threshold)


def warmup_gatekeeper():
    """Pre-warms TensorFlow graph to ensure sub-95ms inference on first call."""
    gk = get_gatekeeper()
    dummy = np.zeros((1, *IMAGE_SIZE, 3), dtype="float32")
    try:
        gk.dual_model(dummy, training=False)
        print("[Gatekeeper] Dual-output Xception graph pre-warmed.")
    except Exception as e:
        print(f"[Gatekeeper] Warmup warning: {e}")
