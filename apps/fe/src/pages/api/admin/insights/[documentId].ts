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

const uploadFile = async (
  file: formidable.File,
  token: string,
  strapiBaseUrl: string
) => {
  const formData = new FormData();
  const fileBuffer = fs.readFileSync(file.filepath);
  const blob = new Blob([fileBuffer], {
    type: file.mimetype || 'application/octet-stream',
  });
  formData.append('files', blob, file.originalFilename || 'file');

  const uploadResponse = await fetch(`${strapiBaseUrl}/api/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!uploadResponse.ok) {
    throw new Error(`Upload failed: ${uploadResponse.statusText}`);
  }

  const uploadResult = await uploadResponse.json();
  return uploadResult[0];
};

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
    // Parse form data
    const form = formidable({
      uploadDir: './tmp',
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    const [fields, files] = await form.parse(req);

    // Get Strapi API token from request headers or environment
    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null;
    const strapiToken =
      tokenFromHeader ||
      process.env.STRAPI_API_TOKEN ||
      process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

    const strapiBaseUrl =
      process.env.NEXT_PUBLIC_STRAPI_URL ||
      'https://tremendous-delight-4e1d7b6669.strapiapp.com';

    if (!strapiToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

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

    // Handle file uploads
    const uploadedFiles: Record<string, any> = {};
    const tempFilePaths: string[] = [];

    try {
      // Upload hero desktop image
      if (files.heroDesktop && files.heroDesktop[0]) {
        const uploadedFile = await uploadFile(
          files.heroDesktop[0],
          strapiToken,
          strapiBaseUrl
        );
        uploadedFiles.heroDesktop = uploadedFile;
        tempFilePaths.push(files.heroDesktop[0].filepath);
      }

      // Upload hero mobile image
      if (files.heroMobile && files.heroMobile[0]) {
        const uploadedFile = await uploadFile(
          files.heroMobile[0],
          strapiToken,
          strapiBaseUrl
        );
        uploadedFiles.heroMobile = uploadedFile;
        tempFilePaths.push(files.heroMobile[0].filepath);
      }

      // Upload thumbnail
      if (files.thumbnail && files.thumbnail[0]) {
        const uploadedFile = await uploadFile(
          files.thumbnail[0],
          strapiToken,
          strapiBaseUrl
        );
        uploadedFiles.thumbnail = uploadedFile;
        tempFilePaths.push(files.thumbnail[0].filepath);
      }

      // Upload author avatar
      if (files.authorAvatar && files.authorAvatar[0]) {
        const uploadedFile = await uploadFile(
          files.authorAvatar[0],
          strapiToken,
          strapiBaseUrl
        );
        uploadedFiles.authorAvatar = uploadedFile;
        tempFilePaths.push(files.authorAvatar[0].filepath);
      }

      // Upload SEO OG image
      if (files.seoOgImage && files.seoOgImage[0]) {
        const uploadedFile = await uploadFile(
          files.seoOgImage[0],
          strapiToken,
          strapiBaseUrl
        );
        uploadedFiles.seoOgImage = uploadedFile;
        tempFilePaths.push(files.seoOgImage[0].filepath);
      }

      // Upload SEO Twitter image
      if (files.seoTwitterImage && files.seoTwitterImage[0]) {
        const uploadedFile = await uploadFile(
          files.seoTwitterImage[0],
          strapiToken,
          strapiBaseUrl
        );
        uploadedFiles.seoTwitterImage = uploadedFile;
        tempFilePaths.push(files.seoTwitterImage[0].filepath);
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
            Authorization: `Bearer ${strapiToken}`,
          },
          body: JSON.stringify({ data: updateData }),
        }
      );

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(errorData.error?.message || 'Failed to update insight');
      }

      const result = await updateResponse.json();

      // Clean up uploaded files
      tempFilePaths.forEach((filePath) => {
        try {
          fs.unlinkSync(filePath);
        } catch (error) {
          console.error('Error cleaning up file:', filePath, error);
        }
      });

      res.status(200).json(result);
    } catch (error) {
      // Clean up uploaded files on error
      tempFilePaths.forEach((filePath) => {
        try {
          fs.unlinkSync(filePath);
        } catch (cleanupError) {
          console.error('Error cleaning up file:', filePath, cleanupError);
        }
      });
      throw error;
    }
  } catch (error: any) {
    console.error('Error updating insight:', error);
    res.status(500).json({
      error: error.message || 'Internal server error',
    });
  }
}
