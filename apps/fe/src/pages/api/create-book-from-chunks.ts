import { NextApiRequest, NextApiResponse } from 'next';
import { upload } from '@/utils/strapi-upload';
import { generateSlug } from '@/utils/slug-generator';
import fs from 'fs';
import path from 'path';
import {
  createFileFromBuffer,
  getSystemErrorMessage,
  getValidationErrorMessage,
} from '@/utils/helper';

const UPLOAD_DIR = '/tmp/uploads';

// Helper function to cleanup temporary files
export const cleanupFiles = (filePaths: string[]) => {
  filePaths.forEach((filePath) => {
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (error) {
        console.warn('Failed to cleanup file:', filePath, error);
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

  let pdfFilePath = '';
  let thumbnailFilePath: string | null = null;

  try {
    const {
      title,
      websiteUrl,
      phoneNumber,
      facebookUrl,
      downloadUrl,
      pdfUploadId,
      thumbnailUploadId,
      originalFileName,
      originalThumbnailName,
    } = req.body;

    if (!title || !pdfUploadId) {
      return res.status(400).json({
        error: 'Missing required fields: title, pdfUploadId',
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

    // Read the complete PDF file
    pdfFilePath = path.join(UPLOAD_DIR, `${pdfUploadId}-complete.pdf`);
    if (!fs.existsSync(pdfFilePath)) {
      return res.status(404).json({
        error: 'PDF file not found. Upload may have failed.',
        message: 'File not found on server',
      });
    }

    const pdfBuffer = fs.readFileSync(pdfFilePath);
    const pdfFileObj = createFileFromBuffer(
      pdfBuffer,
      originalFileName || 'document.pdf',
      'application/pdf'
    );

    // Upload PDF to Strapi
    const pdfUploadResponse = await upload(pdfFileObj, 'pdfs', token);

    if (!pdfUploadResponse?.[0]?.id) {
      cleanupFiles([pdfFilePath]);
      return res.status(500).json({
        error: 'Không thể tải PDF lên Strapi. Vui lòng thử lại.',
        message: 'Failed to upload PDF to Strapi',
      });
    }

    const pdfFileId = pdfUploadResponse[0].id;

    // Upload thumbnail if provided
    let thumbnailFileId = null;
    if (thumbnailUploadId) {
      thumbnailFilePath = path.join(
        UPLOAD_DIR,
        `${thumbnailUploadId}-complete.pdf`
      );

      if (fs.existsSync(thumbnailFilePath)) {
        const thumbnailBuffer = fs.readFileSync(thumbnailFilePath);
        const thumbnailFileObj = createFileFromBuffer(
          thumbnailBuffer,
          originalThumbnailName || 'thumbnail.jpg',
          'image/jpeg'
        );

        const thumbnailUploadResponse = await upload(
          thumbnailFileObj,
          'thumbnails',
          token
        );

        if (!thumbnailUploadResponse?.[0]?.id) {
          cleanupFiles([
            pdfFilePath,
            ...(thumbnailFilePath ? [thumbnailFilePath] : []),
          ]);
          return res.status(500).json({
            error: 'Không thể tải thumbnail lên Strapi. Vui lòng thử lại.',
            message: 'Failed to upload thumbnail to Strapi',
          });
        }

        thumbnailFileId = thumbnailUploadResponse[0].id;
        // Clean up thumbnail file
        fs.unlinkSync(thumbnailFilePath);
      }
    }

    // Generate slug
    const slug = generateSlug(title);

    // Create book entry in Strapi
    const bookData: any = {
      data: {
        title,
        slug,
        pdfFile: pdfFileId,
        pages: [],
      },
    };

    // Add optional fields if provided
    if (websiteUrl) {
      bookData.data.websiteUrl = websiteUrl;
    }

    if (phoneNumber) {
      bookData.data.phoneNumber = phoneNumber;
    }

    if (facebookUrl) {
      bookData.data.facebookUrl = facebookUrl;
    }

    if (downloadUrl) {
      bookData.data.downloadUrl = downloadUrl;
    }

    if (thumbnailFileId) {
      bookData.data.thumbnail = thumbnailFileId;
    }

    const createBookResponse = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/books`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookData),
      }
    );

    if (!createBookResponse.ok) {
      const errorData = await createBookResponse.json().catch(() => ({}));

      let errorMessage = 'Lỗi hệ thống, vui lòng thử lại sau.';

      if (createBookResponse.status === 400) {
        errorMessage = getValidationErrorMessage(errorData);
      } else if (createBookResponse.status === 401) {
        errorMessage = 'Không có quyền tạo. Vui lòng đăng nhập lại.';
      } else if (createBookResponse.status === 403) {
        errorMessage = 'Không có quyền thực hiện hành động này.';
      }

      cleanupFiles([
        pdfFilePath,
        ...(thumbnailFilePath ? [thumbnailFilePath] : []),
      ]);
      return res.status(createBookResponse.status).json({
        error: errorMessage,
        message: 'Failed to create book entry in Strapi',
        details: errorData,
      });
    }

    const createdBook = await createBookResponse.json();

    // Clean up PDF file
    fs.unlinkSync(pdfFilePath);
    if (thumbnailFilePath && fs.existsSync(thumbnailFilePath)) {
      fs.unlinkSync(thumbnailFilePath);
    }

    return res.status(200).json({
      success: true,
      message: 'PDF uploaded and book created successfully',
      slug,
      bookId: createdBook.data.id,
    });
  } catch (error) {
    console.error('API upload error:', error);

    // Clean up files in case of error
    cleanupFiles([
      pdfFilePath,
      ...(thumbnailFilePath ? [thumbnailFilePath] : []),
    ]);

    // Handle specific payload too large errors
    let errorMessage = 'Lỗi hệ thống. Vui lòng thử lại sau.';
    let statusCode = 500;

    if (error instanceof Error) {
      if (
        error.message.includes('maxFileSize') ||
        error.message.includes('FUNCTION_PAYLOAD_TOO_LARGE') ||
        error.message.includes('Request Entity Too Large')
      ) {
        errorMessage = 'File quá lớn. Vui lòng chọn file nhỏ hơn 50MB.';
        statusCode = 413;
      } else {
        errorMessage = getSystemErrorMessage(error);
      }
    }

    return res.status(statusCode).json({
      error: errorMessage,
      message: 'Internal server error',
    });
  }
}
