import subprocess
import tempfile
import json
import os
import hashlib
import re
from typing import List, Dict, Tuple
from .policies import GUEST_METADATA_POLICY


EXIFTOOL_PATH = r"C:\exiftool\exiftool.exe"

# ================================
# REGEX & HEURISTICS
# ================================

EMAIL_REGEX = re.compile(r"[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}")
PHONE_REGEX = re.compile(r"\b\d{10,15}\b")
HUMAN_NAME_REGEX = re.compile(r"\b[A-Z][a-z]{2,}(?:\s[A-Z][a-z]{2,}){0,3}\b")

NAME_FIELD_HINTS = [
    "name", "author", "creator", "artist", "owner",
    "user", "account", "profile", "contact", "person",
    "byline", "photographer", "subject"
]

DEVICE_HINTS = [
    "make", "model", "lens", "camera",
    "device", "hostcomputer", "software"
]

TIME_HINTS = [
    "createdate", "modifydate", "datetime",
    "datecreated", "timestamp", "subsectime"
]

SAFE_TECH_HINTS = [
    "depth", "portrait", "hdr", "gainmap",
    "semantic", "segmentation", "matte",
    "plist", "makernote", "icc", "colorspace",
    "matrix", "chromatic", "quicktime",
    "heic", "jpeg", "hevc", "profile"
]

# ================================
# FIELD RISK CALCULATION
# ================================
def calculate_field_risk(field: str, value: str):
    field_l = field.lower()
    value_s = str(value).strip()
    value_l = value_s.lower()

    # 🟢 HARD SAFE EXIT
    if any(x in field_l for x in SAFE_TECH_HINTS):
        return "Low", "Technical", 1.0

    # 🔴 LOCATION (ALWAYS HIGH)
    if "gps" in field_l or any(x in field_l for x in [
        "latitude", "longitude","gps","GPSLongitude", "GPSLatitude","GPS",
        "gpscoordinates", "location", "position"
    ]):
        return "High", "Location", 9.5

    # 🔴 EMAIL / PHONE
    if EMAIL_REGEX.search(value_l) or PHONE_REGEX.search(value_l):
        return "High", "Personal", 9.5

    # 🧠 NAME CONFIDENCE SCORING
    name_confidence = 0

    if any(x in field_l for x in NAME_FIELD_HINTS):
        name_confidence += 2

    if HUMAN_NAME_REGEX.search(value_s):
        name_confidence += 2

    if value_s and len(value_s) < 40 and not re.search(r"\d{3,}", value_s):
        name_confidence += 1

    if name_confidence >= 4:
        return "High", "Personal", 8.5
    elif name_confidence == 3:
        return "Medium", "Personal", 6.0
    elif name_confidence == 2:
        return "Medium", "Personal", 4.5

    # 🟠 DEVICE / SOFTWARE
    if any(x in field_l for x in DEVICE_HINTS):
        return "Medium", "Device", 4.0

    # 🟠 TIME (CONTEXT ONLY)
    if any(x in field_l for x in TIME_HINTS):
        return "Low", "Time", 2.5

    # 🟢 DEFAULT SAFE
    return "Low", "Technical", 1.0


# ================================
# OVERALL RISK
# ================================
def calculate_overall_risk(metadata: List[Dict]) -> Tuple[str, float, Dict[str, int]]:
    if not metadata:
        return "Low", 0.0, {"High": 0, "Medium": 0, "Low": 0}

    total_score = 0.0
    risk_counts = {"High": 0, "Medium": 0, "Low": 0}

    for item in metadata:
        risk_counts[item["risk"]] += 1
        total_score += item["risk_score"]

    if risk_counts["High"] >= 3:
        total_score *= 1.5
    elif risk_counts["High"] >= 2:
        total_score *= 1.3
    elif risk_counts["High"] == 1:
        total_score *= 1.1

    if risk_counts["Medium"] >= 5:
        total_score *= 1.2

    if total_score >= 25:
        return "High", round(total_score, 2), risk_counts
    elif total_score >= 10:
        return "Medium", round(total_score, 2), risk_counts
    else:
        return "Low", round(total_score, 2), risk_counts


# ================================
# ANALYZE METADATA (GUEST)
# ================================
def analyze_metadata_guest(uploaded_file):

    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        for chunk in uploaded_file.chunks():
            tmp.write(chunk)
        tmp_path = tmp.name

    try:
        result = subprocess.run(
            [EXIFTOOL_PATH, "-j", "-a", "-u", "-g1", tmp_path],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            shell=False,
        )

        raw = json.loads(result.stdout)[0]

        metadata = []
        privacy_count = 0

        for key, value in raw.items():
            if key in ["ExifTool", "SourceFile"]:
                continue

            risk, category, score = calculate_field_risk(key, value)

            if risk in ["High", "Medium"] and category in ["Personal", "Location", "Network"]:
                privacy_count += 1

            metadata.append({
                "field": key,
                "value": str(value),
                "risk": risk,
                "category": category,
                "risk_score": score,
            })

        overall_risk, total_score, risk_counts = calculate_overall_risk(metadata)

        # Simulate selective cleaning
        clean_path = tmp_path + "_clean"
        clean_args = [EXIFTOOL_PATH]

        for tag in GUEST_METADATA_POLICY["remove"]:
            clean_args.append(f"-{tag}=")

        clean_args.extend(["-o", clean_path, tmp_path])

        subprocess.run(clean_args, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

        result_clean = subprocess.run(
            [EXIFTOOL_PATH, "-j", "-a", "-u", "-g1", clean_path],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )

        remaining_count = 0
        if result_clean.stdout.strip():
            clean_meta = json.loads(result_clean.stdout)[0]
            remaining_count = len([
                k for k in clean_meta.keys()
                if k not in ["SourceFile", "ExifTool"]
            ])

        return metadata, privacy_count, overall_risk, total_score, risk_counts, remaining_count

    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
        if os.path.exists(tmp_path + "_clean"):
            os.remove(tmp_path + "_clean")


# ================================
# CLEAN METADATA (GUEST)
# ================================
def clean_metadata_guest(uploaded_file):

    with tempfile.NamedTemporaryFile(delete=False) as original:
        for chunk in uploaded_file.chunks():
            original.write(chunk)
        original_path = original.name

    with open(original_path, "rb") as f:
        original_hash = hashlib.sha256(f.read()).hexdigest()

    clean_path = original_path + "_cleaned"

    args = [EXIFTOOL_PATH]
    for tag in GUEST_METADATA_POLICY["remove"]:
        args.append(f"-{tag}=")

    args.extend(["-o", clean_path, original_path])

    subprocess.run(args, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    with open(clean_path, "rb") as f:
        new_hash = hashlib.sha256(f.read()).hexdigest()

    return clean_path, original_path, (original_hash != new_hash)
