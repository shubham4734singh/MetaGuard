from django.urls import path
from .views import current_user, google_auth, signup

urlpatterns = [
    path("user/", current_user),
    path("signup/", signup),
    path("google/", google_auth),
]
