"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Truck,
  ArrowLeft,
  Check,
  Ticket,
  Lock,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useOrderStore } from "@/store/orderStore";
import { useAdminStore } from "@/store/adminStore";
import { formatPrice } from "@/lib/utils";
import { showToast } from "@/components/Toast";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const addOrder = useOrderStore((s) => s.addOrder);
  const vouchers = useAdminStore((s) => s.vouchers);

  const [mounted, setMounted] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Đà Nẵng");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "qr_momo" | "bank_transfer" | "card">("qr_momo");

  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; percent: number } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const subtotal = getTotal();
  const discountAmount = appliedVoucher ? (subtotal * appliedVoucher.percent) / 100 : 0;
  const shippingFee = subtotal >= 1000000 ? 0 : 30000;
  const grandTotal = subtotal - discountAmount + shippingFee;

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    const found = vouchers.find(
      (v) => v.code.toUpperCase() === voucherCode.trim().toUpperCase() && v.isActive
    );
    if (found) {
      if (subtotal < found.minSubtotal) {
        showToast(
          "Chưa đủ điều kiện",
          `Đơn hàng từ ${formatPrice(found.minSubtotal)} mới được áp dụng mã ${found.code}`,
          "error"
        );
        return;
      }
      setAppliedVoucher({ code: found.code, percent: found.discountPercent });
      showToast("Áp dụng mã giảm giá thành công!", `Giảm ${found.discountPercent}%`, "success");
    } else {
      showToast("Mã giảm giá không hợp lệ", "Vui lòng kiểm tra lại mã coupon", "error");
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !address) {
      showToast("Thiếu thông tin giao hàng", "Vui lòng điền đầy đủ Họ tên, SĐT và Địa chỉ", "error");
      return;
    }

    if (items.length === 0) {
      showToast("Giỏ hàng trống", "Vui lòng thêm sản phẩm trước khi thanh toán", "error");
      return;
    }

    const createdOrder = addOrder({
      items: [...items],
      subtotal,
      discount: discountAmount,
      shippingFee,
      total: grandTotal,
      customerInfo: {
        fullName,
        phone,
        email,
        address,
        city,
        note,
      },
      paymentMethod,
    });

    clearCart();
    showToast("Đặt hàng thành công!", `Mã đơn: ${createdOrder.id}`, "success");
    router.push(`/checkout/success?orderId=${createdOrder.id}`);
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-background pt-28 pb-20">
        <div className="max-w-xl mx-auto px-4 text-center py-20">
          <div className="w-20 h-20 bg-surface-light rounded-full flex items-center justify-center mx-auto mb-6 text-muted">
            <ShieldCheck size={40} />
          </div>
          <h2 className="font-display text-3xl text-white">GIỎ HÀNG DANG TRỐNG</h2>
          <p className="text-muted text-sm mt-2">
            Bạn chưa có sản phẩm nào để tiến hành thanh toán.
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-block bg-primary text-white px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-primary-dark transition-colors"
          >
            Khám phá sản phẩm ngay
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation back */}
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-xs text-muted hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Quay lại giỏ hàng
        </Link>

        <h1 className="font-display text-4xl md:text-5xl text-white tracking-wide mb-8">
          XÁC NHẬN ĐƠN HÀNG & THANH TOÁN
        </h1>

        <form onSubmit={handleSubmitOrder} className="grid lg:grid-cols-12 gap-10">
          {/* Shipping & Payment (8 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Customer Shipping Info */}
            <div className="bg-surface border border-border rounded-2xl p-6 md:p-8 space-y-5">
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h2 className="font-display text-2xl text-white">THÔNG TIN GIAO HÀNG</h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted block mb-1.5 font-medium">Họ và tên *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Văn An"
                    className="w-full bg-surface-light border border-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted block mb-1.5 font-medium">Số điện thoại *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ví dụ: 0905123456"
                    className="w-full bg-surface-light border border-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted block mb-1.5 font-medium">Địa chỉ Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com (để nhận hóa đơn)"
                    className="w-full bg-surface-light border border-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted block mb-1.5 font-medium">Tỉnh / Thành phố *</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-surface-light border border-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="Đà Nẵng">Đà Nẵng</option>
                    <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="Hải Phòng">Hải Phòng</option>
                    <option value="Cần Thơ">Cần Thơ</option>
                    <option value="Khác">Tỉnh thành khác</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-muted block mb-1.5 font-medium">Địa chỉ giao hàng chi tiết *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                  className="w-full bg-surface-light border border-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="text-xs text-muted block mb-1.5 font-medium">Ghi chú đơn hàng (Tùy chọn)</label>
                <textarea
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ghi chú thêm về giờ giao hàng, hướng dẫn chỉ đường..."
                  className="w-full bg-surface-light border border-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>
            </div>

            {/* 2. Payment Method Options */}
            <div className="bg-surface border border-border rounded-2xl p-6 md:p-8 space-y-5">
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h2 className="font-display text-2xl text-white">PHƯƠNG THỨC THANH TOÁN</h2>
              </div>

              <div className="space-y-3">
                {/* QR Momo / Banking */}
                <label
                  onClick={() => setPaymentMethod("qr_momo")}
                  className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === "qr_momo"
                      ? "border-primary bg-primary/10 text-white"
                      : "border-border/80 bg-surface-light text-muted hover:border-white/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "qr_momo"}
                    onChange={() => setPaymentMethod("qr_momo")}
                    className="mt-1 accent-primary"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-semibold text-white text-sm">
                      <QrCode className="text-primary" size={18} />
                      Chuyển khoản QR Ngân hàng / Ví MoMo (Simulated)
                      <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                        Khuyên dùng
                      </span>
                    </div>
                    <p className="text-xs text-muted mt-1">
                      Quét mã QR để thanh toán tức thì qua ứng dụng ngân hàng hoặc MoMo.
                    </p>
                  </div>
                </label>

                {/* COD */}
                <label
                  onClick={() => setPaymentMethod("cod")}
                  className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === "cod"
                      ? "border-primary bg-primary/10 text-white"
                      : "border-border/80 bg-surface-light text-muted hover:border-white/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="mt-1 accent-primary"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-semibold text-white text-sm">
                      <Truck className="text-primary" size={18} />
                      Thanh toán khi nhận hàng (COD)
                    </div>
                    <p className="text-xs text-muted mt-1">
                      Thanh toán tiền mặt cho shipper khi nhận được hàng.
                    </p>
                  </div>
                </label>

                {/* Card */}
                <label
                  onClick={() => setPaymentMethod("card")}
                  className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === "card"
                      ? "border-primary bg-primary/10 text-white"
                      : "border-border/80 bg-surface-light text-muted hover:border-white/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                    className="mt-1 accent-primary"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-semibold text-white text-sm">
                      <CreditCard className="text-primary" size={18} />
                      Thẻ Quốc Tế Visa / Mastercard / ATM
                    </div>
                    <p className="text-xs text-muted mt-1">
                      Thanh toán trực tuyến bảo mật mã hóa SSL 256-bit.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Items & Summary (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-surface border border-border rounded-2xl p-6 space-y-5 sticky top-28">
              <h3 className="font-display text-2xl text-white border-b border-border pb-3">
                ĐƠN HÀNG CỦA BẠN ({items.length})
              </h3>

              {/* Items List Preview */}
              <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.size}-${item.color}`}
                    className="flex items-center gap-3 bg-surface-light p-2.5 rounded-xl border border-border/50"
                  >
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-surface shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white text-xs font-semibold truncate">{item.name}</h4>
                      <p className="text-[11px] text-muted">
                        Size: {item.size} • x{item.quantity}
                      </p>
                      <span className="text-xs font-bold text-primary">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Voucher Code Form */}
              <div className="pt-2 border-t border-border">
                <label className="text-xs text-muted block mb-2 font-medium flex items-center gap-1">
                  <Ticket size={14} className="text-primary" />
                  Mã giảm giá (Voucher)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    placeholder="Nhập mã HIGHTECH10"
                    className="flex-1 bg-surface-light border border-border rounded-xl px-3 py-2 text-xs text-white uppercase placeholder:normal-case focus:outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={handleApplyVoucher}
                    className="bg-surface-light border border-border hover:border-primary text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors"
                  >
                    Áp dụng
                  </button>
                </div>
              </div>

              {/* Summary Breakdown */}
              <div className="space-y-2.5 text-xs text-muted border-t border-border pt-4">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span className="text-white font-medium">{formatPrice(subtotal)}</span>
                </div>

                {appliedVoucher && (
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span>Giảm giá ({appliedVoucher.code})</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span className="text-white font-medium">
                    {shippingFee === 0 ? (
                      <strong className="text-emerald-400">MIỄN PHÍ</strong>
                    ) : (
                      formatPrice(shippingFee)
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-center text-base font-bold text-white pt-3 border-t border-border">
                  <span>Tổng tiền thanh toán</span>
                  <span className="text-2xl text-primary">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Submit Order Button */}
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-full font-bold text-xs uppercase tracking-widest transition-all shadow-xl shadow-primary/25 hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <Lock size={16} />
                XÁC NHẬN ĐẶT HÀNG
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-muted text-center pt-1">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>Bảo mật thông tin & Hỗ trợ đổi trả trong 30 ngày</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
