"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api, type AuthUser } from "@/lib/api";

export type UserProfile = AuthUser;

interface AuthResult {
  success: boolean;
  message: string;
  user?: UserProfile;
}

interface AuthStore {
  currentUser: UserProfile | null;
  login: (identifier: string, password: string) => Promise<AuthResult>;
  register: (data: { name: string; email: string; password: string; phone?: string; address?: string }) => Promise<AuthResult>;
  logout: () => void;
  updateProfile: (updatedData: Partial<UserProfile>) => { success: boolean; message: string };
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      currentUser: null,

      login: async (identifier, password) => {
        const response = await api.auth.login({ identifier, password });
        if (!response.success) {
          return { success: false, message: response.message };
        }
        if (!response.user) {
          throw new Error("API đăng nhập không trả về thông tin người dùng");
        }

        set({ currentUser: response.user });
        return {
          success: true,
          message: response.message,
          user: response.user,
        };
      },

      register: async (data) => {
        const response = await api.auth.register(data);
        if (!response.success) {
          return { success: false, message: response.message };
        }
        if (!response.user) {
          throw new Error("API đăng ký không trả về thông tin người dùng");
        }

        set({ currentUser: response.user });
        return {
          success: true,
          message: response.message,
          user: response.user,
        };
      },

      logout: () => {
        set({ currentUser: null });
      },

      updateProfile: (updatedData) => {
        const current = get().currentUser;
        if (!current) {
          return { success: false, message: "Chưa đăng nhập!" };
        }

        set({ currentUser: { ...current, ...updatedData } });
        return {
          success: true,
          message: "Cập nhật thông tin thành công!",
        };
      },
    }),
    {
      name: "hightech-auth",
      partialize: (state) => ({ currentUser: state.currentUser }),
    }
  )
);
