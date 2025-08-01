import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ReactElement } from 'react';

// Dynamic import PdfUploader để tránh SSR
const DynamicPdfUploader = dynamic(() => import('@/components/PdfUploader'), {
  ssr: false,
  loading: () => (
    <div className="mx-auto max-w-md rounded-lg border bg-white p-6 shadow-md">
      <div className="text-center text-gray-600">Loading PDF uploader...</div>
    </div>
  ),
});

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-6">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="mb-4 inline-flex items-center text-blue-600 hover:text-blue-800"
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
            Back to Home
          </Link>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Upload PDF File
          </h1>
          <p className="text-gray-600">
            Upload your PDF file to create an interactive 3D flipbook
          </p>
        </div>

        <DynamicPdfUploader />

        <div className="mx-auto mt-12 max-w-2xl">
          <h2 className="mb-4 text-center text-xl font-semibold text-gray-800">
            How it works
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <span className="font-bold text-blue-600">1</span>
              </div>
              <h3 className="mb-2 font-semibold text-gray-800">Upload PDF</h3>
              <p className="text-sm text-gray-600">
                Select and upload your PDF file. We support files up to 50MB.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <span className="font-bold text-green-600">2</span>
              </div>
              <h3 className="mb-2 font-semibold text-gray-800">
                Page Extraction
              </h3>
              <p className="text-sm text-gray-600">
                Each page is automatically extracted and converted to
                high-quality images.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <span className="font-bold text-purple-600">3</span>
              </div>
              <h3 className="mb-2 font-semibold text-gray-800">3D Flipbook</h3>
              <p className="text-sm text-gray-600">
                View your book as an interactive 3D flipbook with realistic page
                turns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Use simple layout without navigation for better UX
UploadPage.getLayout = function getLayout(page: ReactElement) {
  return <main>{page}</main>;
};
