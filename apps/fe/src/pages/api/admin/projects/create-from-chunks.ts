import { NextApiRequest, NextApiResponse } from 'next';
import { upload } from '@/utils/strapi-upload';
import fs from 'fs';
import path from 'path';
import {
  createFileFromBuffer,
  getSystemErrorMessage,
  getValidationErrorMessage,
} from '@/utils/helper';

const UPLOAD_DIR = '/tmp/uploads';

// Helper function to cleanup temporary files
export const cleanupFiles = (filePaths: string[]) => {
  filePaths.forEach((filePath) => {
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (error) {
        console.warn('Failed to cleanup file:', filePath, error);
      }
    }
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get JWT token from environment variable or request headers
    const envToken = process.env.STRAPI_API_TOKEN;
    const authHeader = req.headers.authorization;
    const headerToken = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null;

    const token = envToken || headerToken;

    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
        message:
          'Missing or invalid authorization token. Please set STRAPI_API_TOKEN environment variable or provide Bearer token in Authorization header.',
      });
    }

    const {
      title,
      description,
      content,
      slug,
      technologies,
      featured,
      status,
      overview,
      challenge,
      solution,
      categoryId,
      results,
      metrics,
      seo,
      projectIntroTitle,
      projectMetaInfo,
      credits,
      showcase,
      // Media upload IDs
      heroVideoUploadId,
      thumbnailUploadId,
      featuredImageUploadId,
      galleryUploadIds,
      showcaseUploadIds,
      // Original file names
      originalHeroVideoName,
      originalThumbnailName,
      originalFeaturedImageName,
      originalGalleryNames,
    } = req.body;

    // Debug: Log showcase data
    console.log('Showcase data received:', showcase);
    console.log('Showcase upload IDs received:', showcaseUploadIds);

    // Validate required fields
    if (!title || !description || !projectIntroTitle) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Title, description, and projectIntroTitle are required',
      });
    }

    // Upload media files to Strapi
    let heroVideoFileId = null;
    let thumbnailFileId = null;
    let featuredImageFileId = null;
    const galleryFileIds: number[] = [];

    // Upload hero video if provided
    if (heroVideoUploadId) {
      const heroVideoPath = path.join(
        UPLOAD_DIR,
        `${heroVideoUploadId}-complete.pdf`
      );
      if (fs.existsSync(heroVideoPath)) {
        try {
          const heroVideoBuffer = fs.readFileSync(heroVideoPath);
          const heroVideoFileObj = createFileFromBuffer(
            heroVideoBuffer,
            originalHeroVideoName || 'hero-video.mp4',
            'video/mp4'
          );

          const heroVideoUploadResponse = await upload(
            heroVideoFileObj,
            'videos',
            token
          );
          if (heroVideoUploadResponse?.[0]?.id) {
            heroVideoFileId = heroVideoUploadResponse[0].id;
          }
          // Clean up file
          fs.unlinkSync(heroVideoPath);
        } catch (error) {
          console.error('Error uploading hero video:', error);
        }
      }
    }

    // Upload thumbnail if provided
    if (thumbnailUploadId) {
      const thumbnailPath = path.join(
        UPLOAD_DIR,
        `${thumbnailUploadId}-complete.pdf`
      );
      if (fs.existsSync(thumbnailPath)) {
        try {
          const thumbnailBuffer = fs.readFileSync(thumbnailPath);
          const thumbnailFileObj = createFileFromBuffer(
            thumbnailBuffer,
            originalThumbnailName || 'thumbnail.jpg',
            'image/jpeg'
          );

          const thumbnailUploadResponse = await upload(
            thumbnailFileObj,
            'thumbnails',
            token
          );
          if (thumbnailUploadResponse?.[0]?.id) {
            thumbnailFileId = thumbnailUploadResponse[0].id;
          }
          // Clean up file
          fs.unlinkSync(thumbnailPath);
        } catch (error) {
          console.error('Error uploading thumbnail:', error);
        }
      }
    }

    // Upload featured image if provided
    if (featuredImageUploadId) {
      const featuredImagePath = path.join(
        UPLOAD_DIR,
        `${featuredImageUploadId}-complete.pdf`
      );
      if (fs.existsSync(featuredImagePath)) {
        try {
          const featuredImageBuffer = fs.readFileSync(featuredImagePath);
          const featuredImageFileObj = createFileFromBuffer(
            featuredImageBuffer,
            originalFeaturedImageName || 'featured-image.jpg',
            'image/jpeg'
          );

          const featuredImageUploadResponse = await upload(
            featuredImageFileObj,
            'images',
            token
          );
          if (featuredImageUploadResponse?.[0]?.id) {
            featuredImageFileId = featuredImageUploadResponse[0].id;
          }
          // Clean up file
          fs.unlinkSync(featuredImagePath);
        } catch (error) {
          console.error('Error uploading featured image:', error);
        }
      }
    }

    // Upload gallery images if provided
    if (galleryUploadIds && galleryUploadIds.length > 0) {
      for (let i = 0; i < galleryUploadIds.length; i++) {
        const galleryPath = path.join(
          UPLOAD_DIR,
          `${galleryUploadIds[i]}-complete.pdf`
        );
        if (fs.existsSync(galleryPath)) {
          try {
            const galleryBuffer = fs.readFileSync(galleryPath);
            const galleryFileObj = createFileFromBuffer(
              galleryBuffer,
              originalGalleryNames?.[i] || `gallery-${i}.jpg`,
              'image/jpeg'
            );

            const galleryUploadResponse = await upload(
              galleryFileObj,
              'gallery',
              token
            );
            if (galleryUploadResponse?.[0]?.id) {
              galleryFileIds.push(galleryUploadResponse[0].id);
            }
            // Clean up file
            fs.unlinkSync(galleryPath);
          } catch (error) {
            console.error('Error uploading gallery image:', error);
          }
        }
      }
    }

    // Process showcase sections and upload their media files
    let processedShowcaseSections = showcase || [];
    if (showcase && showcase.length > 0) {
      console.log(
        'Processing showcase sections:',
        showcase.map((s) => ({ id: s.id, layout: s.layout, title: s.title }))
      );

      processedShowcaseSections = await Promise.all(
        showcase.map(async (section: any, sectionIndex: number) => {
          console.log(`Processing section ${sectionIndex}:`, {
            id: section.id,
            layout: section.layout,
            title: section.title,
          });

          if (section.items && section.items.length > 0) {
            const processedItems = await Promise.all(
              section.items.map(async (item: any, itemIndex: number) => {
                // If item has a file object (from form), upload it
                if (
                  item.file &&
                  typeof item.file === 'object' &&
                  'name' in item.file
                ) {
                  try {
                    // For now, skip file upload in showcase items
                    // This will be handled by the frontend before submission
                    console.log(
                      'Showcase item with file detected:',
                      item.file.name
                    );
                    return item;
                  } catch (error) {
                    console.error('Error processing showcase item:', error);
                  }
                }

                // If item has a blob URL, convert it to a proper URL
                if (item.src && item.src.startsWith('blob:')) {
                  // For blob URLs, we need to handle them differently
                  // For now, keep the original src but log a warning
                  console.warn('Blob URL detected in showcase item:', item.src);
                }

                return item;
              })
            );

            const processedSection = {
              ...section,
              items: processedItems,
            };
            console.log(`Processed section ${sectionIndex}:`, {
              id: processedSection.id,
              layout: processedSection.layout,
              title: processedSection.title,
            });
            return processedSection;
          }

          return section;
        })
      );
    }

    // Process showcase upload IDs if provided
    if (showcaseUploadIds && showcaseUploadIds.length > 0) {
      console.log('Processing showcase upload IDs:', showcaseUploadIds);
      let showcaseIndex = 0;
      processedShowcaseSections = await Promise.all(
        processedShowcaseSections.map(
          async (section: any, sectionIndex: number) => {
            console.log(`Processing upload IDs for section ${sectionIndex}:`, {
              id: section.id,
              layout: section.layout,
            });

            if (section.items && section.items.length > 0) {
              const processedItems = await Promise.all(
                section.items.map(async (item: any, itemIndex: number) => {
                  // If this item should have an uploaded file
                  if (showcaseIndex < showcaseUploadIds.length) {
                    const uploadId = showcaseUploadIds[showcaseIndex];

                    // Try different file extensions
                    const possibleExtensions = [
                      '.pdf',
                      '.jpg',
                      '.jpeg',
                      '.png',
                      '.gif',
                      '.mp4',
                      '.mov',
                      '.avi',
                    ];
                    let showcasePath: string | null = null;
                    let fileExtension: string | null = null;

                    for (const ext of possibleExtensions) {
                      const testPath = path.join(
                        UPLOAD_DIR,
                        `${uploadId}-complete${ext}`
                      );
                      if (fs.existsSync(testPath)) {
                        showcasePath = testPath;
                        fileExtension = ext;
                        break;
                      }
                    }

                    if (showcasePath) {
                      try {
                        const showcaseBuffer = fs.readFileSync(showcasePath);

                        // Determine MIME type based on extension
                        let mimeType = 'application/octet-stream';
                        if (
                          fileExtension === '.jpg' ||
                          fileExtension === '.jpeg'
                        ) {
                          mimeType = 'image/jpeg';
                        } else if (fileExtension === '.png') {
                          mimeType = 'image/png';
                        } else if (fileExtension === '.gif') {
                          mimeType = 'image/gif';
                        } else if (fileExtension === '.mp4') {
                          mimeType = 'video/mp4';
                        } else if (fileExtension === '.mov') {
                          mimeType = 'video/quicktime';
                        } else if (fileExtension === '.avi') {
                          mimeType = 'video/x-msvideo';
                        } else if (fileExtension === '.pdf') {
                          mimeType = 'application/pdf';
                        }

                        const showcaseFileObj = createFileFromBuffer(
                          showcaseBuffer,
                          `showcase-${showcaseIndex}${fileExtension}`,
                          mimeType
                        );

                        const showcaseUploadResponse = await upload(
                          showcaseFileObj,
                          'showcase',
                          token
                        );

                        // Clean up file
                        fs.unlinkSync(showcasePath);

                        if (showcaseUploadResponse?.[0]?.id) {
                          showcaseIndex++;
                          return {
                            ...item,
                            src: showcaseUploadResponse[0].url, // Replace with uploaded URL
                            file: undefined, // Remove file object
                          };
                        }
                      } catch (error) {
                        console.error('Error uploading showcase item:', error);
                      }
                    } else {
                      console.warn(`No file found for uploadId: ${uploadId}`);
                    }
                  }

                  return item;
                })
              );

              const processedSection = {
                ...section,
                items: processedItems,
              };
              console.log(`Final processed section ${sectionIndex}:`, {
                id: processedSection.id,
                layout: processedSection.layout,
                title: processedSection.title,
              });
              return processedSection;
            }

            return section;
          }
        )
      );
    }

    // Create project data for Strapi
    const projectData = {
      data: {
        title,
        description,
        content: content || '',
        slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
        technologies: technologies || [],
        featured: featured || false,
        status: status || 'draft',
        overview: overview || '',
        challenge: challenge || '',
        solution: solution || '',
        categoryId: categoryId || null,
        results: results || [],
        metrics: metrics || [],
        seo: seo || {},
        projectIntroTitle,
        projectMetaInfo: projectMetaInfo || [],
        credits: credits || {},
        showcaseSections: processedShowcaseSections,
        publishedAt: status === 'completed' ? new Date().toISOString() : null,
        // Add media file IDs
        ...(heroVideoFileId ? { heroVideo: heroVideoFileId } : {}),
        ...(thumbnailFileId ? { thumbnail: thumbnailFileId } : {}),
        ...(featuredImageFileId ? { featuredImage: featuredImageFileId } : {}),
        ...(galleryFileIds.length > 0 ? { gallery: galleryFileIds } : {}),
      },
    };

    // Debug: Log final showcase data
    console.log(
      'Final showcase sections to be sent to Strapi:',
      processedShowcaseSections.map((s) => ({
        id: s.id,
        layout: s.layout,
        title: s.title,
        itemsCount: s.items?.length,
      }))
    );

    // Create project in Strapi
    const strapiBaseUrl =
      process.env.NEXT_PUBLIC_STRAPI_URL ||
      'https://joyful-basket-ea764d9c28.strapiapp.com/api';
    const strapiUrl = `${strapiBaseUrl}/projects`;

    console.log('Making request to Strapi:', strapiUrl);
    console.log('Request method:', 'POST');
    console.log('Request headers:', {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token ? '***' : 'missing'}`,
    });

    const response = await fetch(strapiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(projectData),
    });

    console.log('Strapi response status:', response.status);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
        console.error('Strapi API error:', errorData);
        throw new Error(
          errorData.error?.message ||
            `Strapi API error: ${response.status} ${response.statusText}`
        );
      } catch (parseError) {
        // If response is not JSON (e.g., HTML error page), use status text
        console.error(
          'Strapi API error (non-JSON):',
          response.status,
          response.statusText
        );
        throw new Error(
          `Strapi API error: ${response.status} ${response.statusText}`
        );
      }
    }

    const result = await response.json();

    return res.status(201).json({
      success: true,
      data: result.data,
      message: 'Project created successfully',
    });
  } catch (error: any) {
    console.error('Error creating project:', error);

    // Handle network errors specifically
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return res.status(500).json({
        error: 'Network error',
        message:
          'Unable to connect to Strapi API. Please check your network connection and Strapi URL.',
      });
    }

    return res.status(500).json({
      error: 'Internal server error',
      message: error.message || 'Failed to create project',
    });
  }
}
