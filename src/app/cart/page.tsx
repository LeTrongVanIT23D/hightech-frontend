'use client';

import { useState, useEffect } from 'react';
import ImageWithFallback from '@/components/ImageWithFallback';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, X, ShoppingBag, ArrowLeft, Shield, Truck, RotateCcw } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);

  const { items, removeItem, updateQuantity, getTotal } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const subtotal = getTotal();
  const shippingFee = subtotal >= 1000000 ? 0 : 30000;
  const discount = discountApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + shippingFee - discount;

  const handleApplyDiscount = () => {
    if (discountCode.trim().toUpperCase() === 'HIGHTECH10') {
      setDiscountApplied(true);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Continue Shopping */}
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-muted hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Tiếp tục mua sắm</span>
          </Link>

          {/* Empty State */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center py-24"
          >
            <ShoppingBag className="w-24 h-24 text-muted mb-6" strokeWidth={1} />
            <h2 className="font-display text-3xl sm:text-4xl text-white mb-3">
              Giỏ hàng trống
            </h2>
            <p className="text-muted mb-8 text-center max-w-md">
              Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các sản phẩm của chúng tôi.
            </p>
            <Link
              href="/shop"
              className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3 rounded-full transition-colors uppercase tracking-wider text-sm"
            >
              Tiếp tục mua sắm
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Continue Shopping */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-muted hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Tiếp tục mua sắm</span>
        </Link>

        {/* Page Header */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-display text-4xl sm:text-5xl lg:text-6xl text-white mb-8 sm:mb-10"
        >
          GIỎ HÀNG CỦA BẠN
        </motion.h1>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Cart Items - Left Column */}
          <div className="w-full lg:w-[65%]">
            {/* Items Count */}
            <div className="border-b border-border pb-4 mb-6">
              <span className="text-muted text-sm">
                {items.length} sản phẩm trong giỏ hàng
              </span>
            </div>

            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={`${item.id}-${item.size}-${item.color}`}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="mb-4 overflow-hidden"
                >
                  <div className="bg-surface rounded-xl p-4 sm:p-5 flex gap-4 sm:gap-5 border border-border/50 hover:border-border transition-colors">
                    {/* Product Image */}
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-surface-light shrink-0">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h3 className="text-white font-medium text-sm sm:text-base truncate pr-8">
                          {item.name}
                        </h3>
                        <div className="flex gap-3 mt-1.5">
                          {item.size && (
                            <span className="text-xs text-muted bg-surface-light px-2.5 py-1 rounded-md">
                              Size: {item.size}
                            </span>
                          )}
                          {item.color && (
                            <span className="text-xs text-muted bg-surface-light px-2.5 py-1 rounded-md">
                              Màu: {item.color}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-border rounded-lg overflow-hidden">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.size, item.color, item.quantity - 1)
                            }
                            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-muted hover:text-white hover:bg-surface-light transition-colors"
                            aria-label="Giảm số lượng"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-10 sm:w-12 text-center text-white text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.size, item.color, item.quantity + 1)
                            }
                            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-muted hover:text-white hover:bg-surface-light transition-colors"
                            aria-label="Tăng số lượng"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Price */}
                        <span className="text-white font-semibold text-sm sm:text-base">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id, item.size, item.color)}
                      className="absolute top-4 right-4 sm:relative sm:top-0 sm:right-0 w-8 h-8 flex items-center justify-center text-muted hover:text-primary hover:bg-surface-light rounded-lg transition-colors shrink-0 self-start"
                      aria-label="Xóa sản phẩm"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary - Right Column */}
          <div className="w-full lg:w-[35%]">
            <div className="lg:sticky lg:top-24">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-surface rounded-xl p-6 border border-border/50"
              >
                <h2 className="font-display text-2xl text-white mb-6">
                  TÓM TẮT ĐƠN HÀNG
                </h2>

                {/* Summary Lines */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Tạm tính</span>
                    <span className="text-white">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Phí vận chuyển</span>
                    <span className={shippingFee === 0 ? 'text-green-500' : 'text-white'}>
                      {shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}
                    </span>
                  </div>
                  {shippingFee > 0 && (
                    <p className="text-xs text-muted">
                      Miễn phí vận chuyển cho đơn hàng từ {formatPrice(1000000)}
                    </p>
                  )}
                  {discountApplied && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Giảm giá (10%)</span>
                      <span className="text-green-500">-{formatPrice(discount)}</span>
                    </div>
                  )}
                </div>

                {/* Discount Code */}
                <div className="mb-6">
                  <label className="text-sm text-muted block mb-2">Mã giảm giá</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      placeholder="Nhập mã giảm giá"
                      className="flex-1 bg-surface-light border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-muted/50 focus:border-primary focus:outline-none transition-colors"
                      disabled={discountApplied}
                    />
                    <button
                      onClick={handleApplyDiscount}
                      disabled={discountApplied || !discountCode.trim()}
                      className="px-4 py-2.5 bg-surface-light border border-border text-white text-sm rounded-lg hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                    >
                      {discountApplied ? 'Đã áp dụng' : 'Áp dụng'}
                    </button>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-border my-6" />

                {/* Total */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-white font-semibold text-lg">Tổng cộng</span>
                  <span className="text-white font-bold text-2xl">
                    {formatPrice(total)}
                  </span>
                </div>

                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3.5 rounded-full transition-colors uppercase tracking-wider text-sm flex items-center justify-center"
                >
                  Thanh toán
                </Link>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-border/50">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center text-center gap-2">
                      <Shield className="w-5 h-5 text-muted" />
                      <span className="text-xs text-muted leading-tight">Thanh toán bảo mật</span>
                    </div>
                    <div className="flex flex-col items-center text-center gap-2">
                      <Truck className="w-5 h-5 text-muted" />
                      <span className="text-xs text-muted leading-tight">Giao hàng nhanh</span>
                    </div>
                    <div className="flex flex-col items-center text-center gap-2">
                      <RotateCcw className="w-5 h-5 text-muted" />
                      <span className="text-xs text-muted leading-tight">Đổi trả miễn phí</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
