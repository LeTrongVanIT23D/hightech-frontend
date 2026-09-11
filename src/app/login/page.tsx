'use client';

import { useState } from 'react';
import ImageWithFallback from '@/components/ImageWithFallback';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, ShieldCheck, KeyRound, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { showToast } from '@/components/Toast';

export default function LoginPage() {
  const router = useRouter();
  const { login, register } = useAuthStore();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [loginForm, setLoginForm] = useState({ identifier: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
  });

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    const res = login(loginForm.identifier, loginForm.password);
    setIsLoading(false);

    if (res.success) {
      showToast('Đăng nhập thành công', res.message, 'success');
      router.replace('/profile');
    } else {
      setErrorMessage(res.message);
      showToast('Đăng nhập thất bại', res.message, 'error');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (registerForm.password !== registerForm.confirmPassword) {
      const msg = 'Mật khẩu xác nhận không khớp. Vui lòng nhập lại!';
      setErrorMessage(msg);
      showToast('Lỗi đăng ký', msg, 'error');
      return;
    }

    setIsLoading(true);
    const res = register({
      name: registerForm.name,
      email: registerForm.email,
      password: registerForm.password,
      phone: registerForm.phone,
      address: registerForm.address,
    });
    setIsLoading(false);

    if (res.success) {
      showToast('Đăng ký thành công', res.message, 'success');
      router.replace('/profile');
    } else {
      setErrorMessage(res.message);
      showToast('Đăng ký thất bại', res.message, 'error');
    }
  };

  const fillQuickAccount = (identifier: string, pass: string) => {
    setLoginForm({ identifier, password: pass });
    setErrorMessage('');
    showToast('Đã điền thông tin', `Tài khoản: ${identifier}`, 'info');
  };

  const formVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 40 : -40,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -40 : 40,
      opacity: 0,
    }),
  };

  const direction = isLogin ? -1 : 1;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Brand Image (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200"
          alt="Hightech Sports"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

        {/* Brand Content */}
        <div className="relative z-10 flex flex-col justify-end p-12 lg:p-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-xs uppercase tracking-widest text-primary font-bold block mb-2">
              Hệ thống E-Commerce Thể Thao
            </span>
            <h1 className="font-display text-6xl xl:text-7xl text-white leading-none mb-4">
              HIGHTECH
              <br />
              SPORTS
            </h1>
            <p className="text-xl text-white/70 font-light">
              Vượt qua mọi giới hạn • Trải nghiệm mua sắm thể thao chuyên nghiệp
            </p>
            <div className="w-16 h-1 bg-primary mt-6" />
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-12 lg:px-16 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-block">
              <h2 className="font-display text-3xl text-white">
                HIGHTECH <span className="text-primary">SPORTS</span>
              </h2>
            </Link>
          </div>

          {/* Quick Demo Credentials Box */}
          <div className="mb-6 p-4 rounded-xl bg-surface-light border border-border/80 text-xs">
            <div className="flex items-center gap-2 text-white font-semibold mb-2">
              <KeyRound size={14} className="text-primary" />
              <span>Tài khoản có sẵn để test DevOps (Click để điền nhanh):</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillQuickAccount('admin', 'admin123')}
                className="flex items-center justify-between p-2 rounded-lg bg-surface border border-primary/40 hover:border-primary text-left transition-colors group"
              >
                <div>
                  <div className="font-bold text-primary flex items-center gap-1">
                    <ShieldCheck size={12} /> Admin
                  </div>
                  <div className="text-muted text-[11px]">admin / admin123</div>
                </div>
                <ArrowRight size={12} className="text-muted group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
              </button>

              <button
                type="button"
                onClick={() => fillQuickAccount('an.nguyen@gmail.com', '123456')}
                className="flex items-center justify-between p-2 rounded-lg bg-surface border border-border hover:border-white/40 text-left transition-colors group"
              >
                <div>
                  <div className="font-bold text-white flex items-center gap-1">
                    <User size={12} /> Khách hàng
                  </div>
                  <div className="text-muted text-[11px]">an.nguyen... / 123456</div>
                </div>
                <ArrowRight size={12} className="text-muted group-hover:text-white transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 mb-6 bg-red-950/70 border border-red-800/80 rounded-xl text-red-200 text-xs text-center"
            >
              {errorMessage}
            </motion.div>
          )}

          <AnimatePresence mode="wait" custom={direction}>
            {isLogin ? (
              <motion.div
                key="login"
                custom={direction}
                variants={formVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                {/* Login Form */}
                <h1 className="font-display text-4xl sm:text-5xl text-white mb-2">
                  ĐĂNG NHẬP
                </h1>
                <p className="text-muted mb-6 text-sm">
                  Vui lòng đăng nhập để tiếp tục vào hệ thống.
                </p>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {/* Email / Username */}
                  <div>
                    <label className="text-xs text-muted block mb-2 font-medium">
                      Tên đăng nhập hoặc Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                      <input
                        type="text"
                        value={loginForm.identifier}
                        onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })}
                        placeholder="admin hoặc your@email.com"
                        className="w-full bg-surface-light border border-border rounded-lg pl-11 pr-4 py-3 text-white text-sm placeholder:text-muted/50 focus:border-primary focus:outline-none transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="text-xs text-muted block mb-2 font-medium">Mật khẩu</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        placeholder="Nhập mật khẩu"
                        className="w-full bg-surface-light border border-border rounded-lg pl-11 pr-12 py-3 text-white text-sm placeholder:text-muted/50 focus:border-primary focus:outline-none transition-colors"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
                        aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-full transition-all uppercase tracking-wider text-sm shadow-lg shadow-primary/30 mt-2"
                  >
                    {isLoading ? 'Đang xác thực...' : 'Đăng nhập ngay'}
                  </button>
                </form>

                {/* Switch to Register */}
                <p className="text-center text-muted mt-8 text-sm">
                  Chưa có tài khoản?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(false);
                      setErrorMessage('');
                      setShowPassword(false);
                    }}
                    className="text-primary hover:text-primary-light font-semibold transition-colors underline"
                  >
                    Đăng ký tài khoản mới
                  </button>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="register"
                custom={direction}
                variants={formVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                {/* Register Form */}
                <h1 className="font-display text-4xl sm:text-5xl text-white mb-2">
                  ĐĂNG KÝ
                </h1>
                <p className="text-muted mb-6 text-sm">
                  Tạo tài khoản khách hàng mới để mua sắm.
                </p>

                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="text-xs text-muted block mb-1.5 font-medium">Họ và tên *</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                      <input
                        type="text"
                        value={registerForm.name}
                        onChange={(e) =>
                          setRegisterForm({ ...registerForm, name: e.target.value })
                        }
                        placeholder="Nguyễn Văn A"
                        className="w-full bg-surface-light border border-border rounded-lg pl-11 pr-4 py-2.5 text-white text-sm placeholder:text-muted/50 focus:border-primary focus:outline-none transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-xs text-muted block mb-1.5 font-medium">Email *</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                      <input
                        type="email"
                        value={registerForm.email}
                        onChange={(e) =>
                          setRegisterForm({ ...registerForm, email: e.target.value })
                        }
                        placeholder="your@email.com"
                        className="w-full bg-surface-light border border-border rounded-lg pl-11 pr-4 py-2.5 text-white text-sm placeholder:text-muted/50 focus:border-primary focus:outline-none transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="text-xs text-muted block mb-1.5 font-medium">Số điện thoại</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                      <input
                        type="tel"
                        value={registerForm.phone}
                        onChange={(e) =>
                          setRegisterForm({ ...registerForm, phone: e.target.value })
                        }
                        placeholder="0905 123 456"
                        className="w-full bg-surface-light border border-border rounded-lg pl-11 pr-4 py-2.5 text-white text-sm placeholder:text-muted/50 focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="text-xs text-muted block mb-1.5 font-medium">Địa chỉ giao hàng</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                      <input
                        type="text"
                        value={registerForm.address}
                        onChange={(e) =>
                          setRegisterForm({ ...registerForm, address: e.target.value })
                        }
                        placeholder="Địa chỉ nhận hàng (Ví dụ: Đà Nẵng)"
                        className="w-full bg-surface-light border border-border rounded-lg pl-11 pr-4 py-2.5 text-white text-sm placeholder:text-muted/50 focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="text-xs text-muted block mb-1.5 font-medium">Mật khẩu * (Tối thiểu 6 ký tự)</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={registerForm.password}
                        onChange={(e) =>
                          setRegisterForm({ ...registerForm, password: e.target.value })
                        }
                        placeholder="••••••••"
                        className="w-full bg-surface-light border border-border rounded-lg pl-11 pr-12 py-2.5 text-white text-sm placeholder:text-muted/50 focus:border-primary focus:outline-none transition-colors"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
                        aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="text-xs text-muted block mb-1.5 font-medium">Xác nhận mật khẩu *</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={registerForm.confirmPassword}
                        onChange={(e) =>
                          setRegisterForm({ ...registerForm, confirmPassword: e.target.value })
                        }
                        placeholder="Nhập lại mật khẩu"
                        className="w-full bg-surface-light border border-border rounded-lg pl-11 pr-12 py-2.5 text-white text-sm placeholder:text-muted/50 focus:border-primary focus:outline-none transition-colors"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
                        aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Register Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-full transition-all uppercase tracking-wider text-sm shadow-lg shadow-primary/30 mt-3"
                  >
                    {isLoading ? 'Đang tạo tài khoản...' : 'Hoàn tất Đăng ký'}
                  </button>
                </form>

                {/* Switch to Login */}
                <p className="text-center text-muted mt-6 text-sm">
                  Đã có tài khoản?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(true);
                      setErrorMessage('');
                      setShowPassword(false);
                      setShowConfirmPassword(false);
                    }}
                    className="text-primary hover:text-primary-light font-semibold transition-colors underline"
                  >
                    Quay lại Đăng nhập
                  </button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
