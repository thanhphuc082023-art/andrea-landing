/**
 * Utility for immediate file upload when files are selected
 * This prevents loss of file objects during sessionStorage operations
 */

import { uploadFileInChunks, generateUploadId } from './project-media-upload';

interface ImmediateUploadResult {
  uploadId: string;
  url: string; // blob URL for preview
  serverUrl?: string; // server URL after upload
  name: string;
  size: number;
  type: string;
}

/**
 * Immediately upload a file and return both local and server URLs
 */
export async function uploadFileImmediately(
  file: File,
  onProgress?: (progress: number) => void
): Promise<ImmediateUploadResult> {
  console.log('=== IMMEDIATE UPLOAD DEBUG ===');
  console.log('Uploading file immediately:', {
    name: file.name,
    size: file.size,
    type: file.type,
  });

  // Create local blob URL for immediate preview
  const url = URL.createObjectURL(file);

  // Generate upload ID and start upload
  const uploadId = generateUploadId();

  try {
    // Upload file in chunks
    await uploadFileInChunks(file, uploadId, (progress) => {
      console.log(`Upload progress for ${file.name}:`, progress);
      onProgress?.(progress);
    });

    console.log('Immediate upload completed for:', file.name);
    console.log('Upload ID:', uploadId);
    console.log('=== END IMMEDIATE UPLOAD DEBUG ===');

    return {
      uploadId,
      url, // blob URL for preview
      name: file.name,
      size: file.size,
      type: file.type,
    };
  } catch (error) {
    console.error('Immediate upload failed:', error);
    // Still return blob URL for preview even if upload failed
    return {
      uploadId: '', // Empty upload ID indicates upload failed
      url,
      name: file.name,
      size: file.size,
      type: file.type,
    };
  }
}

/**
 * Check if a media object has a valid server upload
 */
export function hasValidUpload(mediaObject: any): boolean {
  return !!(mediaObject?.uploadId && mediaObject.uploadId !== '');
}

/**
 * Extract upload IDs from form data
 */
export function extractUploadIds(data: any): {
  heroVideoUploadId?: string;
  heroBannerUploadId?: string;
  thumbnailUploadId?: string;
  featuredImageUploadId?: string;
} {
  return {
    heroVideoUploadId: data.heroVideo?.uploadId || undefined,
    heroBannerUploadId: data.heroBanner?.uploadId || undefined,
    thumbnailUploadId: data.thumbnail?.uploadId || undefined,
    featuredImageUploadId: data.featuredImage?.uploadId || undefined,
  };
}
