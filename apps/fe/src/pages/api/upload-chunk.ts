import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

// Disable Next.js body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

const CHUNK_SIZE = 3 * 1024 * 1024; // 3MB per chunk (under Vercel limit)
const UPLOAD_DIR = '/tmp/uploads'; // Vercel tmp directory

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({
      maxFileSize: CHUNK_SIZE,
      uploadDir: UPLOAD_DIR,
      keepExtensions: true,
    });

    const [fields, files] = await form.parse(req);

    const chunk = Array.isArray(files.chunk) ? files.chunk[0] : files.chunk;
    const chunkNumber = parseInt(
      Array.isArray(fields.chunkNumber)
        ? fields.chunkNumber[0]
        : fields.chunkNumber || '0'
    );
    const totalChunks = parseInt(
      Array.isArray(fields.totalChunks)
        ? fields.totalChunks[0]
        : fields.totalChunks || '1'
    );
    const filename = Array.isArray(fields.filename)
      ? fields.filename[0]
      : fields.filename;
    const uploadId = Array.isArray(fields.uploadId)
      ? fields.uploadId[0]
      : fields.uploadId;

    if (!chunk || !filename || !uploadId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Save chunk with upload ID and chunk number
    const chunkPath = path.join(UPLOAD_DIR, `${uploadId}-${chunkNumber}`);
    fs.copyFileSync(chunk.filepath, chunkPath);
    fs.unlinkSync(chunk.filepath); // Clean up temporary file

    // Check if all chunks are uploaded
    const uploadedChunks: number[] = [];
    for (let i = 0; i < totalChunks; i++) {
      const chunkFile = path.join(UPLOAD_DIR, `${uploadId}-${i}`);
      if (fs.existsSync(chunkFile)) {
        uploadedChunks.push(i);
      }
    }

    if (uploadedChunks.length === totalChunks) {
      // All chunks uploaded, combine them
      const finalPath = path.join(UPLOAD_DIR, `${uploadId}-complete.pdf`);
      const writeStream = fs.createWriteStream(finalPath);

      for (let i = 0; i < totalChunks; i++) {
        const chunkFile = path.join(UPLOAD_DIR, `${uploadId}-${i}`);
        const chunkData = fs.readFileSync(chunkFile);
        writeStream.write(chunkData);
        fs.unlinkSync(chunkFile); // Clean up chunk
      }

      writeStream.end();

      return res.status(200).json({
        success: true,
        message: 'Upload complete',
        filename,
        uploadId,
        filePath: finalPath,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Chunk ${chunkNumber + 1}/${totalChunks} uploaded`,
      uploadedChunks: uploadedChunks.length,
      totalChunks,
    });
  } catch (error) {
    console.error('Chunk upload error:', error);
    return res.status(500).json({
      error: 'Lỗi upload chunk. Vui lòng thử lại.',
    });
  }
}
