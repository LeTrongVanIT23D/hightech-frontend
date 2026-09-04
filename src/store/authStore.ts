"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: "admin" | "user";
}

export interface StoredUser extends UserProfile {
  password: string;
}

const DEFAULT_USERS: StoredUser[] = [
  {
    id: "U-ADMIN",
    name: "Admin HIGHTECH",
    email: "admin@hightech.vn",
    phone: "19001234",
    address: "Trụ sở HIGHTECH Sports, Đà Nẵng",
    role: "admin",
    password: "admin123",
  },
  {
    id: "U-001",
    name: "Nguyễn Văn An",
    email: "an.nguyen@gmail.com",
    phone: "0905123456",
    address: "456 Lê Duẩn, Q. Thanh Khê, Đà Nẵng",
    role: "user",
    password: "123456",
  },
];

interface AuthStore {
  currentUser: UserProfile | null;
  users: StoredUser[];
  login: (identifier: string, password: string) => { success: boolean; message: string; user?: UserProfile };
  register: (data: { name: string; email: string; password: string; phone?: string; address?: string }) => {
    success: boolean;
    message: string;
    user?: UserProfile;
  };
  logout: () => void;
  updateProfile: (updatedData: Partial<UserProfile>) => { success: boolean; message: string };
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: DEFAULT_USERS,

      login: (identifier: string, password: string) => {
        const idClean = identifier.trim().toLowerCase();
        const passClean = password.trim();

        // 1. Check quick admin login credentials
        if (
          (idClean === "admin" || idClean === "admin@hightech.vn" || idClean === "admin@gmail.com") &&
          passClean === "admin123"
        ) {
          const adminUser: UserProfile = {
            id: "U-ADMIN",
            name: "Admin HIGHTECH",
            email: "admin@hightech.vn",
            phone: "19001234",
            address: "Trụ sở HIGHTECH Sports, Đà Nẵng",
            role: "admin",
          };
          set({ currentUser: adminUser });
          return {
            success: true,
            message: "Đăng nhập quyền Quản trị viên (Admin) thành công!",
            user: adminUser,
          };
        }

        // 2. Check registered users list
        const currentUsers = get().users && get().users.length > 0 ? get().users : DEFAULT_USERS;
        const matchedUser = currentUsers.find(
          (u) =>
            (u.email.toLowerCase() === idClean ||
              u.name.toLowerCase() === idClean ||
              (idClean === "admin" && u.role === "admin")) &&
            u.password === passClean
        );

        if (matchedUser) {
          const { password: _, ...profile } = matchedUser;
          set({ currentUser: profile });
          return {
            success: true,
            message: `Đăng nhập thành công! Chào mừng ${profile.name}.`,
            user: profile,
          };
        }

        return {
          success: false,
          message: "Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!",
        };
      },

      register: (data) => {
        const emailClean = data.email.trim().toLowerCase();
        const nameClean = data.name.trim();
        const passClean = data.password.trim();

        if (!emailClean || !nameClean || !passClean) {
          return { success: false, message: "Vui lòng nhập đầy đủ họ tên, email và mật khẩu!" };
        }

        if (passClean.length < 6) {
          return { success: false, message: "Mật khẩu cần tối thiểu 6 ký tự!" };
        }

        const currentUsers = get().users && get().users.length > 0 ? get().users : DEFAULT_USERS;
        const exists = currentUsers.some((u) => u.email.toLowerCase() === emailClean);

        if (exists || emailClean === "admin@hightech.vn") {
          return { success: false, message: "Email này đã được sử dụng bởi tài khoản khác!" };
        }

        const newUser: StoredUser = {
          id: `U-${Math.floor(100 + Math.random() * 900)}`,
          name: nameClean,
          email: emailClean,
          phone: data.phone?.trim() || "0900000000",
          address: data.address?.trim() || "Chưa cập nhật",
          role: "user",
          password: passClean,
        };

        const updatedUsers = [...currentUsers, newUser];
        const { password: _, ...profile } = newUser;

        // Auto log in new registered user
        set({
          users: updatedUsers,
          currentUser: profile,
        });

        return {
          success: true,
          message: "Đăng ký tài khoản thành công!",
          user: profile,
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

        const newProfile: UserProfile = {
          ...current,
          ...updatedData,
        };

        const currentUsers = get().users && get().users.length > 0 ? get().users : DEFAULT_USERS;
        const updatedUsers = currentUsers.map((u) => {
          if (u.id === current.id || u.email.toLowerCase() === current.email.toLowerCase()) {
            return {
              ...u,
              ...updatedData,
            };
          }
          return u;
        });

        set({
          currentUser: newProfile,
          users: updatedUsers,
        });

        return {
          success: true,
          message: "Cập nhật thông tin thành công!",
        };
      },
    }),
    {
      name: "hightech-auth",
    }
  )
);
