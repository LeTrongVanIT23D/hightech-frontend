"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "./cartStore";
import { api } from "@/lib/api";

export type OrderStatus = "pending" | "processing" | "shipping" | "delivered" | "cancelled";

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  customerInfo: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    note?: string;
  };
  paymentMethod: "cod" | "qr_momo" | "bank_transfer" | "card";
  status: OrderStatus;
  trackingCode: string;
}

export function mapApiOrderToFrontendOrder(apiOrder: any): Order {
  return {
    id: apiOrder.id || `HT-${Math.floor(10000 + Math.random() * 90000)}`,
    createdAt: apiOrder.createdAt || new Date().toISOString(),
    subtotal: Number(apiOrder.subtotal || 0),
    discount: Number(apiOrder.discount || 0),
    shippingFee: Number(apiOrder.shippingFee || 0),
    total: Number(apiOrder.total || 0),
    customerInfo: {
      fullName: apiOrder.customerInfo?.fullName || apiOrder.customerFullName || "Khách hàng",
      phone: apiOrder.customerInfo?.phone || apiOrder.customerPhone || "",
      email: apiOrder.customerInfo?.email || apiOrder.customerEmail || "",
      address: apiOrder.customerInfo?.address || apiOrder.customerAddress || "",
      city: apiOrder.customerInfo?.city || apiOrder.customerCity || "Đà Nẵng",
      note: apiOrder.customerInfo?.note || apiOrder.customerNote || "",
    },
    paymentMethod: (apiOrder.paymentMethod || "cod") as any,
    status: (apiOrder.status?.toLowerCase() || "pending") as OrderStatus,
    trackingCode: apiOrder.trackingCode || `HT-${apiOrder.id}`,
    items: Array.isArray(apiOrder.items)
      ? apiOrder.items.map((it: any) => ({
          id: it.productId || it.id?.toString() || "1",
          name: it.name || "Sản phẩm",
          price: Number(it.price || 0),
          image: it.image || "",
          size: it.size || "",
          color: it.color || "",
          quantity: Number(it.quantity || 1),
        }))
      : [],
  };
}

interface OrderStore {
  orders: Order[];
  isLoading: boolean;
  fetchOrders: () => Promise<Order[]>;
  addOrder: (order: Omit<Order, "id" | "createdAt" | "status" | "trackingCode">) => Order;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  getOrderById: (id: string) => Order | undefined;
}

const initialOrders: Order[] = [
  {
    id: "HT-98421",
    createdAt: "2026-07-28T14:20:00Z",
    items: [
      {
        id: "1",
        name: "Air Max Phantom Elite",
        price: 3500000,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
        size: "42",
        color: "Đỏ",
        quantity: 1,
      },
    ],
    subtotal: 3500000,
    discount: 350000,
    shippingFee: 0,
    total: 3150000,
    customerInfo: {
      fullName: "Nguyễn Văn An",
      phone: "0905123456",
      email: "an.nguyen@gmail.com",
      address: "456 Lê Duẩn, Q. Thanh Khê",
      city: "Đà Nẵng",
    },
    paymentMethod: "qr_momo",
    status: "delivered",
    trackingCode: "VNPOST-889123",
  },
  {
    id: "HT-98455",
    createdAt: "2026-07-30T09:15:00Z",
    items: [
      {
        id: "2",
        name: "UltraBoost X Pro",
        price: 4200000,
        image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800",
        size: "41",
        color: "Đen",
        quantity: 1,
      },
      {
        id: "3",
        name: "Pro Dri-FIT Training Tee",
        price: 890000,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
        size: "L",
        color: "Trắng",
        quantity: 2,
      },
    ],
    subtotal: 5980000,
    discount: 0,
    shippingFee: 0,
    total: 5980000,
    customerInfo: {
      fullName: "Trần Thị Minh",
      phone: "0914987654",
      email: "minh.tran@gmail.com",
      address: "123 Nguyễn Văn Linh, Q.7",
      city: "TP. Hồ Chí Minh",
    },
    paymentMethod: "cod",
    status: "shipping",
    trackingCode: "GHTK-771239",
  },
];

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: initialOrders,
      isLoading: false,

      fetchOrders: async () => {
        try {
          set({ isLoading: true });
          const data = await api.orders.getAll();
          if (Array.isArray(data) && data.length > 0) {
            const mapped = data.map(mapApiOrderToFrontendOrder);
            set({ orders: mapped, isLoading: false });
            return mapped;
          }
        } catch (error) {
          console.warn("Không thể tải danh sách đơn hàng từ backend API:", error);
        } finally {
          set({ isLoading: false });
        }
        return get().orders;
      },

      addOrder: (orderData) => {
        const newId = `HT-${Math.floor(10000 + Math.random() * 90000)}`;
        const trackingCode = `HTEXPRESS-${Math.floor(100000 + Math.random() * 900000)}`;
        const newOrder: Order = {
          ...orderData,
          id: newId,
          createdAt: new Date().toISOString(),
          status: "pending",
          trackingCode,
        };

        set((state) => ({
          orders: [newOrder, ...state.orders],
        }));

        // Gửi lên backend API để đồng bộ lưu vào CSDL SQL Server
        const apiPayload = {
          items: orderData.items.map((it) => ({
            productId: it.id,
            name: it.name,
            price: it.price,
            image: it.image,
            size: it.size || "",
            color: it.color || "",
            quantity: it.quantity,
          })),
          subtotal: orderData.subtotal,
          discount: orderData.discount,
          shippingFee: orderData.shippingFee,
          total: orderData.total,
          customerInfo: {
            fullName: orderData.customerInfo.fullName,
            phone: orderData.customerInfo.phone,
            email: orderData.customerInfo.email,
            address: orderData.customerInfo.address,
            city: orderData.customerInfo.city,
            note: orderData.customerInfo.note,
          },
          paymentMethod: orderData.paymentMethod,
        };

        api.orders.create(apiPayload).then((savedOrder) => {
          if (savedOrder && savedOrder.id) {
            set((state) => ({
              orders: state.orders.map((o) =>
                o.id === newId ? { ...o, id: savedOrder.id, trackingCode: savedOrder.trackingCode || o.trackingCode } : o
              ),
            }));
          }
        }).catch((err) => {
          console.warn("Lỗi khi đồng bộ đơn hàng lên API backend:", err);
        });

        return newOrder;
      },

      updateOrderStatus: async (id, status) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === id ? { ...order, status } : order
          ),
        }));

        try {
          await api.orders.updateStatus(id, status);
        } catch (error) {
          console.warn(`Lỗi khi cập nhật trạng thái đơn ${id} lên API:`, error);
        }
      },

      getOrderById: (id) => {
        return get().orders.find((order) => order.id === id);
      },
    }),
    {
      name: "hightech-orders",
    }
  )
);
