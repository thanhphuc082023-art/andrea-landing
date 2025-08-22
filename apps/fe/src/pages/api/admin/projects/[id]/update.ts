import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import os from 'os';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function uploadFileToStrapi(
  filePath: string,
  originalName: string,
  token: string,
  strapiUrl: string,
  category = 'projects'
) {
  const buffer = fs.readFileSync(filePath);
  const form = new FormData();
  // Node 18+ has global Blob/FormData
  const blob = new Blob([buffer]);
  form.append('files', blob, originalName);
  form.append('path', category);

  const res = await fetch(`${strapiUrl}/api/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form as any,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => null);
    throw new Error(
      `Upload to Strapi failed: ${res.status} ${res.statusText} ${text || ''}`
    );
  }

  const data = await res.json().catch(() => null);
  if (Array.isArray(data) && data.length > 0) return data[0].id;
  if (data && Array.isArray(data.data) && data.data[0]) return data.data[0].id;
  return null;
}

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
    const mediaFiles: Record<string, { path: string; name: string } | null> = {
      thumbnail: null,
      heroBanner: null,
      heroVideo: null,
      featuredImage: null,
    };

    const contentType = req.headers['content-type'] || '';

    // Use system temp dir (writable on serverless). Allow override via env.
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

    if (contentType.includes('multipart/form-data')) {
      // parse multipart with formidable
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
      // fields.data expected to contain JSON string with project fields
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

      // map files
      if (files) {
        const mapFile = (f: any) => {
          if (!f) return null;
          // formidable may return array or single
          const fileObj = Array.isArray(f) ? f[0] : f;
          let filePath = fileObj.filepath || fileObj.path;
          if (typeof filePath === 'string' && !path.isAbsolute(filePath)) {
            filePath = path.join(process.cwd(), filePath);
          }
          return {
            path: filePath,
            name: fileObj.originalFilename || fileObj.name,
          };
        };

        mediaFiles.thumbnail = mapFile(files.thumbnail);
        mediaFiles.heroBanner = mapFile(files.heroBanner);
        mediaFiles.heroVideo = mapFile(files.heroVideo);
        mediaFiles.featuredImage = mapFile(files.featuredImage);
      }
    } else {
      // JSON body
      projectData = req.body || {};
    }

    console.log('DEBUG - Project update request (server):', {
      id: idParam,
      hasThumbnailFile: !!mediaFiles.thumbnail,
      hasHeroBannerFile: !!mediaFiles.heroBanner,
      hasHeroVideoFile: !!mediaFiles.heroVideo,
      incomingDataKeys: Object.keys(projectData || {}),
    });

    // Upload any provided files to Strapi and collect IDs
    const uploadedIds: Record<string, number | null> = {
      thumbnail: null,
      heroBanner: null,
      heroVideo: null,
      featuredImage: null,
    };

    if (mediaFiles.thumbnail) {
      try {
        // ensure file exists before uploading
        const thumbPath = mediaFiles.thumbnail.path;
        if (!fs.existsSync(thumbPath)) {
          throw new Error(`Temporary file not found: ${thumbPath}`);
        }

        const id = await uploadFileToStrapi(
          thumbPath,
          mediaFiles.thumbnail.name,
          headerToken,
          STRAPI_URL
        );
        uploadedIds.thumbnail = id;
        console.log('DEBUG - Uploaded thumbnail id:', id);
      } catch (e) {
        console.error('Thumbnail upload error', e);
      }
    }

    if (mediaFiles.heroBanner) {
      try {
        const bannerPath = mediaFiles.heroBanner.path;
        if (!fs.existsSync(bannerPath)) {
          throw new Error(`Temporary file not found: ${bannerPath}`);
        }

        const id = await uploadFileToStrapi(
          bannerPath,
          mediaFiles.heroBanner.name,
          headerToken,
          STRAPI_URL
        );
        uploadedIds.heroBanner = id;
        console.log('DEBUG - Uploaded heroBanner id:', id);
      } catch (e) {
        console.error('Hero banner upload error', e);
      }
    }

    if (mediaFiles.heroVideo) {
      try {
        const videoPath = mediaFiles.heroVideo.path;
        if (!fs.existsSync(videoPath)) {
          throw new Error(`Temporary file not found: ${videoPath}`);
        }

        const id = await uploadFileToStrapi(
          videoPath,
          mediaFiles.heroVideo.name,
          headerToken,
          STRAPI_URL
        );
        uploadedIds.heroVideo = id;
        console.log('DEBUG - Uploaded heroVideo id:', id);
      } catch (e) {
        console.error('Hero video upload error', e);
      }
    }

    if (mediaFiles.featuredImage) {
      try {
        const featuredPath = mediaFiles.featuredImage.path;
        if (!fs.existsSync(featuredPath)) {
          throw new Error(`Temporary file not found: ${featuredPath}`);
        }

        const id = await uploadFileToStrapi(
          featuredPath,
          mediaFiles.featuredImage.name,
          headerToken,
          STRAPI_URL
        );
        uploadedIds.featuredImage = id;
        console.log('DEBUG - Uploaded featuredImage id:', id);
      } catch (e) {
        console.error('Featured image upload error', e);
      }
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

    // Set media IDs (prefer newly uploaded ids, otherwise use uploadId fields from client)
    if (uploadedIds.heroVideo) {
      updateData.heroVideo = uploadedIds.heroVideo;
    } else if (projectData.heroVideoUploadId) {
      const n = parseInt(projectData.heroVideoUploadId as any);
      updateData.heroVideo = isNaN(n) ? null : n;
    } else if (projectData.heroVideo?.uploadId) {
      const n = parseInt(projectData.heroVideo.uploadId);
      updateData.heroVideo = isNaN(n) ? null : n;
    }

    if (uploadedIds.heroBanner) {
      updateData.heroBanner = uploadedIds.heroBanner;
    } else if (projectData.heroBannerUploadId) {
      const n = parseInt(projectData.heroBannerUploadId as any);
      updateData.heroBanner = isNaN(n) ? null : n;
    } else if (projectData.heroBanner?.uploadId) {
      const n = parseInt(projectData.heroBanner.uploadId);
      updateData.heroBanner = isNaN(n) ? null : n;
    }

    if (uploadedIds.thumbnail) {
      updateData.thumbnail = uploadedIds.thumbnail;
    } else if (projectData.thumbnailUploadId) {
      const n = parseInt(projectData.thumbnailUploadId as any);
      updateData.thumbnail = isNaN(n) ? null : n;
    } else if (projectData.thumbnail?.uploadId) {
      const n = parseInt(projectData.thumbnail.uploadId);
      updateData.thumbnail = isNaN(n) ? null : n;
    }

    if (uploadedIds.featuredImage) {
      updateData.featuredImage = uploadedIds.featuredImage;
    } else if (projectData.featuredImageUploadId) {
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

    console.log('DEBUG - Final payload to Strapi (server):', updateData);

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
      debug: { uploadedIds },
    });
  } catch (error: any) {
    console.error('Update handler error', error);
    return res
      .status(500)
      .json({ message: error.message || 'Internal server error' });
  }
}
