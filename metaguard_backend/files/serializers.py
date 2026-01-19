from rest_framework import serializers
from .models import FileAnalysis, MetadataField, UserMetadataPolicy


class MetadataFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = MetadataField
        fields = ['id', 'tag', 'value', 'category', 'risk_level', 'removed']


class FileAnalysisSerializer(serializers.ModelSerializer):
    """
    ✅ Serialize FileAnalysis with all metadata, hashes, and timestamps
    ✅ User can only see their own files
    """
    metadata_fields = MetadataFieldSerializer(many=True, read_only=True)

    class Meta:
        model = FileAnalysis
        fields = [
            'id',
            'file_name',
            'file_type',
            'file_size',
            'risk_level',
            'sha256_before',
            'sha256_after',
            'metadata_raw',
            'metadata_removed',
            'metadata_fields',
            'scanned_at',
            'cleaned_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'sha256_before',
            'sha256_after',
            'metadata_raw',
            'metadata_removed',
            'scanned_at',
            'cleaned_at',
            'updated_at',
        ]


class UserMetadataPolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserMetadataPolicy
        fields = [
            'remove_location',
            'remove_device',
            'remove_software',
            'remove_personal',
            'created_at',
            'updated_at',
        ]
