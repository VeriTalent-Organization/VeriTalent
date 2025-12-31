'use client';

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { userTypes } from "@/types/user_type";
import { removeAuthTokenCookie } from "@/lib/utils/cookieUtils";

export interface User {
  user_type: userTypes;
  available_roles?: ('talent' | 'recruiter' | 'org_admin')[]; // All roles user has access to

  // Common
  full_name: string;
  email: string;
  password?: string; // Optional after registration (for security)
  country: string;
  has_agreed_to_terms: boolean;

  // Recruiter-specific
  professional_status?: string;
  current_designation?: string;
  organisation_name?: string;

  // Organization-specific
  organization_name?: string;
  organization_domain?: string;
  organization_linkedin_page?: string;
  organisation_size?: string;
  organisation_rc_number?: string;
  organisation_industry?: string;
  organisation_location?: string;

  // Talent-specific
  veritalent_id?: string;
  linked_emails?: string[];
  linkedin_connected?: boolean;
  cv_uploaded?: boolean;
  talentProfile?: {
    _id?: string;
    user?: string;
    careerObjective?: string;
    education?: string[];
    workExperience?: string[];
    skills?: Array<{ skill: string; level: string; source: string }>;
    bio?: string;
    accomplishments?: string[];
    aiFitScore?: number;
    careerSignalStrength?: number;
    matchedRoles?: string[];
    skillGaps?: string[];
    growthRecommendations?: string;
    educationSummary?: string;
    isPublic?: boolean;
    shareableLink?: string;
    createdAt?: string;
    updatedAt?: string;
  };

  // Auth
  token: string | null;

  // Backend profile data (from /users/me)
  id?: string;
  primary_email?: string;
  location?: string;
  roles?: ('talent' | 'recruiter' | 'org_admin')[];
  active_role?: 'talent' | 'recruiter' | 'org_admin';
  profile_fetched?: boolean; // Flag to track if profile has been fetched
  is_switching_role?: boolean; // Flag to prevent redirect during role switch
}

interface UserStore {
  user: User; // Always an object during onboarding and after login
  _hasHydrated: boolean; // Track if store has hydrated from localStorage
  setUser: (data: Partial<User> | User) => void;
  updateUser: (data: Partial<User>) => void;
  logout: () => void;
  resetForm: () => void;
  setHasHydrated: (state: boolean) => void;
}

const initialFormState: User = {
  user_type: userTypes.TALENT,
  full_name: "",
  email: "",
  password: "",
  country: "",
  has_agreed_to_terms: false,
  professional_status: "",
  current_designation: "",
  organisation_name: "",
  organization_name: "",
  organization_domain: "",
  organization_linkedin_page: "",
  organisation_size: "",
  organisation_rc_number: "",
  organisation_industry: "",
  organisation_location: "",
  token: null,
};

export const useCreateUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: initialFormState,
      _hasHydrated: false,
      setUser: (data) =>
        set(() => ({
          user: { ...initialFormState, ...(data as Partial<User>) },
        })),
      updateUser: (data) =>
        set((state) => ({
          user: { ...state.user, ...data },
        })),
      logout: () => {
        // Clear auth token cookie
        removeAuthTokenCookie();
        // Reset store to initial state
        return set({
          user: initialFormState,
        });
      },
      resetForm: () =>
        set((state) => ({
          user: {
            ...initialFormState,
            user_type: state.user.user_type,
            token: state.user.token,
            full_name: state.user.full_name,
            email: state.user.email,
          },
        })),
      setHasHydrated: (state: boolean) => {
        set({
          _hasHydrated: state,
        });
      },
    }),
    {
      name: "veritalent-user-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      // ✅ Correct storage type for TypeScript
      storage: {
        getItem: (name: string) => {
          const item = localStorage.getItem(name)
          return item ? JSON.parse(item) : null
        },
        setItem: (name: string, value: unknown) => {
          localStorage.setItem(name, JSON.stringify(value))
        },
        removeItem: (name: string) => {
          localStorage.removeItem(name)
        },
      },
    }
  )
)