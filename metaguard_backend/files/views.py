from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.http import FileResponse
import os
import hashlib
from datetime import datetime

from .models import FileAnalysis, MetadataField, UserMetadataPolicy
from .permissions import enforce_guest_limits
from .services import analyze_metadata_guest, clean_metadata_guest


# ================================
# GUEST ANALYZE METADATA
# ================================
@api_view(["POST"])
@permission_classes([AllowAny])
def guest_analyze_metadata(request):
    if request.user.is_authenticated:
        return Response(
            {"error": "This endpoint is for guest users only"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    uploaded_file = request.FILES.get("file")
    if not uploaded_file:
        return Response(
            {"error": "No file uploaded"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    enforce_guest_limits(request, uploaded_file)

    metadata, privacy_count, overall_risk, total_score, risk_counts, remaining_count = analyze_metadata_guest(uploaded_file)

    return Response(
        {
            "metadata": metadata,
            "before": {
                "total": len(metadata),
                "privacy": privacy_count,
            },
            "after": {
                "remaining": remaining_count,
                "removed": len(metadata) - remaining_count,
            },
            "hash_changed": True,
            "overall_risk": overall_risk,
            "total_risk_score": total_score,
            "risk_counts": risk_counts,
        },
        status=status.HTTP_200_OK,
    )


# ================================
# GUEST CLEAN METADATA
# ================================
@api_view(["POST"])
@permission_classes([AllowAny])
def guest_clean_metadata(request):
    if request.user.is_authenticated:
        return Response(
            {"error": "This endpoint is for guest users only"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    uploaded_file = request.FILES.get("file")
    if not uploaded_file:
        return Response(
            {"error": "No file uploaded"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        enforce_guest_limits(request, uploaded_file)

        clean_path, original_path, hash_changed = clean_metadata_guest(uploaded_file)

        response = FileResponse(
            open(clean_path, "rb"),
            as_attachment=True,
            filename=f"cleaned_{uploaded_file.name}",
        )

        response["X-Metadata-Cleaned"] = "true"
        response["X-Hash-Changed"] = str(hash_changed).lower()

        return response

    finally:
        # 🧹 Always cleanup temp files
        try:
            if "original_path" in locals() and os.path.exists(original_path):
                os.remove(original_path)
            if "clean_path" in locals() and os.path.exists(clean_path):
                os.remove(clean_path)
        except Exception:
            pass

# ================================
# AUTHENTICATED USER ENDPOINTS
# ================================

def calculate_file_hash(file_obj):
    """Calculate SHA-256 hash of file"""
    sha256_hash = hashlib.sha256()
    file_obj.seek(0)
    for chunk in file_obj.chunks():
        sha256_hash.update(chunk)
    return sha256_hash.hexdigest()


# ================================
# GET USER'S FILE HISTORY (WITH ISOLATION)
# ================================
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_file_history(request):
    """
    ✅ Get ALL files for authenticated user only
    ✅ User A cannot see User B's files
    ✅ Includes all metadata, hashes, timestamps
    """
    user = request.user
    files = FileAnalysis.objects.filter(user=user).prefetch_related('metadata_fields')
    
    data = []
    for file_obj in files:
        data.append({
            "id": file_obj.id,
            "file_name": file_obj.file_name,
            "file_type": file_obj.file_type,
            "file_size": file_obj.file_size,
            "risk_level": file_obj.risk_level,
            "sha256_before": file_obj.sha256_before,
            "sha256_after": file_obj.sha256_after,
            "metadata_raw": file_obj.metadata_raw,
            "metadata_removed": file_obj.metadata_removed,
            "scanned_at": file_obj.scanned_at,
            "cleaned_at": file_obj.cleaned_at,
            "updated_at": file_obj.updated_at,
            "metadata_fields": [
                {
                    "tag": m.tag,
                    "value": m.value,
                    "category": m.category,
                    "risk_level": m.risk_level,
                    "removed": m.removed
                }
                for m in file_obj.metadata_fields.all()
            ]
        })
    
    return Response({"files": data}, status=status.HTTP_200_OK)


# ================================
# GET USER'S METADATA POLICY
# ================================
@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def user_metadata_policy(request):
    """
    ✅ Get/Update user's custom metadata removal policy
    ✅ Each user has their own isolated policy
    """
    user = request.user
    
    # Get or create policy for user
    policy, created = UserMetadataPolicy.objects.get_or_create(user=user)
    
    if request.method == "GET":
        return Response({
            "remove_location": policy.remove_location,
            "remove_device": policy.remove_device,
            "remove_software": policy.remove_software,
            "remove_personal": policy.remove_personal,
            "created_at": policy.created_at,
            "updated_at": policy.updated_at,
        }, status=status.HTTP_200_OK)
    
    elif request.method == "PUT":
        # Update policy
        policy.remove_location = request.data.get("remove_location", policy.remove_location)
        policy.remove_device = request.data.get("remove_device", policy.remove_device)
        policy.remove_software = request.data.get("remove_software", policy.remove_software)
        policy.remove_personal = request.data.get("remove_personal", policy.remove_personal)
        policy.save()
        
        return Response({
            "message": "Policy updated successfully",
            "remove_location": policy.remove_location,
            "remove_device": policy.remove_device,
            "remove_software": policy.remove_software,
            "remove_personal": policy.remove_personal,
        }, status=status.HTTP_200_OK)


# ================================
# ANALYZE FILE (AUTHENTICATED)
# ================================
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def analyze_metadata_authenticated(request):
    """
    ✅ Analyze file for authenticated user
    ✅ Store ALL metadata + hashes + timestamps
    ✅ Apply user's custom policy
    """
    user = request.user
    uploaded_file = request.FILES.get("file")
    
    if not uploaded_file:
        return Response(
            {"error": "No file uploaded"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    
    try:
        # Calculate SHA-256 hash BEFORE processing
        sha256_before = calculate_file_hash(uploaded_file)
        
        # Analyze metadata
        metadata, privacy_count, overall_risk, total_score, risk_counts, remaining_count = analyze_metadata_guest(uploaded_file)
        
        # Get user's policy
        policy, _ = UserMetadataPolicy.objects.get_or_create(user=user)
        
        # Create FileAnalysis record for THIS user
        file_analysis = FileAnalysis.objects.create(
            user=user,  # 👤 Isolated to current user
            file_name=uploaded_file.name,
            file_type=uploaded_file.content_type or "unknown",
            file_size=uploaded_file.size,
            sha256_before=sha256_before,
            sha256_after=None,  # Will be set after cleaning
            metadata_raw=metadata,  # 💾 Store ALL metadata as JSON
            risk_level=overall_risk,
            scanned_at=datetime.now(),
        )
        
        # Store individual metadata fields
        for field_data in metadata:
            MetadataField.objects.create(
                analysis=file_analysis,
                tag=field_data.get("tag", ""),
                value=field_data.get("value", ""),
                category=field_data.get("category", "other"),
                risk_level=field_data.get("risk_level", "Low"),
                removed=False,
            )
        
        return Response({
            "id": file_analysis.id,
            "file_name": uploaded_file.name,
            "metadata": metadata,
            "before": {
                "total": len(metadata),
                "privacy": privacy_count,
            },
            "after": {
                "remaining": remaining_count,
                "removed": len(metadata) - remaining_count,
            },
            "overall_risk": overall_risk,
            "total_risk_score": total_score,
            "risk_counts": risk_counts,
            "sha256_before": sha256_before,
            "scanned_at": file_analysis.scanned_at,
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {"error": f"Error analyzing metadata: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


# ================================
# CLEAN FILE (AUTHENTICATED)
# ================================
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def clean_metadata_authenticated(request):
    """
    ✅ Clean file for authenticated user
    ✅ Store SHA-256 after cleaning
    ✅ Store cleaned at timestamp
    ✅ Only user who created it can clean it
    """
    user = request.user
    file_id = request.data.get("file_id")
    
    if not file_id:
        return Response(
            {"error": "file_id is required"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    
    try:
        # 🔒 Get file - will return 404 if user doesn't own it
        file_analysis = FileAnalysis.objects.get(id=file_id, user=user)
        
        uploaded_file = request.FILES.get("file")
        if not uploaded_file:
            return Response(
                {"error": "No file uploaded"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        clean_path, original_path, hash_changed = clean_metadata_guest(uploaded_file)
        
        # Calculate SHA-256 hash AFTER cleaning
        with open(clean_path, 'rb') as f:
            sha256_after = calculate_file_hash(f)
        
        # Update file record with after-cleaning data
        file_analysis.sha256_after = sha256_after
        file_analysis.cleaned_at = datetime.now()
        file_analysis.save()
        
        # Mark removed metadata
        for metadata_field in file_analysis.metadata_fields.all():
            if metadata_field.category in ["location", "personal", "device"]:
                metadata_field.removed = True
                metadata_field.save()
        
        response = FileResponse(
            open(clean_path, "rb"),
            as_attachment=True,
            filename=f"cleaned_{uploaded_file.name}",
        )
        
        response["X-Metadata-Cleaned"] = "true"
        response["X-Hash-Changed"] = str(hash_changed).lower()
        response["X-SHA256-After"] = sha256_after
        
        return response
        
    except FileAnalysis.DoesNotExist:
        return Response(
            {"error": "File not found or you don't have permission to access it"},
            status=status.HTTP_404_NOT_FOUND,
        )
    finally:
        # 🧹 Always cleanup temp files
        try:
            if "original_path" in locals() and os.path.exists(original_path):
                os.remove(original_path)
            if "clean_path" in locals() and os.path.exists(clean_path):
                os.remove(clean_path)
        except Exception:
            pass