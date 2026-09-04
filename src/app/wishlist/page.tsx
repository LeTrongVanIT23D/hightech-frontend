"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Trash2, ArrowRight } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import ProductCard from "@/components/ProductCard";

export default function WishlistPage() {
  const { items, clearWishlist } = useWishlistStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-background pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted mb-6">
          <Link href="/" className="hover:text-white transition-colors">
            Trang chủ
          </Link>
          <span>/</span>
          <span className="text-white">Danh sách yêu thích</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 border-b border-border/50 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Sản phẩm đã thả tim</span>
            <h1 className="font-display text-4xl md:text-5xl text-white tracking-wide mt-1">
              DANH SÁCH YÊU THÍCH ({items.length})
            </h1>
          </div>

          {items.length > 0 && (
            <button
              onClick={clearWishlist}
              className="text-xs text-muted hover:text-primary transition-colors flex items-center gap-1.5 border border-border px-4 py-2 rounded-full w-fit"
            >
              <Trash2 size={14} />
              Xóa tất cả sản phẩm
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="bg-surface border border-border rounded-2xl p-16 text-center max-w-xl mx-auto my-10">
            <div className="w-20 h-20 bg-surface-light rounded-full flex items-center justify-center mx-auto mb-6 text-muted">
              <Heart size={40} />
            </div>
            <h3 className="font-display text-3xl text-white">DANH SÁCH RỖNG</h3>
            <p className="text-muted text-sm mt-2">
              Bạn chưa thả tim bất kỳ sản phẩm nào. Hãy bấm biểu tượng trái tim để lưu lại những mẫu giày, quần áo thể thao yêu thích!
            </p>
            <Link
              href="/shop"
              className="mt-8 inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
            >
              Khám phá sản phẩm ngay
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
