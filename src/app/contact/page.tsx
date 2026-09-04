"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { showToast } from "@/components/Toast";

export default function ContactPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Gửi liên hệ thành công!", "Chúng tôi sẽ phản hồi lại bạn qua Email sớm nhất.", "success");
    setFullName("");
    setEmail("");
    setMessage("");
  };

  return (
    <main className="min-h-screen bg-background pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase font-extrabold tracking-widest text-primary">Hỗ Trợ Khách Hàng</span>
          <h1 className="font-display text-4xl md:text-5xl text-white tracking-wide mt-1">
            LIÊN HỆ VỚI HIGHTECH SPORTS
          </h1>
          <p className="text-muted text-sm mt-2">
            Bạn có thắc mắc về đơn hàng, chính sách bảo hành hoặc muốn tư vấn chọn size? Hãy gửi tin nhắn cho chúng tôi!
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Info Card */}
          <div className="lg:col-span-5 bg-surface border border-border rounded-3xl p-8 space-y-6">
            <h3 className="font-display text-2xl text-white border-b border-border pb-4">
              THÔNG TIN LIÊN HỆ
            </h3>

            <div className="space-y-4 text-sm text-muted">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/20 text-primary rounded-xl flex items-center justify-center shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <strong className="text-white block text-sm">Địa chỉ trụ sở chính</strong>
                  <span>123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh</span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/20 text-primary rounded-xl flex items-center justify-center shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <strong className="text-white block text-sm">Hotline tư vấn (Miễn phí)</strong>
                  <span>1900 1234 (8:00 - 21:00 hàng ngày)</span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/20 text-primary rounded-xl flex items-center justify-center shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <strong className="text-white block text-sm">Email hỗ trợ khách hàng</strong>
                  <span>cskh@hightechsports.vn</span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/20 text-primary rounded-xl flex items-center justify-center shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <strong className="text-white block text-sm">Giờ làm việc cửa hàng</strong>
                  <span>Thứ 2 - Chủ Nhật: 8:30 AM - 10:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-surface border border-border rounded-3xl p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <h3 className="font-display text-2xl text-white border-b border-border pb-4">
                GỬI TIN NHẮN TƯ VẤN
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted block mb-1.5 font-medium">Họ và tên *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nguyễn Văn An"
                    className="w-full bg-surface-light border border-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted block mb-1.5 font-medium">Địa chỉ Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="an.nguyen@example.com"
                    className="w-full bg-surface-light border border-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-muted block mb-1.5 font-medium">Nội dung tin nhắn / Thắc mắc *</label>
                <textarea
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Nhập câu hỏi hoặc nội dung bạn cần hỗ trợ..."
                  className="w-full bg-surface-light border border-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <button
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <Send size={16} />
                Gửi Tin Nhắn Phản Hồi
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
