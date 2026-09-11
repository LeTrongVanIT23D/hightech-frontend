import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ToastContainer from "@/components/Toast";
import CartDrawer from "@/components/CartDrawer";
import QuickViewModal from "@/components/QuickViewModal";
import SizeGuideModal from "@/components/SizeGuideModal";

import AuthGuard from "@/components/AuthGuard";

export const metadata: Metadata = {
  title: "HIGHTECH Sports | Đồ Thể Thao Cao Cấp & Thời Trang Thể Thao",
  description:
    "Hệ thống mua sắm trang thiết bị & thời trang thể thao cao cấp chính hãng. Giày chạy bộ, áo tập luyện, phụ kiện thể thao phong cách Nike/Adidas.",
  keywords: "thể thao, giày thể thao, áo thể thao, phụ kiện thể thao, hightech sports, nike, adidas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full antialiased" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans" suppressHydrationWarning>
        <AuthGuard>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthGuard>

        {/* Global UI Components */}
        <ToastContainer />
        <CartDrawer />
        <QuickViewModal />
        <SizeGuideModal />
      </body>
    </html>
  );
}
