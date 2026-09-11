"use client";

import ImageWithFallback from "@/components/ImageWithFallback";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Heart, Eye } from "lucide-react";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import type { Product } from "@/data/products";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAdminStore } from "@/store/adminStore";
import { showToast } from "@/components/Toast";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const setQuickViewProduct = useAdminStore((s) => s.setQuickViewProduct);

  const isWishlisted = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: product.sizes[0] || "40",
      color: product.colors[0]?.name || "Tiêu chuẩn",
      quantity: 1,
    });
    showToast("Đã thêm vào giỏ hàng!", product.name, "success");
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
    showToast(
      isWishlisted ? "Đã xóa khỏi yêu thích" : "Đã thêm vào danh sách yêu thích!",
      product.name,
      isWishlisted ? "info" : "success"
    );
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group relative"
    >
      <Link href={`/product/${product.id}`} className="block" id={`product-card-${product.id}`}>
        {/* Image Frame */}
        <div className="relative aspect-square w-full bg-surface-light rounded-2xl overflow-hidden mb-3 border border-border/40 group-hover:border-primary/50 transition-colors">
          <ImageWithFallback
            src={product.images?.[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Dark Overlay on Hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product.isNew && (
              <span className="bg-white text-black text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                Mới
              </span>
            )}
            {product.isSale && product.originalPrice && (
              <span className="bg-primary text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                -{getDiscountPercent(product.price, product.originalPrice)}%
              </span>
            )}
          </div>

          {/* Action Buttons Slide-in */}
          <div className="absolute bottom-3 right-3 flex flex-col gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
            <button
              onClick={handleToggleWishlist}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-lg ${
                isWishlisted
                  ? "bg-primary text-white"
                  : "bg-white text-black hover:bg-primary hover:text-white"
              }`}
              title="Yêu thích"
            >
              <Heart size={16} className={isWishlisted ? "fill-white" : ""} />
            </button>

            <button
              onClick={handleQuickView}
              className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-black hover:bg-primary hover:text-white transition-colors shadow-lg"
              title="Xem nhanh"
            >
              <Eye size={16} />
            </button>

            <button
              onClick={handleQuickAdd}
              className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-black hover:bg-primary hover:text-white transition-colors shadow-lg"
              title="Thêm nhanh vào giỏ"
            >
              <ShoppingBag size={16} />
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-muted">
            <span className="uppercase tracking-wider font-medium">{product.category}</span>
            <span className="text-amber-400 font-semibold">★ {product.rating}</span>
          </div>

          <h3 className="text-sm font-semibold text-white line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center gap-2 pt-0.5">
            <span className="text-sm font-bold text-white">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-muted line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Color Dots */}
          <div className="flex items-center gap-1.5 pt-1">
            {product.colors.map((color) => (
              <span
                key={color.name}
                className="w-3 h-3 rounded-full border border-border"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
