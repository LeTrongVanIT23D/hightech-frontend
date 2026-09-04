"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Ticket,
  ArrowLeft,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { showToast } from "@/components/Toast";

const adminNav = [
  { name: "Tổng quan Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Quản lý sản phẩm", href: "/admin/products", icon: Package },
  { name: "Quản lý đơn hàng", href: "/admin/orders", icon: ShoppingBag },
  { name: "Quản lý khách hàng", href: "/admin/users", icon: Users },
  { name: "Mã giảm giá (Vouchers)", href: "/admin/vouchers", icon: Ticket },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    showToast("Đã đăng xuất", "Hẹn gặp lại bạn!", "info");
    router.replace("/login");
  };

  return (
    <aside className="w-64 bg-surface border-r border-border min-h-screen flex flex-col justify-between p-4 shrink-0">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-3 py-4 border-b border-border mb-6">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center font-black text-white text-lg">
            H
          </div>
          <div>
            <span className="font-display text-xl tracking-wider text-white block leading-none">
              ADMIN CENTER
            </span>
            <span className="text-[10px] text-primary font-bold tracking-widest uppercase">
              HIGHTECH SPORTS
            </span>
          </div>
        </div>

        {/* Admin Nav links */}
        <nav className="space-y-1">
          {adminNav.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-muted hover:text-white hover:bg-surface-light"
                }`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Back to Client Store Link & Logout */}
      <div className="border-t border-border pt-4 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-3 text-xs font-semibold text-muted hover:text-white hover:bg-surface-light rounded-xl transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Về cửa hàng chính</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-3 text-xs font-semibold text-red-400 hover:text-white hover:bg-red-950/40 rounded-xl transition-colors"
        >
          <LogOut size={16} />
          <span>Đăng xuất Admin</span>
        </button>
      </div>
    </aside>
  );
}
