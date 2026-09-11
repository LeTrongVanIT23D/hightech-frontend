"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import ImageWithFallback from "@/components/ImageWithFallback";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingBag,
  User,
  Heart,
  Menu,
  X,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAdminStore } from "@/store/adminStore";
import { useAuthStore } from "@/store/authStore";
import { formatPrice } from "@/lib/utils";

const navLinks = [
  { name: "Trang chủ", href: "/" },
  { name: "Sản phẩm", href: "/shop" },
  { name: "Giày", href: "/shop?category=giay" },
  { name: "Áo", href: "/shop?category=ao" },
  { name: "Blog Tin Tức", href: "/blog" },
  { name: "Giới thiệu", href: "/about" },
];

export default function Header() {
  const pathname = usePathname();
  const currentUser = useAuthStore((s) => s.currentUser);

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  const getItemCount = useCartStore((s) => s.getItemCount);
  const wishlistItems = useWishlistStore((s) => s.items);
  const { setCartDrawerOpen, products } = useAdminStore();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Live search auto-complete results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      )
      .slice(0, 5);
  }, [searchQuery, products]);

  if (pathname === "/login" || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      {/* Top promotional banner */}
      <div className="bg-primary text-white text-center text-xs md:text-sm py-2 font-semibold tracking-wide flex items-center justify-center gap-2">
        <span>⚡ MIỄN PHÍ VẬN CHUYỂN CHO ĐƠN HÀNG TỪ 1.000.000₫</span>
        <span className="hidden md:inline">• ÁP MÃ <strong className="underline">HIGHTECH10</strong> GIẢM 10%</span>
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "glass shadow-xl shadow-black/40 border-b border-border/50"
            : "bg-background border-b border-border/30"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 md:w-9 md:h-9 bg-primary rounded-md flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-primary/30">
                <span className="text-white font-black text-base">H</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-2xl md:text-3xl tracking-wider text-white leading-none">
                  HIGHTECH
                </span>
                <span className="text-[9px] tracking-widest text-primary font-bold uppercase">
                  SPORTSWEAR
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-7">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="relative text-sm font-medium text-gray-light/80 hover:text-white transition-colors group py-1"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Search Toggle */}
              <button
                id="search-toggle"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-gray-light/80 hover:text-white transition-colors hover:bg-white/5 rounded-full relative"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {/* Wishlist Link */}
              <Link
                href="/wishlist"
                className="p-2 text-gray-light/80 hover:text-white transition-colors hover:bg-white/5 rounded-full relative hidden sm:flex"
                title="Sản phẩm yêu thích"
              >
                <Heart size={20} />
                {mounted && wishlistItems.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                  >
                    {wishlistItems.length}
                  </motion.span>
                )}
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setCartDrawerOpen(true)}
                className="p-2 text-gray-light/80 hover:text-white transition-colors hover:bg-white/5 rounded-full relative"
                id="cart-drawer-trigger"
                title="Giỏ hàng"
              >
                <ShoppingBag size={20} />
                {mounted && getItemCount() > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md shadow-primary/50"
                  >
                    {getItemCount()}
                  </motion.span>
                )}
              </button>

              {/* User Account / Profile */}
              <Link
                href="/profile"
                className="p-2 text-gray-light/80 hover:text-white transition-colors hover:bg-white/5 rounded-full"
                title="Hồ sơ & Đơn hàng"
              >
                <User size={20} />
              </Link>

              {/* Admin Link Badge - Only visible if logged in as Admin */}
              {mounted && currentUser?.role === "admin" && (
                <Link
                  href="/admin"
                  className="hidden xl:flex items-center gap-1.5 bg-primary/20 hover:bg-primary border border-primary/50 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-all hover:scale-105 shadow-sm shadow-primary/20"
                  title="Trang Quản Trị Admin"
                >
                  <ShieldAlert size={14} className="text-primary group-hover:text-white" />
                  <span>Admin</span>
                </Link>
              )}

              {/* Mobile menu toggle */}
              <button
                id="mobile-menu-toggle"
                className="lg:hidden p-2 text-gray-light/80 hover:text-white transition-colors ml-1"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Live Search Bar Dropdown */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-border bg-surface/95 backdrop-blur-md overflow-visible relative z-50 shadow-2xl"
            >
              <div className="max-w-4xl mx-auto px-4 py-4">
                <div className="relative">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                    size={20}
                  />
                  <input
                    id="search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Nhập tên giày, áo, quần thể thao để tìm kiếm..."
                    className="w-full bg-surface-light border border-border rounded-full py-3.5 pl-12 pr-10 text-sm text-white placeholder:text-muted focus:outline-none focus:border-primary transition-colors"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-white"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* Auto-complete dropdown results */}
                {searchQuery.trim() && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 bg-surface-light border border-border rounded-2xl p-4 shadow-2xl space-y-3 max-h-96 overflow-y-auto"
                  >
                    <div className="flex items-center justify-between text-xs text-muted border-b border-border pb-2">
                      <span>KẾT QUẢ GỢI Ý ({searchResults.length})</span>
                      <Link
                        href={`/shop?search=${encodeURIComponent(searchQuery)}`}
                        onClick={() => setSearchOpen(false)}
                        className="text-primary font-semibold hover:underline"
                      >
                        Xem tất cả
                      </Link>
                    </div>

                    {searchResults.length === 0 ? (
                      <p className="text-sm text-muted text-center py-4">
                        Không tìm thấy sản phẩm phù hợp với &quot;{searchQuery}&quot;
                      </p>
                    ) : (
                      searchResults.map((item) => (
                        <Link
                          key={item.id}
                          href={`/product/${item.id}`}
                          onClick={() => {
                            setSearchOpen(false);
                            setSearchQuery("");
                          }}
                          className="flex items-center gap-4 p-2 rounded-xl hover:bg-surface transition-colors group"
                        >
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-surface shrink-0">
                            <ImageWithFallback
                              src={item.images?.[0]}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white text-sm font-semibold truncate group-hover:text-primary transition-colors">
                              {item.name}
                            </h4>
                            <p className="text-xs text-muted">{item.category}</p>
                          </div>
                          <span className="text-sm font-bold text-white shrink-0">
                            {formatPrice(item.price)}
                          </span>
                        </Link>
                      ))
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Off-canvas Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-surface z-50 lg:hidden shadow-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between p-6 border-b border-border">
                  <span className="font-display text-2xl tracking-wider text-white">
                    MENU HIGHTECH
                  </span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-gray-light/80 hover:text-white"
                  >
                    <X size={22} />
                  </button>
                </div>
                <nav className="p-6 space-y-1">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between py-3.5 text-base font-medium text-gray-light/90 hover:text-white border-b border-border/40 transition-colors"
                      >
                        {link.name}
                        <ChevronRight size={18} className="text-muted" />
                      </Link>
                    </motion.div>
                  ))}
                  <Link
                    href="/wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-3.5 text-base font-medium text-gray-light/90 hover:text-white border-b border-border/40 transition-colors"
                  >
                    Sản phẩm yêu thích ({wishlistItems.length})
                    <Heart size={18} className="text-primary" />
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-3.5 text-base font-medium text-gray-light/90 hover:text-white border-b border-border/40 transition-colors"
                  >
                    Tài khoản & Đơn hàng
                    <User size={18} className="text-muted" />
                  </Link>
                  {mounted && currentUser?.role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between py-3.5 text-base font-bold text-primary transition-colors"
                    >
                      Trang Quản Trị Admin
                      <ShieldAlert size={18} />
                    </Link>
                  )}
                </nav>
              </div>

              <div className="p-6 border-t border-border bg-surface-light text-xs text-muted text-center">
                HIGHTECH Sports &copy; 2026 - Premium E-Commerce
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
