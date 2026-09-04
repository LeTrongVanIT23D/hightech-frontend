"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, products as initialProductsData } from "@/data/products";

export interface Voucher {
  code: string;
  discountPercent: number;
  minSubtotal: number;
  description: string;
  expiryDate: string;
  isActive: boolean;
}

interface AdminStore {
  products: Product[];
  vouchers: Voucher[];
  cartDrawerOpen: boolean;
  quickViewProduct: Product | null;
  sizeGuideOpen: boolean;

  // Actions
  setCartDrawerOpen: (open: boolean) => void;
  setQuickViewProduct: (product: Product | null) => void;
  setSizeGuideOpen: (open: boolean) => void;

  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  addVoucher: (voucher: Voucher) => void;
  toggleVoucher: (code: string) => void;
  deleteVoucher: (code: string) => void;
}

const initialVouchers: Voucher[] = [
  {
    code: "HIGHTECH10",
    discountPercent: 10,
    minSubtotal: 500000,
    description: "Giảm 10% cho đơn hàng từ 500.000₫",
    expiryDate: "2026-12-31",
    isActive: true,
  },
  {
    code: "SPORTVIP20",
    discountPercent: 20,
    minSubtotal: 2000000,
    description: "Giảm 20% cho đơn hàng từ 2.000.000₫",
    expiryDate: "2026-12-31",
    isActive: true,
  },
];

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      products: initialProductsData,
      vouchers: initialVouchers,
      cartDrawerOpen: false,
      quickViewProduct: null,
      sizeGuideOpen: false,

      setCartDrawerOpen: (open) => set({ cartDrawerOpen: open }),
      setQuickViewProduct: (product) => set({ quickViewProduct: product }),
      setSizeGuideOpen: (open) => set({ sizeGuideOpen: open }),

      addProduct: (newProduct) => {
        const id = (get().products.length + 1).toString();
        set((state) => ({
          products: [{ ...newProduct, id }, ...state.products],
        }));
      },

      updateProduct: (id, updated) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updated } : p
          ),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },

      addVoucher: (voucher) => {
        set((state) => ({ vouchers: [voucher, ...state.vouchers] }));
      },

      toggleVoucher: (code) => {
        set((state) => ({
          vouchers: state.vouchers.map((v) =>
            v.code === code ? { ...v, isActive: !v.isActive } : v
          ),
        }));
      },

      deleteVoucher: (code) => {
        set((state) => ({
          vouchers: state.vouchers.filter((v) => v.code !== code),
        }));
      },
    }),
    {
      name: "hightech-admin",
    }
  )
);
