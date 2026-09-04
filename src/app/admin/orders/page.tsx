"use client";

import { useState } from "react";
import Image from "next/image";
import { useOrderStore, OrderStatus } from "@/store/orderStore";
import { formatPrice } from "@/lib/utils";
import { showToast } from "@/components/Toast";
import { Clock, Package, Truck, CheckCircle2, XCircle } from "lucide-react";

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useOrderStore();
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredOrders = orders.filter(
    (o) => filterStatus === "all" || o.status === filterStatus
  );

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    showToast("Cập nhật trạng thái đơn thành công!", `Đơn hàng ${orderId} -> ${newStatus}`, "success");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs uppercase font-extrabold tracking-widest text-primary">Quản Lý Đơn Hàng</span>
        <h1 className="font-display text-4xl text-white tracking-wide mt-1">
          DANH SÁCH ĐƠN HÀNG ({orders.length})
        </h1>
      </div>

      {/* Filter Status Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {["all", "pending", "processing", "shipping", "delivered", "cancelled"].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all whitespace-nowrap ${
              filterStatus === st
                ? "bg-primary text-white"
                : "bg-surface text-muted hover:text-white border border-border"
            }`}
          >
            {st === "all" ? "Tất cả đơn" : st}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-light text-muted uppercase border-b border-border">
                <th className="p-4">Mã Đơn / Tracking</th>
                <th className="p-4">Khách hàng / SĐT</th>
                <th className="p-4">Sản phẩm</th>
                <th className="p-4">Tổng tiền</th>
                <th className="p-4">PT Thanh toán</th>
                <th className="p-4">Cập nhật trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-white">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-surface-light/40 transition-colors">
                  <td className="p-4">
                    <span className="font-bold text-primary text-sm block">{order.id}</span>
                    <span className="text-[11px] text-muted">{order.trackingCode}</span>
                  </td>

                  <td className="p-4">
                    <strong className="block text-white">{order.customerInfo.fullName}</strong>
                    <span className="text-muted">{order.customerInfo.phone}</span>
                  </td>

                  <td className="p-4">
                    <div className="space-y-1 max-w-xs">
                      {order.items.map((item) => (
                        <div key={`${item.id}-${item.size}-${item.color}`} className="text-[11px] text-muted truncate">
                          • {item.name} ({item.size}) x{item.quantity}
                        </div>
                      ))}
                    </div>
                  </td>

                  <td className="p-4 font-bold text-sm text-white">{formatPrice(order.total)}</td>

                  <td className="p-4 text-muted uppercase font-semibold text-[10px]">
                    {order.paymentMethod}
                  </td>

                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className="bg-surface-light border border-border text-white text-xs font-bold px-3 py-2 rounded-xl focus:outline-none focus:border-primary"
                    >
                      <option value="pending">Chờ xác nhận (pending)</option>
                      <option value="processing">Đang xử lý (processing)</option>
                      <option value="shipping">Đang giao (shipping)</option>
                      <option value="delivered">Đã giao (delivered)</option>
                      <option value="cancelled">Đã hủy (cancelled)</option>
                    </select>
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
