"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronDown,
  Truck,
  RotateCcw,
  Shield,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import { products, categories } from "@/data/products";
import ProductCard from "@/components/ProductCard";

/* ───────────────────────── animation variants ───────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: "easeOut" as const },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

/* ──────────────────────────── features data ──────────────────────────── */

const features = [
  {
    icon: Truck,
    title: "Miễn phí vận chuyển",
    description: "Cho đơn hàng từ 500K",
  },
  {
    icon: RotateCcw,
    title: "Đổi trả 30 ngày",
    description: "Đổi trả miễn phí",
  },
  {
    icon: Shield,
    title: "Bảo hành chính hãng",
    description: "Cam kết 100% chính hãng",
  },
  {
    icon: CreditCard,
    title: "Thanh toán an toàn",
    description: "Bảo mật tuyệt đối",
  },
];

/* ═══════════════════════════════════════════════════════════════════════ */
/*                              HOME PAGE                                */
/* ═══════════════════════════════════════════════════════════════════════ */

export default function HomePage() {
  return (
    <>
      {/* ─── 1. HERO BANNER ─────────────────────────────────────────── */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Background image */}
        <Image
          src="https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1600"
          alt="Hero background – sports equipment"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />

        {/* Content */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
        >
          <motion.h1
            variants={fadeUp}
            custom={0}
            className="font-display text-6xl leading-none tracking-wide text-white md:text-8xl lg:text-9xl"
          >
            VƯỢT QUA GIỚI HẠN
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={1}
            className="mt-4 max-w-lg text-base text-gray-300 md:mt-6 md:text-lg lg:text-xl"
          >
            Khám phá bộ sưu tập thể thao cao cấp mới nhất
          </motion.p>

          <motion.div variants={fadeUp} custom={2} className="mt-8 md:mt-10">
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:scale-105 hover:bg-primary-dark active:scale-100"
            >
              KHÁM PHÁ NGAY
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={28} className="text-white/70" />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── 2. CATEGORIES SECTION ──────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:py-28">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="font-display text-center text-4xl tracking-wide text-white md:text-5xl lg:text-6xl"
        >
          DANH MỤC SẢN PHẨM
        </motion.h2>

        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.slug}
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.1 }}
              className={`group relative overflow-hidden rounded-2xl ${
                i < 2 ? "aspect-[3/4] md:aspect-[3/4]" : "aspect-square"
              }`}
            >
              <Link
                href={`/shop?category=${cat.slug}`}
                className="block h-full w-full"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />

                {/* overlay */}
                <div className="absolute inset-0 bg-black/40 transition-colors group-hover:bg-black/55" />

                {/* label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                  <span className="font-display text-2xl tracking-wide text-white md:text-3xl lg:text-4xl">
                    {cat.name}
                  </span>
                  <span className="text-xs text-white/70">
                    {cat.count} sản phẩm
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── 3. FEATURED PRODUCTS ───────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-20 md:pb-28">
        {/* heading row */}
        <div className="flex items-end justify-between">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="font-display text-4xl tracking-wide text-white md:text-5xl lg:text-6xl"
          >
            SẢN PHẨM NỔI BẬT
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              href="/shop"
              className="group flex items-center gap-1 text-sm font-medium text-muted transition-colors hover:text-white"
            >
              Xem tất cả
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </div>

        {/* product grid */}
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {products.slice(0, 8).map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </section>

      {/* ─── 4. PROMO BANNER ────────────────────────────────────────── */}
      <section className="overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* left image */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative aspect-[4/5] md:aspect-auto"
          >
            <Image
              src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800"
              alt="Bộ sưu tập thể thao 2025"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>

          {/* right content */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-start justify-center bg-surface px-8 py-16 md:px-16 lg:px-24"
          >
            <span className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary">
              Bộ sưu tập mới
            </span>

            <h2 className="font-display text-4xl leading-tight tracking-wide text-white md:text-5xl lg:text-6xl">
              BỘ SƯU TẬP
              <br />
              THỂ THAO 2025
            </h2>

            <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
              Trải nghiệm dòng sản phẩm thể thao mới nhất với công nghệ tiên
              tiến và thiết kế đột phá. Nâng tầm phong cách và hiệu suất tập
              luyện của bạn.
            </p>

            <Link
              href="/shop"
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:scale-105 hover:bg-primary-dark active:scale-100"
            >
              KHÁM PHÁ NGAY
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── 5. TRUST BADGES / FEATURES ─────────────────────────────── */}
      <section className="bg-surface-light">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-16 md:grid-cols-4 md:py-20">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-lighter">
                  <Icon size={24} className="text-primary" />
                </div>
                <h3 className="text-sm font-semibold text-white md:text-base">
                  {feat.title}
                </h3>
                <p className="mt-1 text-xs text-muted md:text-sm">
                  {feat.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>
    </>
  );
}
