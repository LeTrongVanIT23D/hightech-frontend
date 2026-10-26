"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, products as initialProductsData } from "@/data/products";
import { api } from "@/lib/api";

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
  isLoading: boolean;

  // Actions
  setCartDrawerOpen: (open: boolean) => void;
  setQuickViewProduct: (product: Product | null) => void;
  setSizeGuideOpen: (open: boolean) => void;

  fetchProducts: () => Promise<Product[]>;
  addProduct: (product: Omit<Product, "id">) => Promise<Product>;
  updateProduct: (id: string, updated: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  fetchVouchers: () => Promise<Voucher[]>;
  addVoucher: (voucher: Voucher) => Promise<void>;
  toggleVoucher: (code: string) => Promise<void>;
  deleteVoucher: (code: string) => Promise<void>;
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
      isLoading: false,

      setCartDrawerOpen: (open) => set({ cartDrawerOpen: open }),
      setQuickViewProduct: (product) => set({ quickViewProduct: product }),
      setSizeGuideOpen: (open) => set({ sizeGuideOpen: open }),

      fetchProducts: async () => {
        try {
          set({ isLoading: true });
          const data = await api.products.getAll();
          if (Array.isArray(data) && data.length > 0) {
            set({ products: data, isLoading: false });
            return data;
          }
        } catch (error) {
          console.warn("Không thể tải danh sách sản phẩm từ backend API, sử dụng dữ liệu cục bộ:", error);
        } finally {
          set({ isLoading: false });
        }
        return get().products;
      },

      addProduct: async (newProduct) => {
        let createdProduct: Product;
        try {
          const res = await api.products.create(newProduct);
          createdProduct = {
            ...newProduct,
            id: res?.id || (get().products.length + 1).toString(),
            rating: res?.rating ?? 5.0,
            reviews: res?.reviews ?? 1,
            images: res?.images || newProduct.images || [],
            sizes: res?.sizes || newProduct.sizes || [],
            colors: res?.colors || newProduct.colors || [],
          };
        } catch (error) {
          console.warn("Lỗi khi thêm sản phẩm qua API backend, lưu vào bộ nhớ cục bộ:", error);
          const id = (get().products.length + 1).toString();
          createdProduct = { ...newProduct, id } as Product;
        }

        set((state) => ({
          products: [createdProduct, ...state.products.filter((p) => p.id !== createdProduct.id)],
        }));
        return createdProduct;
      },

      updateProduct: async (id, updated) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updated } : p
          ),
        }));

        const existing = get().products.find((p) => p.id === id);
        if (existing) {
          try {
            await api.products.update(id, { ...existing, ...updated });
          } catch (error) {
            console.warn(`Lỗi khi đồng bộ cập nhật sản phẩm ${id} lên API:`, error);
          }
        }
      },

      deleteProduct: async (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));

        try {
          await api.products.delete(id);
        } catch (error) {
          console.warn(`Lỗi khi xóa sản phẩm ${id} qua API:`, error);
        }
      },

      fetchVouchers: async () => {
        try {
          const data = await api.vouchers.getAll();
          if (Array.isArray(data) && data.length > 0) {
            set({ vouchers: data });
            return data;
          }
        } catch (error) {
          console.warn("Không thể tải vouchers từ API:", error);
        }
        return get().vouchers;
      },

      addVoucher: async (voucher) => {
        set((state) => ({ vouchers: [voucher, ...state.vouchers] }));
        try {
          await api.vouchers.create(voucher);
        } catch (error) {
          console.warn("Lỗi khi tạo voucher qua API:", error);
        }
      },

      toggleVoucher: async (code) => {
        set((state) => ({
          vouchers: state.vouchers.map((v) =>
            v.code === code ? { ...v, isActive: !v.isActive } : v
          ),
        }));
        try {
          await api.vouchers.toggle(code);
        } catch (error) {
          console.warn(`Lỗi khi toggle voucher ${code} qua API:`, error);
        }
      },

      deleteVoucher: async (code) => {
        set((state) => ({
          vouchers: state.vouchers.filter((v) => v.code !== code),
        }));
        try {
          await api.vouchers.delete(code);
        } catch (error) {
          console.warn(`Lỗi khi xóa voucher ${code} qua API:`, error);
        }
      },
    }),
    {
      name: "hightech-admin",
    }
  )
);
