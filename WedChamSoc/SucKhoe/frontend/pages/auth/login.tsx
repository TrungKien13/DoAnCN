import React, { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Layout from "@/components/Layout/Layout";
import Link from "next/link";
import toast from "react-hot-toast";
import { authApi } from "@/lib/api";
import {
  UserIcon,
  LockClosedIcon,
  HeartIcon,
  ShieldCheckIcon,
  EyeIcon,
  EyeSlashIcon,
  KeyIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

const LoginPage: React.FC = () => {
  const { user, isLoading, login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 2FA states
  const [loginStep, setLoginStep] = useState<'password' | '2fa'>('password');
  const [tempToken, setTempToken] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await authApi.login(email, password);

      // If 2FA is required, switch to 2FA step
      if ((result as any).status === '2fa_required') {
        const r = result as { status: '2fa_required'; temp_token: string };
        setTempToken(r.temp_token);
        setLoginStep('2fa');
        toast.success("Vui lòng nhập mã xác thực 2 bước");
        return;
      }

      // Normal login success
      toast.success("Đăng nhập thành công!");
      router.push("/");
    } catch (error: any) {
      toast.error(error.response?.data?.detail || error.message || "Đăng nhập thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!twoFactorCode) {
      toast.error("Vui lòng nhập mã xác thực");
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await authApi.verify2FA(tempToken, twoFactorCode);
      toast.success("Đăng nhập thành công!");
      router.push("/");
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Mã xác thực không đúng");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToPassword = () => {
    setLoginStep('password');
    setTempToken("");
    setTwoFactorCode("");
  };

  if (isLoading) {
    return (
      <Layout showSidebar={false}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  if (user) {
    return null; // Will redirect
  }

  return (
    <Layout
      title="Đăng nhập - Hệ thống sức khỏe người cao tuổi"
      showSidebar={false}
    >
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <HeartIcon className="h-12 w-12 text-primary-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-elderly-text">
            Đăng nhập vào tài khoản
          </h2>
          <p className="mt-2 text-center text-elderly-text-light">
            Chăm sóc sức khỏe thông minh cho người cao tuổi
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-soft sm:rounded-lg sm:px-10">
            {/* Benefits */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-elderly-text mb-4">
                Tại sao nên sử dụng hệ thống của chúng tôi?
              </h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <HeartIcon className="h-5 w-5 text-primary-600 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-elderly-text-light">
                    Theo dõi sức khỏe dễ dàng và chính xác
                  </span>
                </div>
                <div className="flex items-start">
                  <ShieldCheckIcon className="h-5 w-5 text-primary-600 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-elderly-text-light">
                    Bảo mật thông tin tuyệt đối
                  </span>
                </div>
                <div className="flex items-start">
                  <UserIcon className="h-5 w-5 text-primary-600 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-elderly-text-light">
                    Giao diện thân thiện với người cao tuổi
                  </span>
                </div>
              </div>
            </div>

            {/* Login Form */}
            {loginStep === 'password' ? (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-elderly-text mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input w-full"
                  placeholder="Nhập địa chỉ email"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-elderly-text mb-2"
                >
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input w-full pr-12"
                    placeholder="Nhập mật khẩu"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-elderly-text-light" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-elderly-text-light" />
                    )}
                  </button>
                </div>
              </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  ) : (
                    <LockClosedIcon className="h-5 w-5 mr-2" />
                  )}
                  {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>

                <div className="text-center">
                  <span className="text-elderly-text-light">
                    Chưa có tài khoản?{" "}
                  </span>
                  <Link
                    href="/auth/register"
                    className="font-medium text-primary-600 hover:text-primary-500"
                  >
                    Đăng ký ngay
                  </Link>
                </div>
              </form>
            ) : (
              <form onSubmit={handle2FASubmit} className="space-y-4">
                {/* 2FA Header */}
                <div className="text-center mb-6">
                  <div className="flex justify-center mb-4">
                    <KeyIcon className="h-12 w-12 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-medium text-elderly-text">
                    Xác thực 2 bước
                  </h3>
                  <p className="text-elderly-text-light mt-2">
                    Vui lòng nhập mã 6 số từ ứng dụng xác thực của bạn
                  </p>
                </div>

                {/* 2FA Code Input */}
                <div>
                  <label
                    htmlFor="twoFactorCode"
                    className="block text-sm font-medium text-elderly-text mb-2"
                  >
                    Mã xác thực
                  </label>
                  <input
                    id="twoFactorCode"
                    type="text"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="form-input w-full text-center text-2xl tracking-widest"
                    placeholder="000000"
                    maxLength={6}
                    required
                  />
                  <p className="text-sm text-elderly-text-light mt-2">
                    Nhập mã 6 số từ Google Authenticator, Microsoft Authenticator hoặc ứng dụng tương tự
                  </p>
                </div>

                {/* 2FA Buttons */}
                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={isSubmitting || twoFactorCode.length !== 6}
                    className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    ) : (
                      <KeyIcon className="h-5 w-5 mr-2" />
                    )}
                    {isSubmitting ? "Đang xác thực..." : "Xác thực"}
                  </button>

                  <button
                    type="button"
                    onClick={handleBackToPassword}
                    className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-lg font-medium text-elderly-text bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                  >
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    Quay lại đăng nhập
                  </button>
                </div>

                {/* 2FA Help */}
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex">
                    <ShieldCheckIcon className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800">
                        Không có mã xác thực?
                      </h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Nếu bạn đã lưu mã dự phòng (backup codes), bạn có thể sử dụng chúng thay thế cho mã 6 số.
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            )}

            {/* Security Notice */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex">
                <ShieldCheckIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-blue-800">
                    Đăng nhập an toàn
                  </h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Chúng tôi sử dụng công nghệ bảo mật tiên tiến để bảo vệ
                    thông tin của bạn. Không bao giờ chia sẻ mật khẩu với người
                    khác.
                  </p>
                </div>
              </div>
            </div>

            {/* Help */}
            <div className="mt-6 text-center">
              <p className="text-sm text-elderly-text-light">
                Cần hỗ trợ?{" "}
                <Link
                  href="/help"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Liên hệ với chúng tôi
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white rounded-lg shadow-soft p-6">
            <h3 className="text-lg font-medium text-elderly-text mb-4 text-center">
              Dành cho người cao tuổi
            </h3>
            <div className="grid grid-cols-1 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary-600">
                  Font chữ lớn
                </div>
                <div className="text-elderly-text-light">Dễ đọc, dễ nhìn</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-600">
                  Đơn giản
                </div>
                <div className="text-elderly-text-light">
                  Giao diện thân thiện
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-600">24/7</div>
                <div className="text-elderly-text-light">Hỗ trợ mọi lúc</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
