"use client";

import { useState, use, useEffect } from "react";
import ImageWithFallback from "@/components/ImageWithFallback";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Minus,
  Plus,
  ShoppingBag,
  ChevronDown,
  Check,
  Heart,
  Ruler,
  Flame,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useAdminStore } from "@/store/adminStore";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { showToast } from "@/components/Toast";
import ProductCard from "@/components/ProductCard";

function AccordionItem({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-5 text-left text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:text-primary"
      >
        {title}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown size={20} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-5 text-sm leading-relaxed text-muted">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { products, setSizeGuideOpen } = useAdminStore();
  const product = products.find((p) => p.id === id);

  const addItem = useCartStore((s) => s.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const isWishlisted = product ? isInWishlist(product.id) : false;

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] ?? null);
      setSelectedColor(product.colors[0]?.name ?? null);
    }
  }, [product]);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="font-display text-6xl text-white">404</h1>
          <p className="mt-4 text-lg text-muted">Sản phẩm không tồn tại</p>
          <Link
            href="/shop"
            className="mt-6 inline-block rounded-full bg-primary px-8 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-primary-dark"
          >
            Về cửa hàng
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) return;

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: selectedSize,
      color: selectedColor,
      quantity,
    });

    showToast(
      "Đã thêm vào giỏ hàng!",
      `${product.name} (Size: ${selectedSize})`,
      "success"
    );
  };

  const relatedProducts = (() => {
    const sameCategory = products.filter(
      (p) => p.category === product.category && p.id !== product.id
    );
    if (sameCategory.length >= 4) return sameCategory.slice(0, 4);
    const others = products.filter(
      (p) => p.id !== product.id && !sameCategory.includes(p)
    );
    return [...sameCategory, ...others].slice(0, 4);
  })();

  return (
    <>
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-xs text-muted">
          <Link href="/" className="transition-colors hover:text-white">
            Trang chủ
          </Link>
          <span>/</span>
          <Link href="/shop" className="transition-colors hover:text-white">
            Sản phẩm
          </Link>
          <span>/</span>
          <span className="text-white">{product.name}</span>
        </nav>

        {/* Product Grid */}
        <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:gap-16">
          {/* Left: Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="group relative aspect-square overflow-hidden rounded-2xl bg-surface-light border border-border/50">
              <ImageWithFallback
                src={product.images?.[selectedImage] || product.images?.[0]}
                alt={product.name}
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />

              <div className="absolute left-4 top-4 flex flex-col gap-2">
                {product.isNew && (
                  <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-black">
                    Mới
                  </span>
                )}
                {product.isSale && product.originalPrice && (
                  <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    -{getDiscountPercent(product.price, product.originalPrice)}%
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="mt-4 flex gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative aspect-square w-20 overflow-hidden rounded-xl border-2 transition-all ${
                      selectedImage === idx
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <ImageWithFallback
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right: Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              {product.category}
            </span>

            <h1 className="mt-2 font-display text-4xl leading-tight text-white md:text-5xl">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < Math.round(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-border"
                    }
                  />
                ))}
              </div>
              <span className="text-xs text-muted">
                {product.rating} ({product.reviews} đánh giá)
              </span>
            </div>

            {/* Urgency Stock Status Badge */}
            <div className="mt-4 flex items-center gap-2 bg-amber-950/40 border border-amber-800/30 text-amber-400 px-3.5 py-2 rounded-xl text-xs font-semibold w-fit">
              <Flame size={16} className="animate-pulse" />
              <span>Chỉ còn 3 sản phẩm trong kho — Đã bán 142 lượt</span>
            </div>

            {/* Price */}
            <div className="mt-5 flex items-end gap-3">
              <span className="text-3xl font-bold text-white">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-muted line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="rounded-full bg-primary/15 px-3 py-0.5 text-xs font-bold text-primary">
                    -{getDiscountPercent(product.price, product.originalPrice)}%
                  </span>
                </>
              )}
            </div>

            <p className="mt-4 text-xs leading-relaxed text-muted">
              {product.description}
            </p>

            <div className="my-6 h-px bg-border/60" />

            {/* Size Selector + Guide Trigger */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
                  Kích cỡ: <strong className="text-primary">{selectedSize}</strong>
                </h3>
                <button
                  onClick={() => setSizeGuideOpen(true)}
                  className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
                >
                  <Ruler size={14} />
                  Bảng quy đổi kích cỡ
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`flex h-11 min-w-[3.25rem] items-center justify-center rounded-xl border text-xs font-bold transition-all ${
                      selectedSize === size
                        ? "border-primary bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                        : "border-border text-muted hover:border-white hover:text-white bg-surface"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            <div className="mt-6">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white">
                Màu sắc:{" "}
                <span className="font-normal normal-case text-muted">
                  {selectedColor ?? "—"}
                </span>
              </h3>
              <div className="flex items-center gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    title={color.name}
                    className={`h-9 w-9 rounded-full border transition-all ${
                      selectedColor === color.name
                        ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110"
                        : "border-border hover:scale-105 opacity-80 hover:opacity-100"
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-6">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white">
                Số lượng
              </h3>
              <div className="inline-flex items-center overflow-hidden rounded-full border border-border bg-surface">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-10 w-10 items-center justify-center text-muted transition-colors hover:bg-surface-light hover:text-white"
                >
                  <Minus size={14} />
                </button>
                <span className="flex h-10 w-12 items-center justify-center text-xs font-bold text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-10 w-10 items-center justify-center text-muted transition-colors hover:bg-surface-light hover:text-white"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize || !selectedColor}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary py-4 text-xs font-bold uppercase tracking-widest text-white transition-all hover:scale-[1.02] hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50 shadow-lg shadow-primary/25"
              >
                <ShoppingBag size={18} />
                Thêm vào giỏ hàng
              </button>

              <button
                onClick={() => {
                  toggleItem(product);
                  showToast(
                    isWishlisted ? "Đã xóa khỏi yêu thích" : "Đã thêm vào yêu thích!",
                    product.name
                  );
                }}
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border transition-colors ${
                  isWishlisted
                    ? "border-primary bg-primary text-white"
                    : "border-border text-muted hover:border-white hover:text-white"
                }`}
              >
                <Heart size={20} className={isWishlisted ? "fill-white" : ""} />
              </button>
            </div>

            {/* Accordion */}
            <div className="mt-10 border-t border-border">
              <AccordionItem title="Mô tả chi tiết" defaultOpen>
                <p>{product.description}</p>
                <ul className="mt-3 list-inside list-disc space-y-1 text-muted">
                  <li>Chất liệu cao cấp, bền bỉ khi tập luyện cường độ cao</li>
                  <li>Thiết kế hiện đại chuẩn phong cách thể thao Nike/Adidas</li>
                  <li>Độ thoáng khí tối đa, thấm hút mồ hôi nhanh chóng</li>
                </ul>
              </AccordionItem>

              <AccordionItem title="Đánh giá từ khách hàng">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="font-display text-5xl text-white">
                      {product.rating}
                    </p>
                    <div className="mt-1 flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={
                            i < Math.round(product.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-border"
                          }
                        />
                      ))}
                    </div>
                    <p className="mt-1 text-xs text-muted">
                      {product.reviews} đánh giá
                    </p>
                  </div>
                </div>
              </AccordionItem>

              <AccordionItem title="Chính sách vận chuyển & Đổi trả">
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-3">
                    <Truck size={16} className="mt-0.5 shrink-0 text-primary" />
                    <span>Miễn phí vận chuyển toàn quốc cho đơn hàng từ 1.000.000₫.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ShieldCheck size={16} className="mt-0.5 shrink-0 text-primary" />
                    <span>Đổi trả miễn phí trong vòng 30 ngày. Bảo hành chính hãng 12 tháng.</span>
                  </li>
                </ul>
              </AccordionItem>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-24">
            <h2 className="mb-8 font-display text-3xl tracking-wider text-white md:text-4xl">
              SẢN PHẨM LIÊN QUAN
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {relatedProducts.map((p, idx) => (
                <ProductCard key={p.id} product={p} index={idx} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Sticky Bottom Add To Cart Bar */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-border py-3 px-4 shadow-2xl"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-surface-light hidden sm:block">
                  <ImageWithFallback src={product.images?.[0]} alt={product.name} fill className="object-cover" />
                </div>
                <div>
                  <h4 className="text-white text-sm font-semibold truncate max-w-xs">{product.name}</h4>
                  <span className="text-primary font-bold text-sm">{formatPrice(product.price)}</span>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg"
              >
                <ShoppingBag size={16} />
                Thêm Giỏ Hàng
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
