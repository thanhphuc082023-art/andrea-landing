import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const UPLOAD_DIR = '/tmp/uploads';

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

interface MediaUploadResult {
  id: number;
  url: string;
  name: string;
  mime: string;
  width?: number;
  height?: number;
}

/**
 * Upload a file to Strapi using the upload API
 */
async function uploadToStrapi(
  filePath: string,
  originalName: string,
  token: string,
  category: string = 'general'
): Promise<MediaUploadResult | null> {
  try {
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return null;
    }

    const fileBuffer = fs.readFileSync(filePath);
    const stats = fs.statSync(filePath);

    // Determine proper MIME type and extension
    const ext = path.extname(originalName).toLowerCase();
    const mimeType = getMimeTypeFromExtension(ext);

    const formData = new FormData();
    const blob = new Blob([fileBuffer], { type: mimeType });

    formData.append('files', blob, originalName);
    formData.append('path', category);

    const strapiBaseUrl =
      process.env.NEXT_PUBLIC_STRAPI_URL ||
      'https://tremendous-delight-4e1d7b6669.strapiapp.com';
    const uploadUrl = `${strapiBaseUrl}/api/upload`;

    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Upload failed for ${originalName}:`,
        response.status,
        errorText
      );
      return null;
    }

    const result = await response.json();

    if (result && result.length > 0) {
      const uploadedFile = result[0];

      return {
        id: uploadedFile.id,
        url: uploadedFile.url,
        name: uploadedFile.name,
        mime: uploadedFile.mime,
        width: uploadedFile.width,
        height: uploadedFile.height,
      };
    }

    return null;
  } catch (error) {
    console.error(`Error uploading ${originalName}:`, error);
    return null;
  }
}

/**
 * Get MIME type from file extension
 */
function getMimeTypeFromExtension(ext: string): string {
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.mov': 'video/quicktime',
    '.avi': 'video/x-msvideo',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx':
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  };

  return mimeTypes[ext] || 'application/octet-stream';
}

/**
 * Find uploaded file by upload ID
 */
function findUploadedFile(
  uploadId: string
): { filePath: string; originalName: string } | null {
  try {
    const completePath = path.join(UPLOAD_DIR, `${uploadId}-complete`);

    // Check all possible extensions
    const possibleExtensions = [
      '.jpg',
      '.jpeg',
      '.png',
      '.gif',
      '.webp',
      '.mp4',
      '.mov',
      '.avi',
      '.pdf',
      '.doc',
      '.docx',
    ];

    for (const ext of possibleExtensions) {
      const testPath = `${completePath}${ext}`;
      if (fs.existsSync(testPath)) {
        // Try to find original name from metadata file
        const metaPath = path.join(UPLOAD_DIR, `${uploadId}-meta.json`);
        let originalName = `file${ext}`;

        if (fs.existsSync(metaPath)) {
          try {
            const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
            originalName = meta.originalName || originalName;
          } catch (e) {
            console.warn(`Could not read metadata for ${uploadId}`);
          }
        }

        return { filePath: testPath, originalName };
      }
    }

    console.error(`Upload file not found for ID: ${uploadId}`);
    return null;
  } catch (error) {
    console.error(`Error finding uploaded file ${uploadId}:`, error);
    return null;
  }
}

/**
 * Process showcase sections and upload media files
 */
async function processShowcaseSections(
  showcaseSections: any[],
  showcaseUploadIds: string[],
  showcaseOriginalNames: string[],
  token: string
): Promise<any[]> {
  const uploadedFiles: Array<{ id: number; url: string }> = [];

  for (let i = 0; i < showcaseUploadIds.length; i++) {
    const uploadId = showcaseUploadIds[i];
    const originalName = showcaseOriginalNames[i] || `showcase-${i}`;

    const fileInfo = findUploadedFile(uploadId);
    if (fileInfo) {
      const uploadResult = await uploadToStrapi(
        fileInfo.filePath,
        originalName,
        token,
        'showcase'
      );
      if (uploadResult) {
        uploadedFiles.push({ id: uploadResult.id, url: uploadResult.url });
      }
    }
  }

  // Map uploaded files to showcase items
  let fileIndex = 0;
  const processedSections = showcaseSections.map((section, sectionIndex) => {
    if (!section.items || section.items.length === 0) {
      return section;
    }

    const processedItems = section.items.map((item: any, itemIndex: number) => {
      // Check if this item needs an uploaded file
      if (fileIndex < uploadedFiles.length) {
        const uploadedFile = uploadedFiles[fileIndex];
        fileIndex++;

        return {
          ...item,
          id: item.id || `item-${sectionIndex}-${itemIndex}`,
          src: uploadedFile.url,
          type: item.type || 'image',
          title: item.title || `Item ${itemIndex + 1}`,
          alt: item.alt || item.title || `Item ${itemIndex + 1}`,
          width: item.width || 1300,
          height: item.height || 800,
          order: item.order !== undefined ? item.order : itemIndex,
        };
      }

      // Return item without file upload
      return {
        ...item,
        id: item.id || `item-${sectionIndex}-${itemIndex}`,
        type: item.type || 'image',
        title: item.title || `Item ${itemIndex + 1}`,
        alt: item.alt || item.title || `Item ${itemIndex + 1}`,
        width: item.width || 1300,
        height: item.height || 800,
        order: item.order !== undefined ? item.order : itemIndex,
      };
    });

    return {
      ...section,
      id: section.id || `section-${sectionIndex}`,
      title: section.title || `Section ${sectionIndex + 1}`,
      type: section.type || 'image',
      layout: section.layout || 'single',
      items: processedItems,
      order: section.order !== undefined ? section.order : sectionIndex,
    };
  });

  console.log(
    `Processed showcase sections: ${processedSections.length} sections, ${uploadedFiles.length} files uploaded`
  );
  return processedSections;
}

/**
 * Create project in Strapi
 */
async function createProjectInStrapi(projectData: any, token: string) {
  const strapiBaseUrl =
    process.env.NEXT_PUBLIC_STRAPI_URL ||
    'https://tremendous-delight-4e1d7b6669.strapiapp.com';
  const projectUrl = `${strapiBaseUrl}/api/projects`;

  const response = await fetch(projectUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(projectData),
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
      console.error(
        'Strapi API error details:',
        JSON.stringify(errorData, null, 2)
      );

      if (errorData.error?.details?.errors) {
        console.error('Validation errors:');
        errorData.error.details.errors.forEach((err: any) => {
          console.error(`- ${err.path?.join('.')}: ${err.message}`);
        });
      }
    } catch (parseError) {
      const responseText = await response.text();
      console.error(
        'Strapi API error (non-JSON):',
        response.status,
        response.statusText
      );
      console.error('Response text:', responseText);
      throw new Error(
        `Strapi API error: ${response.status} ${response.statusText}`
      );
    }

    throw new Error(
      errorData?.error?.message || `Strapi API error: ${response.status}`
    );
  }

  const result = await response.json();

  return result;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get authentication token
    const token =
      process.env.STRAPI_API_TOKEN ||
      req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing authentication token',
      });
    }

    const requestData = req.body;

    // Validate required fields
    const requiredFields = ['title', 'description', 'projectIntroTitle'];
    const missingFields = requiredFields.filter((field) => !requestData[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: `Missing: ${missingFields.join(', ')}`,
      });
    }

    // Process media uploads
    const mediaResults: any = {};

    // Upload hero video
    if (requestData.heroVideoUploadId) {
      const fileInfo = findUploadedFile(requestData.heroVideoUploadId);
      if (fileInfo) {
        const result = await uploadToStrapi(
          fileInfo.filePath,
          requestData.originalHeroVideoName || 'hero-video.mp4',
          token,
          'videos'
        );
        if (result) mediaResults.heroVideo = result.id;
      }
    }

    // Upload thumbnail
    if (requestData.thumbnailUploadId) {
      const fileInfo = findUploadedFile(requestData.thumbnailUploadId);
      if (fileInfo) {
        const result = await uploadToStrapi(
          fileInfo.filePath,
          requestData.originalThumbnailName || 'thumbnail.jpg',
          token,
          'thumbnails'
        );
        if (result) mediaResults.thumbnail = result.id;
      }
    }

    // Upload featured image
    if (requestData.featuredImageUploadId) {
      const fileInfo = findUploadedFile(requestData.featuredImageUploadId);
      if (fileInfo) {
        const result = await uploadToStrapi(
          fileInfo.filePath,
          requestData.originalFeaturedImageName || 'featured-image.jpg',
          token,
          'images'
        );
        if (result) mediaResults.featuredImage = result.id;
      }
    }

    // Upload gallery images
    const galleryIds: number[] = [];
    if (
      requestData.galleryUploadIds &&
      Array.isArray(requestData.galleryUploadIds)
    ) {
      for (let i = 0; i < requestData.galleryUploadIds.length; i++) {
        const uploadId = requestData.galleryUploadIds[i];
        const originalName =
          requestData.originalGalleryNames?.[i] || `gallery-${i}.jpg`;

        const fileInfo = findUploadedFile(uploadId);
        if (fileInfo) {
          const result = await uploadToStrapi(
            fileInfo.filePath,
            originalName,
            token,
            'gallery'
          );
          if (result) galleryIds.push(result.id);
        }
      }
    }

    // Process showcase sections
    const processedShowcase = await processShowcaseSections(
      requestData.showcase || [],
      requestData.showcaseUploadIds || [],
      requestData.showcaseOriginalNames || [],
      token
    );

    // Build final project data for Strapi
    const projectData = {
      data: {
        // Core required fields
        title: requestData.title,
        slug:
          requestData.slug ||
          requestData.title.toLowerCase().replace(/\s+/g, '-'),
        description: requestData.description,
        projectIntroTitle: requestData.projectIntroTitle,

        // Optional content fields
        content: requestData.content || '',
        overview: requestData.overview || '',
        challenge: requestData.challenge || '',
        solution: requestData.solution || '',

        // Metadata
        projectStatus: requestData.status || 'draft',
        featured: requestData.featured || false,
        technologies: requestData.technologies || [],
        projectMetaInfo: requestData.projectMetaInfo || [],

        // Additional data
        results: requestData.results || [],
        metrics: requestData.metrics || [],
        credits: requestData.credits || {},
        seo: requestData.seo || {},

        // Processed showcase sections
        showcaseSections: processedShowcase,

        // Media file IDs
        ...(mediaResults.heroVideo && { heroVideo: mediaResults.heroVideo }),
        ...(mediaResults.thumbnail && { thumbnail: mediaResults.thumbnail }),
        ...(mediaResults.featuredImage && {
          featuredImage: mediaResults.featuredImage,
        }),
        ...(galleryIds.length > 0 && { gallery: galleryIds }),

        // Category
        ...(requestData.categoryId && { category: requestData.categoryId }),

        // Auto-publish completed projects
        publishedAt:
          requestData.status === 'completed' ? new Date().toISOString() : null,
      },
    };

    // Create project in Strapi
    const result = await createProjectInStrapi(projectData, token);

    // Clean up uploaded files
    try {
      const uploadIds = [
        requestData.heroVideoUploadId,
        requestData.thumbnailUploadId,
        requestData.featuredImageUploadId,
        ...(requestData.galleryUploadIds || []),
        ...(requestData.showcaseUploadIds || []),
      ].filter(Boolean);

      uploadIds.forEach((uploadId: string) => {
        const patterns = [
          path.join(UPLOAD_DIR, `${uploadId}-complete*`),
          path.join(UPLOAD_DIR, `${uploadId}-meta.json`),
        ];

        patterns.forEach((pattern) => {
          try {
            const files = fs
              .readdirSync(UPLOAD_DIR)
              .filter((f) => f.startsWith(`${uploadId}-`));
            files.forEach((file) => {
              const fullPath = path.join(UPLOAD_DIR, file);
              if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
              }
            });
          } catch (cleanupError) {
            console.warn(
              `Could not clean up files for ${uploadId}:`,
              cleanupError
            );
          }
        });
      });
    } catch (cleanupError) {
      console.error('Error during cleanup:', cleanupError);
    }

    return res.status(201).json({
      success: true,
      data: result.data,
      message: 'Project created successfully',
    });
  } catch (error: any) {
    console.error('Error in project creation:', error);

    // Handle specific error types
    if (error.message?.includes('fetch')) {
      return res.status(500).json({
        error: 'Network error',
        message: 'Unable to connect to Strapi API',
      });
    }

    return res.status(500).json({
      error: 'Internal server error',
      message: error.message || 'Failed to create project',
    });
  }
}
