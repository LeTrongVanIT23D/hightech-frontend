"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, ChevronDown, LayoutGrid, List, RotateCcw } from "lucide-react";
import { useAdminStore } from "@/store/adminStore";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

const categoryTabs = ["Tất cả", "Giày", "Áo", "Quần", "Phụ kiện"];

const sortOptions = [
  { label: "Mặc định", value: "default" },
  { label: "Giá thấp đến cao", value: "price-asc" },
  { label: "Giá cao đến thấp", value: "price-desc" },
  { label: "Mới nhất", value: "newest" },
  { label: "Đánh giá cao nhất", value: "rating" },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const rawCategory = searchParams.get("category") || "Tất cả";
  const slugMap: Record<string, string> = {
    giay: "Giày",
    ao: "Áo",
    quan: "Quần",
    "phu-kien": "Phụ kiện",
    "tất cả": "Tất cả",
  };
  const initialCategory = slugMap[rawCategory.toLowerCase()] ?? (categoryTabs.includes(rawCategory) ? rawCategory : "Tất cả");
  const initialSearch = searchParams.get("search") || "";

  const { products } = useAdminStore();

  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [activeSort, setActiveSort] = useState("default");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [priceMax, setPriceMax] = useState<number>(5000000);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((p) => p.price <= priceMax);

    if (activeCategory !== "Tất cả") {
      filtered = filtered.filter((p) => p.category === activeCategory);
    }

    if (initialSearch.trim()) {
      const q = initialSearch.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    switch (activeSort) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return filtered;
  }, [products, activeCategory, activeSort, initialSearch, priceMax]);

  const activeSortLabel =
    sortOptions.find((o) => o.value === activeSort)?.label ?? "Mặc định";

  return (
    <main className="min-h-screen bg-background pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted mb-6">
          <Link href="/" className="hover:text-white transition-colors">
            Trang chủ
          </Link>
          <span>/</span>
          <span className="text-white">Cửa hàng sản phẩm</span>
        </nav>

        {/* Title & Controls Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-border/50 pb-6">
          <div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white tracking-wide">
              BỘ SƯU TẬP THỂ THAO
            </h1>
            <p className="text-muted mt-2 text-sm">
              Hiển thị{" "}
              <strong className="text-white font-semibold">
                {filteredAndSortedProducts.length}
              </strong>{" "}
              sản phẩm thể thao cao cấp chính hãng
            </p>
          </div>

          {/* View Mode Switcher & Sort */}
          <div className="flex items-center gap-3">
            {/* View Mode Toggle Buttons */}
            <div className="flex items-center bg-surface border border-border rounded-xl p-1 gap-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-primary text-white"
                    : "text-muted hover:text-white"
                }`}
                title="Xem dạng lưới (Grid View)"
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list"
                    ? "bg-primary text-white"
                    : "text-muted hover:text-white"
                }`}
                title="Xem dạng danh sách (List View)"
              >
                <List size={18} />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-xl text-xs font-semibold text-white hover:border-primary transition-colors"
              >
                <span className="hidden sm:inline text-muted">Sắp xếp:</span>
                {activeSortLabel}
                <ChevronDown
                  size={14}
                  className={`transition-transform ${sortDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {sortDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 mt-2 w-52 bg-surface border border-border rounded-xl shadow-2xl overflow-hidden z-50"
                  >
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setActiveSort(option.value);
                          setSortDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-xs transition-colors ${
                          activeSort === option.value
                            ? "bg-primary/10 text-primary font-bold"
                            : "text-white hover:bg-surface-light"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Filter Bar & Active Filter Chips */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between gap-4">
            {/* Desktop Category Tabs */}
            <div className="hidden lg:flex items-center gap-2 flex-wrap">
              {categoryTabs.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                    activeCategory === cat
                      ? "bg-primary text-white shadow-lg shadow-primary/25 scale-105"
                      : "bg-surface text-muted hover:text-white hover:bg-surface-light border border-border/80"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-xl text-xs font-semibold text-white hover:border-primary transition-colors"
            >
              <SlidersHorizontal size={16} />
              Bộ lọc nâng cao
            </button>
          </div>

          {/* Active Filter Chips Pill */}
          {(activeCategory !== "Tất cả" || priceMax < 5000000 || initialSearch) && (
            <div className="flex items-center gap-2 flex-wrap pt-2">
              <span className="text-xs text-muted">Bộ lọc đang chọn:</span>
              {activeCategory !== "Tất cả" && (
                <span className="bg-primary/20 border border-primary/40 text-primary text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5">
                  Danh mục: {activeCategory}
                  <button onClick={() => setActiveCategory("Tất cả")}>
                    <X size={12} />
                  </button>
                </span>
              )}
              {priceMax < 5000000 && (
                <span className="bg-primary/20 border border-primary/40 text-primary text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5">
                  Tối đa: {formatPrice(priceMax)}
                  <button onClick={() => setPriceMax(5000000)}>
                    <X size={12} />
                  </button>
                </span>
              )}
              {initialSearch && (
                <span className="bg-primary/20 border border-primary/40 text-primary text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5">
                  Tìm kiếm: &quot;{initialSearch}&quot;
                  <Link href="/shop">
                    <X size={12} />
                  </Link>
                </span>
              )}
              <button
                onClick={() => {
                  setActiveCategory("Tất cả");
                  setPriceMax(5000000);
                  setActiveSort("default");
                }}
                className="text-xs text-muted hover:text-white underline ml-2 flex items-center gap-1"
              >
                <RotateCcw size={12} />
                Bỏ tất cả lọc
              </button>
            </div>
          )}
        </div>

        {/* Mobile Filter Slide Drawer */}
        <AnimatePresence>
          {mobileFilterOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 z-50 lg:hidden"
                onClick={() => setMobileFilterOpen(false)}
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                className="fixed top-0 left-0 bottom-0 w-80 bg-surface z-50 lg:hidden flex flex-col p-6 shadow-2xl overflow-y-auto"
              >
                <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
                  <h3 className="font-display text-2xl text-white">BỘ LỌC CỬA HÀNG</h3>
                  <button onClick={() => setMobileFilterOpen(false)} className="text-muted hover:text-white">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-6 flex-1">
                  <div>
                    <h4 className="text-xs uppercase text-muted tracking-wider font-semibold mb-3">
                      Danh mục sản phẩm
                    </h4>
                    <div className="flex flex-col gap-2">
                      {categoryTabs.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            setActiveCategory(cat);
                            setMobileFilterOpen(false);
                          }}
                          className={`text-left px-4 py-2.5 rounded-xl text-xs font-semibold ${
                            activeCategory === cat ? "bg-primary text-white" : "text-muted hover:text-white bg-surface-light"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs uppercase text-muted tracking-wider font-semibold mb-3">
                      Khoảng giá tối đa: <strong className="text-white">{formatPrice(priceMax)}</strong>
                    </h4>
                    <input
                      type="range"
                      min="500000"
                      max="5000000"
                      step="100000"
                      value={priceMax}
                      onChange={(e) => setPriceMax(Number(e.target.value))}
                      className="w-full accent-primary bg-surface-light cursor-pointer"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full bg-primary text-white py-3 rounded-full font-bold text-xs uppercase mt-6"
                >
                  Xem kết quả ({filteredAndSortedProducts.length})
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Product Display (Grid vs List Mode) */}
        {filteredAndSortedProducts.length > 0 ? (
          viewMode === "grid" ? (
            <motion.div
              layout
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredAndSortedProducts.map((product, idx) => (
                  <motion.div key={product.id} layout>
                    <ProductCard product={product} index={idx} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            /* List View Mode */
            <div className="space-y-4">
              {filteredAndSortedProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col sm:flex-row gap-6 p-4 bg-surface rounded-2xl border border-border hover:border-primary/40 transition-colors"
                >
                  <div className="relative w-full sm:w-48 aspect-square rounded-xl overflow-hidden bg-surface-light shrink-0">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-xs uppercase tracking-widest text-primary font-bold">
                        {product.category}
                      </span>
                      <h3 className="font-display text-2xl text-white mt-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-muted mt-2 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-bold text-white">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-muted line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>

                      <Link
                        href={`/product/${product.id}`}
                        className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase transition-colors"
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-surface-light flex items-center justify-center mb-4 text-muted">
              <SlidersHorizontal size={28} />
            </div>
            <h3 className="text-white text-lg font-semibold">Không tìm thấy sản phẩm phù hợp</h3>
            <p className="text-muted text-xs mt-1 max-w-sm">
              Hãy thử chọn lại danh mục hoặc điều chỉnh lại khoảng giá tìm kiếm.
            </p>
            <button
              onClick={() => {
                setActiveCategory("Tất cả");
                setPriceMax(5000000);
              }}
              className="mt-6 bg-primary text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
