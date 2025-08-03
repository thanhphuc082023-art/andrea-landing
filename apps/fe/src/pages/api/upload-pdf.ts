import { NextApiRequest, NextApiResponse } from 'next';
import { upload } from '@/utils/strapi-upload';
import { generateSlug } from '@/utils/slug-generator';
import formidable from 'formidable';
import fs from 'fs';
import {
  createFileFromBuffer,
  getSystemErrorMessage,
  getValidationErrorMessage,
  validateInputs,
} from '@/utils/helper';

// Disable Next.js body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let pdfFile: any = null;
  let thumbnailFile: any = null;

  try {
    // Parse form data
    const form = formidable({});
    const [fields, files] = await form.parse(req);

    // Get JWT token from request headers
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null;

    // Extract fields and files
    const title = (
      Array.isArray(fields.title) ? fields.title[0] : fields.title
    ) as string;
    pdfFile = Array.isArray(files.pdfFile) ? files.pdfFile[0] : files.pdfFile;
    thumbnailFile = Array.isArray(files.thumbnail)
      ? files.thumbnail[0]
      : files.thumbnail;

    // Validate inputs
    const validation = validateInputs(pdfFile, title, thumbnailFile);
    if (!validation.isValid) {
      return res.status(validation.status!).json({
        error: validation.error,
        message: validation.message,
      });
    }

    // Upload PDF file to Strapi
    const pdfBuffer = fs.readFileSync(pdfFile.filepath);
    const pdfFileObj = createFileFromBuffer(
      pdfBuffer,
      pdfFile.originalFilename || 'document.pdf',
      'application/pdf'
    );

    const uploadResponse = await upload(pdfFileObj, 'pdfs', token || undefined);

    if (!uploadResponse?.[0]?.id) {
      return res.status(500).json({
        error: 'Không thể tải lên PDF. Vui lòng thử lại.',
        message: 'Failed to upload PDF to Strapi',
      });
    }

    const pdfFileId = uploadResponse[0].id;

    // Upload thumbnail file to Strapi if provided
    let thumbnailFileId = null;
    if (thumbnailFile) {
      const thumbnailBuffer = fs.readFileSync(thumbnailFile.filepath);
      const thumbnailFileObj = createFileFromBuffer(
        thumbnailBuffer,
        thumbnailFile.originalFilename || 'thumbnail.jpg',
        thumbnailFile.mimetype || 'image/jpeg'
      );

      const thumbnailUploadResponse = await upload(
        thumbnailFileObj,
        'thumbnails',
        token || undefined
      );

      if (thumbnailUploadResponse?.[0]?.id) {
        thumbnailFileId = thumbnailUploadResponse[0].id;
      }
    }

    // Generate slug from title
    const slug = generateSlug(title);

    // Create book entry in Strapi
    const bookData: any = {
      data: {
        title,
        slug,
        pdfFile: pdfFileId,
        pages: [], // Empty pages array, will be populated by flipbook component
      },
    };

    // Add thumbnail if provided
    if (thumbnailFileId) {
      bookData.data.thumbnail = thumbnailFileId;
    }

    // Prepare headers for Strapi request
    const strapiHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const createBookResponse = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/books`,
      {
        method: 'POST',
        headers: strapiHeaders,
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

      return res.status(createBookResponse.status).json({
        error: errorMessage,
        message: 'Failed to create book entry in Strapi',
        details: errorData,
      });
    }

    const createdBook = await createBookResponse.json();

    // Clean up temporary files
    cleanupFiles([pdfFile, thumbnailFile]);

    return res.status(200).json({
      success: true,
      message: 'PDF uploaded and book created successfully',
      slug,
      bookId: createdBook.data.id,
    });
  } catch (error) {
    console.error('API upload error:', error);

    // Clean up files in case of error
    cleanupFiles([pdfFile, thumbnailFile]);

    const errorMessage =
      error instanceof Error
        ? getSystemErrorMessage(error)
        : 'Lỗi hệ thống. Vui lòng thử lại sau.';

    return res.status(500).json({
      error: errorMessage,
      message: 'Internal server error',
    });
  }
}
