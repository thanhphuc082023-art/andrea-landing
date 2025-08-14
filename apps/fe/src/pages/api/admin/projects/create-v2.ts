import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import formidable, { File } from 'formidable';

const UPLOAD_DIR = '/tmp/uploads';

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Configure formidable for large file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// Types for the new project creation system
interface ProjectMediaFiles {
  heroVideo?: File;
  thumbnail?: File;
  featuredImage?: File;
  gallery: File[];
  showcase: ShowcaseFile[];
}

interface ShowcaseFile {
  sectionId: string;
  itemId: string;
  file: File;
  type: 'image' | 'video' | 'flipbook';
  title: string;
  alt: string;
  width: number;
  height: number;
  colSpan?: number;
  order: number;
  bookData?: {
    title?: string;
    websiteUrl?: string;
    phoneNumber?: string;
    downloadUrl?: string;
  };
}

interface ProjectFormFields {
  // Core information
  title: string;
  slug: string;
  description: string;
  projectIntroTitle: string;

  // Content
  content?: string;
  overview?: string;
  challenge?: string;
  solution?: string;

  // Metadata
  projectStatus: 'draft' | 'in-progress' | 'completed';
  featured: boolean;
  technologies: string[];
  projectMetaInfo: string[];

  // Category and external links
  categoryId?: number;
  projectUrl?: string;
  githubUrl?: string;

  // Additional data
  results: Array<{ title: string; description: string }>;
  metrics: Array<{ value: string; label: string; description?: string }>;
  credits: Array<{ role: string; names: string[] }>;

  // SEO
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    ogTitle?: string;
    ogDescription?: string;
  };

  // Showcase structure (without files)
  showcaseStructure: Array<{
    id: string;
    title: string;
    type: 'image' | 'video' | 'mixed';
    layout: 'single' | 'half-half' | 'one-third' | 'grid';
    gridCols?: number;
    items: Array<{
      id: string;
      type: 'image' | 'video' | 'flipbook';
      title: string;
      alt: string;
      width: number;
      height: number;
      colSpan?: number;
      order: number;
      hasFile: boolean; // Indicates if this item has an uploaded file
      bookData?: {
        title?: string;
        websiteUrl?: string;
        phoneNumber?: string;
        downloadUrl?: string;
      };
    }>;
    order: number;
  }>;
}

/**
 * Upload single file to Strapi
 */
async function uploadFileToStrapi(
  file: File,
  token: string,
  category: string = 'general'
): Promise<{
  id: number;
  url: string;
  name: string;
  mime: string;
  width?: number;
  height?: number;
} | null> {
  try {
    const formData = new FormData();

    // Read file buffer
    const fileBuffer = fs.readFileSync(file.filepath);
    const blob = new Blob([fileBuffer], {
      type: file.mimetype || 'application/octet-stream',
    });

    // Use original filename with proper extension
    const originalName = file.originalFilename || 'unnamed';
    const extension =
      path.extname(originalName) || getExtensionFromMimeType(file.mimetype);
    const finalName = originalName.includes('.')
      ? originalName
      : `${originalName}${extension}`;

    formData.append('files', blob, finalName);
    formData.append('path', category);

    const strapiBaseUrl =
      process.env.NEXT_PUBLIC_STRAPI_URL ||
      'https://joyful-basket-ea764d9c28.strapiapp.com';
    const uploadUrl = `${strapiBaseUrl}/api/upload`;

    console.log(
      `Uploading file: ${finalName} (${file.mimetype}) to category: ${category}`
    );

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
        `Upload failed for ${finalName}:`,
        response.status,
        errorText
      );
      return null;
    }

    const uploadResult = await response.json();

    if (uploadResult && uploadResult.length > 0) {
      const fileData = uploadResult[0];
      console.log(`Successfully uploaded: ${finalName} -> ${fileData.url}`);

      return {
        id: fileData.id,
        url: fileData.url,
        name: fileData.name,
        mime: fileData.mime,
        width: fileData.width,
        height: fileData.height,
      };
    }

    return null;
  } catch (error) {
    console.error('Error uploading file to Strapi:', error);
    return null;
  }
}

/**
 * Get file extension from MIME type
 */
function getExtensionFromMimeType(mimeType?: string | null): string {
  if (!mimeType) return '';

  const mimeMap: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'video/mp4': '.mp4',
    'video/avi': '.avi',
    'video/mov': '.mov',
    'application/pdf': '.pdf',
    'application/msword': '.doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      '.docx',
  };

  return mimeMap[mimeType] || '';
}

/**
 * Process showcase files and upload them
 */
async function processShowcaseFiles(
  showcaseFiles: ShowcaseFile[],
  showcaseStructure: ProjectFormFields['showcaseStructure'],
  token: string
): Promise<ProjectFormFields['showcaseStructure']> {
  // Create a map of section and item IDs to uploaded file data
  const fileMap = new Map<
    string,
    { sectionId: string; itemId: string; uploadResult: any }
  >();

  // Upload all showcase files
  for (const showcaseFile of showcaseFiles) {
    const uploadResult = await uploadFileToStrapi(
      showcaseFile.file,
      token,
      'showcase'
    );
    if (uploadResult) {
      const key = `${showcaseFile.sectionId}-${showcaseFile.itemId}`;
      fileMap.set(key, {
        sectionId: showcaseFile.sectionId,
        itemId: showcaseFile.itemId,
        uploadResult,
      });
    }
  }

  // Update showcase structure with uploaded file URLs
  return showcaseStructure.map((section) => ({
    ...section,
    items: section.items.map((item) => {
      const key = `${section.id}-${item.id}`;
      const uploadedFile = fileMap.get(key);

      if (uploadedFile) {
        return {
          ...item,
          src: uploadedFile.uploadResult.url,
          hasFile: false, // Remove hasFile flag since we now have URL
        };
      }

      return item;
    }),
  }));
}

/**
 * Create project in Strapi with uploaded media
 */
async function createProjectInStrapi(
  projectData: any,
  token: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const strapiBaseUrl =
      process.env.NEXT_PUBLIC_STRAPI_URL ||
      'https://joyful-basket-ea764d9c28.strapiapp.com';
    const projectUrl = `${strapiBaseUrl}/api/projects`;

    console.log('Creating project in Strapi...');
    console.log('Project data keys:', Object.keys(projectData.data));

    const response = await fetch(projectUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(projectData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Strapi project creation error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      });

      return {
        success: false,
        error:
          errorData?.error?.message ||
          `Failed to create project: ${response.status} ${response.statusText}`,
      };
    }

    const result = await response.json();
    console.log('Project created successfully:', result.data.id);

    return {
      success: true,
      data: result.data,
    };
  } catch (error: any) {
    console.error('Error creating project in Strapi:', error);
    return {
      success: false,
      error: error.message || 'Unknown error occurred',
    };
  }
}

/**
 * Parse multipart form data
 */
async function parseFormData(req: NextApiRequest): Promise<{
  fields: any;
  files: any;
}> {
  return new Promise((resolve, reject) => {
    const form = formidable({
      uploadDir: UPLOAD_DIR,
      keepExtensions: true,
      maxFileSize: 100 * 1024 * 1024, // 100MB
      multiples: true,
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error('Form parsing error:', err);
        reject(err);
        return;
      }

      // Convert formidable format to our format
      const normalizedFields: any = {};
      const normalizedFiles: any = {};

      // Process fields
      Object.entries(fields).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          normalizedFields[key] = value[0];
        } else {
          normalizedFields[key] = value;
        }
      });

      // Process files
      Object.entries(files).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          normalizedFiles[key] = value;
        } else {
          normalizedFiles[key] = [value];
        }
      });

      resolve({ fields: normalizedFields, files: normalizedFiles });
    });
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get JWT token
    const token =
      process.env.STRAPI_API_TOKEN ||
      req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing authentication token',
      });
    }

    // Parse multipart form data
    const { fields, files } = await parseFormData(req);

    console.log('Received form fields:', Object.keys(fields));
    console.log('Received files:', Object.keys(files));

    // Parse JSON fields
    const formData: ProjectFormFields = {
      title: fields.title,
      slug: fields.slug || fields.title?.toLowerCase().replace(/\s+/g, '-'),
      description: fields.description,
      projectIntroTitle: fields.projectIntroTitle,
      content: fields.content || '',
      overview: fields.overview || '',
      challenge: fields.challenge || '',
      solution: fields.solution || '',
      projectStatus: fields.projectStatus || 'draft',
      featured: fields.featured === 'true',
      technologies: fields.technologies ? JSON.parse(fields.technologies) : [],
      projectMetaInfo: fields.projectMetaInfo
        ? JSON.parse(fields.projectMetaInfo)
        : [],
      categoryId: fields.categoryId ? parseInt(fields.categoryId) : undefined,
      projectUrl: fields.projectUrl || '',
      githubUrl: fields.githubUrl || '',
      results: fields.results ? JSON.parse(fields.results) : [],
      metrics: fields.metrics ? JSON.parse(fields.metrics) : [],
      credits: fields.credits ? JSON.parse(fields.credits) : [],
      seo: fields.seo ? JSON.parse(fields.seo) : {},
      showcaseStructure: fields.showcaseStructure
        ? JSON.parse(fields.showcaseStructure)
        : [],
    };

    console.log('Parsed form data successfully');
    console.log('- Showcase sections:', formData.showcaseStructure.length);
    console.log('- Technologies:', formData.technologies.length);

    // Upload media files
    const mediaUploadResults: any = {};

    // Upload hero video
    if (files.heroVideo && files.heroVideo[0]) {
      console.log('Uploading hero video...');
      const heroVideoResult = await uploadFileToStrapi(
        files.heroVideo[0],
        token,
        'videos'
      );
      if (heroVideoResult) {
        mediaUploadResults.heroVideo = heroVideoResult.id;
      }
    }

    // Upload thumbnail
    if (files.thumbnail && files.thumbnail[0]) {
      console.log('Uploading thumbnail...');
      const thumbnailResult = await uploadFileToStrapi(
        files.thumbnail[0],
        token,
        'thumbnails'
      );
      if (thumbnailResult) {
        mediaUploadResults.thumbnail = thumbnailResult.id;
      }
    }

    // Upload featured image
    if (files.featuredImage && files.featuredImage[0]) {
      console.log('Uploading featured image...');
      const featuredImageResult = await uploadFileToStrapi(
        files.featuredImage[0],
        token,
        'images'
      );
      if (featuredImageResult) {
        mediaUploadResults.featuredImage = featuredImageResult.id;
      }
    }

    // Upload gallery images
    const galleryIds: number[] = [];
    if (files.gallery) {
      console.log(`Uploading ${files.gallery.length} gallery images...`);
      for (let i = 0; i < files.gallery.length; i++) {
        const galleryResult = await uploadFileToStrapi(
          files.gallery[i],
          token,
          'gallery'
        );
        if (galleryResult) {
          galleryIds.push(galleryResult.id);
        }
      }
    }

    // Process showcase files
    const showcaseFiles: ShowcaseFile[] = [];
    Object.entries(files).forEach(([key, fileArray]) => {
      if (key.startsWith('showcase_')) {
        const [, sectionId, itemId] = key.split('_');
        if (sectionId && itemId && Array.isArray(fileArray) && fileArray[0]) {
          // Find the showcase item details from structure
          const section = formData.showcaseStructure.find(
            (s) => s.id === sectionId
          );
          const item = section?.items.find((i) => i.id === itemId);

          if (item) {
            showcaseFiles.push({
              sectionId,
              itemId,
              file: fileArray[0],
              type: item.type,
              title: item.title,
              alt: item.alt,
              width: item.width,
              height: item.height,
              colSpan: item.colSpan,
              order: item.order,
              bookData: item.bookData,
            });
          }
        }
      }
    });

    console.log(`Processing ${showcaseFiles.length} showcase files...`);

    // Upload showcase files and update structure
    const processedShowcase = await processShowcaseFiles(
      showcaseFiles,
      formData.showcaseStructure,
      token
    );

    // Build final project data for Strapi
    const projectData = {
      data: {
        // Core fields
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        projectIntroTitle: formData.projectIntroTitle,
        content: formData.content,
        overview: formData.overview,
        challenge: formData.challenge,
        solution: formData.solution,
        projectStatus: formData.projectStatus,
        featured: formData.featured,
        technologies: formData.technologies,
        projectMetaInfo: formData.projectMetaInfo,
        projectUrl: formData.projectUrl,
        githubUrl: formData.githubUrl,
        results: formData.results,
        metrics: formData.metrics,
        credits: formData.credits,
        seo: formData.seo,

        // Processed showcase sections
        showcaseSections: processedShowcase,

        // Media file IDs
        ...(mediaUploadResults.heroVideo && {
          heroVideo: mediaUploadResults.heroVideo,
        }),
        ...(mediaUploadResults.thumbnail && {
          thumbnail: mediaUploadResults.thumbnail,
        }),
        ...(mediaUploadResults.featuredImage && {
          featuredImage: mediaUploadResults.featuredImage,
        }),
        ...(galleryIds.length > 0 && { gallery: galleryIds }),

        // Category
        ...(formData.categoryId && { category: formData.categoryId }),

        // Auto-publish if status is completed
        publishedAt:
          formData.projectStatus === 'completed'
            ? new Date().toISOString()
            : null,
      },
    };

    console.log('Final project data structure:');
    console.log(
      '- Core fields present:',
      ['title', 'slug', 'description', 'projectIntroTitle'].every(
        (k) => projectData.data[k]
      )
    );
    console.log('- Media files:', {
      heroVideo: !!mediaUploadResults.heroVideo,
      thumbnail: !!mediaUploadResults.thumbnail,
      featuredImage: !!mediaUploadResults.featuredImage,
      galleryCount: galleryIds.length,
    });
    console.log('- Showcase sections:', processedShowcase.length);

    // Create project in Strapi
    const createResult = await createProjectInStrapi(projectData, token);

    if (!createResult.success) {
      return res.status(500).json({
        error: 'Project creation failed',
        message: createResult.error,
      });
    }

    // Clean up uploaded files
    try {
      Object.values(files)
        .flat()
        .forEach((file: any) => {
          if (file.filepath && fs.existsSync(file.filepath)) {
            fs.unlinkSync(file.filepath);
          }
        });
    } catch (cleanupError) {
      console.error('Error cleaning up uploaded files:', cleanupError);
    }

    return res.status(201).json({
      success: true,
      data: createResult.data,
      message: 'Project created successfully',
    });
  } catch (error: any) {
    console.error('Error in project creation handler:', error);

    return res.status(500).json({
      error: 'Internal server error',
      message: error.message || 'Failed to create project',
    });
  }
}
