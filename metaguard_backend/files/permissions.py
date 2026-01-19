# files/permissions.py
from rest_framework.permissions import BasePermission
from .models import FileAnalysis

MAX_GUEST_UPLOADS = 1
MAX_GUEST_FILE_SIZE = 10 * 1024 * 1024  # 10MB


def enforce_guest_limits(request, uploaded_file):
    session = request.session

    # Upload count
    uploads = session.get("guest_uploads", 0)
    if uploads >= MAX_GUEST_UPLOADS:
        raise PermissionError("Guest upload limit reached")

    # File size
    if uploaded_file.size > MAX_GUEST_FILE_SIZE:
        raise PermissionError("File too large for guest mode")

    session["guest_uploads"] = uploads + 1
    session.modified = True


# ================================
# CUSTOM PERMISSIONS FOR SECURITY
# ================================

class IsFileOwner(BasePermission):
    """
    🔒 Custom permission: User can only access/modify their own files
    Prevents User A from seeing/accessing User B's data
    """
    
    def has_object_permission(self, request, view, obj):
        # obj must be a FileAnalysis instance
        return obj.user == request.user


class IsAuthenticatedUser(BasePermission):
    """
    🔒 Only authenticated users can access authenticated endpoints
    Prevents guest users from accessing user-specific features
    """
    
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)
