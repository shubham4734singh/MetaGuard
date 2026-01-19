GUEST_METADATA_POLICY = {
    "remove": [
        # 🔴 Personal Identity
        "Author",
        "Creator",
        "Owner",
        "LastModifiedBy",
        "Company",
        "Manager",
        "UserComment",

        # 🔴 Location / GPS
        "GPSLatitude",
        "GPSLongitude",
        "GPSAltitude",
        "GPSPosition",
        "GPSProcessingMethod",
        "City",
        "State",
        "Country",
        "Location",
        "Sub-location",
    ],
    "keep": [
        # 🟢 Structural / Safe
        "CreateDate",
        "ModifyDate",
        "FileType",
        "FileSize",
        "MimeType",
        "ImageWidth",
        "ImageHeight",
        "ColorSpace",
        "C2PA",
    ]
}
