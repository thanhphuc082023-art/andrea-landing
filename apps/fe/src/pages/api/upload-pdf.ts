import { NextApiRequest, NextApiResponse } from 'next';
import { upload } from '@/utils/strapi-upload';
import { generateSlug } from '@/utils/slug-generator';
import formidable from 'formidable';
import fs from 'fs';

// Disable Next.js body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse form data
    const form = formidable({});
    const [fields, files] = await form.parse(req);

    const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
    const pdfFile = Array.isArray(files.pdfFile)
      ? files.pdfFile[0]
      : files.pdfFile;

    // Validate inputs
    if (!pdfFile || !title) {
      return res.status(400).json({
        error: 'Missing required fields: pdfFile, title',
      });
    }

    if (pdfFile.mimetype !== 'application/pdf') {
      return res.status(400).json({
        error: 'Invalid file type. Only PDF files are allowed.',
      });
    }

    // Create a File object for the upload utility
    const fileBuffer = fs.readFileSync(pdfFile.filepath);
    const file = new File(
      [fileBuffer],
      pdfFile.originalFilename || 'document.pdf',
      {
        type: 'application/pdf',
      }
    );

    // Upload PDF file to Strapi
    const uploadResponse = await upload(file, 'pdfs');

    if (!uploadResponse || !uploadResponse[0] || !uploadResponse[0].id) {
      return res.status(500).json({
        error: 'Failed to upload PDF to Strapi',
      });
    }

    const pdfFileId = uploadResponse[0].id;

    // Generate slug from title
    const slug = generateSlug(title);

    // Create book entry in Strapi
    const bookData = {
      data: {
        title,
        slug,
        pdfFile: pdfFileId,
        pages: [], // Empty pages array, will be populated by flipbook component
      },
    };
    console.log(bookData);
    const createBookResponse = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/books`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      }
    );
    console.log('Upload createBookResponse:', createBookResponse);

    if (!createBookResponse.ok) {
      return res.status(500).json({
        error: 'Failed to create book entry in Strapi',
      });
    }

    const createdBook = await createBookResponse.json();

    // Clean up temporary file
    fs.unlinkSync(pdfFile.filepath);

    return res.status(200).json({
      success: true,
      message: 'PDF uploaded and book created successfully',
      slug,
      bookId: createdBook.data.id,
    });
  } catch (error) {
    // API route error
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
}
