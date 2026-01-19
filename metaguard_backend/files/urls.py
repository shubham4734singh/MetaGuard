from django.urls import path
from .views import (
    guest_analyze_metadata, 
    guest_clean_metadata,
    user_file_history,
    user_metadata_policy,
    analyze_metadata_authenticated,
    clean_metadata_authenticated,
)

urlpatterns = [
    # 👥 GUEST ENDPOINTS (No login required)
    path("guest/analyze/", guest_analyze_metadata),
    path("guest/clean/", guest_clean_metadata),
    
    # 🔒 AUTHENTICATED ENDPOINTS (Login required)
    path("user/history/", user_file_history, name="user_file_history"),
    path("user/policy/", user_metadata_policy, name="user_metadata_policy"),
    path("user/analyze/", analyze_metadata_authenticated, name="user_analyze"),
    path("user/clean/", clean_metadata_authenticated, name="user_clean"),
]
