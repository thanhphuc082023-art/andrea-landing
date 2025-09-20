import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import os from 'os';

// Disable body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

interface StrapiInsight {
  id: number;
  attributes: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    status: string;
    featured: boolean;
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
    author: any;
    hero: any;
    thumbnail: any;
    seo: any;
  };
}

interface StrapiResponse {
  data: StrapiInsight[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { documentId } = req.query;

  if (!documentId || typeof documentId !== 'string') {
    return res.status(400).json({ error: 'Invalid documentId' });
  }

  try {
    // Use system temp directory instead of creating our own
    const tmpDir = os.tmpdir();

    // Parse form data
    const form = formidable({
      uploadDir: tmpDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    const [fields, files] = await form.parse(req);

    // Get Strapi API token from request headers or environment
    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null;
    const STRAPI_API_TOKEN =
      tokenFromHeader ||
      process.env.STRAPI_API_TOKEN ||
      process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

    const strapiBaseUrl =
      process.env.NEXT_PUBLIC_STRAPI_URL ||
      'https://tremendous-delight-4e1d7b6669.strapiapp.com';

    // Helper function to upload file to Strapi
    const uploadFileToStrapi = async (file: formidable.File) => {
      try {
        // Check if file exists before reading
        if (!fs.existsSync(file.filepath)) {
          throw new Error(`File not found: ${file.filepath}`);
        }

        const formData = new FormData();
        const fileBuffer = fs.readFileSync(file.filepath);
        const blob = new Blob([fileBuffer], {
          type: file.mimetype || 'application/octet-stream',
        });
        formData.append(
          'files',
          blob,
          file.originalFilename || file.newFilename
        );

        const uploadResponse = await fetch(`${strapiBaseUrl}/api/upload`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${STRAPI_API_TOKEN}`,
          },
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error(
            `Failed to upload file: ${uploadResponse.statusText}`
          );
        }

        const uploadResult = await uploadResponse.json();
        // Clean up temp file
        try {
          fs.unlinkSync(file.filepath);
        } catch (unlinkError) {
          console.warn(
            'Warning: Could not delete temp file:',
            file.filepath,
            unlinkError
          );
        }
        return uploadResult[0]; // Strapi returns array of uploaded files
      } catch (error) {
        // Clean up temp file on error
        try {
          if (fs.existsSync(file.filepath)) {
            fs.unlinkSync(file.filepath);
          }
        } catch (cleanupError) {
          console.warn(
            'Warning: Could not delete temp file on error:',
            file.filepath,
            cleanupError
          );
        }
        throw error;
      }
    };

    // Prepare update data
    const updateData: any = {
      title: Array.isArray(fields.title) ? fields.title[0] : fields.title,
      excerpt: Array.isArray(fields.excerpt)
        ? fields.excerpt[0]
        : fields.excerpt,
      category: Array.isArray(fields.category)
        ? fields.category[0]
        : fields.category,
      content: Array.isArray(fields.content)
        ? fields.content[0]
        : fields.content,
      slug: Array.isArray(fields.slug) ? fields.slug[0] : fields.slug,
      insightStatus: Array.isArray(fields.status)
        ? fields.status[0]
        : fields.status,
      featured: Array.isArray(fields.featured)
        ? fields.featured[0] === 'true'
        : fields.featured === 'true',
    };

    // Parse JSON fields
    let author, seo;
    try {
      author = fields.author
        ? JSON.parse(
            Array.isArray(fields.author) ? fields.author[0] : fields.author
          )
        : {};
    } catch (e) {
      author = {};
    }

    try {
      seo = fields.seo
        ? JSON.parse(Array.isArray(fields.seo) ? fields.seo[0] : fields.seo)
        : {};
    } catch (e) {
      seo = {};
    }

    // Upload files and get their IDs
    const uploadedFiles: Record<string, any> = {};

    if (files.heroDesktop) {
      const file = Array.isArray(files.heroDesktop)
        ? files.heroDesktop[0]
        : files.heroDesktop;
      uploadedFiles.heroDesktop = await uploadFileToStrapi(file);
    }

    if (files.heroMobile) {
      const file = Array.isArray(files.heroMobile)
        ? files.heroMobile[0]
        : files.heroMobile;
      uploadedFiles.heroMobile = await uploadFileToStrapi(file);
    }

    if (files.thumbnail) {
      const file = Array.isArray(files.thumbnail)
        ? files.thumbnail[0]
        : files.thumbnail;
      uploadedFiles.thumbnail = await uploadFileToStrapi(file);
    }

    if (files.authorAvatar) {
      const file = Array.isArray(files.authorAvatar)
        ? files.authorAvatar[0]
        : files.authorAvatar;
      uploadedFiles.authorAvatar = await uploadFileToStrapi(file);
    }

    if (files.seoOgImage) {
      const file = Array.isArray(files.seoOgImage)
        ? files.seoOgImage[0]
        : files.seoOgImage;
      uploadedFiles.seoOgImage = await uploadFileToStrapi(file);
    }

    if (files.seoTwitterImage) {
      const file = Array.isArray(files.seoTwitterImage)
        ? files.seoTwitterImage[0]
        : files.seoTwitterImage;
      uploadedFiles.seoTwitterImage = await uploadFileToStrapi(file);
    }

    // Build hero object according to Strapi component structure
    const hero: any = {};
    if (uploadedFiles.heroDesktop) {
      hero.desktop = {
        file: uploadedFiles.heroDesktop.id,
        name: uploadedFiles.heroDesktop.name,
        url: uploadedFiles.heroDesktop.url,
      };
    }
    if (uploadedFiles.heroMobile) {
      hero.mobile = {
        file: uploadedFiles.heroMobile.id,
        name: uploadedFiles.heroMobile.name,
        url: uploadedFiles.heroMobile.url,
      };
    }

    // Build author object with avatar
    const authorWithAvatar = { ...author };
    if (uploadedFiles.authorAvatar) {
      authorWithAvatar.avatar = {
        file: uploadedFiles.authorAvatar.id,
        name: uploadedFiles.authorAvatar.name,
        url: uploadedFiles.authorAvatar.url,
      };
    }

    // Build SEO object with images
    const seoWithImages = { ...seo };
    if (uploadedFiles.seoOgImage) {
      seoWithImages.ogImage = {
        file: uploadedFiles.seoOgImage.id,
        name: uploadedFiles.seoOgImage.name,
        url: uploadedFiles.seoOgImage.url,
      };
    }
    if (uploadedFiles.seoTwitterImage) {
      seoWithImages.twitterImage = {
        file: uploadedFiles.seoTwitterImage.id,
        name: uploadedFiles.seoTwitterImage.name,
        url: uploadedFiles.seoTwitterImage.url,
      };
    }

    // Update the updateData with proper structure
    updateData.author = authorWithAvatar;
    updateData.hero = Object.keys(hero).length > 0 ? hero : undefined;
    updateData.thumbnail = uploadedFiles.thumbnail
      ? {
          file: uploadedFiles.thumbnail.id,
          name: uploadedFiles.thumbnail.name,
          url: uploadedFiles.thumbnail.url,
        }
      : undefined;
    updateData.seo = seoWithImages;
    updateData.publishedAt =
      updateData.insightStatus === 'published'
        ? new Date().toISOString()
        : null;

    // Update insight in Strapi
    const updateResponse = await fetch(
      `${strapiBaseUrl}/api/insights/${documentId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify({ data: updateData }),
      }
    );

    if (!updateResponse.ok) {
      let errorData;
      try {
        errorData = await updateResponse.json();
        console.error('Strapi API error:', errorData?.error?.details?.errors);
        throw new Error(
          errorData.error?.message ||
            `Strapi API error: ${updateResponse.status} ${updateResponse.statusText}`
        );
      } catch (parseError) {
        // If response is not JSON (e.g., HTML error page), use status text
        console.error(
          'Strapi API error (non-JSON):',
          updateResponse.status,
          updateResponse.statusText
        );
        throw new Error(
          `Strapi API error: ${updateResponse.status} ${updateResponse.statusText}`
        );
      }
    }

    const result = await updateResponse.json();

    return res.status(200).json({
      success: true,
      data: result.data,
      message: 'Insight updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating insight:', error);

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
      message: error.message || 'Failed to update insight',
    });
  }
}
