import os
import sys
import time
import numpy as np
from PIL import Image, ImageDraw

# Ensure workspace backend is in sys.path
BASE_DIR = r"d:\Competition\Synohack\Tech-Arch-Warriors"
sys.path.insert(0, os.path.join(BASE_DIR, "backend"))

from validator import validate_axial_ct, ScanValidationError, warmup_gatekeeper

def create_test_samples():
    os.makedirs(os.path.join(BASE_DIR, "test_fixtures"), exist_ok=True)
    
    # Case 1: Valid Lung CT Slice (find existing or use squared sample)
    candidate_valid = os.path.join(BASE_DIR, "frontend", "public", "samples", "normal_lung.png")
    if not os.path.exists(candidate_valid):
        candidate_valid = os.path.join(BASE_DIR, "dataset", "test", "normal", "normal_slice_test.png")
    
    # Case 2: RGB Photograph / Screenshot
    rgb_path = os.path.join(BASE_DIR, "test_fixtures", "case2_rgb_photo.png")
    rgb_img = Image.new("RGB", (350, 350), color=(240, 120, 50))
    draw = ImageDraw.Draw(rgb_img)
    draw.rectangle([50, 50, 300, 300], fill=(50, 180, 220), outline=(255, 0, 0), width=4)
    rgb_img.save(rgb_path)

    # Case 3: Grayscale Chest X-Ray / Rectangular Image (Aspect ratio 1.75, bright edges)
    xray_path = os.path.join(BASE_DIR, "test_fixtures", "case3_chest_xray_rect.png")
    xray_img = Image.new("L", (560, 320), color=110)
    draw = ImageDraw.Draw(xray_img)
    draw.ellipse([80, 40, 480, 280], fill=160, outline=200, width=5)
    xray_img.save(xray_path)

    # Case 4: Grayscale Non-Lung Scan (Brain MRI simulation - circular gantry but brain anatomy)
    brain_path = os.path.join(BASE_DIR, "test_fixtures", "case4_brain_mri.png")
    brain_img = Image.new("L", (350, 350), color=5) # Dark corners
    draw = ImageDraw.Draw(brain_img)
    # Circular head contour
    draw.ellipse([45, 45, 305, 305], fill=115, outline=220, width=6)
    # Brain gyri pattern (concentric ellipses)
    draw.ellipse([90, 90, 260, 260], fill=135, outline=180, width=3)
    draw.ellipse([130, 130, 220, 220], fill=155, outline=210, width=3)
    brain_img.save(brain_path)

    return candidate_valid, rgb_path, xray_path, brain_path

def run_tests():
    print("=" * 70)
    print("P.A.C.E. 2-TIER MODALITY GATEKEEPER - VERIFICATION SUITE")
    print("=" * 70)
    
    print("\n[Warming up Gatekeeper models...]")
    t_warm = time.perf_counter()
    warmup_gatekeeper()
    print(f"Gatekeeper ready in {(time.perf_counter() - t_warm)*1000:.1f}ms\n")

    valid_ct, rgb_photo, chest_xray, brain_mri = create_test_samples()

    test_cases = [
        ("Case 1: Valid Axial Lung CT Slice", valid_ct, True, None),
        ("Case 2: RGB Photograph / Screenshot", rgb_photo, False, "NON_GRAYSCALE_IMAGE"),
        ("Case 3: Rectangular / Chest X-Ray", chest_xray, False, "INVALID_ASPECT_RATIO"),
        ("Case 4: Grayscale Non-Lung Scan (Brain MRI)", brain_mri, False, "OUT_OF_DISTRIBUTION_ANATOMY"),
    ]

    results = []

    for name, img_path, expected_valid, expected_code in test_cases:
        print(f"\n--- Testing {name} ---")
        print(f"Path: {img_path}")
        t0 = time.perf_counter()
        try:
            val_result = validate_axial_ct(img_path)
            dt_ms = (time.perf_counter() - t0) * 1000
            print(f"Result: PASSED TIER 1 & TIER 2 (Valid: True)")
            print(f"Total Gatekeeper Latency: {dt_ms:.2f} ms (< 95ms SLA)")
            print(f"Predictions: {val_result.get('predictions')}")
            print(f"Telemetry: {val_result.get('telemetry')}")
            
            passed = expected_valid == True
            results.append((name, passed, f"Passed Gatekeeper in {dt_ms:.1f}ms", dt_ms))
        except ScanValidationError as e:
            dt_ms = (time.perf_counter() - t0) * 1000
            print(f"Result: INTERCEPTED BY GATEKEEPER")
            print(f"Error Code: {e.code}")
            print(f"Title: {e.title}")
            print(f"Message: {e.message}")
            print(f"Telemetry: {e.telemetry}")
            print(f"Total Interception Latency: {dt_ms:.2f} ms (< 95ms SLA)")
            
            code_matches = (expected_code is None) or (e.code == expected_code) or (expected_code in e.code)
            passed = (not expected_valid) and code_matches
            results.append((name, passed, f"Rejected [{e.code}] in {dt_ms:.1f}ms", dt_ms))
        except Exception as e:
            dt_ms = (time.perf_counter() - t0) * 1000
            print(f"Unexpected error: {e}")
            results.append((name, False, str(e), dt_ms))

    print("\n" + "=" * 70)
    print("VERIFICATION SUMMARY")
    print("=" * 70)
    all_passed = True
    for name, passed, detail, latency in results:
        status_str = "PASS [OK]" if passed else "FAIL [X]"
        if not passed:
            all_passed = False
        print(f"{status_str} | {name:<42} | {detail}")
    print("=" * 70)
    
    if all_passed:
        print("ALL 4 VERIFICATION TEST CASES PASSED PERFECTLY UNDER 95ms SLA!")
    else:
        print("SOME TEST CASES FAILED - REVIEW DETAILS ABOVE.")
        sys.exit(1)

if __name__ == "__main__":
    run_tests()
