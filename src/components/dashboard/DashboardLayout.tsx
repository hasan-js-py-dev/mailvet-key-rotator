import { TopNavLayout } from "@/components/dashboard/TopNavLayout";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return <TopNavLayout>{children}</TopNavLayout>;
};