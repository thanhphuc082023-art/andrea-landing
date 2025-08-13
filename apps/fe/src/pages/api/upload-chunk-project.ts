import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Disable body parsing for this route
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

    // Parse multipart form data using dynamic import
    const { default: formidable } = await import('formidable');
    const form = formidable({
      maxFileSize: 15 * 1024 * 1024, // 15MB max per chunk
      uploadDir: UPLOAD_DIR,
      keepExtensions: true,
    });

    const [fields, files] = await form.parse(req);

    // Extract chunk data
    const chunk = files.chunk?.[0];
    const chunkNumber = parseInt(fields.chunkNumber?.[0] || '0');
    const totalChunks = parseInt(fields.totalChunks?.[0] || '1');
    const filename = fields.filename?.[0];
    const uploadId = fields.uploadId?.[0];

    if (!chunk || !filename || !uploadId) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Chunk, filename, and uploadId are required',
      });
    }

    // Create chunk file path
    const chunkPath = path.join(UPLOAD_DIR, `${uploadId}-chunk-${chunkNumber}`);

    // Write chunk to file
    const chunkBuffer = fs.readFileSync(chunk.filepath);
    fs.writeFileSync(chunkPath, new Uint8Array(chunkBuffer));

    // Clean up temporary file
    fs.unlinkSync(chunk.filepath);

    // If this is the last chunk, combine all chunks
    if (chunkNumber === totalChunks - 1) {
      const completeFilePath = path.join(UPLOAD_DIR, `${uploadId}-complete`);
      const writeStream = fs.createWriteStream(completeFilePath);

      for (let i = 0; i < totalChunks; i++) {
        const currentChunkPath = path.join(
          UPLOAD_DIR,
          `${uploadId}-chunk-${i}`
        );

        if (fs.existsSync(currentChunkPath)) {
          const chunkData = fs.readFileSync(currentChunkPath);
          writeStream.write(new Uint8Array(chunkData));

          // Clean up chunk file
          fs.unlinkSync(currentChunkPath);
        } else {
          writeStream.end();
          return res.status(400).json({
            error: 'Missing chunk',
            message: `Chunk ${i} is missing`,
          });
        }
      }

      writeStream.end();
    }

    return res.status(200).json({
      success: true,
      chunkNumber,
      totalChunks,
      message: 'Chunk uploaded successfully',
    });
  } catch (error: any) {
    console.error('Error uploading chunk:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message || 'Failed to upload chunk',
    });
  }
}
