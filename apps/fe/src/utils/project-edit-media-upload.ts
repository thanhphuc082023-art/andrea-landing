import { generateUploadId, uploadFileInChunks } from './project-media-upload';
import { ProjectFormData } from '@/lib/validations/project';

interface FileUploadResult {
  uploadId: string;
  originalFileName: string;
}

/**
 * Handles chunk-based file uploads for project media during editing
 * Follows Single Responsibility Principle by focusing only on handling media changes
 */
export const handleProjectMediaChanges = async (
  formData: ProjectFormData,
  onProgress?: (progress: number) => void
): Promise<{
  heroVideoUploadId?: string;
  heroBannerUploadId?: string;
  thumbnailUploadId?: string;
  featuredImageUploadId?: string;
  galleryUploadIds: string[];
  showcaseUploadIds: any[];
  originalHeroVideoName?: string;
  originalHeroBannerName?: string;
  originalThumbnailName?: string;
  originalFeaturedImageName?: string;
}> => {
  const results: {
    heroVideoUploadId?: string;
    heroBannerUploadId?: string;
    thumbnailUploadId?: string;
    featuredImageUploadId?: string;
    galleryUploadIds: string[];
    showcaseUploadIds: any[];
    originalHeroVideoName?: string;
    originalHeroBannerName?: string;
    originalThumbnailName?: string;
    originalFeaturedImageName?: string;
  } = {
    galleryUploadIds: [],
    showcaseUploadIds: [],
  };

  // Only upload files that have been changed (have a file property)
  let totalFiles = 0;
  let uploadedFiles = 0;

  // Count total files to upload
  if (formData.heroVideo?.file) totalFiles++;
  if (formData.heroBanner?.file) totalFiles++;
  if (formData.thumbnail?.file) totalFiles++;
  if (formData.featuredImage?.file) totalFiles++;
  if (formData.gallery) {
    formData.gallery.forEach((item) => {
      if (item.file) totalFiles++;
    });
  }

  // Count showcase files
  if (formData.showcase) {
    formData.showcase.forEach((section) => {
      if (section.items) {
        section.items.forEach((item) => {
          if (item.file) totalFiles++;
        });
      }
    });
  }

  // Upload hero video if changed
  if (formData.heroVideo?.file) {
    const tempUploadId = generateUploadId();
    await uploadFileInChunks(
      formData.heroVideo.file,
      tempUploadId,
      (progress) => {
        if (onProgress) {
          onProgress((uploadedFiles * 90 + progress) / totalFiles);
        }
      }
    );
    results.heroVideoUploadId = tempUploadId;
    results.originalHeroVideoName = formData.heroVideo?.file?.name;
    uploadedFiles++;
  } else if (formData.heroVideo?.uploadId) {
    // Preserve existing uploadId if file hasn't changed
    results.heroVideoUploadId = formData.heroVideo.uploadId;
  }

  // Upload hero banner if changed
  if (formData.heroBanner?.file) {
    const tempUploadId = generateUploadId();
    await uploadFileInChunks(
      formData.heroBanner.file,
      tempUploadId,
      (progress) => {
        if (onProgress) {
          onProgress((uploadedFiles * 90 + progress) / totalFiles);
        }
      }
    );
    results.heroBannerUploadId = tempUploadId;
    results.originalHeroBannerName = formData.heroBanner?.file?.name;
    uploadedFiles++;
  } else if (formData.heroBanner?.uploadId) {
    // Preserve existing uploadId if file hasn't changed
    results.heroBannerUploadId = formData.heroBanner.uploadId;
  }

  // Upload thumbnail if changed
  if (formData.thumbnail?.file) {
    const tempUploadId = generateUploadId();
    await uploadFileInChunks(
      formData.thumbnail.file,
      tempUploadId,
      (progress) => {
        if (onProgress) {
          onProgress((uploadedFiles * 90 + progress) / totalFiles);
        }
      }
    );
    results.thumbnailUploadId = tempUploadId;
    results.originalThumbnailName = formData.thumbnail?.file?.name;
    console.log('DEBUG - Media upload: New thumbnail file uploaded', {
      tempUploadId,
      originalName: formData.thumbnail?.file?.name,
    });
    uploadedFiles++;
  } else if (formData.thumbnail?.uploadId) {
    // Preserve existing uploadId if file hasn't changed
    results.thumbnailUploadId = formData.thumbnail.uploadId;
    console.log(
      'DEBUG - Media upload: Using existing thumbnail uploadId',
      formData.thumbnail.uploadId
    );

    // If there's an id property available (from Strapi), store it too
    if (formData.thumbnail.id) {
      console.log(
        'DEBUG - Media upload: Thumbnail also has id property:',
        formData.thumbnail.id
      );
    }
  } else if (formData.thumbnail) {
    // Handle case where thumbnail exists but doesn't have file or uploadId
    // This might happen when using the original thumbnail from Strapi
    console.log(
      'DEBUG - Media upload: Thumbnail exists but no file/uploadId:',
      formData.thumbnail
    );

    // Try to extract ID if it's in the thumbnail object
    if (formData.thumbnail.id) {
      results.thumbnailUploadId = String(formData.thumbnail.id);
      console.log(
        'DEBUG - Media upload: Using thumbnail.id as uploadId:',
        formData.thumbnail.id
      );
    }
  }

  // Upload featured image if changed
  if (formData.featuredImage?.file) {
    const tempUploadId = generateUploadId();
    await uploadFileInChunks(
      formData.featuredImage.file,
      tempUploadId,
      (progress) => {
        if (onProgress) {
          onProgress((uploadedFiles * 90 + progress) / totalFiles);
        }
      }
    );
    results.featuredImageUploadId = tempUploadId;
    results.originalFeaturedImageName = formData.featuredImage?.file?.name;
    uploadedFiles++;
  } else if (formData.featuredImage?.uploadId) {
    // Preserve existing uploadId if file hasn't changed
    results.featuredImageUploadId = formData.featuredImage.uploadId;
  }

  // Handle gallery images
  if (formData.gallery && formData.gallery.length > 0) {
    for (const item of formData.gallery) {
      if (item.file) {
        const tempUploadId = generateUploadId();
        await uploadFileInChunks(item.file, tempUploadId, (progress) => {
          if (onProgress) {
            onProgress((uploadedFiles * 90 + progress) / totalFiles);
          }
        });
        results.galleryUploadIds.push(tempUploadId);
        uploadedFiles++;
      } else if (item.uploadId) {
        // Preserve existing uploadId if file hasn't changed
        results.galleryUploadIds.push(item.uploadId);
      }
    }
  }

  // Handle showcase sections
  if (formData.showcase && formData.showcase.length > 0) {
    results.showcaseUploadIds = [...formData.showcase];

    // Process each section to find and upload new files
    for (let i = 0; i < formData.showcase.length; i++) {
      const section = formData.showcase[i];

      if (section.items) {
        for (let j = 0; j < section.items.length; j++) {
          const item = section.items[j];

          if (item.file) {
            // If a new file is being uploaded
            if (item.file instanceof File) {
              const tempUploadId = generateUploadId();
              await uploadFileInChunks(item.file, tempUploadId, (progress) => {
                if (onProgress) {
                  onProgress((uploadedFiles * 90 + progress) / totalFiles);
                }
              });

              // Update the file reference in the result structure
              results.showcaseUploadIds[i].items[j].file = null;
              results.showcaseUploadIds[i].items[j].uploadId = tempUploadId;
              results.showcaseUploadIds[i].items[j].originalFileName =
                item.file?.name;
              uploadedFiles++;
            }
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
