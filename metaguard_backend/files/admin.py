from django.contrib import admin
from .models import FileAnalysis, MetadataField, UserMetadataPolicy


@admin.register(FileAnalysis)
class FileAnalysisAdmin(admin.ModelAdmin):
    """
    🔒 Admin interface for FileAnalysis with user isolation
    ✅ Shows user-specific data
    ✅ Displays all metadata, hashes, and timestamps
    """
    list_display = [
        'file_name',
        'user',
        'file_type',
        'risk_level',
        'scanned_at',
        'cleaned_at',
        'sha256_before',
    ]
    list_filter = ['user', 'risk_level', 'scanned_at', 'cleaned_at']
    search_fields = ['file_name', 'user__email', 'sha256_before', 'sha256_after']
    readonly_fields = [
        'user',
        'sha256_before',
        'sha256_after',
        'scanned_at',
        'cleaned_at',
        'updated_at',
        'metadata_raw',
        'metadata_removed',
    ]
    fieldsets = (
        ('File Info', {
            'fields': ('user', 'file_name', 'file_type', 'file_size')
        }),
        ('Security', {
            'fields': ('risk_level', 'sha256_before', 'sha256_after')
        }),
        ('Metadata', {
            'fields': ('metadata_raw', 'metadata_removed'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('scanned_at', 'cleaned_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(MetadataField)
class MetadataFieldAdmin(admin.ModelAdmin):
    """
    📊 Admin interface for individual metadata fields
    """
    list_display = ['tag', 'category', 'risk_level', 'removed', 'analysis']
    list_filter = ['category', 'risk_level', 'removed', 'analysis__user']
    search_fields = ['tag', 'value', 'analysis__file_name']
    readonly_fields = ['analysis', 'tag', 'value']


@admin.register(UserMetadataPolicy)
class UserMetadataPolicyAdmin(admin.ModelAdmin):
    """
    🛡️ Admin interface for user metadata removal policies
    ✅ Each user's custom policy
    """
    list_display = [
        'user',
        'remove_location',
        'remove_device',
        'remove_software',
        'remove_personal',
        'updated_at',
    ]
    list_filter = ['remove_location', 'remove_device', 'remove_software', 'remove_personal']
    search_fields = ['user__email']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('User', {
            'fields': ('user',)
        }),
        ('Removal Preferences', {
            'fields': (
                'remove_location',
                'remove_device',
                'remove_software',
                'remove_personal',
            )
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
