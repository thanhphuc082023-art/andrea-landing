import { upload } from './strapi-upload';

/**
 * Updates a project in Strapi with optional media file uploads
 * @param projectId - The ID of the project to update
 * @param fields - Project data fields to update
 * @param thumbnailFile - Optional thumbnail file to upload
 * @param heroBannerFile - Optional hero banner file to upload
 * @param heroVideoFile - Optional hero video file to upload
 * @param token - JWT token for authentication
 * @returns Promise with the updated project data
 */
export async function updateProject(
  projectId: number | string,
  fields: Record<string, any>,
  thumbnailFile?: File | null,
  heroBannerFile?: File | null,
  heroVideoFile?: File | null,
  token?: string
): Promise<any> {
  try {
    let thumbnailId: number | undefined;
    let heroBannerId: number | undefined;
    let heroVideoId: number | undefined;

    // Step 1: Upload media files if provided
    if (thumbnailFile) {
      const uploadResponse = await upload(thumbnailFile, 'projects', token);

      // Check if upload was successful and get the file ID
      if (!uploadResponse || !uploadResponse[0]?.id) {
        throw new Error('Failed to upload thumbnail');
      }

      thumbnailId = uploadResponse[0].id;
      console.log('DEBUG - Thumbnail uploaded successfully, ID:', thumbnailId);
    }

    if (heroBannerFile) {
      const uploadResponse = await upload(heroBannerFile, 'projects', token);

      // Check if upload was successful and get the file ID
      if (!uploadResponse || !uploadResponse[0]?.id) {
        throw new Error('Failed to upload hero banner');
      }

      heroBannerId = uploadResponse[0].id;
      console.log(
        'DEBUG - Hero banner uploaded successfully, ID:',
        heroBannerId
      );
    }

    if (heroVideoFile) {
      const uploadResponse = await upload(heroVideoFile, 'projects', token);

      // Check if upload was successful and get the file ID
      if (!uploadResponse || !uploadResponse[0]?.id) {
        throw new Error('Failed to upload hero video');
      }

      heroVideoId = uploadResponse[0].id;
      console.log('DEBUG - Hero video uploaded successfully, ID:', heroVideoId);
    }

    // Step 2: Prepare update data
    const updateData = {
      ...fields,
      // Only include media files if we have new ones
      ...(thumbnailId !== undefined && { thumbnail: thumbnailId }),
      ...(heroBannerId !== undefined && { heroBanner: heroBannerId }),
      ...(heroVideoId !== undefined && { heroVideo: heroVideoId }),
    };

    console.log('DEBUG - Sending to Strapi API:', {
      projectId,
      updateData,
      hasThumbnail: thumbnailId !== undefined,
      hasHeroBanner: heroBannerId !== undefined,
      hasHeroVideo: heroVideoId !== undefined,
    });

    // Step 3: Update the project with the prepared data
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/projects/${projectId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ data: updateData }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `Failed to update project: ${response.status}`
      );
    }

    // Return the updated project data
    return await response.json();
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
}
