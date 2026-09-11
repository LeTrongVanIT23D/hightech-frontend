import ImageWithFallback from "@/components/ImageWithFallback";
import Link from "next/link";
import { ArrowRight, Calendar, User, Tag } from "lucide-react";

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: string;
  image: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Top 5 Mẫu Giày Chạy Bộ Công Nghệ Đệm Tốt Nhất Năm 2026",
    excerpt: "Khám phá các dòng giày chạy bộ Air Max, UltraBoost thế hệ mới giúp giảm chấn thương và nâng cao hiệu suất marathon.",
    content: "Chạy bộ là bộ môn thể thao ngày càng phổ biến. Chọn một đôi giày phù hợp với bàn chân và dáng chạy không chỉ giúp tăng hiệu suất mà còn bảo vệ khớp gối tối đa. Bài viết này sẽ phân tích chi tiết công nghệ đệm khí Air Max và bọt khí Boost thế hệ mới...",
    date: "26/07/2026",
    author: "HLV Thể Thao Minh Đức",
    category: "Giày Thể Thao",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
  },
  {
    id: "2",
    title: "Bí Quyết Chọn Áo Tập Gym Thoát Mồ Hôi Chuẩn Dri-FIT",
    excerpt: "Chất liệu vải Dri-FIT co giãn 4 chiều giúp cơ thể luôn khô thoáng và tự tin trong các bài tập thể hình cường độ cao.",
    content: "Khi tập luyện với cường độ cao, cơ thể sản sinh lượng mồ hôi lớn. Việc chọn chất liệu áo tập đóng vai trò quyết định cảm giác thoải mái...",
    date: "20/07/2026",
    author: "Fitness Coach Hoàng Nam",
    category: "Thời Trang Tập Luyện",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
  },
  {
    id: "3",
    title: "Cách Bảo Quản Giày Thể Thao Giữ Form Như Mới Sau 2 Năm",
    excerpt: "Hướng dẫn các bước vệ sinh giày thể thao đúng cách, chọn xịt chống nước và giặt giày bằng dung dịch chuyên dụng.",
    content: "Một đôi giày thể thao cao cấp có thể duy trì độ bền và form dáng ban đầu qua nhiều năm nếu bạn biết bảo quản đúng chuẩn...",
    date: "15/07/2026",
    author: "Chuyên Gia HIGHTECH",
    category: "Mẹo Bảo Quản",
    image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800",
  },
];

export default function BlogListPage() {
  return (
    <main className="min-h-screen bg-background pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-xs text-muted mb-6">
          <Link href="/" className="hover:text-white transition-colors">
            Trang chủ
          </Link>
          <span>/</span>
          <span className="text-white">Blog Tin Tức Thể Thao</span>
        </nav>

        <div className="mb-10">
          <span className="text-xs uppercase font-extrabold tracking-widest text-primary">Kinh Nghiệm & Xu Hướng</span>
          <h1 className="font-display text-4xl md:text-5xl text-white tracking-wide mt-1">
            BLOG TIN TỨC THỂ THAO HIGHTECH
          </h1>
          <p className="text-muted text-sm mt-2">
            Cập nhật tin tức thời trang thể thao, bài viết hướng dẫn tập luyện và đánh giá thiết bị thể thao mới nhất.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-surface border border-border rounded-2xl overflow-hidden hover:border-primary/40 transition-colors flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-[16/10] bg-surface-light overflow-hidden">
                  <ImageWithFallback
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                    {post.category}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-4 text-xs text-muted">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <User size={12} />
                      {post.author}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl text-white group-hover:text-primary transition-colors leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs text-muted line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  href={`/blog/${post.id}`}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase text-primary hover:underline"
                >
                  Đọc tiếp bài viết
                  <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
