"use client";

import { useOrderStore } from "@/store/orderStore";
import { useAdminStore } from "@/store/adminStore";
import { formatPrice } from "@/lib/utils";
import { DollarSign, ShoppingBag, Users, Package, TrendingUp, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const orders = useOrderStore((s) => s.orders);
  const products = useAdminStore((s) => s.products);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== "cancelled" ? o.total : 0), 0);
  const completedOrders = orders.filter((o) => o.status === "delivered").length;
  const pendingOrders = orders.filter((o) => o.status === "pending" || o.status === "processing").length;

  return (
    <div className="space-y-8">
      {/* Header Title */}
      <div>
        <span className="text-xs uppercase font-extrabold tracking-widest text-primary">Phân Hệ Quản Trị</span>
        <h1 className="font-display text-4xl text-white tracking-wide mt-1">
          DASHBOARD TỔNG QUAN HỆ THỐNG
        </h1>
        <p className="text-muted text-xs mt-1">
          Thống kê doanh thu, đơn hàng & hoạt động kinh doanh trực tiếp thời gian thực
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-surface border border-border rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted font-medium">Tổng doanh thu</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 flex items-center justify-center">
              <DollarSign size={20} />
            </div>
          </div>
          <h3 className="font-display text-3xl text-white">{formatPrice(totalRevenue)}</h3>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
            <TrendingUp size={12} />
            +18.5% so với tháng trước
          </span>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted font-medium">Tổng đơn hàng</span>
            <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-800/40 text-blue-400 flex items-center justify-center">
              <ShoppingBag size={20} />
            </div>
          </div>
          <h3 className="font-display text-3xl text-white">{orders.length} Đơn</h3>
          <span className="text-[11px] text-muted font-medium">
            {pendingOrders} đơn chờ xử lý
          </span>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted font-medium">Sản phẩm hiện có</span>
            <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-800/40 text-purple-400 flex items-center justify-center">
              <Package size={20} />
            </div>
          </div>
          <h3 className="font-display text-3xl text-white">{products.length} SKU</h3>
          <span className="text-[11px] text-muted font-medium">4 Danh mục chính</span>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted font-medium">Tỷ lệ giao thành công</span>
            <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-800/40 text-amber-400 flex items-center justify-center">
              <Users size={20} />
            </div>
          </div>
          <h3 className="font-display text-3xl text-white">
            {orders.length > 0 ? Math.round((completedOrders / orders.length) * 100) : 100}%
          </h3>
          <span className="text-[11px] text-muted font-medium">{completedOrders} đơn đã hoàn tất</span>
        </div>
      </div>

      {/* Simulated Chart & Sales Overview */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface border border-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-2xl text-white">BIỂU ĐỒ DOANH THU THÁNG GẦN NHẤT</h3>
            <span className="text-xs text-muted bg-surface-light border border-border px-3 py-1 rounded-full">
              Tháng 7/2026
            </span>
          </div>

          <div className="h-48 flex items-end gap-3 pt-6 pb-2 px-2 border-b border-border">
            {[45, 65, 30, 85, 95, 70, 110, 90, 120, 140, 105, 130].map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                <div
                  className="w-full bg-primary/80 hover:bg-primary rounded-t-lg transition-all group-hover:scale-y-105"
                  style={{ height: `${(val / 140) * 100}%` }}
                />
                <span className="text-[10px] text-muted">T{idx + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Best Selling */}
        <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
          <h3 className="font-display text-2xl text-white">TOP SẢN PHẨM BÁN CHẠY</h3>
          <div className="space-y-3">
            {products.slice(0, 4).map((p) => (
              <div key={p.id} className="flex items-center justify-between bg-surface-light p-3 rounded-xl border border-border/50">
                <div className="min-w-0 pr-2">
                  <h4 className="text-white text-xs font-semibold truncate">{p.name}</h4>
                  <span className="text-[11px] text-muted">{p.category}</span>
                </div>
                <span className="text-xs font-bold text-primary">{formatPrice(p.price)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-2xl text-white">ĐƠN HÀNG MỚI NHẤT</h3>
          <Link
            href="/admin/orders"
            className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
          >
            Xem tất cả đơn hàng
            <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-light text-muted uppercase border-b border-border">
                <th className="p-3">Mã đơn</th>
                <th className="p-3">Khách hàng</th>
                <th className="p-3">Ngày đặt</th>
                <th className="p-3">Tổng tiền</th>
                <th className="p-3">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-white">
              {orders.slice(0, 5).map((o) => (
                <tr key={o.id} className="hover:bg-surface-light/50 transition-colors">
                  <td className="p-3 font-bold text-primary">{o.id}</td>
                  <td className="p-3">
                    {o.customerInfo.fullName}
                    <span className="block text-[11px] text-muted">{o.customerInfo.phone}</span>
                  </td>
                  <td className="p-3 text-muted">{new Date(o.createdAt).toLocaleDateString("vi-VN")}</td>
                  <td className="p-3 font-bold">{formatPrice(o.total)}</td>
                  <td className="p-3">
                    <span className="bg-primary/20 text-primary px-3 py-1 rounded-full font-bold uppercase text-[10px]">
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
