# VeriTalent Backend API Endpoints - IMPLEMENTED

**Document Created:** January 3, 2026
**Purpose:** List of backend endpoints that are already implemented and working
**Status:** Based on implementation_gaps.md analysis

---

## Table of Contents
1. [Authentication & Authorization](#authentication--authorization)
2. [User Management](#user-management)
3. [Profiles](#profiles)
4. [Organizations](#organizations)
5. [Jobs & Applications](#jobs--applications)
6. [References](#references)
7. [Screening](#screening)
8. [TAPI (Talent Assessment Platform Interface)](#tapi-talent-assessment-platform-interface)
9. [LPI (Learning & Performance Intelligence)](#lpi-learning--performance-intelligence)
10. [Tokens & Payments](#tokens--payments)

---

## Authentication & Authorization

### ✅ POST /auth/register
**Status:** FULLY IMPLEMENTED
**Purpose:** User registration with CV upload
**Content-Type:** multipart/form-data

**Request DTO:**
```typescript
interface RegisterRequest {
  primaryEmail: string;           // required
  password: string;               // required
  fullName: string;               // required
  location: string;               // required
  accountType: "talent" | "recruiter" | "organization"; // required
  cv_file?: File;                 // optional, binary
  cv_source?: "upload" | "linkedin"; // optional
  linkedin_connected?: boolean;   // optional
  linked_emails?: string[];       // optional, JSON array
  organizationName?: string;      // optional
  organizationDomain?: string;    // optional
  organizationLinkedinPage?: string; // optional
  organisationSize?: string;      // optional
  organisationRcNumber?: string;  // optional
  organisationIndustry?: string;  // optional
  organisationLocation?: string;  // optional
  professionalDesignation?: string; // optional
  professionalStatus?: string;    // optional
  recruiterOrganizationName?: string; // optional
}
```

**Response DTO:**
```typescript
interface RegisterResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    email: string;
    full_name: string;
    user_type: string;
    token?: string;
  };
}
```

### ✅ POST /auth/login
**Status:** FULLY IMPLEMENTED
**Purpose:** User authentication

**Request DTO:**
```typescript
interface LoginRequest {
  email: string;
  password: string;
}
```

**Response DTO:**
```typescript
interface LoginResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    email: string;
    full_name: string;
    user_type: string;
    available_roles: string[];
    active_role: string;
    token: string;
  };
}
```

### ✅ POST /auth/switch-role
**Status:** FULLY IMPLEMENTED
**Purpose:** Switch user role

**Request DTO:**
```typescript
interface SwitchRoleRequest {
  role: "talent" | "recruiter" | "org_admin";
}
```

**Response DTO:**
```typescript
interface SwitchRoleResponse {
  success: boolean;
  message: string;
  user: {
    active_role: string;
    token: string;
  };
}
```

---

## User Management

### ✅ POST /users/role/add
**Status:** FULLY IMPLEMENTED
**Purpose:** Add additional roles to user

**Request DTO:**
```typescript
interface AddRoleRequest {
  role: "talent" | "recruiter" | "org_admin";
}
```

**Response DTO:**
```typescript
interface AddRoleResponse {
  success: boolean;
  message: string;
  user: {
    available_roles: string[];
  };
}
```

### ✅ PATCH /users/email/link
**Status:** FULLY IMPLEMENTED
**Purpose:** Link additional email to user account

**Request DTO:**
```typescript
interface LinkEmailRequest {
  email: string;
}
```

**Response DTO:**
```typescript
interface LinkEmailResponse {
  success: boolean;
  message: string;
  verification_required: boolean;
}
```

### ✅ GET /users/me
**Status:** FULLY IMPLEMENTED
**Purpose:** Get current user profile

**Response DTO:**
```typescript
interface UserProfileResponse {
  id: string;
  primary_email: string;
  full_name: string;
  location: string;
  user_type: string;
  available_roles: string[];
  active_role: string;
  linked_emails: string[];
  profile_complete: boolean;
  organization_id?: string;
  created_at: string;
  updated_at: string;
}
```

### ✅ PATCH /users/recruiter/profile
**Status:** FULLY IMPLEMENTED
**Purpose:** Update recruiter profile

**Request DTO:**
```typescript
interface UpdateRecruiterProfileRequest {
  professional_title?: string;
  company?: string;
  experience_years?: number;
  specializations?: string[];
  linkedin_url?: string;
  bio?: string;
}
```

**Response DTO:**
```typescript
interface UpdateRecruiterProfileResponse {
  success: boolean;
  message: string;
  profile: object; // Updated profile data
}
```

---

## Profiles

### ✅ POST /profiles/create
**Status:** FULLY IMPLEMENTED
**Purpose:** Create user profile

**Request DTO:**
```typescript
interface CreateProfileRequest {
  bio?: string;
  skills?: string[];
  experience_years?: number;
  education?: Array<{
    institution: string;
    degree: string;
    field: string;
    graduation_year: number;
  }>;
  work_experience?: Array<{
    company: string;
    position: string;
    start_date: string;
    end_date?: string;
    description: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    issue_date: string;
    expiry_date?: string;
  }>;
}
```

**Response DTO:**
```typescript
interface CreateProfileResponse {
  success: boolean;
  message: string;
  profile: object; // Created profile data
}
```

### ✅ GET /profiles/me
**Status:** FULLY IMPLEMENTED
**Purpose:** Get user profile

**Response DTO:**
```typescript
interface GetProfileResponse {
  id: string;
  user_id: string;
  bio?: string;
  skills?: string[];
  experience_years?: number;
  education?: Array<{
    institution: string;
    degree: string;
    field: string;
    graduation_year: number;
  }>;
  work_experience?: Array<{
    company: string;
    position: string;
    start_date: string;
    end_date?: string;
    description: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    issue_date: string;
    expiry_date?: string;
  }>;
  created_at: string;
  updated_at: string;
}
```

---

## Organizations

### ✅ POST /organizations/create
**Status:** FULLY IMPLEMENTED
**Purpose:** Create organization

**Request DTO:**
```typescript
interface CreateOrganizationRequest {
  name: string;
  domain: string;
  industry: string;
  size: string;
  location: string;
  description?: string;
  website?: string;
  linkedin_page?: string;
}
```

**Response DTO:**
```typescript
interface CreateOrganizationResponse {
  success: boolean;
  message: string;
  organization: {
    id: string;
    name: string;
    domain: string;
    verification_status: "pending" | "verified" | "rejected";
  };
}
```

### ✅ GET /organizations/me
**Status:** FULLY IMPLEMENTED
**Purpose:** Get organization data

**Response DTO:**
```typescript
interface GetOrganizationResponse {
  id: string;
  name: string;
  domain: string;
  industry: string;
  size: string;
  location: string;
  description?: string;
  website?: string;
  linkedin_page?: string;
  verification_status: "pending" | "verified" | "rejected";
  verification_data?: {
    domain_verified: boolean;
    linkedin_verified: boolean;
    documents_verified: boolean;
  };
  team_members: Array<{
    user_id: string;
    full_name: string;
    email: string;
    role: string;
    status: "active" | "pending" | "inactive";
  }>;
  created_at: string;
  updated_at: string;
}
```

### ✅ POST /organizations/{id}/team/add
**Status:** FULLY IMPLEMENTED
**Purpose:** Add team members

**Request DTO:**
```typescript
interface AddTeamMemberRequest {
  email: string;
  role: "recruiter" | "org_admin";
  permissions?: string[];
}
```

**Response DTO:**
```typescript
interface AddTeamMemberResponse {
  success: boolean;
  message: string;
  invitation_id: string;
}
```

### ✅ PATCH /organizations/{id}/verify
**Status:** FULLY IMPLEMENTED
**Purpose:** Verify organization

---

## Tokens & Payments

### ✅ GET /tokens/balance
**Status:** FULLY IMPLEMENTED
**Purpose:** Get token balance

**Response DTO:**
```typescript
interface GetTokenBalanceResponse {
  personal: number;
  organizational: number;
  total_available: number;
  history: Array<{
    id: string;
    type: "purchase" | "usage" | "refund";
    amount: number;
    description: string;
    created_at: string;
  }>;
}
```

### ✅ GET /tokens/history
**Status:** FULLY IMPLEMENTED
**Purpose:** Get token history

**Query Parameters:**
- page?: number
- limit?: number
- type?: "purchase" | "usage" | "refund"

**Response DTO:**
```typescript
interface GetTokenHistoryResponse {
  transactions: Array<{
    id: string;
    type: "purchase" | "usage" | "refund";
    amount: number;
    balance_after: number;
    description: string;
    created_at: string;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
```

### ✅ POST /tokens/purchase
**Status:** FULLY IMPLEMENTED
**Purpose:** Purchase tokens

**Request DTO:**
```typescript
interface PurchaseTokensRequest {
  amount: number;
  payment_method: "card" | "bank_transfer";
  currency: "NGN" | "USD";
}
```

**Response DTO:**
```typescript
interface PurchaseTokensResponse {
  success: boolean;
  message: string;
  transaction_id: string;
  tokens_added: number;
  payment_url?: string;
}
```

---

## References

### ✅ POST /references/request
**Status:** FULLY IMPLEMENTED
**Purpose:** Create reference request

**Request DTO:**
```typescript
interface CreateReferenceRequest {
  issuer_user_id: string;
  type: "work" | "performance" | "membership" | "studentship" | "acknowledgement";
  title: string;
  message?: string;
  start_date?: string;
  end_date?: string;
}
```

**Response DTO:**
```typescript
interface CreateReferenceResponse {
  success: boolean;
  message: string;
  request_id: string;
}
```

### ✅ POST /references/issue
**Status:** FULLY IMPLEMENTED
**Purpose:** Issue reference

**Request DTO:**
```typescript
interface IssueReferenceRequest {
  talent_user_id: string;
  type: "work" | "performance" | "membership" | "studentship" | "acknowledgement";
  title: string;
  relationship_timeline: string;
  relationship_context: string;
  recommendations: string;
  start_date?: string;
  end_date?: string;
  contact_details?: {
    email: string;
    phone?: string;
  };
}
```

**Response DTO:**
```typescript
interface IssueReferenceResponse {
  success: boolean;
  message: string;
  reference_id: string;
}
```

### ✅ GET /references/my-references
**Status:** FULLY IMPLEMENTED
**Purpose:** Get references for current user

**Response DTO:**
```typescript
interface GetMyReferencesResponse {
  references: Array<{
    id: string;
    type: string;
    title: string;
    issuer_name: string;
    issuer_company: string;
    status: "pending" | "issued" | "verified";
    issued_at?: string;
    verified_at?: string;
  }>;
}
```

### ✅ GET /references/issued
**Status:** FULLY IMPLEMENTED
**Purpose:** Get references issued by current user

**Response DTO:**
```typescript
interface GetIssuedReferencesResponse {
  references: Array<{
    id: string;
    type: string;
    title: string;
    talent_name: string;
    talent_email: string;
    status: "active" | "revoked";
    issued_at: string;
  }>;
}
```

---

## Screening

### ✅ POST /screening/session/create
**Status:** FULLY IMPLEMENTED
**Purpose:** Create screening session

**Request DTO:**
```typescript
interface CreateScreeningSessionRequest {
  job_id: string;
  name: string;
  description?: string;
  criteria: {
    skills: string[];
    experience_years: number;
    education_level?: string;
    location?: string;
  };
}
```

**Response DTO:**
```typescript
interface CreateScreeningSessionResponse {
  success: boolean;
  message: string;
  session: {
    id: string;
    job_id: string;
    name: string;
    status: "active" | "completed";
    created_at: string;
  };
}
```

### ✅ GET /screening/sessions
**Status:** FULLY IMPLEMENTED
**Purpose:** Get all screening sessions

**Response DTO:**
```typescript
interface GetScreeningSessionsResponse {
  sessions: Array<{
    id: string;
    job_id: string;
    job_title: string;
    name: string;
    status: "active" | "completed";
    candidate_count: number;
    created_at: string;
  }>;
}
```

### ✅ GET /screening/session/{id}
**Status:** FULLY IMPLEMENTED
**Purpose:** Get specific screening session

**Response DTO:**
```typescript
interface GetScreeningSessionResponse {
  id: string;
  job_id: string;
  name: string;
  description?: string;
  status: "active" | "completed";
  criteria: object;
  candidates: Array<{
    id: string;
    name: string;
    email: string;
    fit_score: number;
    status: "shortlisted" | "rejected" | "pending";
    applied_at: string;
  }>;
  created_at: string;
}
```

### ✅ POST /screening/session/{id}/bulk-cv
**Status:** FULLY IMPLEMENTED
**Purpose:** Bulk CV upload for screening
**Content-Type:** multipart/form-data

**Request:** Multiple CV files

**Response DTO:**
```typescript
interface BulkCVScreeningResponse {
  success: boolean;
  message: string;
  candidates_processed: number;
  candidates_added: number;
}
```

### ✅ POST /screening/session/{id}/screen-ids
**Status:** FULLY IMPLEMENTED
**Purpose:** Screen candidates by VeriTalent IDs

**Request DTO:**
```typescript
interface ScreenByIdsRequest {
  veritalent_ids: string[];
}
```

**Response DTO:**
```typescript
interface ScreenByIdsResponse {
  success: boolean;
  message: string;
  candidates_added: number;
  failed_ids: string[];
}
```

---

## Jobs & Applications

### ✅ POST /jobs/create
**Status:** FULLY IMPLEMENTED
**Purpose:** Create job posting

**Request DTO:**
```typescript
interface CreateJobRequest {
  title: string;
  company: string;
  location: string;
  employment_type: "Full-time" | "Part-time" | "Contract" | "Internship";
  description: string;
  requirements: string;
  salary_min?: number;
  salary_max?: number;
  skills_required: string[];
  application_deadline?: string;
  contact_email?: string;
}
```

**Response DTO:**
```typescript
interface CreateJobResponse {
  success: boolean;
  message: string;
  job: {
    id: string;
    title: string;
    status: "active" | "draft";
    created_at: string;
  };
}
```

### ✅ GET /jobs/all
**Status:** FULLY IMPLEMENTED
**Purpose:** Get all jobs (feed)

**Query Parameters:**
- page?: number
- limit?: number
- search?: string
- location?: string
- employment_type?: string

**Response DTO:**
```typescript
interface GetJobsResponse {
  jobs: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    employment_type: string;
    description: string;
    posted_at: string;
    application_count: number;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
```

### ✅ GET /jobs/my-posted
**Status:** FULLY IMPLEMENTED
**Purpose:** Get jobs posted by current user

**Response DTO:**
```typescript
interface GetMyPostedJobsResponse {
  jobs: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    status: "active" | "draft" | "closed";
    application_count: number;
    created_at: string;
  }>;
}
```

### ✅ GET /jobs/recommendations
**Status:** FULLY IMPLEMENTED
**Purpose:** Get AI-matched job recommendations

**Response DTO:**
```typescript
interface GetJobRecommendationsResponse {
  jobs: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    match_score: number;
    matched_skills: string[];
    skill_gaps: string[];
    ai_insights: string;
  }>;
  user_fit_insights: {
    location?: string;
    skills?: string[];
    experience_years?: number;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
```

### ✅ GET /jobs/{id}
**Status:** FULLY IMPLEMENTED
**Purpose:** Get job details

**Response DTO:**
```typescript
interface GetJobDetailsResponse {
  id: string;
  title: string;
  company: string;
  location: string;
  employment_type: string;
  description: string;
  requirements: string;
  salary_min?: number;
  salary_max?: number;
  skills_required: string[];
  application_deadline?: string;
  posted_at: string;
  application_count: number;
  organization: {
    name: string;
    logo?: string;
    verified: boolean;
  };
}
```

### ✅ POST /jobs/apply/{id}
**Status:** FULLY IMPLEMENTED
**Purpose:** Apply for job

**Request DTO:**
```typescript
interface ApplyForJobRequest {
  cover_letter?: string;
  expected_salary?: number;
  available_from?: string;
  additional_info?: string;
}
```

**Response DTO:**
```typescript
interface ApplyForJobResponse {
  success: boolean;
  message: string;
  application_id: string;
}
```

---

## TAPI (Talent Assessment Platform Interface)

### ✅ POST /tapi/submit
**Status:** FULLY IMPLEMENTED
**Purpose:** Submit data to TAPI

**Request DTO:**
```typescript
interface TapiSubmitRequest {
  data: object;
  assessment_type: string;
  participant_id: string;
}
```

**Response DTO:**
```typescript
interface TapiSubmitResponse {
  success: boolean;
  message: string;
  submission_id: string;
  results?: object;
}
```

### ✅ POST /tapi/cohort/create
**Status:** FULLY IMPLEMENTED
**Purpose:** Create cohort

**Request DTO:**
```typescript
interface CreateCohortRequest {
  name: string;
  description?: string;
  participant_ids: string[];
  assessment_type: string;
}
```

**Response DTO:**
```typescript
interface CreateCohortResponse {
  success: boolean;
  message: string;
  cohort_id: string;
}
```

### ✅ GET /tapi/my-submissions
**Status:** FULLY IMPLEMENTED
**Purpose:** Get my submissions

**Response DTO:**
```typescript
interface GetMySubmissionsResponse {
  submissions: Array<{
    id: string;
    assessment_type: string;
    status: "pending" | "completed" | "failed";
    submitted_at: string;
    results?: object;
  }>;
}
```

### ✅ GET /tapi/cohort/{id}/report
**Status:** FULLY IMPLEMENTED
**Purpose:** Get cohort report

**Response DTO:**
```typescript
interface GetCohortReportResponse {
  cohort_id: string;
  name: string;
  participant_count: number;
  average_score?: number;
  completion_rate: number;
  individual_results: Array<{
    participant_id: string;
    score?: number;
    completed_at?: string;
    status: "completed" | "in_progress" | "not_started";
  }>;
  generated_at: string;
}
```

---

## LPI (Learning & Performance Intelligence)

### ✅ GET /api/lpi/reports
**Status:** FULLY IMPLEMENTED (Custom endpoint)
**Purpose:** Get LPI reports

**Response DTO:**
```typescript
interface GetLPIReportsResponse {
  reports: Array<{
    id: string;
    participant_id: string;
    assessment_type: string;
    score: number;
    competencies: Array<{
      name: string;
      score: number;
      level: string;
    }>;
    generated_at: string;
  }>;
}
```

### ✅ GET /api/lpi/reports-with-signals
**Status:** FULLY IMPLEMENTED (Custom endpoint)
**Purpose:** Get LPI reports with competency signals

**Response DTO:**
```typescript
interface GetLPIReportsWithSignalsResponse {
  reports: Array<{
    id: string;
    participant_id: string;
    assessment_type: string;
    score: number;
    competency_signals: Array<{
      skill: string;
      score: number;
      level: "beginner" | "intermediate" | "advanced";
      verified: boolean;
    }>;
    generated_at: string;
  }>;
}
```

---

**Summary:** These endpoints are confirmed to be implemented and working based on the implementation_gaps.md analysis. They form the core functionality of the VeriTalent platform.