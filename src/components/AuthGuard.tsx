"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { showToast } from "@/components/Toast";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const currentUser = useAuthStore((s) => s.currentUser);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // If user tries to access /profile without login
    if (!currentUser && pathname.startsWith("/profile")) {
      router.replace("/login");
      return;
    }

    // If user tries to access /admin
    if (pathname.startsWith("/admin")) {
      if (!currentUser) {
        router.replace("/login");
        return;
      }
      if (currentUser.role !== "admin") {
        showToast("Từ chối truy cập", "Bạn cần đăng nhập bằng tài khoản Admin để vào trang quản trị!", "error");
        router.replace("/profile");
        return;
      }
    }

    // If already logged in and visiting /login, redirect to /
    if (currentUser && pathname === "/login") {
      router.replace(currentUser.role === "admin" ? "/admin" : "/");
      return;
    }
  }, [mounted, currentUser, pathname, router]);

  // If accessing a protected route without login, show clean redirect indicator
  if (mounted && !currentUser && (pathname.startsWith("/profile") || pathname.startsWith("/admin"))) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm text-muted">Đang chuyển hướng tới trang Đăng nhập...</p>
      </div>
    );
  }

  return <>{children}</>;
}
