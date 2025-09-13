import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import os from 'os';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Allow larger JSON payloads
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ message: 'Project id is required in URL' });
    }
    const idParam = Array.isArray(id) ? id[0] : id;

    // prefer server API token
    const STRAPI_API_TOKEN =
      process.env.STRAPI_API_TOKEN || process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const STRAPI_URL =
      process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

    // Get authorization token from request header (fallback if no server token)
    const authToken = req.headers.authorization?.replace('Bearer ', '');
    const headerToken = STRAPI_API_TOKEN ?? authToken;
    if (!headerToken) {
      return res.status(401).json({ message: 'Authorization token required' });
    }

    let projectData: any = {};

    const contentType = req.headers['content-type'] || '';

    // Since files are now uploaded client-side, we primarily expect JSON data
    if (contentType.includes('application/json')) {
      // With bodyParser enabled, req.body should contain the parsed JSON
      projectData = req.body || {};
    } else if (contentType.includes('multipart/form-data')) {
      // Keep multipart handling for backward compatibility
      const TMP_DIR =
        process.env.TMP_DIR || path.join(os.tmpdir(), 'andrea-landing-tmp');
      try {
        fs.mkdirSync(TMP_DIR, { recursive: true });
      } catch (err) {
        console.warn(
          'Could not create TMP_DIR, falling back to os.tmpdir()',
          err
        );
      }

      const form = formidable({
        multiples: false,
        uploadDir: TMP_DIR,
        keepExtensions: true,
      });

      const parsed: any = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) return reject(err);
          resolve({ fields, files });
        });
      });

      const { fields, files } = parsed;
      if (fields?.data) {
        try {
          projectData = JSON.parse(
            Array.isArray(fields.data) ? fields.data[0] : fields.data
          );
        } catch (e) {
          projectData = fields;
        }
      } else {
        projectData = fields;
      }

      // Handle any remaining files if they exist (backward compatibility)
      if (files) {
        // Keep the existing file handling logic for backward compatibility
      }
    } else {
      // Fallback: try to parse req.body anyway
      projectData = req.body || {};
    }

    // Prepare update data for Strapi (only include known fields)
    const updateData: any = {
      title: projectData.title,
      videoLink: projectData.videoLink,
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
      body: projectData.body,
    };

    // Set media IDs (use uploadIds sent from client)
    if (projectData.heroVideoUploadId) {
      const n = parseInt(projectData.heroVideoUploadId as any);
      updateData.heroVideo = isNaN(n) ? null : n;
    } else if (projectData.heroVideo?.uploadId) {
      const n = parseInt(projectData.heroVideo.uploadId);
      updateData.heroVideo = isNaN(n) ? null : n;
    }

    if (projectData.heroBannerUploadId) {
      const n = parseInt(projectData.heroBannerUploadId as any);
      updateData.heroBanner = isNaN(n) ? null : n;
    } else if (projectData.heroBanner?.uploadId) {
      const n = parseInt(projectData.heroBanner.uploadId);
      updateData.heroBanner = isNaN(n) ? null : n;
    }

    if (projectData.thumbnailUploadId) {
      const n = parseInt(projectData.thumbnailUploadId as any);
      updateData.thumbnail = isNaN(n) ? null : n;
    } else if (projectData.thumbnail?.uploadId) {
      const n = parseInt(projectData.thumbnail.uploadId);
      updateData.thumbnail = isNaN(n) ? null : n;
    }

    if (projectData.featuredImageUploadId) {
      const n = parseInt(projectData.featuredImageUploadId as any);
      updateData.featuredImage = isNaN(n) ? null : n;
    } else if (projectData.featuredImage?.uploadId) {
      const n = parseInt(projectData.featuredImage.uploadId);
      updateData.featuredImage = isNaN(n) ? null : n;
    }

    if (projectData.galleryUploadIds && projectData.galleryUploadIds.length) {
      updateData.gallery = projectData.galleryUploadIds
        .map((i: any) => parseInt(i))
        .filter((i: number) => !isNaN(i));
    } else if (projectData.gallery && Array.isArray(projectData.gallery)) {
      updateData.gallery = projectData.gallery
        .map((item: any) => parseInt(item.uploadId || item.id))
        .filter((i: number) => !isNaN(i));
    }

    // Accept both older `showcase` key and new `showcaseSections` key from client
    const incomingShowcase =
      projectData.showcaseSections ?? projectData.showcase;
    if (incomingShowcase) {
      // ensure it's an array
      updateData.showcaseSections = Array.isArray(incomingShowcase)
        ? incomingShowcase
        : typeof incomingShowcase === 'string'
          ? JSON.parse(incomingShowcase)
          : incomingShowcase;
    }

    const apiUrl = `${STRAPI_URL}/api/projects/${idParam}`;

    // Build the Strapi payload with proper relations for Strapi v4
    const strapiPayload: any = { data: {} };
    Object.keys(updateData || {}).forEach((key) => {
      strapiPayload.data[key] = updateData[key];
    });

    // For single media relations ensure numeric id is set as value (Strapi accepts set: id for relations when using relational endpoints)
    // We'll send the simple numeric value; Strapi should accept it in data for single media fields.

    const updateResponse = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${headerToken}`,
      },
      body: JSON.stringify({ data: strapiPayload.data }),
    });

    if (!updateResponse.ok) {
      let errorData: any = null;
      try {
        errorData = await updateResponse.json();
        console.log('DEBUG - Strapi error response:', errorData);
      } catch (e) {
        errorData = await updateResponse.text().catch(() => null);
        console.log('DEBUG - Strapi error text:', errorData);
      }

      if (!STRAPI_API_TOKEN && updateResponse.status === 401) {
        return res.status(401).json({
          message:
            'Provided user token does not have permission to update projects. Create a STRAPI_API_TOKEN with update permissions and set STRAPI_API_TOKEN in env, or use an admin JWT.',
        });
      }

      return res.status(updateResponse.status || 500).json({
        message:
          errorData?.error?.message || errorData || 'Failed to update project',
      });
    }

    const updated = await updateResponse.json().catch(() => null);

    return res.status(200).json({
      message: 'Project updated successfully',
      project: updated?.data ?? updated,
      debug: {
        processedUploadIds: {
          thumbnail: updateData.thumbnail,
          heroBanner: updateData.heroBanner,
          heroVideo: updateData.heroVideo,
          featuredImage: updateData.featuredImage,
        },
        clientUploadIds: {
          thumbnail: projectData.thumbnailUploadId,
          heroBanner: projectData.heroBannerUploadId,
          heroVideo: projectData.heroVideoUploadId,
          featuredImage: projectData.featuredImageUploadId,
        },
      },
    });
  } catch (error: any) {
    console.error('Update handler error', error);
    return res
      .status(500)
      .json({ message: error.message || 'Internal server error' });
  }
}
