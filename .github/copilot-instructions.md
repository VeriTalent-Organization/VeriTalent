# VeriTalent AI Coding Guidelines

## Overview
VeriTalent is a Next.js 16 (App Router) application for AI-powered talent screening and verified career profiles. It supports three user roles: Talent, Independent Recruiter, and Organization, with role-based onboarding and dashboards.

## Architecture
- **Framework**: Next.js 16 with App Router (`app/` directory)
- **UI**: shadcn/ui components with Radix UI primitives, Tailwind CSS 4
- **State**: Zustand stores with persist middleware (e.g., `useCreateUserStore`)
- **Forms**: React Hook Form + Zod validation
- **Animations**: Framer Motion
- **HTTP**: Axios for API calls
- **Icons**: Lucide React

## Key Patterns
- **Role-based routing**: Redirects based on `user.user_type` (from `userTypes` enum: TALENT, INDEPENT_RECRUITER, ORGANISATION)
- **Onboarding flow**: Multi-step wizard in `app/page.tsx` using `useCreateUserStore`; steps vary by role (Talent: RolePicker + Registration + Login; Recruiter: + EmployerProfile; Org: + OrgRegistration + OrgDetails)
- **Dashboard layout**: `app/dashboard/layout.tsx` with sidebar/header, role-specific navigation in `components/Dashboard/sidebar.tsx`
- **Component composition**: `molecules/` for complex components, `ui/` for primitives
- **Custom forms**: `components/forms/form.tsx` handles dynamic field rendering with grid layouts and button positioning

## Development Workflow
- **Start dev server**: `npm run dev` (serves on localhost:3000)
- **Build**: `npm run build`
- **Start production**: `npm run start`
- **Lint**: `npm run lint` (ESLint config in `eslint.config.mjs`)
- **No tests configured** - add Jest/Vitest if needed

## Component Structure
- **UI components**: `components/ui/` - shadcn variants (e.g., `Button` with CVA)
- **Molecules**: `components/molecules/` - composite components (e.g., `CreateJobForm` using `JobFormField`)
- **Dashboard pages**: `components/Dashboard/` - page-specific components
- **Forms**: `components/forms/` - reusable form builders with `FormProps` interface
- **Reuseables**: `components/reuseables/` - shared utilities like `MaxWidthContainer`

## State Management
- **User state**: `lib/stores/form_submission_store.ts` - persisted user data with localStorage key "veritalent-user-storage"
- **Store pattern**: Use `setUser` to update, access via `useCreateUserStore().user`; `resetUser` to clear
- **Types**: Define interfaces in `types/` (e.g., `CreateUserInterface` with optional fields per role)

## Forms & Validation
- **Schema**: Zod schemas for validation (auto-generated in `form.tsx` based on fields)
- **Custom fields**: `JobFormField` component for text/select/textarea with consistent styling
- **Dynamic forms**: `FormProps` interface supports field configs with icons, dropdowns, grid layout (row/colSpan), textarea rows/maxLength
- **Button control**: `submitButtonPosition` ("left"/"center"/"right"/"full"), `showSubmitButton` to hide built-in button

## File Organization
- **Absolute imports**: `@/` prefix (configured in `tsconfig.json` paths)
- **Naming**: Directories kebab-case (e.g., `career-repository/`), files camelCase (e.g., `CreateJobForm.tsx`)
- **Types**: `types/` directory for shared interfaces (e.g., `user_type.ts` enum)
- **Configs**: `lib/configs/` for icons (`icons.config.ts`), text, hooks (`use-mobile.ts`)

## Navigation & Routing
- **Role-specific menus**: Sidebar in `sidebar.tsx` shows different items per `user.user_type`
- **Active route detection**: `isActive` function checks pathname for highlighting
- **Mobile responsive**: Overlay and transform classes for sidebar toggle

## Code Quality
- **Linting**: `npm run lint` catches unused variables, explicit `any` types, unescaped JSX entities
- **Common issues**: Remove unused imports/variables; use specific types instead of `any`; escape apostrophes in JSX
- **TypeScript**: Prefer interfaces over empty object types; define props interfaces for components

## Examples
- **Adding dashboard route**: Create `app/dashboard/new-feature/page.tsx`, add menu item to `getMenuItems()` in `sidebar.tsx`
- **New form**: Use `components/forms/form.tsx` with fields array, or `JobFormField` for simple cases
- **State update**: `useCreateUserStore.getState().setUser({ user_type: userTypes.TALENT })`
- **Role check**: `if (user.user_type === userTypes.ORGANISATION)` for conditional logic

## Additional Context
- **Product docs**: See `veriTalentProductDocument.md` and `veritalentWebcopy.md` for feature requirements and user stories
- **Onboarding steps**: Defined in `app/page.tsx` with `useMemo` based on `user.user_type`
- **Sidebar navigation**: Role-based menu items in `getMenuItems()` function
- **Form grids**: Use `row` and `colSpan` in field configs for responsive layouts
- **Icons config**: Centralized in `lib/configs/icons.config.ts`