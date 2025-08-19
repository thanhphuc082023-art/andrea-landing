import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Helper function to cleanup files
const cleanupFiles = (filePaths: string[]) => {
  filePaths.forEach((filePath) => {
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (error) {
        console.error(`Error deleting file ${filePath}:`, error);
      }
    }
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let filePaths: string[] = [];

  try {
    const { id } = req.query;
    const projectData = req.body;

    // normalize id param
    const idParam = Array.isArray(id) ? id[0] : id;

    if (!idParam) {
      return res.status(400).json({ message: 'Project id is required in URL' });
    }

    // Get authorization token from request
    const authToken = req.headers.authorization?.replace('Bearer ', '');
    if (!authToken) {
      return res.status(401).json({ message: 'Authorization token required' });
    }

    console.log('DEBUG - Project update from chunks request:', {
      id: idParam,
      heroVideoUploadId: projectData.heroVideoUploadId,
      heroBannerUploadId: projectData.heroBannerUploadId,
      thumbnailUploadId: projectData.thumbnailUploadId,
      featuredImageUploadId: projectData.featuredImageUploadId,
      originalThumbnailName: projectData.originalThumbnailName,
      title: projectData.title,
      thumbnailDetails: projectData.thumbnail
        ? {
            url: projectData.thumbnail.url,
            uploadId: projectData.thumbnail.uploadId,
            hasFile: !!projectData.thumbnail.file,
          }
        : null,
      _originalThumbnail: projectData._originalThumbnail,
    });

    // Process chunked files and upload them to Strapi if needed
    const { upload } = await import('@/utils/strapi-upload');

    // Function to process a chunked file
    const processChunkedFile = async (
      uploadId: string,
      originalFileName: string
    ): Promise<number | null> => {
      if (!uploadId.startsWith('upload_')) {
        // This is already a Strapi media ID, not a chunked upload ID
        return parseInt(uploadId);
      }

      const filePath = path.join(UPLOAD_DIR, `${uploadId}-complete`);
      if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        return null;
      }

      filePaths.push(filePath);
      const fileBuffer = fs.readFileSync(filePath);

      // Create file object for upload
      const file = new File([fileBuffer], originalFileName, {
        type: 'application/octet-stream',
      });

      // Upload to Strapi
      const uploadResponse = await upload(file, 'projects', authToken);

      if (!uploadResponse?.[0]?.id) {
        throw new Error('Failed to upload file to Strapi');
      }

      return uploadResponse[0].id;
    };

    // Process each media file if it's a chunked upload
    const mediaUploadIds: Record<string, number | null> = {
      heroVideo: null,
      heroBanner: null,
      thumbnail: null,
      featuredImage: null,
    };

    // Process hero video if present
    if (projectData.heroVideoUploadId && projectData.originalHeroVideoName) {
      const heroVideoId = await processChunkedFile(
        projectData.heroVideoUploadId,
        projectData.originalHeroVideoName
      );
      mediaUploadIds.heroVideo = heroVideoId;
    }

    // Process hero banner if present
    if (projectData.heroBannerUploadId && projectData.originalHeroBannerName) {
      const heroBannerId = await processChunkedFile(
        projectData.heroBannerUploadId,
        projectData.originalHeroBannerName
      );
      mediaUploadIds.heroBanner = heroBannerId;
    }

    // Process thumbnail if present
    if (projectData.thumbnailUploadId && projectData.originalThumbnailName) {
      const thumbnailId = await processChunkedFile(
        projectData.thumbnailUploadId,
        projectData.originalThumbnailName
      );
      mediaUploadIds.thumbnail = thumbnailId;
    }

    // Process featured image if present
    if (
      projectData.featuredImageUploadId &&
      projectData.originalFeaturedImageName
    ) {
      const featuredImageId = await processChunkedFile(
        projectData.featuredImageUploadId,
        projectData.originalFeaturedImageName
      );
      mediaUploadIds.featuredImage = featuredImageId;
    }

    // Prepare update data for Strapi (only include known fields)
    const updateData: any = {
      title: projectData.title,
      description: projectData.description,
      slug: projectData.slug,
      projectIntroTitle: projectData.projectIntroTitle,
      content: projectData.content,
      overview: projectData.overview,
      challenge: projectData.challenge,
      solution: projectData.solution,
      projectStatus: projectData.status,
      featured: projectData.featured,
      technologies: projectData.technologies,
      projectMetaInfo: projectData.projectMetaInfo,
      results: projectData.results,
      metrics: projectData.metrics,
      credits: projectData.credits,
      seo: projectData.seo,
    };

    // Update with processed media IDs or keep existing ones
    // Handle hero video with the same pattern
    if (mediaUploadIds.heroVideo) {
      updateData.heroVideo = mediaUploadIds.heroVideo;
      console.log(
        'DEBUG - Using new uploaded heroVideo:',
        mediaUploadIds.heroVideo
      );
    } else if (projectData.heroVideoUploadId) {
      const id = parseInt(projectData.heroVideoUploadId);
      if (!isNaN(id)) {
        updateData.heroVideo = id;
        console.log('DEBUG - Using numeric heroVideo ID:', id);
      } else {
        updateData.heroVideo = projectData.heroVideoUploadId;
        console.log(
          'DEBUG - Using string heroVideo ID:',
          projectData.heroVideoUploadId
        );
      }
    } else {
      updateData.heroVideo = null;
      console.log('DEBUG - No heroVideo ID found, setting to null');
    }

    // Handle hero banner with the same pattern
    if (mediaUploadIds.heroBanner) {
      updateData.heroBanner = mediaUploadIds.heroBanner;
      console.log(
        'DEBUG - Using new uploaded heroBanner:',
        mediaUploadIds.heroBanner
      );
    } else if (projectData.heroBannerUploadId) {
      const id = parseInt(projectData.heroBannerUploadId);
      if (!isNaN(id)) {
        updateData.heroBanner = id;
        console.log('DEBUG - Using numeric heroBanner ID:', id);
      } else {
        updateData.heroBanner = projectData.heroBannerUploadId;
        console.log(
          'DEBUG - Using string heroBanner ID:',
          projectData.heroBannerUploadId
        );
      }
    } else {
      updateData.heroBanner = null;
      console.log('DEBUG - No heroBanner ID found, setting to null');
    }

    // Handle thumbnail differently to preserve it properly
    if (mediaUploadIds.thumbnail) {
      // Case 1: New thumbnail uploaded through chunks
      // Strapi v4 format for media relations
      updateData.thumbnail = mediaUploadIds.thumbnail;
      console.log(
        'DEBUG - Using new uploaded thumbnail:',
        mediaUploadIds.thumbnail
      );
    } else if (projectData.thumbnailUploadId) {
      // Case 2: Existing thumbnail ID passed
      // In Strapi v4, media relations should use the correct format
      const id = parseInt(projectData.thumbnailUploadId);
      if (!isNaN(id)) {
        // It's a valid numeric ID
        updateData.thumbnail = id;
        console.log('DEBUG - Using numeric thumbnail ID:', id);
      } else if (
        projectData._originalThumbnail &&
        projectData._originalThumbnail.uploadId
      ) {
        // Try to get ID from original object if available
        const origId = parseInt(projectData._originalThumbnail.uploadId);
        if (!isNaN(origId)) {
          updateData.thumbnail = origId;
          console.log(
            'DEBUG - Using thumbnail ID from original object:',
            origId
          );
        } else {
          // Use fallback
          updateData.thumbnail = projectData.thumbnailUploadId;
          console.log(
            'DEBUG - Using string thumbnail ID (fallback):',
            projectData.thumbnailUploadId
          );
        }
      } else {
        // If it's not a number, it might be a special format or null
        if (
          projectData.thumbnailUploadId === 'null' ||
          projectData.thumbnailUploadId === null
        ) {
          updateData.thumbnail = null;
          console.log(
            'DEBUG - Setting thumbnail to null based on thumbnailUploadId'
          );
        } else {
          // Try to use it as is, if Strapi expects a string ID
          updateData.thumbnail = projectData.thumbnailUploadId;
          console.log(
            'DEBUG - Using string thumbnail ID:',
            projectData.thumbnailUploadId
          );
        }
      }
    } else {
      // Case 3: No thumbnail passed directly, but might be in _originalThumbnail
      if (projectData._originalThumbnail) {
        console.log(
          'DEBUG - Found _originalThumbnail without thumbnailUploadId'
        );

        if (projectData._originalThumbnail.id) {
          const origId = parseInt(projectData._originalThumbnail.id);
          if (!isNaN(origId)) {
            updateData.thumbnail = origId;
            console.log('DEBUG - Using ID from _originalThumbnail:', origId);
          }
        } else if (projectData._originalThumbnail.uploadId) {
          const origUploadId = parseInt(
            projectData._originalThumbnail.uploadId
          );
          if (!isNaN(origUploadId)) {
            updateData.thumbnail = origUploadId;
            console.log(
              'DEBUG - Using uploadId from _originalThumbnail:',
              origUploadId
            );
          }
        }
      } else {
        // Case 4: No thumbnail information available
        updateData.thumbnail = null;
        console.log('DEBUG - No thumbnail ID found, setting to null');
      }
    }

    // Handle featured image with the same pattern
    if (mediaUploadIds.featuredImage) {
      updateData.featuredImage = mediaUploadIds.featuredImage;
      console.log(
        'DEBUG - Using new uploaded featuredImage:',
        mediaUploadIds.featuredImage
      );
    } else if (projectData.featuredImageUploadId) {
      const id = parseInt(projectData.featuredImageUploadId);
      if (!isNaN(id)) {
        updateData.featuredImage = id;
        console.log('DEBUG - Using numeric featuredImage ID:', id);
      } else {
        updateData.featuredImage = projectData.featuredImageUploadId;
        console.log(
          'DEBUG - Using string featuredImage ID:',
          projectData.featuredImageUploadId
        );
      }
    } else {
      updateData.featuredImage = null;
      console.log('DEBUG - No featuredImage ID found, setting to null');
    }

    if (projectData.galleryUploadIds && projectData.galleryUploadIds.length) {
      updateData.gallery = projectData.galleryUploadIds
        .map((id) => parseInt(id))
        .filter((id) => !isNaN(id));
    }

    if (projectData.showcase) {
      updateData.showcaseSections = projectData.showcase;
    }

    console.log(
      'DEBUG - Final payload to Strapi after processing chunks:',
      updateData
    );

    // prefer server API token
    const STRAPI_API_TOKEN =
      process.env.STRAPI_API_TOKEN || process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const STRAPI_URL =
      process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

    const apiUrl = `${STRAPI_URL}/api/projects/${idParam}`;
    const headerToken = STRAPI_API_TOKEN ?? authToken;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${headerToken}`,
    };

    // Prepare the final payload for Strapi
    // In Strapi v4, the format for relations is different
    const strapiPayload: { data: Record<string, any> } = { data: {} };

    // Copy all regular fields
    Object.keys(updateData).forEach((key) => {
      // Skip media fields - they need special formatting
      if (
        ![
          'heroVideo',
          'heroBanner',
          'thumbnail',
          'featuredImage',
          'gallery',
        ].includes(key)
      ) {
        strapiPayload.data[key] = updateData[key];
      }
    });

    // Handle media relations in the correct Strapi v4 format
    // For single-file relations (like thumbnail), Strapi v4 uses different formats:
    // - set: [id] for setting a relation
    // - set: [] for clearing a relation

    if (updateData.heroVideo !== undefined) {
      if (updateData.heroVideo === null) {
        strapiPayload.data.heroVideo = null;
      } else {
        strapiPayload.data.heroVideo = {
          set: [updateData.heroVideo],
        };
      }
    }

    if (updateData.heroBanner !== undefined) {
      if (updateData.heroBanner === null) {
        strapiPayload.data.heroBanner = null;
      } else {
        strapiPayload.data.heroBanner = {
          set: [updateData.heroBanner],
        };
      }
    }

    if (updateData.thumbnail !== undefined) {
      if (updateData.thumbnail === null) {
        strapiPayload.data.thumbnail = null;
        console.log('DEBUG - Setting thumbnail to null in Strapi payload');
      } else {
        strapiPayload.data.thumbnail = {
          set: [updateData.thumbnail],
        };
        console.log(
          'DEBUG - Setting thumbnail in Strapi payload:',
          strapiPayload.data.thumbnail
        );
      }
    } else if (
      projectData._originalThumbnail &&
      projectData._originalThumbnail.id
    ) {
      // Fallback to use original thumbnail if no update was set
      const origId = parseInt(projectData._originalThumbnail.id);
      if (!isNaN(origId)) {
        strapiPayload.data.thumbnail = {
          set: [origId],
        };
        console.log(
          'DEBUG - Fallback: Using original thumbnail ID in Strapi payload:',
          origId
        );
      }
    }

    if (updateData.featuredImage !== undefined) {
      if (updateData.featuredImage === null) {
        strapiPayload.data.featuredImage = null;
      } else {
        strapiPayload.data.featuredImage = {
          set: [updateData.featuredImage],
        };
      }
    }

    if (updateData.gallery && Array.isArray(updateData.gallery)) {
      if (updateData.gallery.length === 0) {
        // For empty array, clear the relation
        strapiPayload.data.gallery = { set: [] };
      } else {
        // For gallery (many-to-many), use set with array of IDs
        strapiPayload.data.gallery = {
          set: updateData.gallery,
        };

        console.log('DEBUG - Gallery IDs to set:', updateData.gallery);
      }
    }

    if (updateData.showcaseSections) {
      strapiPayload.data.showcaseSections = updateData.showcaseSections;
    }

    console.log(
      'DEBUG - Final Strapi payload with proper relations:',
      JSON.stringify(strapiPayload, null, 2)
    );

    const updateResponse = await fetch(apiUrl, {
      method: 'PUT',
      headers,
      body: JSON.stringify(strapiPayload),
    });

    console.log('DEBUG - Strapi response status:', updateResponse.status);

    // Clean up temporary files
    if (filePaths.length > 0) {
      cleanupFiles(filePaths);
    }

    if (updateResponse.ok) {
      const updated = await updateResponse.json().catch(() => null);
      return res.status(200).json({
        message: 'Project updated successfully',
        project: updated?.data ?? updated,
      });
    }

    // If update returned 401 when using user token, instruct to use API token
    if (!STRAPI_API_TOKEN && updateResponse.status === 401) {
      return res.status(401).json({
        message:
          'Provided user token does not have permission to update projects. Create a STRAPI_API_TOKEN with update permissions and set STRAPI_API_TOKEN in env, or use an admin JWT.',
      });
    }

    let errorData: any = null;
    try {
      errorData = await updateResponse.json();
      console.log(
        'DEBUG - Strapi error response:',
        JSON.stringify(errorData, null, 2)
      );

      // Check for "Invalid relations" error specifically
      if (errorData?.error?.message?.includes('Invalid relation')) {
        console.log('DEBUG - Invalid relation error detected');
        console.log('DEBUG - Relations in request:', {
          heroVideo: updateData.heroVideo,
          heroBanner: updateData.heroBanner,
          thumbnail: updateData.thumbnail,
          featuredImage: updateData.featuredImage,
          gallery: updateData.gallery,
        });

        // Let's try an alternative approach with a different relation format
        const alternativePayload: { data: Record<string, any> } = {
          data: { ...strapiPayload.data },
        };

        // Try a different format for media relations
        ['heroVideo', 'heroBanner', 'thumbnail', 'featuredImage'].forEach(
          (field) => {
            if (updateData[field] !== undefined) {
              if (updateData[field] === null) {
                alternativePayload.data[field] = null;
              } else {
                // Try another possible Strapi format
                alternativePayload.data[field] = updateData[field];
              }
            }
          }
        );

        if (updateData.gallery && Array.isArray(updateData.gallery)) {
          // Try direct array assignment for gallery
          alternativePayload.data.gallery = updateData.gallery;
        }

        console.log(
          'DEBUG - Trying alternative payload:',
          JSON.stringify(alternativePayload, null, 2)
        );

        const retryResponse = await fetch(apiUrl, {
          method: 'PUT',
          headers,
          body: JSON.stringify(alternativePayload),
        });

        if (retryResponse.ok) {
          const updated = await retryResponse.json().catch(() => null);
          return res.status(200).json({
            message:
              'Project updated successfully with alternative relation format',
            project: updated?.data ?? updated,
          });
        } else {
          console.log(
            'DEBUG - Alternative payload also failed:',
            retryResponse.status
          );
          try {
            const retryErrorData = await retryResponse.json();
            console.log(
              'DEBUG - Alternative payload error:',
              JSON.stringify(retryErrorData, null, 2)
            );

            // One last attempt with a different format
            if (retryErrorData?.error?.message?.includes('Invalid relation')) {
              // Try a final approach with a completely different format
              const finalPayload: { data: Record<string, any> } = {
                data: { ...strapiPayload.data },
              };

              // Remove all media fields first
              [
                'heroVideo',
                'heroBanner',
                'thumbnail',
                'featuredImage',
                'gallery',
              ].forEach((field) => {
                delete finalPayload.data[field];
              });

              console.log(
                'DEBUG - Trying final payload without media fields:',
                JSON.stringify(finalPayload, null, 2)
              );

              const finalResponse = await fetch(apiUrl, {
                method: 'PUT',
                headers,
                body: JSON.stringify(finalPayload),
              });

              if (finalResponse.ok) {
                const updated = await finalResponse.json().catch(() => null);
                console.log(
                  'DEBUG - Successfully updated without media fields'
                );

                // If successful, return with a different message
                return res.status(200).json({
                  message:
                    'Project updated successfully, but media fields may need to be updated separately',
                  project: updated?.data ?? updated,
                });
              }
            }

            errorData = retryErrorData; // Update error data with the latest error
          } catch (e) {
            console.log('DEBUG - Could not parse alternative error response');
          }
        }
      }
    } catch (e) {
      console.log('DEBUG - Could not parse Strapi error response');
      errorData = await updateResponse.text().catch(() => null);
      console.log('DEBUG - Strapi error text:', errorData);
    }

    return res.status(updateResponse.status || 500).json({
      message:
        errorData?.error?.message || errorData || 'Failed to update project',
    });
  } catch (error: any) {
    // Clean up temporary files on error
    if (filePaths.length > 0) {
      cleanupFiles(filePaths);
    }

    console.error('Error updating project from chunks:', error);
    return res
      .status(500)
      .json({ message: error.message || 'Internal server error' });
  }
}
