const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5100";

async function fetchJson<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Lỗi yêu cầu HTTP: ${response.status}`);
  }
  return response.json();
}

export const api = {
  // Authentication
  auth: {
    login: (data: { identifier: string; password: string }) =>
      fetchJson<any>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    register: (data: { name: string; email: string; password: string; phone?: string; address?: string }) =>
      fetchJson<any>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    getUsers: () => fetchJson<any[]>("/api/auth/users"),
  },

  // Products
  products: {
    getAll: (params?: { category?: string; search?: string; minPrice?: number; maxPrice?: number; sortBy?: string }) => {
      const query = new URLSearchParams();
      if (params?.category) query.set("category", params.category);
      if (params?.search) query.set("search", params.search);
      if (params?.minPrice !== undefined) query.set("minPrice", params.minPrice.toString());
      if (params?.maxPrice !== undefined) query.set("maxPrice", params.maxPrice.toString());
      if (params?.sortBy) query.set("sortBy", params.sortBy);

      const qs = query.toString();
      return fetchJson<any[]>(`/api/products${qs ? `?${qs}` : ""}`);
    },
    getById: (id: string) => fetchJson<any>(`/api/products/${id}`),
    getCategories: () => fetchJson<any[]>("/api/products/categories"),
    create: (product: any) =>
      fetchJson<any>("/api/products", {
        method: "POST",
        body: JSON.stringify(product),
      }),
    update: (id: string, product: any) =>
      fetchJson<any>(`/api/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(product),
      }),
    delete: (id: string) =>
      fetchJson<any>(`/api/products/${id}`, {
        method: "DELETE",
      }),
  },

  // Orders
  orders: {
    getAll: (status?: string) => {
      const qs = status ? `?status=${encodeURIComponent(status)}` : "";
      return fetchJson<any[]>(`/api/orders${qs}`);
    },
    getById: (id: string) => fetchJson<any>(`/api/orders/${id}`),
    track: (trackingCodeOrId: string) => fetchJson<any>(`/api/orders/tracking/${encodeURIComponent(trackingCodeOrId)}`),
    create: (order: any) =>
      fetchJson<any>("/api/orders", {
        method: "POST",
        body: JSON.stringify(order),
      }),
    updateStatus: (id: string, status: string) =>
      fetchJson<any>(`/api/orders/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      }),
  },

  // Vouchers
  vouchers: {
    getAll: (onlyActive: boolean = false) => fetchJson<any[]>(`/api/vouchers?onlyActive=${onlyActive}`),
    apply: (code: string, subtotal: number) =>
      fetchJson<{ valid: boolean; message: string; discountPercent?: number; discountAmount?: number }>(
        "/api/vouchers/apply",
        {
          method: "POST",
          body: JSON.stringify({ code, subtotal }),
        }
      ),
    create: (voucher: any) =>
      fetchJson<any>("/api/vouchers", {
        method: "POST",
        body: JSON.stringify(voucher),
      }),
    toggle: (code: string) =>
      fetchJson<any>(`/api/vouchers/${encodeURIComponent(code)}/toggle`, {
        method: "PUT",
      }),
    delete: (code: string) =>
      fetchJson<any>(`/api/vouchers/${encodeURIComponent(code)}`, {
        method: "DELETE",
      }),
  },

  // Dashboard Stats
  dashboard: {
    getStats: () => fetchJson<any>("/api/dashboard/stats"),
  },
};
