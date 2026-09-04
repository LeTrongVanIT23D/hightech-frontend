"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { create } from "zustand";

export type ToastType = "success" | "error" | "info";

interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastStore {
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, "id">) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export function showToast(title: string, message?: string, type: ToastType = "success") {
  useToastStore.getState().addToast({ title, message, type });
}

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-md ${
              toast.type === "success"
                ? "bg-black/90 border-green-500/40 text-white"
                : toast.type === "error"
                ? "bg-black/90 border-red-500/40 text-white"
                : "bg-black/90 border-blue-500/40 text-white"
            }`}
          >
            {toast.type === "success" && (
              <CheckCircle2 className="text-green-500 shrink-0 mt-0.5" size={20} />
            )}
            {toast.type === "error" && (
              <AlertCircle className="text-primary shrink-0 mt-0.5" size={20} />
            )}
            {toast.type === "info" && (
              <Info className="text-blue-400 shrink-0 mt-0.5" size={20} />
            )}

            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm leading-tight text-white">
                {toast.title}
              </h4>
              {toast.message && (
                <p className="text-xs text-muted mt-1 leading-snug">
                  {toast.message}
                </p>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-muted hover:text-white transition-colors p-1"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
