import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import { Calendar, User, ArrowLeft, Share2 } from "lucide-react";
import { blogPosts } from "../page";

export default function BlogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const post = blogPosts.find((p) => p.id === id) || blogPosts[0];

  return (
    <main className="min-h-screen bg-background pt-24 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs text-muted hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Quay lại danh sách bài viết
        </Link>

        <span className="bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase border border-primary/30">
          {post.category}
        </span>

        <h1 className="font-display text-4xl md:text-5xl text-white mt-4 mb-4 leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-6 text-xs text-muted pb-6 border-b border-border mb-8">
          <span className="flex items-center gap-1.5 text-white">
            <User size={14} className="text-primary" />
            {post.author}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar size={14} />
            {post.date}
          </span>
        </div>

        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-surface-light mb-10 border border-border">
          <Image src={post.image} alt={post.title} fill className="object-cover" priority />
        </div>

        <div className="prose prose-invert max-w-none text-muted space-y-6 leading-relaxed text-sm md:text-base">
          <p className="font-semibold text-white text-base md:text-lg leading-relaxed">
            {post.excerpt}
          </p>
          <p>{post.content}</p>
          <p>
            Đối với các vận động viên lẫn người tập luyện phong trào, việc nâng cấp thiết bị thể thao chất lượng cao như giày đệm bọt khí hay quần áo nén co giãn 4 chiều sẽ nâng tầm đáng kể trải nghiệm và giảm bớt mệt mỏi sau mỗi buổi tập.
          </p>
          <div className="bg-surface border-l-4 border-primary p-6 rounded-r-2xl my-8 italic text-white">
            &quot;Sự kết hợp giữa công nghệ chất liệu hiện đại và phong cách thời trang năng động là chìa khóa bứt phá mọi giới hạn thể thao.&quot;
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex items-center justify-between">
          <Link
            href="/shop"
            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider"
          >
            Khám phá bộ sưu tập thể thao
          </Link>
        </div>
      </div>
    </main>
  );
}
