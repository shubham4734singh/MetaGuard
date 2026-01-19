from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class FileAnalysis(models.Model):
    # 👤 USER ISOLATION - Each file belongs to one user only
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        related_name="file_analyses"
    )

    file_name = models.CharField(max_length=255)
    file_type = models.CharField(max_length=50)
    file_size = models.BigIntegerField()

    # 🔐 SHA-256 HASHES - Before and after cleaning
    sha256_before = models.CharField(max_length=64)
    sha256_after = models.CharField(max_length=64, null=True, blank=True)

    # 📊 METADATA STORAGE - Complete metadata snapshot stored as JSON
    metadata_raw = models.JSONField(null=True, blank=True, default=dict, help_text="All extracted metadata before cleaning")
    metadata_removed = models.JSONField(null=True, blank=True, default=dict, help_text="Metadata fields that were removed")

    risk_level = models.CharField(
        max_length=10,
        choices=[("Low","Low"),("Medium","Medium"),("High","High")]
    )

    # ⏰ TIMESTAMPS - Complete audit trail for this logged-in user
    scanned_at = models.DateTimeField(auto_now_add=True, help_text="When the file was scanned")
    cleaned_at = models.DateTimeField(null=True, blank=True, help_text="When the file was cleaned")
    updated_at = models.DateTimeField(auto_now=True, help_text="Last update timestamp")

    class Meta:
        ordering = ["-scanned_at"]
        # Ensure user can only see their own files
        indexes = [
            models.Index(fields=['user', '-scanned_at']),
        ]


class MetadataField(models.Model):
    analysis = models.ForeignKey(
        FileAnalysis,
        on_delete=models.CASCADE,
        related_name="metadata_fields"
    )

    tag = models.CharField(max_length=255)
    value = models.TextField()

    category = models.CharField(
        max_length=50,
        choices=[
            ("location","Location"),
            ("personal","Personal"),
            ("device","Device"),
            ("software","Software"),
            ("other","Other"),
        ]
    )

    risk_level = models.CharField(
        max_length=10,
        choices=[("Low","Low"),("Medium","Medium"),("High","High")]
    )

    removed = models.BooleanField(default=False)
    
    class Meta:
        # Index for efficient queries per user through analysis
        indexes = [
            models.Index(fields=['analysis', 'category']),
        ]


class UserMetadataPolicy(models.Model):
    """
    🛡️ CUSTOM POLICIES - Each user can define their own metadata removal rules
    """
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE,
        related_name="metadata_policy"
    )

    # User's custom removal preferences
    remove_location = models.BooleanField(default=True)
    remove_device = models.BooleanField(default=True)
    remove_software = models.BooleanField(default=False)
    remove_personal = models.BooleanField(default=True)

    # Policy metadata
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Policy for {self.user.email}"
