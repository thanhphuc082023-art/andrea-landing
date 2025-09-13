import { NextApiRequest, NextApiResponse } from 'next';
import { upload } from '@/utils/strapi-upload';
import formidable from 'formidable';
import fs from 'fs';
import {
  createFileFromBuffer,
  getSystemErrorMessage,
  getValidationErrorMessage,
  validateInputs,
} from '@/utils/helper';

// Constants
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// Disable Next.js body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};

// Helper function to cleanup temporary files
export const cleanupFiles = (files: Array<{ filepath: string } | null>) => {
  files.forEach((file) => {
    if (file?.filepath) {
      try {
        fs.unlinkSync(file.filepath);
      } catch (error) {
        console.warn('Failed to cleanup file:', file.filepath, error);
      }
    }
  });
};

// Helper function to validate image files
const validateImageFile = (file: any) => {
  if (!file) {
    return {
      isValid: false,
      error: 'No file provided',
      status: 400,
    };
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return {
      isValid: false,
      error: `Image file too large. Maximum size is ${MAX_IMAGE_SIZE / (1024 * 1024)}MB.`,
      status: 413,
    };
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    return {
      isValid: false,
      error: `Invalid file type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`,
      status: 400,
    };
  }

  return { isValid: true, status: 200 };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let uploadedFile: any = null;

  try {
    // Parse the form data
    const form = formidable({
      maxFileSize: MAX_IMAGE_SIZE,
      keepExtensions: true,
      multiples: false,
    });

    const [fields, files] = await form.parse(req);
    
    // Get the uploaded file
    const fileArray = Array.isArray(files.file) ? files.file : [files.file];
    uploadedFile = fileArray[0];

    // Validate the file
    const validation = validateImageFile(uploadedFile);
    if (!validation.isValid) {
      cleanupFiles([uploadedFile]);
      return res.status(validation.status).json({
        error: validation.error,
      });
    }

    // Read file buffer
    const fileBuffer = fs.readFileSync(uploadedFile.filepath);
    
    // Create file object for Strapi upload
    const fileToUpload = createFileFromBuffer(
      fileBuffer,
      uploadedFile.originalFilename || uploadedFile.newFilename,
      uploadedFile.mimetype || 'application/octet-stream'
    );

    // Upload to Strapi
    const uploadResult = await upload(fileToUpload);

    if (!uploadResult || uploadResult.length === 0) {
      throw new Error('Failed to upload file to Strapi');
    }

    const uploadedFileData = uploadResult[0];

    // Cleanup temporary file
    cleanupFiles([uploadedFile]);

    return res.status(200).json({
      success: true,
      data: {
        id: uploadedFileData.id,
        name: uploadedFileData.name,
        url: uploadedFileData.url,
        mime: uploadedFileData.mime,
        size: uploadedFileData.size,
        width: uploadedFileData.width,
        height: uploadedFileData.height,
      },
      message: 'Image uploaded successfully',
    });
  } catch (error: any) {
    console.error('Error uploading image:', error);

    // Cleanup on error
    if (uploadedFile) {
      cleanupFiles([uploadedFile]);
    }

    // Handle specific error types
    if (error.message?.includes('maxFileSize')) {
      return res.status(413).json({
        error: 'File too large',
        message: `Maximum file size is ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`,
      });
    }

    if (error.message?.includes('network') || error.message?.includes('fetch')) {
      return res.status(500).json({
        error: 'Network error',
        message: 'Unable to connect to Strapi API. Please check your network connection.',
      });
    }

    return res.status(500).json({
      error: 'Internal server error',
      message: error.message || 'Failed to upload image',
    });
  }
}