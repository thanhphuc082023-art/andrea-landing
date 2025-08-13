import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export const cleanupFiles = (filePaths: string[]) => {
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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let filePath = '';

  try {
    const { uploadId, originalFileName, uploadPath = 'projects' } = req.body;

    if (!uploadId || !originalFileName) {
      return res.status(400).json({
        error: 'Missing required fields: uploadId, originalFileName',
        message: 'Missing required fields',
      });
    }

    // Get JWT token from request headers
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing or invalid authorization token',
      });
    }

    // Read the complete file
    filePath = path.join(UPLOAD_DIR, `${uploadId}-complete`);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        error: 'File not found. Upload may have failed.',
        message: 'File not found on server',
      });
    }

    const fileBuffer = fs.readFileSync(filePath);

    // Create file object for upload
    const file = new File([fileBuffer], originalFileName, {
      type: 'application/octet-stream',
    });

    // Upload to Strapi
    const { upload } = await import('@/utils/strapi-upload');
    const uploadResponse = await upload(file, uploadPath, token);

    if (!uploadResponse?.[0]?.id) {
      cleanupFiles([filePath]);
      return res.status(500).json({
        error: 'Không thể tải file lên Strapi. Vui lòng thử lại.',
        message: 'Failed to upload file to Strapi',
      });
    }

    const fileId = uploadResponse[0].id;

    // Clean up temporary file
    cleanupFiles([filePath]);

    return res.status(200).json({
      success: true,
      uploadId: fileId,
      fileName: originalFileName,
      message: 'File created successfully',
    });
  } catch (error: any) {
    console.error('Error creating file from chunks:', error);

    // Clean up on error
    if (filePath) {
      cleanupFiles([filePath]);
    }

    return res.status(500).json({
      error: 'Internal server error',
      message: error.message || 'Failed to create file from chunks',
    });
  }
}
