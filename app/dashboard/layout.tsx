import AuthGuard from "@/components/guards/AuthGuard";
import DashboardClientWrapper from "@/components/Dashboard/DashboardClientWrapper";

/**
 * Server-side dashboard layout
 * User authentication and profile fetching is handled in the root layout
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <DashboardClientWrapper>{children}</DashboardClientWrapper>
    </AuthGuard>
  );
}