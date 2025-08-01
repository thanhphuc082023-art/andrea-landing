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
    console.log('PDF Upload API - Starting...');

    // Parse form data
    const form = formidable({});
    const [fields, files] = await form.parse(req);

    const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
    const pdfFile = Array.isArray(files.pdfFile)
      ? files.pdfFile[0]
      : files.pdfFile;

    console.log('Parsed fields:', { title });
    console.log('Parsed files:', { pdfFile: pdfFile?.originalFilename });

    // Validate inputs
    if (!pdfFile || !title) {
      return res.status(400).json({
        error: 'Missing required fields: pdfFile or title',
      });
    }

    if (pdfFile.mimetype !== 'application/pdf') {
      return res.status(400).json({
        error: 'Invalid file type. Only PDF files are allowed.',
      });
    }

    console.log('File validation passed');

    // Generate slug from title
    const slug = generateSlug(title);
    console.log('Generated slug:', slug);

    // Create a File object for the upload utility
    const fileBuffer = fs.readFileSync(pdfFile.filepath);
    const file = new File(
      [fileBuffer],
      pdfFile.originalFilename || 'document.pdf',
      {
        type: 'application/pdf',
      }
    );

    console.log('File object created, size:', fileBuffer.length, 'bytes');

    // Upload PDF file to Strapi
    console.log('Uploading PDF to Strapi...');
    const uploadResponse = await upload(file, 'pdfs');

    if (!uploadResponse || !uploadResponse[0] || !uploadResponse[0].id) {
      console.error('Upload response invalid:', uploadResponse);
      return res.status(500).json({
        error: 'Failed to upload PDF to Strapi',
      });
    }

    const pdfFileId = uploadResponse[0].id;
    const pdfUrl = uploadResponse[0].url;
    console.log('PDF uploaded successfully:', { pdfFileId, pdfUrl });

    // Create book entry in Strapi (simplified - no page images)
    const bookData = {
      data: {
        title,
        slug,
        pdfFile: pdfFileId,
        // Removed pages field since we're using PDF directly
      },
    };

    console.log('Creating book entry in Strapi...', bookData);

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

    if (!createBookResponse.ok) {
      const errorData = await createBookResponse.text();
      console.error('Strapi book creation error:', errorData);
      return res.status(500).json({
        error: 'Failed to create book entry in Strapi',
        details: errorData,
      });
    }

    const createdBook = await createBookResponse.json();
    console.log('Book created successfully:', createdBook.data.id);

    // Clean up temporary file
    fs.unlinkSync(pdfFile.filepath);
    console.log('Temporary file cleaned up');

    return res.status(200).json({
      success: true,
      message: 'PDF uploaded and book created successfully',
      slug,
      bookId: createdBook.data.id,
      pdfUrl,
    });
  } catch (error) {
    console.error('API route error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
