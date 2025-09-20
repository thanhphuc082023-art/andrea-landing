import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

// Disable body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Handle different HTTP methods
  if (req.method === 'GET') {
    return res.status(200).json({
      message: 'Insights API endpoint is working',
      supportedMethods: ['POST'],
      description: 'Use POST method to create new insights',
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: `${req.method} method is not supported. Use POST to create insights.`,
      supportedMethods: ['POST', 'GET'],
    });
  }

  try {
    // Ensure tmp directory exists
    const tmpDir = path.join(process.cwd(), 'tmp');
    try {
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }
    } catch (mkdirError) {
      console.error('Error creating tmp directory:', mkdirError);
      return res.status(500).json({
        error: 'File system error',
        message: 'Unable to create temporary directory for file uploads',
      });
    }

    // Parse form data
    const form = formidable({
      uploadDir: tmpDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    const [fields, files] = await form.parse(req);

    // Extract fields (formidable returns arrays)
    const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
    const excerpt = Array.isArray(fields.excerpt)
      ? fields.excerpt[0]
      : fields.excerpt;
    const category = Array.isArray(fields.category)
      ? fields.category[0]
      : fields.category;
    const content = Array.isArray(fields.content)
      ? fields.content[0]
      : fields.content;
    const slug = Array.isArray(fields.slug) ? fields.slug[0] : fields.slug;
    const status = Array.isArray(fields.status)
      ? fields.status[0]
      : fields.status;
    const featured = Array.isArray(fields.featured)
      ? fields.featured[0] === 'true'
      : false;

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

    // Validate required fields
    if (!title || !excerpt || !category || !content) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Title, excerpt, category, and content are required',
      });
    }

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

    // Create insight data for Strapi
    const insightData = {
      data: {
        title,
        excerpt,
        category,
        content,
        slug: slug || title?.toLowerCase().replace(/\s+/g, '-'),
        insightStatus: status || 'draft',
        featured: featured || false,
        author: authorWithAvatar,
        hero: Object.keys(hero).length > 0 ? hero : undefined,
        thumbnail: uploadedFiles.thumbnail
          ? {
              file: uploadedFiles.thumbnail.id,
              name: uploadedFiles.thumbnail.name,
              url: uploadedFiles.thumbnail.url,
            }
          : undefined,
        seo: seoWithImages,
        publishedAt: status === 'published' ? new Date().toISOString() : null,
      },
    };

    // Create insight in Strapi
    const strapiUrl = `${strapiBaseUrl}/api/insights`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add authorization header if token is available
    if (STRAPI_API_TOKEN) {
      headers.Authorization = `Bearer ${STRAPI_API_TOKEN}`;
    }
    console.log('strapiUrl', strapiUrl);
    const response = await fetch(strapiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(insightData),
    });

    console.log('Strapi response status:', response.status);
    console.log(
      'Strapi response headers:',
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
        console.error('Strapi API error:', errorData?.error?.details?.errors);
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
      message: 'Insight created successfully',
    });
  } catch (error: any) {
    console.error('Error creating insight:', error);

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
      message: error.message || 'Failed to create insight',
    });
  }
}
