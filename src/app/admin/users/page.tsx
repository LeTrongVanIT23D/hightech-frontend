"use client";

import { User, Shield, CheckCircle, Mail, Phone, MapPin } from "lucide-react";

const mockUsers = [
  { id: "U-001", name: "Nguyễn Văn An", email: "an.nguyen@gmail.com", phone: "0905123456", role: "Khách hàng", ordersCount: 5, totalSpent: 12500000 },
  { id: "U-002", name: "Trần Thị Minh", email: "minh.tran@gmail.com", phone: "0914987654", role: "Khách hàng", ordersCount: 2, totalSpent: 5980000 },
  { id: "U-003", name: "Admin HIGHTECH", email: "admin@hightech.vn", phone: "19001234", role: "Quản trị viên (Admin)", ordersCount: 0, totalSpent: 0 },
];

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs uppercase font-extrabold tracking-widest text-primary">Quản Lý Người Dùng</span>
        <h1 className="font-display text-4xl text-white tracking-wide mt-1">
          DANH SÁCH KHÁCH HÀNG & TÀI KHOẢN ({mockUsers.length})
        </h1>
      </div>

      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-light text-muted uppercase border-b border-border">
                <th className="p-4">Mã User</th>
                <th className="p-4">Họ và tên</th>
                <th className="p-4">Email / SĐT</th>
                <th className="p-4">Vai trò</th>
                <th className="p-4">Đơn hàng đã mua</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-white">
              {mockUsers.map((u) => (
                <tr key={u.id} className="hover:bg-surface-light/40 transition-colors">
                  <td className="p-4 font-bold text-primary">{u.id}</td>
                  <td className="p-4 font-semibold text-sm">{u.name}</td>
                  <td className="p-4 text-muted">
                    <div>{u.email}</div>
                    <div>{u.phone}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full font-bold uppercase text-[10px] ${u.role.includes("Admin") ? "bg-primary text-white" : "bg-surface-light text-muted"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4">{u.ordersCount} đơn</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
