# Database Schema for MetaGuard

This document outlines the database schemas for the MetaGuard project.

## File: [`metaguard_backend/files/models.py`](metaguard_backend/files/models.py)

### 1. **FileAnalysis**
- **user**: ForeignKey to User (CASCADE)
- **file_name**: CharField (max_length=255)
- **file_type**: CharField (max_length=50)
- **file_size**: BigIntegerField
- **sha256_before**: CharField (max_length=64)
- **sha256_after**: CharField (max_length=64, nullable, blank)
- **metadata_raw**: JSONField (nullable, blank, default=dict)
- **metadata_removed**: JSONField (nullable, blank, default=dict)
- **risk_level**: CharField (choices: Low, Medium, High)
- **scanned_at**: DateTimeField (auto_now_add)
- **cleaned_at**: DateTimeField (nullable, blank)
- **updated_at**: DateTimeField (auto_now)

### 2. **MetadataField**
- **analysis**: ForeignKey to FileAnalysis (CASCADE)
- **tag**: CharField (max_length=255)
- **value**: TextField
- **category**: CharField (choices: location, personal, device, software, other)
- **risk_level**: CharField (choices: Low, Medium, High)
- **removed**: BooleanField (default=False)

### 3. **UserMetadataPolicy**
- **user**: OneToOneField to User (CASCADE)
- **remove_location**: BooleanField (default=True)
- **remove_device**: BooleanField (default=True)
- **remove_software**: BooleanField (default=False)
- **remove_personal**: BooleanField (default=True)
- **created_at**: DateTimeField (auto_now_add, nullable)
- **updated_at**: DateTimeField (auto_now)

## File: [`metaguard_backend/accounts/models.py`](metaguard_backend/accounts/models.py)
- No models defined yet.

## File: [`metaguard_backend/api/models.py`](metaguard_backend/api/models.py)
- No models defined yet.

## User Login and Authentication

The MetaGuard project uses Django's built-in `User` model for authentication. The user login process is handled via Google OAuth and traditional email/password signup. Below are the details:

### User Model (Django Default)
- **username**: CharField (used as email)
- **email**: EmailField
- **password**: CharField (hashed)
- **first_name**: CharField (optional)
- **last_name**: CharField (optional)
- **is_active**: BooleanField (default=True)
- **is_staff**: BooleanField (default=False)
- **is_superuser**: BooleanField (default=False)
- **last_login**: DateTimeField (nullable)
- **date_joined**: DateTimeField (auto_now_add)

### Authentication Flow
1. **Google OAuth Login**:
   - The frontend sends a Google OAuth token to the backend.
   - The backend verifies the token using Google's API and retrieves the user's email.
   - A user is created or retrieved based on the email, and a JWT token is generated for authentication.

2. **Email/Password Signup**:
   - The user provides an email and password.
   - A new user is created in the database, and a JWT token is generated for authentication.

3. **JWT Authentication**:
   - The backend uses `rest_framework_simplejwt` for JWT-based authentication.
   - The `access` token is used for authenticated requests, and the `refresh` token is used to obtain a new access token when it expires.

### API Endpoints
- **Google Auth**: `POST /api/auth/google/`
- **Signup**: `POST /api/auth/signup/`
- **Current User**: `GET /api/auth/me/` (requires authentication)

These schemas and authentication details define the structure and flow of user login and data management in the MetaGuard project.