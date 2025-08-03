'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  LogoutIcon,
  CloudUploadIcon,
  DocumentIcon,
  XCircleIcon,
  BookIcon,
} from './Icons';

const PdfUploader = ({ logout }: { logout: () => void }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadMessage, setUploadMessage] = useState<string>('');
  const [thumbnailMessage, setThumbnailMessage] = useState<string>('');
  const [pdfFileMessage, setPdfFileMessage] = useState<string>('');
  const [generatedSlug, setGeneratedSlug] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  // Chỉ mount trên client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Clear previous error messages and success state
    setPdfFileMessage('');
    setUploadMessage('');
    setGeneratedSlug('');

    // Validate file type
    if (file.type !== 'application/pdf') {
      setPdfFileMessage('Vui lòng chọn một tệp PDF hợp lệ.');
      return;
    }

    // Validate file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      setPdfFileMessage('Kích thước tệp phải nhỏ hơn 50MB.');
      return;
    }

    setSelectedFile(file);
  };

  const handleThumbnailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Clear previous error messages and success state
    setThumbnailMessage('');
    setUploadMessage('');
    setGeneratedSlug('');

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setThumbnailMessage(
        'Vui lòng chọn một tệp hình ảnh hợp lệ cho ảnh đại diện.'
      );
      return;
    }

    // Validate file size (5MB limit for images)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setThumbnailMessage('Kích thước tệp ảnh đại diện phải nhỏ hơn 5MB.');
      return;
    }

    setThumbnailFile(file);
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    // Validate form data
    if (!selectedFile) {
      setPdfFileMessage('Tệp PDF là bắt buộc.');
      return;
    }

    if (!thumbnailFile) {
      setThumbnailMessage('Ảnh thumbnail là bắt buộc.');
      return;
    }

    // Additional file validations
    if (selectedFile.type !== 'application/pdf') {
      setPdfFileMessage('Chỉ chấp nhận tệp PDF.');
      return;
    }

    if (selectedFile.size > 50 * 1024 * 1024) {
      setPdfFileMessage('Kích thước tệp phải nhỏ hơn 50MB.');
      return;
    }

    if (!thumbnailFile.type.startsWith('image/')) {
      setUploadMessage('Vui lòng chọn tệp ảnh hợp lệ cho thumbnail.');
      setThumbnailMessage('Chỉ chấp nhận tệp hình ảnh.');
      return;
    }

    if (thumbnailFile.size > 5 * 1024 * 1024) {
      setThumbnailMessage('Kích thước ảnh phải nhỏ hơn 5MB.');
      return;
    }

    // Clear any previous error messages
    setPdfFileMessage('');
    setThumbnailMessage('');

    setLoading(true);

    try {
      // Validate before sending
      if (!selectedFile || !title.trim() || !thumbnailFile) {
        return;
      }

      const formData = new FormData();
      formData.append('pdfFile', selectedFile);
      formData.append('title', title.trim());
      formData.append('thumbnail', thumbnailFile);

      // Get JWT token from localStorage
      const token = localStorage.getItem('strapiToken');

      const headers: HeadersInit = {};

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/upload-pdf', {
        method: 'POST',
        headers,
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setGeneratedSlug(result.slug);

        // Clear form
        setSelectedFile(null);
        setThumbnailFile(null);
        setTitle('');
        setPdfFileMessage('');
        setThumbnailMessage('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        if (thumbnailInputRef.current) {
          thumbnailInputRef.current.value = '';
        }
      } else {
        console.error('Upload failed:', result);

        // Hiển thị lỗi chi tiết từ server
        let errorMessage = '';

        if (result.error) {
          errorMessage += result.error;
        } else if (result.message) {
          errorMessage += result.message;
        } else {
          errorMessage += `HTTP ${response.status} - ${response.statusText || 'Lỗi không xác định'}`;
        }

        setUploadMessage(errorMessage);
      }
    } catch (error) {
      console.error('Upload error:', error);

      // Hiển thị lỗi chi tiết hơn
      let errorMessage = '';

      if (
        error instanceof TypeError &&
        error.message.includes('Failed to fetch')
      ) {
        errorMessage +=
          'Không thể kết nối tới server. Vui lòng kiểm tra kết nối mạng.';
      } else if (error instanceof Error) {
        errorMessage += `Lỗi: ${error.message}`;
      } else {
        errorMessage += 'Vui lòng kiểm tra kết nối và thử lại.';
      }

      setUploadMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Don't render until mounted on client
  if (!mounted) {
    return (
      <div className="rounded-10 mx-auto max-w-md border bg-white p-6">
        <div className="text-center">Đang tải trình tải PDF...</div>
      </div>
    );
  }

  return (
    <div className="rounded-10 relative mx-auto max-w-md border bg-white p-6 shadow-md">
      <button
        onClick={logout}
        className="absolute right-6 top-6"
        title="Đăng xuất"
      >
        <LogoutIcon className="h-5 w-5" />
      </button>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="title" className="mb-2 block font-bold text-gray-800">
            Tiêu đề <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setUploadMessage('');
              setGeneratedSlug('');
            }}
            placeholder="Nhập tiêu đề..."
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={loading}
            required
          />
        </div>

        <div>
          <label className="mb-2 block font-bold text-gray-800">
            Thumbnail <span className="text-red-600">*</span>
          </label>

          {/* Custom File Input for Thumbnail */}
          <div className="relative">
            <input
              ref={thumbnailInputRef}
              type="file"
              id="thumbnail-file"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="sr-only"
              disabled={loading}
              required
            />

            <label
              htmlFor="thumbnail-file"
              className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-all duration-200 ${
                thumbnailFile
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
              } ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              {thumbnailFile ? (
                <div className="flex w-full items-center space-x-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                    <BookIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-blue-900">
                      {thumbnailFile.name}
                    </p>
                    <p className="text-xs text-blue-600">
                      {(thumbnailFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setThumbnailFile(null);
                      setThumbnailMessage('');
                      setGeneratedSlug('');
                      if (thumbnailInputRef.current) {
                        thumbnailInputRef.current.value = '';
                      }
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600 transition-colors hover:bg-red-200"
                  >
                    <XCircleIcon className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <BookIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm font-medium text-gray-900">
                    Chọn ảnh thumbnail
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF, WebP tối đa 5MB
                  </p>
                </div>
              )}
            </label>
          </div>

          {/* Thumbnail Message */}
          {thumbnailMessage && (
            <div className="mt-2">
              <p className="text-sm text-red-600">{thumbnailMessage}</p>
            </div>
          )}
        </div>

        <div>
          <label className="mb-2 block font-bold text-gray-800">
            Tệp PDF <span className="text-red-600">*</span>
          </label>

          {/* Custom File Input for PDF */}
          <div className="relative">
            <input
              ref={fileInputRef}
              type="file"
              id="pdf-file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="sr-only"
              disabled={loading}
              required
            />

            <label
              htmlFor="pdf-file"
              className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-all duration-200 ${
                selectedFile
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
              } ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              {selectedFile ? (
                <div className="flex w-full items-center space-x-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                    <DocumentIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-blue-900">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-blue-600">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedFile(null);
                      setPdfFileMessage('');
                      setGeneratedSlug('');
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600 transition-colors hover:bg-red-200"
                  >
                    <XCircleIcon className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm font-medium text-gray-900">
                    Chọn tệp PDF
                  </p>
                  <p className="text-xs text-gray-500">
                    Chỉ tệp PDF, tối đa 50MB
                  </p>
                </div>
              )}
            </label>
          </div>

          {/* PDF Message */}
          {pdfFileMessage && (
            <div className="mt-2">
              <p className="text-sm text-red-600">{pdfFileMessage}</p>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !selectedFile || !title.trim() || !thumbnailFile}
          className="bg-brand-orange hover:bg-brand-orange-light w-full rounded-md px-5 py-2.5 font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Đang xử lý...' : 'Tạo E-profile'}
        </button>

        {/* Upload Message */}
        {uploadMessage && (
          <div className="text-center">
            <p className={`text-sm text-red-600`}>{uploadMessage}</p>
          </div>
        )}

        {/* Generated Slug Link */}
        {generatedSlug && (
          <div className="text-center">
            <p className="mb-2 text-sm text-green-600">
              Tạo E-Profile thành công!
            </p>
            <a
              href={`/e-profile/${generatedSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 underline hover:text-blue-800"
            >
              Xem E-Profile →
            </a>
          </div>
        )}
      </form>
    </div>
  );
};

export default PdfUploader;
