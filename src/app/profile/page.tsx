"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  Package,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  MapPin,
  Phone,
  Mail,
  Heart,
  LogOut,
  Edit3,
  ShieldCheck,
  Save,
  X,
  ExternalLink,
} from "lucide-react";
import { useOrderStore, OrderStatus } from "@/store/orderStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAuthStore } from "@/store/authStore";
import { formatPrice } from "@/lib/utils";
import { showToast } from "@/components/Toast";

const statusSteps: Record<OrderStatus, { label: string; icon: any }> = {
  pending: { label: "Chờ xác nhận", icon: Clock },
  processing: { label: "Đang xử lý", icon: Package },
  shipping: { label: "Đang giao hàng", icon: Truck },
  delivered: { label: "Đã giao thành công", icon: CheckCircle2 },
  cancelled: { label: "Đã hủy", icon: XCircle },
};

export default function ProfilePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"orders" | "profile" | "wishlist">("profile");

  const orders = useOrderStore((s) => s.orders);
  const wishlist = useWishlistStore((s) => s.items);
  const { currentUser, logout, updateProfile } = useAuthStore();

  // Edit profile state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    setMounted(true);
    if (currentUser) {
      setEditForm({
        name: currentUser.name || "",
        phone: currentUser.phone || "",
        address: currentUser.address || "",
      });
    }
  }, [currentUser]);

  if (!mounted) return null;

  if (!currentUser) {
    return null;
  }

  const handleLogout = () => {
    logout();
    showToast("Đã đăng xuất", "Hẹn gặp lại bạn!", "info");
    router.replace("/login");
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.name.trim()) {
      showToast("Lỗi", "Họ và tên không được để trống!", "error");
      return;
    }

    const res = updateProfile({
      name: editForm.name.trim(),
      phone: editForm.phone.trim(),
      address: editForm.address.trim(),
    });

    if (res.success) {
      showToast("Thành công", res.message, "success");
      setIsEditing(false);
    } else {
      showToast("Thất bại", res.message, "error");
    }
  };

  const isAdmin = currentUser.role === "admin";

  return (
    <main className="min-h-screen bg-background pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-border/50 pb-6">
          <div>
            <div className="flex items-center gap-2">
              {isAdmin ? (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary text-white shadow-md shadow-primary/30">
                  <ShieldCheck size={14} /> Quản Trị Viên (Admin)
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-surface-light border border-border text-muted">
                  Khách hàng thành viên
                </span>
              )}
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-white tracking-wide mt-2">
              HỒ SƠ TÀI KHOẢN
            </h1>
            <p className="text-muted text-sm mt-1">
              Xin chào, <strong className="text-white">{currentUser.name}</strong> ({currentUser.email})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* If Admin, show link to Admin Dashboard */}
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-2 bg-primary/20 hover:bg-primary border border-primary/50 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md"
              >
                <ShieldCheck size={16} />
                <span>Trang Quản Trị Hệ Thống</span>
                <ExternalLink size={14} />
              </Link>
            )}

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-950/40 hover:bg-red-900/60 border border-red-800/60 text-red-300 hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md"
            >
              <LogOut size={16} />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center bg-surface border border-border rounded-xl p-1 gap-1 w-fit mb-8">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "profile" ? "bg-primary text-white" : "text-muted hover:text-white"
            }`}
          >
            <User size={16} />
            Thông tin cá nhân
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "orders" ? "bg-primary text-white" : "text-muted hover:text-white"
            }`}
          >
            <Package size={16} />
            Đơn hàng ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab("wishlist")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "wishlist" ? "bg-primary text-white" : "text-muted hover:text-white"
            }`}
          >
            <Heart size={16} />
            Yêu thích ({wishlist.length})
          </button>
        </div>

        {/* Tab 1: Profile Info & Edit */}
        {activeTab === "profile" && (
          <div className="max-w-3xl bg-surface border border-border rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="font-display text-2xl text-white">THÔNG TIN CÁ NHÂN</h3>
                <p className="text-xs text-muted">Xem và chỉnh sửa thông tin tài khoản của bạn</p>
              </div>

              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 bg-surface-light hover:bg-primary border border-border hover:border-primary text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors"
                >
                  <Edit3 size={15} />
                  <span>Chỉnh sửa thông tin</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditForm({
                      name: currentUser.name || "",
                      phone: currentUser.phone || "",
                      address: currentUser.address || "",
                    });
                  }}
                  className="flex items-center gap-1.5 text-muted hover:text-white text-xs font-semibold"
                >
                  <X size={16} />
                  <span>Hủy bỏ</span>
                </button>
              )}
            </div>

            {!isEditing ? (
              /* View Mode */
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-4 bg-surface-light p-4 rounded-xl border border-border/50">
                  <User className="text-primary shrink-0" size={22} />
                  <div className="flex-1">
                    <span className="text-xs text-muted block">Họ và tên</span>
                    <strong className="text-white text-base">{currentUser.name}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-surface-light p-4 rounded-xl border border-border/50">
                  <Mail className="text-primary shrink-0" size={22} />
                  <div className="flex-1">
                    <span className="text-xs text-muted block">Email tài khoản</span>
                    <strong className="text-white text-base">{currentUser.email}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-surface-light p-4 rounded-xl border border-border/50">
                  <Phone className="text-primary shrink-0" size={22} />
                  <div className="flex-1">
                    <span className="text-xs text-muted block">Số điện thoại</span>
                    <strong className="text-white text-base">
                      {currentUser.phone || <span className="text-muted italic">Chưa cập nhật</span>}
                    </strong>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-surface-light p-4 rounded-xl border border-border/50">
                  <MapPin className="text-primary shrink-0" size={22} />
                  <div className="flex-1">
                    <span className="text-xs text-muted block">Địa chỉ nhận hàng</span>
                    <strong className="text-white text-base">
                      {currentUser.address || <span className="text-muted italic">Chưa cập nhật</span>}
                    </strong>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-surface-light p-4 rounded-xl border border-border/50">
                  <ShieldCheck className={isAdmin ? "text-primary shrink-0" : "text-muted shrink-0"} size={22} />
                  <div className="flex-1">
                    <span className="text-xs text-muted block">Vai trò trong hệ thống</span>
                    <strong className={isAdmin ? "text-primary text-base font-bold" : "text-white text-base"}>
                      {isAdmin ? "Quản trị viên (Admin Toàn Quyền)" : "Khách hàng người dùng"}
                    </strong>
                  </div>
                </div>
              </div>
            ) : (
              /* Edit Mode */
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="text-xs text-muted block mb-1.5 font-medium">Họ và tên *</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full bg-surface-light border border-border rounded-xl px-4 py-3 text-white text-sm focus:border-primary focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-muted block mb-1.5 font-medium">Email (Không thể thay đổi)</label>
                  <input
                    type="email"
                    value={currentUser.email}
                    disabled
                    className="w-full bg-surface-light/50 border border-border/50 rounded-xl px-4 py-3 text-muted text-sm cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted block mb-1.5 font-medium">Số điện thoại</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    placeholder="0905 123 456"
                    className="w-full bg-surface-light border border-border rounded-xl px-4 py-3 text-white text-sm focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted block mb-1.5 font-medium">Địa chỉ giao hàng</label>
                  <input
                    type="text"
                    value={editForm.address}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    placeholder="Ví dụ: 456 Lê Duẩn, Đà Nẵng"
                    className="w-full bg-surface-light border border-border rounded-xl px-4 py-3 text-white text-sm focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full text-xs font-bold uppercase transition-all shadow-lg shadow-primary/30"
                  >
                    <Save size={16} />
                    <span>Lưu thay đổi</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-surface-light hover:bg-surface border border-border text-muted hover:text-white px-5 py-3 rounded-full text-xs font-semibold transition-colors"
                  >
                    Hủy bỏ
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Tab 2: Orders List & Tracking */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="bg-surface border border-border rounded-2xl p-12 text-center">
                <Package size={48} className="text-muted mx-auto mb-4" />
                <h3 className="text-white text-lg font-semibold">Bạn chưa có đơn hàng nào</h3>
                <p className="text-muted text-xs mt-1">Hãy mua sắm sản phẩm thể thao ngay hôm nay!</p>
                <Link
                  href="/shop"
                  className="mt-6 inline-block bg-primary text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase"
                >
                  Đến cửa hàng
                </Link>
              </div>
            ) : (
              orders.map((order) => {
                const currentStatus = statusSteps[order.status];
                const StatusIcon = currentStatus.icon;

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-surface border border-border rounded-2xl p-6 space-y-6 shadow-xl"
                  >
                    {/* Order Top Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-display text-2xl text-white">{order.id}</h3>
                          <span className="bg-surface-light border border-border text-xs px-3 py-1 rounded-full text-muted">
                            {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                        <p className="text-xs text-muted mt-1">
                          Mã vận đơn: <strong className="text-primary">{order.trackingCode}</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                            order.status === "delivered"
                              ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/40"
                              : order.status === "cancelled"
                              ? "bg-red-950/80 text-primary border border-red-800/40"
                              : "bg-amber-950/80 text-amber-400 border border-amber-800/40"
                          }`}
                        >
                          <StatusIcon size={14} />
                          {currentStatus.label}
                        </span>
                      </div>
                    </div>

                    {/* Order Timeline Visual */}
                    {order.status !== "cancelled" && (
                      <div className="bg-surface-light p-4 rounded-xl border border-border/50">
                        <span className="text-[11px] text-muted font-semibold uppercase tracking-wider block mb-3">
                          Hành trình vận chuyển (Order Tracking Timeline)
                        </span>
                        <div className="grid grid-cols-4 gap-2 text-center">
                          {(["pending", "processing", "shipping", "delivered"] as OrderStatus[]).map(
                            (stepKey, idx) => {
                              const step = statusSteps[stepKey];
                              const isPassed =
                                ["pending", "processing", "shipping", "delivered"].indexOf(order.status) >= idx;

                              return (
                                <div key={stepKey} className="relative">
                                  <div
                                    className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center text-xs font-bold transition-all ${
                                      isPassed
                                        ? "bg-primary text-white shadow-md shadow-primary/40"
                                        : "bg-surface text-muted border border-border"
                                    }`}
                                  >
                                    {idx + 1}
                                  </div>
                                  <span
                                    className={`text-[11px] font-medium block mt-2 ${
                                      isPassed ? "text-white" : "text-muted"
                                    }`}
                                  >
                                    {step.label}
                                  </span>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}

                    {/* Order Products */}
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div
                          key={`${item.id}-${item.size}-${item.color}`}
                          className="flex items-center gap-4 bg-surface-light p-3 rounded-xl border border-border/40"
                        >
                          <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-surface shrink-0">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white text-sm font-semibold truncate">{item.name}</h4>
                            <p className="text-xs text-muted">
                              Size: {item.size} • Màu: {item.color} • Số lượng: x{item.quantity}
                            </p>
                          </div>
                          <span className="text-sm font-bold text-white">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Order Footer Total */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-border/60 text-xs">
                      <div className="text-muted">
                        <span>Giao đến: </span>
                        <strong className="text-white">
                          {order.customerInfo.fullName} ({order.customerInfo.address}, {order.customerInfo.city})
                        </strong>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-muted">Tổng tiền thanh toán:</span>
                        <span className="font-bold text-xl text-primary">{formatPrice(order.total)}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 3: Wishlist View */}
        {activeTab === "wishlist" && (
          <div>
            {wishlist.length === 0 ? (
              <div className="bg-surface border border-border rounded-2xl p-12 text-center">
                <Heart size={48} className="text-muted mx-auto mb-4" />
                <h3 className="text-white text-lg font-semibold">Danh sách yêu thích đang trống</h3>
                <p className="text-muted text-xs mt-1">Hãy bấm icon thả tim sản phẩm bạn yêu thích!</p>
                <Link
                  href="/shop"
                  className="mt-6 inline-block bg-primary text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase"
                >
                  Khám phá ngay
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {wishlist.map((product) => (
                  <div
                    key={product.id}
                    className="bg-surface border border-border rounded-2xl p-4 flex flex-col justify-between"
                  >
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-surface-light mb-3">
                      <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm truncate">{product.name}</h4>
                      <p className="text-primary font-bold text-sm mt-1">{formatPrice(product.price)}</p>
                    </div>
                    <Link
                      href={`/product/${product.id}`}
                      className="mt-4 bg-primary text-white text-center py-2 rounded-full text-xs font-bold uppercase"
                    >
                      Xem sản phẩm
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
