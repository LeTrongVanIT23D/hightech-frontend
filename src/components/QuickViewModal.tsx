"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, ShoppingBag, Heart, Check, ArrowRight } from "lucide-react";
import { useAdminStore } from "@/store/adminStore";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { showToast } from "./Toast";
import { formatPrice } from "@/lib/utils";

export default function QuickViewModal() {
  const { quickViewProduct, setQuickViewProduct } = useAdminStore();
  const addItem = useCartStore((s) => s.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const isWishlisted = isInWishlist(product.id);

  const activeSize = selectedSize || product.sizes[0] || "Standard";
  const activeColor = selectedColor || product.colors[0]?.name || "Default";

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: activeSize,
      color: activeColor,
      quantity,
    });
    showToast("Đã thêm vào giỏ hàng!", `${product.name} (Size ${activeSize})`, "success");
    setQuickViewProduct(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setQuickViewProduct(null)}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="relative w-full max-w-3xl bg-surface border border-border rounded-2xl overflow-hidden shadow-2xl z-10 grid md:grid-cols-2 max-h-[90vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={() => setQuickViewProduct(null)}
            className="absolute top-4 right-4 z-20 w-9 h-9 bg-black/60 hover:bg-primary text-white rounded-full flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>

          {/* Left: Image */}
          <div className="relative aspect-square md:aspect-auto bg-surface-light">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
            />
            {product.isNew && (
              <span className="absolute top-4 left-4 bg-white text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                Mới
              </span>
            )}
          </div>

          {/* Right: Info */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-5">
            <div>
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                {product.category}
              </span>
              <h3 className="font-display text-2xl md:text-3xl text-white mt-1">
                {product.name}
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < Math.floor(product.rating) ? "fill-amber-400" : "text-border"}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted">
                  {product.rating} ({product.reviews} đánh giá)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mt-4">
                <span className="text-2xl font-bold text-white">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-muted line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              <p className="text-xs text-muted mt-3 line-clamp-3 leading-relaxed">
                {product.description}
              </p>

              {/* Size Selector */}
              <div className="mt-5">
                <label className="text-xs text-muted block mb-2 font-medium">
                  Kích cỡ: <strong className="text-white">{activeSize}</strong>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        activeSize === s
                          ? "border-primary bg-primary text-white"
                          : "border-border text-muted hover:text-white"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary hover:bg-primary-dark text-white py-3 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <ShoppingBag size={16} />
                  Thêm vào giỏ
                </button>
                <button
                  onClick={() => {
                    toggleItem(product);
                    showToast(
                      isWishlisted ? "Đã xóa khỏi yêu thích" : "Đã thêm vào yêu thích!",
                      product.name
                    );
                  }}
                  className={`w-12 h-12 rounded-full border border-border flex items-center justify-center transition-colors ${
                    isWishlisted ? "bg-primary text-white border-primary" : "text-muted hover:text-white"
                  }`}
                >
                  <Heart size={18} className={isWishlisted ? "fill-white" : ""} />
                </button>
              </div>

              <Link
                href={`/product/${product.id}`}
                onClick={() => setQuickViewProduct(null)}
                className="w-full text-center text-xs text-muted hover:text-white transition-colors flex items-center justify-center gap-1 py-1"
              >
                Xem chi tiết đầy đủ
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
