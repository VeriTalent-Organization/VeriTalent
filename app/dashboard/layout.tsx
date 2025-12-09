import DashboardHeader from "@/components/Dashboard/header";
import Sidebar from "@/components/Dashboard/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
       <div className="flex-1 overflow-auto">
        <DashboardHeader />
        {children}
      </div>
    </div>
  );
}
