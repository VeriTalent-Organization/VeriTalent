import AuthGuard from "@/components/guards/AuthGuard";
import DashboardClientWrapper from "@/components/Dashboard/DashboardClientWrapper";
import StoreHydration from "@/components/layout/StoreHydration";
import { serverUsersService } from "@/lib/services/serverApiClient";
import type { UserMeResponseDto } from "@/lib/services/usersService";

/**
 * Server-side dashboard layout
 * Fetches user profile data server-side for authenticated users
 */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Fetch user profile on server side for authenticated dashboard pages
  const userDataResponse = await serverUsersService.getMe();
  const userData = (userDataResponse?.success ? userDataResponse.data : null) as UserMeResponseDto | null;

  return (
    <AuthGuard>
      {/* Hydrate store with fresh user data */}
      <StoreHydration userData={userData} />
      <DashboardClientWrapper>{children}</DashboardClientWrapper>
    </AuthGuard>
  );
}