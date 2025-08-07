import { useState } from 'react';
import Head from 'next/head';
import EmbedWrapper from '@/components/EmbedWrapper';

export default function EmbedTestPage() {
  const [selectedSlug, setSelectedSlug] = useState('');
  const [customUrl, setCustomUrl] = useState('');

  // Sample book slugs for testing
  const sampleSlugs = ['andrea', 'sample-book', 'test-profile'];

  const getEmbedUrl = (slug: string) => {
    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? 'https://andrea-landing.vercel.app'
        : 'http://localhost:3001';
    return `${baseUrl}/embed/e-profile/${slug}`;
  };

  const getIframeCode = (slug: string) => {
    return `<iframe
  src="${getEmbedUrl(slug)}"
  width="100%"
  height="600px"
  style="border: none; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);"
  allowfullscreen
  title="${slug} E-Profile">
</iframe>`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      <Head>
        <title>E-Profile Embed Test</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="mb-4 text-3xl font-bold text-gray-900">
              E-Profile Embed Test
            </h1>
            <p className="text-gray-600">
              Test trang để kiểm tra tính năng embed E-Profile vào website khác.
            </p>
          </div>

          {/* Controls */}
          <div className="mb-8 rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold">
              Chọn E-Profile để test
            </h2>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Chọn từ danh sách mẫu:
              </label>
              <select
                value={selectedSlug}
                onChange={(e) => {
                  setSelectedSlug(e.target.value);
                  setCustomUrl('');
                }}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">-- Chọn E-Profile --</option>
                {sampleSlugs.map((slug) => (
                  <option key={slug} value={slug}>
                    {slug}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Hoặc nhập URL embed tùy chỉnh:
              </label>
              <input
                type="url"
                value={customUrl}
                onChange={(e) => {
                  setCustomUrl(e.target.value);
                  setSelectedSlug('');
                }}
                placeholder="https://andrea-landing.vercel.app/embed/e-profile/your-slug"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {(selectedSlug || customUrl) && (
              <div className="mt-6">
                <h3 className="mb-2 text-lg font-medium">Mã HTML để nhúng:</h3>
                <div className="relative">
                  <pre className="overflow-x-auto rounded-md bg-gray-800 p-4 text-sm text-white">
                    <code>
                      {selectedSlug
                        ? getIframeCode(selectedSlug)
                        : `<iframe
  src="${customUrl}"
  width="100%"
  height="600px"
  style="border: none; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);"
  allowfullscreen
  title="E-Profile">
</iframe>`}
                    </code>
                  </pre>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        selectedSlug ? getIframeCode(selectedSlug) : customUrl
                      )
                    }
                    className="absolute right-2 top-2 rounded bg-blue-500 px-3 py-1 text-xs text-white hover:bg-blue-600"
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Embed Demo */}
          {(selectedSlug || customUrl) && (
            <div className="space-y-8">
              {/* Desktop Preview */}
              <div>
                <h2 className="mb-4 text-xl font-semibold">
                  Desktop Preview (800x600)
                </h2>
                <div className="rounded-lg border bg-white p-4">
                  <EmbedWrapper
                    src={customUrl || getEmbedUrl(selectedSlug)}
                    width="100%"
                    height="600px"
                    title={`${selectedSlug || 'Custom'} E-Profile`}
                    className="rounded-lg"
                  />
                </div>
              </div>

              {/* Mobile Preview */}
              <div>
                <h2 className="mb-4 text-xl font-semibold">
                  Mobile Preview (375x600)
                </h2>
                <div className="mx-auto max-w-sm rounded-lg border bg-white p-4">
                  <EmbedWrapper
                    src={customUrl || getEmbedUrl(selectedSlug)}
                    width="100%"
                    height="600px"
                    title={`${selectedSlug || 'Custom'} E-Profile Mobile`}
                    className="rounded-lg"
                  />
                </div>
              </div>

              {/* Compact Preview */}
              <div>
                <h2 className="mb-4 text-xl font-semibold">
                  Compact Preview (100% x 400px)
                </h2>
                <div className="rounded-lg border bg-white p-4">
                  <EmbedWrapper
                    src={customUrl || getEmbedUrl(selectedSlug)}
                    width="100%"
                    height="400px"
                    title={`${selectedSlug || 'Custom'} E-Profile Compact`}
                    className="rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 rounded-lg bg-blue-50 p-6">
            <h2 className="mb-4 text-xl font-semibold text-blue-900">
              Hướng dẫn sử dụng
            </h2>
            <ul className="space-y-2 text-blue-800">
              <li>
                • <strong>URL Embed:</strong>{' '}
                <code>
                  https://andrea-landing.vercel.app/embed/e-profile/[slug]
                </code>
              </li>
              <li>
                • <strong>Khuyến nghị kích thước:</strong> Tối thiểu 400px chiều
                cao
              </li>
              <li>
                • <strong>Responsive:</strong> Width 100% sẽ tự động adapt
              </li>
              <li>
                • <strong>CORS:</strong> Được cấu hình để cho phép embed từ mọi
                domain
              </li>
              <li>
                • <strong>SEO:</strong> Trang embed có noindex để tránh
                duplicate content
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
