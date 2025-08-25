import { ReactNode } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useState, useLayoutEffect } from 'react';
import {
  useSessionCleanup,
  sessionCleanupConfigs,
} from '@/hooks/useSessionCleanup';

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  backUrl?: string;
  backText?: string;
}

export default function AuthLayout({
  children,
  title = 'Đăng nhập',
  description = 'Vui lòng đăng nhập để tiếp tục',
  backUrl = '/',
  backText = 'Quay về trang chủ',
}: AuthLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            identifier: credentials.email,
            password: credentials.password,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          'Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.'
        );
      }

      const data = await response.json();

      // Store JWT token in localStorage
      localStorage.setItem('strapiToken', data.jwt);
      localStorage.setItem('strapiUser', JSON.stringify(data.user));

      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('strapiToken');
    localStorage.removeItem('strapiUser');
    setIsAuthenticated(false);
    setCredentials({ email: '', password: '' });
  };

  // Check if user is already logged in (useLayoutEffect to avoid UI flicker)
  useLayoutEffect(() => {
    const token = localStorage.getItem('strapiToken');
    const user = localStorage.getItem('strapiUser');
    if (token && user) {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <>
        <Head>
          <title>{title}</title>
          <meta name="description" content={description} />
        </Head>
        <div className="flex h-screen items-center justify-center bg-gray-100 py-10 max-md:px-2">
          <div className="container mx-auto">
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-3xl font-bold text-gray-900">{title}</h1>
              <p className="text-gray-600">{description}</p>
            </div>

            <div className="mx-auto max-w-md">
              <div className="rounded-10 border bg-white p-6 shadow-md">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block font-bold text-gray-800"
                    >
                      Email <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={credentials.email}
                      onChange={(e) =>
                        setCredentials({
                          ...credentials,
                          email: e.target.value,
                        })
                      }
                      placeholder="Nhập email của bạn"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={loading}
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="mb-2 block font-bold text-gray-800"
                    >
                      Mật khẩu <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        value={credentials.password}
                        onChange={(e) =>
                          setCredentials({
                            ...credentials,
                            password: e.target.value,
                          })
                        }
                        placeholder="Nhập mật khẩu của bạn"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 focus:border-blue-500 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={loading}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600 hover:text-gray-800"
                        disabled={loading}
                        title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                      >
                        {showPassword ? (
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.275 4.057-5.065 7-9.543 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="rounded-md bg-red-50 p-3">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={
                      loading || !credentials.email || !credentials.password
                    }
                    className="bg-brand-orange hover:bg-brand-orange-light w-full rounded-md px-5 py-2.5 font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                  </button>
                </form>

                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    Chưa có tài khoản? Liên hệ admin để được cấp quyền truy cập.
                  </p>
                </div>
              </div>
            </div>

            <Link
              href={backUrl}
              className="mx-auto mt-4 flex max-w-md items-center justify-center text-blue-600 hover:text-blue-800"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              {backText}
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      <div className="min-h-screen">
        {/* Main content */}
        <div className="">{children}</div>
      </div>
    </>
  );
}
