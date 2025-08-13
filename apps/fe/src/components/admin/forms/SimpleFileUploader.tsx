import React, { useState, useRef, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import {
  useSessionCleanup,
  sessionCleanupConfigs,
} from '@/hooks/useSessionCleanup';

interface SimpleFileUploaderProps {
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  selectedFile?: File | null;
  acceptedTypes?: string[];
  maxFileSize?: number;
  label?: string;
  description?: string;
  className?: string;
  onLogout?: () => void;
  onUploadComplete?: (result: { uploadId: string; fileName: string }) => void;
}

const CHUNK_SIZE = 3 * 1024 * 1024; // 3MB chunks

export default function SimpleFileUploader({
  onFileSelect,
  onFileRemove,
  selectedFile,
  acceptedTypes = ['*'],
  maxFileSize = 50 * 1024 * 1024, // 50MB default
  label = 'Tải lên file',
  description = 'Chọn file để tải lên',
  className = '',
  onLogout,
  onUploadComplete,
}: SimpleFileUploaderProps) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadMessage, setUploadMessage] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Chỉ mount trên client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  const generateUploadId = () => {
    return `project_upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError('');

    // Validate file type
    const isValidType = acceptedTypes.some((type) => {
      if (type === '*') return true;
      if (type.includes('*')) {
        const baseType = type.split('/')[0];
        return file.type.startsWith(baseType);
      }
      return file.type === type;
    });

    if (!isValidType) {
      setError('Loại file không được hỗ trợ');
      return;
    }

    // Validate file size
    if (file.size > maxFileSize) {
      setError(
        `File quá lớn. Kích thước tối đa là ${(maxFileSize / (1024 * 1024)).toFixed(0)}MB`
      );
      return;
    }

    onFileSelect(file);
  };

  const removeFile = () => {
    onFileRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !onUploadComplete) return;

    setLoading(true);
    setError('');
    setUploadProgress(0);

    try {
      // Step 1: Upload file in chunks
      const uploadId = generateUploadId();
      await uploadFileInChunks(selectedFile, uploadId);

      setUploadProgress(95);

      // Step 2: Create final file from chunks
      const token = localStorage.getItem('strapiToken');
      const response = await fetch('/api/create-file-from-chunks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          uploadId,
          originalFileName: selectedFile.name,
          uploadPath: 'projects',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Check if unauthorized - clear token and redirect to login
        if (response.status === 401) {
          localStorage.removeItem('strapiToken');
          localStorage.removeItem('strapiUser');
          // Trigger logout callback to redirect user to login
          if (onLogout) {
            onLogout();
          }
          return;
        }

        throw new Error(errorData.error || 'Không thể upload file');
      }

      const result = await response.json();
      setUploadProgress(100);

      // Clear form
      setUploadProgress(0);
      setError('');
      setUploadMessage('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      onUploadComplete(result);
    } catch (error) {
      console.error('Upload error:', error);

      // Hiển thị lỗi chi tiết hơn
      let errorMessage = '';

      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage =
            'Không thể kết nối tới server. Vui lòng kiểm tra kết nối mạng.';
        } else if (error.message.includes('Phiên đăng nhập đã hết hạn')) {
          errorMessage = error.message;
          // Auto logout after showing error
          if (onLogout) {
            setTimeout(() => {
              onLogout();
            }, 2000);
          }
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Don't render until mounted on client
  if (!mounted) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="text-center">Đang tải uploader...</div>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {selectedFile ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-md border border-gray-300 bg-gray-50 px-3 py-2">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-4 w-4 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {onUploadComplete && (
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={loading}
                  className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading
                    ? `Uploading... ${Math.round(uploadProgress)}%`
                    : 'Upload'}
                </button>
              )}
              <button
                type="button"
                onClick={removeFile}
                className="text-red-500 hover:text-red-700"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Upload Progress */}
          {loading && uploadProgress > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Tiến trình upload</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Upload Message */}
          {uploadMessage && (
            <p className="text-sm text-red-600">{uploadMessage}</p>
          )}
        </div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4 hover:bg-gray-100">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={acceptedTypes.join(',')}
            onChange={handleFileSelect}
          />
          <svg
            className="mb-2 h-8 w-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </label>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
