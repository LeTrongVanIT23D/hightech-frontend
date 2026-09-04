"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { CheckCircle2, Package, QrCode, ArrowRight, ShieldCheck } from "lucide-react";
import { useOrderStore } from "@/store/orderStore";
import { formatPrice } from "@/lib/utils";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const getOrderById = useOrderStore((s) => s.getOrderById);

  const order = orderId ? getOrderById(orderId) : undefined;

  return (
    <main className="min-h-screen bg-background pt-28 pb-24">
      <div className="max-w-3xl mx-auto px-4 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-emerald-950/80 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-400 shadow-2xl shadow-emerald-900/30">
          <CheckCircle2 size={48} />
        </div>

        <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400">
          ĐẶT HÀNG THÀNH CÔNG
        </span>

        <h1 className="font-display text-4xl md:text-5xl text-white mt-2 mb-3">
          CẢM ƠN BẠN ĐÃ MUA SẮM TẠI HIGHTECH SPORTS!
        </h1>

        <p className="text-muted text-sm max-w-lg mx-auto">
          Đơn hàng của bạn đã được tiếp nhận và đang được bộ phận kho xử lý. Chúng tôi sẽ sớm giao hàng đến bạn.
        </p>

        {order ? (
          <div className="mt-10 bg-surface border border-border rounded-2xl p-6 md:p-8 text-left space-y-6 shadow-2xl">
            {/* Order Header Meta */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
              <div>
                <span className="text-xs text-muted">Mã đơn hàng</span>
                <h3 className="font-display text-2xl text-white">{order.id}</h3>
              </div>
              <div className="sm:text-right">
                <span className="text-xs text-muted">Mã vận đơn tracking</span>
                <p className="text-sm font-semibold text-primary">{order.trackingCode}</p>
              </div>
            </div>

            {/* QR Payment Prompt if QR selected */}
            {order.paymentMethod === "qr_momo" && (
              <div className="bg-primary/10 border border-primary/30 p-4 rounded-xl flex flex-col sm:flex-row items-center gap-4">
                <div className="w-24 h-24 bg-white p-2 rounded-lg shrink-0 flex items-center justify-center">
                  <QrCode size={80} className="text-black" />
                </div>
                <div>
                  <h4 className="text-white text-sm font-bold flex items-center gap-1.5">
                    Quét Mã QR Chuyển Khoản Vận Đơn
                  </h4>
                  <p className="text-xs text-muted mt-1 leading-relaxed">
                    Nội dung chuyển khoản: <strong className="text-white">{order.id}</strong>. Số tiền:{" "}
                    <strong className="text-primary font-bold">{formatPrice(order.total)}</strong>
                  </p>
                </div>
              </div>
            )}

            {/* Order Items */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">
                Sản phẩm trong đơn ({order.items.length})
              </h4>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div
                    key={`${item.id}-${item.size}-${item.color}`}
                    className="flex items-center gap-4 bg-surface-light p-3 rounded-xl border border-border/50"
                  >
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-surface shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-white text-xs font-semibold truncate">{item.name}</h5>
                      <p className="text-[11px] text-muted">
                        Size: {item.size} • Màu: {item.color} • x{item.quantity}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-white">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Info & Summary */}
            <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t border-border text-xs">
              <div>
                <h4 className="font-semibold text-white mb-2 uppercase tracking-wider text-[11px]">
                  Người nhận hàng
                </h4>
                <p className="text-white font-medium">{order.customerInfo.fullName}</p>
                <p className="text-muted">{order.customerInfo.phone}</p>
                <p className="text-muted">{order.customerInfo.address}, {order.customerInfo.city}</p>
              </div>

              <div className="space-y-1.5 sm:text-right">
                <div className="flex justify-between sm:justify-end gap-4">
                  <span className="text-muted">Tổng giá trị đơn:</span>
                  <strong className="text-white">{formatPrice(order.subtotal)}</strong>
                </div>
                <div className="flex justify-between sm:justify-end gap-4">
                  <span className="text-muted">Giảm giá:</span>
                  <strong className="text-emerald-400">-{formatPrice(order.discount)}</strong>
                </div>
                <div className="flex justify-between sm:justify-end gap-4">
                  <span className="text-muted">Phí ship:</span>
                  <strong className="text-white">{formatPrice(order.shippingFee)}</strong>
                </div>
                <div className="flex justify-between sm:justify-end gap-4 text-sm font-bold text-primary pt-2">
                  <span>Thanh toán:</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/profile"
            className="w-full sm:w-auto bg-surface border border-border hover:border-primary text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
          >
            <Package size={16} />
            Theo dõi đơn hàng
          </Link>
          <Link
            href="/shop"
            className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
          >
            Tiếp tục mua sắm
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
