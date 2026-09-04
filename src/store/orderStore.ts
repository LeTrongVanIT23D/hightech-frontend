"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "./cartStore";

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

interface OrderStore {
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "createdAt" | "status" | "trackingCode">) => Order;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
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

        return newOrder;
      },

      updateOrderStatus: (id, status) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === id ? { ...order, status } : order
          ),
        }));
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
