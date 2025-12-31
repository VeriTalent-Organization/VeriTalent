# Understanding user_type and Multi-Role System

## Overview

Yes, you're absolutely correct! A user can register as (and switch between) 3 different role types. The backend stores this as a **string array**, but the frontend tracks both the **active role** and **all available roles**.

## Architecture

### Backend Structure
```json
{
  "roles": ["talent", "recruiter", "org_admin"],  // Array of all roles user has
  "activeRole": "talent"  // Currently active role
}
```

### Frontend Structure (Zustand Store)
```typescript
{
  "user_type": userTypes.TALENT,  // Current active role (enum)
  "available_roles": ["talent", "recruiter", "org_admin"]  // All roles user can switch to
}
```

## Three User Types

1. **Talent** (`talent`)
   - Job seekers
   - Can build AI cards, upload CVs, apply to jobs
   - Minimal onboarding required

2. **Independent Recruiter** (`recruiter`)
   - Individual recruiters
   - Can post jobs, screen candidates, issue recommendations
   - Requires: Professional Status, Designation, Organization Name

3. **Company Administrator** (`org_admin`)
   - Company/organization representatives
   - Can manage institutional profiles, post jobs, screen, verify references
   - Requires: Organization details (name, RC number, domain, size, industry, etc.)

## How Roles Work

### Initial Registration
When a user registers, they choose ONE role:
```typescript
// User registers as Talent
{
  "user_type": userTypes.TALENT,
  "available_roles": ["talent"]  // Only has access to talent role initially
}
```

### Adding Roles (Role Switching)
Users can switch to additional roles. When they do:

**Option 1: Direct Switch (user already completed onboarding)**
```typescript
// User already filled recruiter profile data
await authService.switchRole({ role: 'recruiter' });
// Backend: Changes activeRole from 'talent' to 'recruiter'
// Frontend: Updates user_type and adds to available_roles if needed
{
  "user_type": userTypes.INDEPENDENT_RECRUITER,
  "available_roles": ["talent", "recruiter"]  // Now has both
}
```

**Option 2: Switch with Onboarding (missing data)**
```typescript
// User hasn't filled recruiter profile data
// 1. Modal opens with EmployerProfileStep
// 2. User fills: Professional Status, Designation, etc.
// 3. Data is saved via updateRecruiterProfile()
// 4. Role is switched
// 5. Role is added to available_roles
{
  "user_type": userTypes.INDEPENDENT_RECRUITER,
  "available_roles": ["talent", "recruiter"]
}
```

## Why Two Fields?

### `user_type` (Single Value)
- **Purpose**: Tracks which role is currently active
- **Usage**: Determines dashboard UI, menu items, permissions
- **Type**: Enum (`userTypes.TALENT | userTypes.INDEPENDENT_RECRUITER | userTypes.ORGANISATION`)

### `available_roles` (Array)
- **Purpose**: Tracks all roles user has access to
- **Usage**: Shows which roles can be switched to in the sidebar
- **Type**: String array (`['talent', 'recruiter', 'org_admin']`)

## Implementation Details

### Login Flow
```typescript
// 1. Backend returns user data
const response = {
  data: {
    user: {
      activeRole: 'talent',
      roles: ['talent', 'recruiter']  // User has access to both
    }
  }
};

// 2. Frontend stores both
updateUser({
  user_type: userTypes.TALENT,  // Active role → UI display
  available_roles: ['talent', 'recruiter']  // All roles → role switcher
});
```

### Sidebar Role Switcher
```typescript
// Only show roles that:
// 1. User has access to (in available_roles array)
// 2. Are not the current active role
const availableRoles = [
  { value: 'talent', label: 'Talent' },
  { value: 'recruiter', label: 'Independent Recruiter' },
  { value: 'org_admin', label: 'Company Administrator' }
].filter(role => {
  const hasAccess = user.available_roles?.includes(role.value);
  const isNotCurrent = role.value !== currentActiveRole;
  return hasAccess && isNotCurrent;
});

// If user only has ['talent'], no role switcher is shown
// If user has ['talent', 'recruiter'], can switch between them
```

### Adding New Roles
```typescript
// When user completes onboarding for a new role
const currentRoles = user.available_roles || [];
const newRoles = currentRoles.includes(targetRole)
  ? currentRoles
  : [...currentRoles, targetRole];

updateUser({
  user_type: newUserType,  // Switch to new role
  available_roles: newRoles  // Add to available roles
});
```

## Benefits of This Approach

✅ **Separation of Concerns**
- `user_type`: What the user is doing NOW
- `available_roles`: What the user CAN do

✅ **Better UX**
- Only show role switching options if user has multiple roles
- Prevent attempting to switch to roles user doesn't have access to

✅ **Accurate State**
- Frontend reflects backend's role array
- No assumptions about what roles exist

✅ **Flexible**
- Easy to add 4th, 5th role types in future
- Backend is source of truth for role access

## Example Scenarios

### Scenario 1: New Talent User
```json
{
  "user_type": "TALENT",
  "available_roles": ["talent"]
}
```
Result: No role switcher shown (only 1 role)

### Scenario 2: Talent Switches to Recruiter
```json
// Before
{
  "user_type": "TALENT",
  "available_roles": ["talent"]
}

// After completing recruiter onboarding
{
  "user_type": "INDEPENDENT_RECRUITER",
  "available_roles": ["talent", "recruiter"]
}
```
Result: Can now switch between Talent and Recruiter

### Scenario 3: Power User with All Roles
```json
{
  "user_type": "ORGANISATION",
  "available_roles": ["talent", "recruiter", "org_admin"]
}
```
Result: Can switch between all 3 role types

## Backend Contract

The backend should:

1. **Store roles as array**:
   ```typescript
   user.roles = ['talent', 'recruiter', 'org_admin'];
   ```

2. **Track active role**:
   ```typescript
   user.activeRole = 'talent';
   ```

3. **POST /auth/switch-role** should:
   - Update `activeRole` to the new role
   - NOT add to roles array (that happens when user completes onboarding)
   - Return success/failure

4. **Role addition** happens via:
   - User completes role-specific onboarding
   - Backend validates data
   - Backend adds role to `roles` array
   - Backend switches `activeRole` to new role

## Summary

| Aspect | Backend | Frontend |
|--------|---------|----------|
| **All Roles** | `roles: []` (array) | `available_roles: []` (array) |
| **Active Role** | `activeRole: string` | `user_type: enum` |
| **Storage** | Database | Zustand + LocalStorage |
| **Purpose** | Permissions & access | UI rendering & navigation |

This design ensures the frontend accurately reflects the backend's role system while providing a smooth user experience for role switching.
