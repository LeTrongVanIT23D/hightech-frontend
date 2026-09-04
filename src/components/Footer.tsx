"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Phone, Mail } from "lucide-react";

const footerLinks = {
  "Sản phẩm": [
    { name: "Giày thể thao", href: "/shop?category=giay" },
    { name: "Áo thể thao", href: "/shop?category=ao" },
    { name: "Quần thể thao", href: "/shop?category=quan" },
    { name: "Phụ kiện", href: "/shop?category=phu-kien" },
    { name: "Mới nhất", href: "/shop" },
  ],
  "Hỗ trợ": [
    { name: "Hướng dẫn mua hàng", href: "#" },
    { name: "Chính sách đổi trả", href: "#" },
    { name: "Chính sách bảo hành", href: "#" },
    { name: "Câu hỏi thường gặp", href: "#" },
    { name: "Liên hệ", href: "#" },
  ],
  "Về chúng tôi": [
    { name: "Giới thiệu", href: "#" },
    { name: "Tuyển dụng", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Đối tác", href: "#" },
  ],
};

const SocialIcon = ({ type }: { type: string }) => {
  const icons: Record<string, React.ReactNode> = {
    instagram: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
      </svg>
    ),
    facebook: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
    twitter: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/>
      </svg>
    ),
    youtube: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/>
      </svg>
    ),
  };
  return <>{icons[type]}</>;
};

const socials = [
  { type: "instagram", href: "#", label: "Instagram" },
  { type: "facebook", href: "#", label: "Facebook" },
  { type: "twitter", href: "#", label: "Twitter" },
  { type: "youtube", href: "#", label: "Youtube" },
];

export default function Footer() {
  const pathname = usePathname();

  if (pathname === "/login" || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-surface border-t border-border">
      {/* Newsletter */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-3xl md:text-4xl tracking-wider text-white">
                ĐĂNG KÝ NHẬN TIN
              </h3>
              <p className="text-muted text-sm mt-2">
                Nhận thông tin khuyến mãi & sản phẩm mới nhất
              </p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <input
                type="email"
                placeholder="Email của bạn..."
                className="flex-1 md:w-80 bg-surface-light border border-border rounded-full px-5 py-3 text-sm text-white placeholder:text-muted focus:outline-none focus:border-primary transition-colors"
                id="newsletter-email"
              />
              <button className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full text-sm font-semibold transition-colors whitespace-nowrap"
                id="newsletter-submit"
              >
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
                <span className="text-white font-black text-sm">H</span>
              </div>
              <span className="font-display text-2xl tracking-wider text-white">
                HIGHTECH
              </span>
            </Link>
            <p className="text-muted text-sm leading-relaxed mb-6">
              Đồ thể thao cao cấp chính hãng. Phong cách thể thao hiện đại, chất lượng vượt trội.
            </p>
            <div className="space-y-3 text-sm text-muted">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-primary" />
                <span>123 Nguyễn Huệ, Q.1, TP.HCM</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-primary" />
                <span>1900 1234</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-primary" />
                <span>info@hightech.vn</span>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted text-sm hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted text-xs">
            © 2025 HIGHTECH Sports. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted hover:text-white hover:border-primary hover:bg-primary/10 transition-all"
              >
                <SocialIcon type={social.type} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
