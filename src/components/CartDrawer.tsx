"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAdminStore } from "@/store/adminStore";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const { cartDrawerOpen, setCartDrawerOpen } = useAdminStore();
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const total = getTotal();

  return (
    <AnimatePresence>
      {cartDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartDrawerOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-surface border-l border-border z-[9999] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag className="text-primary" size={22} />
                <h3 className="font-display text-2xl tracking-wide text-white">
                  GIỎ HÀNG CỦA BẠN
                </h3>
                <span className="bg-primary/20 text-primary text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {items.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              </div>
              <button
                onClick={() => setCartDrawerOpen(false)}
                className="p-2 text-muted hover:text-white transition-colors hover:bg-white/5 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-20 h-20 bg-surface-light rounded-full flex items-center justify-center mb-4 text-muted">
                    <ShoppingBag size={40} />
                  </div>
                  <h4 className="text-white font-semibold text-lg">Giỏ hàng đang trống</h4>
                  <p className="text-muted text-sm mt-1 max-w-xs">
                    Hãy chọn cho mình những sản phẩm thể thao ưng ý nhất!
                  </p>
                  <button
                    onClick={() => setCartDrawerOpen(false)}
                    className="mt-6 bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-full font-semibold text-sm transition-colors"
                  >
                    Tiếp tục mua sắm
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={`${item.id}-${item.size}-${item.color}`}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex gap-4 p-3 bg-surface-light rounded-xl border border-border/50 relative group"
                  >
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-surface shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="text-white text-sm font-semibold truncate pr-6">
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted">
                          <span>Size: <strong className="text-white">{item.size}</strong></span>
                          <span>•</span>
                          <span>Màu: <strong className="text-white">{item.color}</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-sm text-primary">
                          {formatPrice(item.price)}
                        </span>

                        {/* Quantity controller */}
                        <div className="flex items-center border border-border rounded-lg bg-surface">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.size,
                                item.color,
                                item.quantity - 1
                              )
                            }
                            className="p-1 text-muted hover:text-white transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.size,
                                item.color,
                                item.quantity + 1
                              )
                            }
                            className="p-1 text-muted hover:text-white transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => removeItem(item.id, item.size, item.color)}
                      className="absolute top-3 right-3 text-muted hover:text-primary transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer / Summary */}
            {items.length > 0 && (
              <div className="p-5 border-t border-border bg-surface-light space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Tạm tính</span>
                  <span className="font-bold text-white text-lg">{formatPrice(total)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-800/30">
                  <ShieldCheck size={16} />
                  <span>Miễn phí giao hàng cho đơn hàng từ 1.000.000₫</span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <Link
                    href="/cart"
                    onClick={() => setCartDrawerOpen(false)}
                    className="w-full bg-surface border border-border text-white text-center py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-surface-lighter transition-colors flex items-center justify-center"
                  >
                    Xem Giỏ Hàng
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={() => setCartDrawerOpen(false)}
                    className="w-full bg-primary hover:bg-primary-dark text-white text-center py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1 group shadow-lg shadow-primary/20"
                  >
                    Thanh Toán
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
