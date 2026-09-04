import type { Metadata } from "next";
import AdminSidebar from "@/components/AdminSidebar";

export const metadata: Metadata = {
  title: "Admin Dashboard | HIGHTECH Sports",
  description: "Trang Quản Trị Hệ Thống E-Commerce HIGHTECH Sports",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex text-foreground">
      <AdminSidebar />
      <div className="flex-1 min-w-0 overflow-y-auto p-6 md:p-10">
        {children}
      </div>
    </div>
  );
}
