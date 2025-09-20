import { NextApiRequest, NextApiResponse } from 'next';
import { upload } from '@/utils/strapi-upload';
import formidable from 'formidable';
import fs from 'fs';

// Disable Next.js body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let file: any = null;

  try {
    const form = formidable({
      maxFileSize: MAX_FILE_SIZE,
      maxFields: 5,
      // maxFieldsSize: 1024 * 1024, // 1MB for fields
    });

    const [fields, files] = await form.parse(req);

    // Get JWT token from request headers
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null;

    file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.mimetype || '')) {
      return res.status(400).json({
        error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.',
      });
    }

    // Validate file size
    if (file.size && file.size > MAX_FILE_SIZE) {
      return res.status(400).json({
        error: 'File too large. Maximum size is 10MB.',
      });
    }

    // Read file buffer
    const fileBuffer = fs.readFileSync(file.filepath);

    // Create File object from buffer
    const fileObj = new File(
      [fileBuffer],
      file.originalFilename || 'image.jpg',
      {
        type: file.mimetype || 'image/jpeg',
      }
    );

    // Upload to Strapi
    const uploadResponse = await upload(
      fileObj,
      'editor-images',
      token || undefined
    );

    if (!uploadResponse?.[0]?.id) {
      return res.status(500).json({
        error: 'Failed to upload image to Strapi',
      });
    }

    const uploadedFile = uploadResponse[0];

    // Clean up temporary file
    if (file.filepath) {
      fs.unlinkSync(file.filepath);
    }

    // Return the uploaded file data in the format expected by React Email Editor
    res.status(200).json({
      success: true,
      data: {
        id: uploadedFile.id,
        url: `${process.env.NEXT_PUBLIC_STRAPI_URL}${uploadedFile.url}`,
        name: uploadedFile.name,
        size: uploadedFile.size,
        mime: uploadedFile.mime,
      },
    });
  } catch (error) {
    console.error('Error uploading editor image:', error);

    // Clean up temporary file if it exists
    if (file?.filepath) {
      try {
        fs.unlinkSync(file.filepath);
      } catch (cleanupError) {
        console.error('Error cleaning up file:', cleanupError);
      }
    }

    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
