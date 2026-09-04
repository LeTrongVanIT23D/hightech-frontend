"use client";

import { useState } from "react";
import { Plus, Ticket, Trash2, X, Check } from "lucide-react";
import { useAdminStore } from "@/store/adminStore";
import { formatPrice } from "@/lib/utils";
import { showToast } from "@/components/Toast";

export default function AdminVouchersPage() {
  const { vouchers, addVoucher, toggleVoucher, deleteVoucher } = useAdminStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [code, setCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(10);
  const [minSubtotal, setMinSubtotal] = useState(500000);
  const [description, setDescription] = useState("");

  const handleAddVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    addVoucher({
      code: code.toUpperCase(),
      discountPercent,
      minSubtotal,
      description: description || `Giảm ${discountPercent}% cho đơn hàng từ ${formatPrice(minSubtotal)}`,
      expiryDate: "2026-12-31",
      isActive: true,
    });

    showToast("Thêm Voucher thành công!", code.toUpperCase(), "success");
    setModalOpen(false);
    setCode("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-primary">Quản Lý Khuyến Mãi</span>
          <h1 className="font-display text-4xl text-white tracking-wide mt-1">
            DANH SÁCH VOUCHER / COUPON ({vouchers.length})
          </h1>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-primary/25"
        >
          <Plus size={16} />
          Tạo Mã Mới
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {vouchers.map((v) => (
          <div key={v.code} className="bg-surface border border-border rounded-2xl p-6 space-y-4 relative">
            <div className="flex items-center justify-between">
              <span className="font-display text-2xl text-primary tracking-wider">{v.code}</span>
              <button
                onClick={() => toggleVoucher(v.code)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                  v.isActive ? "bg-emerald-950 text-emerald-400 border border-emerald-800" : "bg-red-950 text-red-400 border border-red-800"
                }`}
              >
                {v.isActive ? "Đang kích hoạt" : "Đã khóa"}
              </button>
            </div>

            <div className="space-y-1 text-xs text-muted">
              <p className="text-white font-semibold">Giảm: {v.discountPercent}%</p>
              <p>Đơn tối thiểu: {formatPrice(v.minSubtotal)}</p>
              <p className="pt-2">{v.description}</p>
            </div>

            <div className="pt-4 border-t border-border flex justify-end">
              <button
                onClick={() => {
                  deleteVoucher(v.code);
                  showToast("Đã xóa Voucher", v.code, "info");
                }}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                <Trash2 size={14} />
                Xóa mã
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setModalOpen(false)} />
          <div className="relative w-full max-w-md bg-surface border border-border rounded-2xl p-6 md:p-8 z-10 space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h3 className="font-display text-2xl text-white">TẠO MÃ GIẢM GIÁ MỚI</h3>
              <button onClick={() => setModalOpen(false)} className="text-muted hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddVoucher} className="space-y-4 text-xs">
              <div>
                <label className="text-muted block mb-1 font-medium">Mã Coupon (VD: SPORT50) *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="HIGHTECH20"
                  className="w-full bg-surface-light border border-border rounded-xl px-4 py-3 text-white uppercase focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-muted block mb-1 font-medium">% Giảm giá *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={100}
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className="w-full bg-surface-light border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-muted block mb-1 font-medium">Đơn tối thiểu (VND) *</label>
                  <input
                    type="number"
                    required
                    value={minSubtotal}
                    onChange={(e) => setMinSubtotal(Number(e.target.value))}
                    className="w-full bg-surface-light border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-muted block mb-1 font-medium">Mô tả ngắn</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Giảm 20% cho đơn hàng thể thao"
                  className="w-full bg-surface-light border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-6 py-2.5 bg-surface-light text-white rounded-full font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-primary text-white rounded-full font-bold uppercase tracking-wider flex items-center gap-1"
                >
                  <Check size={16} />
                  Tạo Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
