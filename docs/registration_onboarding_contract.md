# VeriTalent Registration + Onboarding Contract (Client → Server)

This document describes how the frontend will send onboarding-related data via the existing register endpoint, avoiding new API routes.

## Summary
- Keep `/auth/register` as the single entry point.
- Add an optional `onboarding` object in the register payload for Talent role.
- Server should accept and persist `onboarding` when present. It contains multi-email identity and CV metadata (storage-centric).
- `cv_uploaded` is not sent by client. Server derives it from presence/verification of `cv_key` in object storage.

## Payload Shape

Register payload base (already in use):
```
{
  "primaryEmail": string,
  "password": string,
  "fullName": string,
  "location": string,
  "role": "talent" | "recruiter" | "org_admin",
  "accountType": "talent" | "recruiter" | "organization",
  "organizationName"?: string,
  "organizationDomain"?: string,
  "organizationLinkedinPage"?: string,
  "organisationSize"?: string,
  "organisationRcNumber"?: string,
  "organisationIndustry"?: string,
  "organisationLocation"?: string,
  "professionalDesignation"?: string,
  "professionalStatus"?: string,
  "recruiterOrganizationName"?: string,
  "onboarding"?: OnboardingExtras // NEW (Talent only for now)
}
```

OnboardingExtras (Talent):
```
{
  "linked_emails": string[],
  "veritalent_id"?: string,
  "cv_source": "upload" | "linkedin",
  // When cv_source = "upload":
  "cv_key"?: string,
  "cv_file_name"?: string,
  "cv_mime_type"?: string,
  "cv_file_size"?: number,
  "cv_url"?: string,
  "cv_hash"?: string,
  // When cv_source = "linkedin":
  "linkedin_connected"?: boolean
}
```

Validation logic (server-side recommendation):
- If `cv_source = 'upload'`, require: `cv_key`, `cv_file_name`, `cv_mime_type`, `cv_file_size`.
- If `cv_source = 'linkedin'`, require `linkedin_connected = true`.

## Example Requests

Talent (Upload CV path):
```
POST /auth/register
Content-Type: application/json

{
  "primaryEmail": "jane@example.com",
  "password": "strongPass123",
  "fullName": "Jane Doe",
  "location": "NG",
  "role": "talent",
  "accountType": "talent",
  "onboarding": {
    "linked_emails": ["jane@example.com", "jane@institution.edu"],
    "veritalent_id": "VT/1234-AB",
    "cv_source": "upload",
    "cv_key": "cv/jane-doe/2025-12-27/resume.pdf",
    "cv_file_name": "resume.pdf",
    "cv_mime_type": "application/pdf",
    "cv_file_size": 524288,
    "cv_url": "https://storage.example.com/cv/jane-doe/2025-12-27/resume.pdf"
  }
}
```

Talent (LinkedIn path):
```
POST /auth/register
Content-Type: application/json

{
  "primaryEmail": "jane@example.com",
  "password": "strongPass123",
  "fullName": "Jane Doe",
  "location": "NG",
  "role": "talent",
  "accountType": "talent",
  "onboarding": {
    "linked_emails": ["jane@example.com"],
    "veritalent_id": "VT/1234-AB",
    "cv_source": "linkedin",
    "linkedin_connected": true
  }
}
```

## Storage Guidance
- Store CV binaries in object storage (S3/Azure Blob/GCS), not in DB.
- Persist references + metadata in DB (`cv_key`, `cv_file_name`, `cv_mime_type`, `cv_file_size`, `cv_url?`).
- Server can compute `cv_uploaded = true` if `cv_key` exists and points to a valid object.

## Server Response Suggestion
Include normalized onboarding status to simplify UI:
```
{
  "data": {
    "user": { /* identity */ },
    "access_token": "...",
    "onboarding": {
      "cv_uploaded": true,
      "profile_ready": false
    }
  }
}
```

## Notes
- Frontend currently does not send `onboarding` to the backend to avoid breaking changes. When the backend is ready, we will include it in the register request.
- Existing frontend validation schemas live in `types/onboarding_dto.ts` and can be reused server-side for parity.
