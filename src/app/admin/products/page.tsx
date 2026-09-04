"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Search, Edit, Trash2, X, Check } from "lucide-react";
import { useAdminStore } from "@/store/adminStore";
import { formatPrice } from "@/lib/utils";
import { showToast } from "@/components/Toast";
import { Product } from "@/data/products";

export default function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(1000000);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(undefined);
  const [category, setCategory] = useState("Giày");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setEditingProduct(null);
    setName("");
    setPrice(1000000);
    setOriginalPrice(undefined);
    setCategory("Giày");
    setDescription("");
    setImageUrl("https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800");
    setModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setPrice(p.price);
    setOriginalPrice(p.originalPrice);
    setCategory(p.category);
    setDescription(p.description);
    setImageUrl(p.images[0]);
    setModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || price <= 0) {
      showToast("Lỗi nhập liệu", "Vui lòng nhập tên và giá hợp lệ", "error");
      return;
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name,
        price,
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        category,
        description,
        images: [imageUrl || editingProduct.images[0]],
      });
      showToast("Cập nhật thành công!", `Đã sửa thông tin ${name}`, "success");
    } else {
      addProduct({
        name,
        price,
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        category,
        description,
        images: [imageUrl || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800"],
        sizes: ["39", "40", "41", "42", "43"],
        colors: [
          { name: "Đen", hex: "#000000" },
          { name: "Đỏ", hex: "#ff0000" },
        ],
        rating: 5.0,
        reviews: 1,
        isNew: true,
      });
      showToast("Thêm sản phẩm thành công!", name, "success");
    }

    setModalOpen(false);
  };

  const handleDelete = (id: string, productName: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${productName}"?`)) {
      deleteProduct(id);
      showToast("Đã xóa sản phẩm", productName, "info");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-primary">Quản Lý Kho Hàng</span>
          <h1 className="font-display text-4xl text-white tracking-wide mt-1">
            DANH SÁCH SẢN PHẨM ({products.length})
          </h1>
        </div>

        <button
          onClick={openAddModal}
          className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/25"
        >
          <Plus size={16} />
          Thêm Sản Phẩm Mới
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm kiếm sản phẩm theo tên hoặc danh mục..."
          className="w-full bg-surface border border-border rounded-xl py-3 pl-11 pr-4 text-xs text-white placeholder:text-muted focus:outline-none focus:border-primary"
        />
      </div>

      {/* Products Table */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-light text-muted uppercase border-b border-border">
                <th className="p-4">Hình ảnh</th>
                <th className="p-4">Tên sản phẩm</th>
                <th className="p-4">Danh mục</th>
                <th className="p-4">Giá bán</th>
                <th className="p-4">Đánh giá</th>
                <th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-white">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-surface-light/40 transition-colors">
                  <td className="p-4">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-surface-light">
                      <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-sm">{product.name}</td>
                  <td className="p-4">
                    <span className="bg-surface-light border border-border px-3 py-1 rounded-full text-muted">
                      {product.category}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-primary">{formatPrice(product.price)}</td>
                  <td className="p-4 text-amber-400 font-semibold">★ {product.rating}</td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(product)}
                      className="p-2 bg-surface-light hover:bg-white/10 text-white rounded-lg transition-colors"
                      title="Sửa"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
                      className="p-2 bg-surface-light hover:bg-primary/20 text-primary rounded-lg transition-colors"
                      title="Xóa"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setModalOpen(false)} />
          <div className="relative w-full max-w-xl bg-surface border border-border rounded-2xl p-6 md:p-8 z-10 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h3 className="font-display text-2xl text-white">
                {editingProduct ? "CHỈNH SỬA SẢN PHẨM" : "THÊM SẢN PHẨM MỚI"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-muted hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="text-muted block mb-1 font-medium">Tên sản phẩm *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface-light border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-muted block mb-1 font-medium">Giá bán (VND) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-surface-light border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-muted block mb-1 font-medium">Giá gốc (nếu có giảm giá)</label>
                  <input
                    type="number"
                    value={originalPrice || ""}
                    onChange={(e) => setOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full bg-surface-light border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-muted block mb-1 font-medium">Danh mục *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-surface-light border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                >
                  <option value="Giày">Giày</option>
                  <option value="Áo">Áo</option>
                  <option value="Quần">Quần</option>
                  <option value="Phụ kiện">Phụ kiện</option>
                </select>
              </div>

              <div>
                <label className="text-muted block mb-1 font-medium">URL Hình ảnh *</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-1742473531981-12c925e98c19?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  className="w-full bg-surface-light border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-muted block mb-1 font-medium">Mô tả sản phẩm</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-surface-light border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-6 py-2.5 bg-surface-light text-white rounded-full font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-primary text-white rounded-full font-bold uppercase tracking-wider flex items-center gap-1"
                >
                  <Check size={16} />
                  Lưu Sản Phẩm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
