import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    const projectData = req.body;

    if (!id) {
      return res.status(400).json({ message: 'Project id is required in URL' });
    }

    // normalize id param
    const idParam = Array.isArray(id) ? id[0] : id;

    console.log('DEBUG - Project update request:', {
      id: idParam,
      heroVideoUploadId: projectData.heroVideoUploadId,
      heroBannerUploadId: projectData.heroBannerUploadId,
      thumbnailUploadId: projectData.thumbnailUploadId,
      featuredImageUploadId: projectData.featuredImageUploadId,
      title: projectData.title,
      hasHeroVideo: !!projectData.heroVideo,
      hasHeroBanner: !!projectData.heroBanner,
      hasThumbnail: !!projectData.thumbnail,
    });

    // Get authorization token from request
    const authToken = req.headers.authorization?.replace('Bearer ', '');
    if (!authToken) {
      return res.status(401).json({ message: 'Authorization token required' });
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

    // preserve media and gallery fields if present
    // Handle both new uploads and existing media
    // For Strapi v4, media relations should be numeric IDs
    if (projectData.heroVideoUploadId) {
      const id = parseInt(projectData.heroVideoUploadId);
      updateData.heroVideo = isNaN(id) ? null : id;
    } else if (projectData.heroVideo?.uploadId) {
      const id = parseInt(projectData.heroVideo.uploadId);
      updateData.heroVideo = isNaN(id) ? null : id;
    }

    if (projectData.heroBannerUploadId) {
      const id = parseInt(projectData.heroBannerUploadId);
      updateData.heroBanner = isNaN(id) ? null : id;
    } else if (projectData.heroBanner?.uploadId) {
      const id = parseInt(projectData.heroBanner.uploadId);
      updateData.heroBanner = isNaN(id) ? null : id;
    }

    if (projectData.thumbnailUploadId) {
      const id = parseInt(projectData.thumbnailUploadId);
      updateData.thumbnail = isNaN(id) ? null : id;
    } else if (projectData.thumbnail?.uploadId) {
      const id = parseInt(projectData.thumbnail.uploadId);
      updateData.thumbnail = isNaN(id) ? null : id;
    }

    if (projectData.featuredImageUploadId) {
      const id = parseInt(projectData.featuredImageUploadId);
      updateData.featuredImage = isNaN(id) ? null : id;
    } else if (projectData.featuredImage?.uploadId) {
      const id = parseInt(projectData.featuredImage.uploadId);
      updateData.featuredImage = isNaN(id) ? null : id;
    }

    if (projectData.galleryUploadIds && projectData.galleryUploadIds.length) {
      updateData.gallery = projectData.galleryUploadIds
        .map((id) => parseInt(id))
        .filter((id) => !isNaN(id));
    } else if (projectData.gallery && Array.isArray(projectData.gallery)) {
      updateData.gallery = projectData.gallery
        .map((item) => parseInt(item.uploadId || item.id))
        .filter((id) => !isNaN(id));
    }

    if (projectData.showcase)
      updateData.showcaseSections = projectData.showcase;

    console.log('DEBUG - Final payload to Strapi:', updateData);
    console.log('DEBUG - Media field types:', {
      heroVideo: typeof updateData.heroVideo,
      heroBanner: typeof updateData.heroBanner,
      thumbnail: typeof updateData.thumbnail,
      featuredImage: typeof updateData.featuredImage,
      gallery: Array.isArray(updateData.gallery)
        ? updateData.gallery.map((id) => typeof id)
        : 'not array',
    });

    // Test approach: Remove media fields temporarily to isolate the issue
    if (process.env.NODE_ENV === 'development') {
      console.log('DEBUG - Removing media fields for testing...');
      delete updateData.heroVideo;
      delete updateData.heroBanner;
      delete updateData.thumbnail;
      delete updateData.featuredImage;
      delete updateData.gallery;
      console.log('DEBUG - Test payload without media:', updateData);
    }

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

    const updateResponse = await fetch(apiUrl, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ data: updateData }),
    });

    console.log('DEBUG - Strapi response status:', updateResponse.status);

    if (!updateResponse.ok) {
      let errorData: any = null;
      try {
        errorData = await updateResponse.json();
        console.log('DEBUG - Strapi error response:', errorData);
      } catch (e) {
        console.log('DEBUG - Could not parse Strapi error response');
        errorData = await updateResponse.text().catch(() => null);
        console.log('DEBUG - Strapi error text:', errorData);
      }
    }

    if (!updateResponse) {
      return res.status(502).json({ message: 'Failed to contact Strapi' });
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
    } catch (e) {
      errorData = await updateResponse.text().catch(() => null);
    }

    return res.status(updateResponse.status || 500).json({
      message:
        errorData?.error?.message || errorData || 'Failed to update project',
    });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: error.message || 'Internal server error' });
  }
}
