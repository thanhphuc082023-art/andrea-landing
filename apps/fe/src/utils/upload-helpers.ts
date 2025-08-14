import fs from 'fs';
import path from 'path';
import { upload } from '@/utils/strapi-upload';
import { createFileFromBuffer } from '@/utils/helper';

const UPLOAD_DIR = '/tmp/uploads';

export interface UploadResult {
  success: boolean;
  id?: number;
  url?: string;
  error?: string;
}

export interface MediaUploadTask {
  type: 'heroVideo' | 'thumbnail' | 'featuredImage' | 'gallery';
  uploadId: string;
  originalName?: string;
  mimeType?: string;
  category: string;
  index?: number;
}

/**
 * Get MIME type based on file extension
 */
export function getMimeType(extension: string): string {
  const mimeTypeMap: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.mp4': 'video/mp4',
    '.mov': 'video/quicktime',
    '.avi': 'video/x-msvideo',
    '.webm': 'video/webm',
    '.pdf': 'application/pdf',
  };
  return mimeTypeMap[extension] || 'application/octet-stream';
}

/**
 * Find uploaded file with different possible extensions
 */
export function findUploadedFile(
  uploadId: string
): { path: string; extension: string } | null {
  const possibleExtensions = [
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.webp',
    '.mp4',
    '.mov',
    '.avi',
    '.webm',
    '.pdf',
  ];

  for (const ext of possibleExtensions) {
    const testPath = path.join(UPLOAD_DIR, `${uploadId}-complete${ext}`);
    if (fs.existsSync(testPath)) {
      return { path: testPath, extension: ext };
    }
  }
  return null;
}

/**
 * Upload a single media file to Strapi
 */
export async function uploadMediaFile(
  uploadId: string,
  originalName: string,
  category: string,
  token: string
): Promise<UploadResult> {
  const fileInfo = findUploadedFile(uploadId);

  if (!fileInfo) {
    return { success: false, error: `No file found for uploadId: ${uploadId}` };
  }

  try {
    const buffer = fs.readFileSync(fileInfo.path);
    const mimeType = getMimeType(fileInfo.extension);

    const fileObj = createFileFromBuffer(buffer, originalName, mimeType);

    const uploadResponse = await upload(fileObj, category, token);

    // Clean up the temporary file
    fs.unlinkSync(fileInfo.path);

    if (uploadResponse?.[0]?.id) {
      return {
        success: true,
        id: uploadResponse[0].id,
        url: uploadResponse[0].url,
      };
    } else {
      return { success: false, error: 'Upload response missing ID' };
    }
  } catch (error) {
    console.error(`Error uploading ${category} file:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Upload multiple media files in parallel
 */
export async function uploadMediaFiles(
  tasks: MediaUploadTask[],
  token: string
): Promise<Record<string, UploadResult[]>> {
  const uploadPromises = tasks.map(
    async (task): Promise<{ task: MediaUploadTask; result: UploadResult }> => {
      const originalName =
        task.originalName ||
        `${task.type}-${task.index || 0}${findUploadedFile(task.uploadId)?.extension || '.jpg'}`;
      const result = await uploadMediaFile(
        task.uploadId,
        originalName,
        task.category,
        token
      );
      return { task, result };
    }
  );

  const results = await Promise.all(uploadPromises);

  // Group results by type
  const groupedResults: Record<string, UploadResult[]> = {};
  results.forEach(({ task, result }) => {
    if (!groupedResults[task.type]) {
      groupedResults[task.type] = [];
    }
    if (task.index !== undefined) {
      groupedResults[task.type][task.index] = result;
    } else {
      groupedResults[task.type].push(result);
    }
  });

  return groupedResults;
}

/**
 * Clean up temporary files safely
 */
export function cleanupFiles(filePaths: string[]): void {
  filePaths.forEach((filePath) => {
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (error) {
        console.warn('Failed to cleanup file:', filePath, error);
      }
    }
  });
}
