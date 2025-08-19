const CHUNK_SIZE = 3 * 1024 * 1024; // 3MB chunks

export interface MediaUploadResult {
  uploadId: string;
  originalFileName: string;
}

export const generateUploadId = () => {
  return `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const uploadFileInChunks = async (
  file: File,
  uploadId: string,
  onProgress?: (progress: number) => void
): Promise<MediaUploadResult> => {
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
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      }

      throw new Error(`Failed to upload chunk ${chunkIndex + 1}`);
    }

    uploadedChunks++;
    if (onProgress) {
      onProgress((uploadedChunks / totalChunks) * 90); // Reserve 10% for final processing
    }
  }

  // Return temporary upload ID, final file creation will be done later
  return {
    uploadId, // This is temporary upload ID, not final Strapi media ID
    originalFileName: file.name,
  };
};

// Helper to create final file from chunks
const createFileFromChunks = async (
  uploadId: string,
  originalFileName: string
): Promise<string> => {
  const token = localStorage.getItem('strapiToken');
  const response = await fetch('/api/create-file-from-chunks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({
      uploadId,
      originalFileName,
      uploadPath: 'projects',
    }),
  });

  if (!response.ok) {
    // Check if unauthorized - clear token
    if (response.status === 401) {
      localStorage.removeItem('strapiToken');
      localStorage.removeItem('strapiUser');
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    }

    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create final file');
  }

  const result = await response.json();
  return result.uploadId; // Final Strapi media ID
};

// Convert blob/data URL to File (client-side only)
async function convertBlobUrlToFile(blobUrl: string, fallbackName = 'file') {
  try {
    const res = await fetch(blobUrl);
    const blob = await res.blob();
    const name = fallbackName || 'file';
    const file = new File([blob], name, {
      type: blob.type || 'application/octet-stream',
    });
    return file;
  } catch (err) {
    console.error('Failed to convert blob URL to File:', err);
    throw new Error(
      'Không thể chuyển blob URL thành file. Vui lòng chọn lại tệp.'
    );
  }
}

export const uploadProjectMedia = async (
  mediaFiles: {
    heroVideo?: File | string;
    heroBanner?: File | string;
    thumbnail?: File | string;
    featuredImage?: File | string;
    gallery?: Array<File | string>;
    showcase?: any[];
  },
  onProgress?: (progress: number) => void
): Promise<{
  heroVideoUploadId?: string;
  heroBannerUploadId?: string;
  thumbnailUploadId?: string;
  featuredImageUploadId?: string;
  galleryUploadIds: string[];
  showcaseUploadIds: string[];
}> => {
  const results: {
    heroVideoUploadId?: string;
    heroBannerUploadId?: string;
    thumbnailUploadId?: string;
    featuredImageUploadId?: string;
    galleryUploadIds: string[];
    showcaseUploadIds: string[];
  } = {
    galleryUploadIds: [],
    showcaseUploadIds: [],
  };

  let totalFiles = 0;
  let uploadedFiles = 0;

  // Normalize and count total files to upload
  const isUploadableString = (v: any) =>
    typeof v === 'string' && (v.startsWith('blob:') || v.startsWith('data:'));

  if (mediaFiles.heroVideo) totalFiles++;
  if (mediaFiles.heroBanner) totalFiles++;
  if (mediaFiles.thumbnail) totalFiles++;
  if (mediaFiles.featuredImage) totalFiles++;
  if (mediaFiles.gallery)
    totalFiles += (mediaFiles.gallery || []).filter(Boolean).length;

  // Count showcase files (only those with a file property that needs uploading)
  if (mediaFiles.showcase) {
    mediaFiles.showcase.forEach((section) => {
      if (section.items) {
        section.items.forEach((item) => {
          if (item.file) {
            // count if it's a File instance or a blob/data URL string that we can convert
            if (
              item.file instanceof File ||
              isUploadableString(item.file) ||
              (typeof item.file === 'string' && item.file.startsWith('upload_'))
            ) {
              totalFiles++;
            }
          }
        });
      }
    });
  }

  const safeOnProgress = (p: number) => {
    try {
      if (onProgress) onProgress(p);
    } catch (e) {
      // ignore
    }
  };

  // Helper to upload File or convertable blob string
  const uploadMaybeFile = async (
    maybeFile: File | string,
    displayName?: string
  ) => {
    // If already an uploadId string, return it
    if (typeof maybeFile === 'string' && !isUploadableString(maybeFile)) {
      return maybeFile; // treat as existing temp uploadId
    }

    let fileObj: File;
    if (maybeFile instanceof File) {
      fileObj = maybeFile;
    } else if (typeof maybeFile === 'string' && isUploadableString(maybeFile)) {
      // Convert blob/data URL to File
      fileObj = await convertBlobUrlToFile(maybeFile, displayName || 'file');
    } else {
      // Not uploadable
      return undefined;
    }

    const tempUploadId = generateUploadId();
    await uploadFileInChunks(fileObj, tempUploadId, (progress) => {
      safeOnProgress((uploadedFiles * 90 + progress) / Math.max(1, totalFiles));
    });
    uploadedFiles++;
    return tempUploadId;
  };

  // Upload hero video
  if (mediaFiles.heroVideo) {
    const maybe = mediaFiles.heroVideo;
    const maybeUploadId = await uploadMaybeFile(
      maybe,
      (maybe as any)?.name || 'heroVideo'
    );
    if (maybeUploadId) results.heroVideoUploadId = maybeUploadId;
  }

  // Upload hero banner
  if (mediaFiles.heroBanner) {
    const maybe = mediaFiles.heroBanner;
    const maybeUploadId = await uploadMaybeFile(
      maybe,
      (maybe as any)?.name || 'heroBanner'
    );
    if (maybeUploadId) results.heroBannerUploadId = maybeUploadId;
  }

  // Upload thumbnail
  if (mediaFiles.thumbnail) {
    const maybe = mediaFiles.thumbnail;
    const maybeUploadId = await uploadMaybeFile(
      maybe,
      (maybe as any)?.name || 'thumbnail'
    );
    if (maybeUploadId) results.thumbnailUploadId = maybeUploadId;
  }

  // Upload featured image
  if (mediaFiles.featuredImage) {
    const maybe = mediaFiles.featuredImage;
    const maybeUploadId = await uploadMaybeFile(
      maybe,
      (maybe as any)?.name || 'featuredImage'
    );
    if (maybeUploadId) results.featuredImageUploadId = maybeUploadId;
  }

  // Upload gallery images
  if (mediaFiles.gallery && mediaFiles.gallery.length > 0) {
    for (const maybe of mediaFiles.gallery) {
      const maybeUploadId = await uploadMaybeFile(
        maybe,
        (maybe as any)?.name || 'gallery'
      );
      if (maybeUploadId) results.galleryUploadIds.push(maybeUploadId);
    }
  }

  // Upload showcase files
  if (mediaFiles.showcase && mediaFiles.showcase.length > 0) {
    for (const section of mediaFiles.showcase) {
      if (section.items) {
        for (const item of section.items) {
          // If there's no file to upload, but item already has a temporary uploadId,
          // include it in results and remove any blob/data src so it won't be sent in payload.
          if (!item.file) {
            if (
              typeof item.uploadId === 'string' &&
              item.uploadId.startsWith('upload_')
            ) {
              // strip any transient blob/data src so payload doesn't include it
              if (
                typeof item.src === 'string' &&
                (item.src.startsWith('blob:') || item.src.startsWith('data:'))
              ) {
                delete item.src;
              }

              // ensure we return this uploadId so calling code can map it back
              results.showcaseUploadIds.push(item.uploadId);
            }

            continue;
          }

          // If item.file is an existing server path or URL, skip uploading
          if (
            typeof item.file === 'string' &&
            !isUploadableString(item.file) &&
            !item.file.startsWith('upload_')
          ) {
            // e.g. '/uploads/xxx' or 'https://...' - do not treat as uploadId
            continue;
          }

          const uploadId = await uploadMaybeFile(
            item.file,
            item.title || item.name || 'showcase'
          );
          if (uploadId) {
            // attach uploadId back to the item and clear transient fields so later
            // when the payload is sent there is no blob:data url present
            results.showcaseUploadIds.push(uploadId);
            try {
              item.uploadId = uploadId;
            } catch (e) {
              // ignore if item is frozen or can't be mutated
            }
            try {
              item.file = null;
            } catch (e) {
              // ignore
            }
            if (
              typeof item.src === 'string' &&
              (item.src.startsWith('blob:') || item.src.startsWith('data:'))
            ) {
              try {
                delete item.src;
              } catch (e) {
                // ignore
              }
            }
          }
        }
      }
    }
  }

  safeOnProgress(100);

  return results;
};
