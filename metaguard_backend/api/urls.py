from django.urls import path

from accounts.views import current_user
from files.views import user_file_history


urlpatterns = [
	# Authenticated profile helper (alias)
	path("api/auth/profile/", current_user),

	# File history alias to match frontend expectations
	path("api/history/", user_file_history),
]
