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

  return {
    uploadId,
    originalFileName: file.name,
  };
};

export const uploadProjectMedia = async (
  mediaFiles: {
    heroVideo?: File;
    thumbnail?: File;
    featuredImage?: File;
    gallery?: File[];
    showcase?: any[];
  },
  onProgress?: (progress: number) => void
): Promise<{
  heroVideoUploadId?: string;
  thumbnailUploadId?: string;
  featuredImageUploadId?: string;
  galleryUploadIds: string[];
  showcaseUploadIds: string[];
}> => {
  const results: {
    heroVideoUploadId?: string;
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

  // Count total files to upload
  if (mediaFiles.heroVideo) totalFiles++;
  if (mediaFiles.thumbnail) totalFiles++;
  if (mediaFiles.featuredImage) totalFiles++;
  if (mediaFiles.gallery) totalFiles += mediaFiles.gallery.length;

  // Count showcase files
  if (mediaFiles.showcase) {
    mediaFiles.showcase.forEach((section) => {
      if (section.items) {
        section.items.forEach((item) => {
          if (item.file) totalFiles++;
        });
      }
    });
  }

  // Upload hero video
  if (mediaFiles.heroVideo) {
    const uploadId = generateUploadId();
    await uploadFileInChunks(mediaFiles.heroVideo, uploadId, (progress) => {
      if (onProgress) {
        onProgress((uploadedFiles * 90 + progress) / totalFiles);
      }
    });
    results.heroVideoUploadId = uploadId;
    uploadedFiles++;
  }

  // Upload thumbnail
  if (mediaFiles.thumbnail) {
    const uploadId = generateUploadId();
    await uploadFileInChunks(mediaFiles.thumbnail, uploadId, (progress) => {
      if (onProgress) {
        onProgress((uploadedFiles * 90 + progress) / totalFiles);
      }
    });
    results.thumbnailUploadId = uploadId;
    uploadedFiles++;
  }

  // Upload featured image
  if (mediaFiles.featuredImage) {
    const uploadId = generateUploadId();
    await uploadFileInChunks(mediaFiles.featuredImage, uploadId, (progress) => {
      if (onProgress) {
        onProgress((uploadedFiles * 90 + progress) / totalFiles);
      }
    });
    results.featuredImageUploadId = uploadId;
    uploadedFiles++;
  }

  // Upload gallery images
  if (mediaFiles.gallery && mediaFiles.gallery.length > 0) {
    for (const file of mediaFiles.gallery) {
      const uploadId = generateUploadId();
      await uploadFileInChunks(file, uploadId, (progress) => {
        if (onProgress) {
          onProgress((uploadedFiles * 90 + progress) / totalFiles);
        }
      });
      results.galleryUploadIds.push(uploadId);
      uploadedFiles++;
    }
  }

  // Upload showcase files
  if (mediaFiles.showcase && mediaFiles.showcase.length > 0) {
    for (const section of mediaFiles.showcase) {
      if (section.items) {
        for (const item of section.items) {
          if (item.file) {
            let uploadId: string;

            // Nếu item.file là File object
            if (item.file instanceof File) {
              uploadId = generateUploadId();
              await uploadFileInChunks(item.file, uploadId, (progress) => {
                if (onProgress) {
                  onProgress((uploadedFiles * 90 + progress) / totalFiles);
                }
              });
            }
            // Nếu item.file là uploadId string (từ SimpleFileUploader)
            else if (typeof item.file === 'string') {
              uploadId = item.file;
            } else {
              continue; // Skip nếu không phải File hoặc string
            }

            results.showcaseUploadIds.push(uploadId);
            uploadedFiles++;
          }
        }
      }
    }
  }

  if (onProgress) {
    onProgress(100);
  }

  return results;
};
