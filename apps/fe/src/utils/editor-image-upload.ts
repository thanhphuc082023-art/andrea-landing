/**
 * Utility function to upload images for React Email Editor
 * Handles direct upload to Strapi with proper error handling
 */

import { STRAPI_CONFIG, UPLOAD_CONFIG } from '@/constants/editor';

interface UploadResult {
  url: string;
  id: number;
  name: string;
  size: number;
  mime: string;
}

interface UploadOptions {
  token?: string;
  path?: string;
}

/**
 * Upload image file directly to Strapi
 */
export async function uploadEditorImage(
  file: File,
  options: UploadOptions = {}
): Promise<UploadResult> {
  const { token, path = UPLOAD_CONFIG.DEFAULT_PATH } = options;
  const strapiUrl =
    process.env.NEXT_PUBLIC_STRAPI_URL || STRAPI_CONFIG.DEFAULT_URL;

  try {
    // Convert file to blob for upload
    const blob = await fileToBlob(file);

    // Create FormData
    const formData = new FormData();
    formData.append('files', blob, file.name);
    formData.append('path', path);

    // Upload to Strapi
    const response = await fetch(
      `${strapiUrl}${STRAPI_CONFIG.UPLOAD_ENDPOINT}`,
      {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Upload failed: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const uploadData = await response.json();

    if (!uploadData?.[0]?.url) {
      throw new Error('Invalid upload response from Strapi');
    }

    const uploadedFile = uploadData[0];

    return {
      url: uploadedFile.url?.includes('http')
        ? uploadedFile.url
        : `${strapiUrl}${uploadedFile.url}`,
      id: uploadedFile.id,
      name: uploadedFile.name,
      size: uploadedFile.size,
      mime: uploadedFile.mime,
    };
  } catch (error) {
    console.error('Error uploading editor image:', error);
    throw error;
  }
}

/**
 * Convert File to Blob for more reliable upload
 */
async function fileToBlob(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        const response = await fetch(base64);
        const blob = await response.blob();
        resolve(blob);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Get JWT token from localStorage
 */
export function getStrapiToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('strapiToken');
}
