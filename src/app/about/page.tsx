import ImageWithFallback from "@/components/ImageWithFallback";
import Link from "next/link";
import { ShieldCheck, Zap, Award, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs uppercase font-extrabold tracking-widest text-primary">Về Chúng Tôi</span>
          <h1 className="font-display text-4xl md:text-6xl text-white tracking-wide mt-2">
            HIGHTECH SPORTSWEAR
          </h1>
          <p className="text-muted text-sm md:text-base mt-4 leading-relaxed">
            Thương hiệu cung cấp thời trang & thiết bị thể thao cao cấp chính hãng. Chúng tôi đồng hành cùng bạn trên hành trình vượt qua mọi giới hạn thể lực.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-surface border border-border rounded-2xl p-6 text-center space-y-3">
            <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-display text-xl text-white">100% CHÍNH HÃNG</h3>
            <p className="text-xs text-muted">Cam kết sản phẩm nhập khẩu chính hãng chất lượng cao nhất.</p>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-6 text-center space-y-3">
            <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto">
              <Zap size={24} />
            </div>
            <h3 className="font-display text-xl text-white">CÔNG NGHỆ TIÊN TIẾN</h3>
            <p className="text-xs text-muted">Đệm khí Air, bọt Boost và chất liệu thoáng khí Dri-FIT tối tân.</p>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-6 text-center space-y-3">
            <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto">
              <Award size={24} />
            </div>
            <h3 className="font-display text-xl text-white">DỊCH VỤ DẪN ĐẦU</h3>
            <p className="text-xs text-muted">Đổi trả 30 ngày, bảo hành 12 tháng và hỗ trợ khách hàng 24/7.</p>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-6 text-center space-y-3">
            <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto">
              <Users size={24} />
            </div>
            <h3 className="font-display text-xl text-white">50.000+ KHÁCH HÀNG</h3>
            <p className="text-xs text-muted">Được đông đảo vận động viên & người yêu thể thao tin tưởng lựa chọn.</p>
          </div>
        </div>

        {/* Story Split Section */}
        <div className="grid lg:grid-cols-2 gap-10 items-center bg-surface border border-border rounded-3xl overflow-hidden p-8 md:p-12">
          <div className="space-y-5">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Sứ Mệnh Thương Hiệu</span>
            <h2 className="font-display text-3xl md:text-4xl text-white leading-tight">
              MANG LẠI TRẢI NGHIỆM THỂ THAO ĐẲNG CẤP NIKE & ADIDAS
            </h2>
            <p className="text-xs text-muted leading-relaxed">
              Thành lập từ năm 2023, HIGHTECH Sports ra đời với khát vọng cung cấp những trang thiết bị và trang phục thể thao tối tân nhất cho người dùng Việt Nam. Mỗi đôi giày, mỗi chiếc áo tập đều được kiểm định khắt khe về độ bền, độ êm ái và tính thẩm mỹ cao cấp.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Khám phá sản phẩm
            </Link>
          </div>
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-surface-light">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800"
              alt="HIGHTECH Sports Story"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
