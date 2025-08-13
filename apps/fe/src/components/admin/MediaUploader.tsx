import { useState, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import {
  XMarkIcon,
  PhotoIcon,
  DocumentIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

interface MediaFile {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video' | 'document';
  name: string;
  size: number;
}

interface MediaUploaderProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: MediaFile[]) => void;
  multiple?: boolean;
  acceptedTypes?: string[];
  maxSize?: number; // in MB
}

export default function MediaUploader({
  isOpen,
  onClose,
  onUpload,
  multiple = true,
  acceptedTypes = ['image/*', 'video/*'],
  maxSize = 10, // 10MB default
}: MediaUploaderProps) {
  const [selectedFiles, setSelectedFiles] = useState<MediaFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles: MediaFile[] = [];

    Array.from(files).forEach((file) => {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        alert(`File ${file.name} quá lớn. Kích thước tối đa là ${maxSize}MB.`);
        return;
      }

      // Check file type
      const isValidType = acceptedTypes.some((type) => {
        if (type.endsWith('/*')) {
          const baseType = type.replace('/*', '');
          return file.type.startsWith(baseType);
        }
        return file.type === type;
      });

      if (!isValidType) {
        alert(`File ${file.name} không được hỗ trợ.`);
        return;
      }

      const mediaFile: MediaFile = {
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: URL.createObjectURL(file),
        type: file.type.startsWith('image/')
          ? 'image'
          : file.type.startsWith('video/')
            ? 'video'
            : 'document',
        name: file.name,
        size: file.size,
      };

      newFiles.push(mediaFile);
    });

    if (multiple) {
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    } else {
      setSelectedFiles(newFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeFile = (id: string) => {
    setSelectedFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const handleUpload = () => {
    onUpload(selectedFiles);
    setSelectedFiles([]);
    onClose();
  };

  const handleClose = () => {
    // Clean up preview URLs
    selectedFiles.forEach((file) => {
      URL.revokeObjectURL(file.preview);
    });
    setSelectedFiles([]);
    onClose();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={handleClose}
                  >
                    <span className="sr-only">Đóng</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="mt-3 w-full text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="mb-6 text-lg font-semibold leading-6 text-gray-900"
                    >
                      Tải lên Media
                    </Dialog.Title>

                    {/* Upload Area */}
                    <div
                      className={`rounded-lg border-2 border-dashed p-6 text-center ${
                        isDragging
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-300'
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <p className="text-sm text-gray-600">
                          Kéo thả file vào đây hoặc{' '}
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            chọn file
                          </button>
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          Hỗ trợ: {acceptedTypes.join(', ')} | Tối đa: {maxSize}
                          MB
                        </p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple={multiple}
                        accept={acceptedTypes.join(',')}
                        onChange={(e) => handleFileSelect(e.target.files)}
                        className="hidden"
                      />
                    </div>

                    {/* Selected Files */}
                    {selectedFiles.length > 0 && (
                      <div className="mt-6">
                        <h4 className="mb-3 text-sm font-medium text-gray-900">
                          Files đã chọn:
                        </h4>
                        <div className="max-h-60 space-y-2 overflow-y-auto">
                          {selectedFiles.map((file) => (
                            <div
                              key={file.id}
                              className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                            >
                              <div className="flex items-center space-x-3">
                                {file.type === 'image' ? (
                                  <img
                                    src={file.preview}
                                    alt={file.name}
                                    className="h-10 w-10 rounded object-cover"
                                  />
                                ) : file.type === 'video' ? (
                                  <video
                                    src={file.preview}
                                    className="h-10 w-10 rounded object-cover"
                                  />
                                ) : (
                                  <DocumentIcon className="h-10 w-10 text-gray-400" />
                                )}
                                <div>
                                  <p className="max-w-xs truncate text-sm font-medium text-gray-900">
                                    {file.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {formatFileSize(file.size)}
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFile(file.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-6 sm:flex sm:flex-row-reverse">
                      <button
                        type="button"
                        onClick={handleUpload}
                        disabled={selectedFiles.length === 0}
                        className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 sm:ml-3 sm:w-auto"
                      >
                        Tải lên ({selectedFiles.length})
                      </button>
                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        onClick={handleClose}
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
