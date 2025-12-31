# Role Switching with Onboarding

## Problem Solved
When users register as one role (e.g., Talent) and then want to switch to another role (e.g., Independent Recruiter or Company Administrator), they now complete the required onboarding steps for that role before the switch is finalized.

## Solution Overview

### New Component: `RoleSwitchOnboardingModal`
Location: `components/Dashboard/RoleSwitchOnboardingModal.tsx`

This modal intelligently handles role-switching by:
1. Detecting if the target role requires additional information
2. Displaying the appropriate onboarding forms
3. Saving the data to the backend
4. Completing the role switch

### Updated Component: `Sidebar`
Location: `components/Dashboard/sidebar.tsx`

The sidebar now:
- Checks if onboarding is needed before switching roles
- Opens the onboarding modal when required
- Performs direct role switch if user already has necessary data

## Flow Details

### Switching to Independent Recruiter
**Required Data:**
- Professional Status
- Current Designation
- Organisation Name
- Location

**Onboarding Steps:**
1. EmployerProfileStep - Collects recruiter profile information

**Check Logic:**
```typescript
needsOnboarding = newRole === 'recruiter' && !user?.professional_status
```

### Switching to Company Administrator
**Required Data:**
- Organization Name
- RC Number
- Official Email Domain
- Website/LinkedIn
- Industry
- Organisation Size
- Organisation Address

**Onboarding Steps:**
1. OrganizationRegistrationFormStep - Collects basic org info
2. OrganizationDetailsFormStep - Collects additional org details

**Check Logic:**
```typescript
needsOnboarding = newRole === 'org_admin' && !user?.organization_name
```

### Switching to Talent
**Required Data:** None (basic registration is sufficient)

**Onboarding Steps:** None - immediate role switch

## User Experience

### Scenario 1: User with Incomplete Data
1. User clicks "Switch to Independent Recruiter" in sidebar
2. System detects missing `professional_status`
3. Modal opens with EmployerProfileStep
4. User fills in required information
5. Data is saved via `authService.updateRecruiterProfile()`
6. Role is switched via `authService.switchRole()`
7. User is redirected to dashboard with new role

### Scenario 2: User with Complete Data
1. User clicks "Switch to Talent"
2. System detects no additional data needed
3. Role is switched immediately via `authService.switchRole()`
4. User is redirected to dashboard with new role

### Scenario 3: User Cancels Onboarding
1. User clicks "Switch to Company Administrator"
2. Modal opens with organization forms
3. User clicks "Cancel" or close button
4. Modal closes, role remains unchanged
5. User can try again later

## Technical Details

### State Management
The modal maintains its own state for:
- `currentStep` - Current step in the onboarding flow
- `isSubmitting` - Loading state during API calls
- `error` - Error messages to display

### Progress Tracking
- Visual progress bar shows completion percentage
- Step counter: "Step 1 of 2"
- Navigation: Back button for previous steps

### API Integration
```typescript
// Update recruiter profile
await authService.updateRecruiterProfile({
  professionalDesignation: user?.current_designation,
  recruiterOrganizationName: user?.organisation_name,
  professionalStatus: user?.professional_status || 'Recruiter',
});

// Switch role
await authService.switchRole({ role: targetRole });
```

### Data Flow
1. **Form Submission** → `updateUser()` stores data in Zustand
2. **Profile Update** → `updateRecruiterProfile()` sends to backend
3. **Role Switch** → `switchRole()` changes active role
4. **State Update** → `updateUser({ user_type })` updates local state
5. **Navigation** → `router.push('/dashboard')` redirects

## Benefits

✅ **Seamless Experience** - Users complete required forms in context
✅ **Data Integrity** - Ensures all role-specific data is collected
✅ **Flexible** - Handles all three user types with different requirements
✅ **Error Handling** - Gracefully handles API failures with user feedback
✅ **Progress Tracking** - Visual feedback on completion status
✅ **Cancellable** - Users can exit and try again later

## Future Enhancements

1. **Pre-fill Data** - Auto-populate fields with existing user data
2. **Validation** - Add client-side validation before submission
3. **Save Draft** - Allow users to save partial progress
4. **Skip Option** - Allow admin users to skip certain optional fields
5. **Role Permissions** - Validate backend permissions before allowing role switch
6. **Analytics** - Track which roles users switch to most often

## Testing Checklist

- [ ] Talent → Recruiter switch with empty profile
- [ ] Talent → Recruiter switch with existing profile
- [ ] Talent → Org Admin switch with empty profile
- [ ] Talent → Org Admin switch with existing profile
- [ ] Recruiter → Org Admin switch
- [ ] Any role → Talent switch
- [ ] Cancel modal during onboarding
- [ ] Back button navigation
- [ ] Error handling (API failures)
- [ ] Progress bar updates correctly
