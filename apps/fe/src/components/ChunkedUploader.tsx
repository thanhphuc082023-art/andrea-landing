import React, { useState, useRef, useEffect } from 'react';
import { BookIcon, DocumentIcon, XCircleIcon } from './Icons';
import {
  useSessionCleanup,
  sessionCleanupConfigs,
} from '@/hooks/useSessionCleanup';

interface ChunkedUploaderProps {
  onUploadComplete: (result: { slug: string; bookId: string }) => void;
  onLogout: () => void;
}

const CHUNK_SIZE = 3 * 1024 * 1024; // 3MB chunks
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB max

export default function ChunkedUploader({
  onUploadComplete,
  onLogout,
}: ChunkedUploaderProps) {
  // Session cleanup on unmount
  useSessionCleanup(sessionCleanupConfigs.auth);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [uploadMessage, setUploadMessage] = useState<string>('');
  const [thumbnailMessage, setThumbnailMessage] = useState<string>('');
  const [pdfFileMessage, setPdfFileMessage] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  const [generatedSlug, setGeneratedSlug] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  // Chỉ mount trên client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  const generateUploadId = () => {
    return `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const uploadFileInChunks = async (
    file: File,
    uploadId: string
  ): Promise<string> => {
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    let uploadedChunks = 0;

    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const start = chunkIndex * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);

      const formData = new FormData();
      formData.append('chunk', chunk);
      formData.append('chunkNumber', chunkIndex.toString());
      formData.append('totalChunks', totalChunks.toString());
      formData.append('filename', file.name);
      formData.append('uploadId', uploadId);

      const token = localStorage.getItem('strapiToken');
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/upload-chunk', {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        // Check if unauthorized - clear token
        if (response.status === 401) {
          localStorage.removeItem('strapiToken');
          localStorage.removeItem('strapiUser');
          throw new Error(
            'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
          );
        }

        throw new Error(`Failed to upload chunk ${chunkIndex + 1}`);
      }

      uploadedChunks++;
      setUploadProgress((uploadedChunks / totalChunks) * 90); // Reserve 10% for final processing
    }

    return uploadId;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile || !title.trim()) {
      setUploadMessage('Vui lòng chọn file PDF và nhập tiêu đề');
      return;
    }

    if (!thumbnailFile) {
      setThumbnailMessage('Ảnh thumbnail là bắt buộc.');
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setPdfFileMessage(
        `File quá lớn. Kích thước tối đa là ${MAX_FILE_SIZE / (1024 * 1024)}MB.`
      );
      return;
    }

    // Clear any previous error messages
    setPdfFileMessage('');
    setThumbnailMessage('');
    setUploadMessage('');

    setLoading(true);
    setError('');
    setUploadProgress(0);

    try {
      // Step 1: Upload PDF in chunks
      const uploadId = generateUploadId();
      await uploadFileInChunks(selectedFile, uploadId);

      // Step 2: Upload thumbnail if provided
      let thumbnailUploadId: string | null = null;
      if (thumbnailFile) {
        thumbnailUploadId = generateUploadId();
        await uploadFileInChunks(thumbnailFile, thumbnailUploadId);
      }

      setUploadProgress(95);

      // Step 3: Create book entry
      const token = localStorage.getItem('strapiToken');
      const response = await fetch('/api/create-book-from-chunks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          title: title.trim(),
          websiteUrl: websiteUrl.trim() || null,
          phoneNumber: phoneNumber.trim() || null,
          facebookUrl: facebookUrl.trim() || null,
          downloadUrl: downloadUrl.trim() || null,
          pdfUploadId: uploadId,
          thumbnailUploadId,
          originalFileName: selectedFile.name,
          originalThumbnailName: thumbnailFile?.name,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Check if unauthorized - clear token and redirect to login
        if (response.status === 401) {
          localStorage.removeItem('strapiToken');
          localStorage.removeItem('strapiUser');
          // Trigger logout callback to redirect user to login
          onLogout();
          return;
        }

        throw new Error(errorData.error || 'Không thể tạo E-Profile');
      }

      const result = await response.json();
      setUploadProgress(100);

      // Set generated slug for success message
      setGeneratedSlug(result.slug);

      // Clear form but keep the success message
      setSelectedFile(null);
      setTitle('');
      setWebsiteUrl('');
      setPhoneNumber('');
      setFacebookUrl('');
      setDownloadUrl('');
      setThumbnailFile(null);
      setUploadProgress(0);
      setPdfFileMessage('');
      setThumbnailMessage('');
      setUploadMessage('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      if (thumbnailInputRef.current) {
        thumbnailInputRef.current.value = '';
      }

      onUploadComplete(result);
    } catch (error) {
      console.error('Upload error:', error);

      // Hiển thị lỗi chi tiết hơn giống PdfUploader
      let errorMessage = '';

      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage =
            'Không thể kết nối tới server. Vui lòng kiểm tra kết nối mạng.';
        } else if (error.message.includes('Phiên đăng nhập đã hết hạn')) {
          errorMessage = error.message;
          // Auto logout after showing error
          setTimeout(() => {
            onLogout();
          }, 2000);
        } else {
          errorMessage = `${error.message}`;
        }
      } else {
        errorMessage = 'Vui lòng kiểm tra kết nối và thử lại.';
      }

      setUploadMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Clear previous error messages and success state
    setPdfFileMessage('');
    setError('');
    setUploadMessage('');
    setGeneratedSlug('');

    if (file.type !== 'application/pdf') {
      setPdfFileMessage('Vui lòng chọn một tệp PDF hợp lệ.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setPdfFileMessage(
        `File quá lớn. Kích thước tối đa là ${MAX_FILE_SIZE / (1024 * 1024)}MB.`
      );
      return;
    }

    setSelectedFile(file);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Clear previous error messages and success state
    setThumbnailMessage('');
    setError('');
    setUploadMessage('');
    setGeneratedSlug('');

    if (!file.type.startsWith('image/')) {
      setThumbnailMessage(
        'Vui lòng chọn một tệp hình ảnh hợp lệ cho thumbnail.'
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit for images
      setThumbnailMessage('Kích thước thumbnail phải nhỏ hơn 5MB.');
      return;
    }

    setThumbnailFile(file);
  };

  // Don't render until mounted on client
  if (!mounted) {
    return (
      <div className="rounded-10 mx-auto max-w-md border bg-white p-6">
        <div className="text-center">Đang tải uploader...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-10 relative border bg-white p-6 shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div>
            <label
              htmlFor="title"
              className="mb-2 block font-bold text-gray-800"
            >
              Tiêu đề <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError('');
                setUploadMessage('');
                setGeneratedSlug('');
              }}
              placeholder="Nhập tiêu đề cho E-Profile của bạn"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={loading}
              required
            />
          </div>

          {/* Website URL Input */}
          <div>
            <label
              htmlFor="websiteUrl"
              className="mb-2 block font-bold text-gray-800"
            >
              Đường dẫn Website
            </label>
            <input
              type="url"
              id="websiteUrl"
              value={websiteUrl}
              onChange={(e) => {
                setWebsiteUrl(e.target.value);
                setError('');
                setUploadMessage('');
                setGeneratedSlug('');
              }}
              placeholder="https://example.com"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={loading}
            />
          </div>

          {/* Phone Number Input */}
          <div>
            <label
              htmlFor="phoneNumber"
              className="mb-2 block font-bold text-gray-800"
            >
              Số điện thoại
            </label>
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                setError('');
                setUploadMessage('');
                setGeneratedSlug('');
              }}
              placeholder="Nhập số điện thoại"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={loading}
            />
          </div>

          {/* Facebook URL Input */}
          <div>
            <label
              htmlFor="facebookUrl"
              className="mb-2 block font-bold text-gray-800"
            >
              Đường dẫn Facebook
            </label>
            <input
              type="url"
              id="facebookUrl"
              value={facebookUrl}
              onChange={(e) => {
                setFacebookUrl(e.target.value);
                setError('');
                setUploadMessage('');
                setGeneratedSlug('');
              }}
              placeholder="https://facebook.com/yourpage"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={loading}
            />
          </div>

          {/* Download URL Input */}
          <div>
            <label
              htmlFor="downloadUrl"
              className="mb-2 block font-bold text-gray-800"
            >
              Đường dẫn tải xuống
            </label>
            <input
              type="url"
              id="downloadUrl"
              value={downloadUrl}
              onChange={(e) => {
                setDownloadUrl(e.target.value);
                setError('');
                setUploadMessage('');
                setGeneratedSlug('');
              }}
              placeholder="Nhập đường dẫn tải xuống"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={loading}
            />
            <p className="mt-1 text-xs text-gray-500">
              Để trống nếu sử dụng PDF đã upload làm file tải xuống
            </p>
          </div>

          {/* Thumbnail Upload */}
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
                      disabled={loading}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setThumbnailFile(null);
                        setThumbnailMessage('');
                        setError('');
                        setUploadMessage('');
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

          {/* PDF File Upload */}
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
                      disabled={loading}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedFile(null);
                        setPdfFileMessage('');
                        setError('');
                        setUploadMessage('');
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
                      Chỉ tệp PDF, tối đa 50MB (chunked upload)
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

          {/* Error Message */}
          {error && (
            <div className="rounded-md bg-red-50 p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Upload Message */}
          {uploadMessage && (
            <div className="text-center">
              <p className="text-sm text-red-600">{uploadMessage}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={
              loading || !selectedFile || !title.trim() || !thumbnailFile
            }
            className="bg-brand-orange hover:bg-brand-orange-light w-full rounded-md px-5 py-2.5 font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? `Đang tải lên... (${Math.round(uploadProgress)}%)`
              : 'Tạo E-Profile'}
          </button>

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

        {/* Logout Button - Alternative placement at bottom */}
        <div className="mt-4 text-center">
          <button
            onClick={onLogout}
            className="text-sm text-gray-600 hover:text-gray-800"
            disabled={loading}
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}
