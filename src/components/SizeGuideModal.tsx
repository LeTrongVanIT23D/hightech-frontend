"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Ruler } from "lucide-react";
import { useAdminStore } from "@/store/adminStore";

export default function SizeGuideModal() {
  const { sizeGuideOpen, setSizeGuideOpen } = useAdminStore();

  if (!sizeGuideOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSizeGuideOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-2xl bg-surface border border-border rounded-2xl p-6 md:p-8 z-10 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
            <div className="flex items-center gap-2">
              <Ruler className="text-primary" size={24} />
              <h3 className="font-display text-2xl text-white tracking-wide">
                BẢNG QUY ĐỔI KÍCH CỠ CHUẨN (SIZE GUIDE)
              </h3>
            </div>
            <button
              onClick={() => setSizeGuideOpen(false)}
              className="text-muted hover:text-white p-1"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6 text-sm text-muted">
            {/* Giày thể thao */}
            <div>
              <h4 className="font-semibold text-white mb-3 text-base flex items-center gap-2">
                👟 1. Bảng Size Giày Thể Thao (Bàn châncm)
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse border border-border">
                  <thead>
                    <tr className="bg-surface-light text-white text-xs uppercase">
                      <th className="p-2.5 border border-border">Size EU</th>
                      <th className="p-2.5 border border-border">Size US</th>
                      <th className="p-2.5 border border-border">Chiêu dài bàn chân (cm)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-xs">
                    <tr>
                      <td className="p-2.5 border border-border font-bold text-white">39</td>
                      <td className="p-2.5 border border-border">6.5</td>
                      <td className="p-2.5 border border-border">24.5 cm</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 border border-border font-bold text-white">40</td>
                      <td className="p-2.5 border border-border">7.0</td>
                      <td className="p-2.5 border border-border">25.0 cm</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 border border-border font-bold text-white">41</td>
                      <td className="p-2.5 border border-border">8.0</td>
                      <td className="p-2.5 border border-border">26.0 cm</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 border border-border font-bold text-white">42</td>
                      <td className="p-2.5 border border-border">8.5</td>
                      <td className="p-2.5 border border-border">26.5 cm</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 border border-border font-bold text-white">43</td>
                      <td className="p-2.5 border border-border">9.5</td>
                      <td className="p-2.5 border border-border">27.5 cm</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 border border-border font-bold text-white">44</td>
                      <td className="p-2.5 border border-border">10.0</td>
                      <td className="p-2.5 border border-border">28.0 cm</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Áo Quần */}
            <div>
              <h4 className="font-semibold text-white mb-3 text-base flex items-center gap-2">
                👕 2. Bảng Size Áo & Quần Thể Thao
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse border border-border">
                  <thead>
                    <tr className="bg-surface-light text-white text-xs uppercase">
                      <th className="p-2.5 border border-border">Size</th>
                      <th className="p-2.5 border border-border">Chiều cao (cm)</th>
                      <th className="p-2.5 border border-border">Cân nặng (kg)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-xs">
                    <tr>
                      <td className="p-2.5 border border-border font-bold text-white">S</td>
                      <td className="p-2.5 border border-border">155 - 165 cm</td>
                      <td className="p-2.5 border border-border">50 - 60 kg</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 border border-border font-bold text-white">M</td>
                      <td className="p-2.5 border border-border">165 - 172 cm</td>
                      <td className="p-2.5 border border-border">60 - 70 kg</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 border border-border font-bold text-white">L</td>
                      <td className="p-2.5 border border-border">170 - 178 cm</td>
                      <td className="p-2.5 border border-border">70 - 78 kg</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 border border-border font-bold text-white">XL</td>
                      <td className="p-2.5 border border-border">175 - 185 cm</td>
                      <td className="p-2.5 border border-border">78 - 85 kg</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
