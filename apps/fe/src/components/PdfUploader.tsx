'use client';

import React, { useState, useRef, useEffect } from 'react';

// Types
interface BookData {
  id: number;
  attributes: {
    title: string;
    slug: string;
    pages: string[];
    pdfFile?: {
      data: {
        attributes: {
          url: string;
        };
      };
    };
  };
}

const PdfUploader: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadMessage, setUploadMessage] = useState<string>('');
  const [generatedSlug, setGeneratedSlug] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Chỉ mount trên client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      setUploadMessage('Please select a valid PDF file.');
      return;
    }

    // Validate file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      setUploadMessage('File size must be less than 50MB.');
      return;
    }

    setSelectedFile(file);
    setUploadMessage('PDF file selected successfully. Ready to upload!');
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    if (!selectedFile || !title.trim()) {
      setUploadMessage('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setUploadMessage('Uploading PDF and creating flipbook...');

    try {
      const formData = new FormData();
      formData.append('pdfFile', selectedFile);
      formData.append('title', title.trim());

      const response = await fetch('/api/upload-pdf', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setUploadMessage('✅ PDF uploaded successfully!');
        setGeneratedSlug(result.slug);

        // Clear form
        setSelectedFile(null);
        setTitle('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        setUploadMessage(
          `❌ Upload failed: ${result.message || 'Unknown error'}`
        );
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadMessage(
        '❌ Upload failed. Please check your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Don't render until mounted on client
  if (!mounted) {
    return (
      <div className="mx-auto max-w-md rounded-lg border bg-white p-6">
        <div className="text-center">Loading PDF uploader...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md rounded-lg border bg-white p-6 shadow-md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="title" className="mb-2 block font-bold text-gray-800">
            Book Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter book title..."
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={loading}
            required
          />
        </div>

        <div>
          <label
            htmlFor="pdf-file"
            className="mb-2 block font-bold text-gray-800"
          >
            PDF File *
          </label>
          <input
            ref={fileInputRef}
            type="file"
            id="pdf-file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={loading}
            required
          />
          <p className="mt-1 text-sm text-gray-500">Maximum file size: 50MB</p>
        </div>

        <button
          type="submit"
          disabled={loading || !selectedFile || !title.trim()}
          className="w-full rounded-md bg-blue-600 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Uploading...' : 'Upload PDF'}
        </button>

        {/* Upload Message */}
        {uploadMessage && (
          <div className="mt-4 text-center">
            <p
              className={`text-sm ${
                uploadMessage.includes('✅')
                  ? 'text-green-600'
                  : uploadMessage.includes('❌')
                    ? 'text-red-600'
                    : 'text-blue-600'
              }`}
            >
              {uploadMessage}
            </p>
          </div>
        )}

        {/* Generated Slug Link */}
        {generatedSlug && (
          <div className="mt-4 text-center">
            <p className="mb-2 text-sm text-gray-600">
              Your flipbook is ready!
            </p>
            <a
              href={`/book/${generatedSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 underline hover:text-blue-800"
            >
              View 3D Flipbook →
            </a>
          </div>
        )}
      </form>
    </div>
  );
};

export default PdfUploader;
