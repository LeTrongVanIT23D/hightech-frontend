export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  description: string;
  isNew?: boolean;
  isSale?: boolean;
  rating: number;
  reviews: number;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Air Max Phantom Elite",
    price: 3500000,
    originalPrice: 4200000,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800",
    ],
    category: "Giày",
    sizes: ["39", "40", "41", "42", "43", "44"],
    colors: [
      { name: "Đỏ", hex: "#ff0000" },
      { name: "Đen", hex: "#000000" },
      { name: "Trắng", hex: "#ffffff" },
    ],
    description:
      "Giày chạy bộ cao cấp với đệm Air Max thế hệ mới, mang lại sự êm ái tối đa. Thiết kế khí động học giúp tối ưu hiệu suất chạy. Upper mesh thoáng khí, đế ngoài cao su bền bỉ.",
    isNew: true,
    isSale: true,
    rating: 4.8,
    reviews: 256,
  },
  {
    id: "2",
    name: "UltraBoost X Pro",
    price: 4200000,
    images: [
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800",
    ],
    category: "Giày",
    sizes: ["39", "40", "41", "42", "43"],
    colors: [
      { name: "Đen", hex: "#000000" },
      { name: "Xám", hex: "#888888" },
    ],
    description:
      "Công nghệ Boost mang lại khả năng hoàn trả năng lượng vượt trội. Thiết kế ôm chân với Primeknit 360, đế Continental™ cho độ bám tốt trên mọi bề mặt.",
    isNew: true,
    rating: 4.9,
    reviews: 412,
  },
  {
    id: "3",
    name: "Pro Dri-FIT Training Tee",
    price: 890000,
    originalPrice: 1200000,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800",
    ],
    category: "Áo",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Đen", hex: "#000000" },
      { name: "Trắng", hex: "#ffffff" },
      { name: "Đỏ", hex: "#ff0000" },
    ],
    description:
      "Áo tập luyện với công nghệ Dri-FIT giúp thoát mồ hôi nhanh chóng. Chất liệu co giãn 4 chiều, đường may phẳng không gây kích ứng da. Thiết kế thể thao năng động.",
    isSale: true,
    rating: 4.6,
    reviews: 189,
  },
  {
    id: "4",
    name: "Elite Compression Shorts",
    price: 750000,
    images: [
      "https://images.unsplash.com/photo-1742473531981-12c925e98c19?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    category: "Quần",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Đen", hex: "#000000" },
      { name: "Xám Đậm", hex: "#333333" },
    ],
    description:
      "Quần short nén cao cấp hỗ trợ cơ bắp tối ưu khi tập luyện. Công nghệ thoáng khí giúp giữ cơ thể mát mẻ. Túi ẩn tiện lợi cho điện thoại.",
    rating: 4.5,
    reviews: 134,
  },
  {
    id: "5",
    name: "Phantom React Flyknit",
    price: 3800000,
    images: [
      "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800",
      "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800",
    ],
    category: "Giày",
    sizes: ["39", "40", "41", "42", "43", "44", "45"],
    colors: [
      { name: "Trắng", hex: "#ffffff" },
      { name: "Đỏ", hex: "#ff0000" },
    ],
    description:
      "Giày lifestyle cao cấp kết hợp Flyknit và React foam. Thiết kế hiện đại phù hợp cả tập luyện và dạo phố. Bề mặt Flyknit thoáng khí và ôm chân hoàn hảo.",
    isNew: true,
    rating: 4.7,
    reviews: 328,
  },
  {
    id: "6",
    name: "Windrunner Jacket Pro",
    price: 2400000,
    originalPrice: 3000000,
    images: [
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800",
    ],
    category: "Áo",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Đen", hex: "#000000" },
      { name: "Đỏ Đậm", hex: "#cc0000" },
    ],
    description:
      "Áo khoác gió Windrunner phiên bản Pro với chất liệu chống nước và chống gió. Thiết kế chevron cổ điển kết hợp công nghệ hiện đại. Mũ trùm điều chỉnh được.",
    isSale: true,
    rating: 4.8,
    reviews: 203,
  },
  {
    id: "7",
    name: "Sport Backpack Elite",
    price: 1500000,
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
    ],
    category: "Phụ kiện",
    sizes: ["One Size"],
    colors: [
      { name: "Đen", hex: "#000000" },
    ],
    description:
      "Balo thể thao cao cấp dung tích 30L với ngăn laptop 15.6 inch. Chất liệu chống nước, dây đeo êm vai có đệm. Nhiều ngăn tiện ích cho gym và du lịch.",
    isNew: true,
    rating: 4.6,
    reviews: 156,
  },
  {
    id: "8",
    name: "Performance Training Pants",
    price: 1200000,
    images: [
      "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800",
    ],
    category: "Quần",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Đen", hex: "#000000" },
      { name: "Xám", hex: "#666666" },
    ],
    description:
      "Quần tập luyện dài với chất liệu co giãn premium. Công nghệ thoáng khí giữ cơ thể thoải mái suốt buổi tập. Thiết kế tapered hiện đại, bo chun cổ chân.",
    rating: 4.4,
    reviews: 98,
  },
  {
    id: "9",
    name: "Flex Control TR4",
    price: 2800000,
    originalPrice: 3500000,
    images: [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?w=800",
      "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=800",
    ],
    category: "Giày",
    sizes: ["40", "41", "42", "43", "44"],
    colors: [
      { name: "Đen/Đỏ", hex: "#1a1a1a" },
      { name: "Trắng/Xám", hex: "#f0f0f0" },
    ],
    description:
      "Giày training đa năng với đế phẳng ổn định cho bài tập tạ. Flex grooves linh hoạt cho các bài cardio. Upper mesh bền bỉ với lớp phủ TPU chắc chắn.",
    isSale: true,
    rating: 4.5,
    reviews: 267,
  },
  {
    id: "10",
    name: "Sport Digital Watch Pro",
    price: 2200000,
    images: [
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800",
    ],
    category: "Phụ kiện",
    sizes: ["One Size"],
    colors: [
      { name: "Đen", hex: "#000000" },
      { name: "Đỏ", hex: "#ff0000" },
    ],
    description:
      "Đồng hồ thể thao thông minh với GPS tích hợp, đo nhịp tim, theo dõi giấc ngủ. Chống nước 50m, pin 7 ngày. Màn hình AMOLED sắc nét với giao diện tùy chỉnh.",
    isNew: true,
    rating: 4.7,
    reviews: 189,
  },
  {
    id: "11",
    name: "Aero Layer Running Vest",
    price: 1100000,
    images: [
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800",
    ],
    category: "Áo",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Đen", hex: "#000000" },
      { name: "Trắng", hex: "#ffffff" },
    ],
    description:
      "Áo vest chạy bộ siêu nhẹ với lớp AeroLayer cách nhiệt nhưng vẫn thoáng khí. Thiết kế gọn nhẹ có thể cuộn gọn vào túi. Phản quang an toàn khi chạy đêm.",
    rating: 4.3,
    reviews: 87,
  },
  {
    id: "12",
    name: "Premium Gym Duffle Bag",
    price: 1800000,
    originalPrice: 2200000,
    images: [
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800",
    ],
    category: "Phụ kiện",
    sizes: ["One Size"],
    colors: [
      { name: "Đen", hex: "#000000" },
      { name: "Xám", hex: "#444444" },
    ],
    description:
      "Túi gym cao cấp dung tích 45L với ngăn riêng cho giày và đồ ướt. Chất liệu canvas chống nước, khóa kéo YKK bền bỉ. Quai xách và dây đeo vai có đệm êm.",
    isSale: true,
    rating: 4.6,
    reviews: 143,
  },
];

export const categories = [
  {
    name: "Giày",
    slug: "giay",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
    count: 4,
  },
  {
    name: "Áo",
    slug: "ao",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600",
    count: 3,
  },
  {
    name: "Quần",
    slug: "quan",
    image: "https://images.unsplash.com/photo-1742473531981-12c925e98c19?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    count: 2,
  },
  {
    name: "Phụ kiện",
    slug: "phu-kien",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600",
    count: 3,
  },
];
