import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const UPLOAD_DIR = '/tmp/uploads';

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

function getMimeTypeFromExtension(ext: string): string {
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.mov': 'video/quicktime',
    '.avi': 'video/x-msvideo',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx':
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

interface MediaUploadResult {
  id: number;
  url: string;
  name: string;
  mime: string;
  width?: number;
  height?: number;
}

async function uploadToStrapi(
  filePath: string,
  originalName: string,
  token: string,
  category: string = 'showcase'
): Promise<MediaUploadResult | null> {
  try {
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return null;
    }

    const fileBuffer = fs.readFileSync(filePath);

    const ext = path.extname(originalName).toLowerCase();
    const mimeType = getMimeTypeFromExtension(ext);

    const formData = new FormData();
    const blob = new Blob([fileBuffer], { type: mimeType });
    formData.append('files', blob, originalName);
    formData.append('path', category);

    const strapiBaseUrl =
      process.env.NEXT_PUBLIC_STRAPI_URL ||
      'https://tremendous-delight-4e1d7b6669.strapiapp.com';
    const uploadUrl = `${strapiBaseUrl}/api/upload`;

    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Upload failed for ${originalName}:`,
        response.status,
        errorText
      );
      return null;
    }

    const result = await response.json();
    if (result && result.length > 0) {
      const uploadedFile = result[0];
      return {
        id: uploadedFile.id,
        url: uploadedFile.url,
        name: uploadedFile.name,
        mime: uploadedFile.mime,
        width: uploadedFile.width,
        height: uploadedFile.height,
      };
    }

    return null;
  } catch (error) {
    console.error(`Error uploading ${originalName}:`, error);
    return null;
  }
}

function findUploadedFile(
  uploadId: string
): { filePath: string; originalName: string } | null {
  try {
    const completePath = path.join(UPLOAD_DIR, `${uploadId}-complete`);

    const possibleExtensions = [
      '.jpg',
      '.jpeg',
      '.png',
      '.gif',
      '.webp',
      '.mp4',
      '.mov',
      '.avi',
      '.pdf',
      '.doc',
      '.docx',
    ];

    for (const ext of possibleExtensions) {
      const testPath = `${completePath}${ext}`;
      if (fs.existsSync(testPath)) {
        const metaPath = path.join(UPLOAD_DIR, `${uploadId}-meta.json`);
        let originalName = `file${ext}`;

        if (fs.existsSync(metaPath)) {
          try {
            const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
            originalName = meta.originalName || originalName;
          } catch (e) {
            console.warn(`Could not read metadata for ${uploadId}`);
          }
        }

        return { filePath: testPath, originalName };
      }
    }

    console.error(`Upload file not found for ID: ${uploadId}`);
    return null;
  } catch (error) {
    console.error(`Error finding uploaded file ${uploadId}:`, error);
    return null;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token =
      process.env.STRAPI_API_TOKEN ||
      req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing authentication token',
      });
    }

    const {
      showcaseSections,
      showcaseUploadIds = [],
      showcaseOriginalNames = [],
    } = req.body || {};

    // Upload files referenced by upload IDs and map them back by uploadId
    const uploadedByUploadId: Map<
      string,
      { id: number; url: string; name?: string }
    > = new Map();
    const strapiBaseUrl =
      process.env.NEXT_PUBLIC_STRAPI_URL ||
      'https://tremendous-delight-4e1d7b6669.strapiapp.com';

    for (let i = 0; i < (showcaseUploadIds || []).length; i++) {
      const uploadId = showcaseUploadIds[i];
      const originalName = showcaseOriginalNames[i] || `showcase-${i}`;

      const fileInfo = findUploadedFile(uploadId);
      if (!fileInfo) {
        console.warn(`Uploaded temp file not found for uploadId=${uploadId}`);
        continue;
      }

      const uploadResult = await uploadToStrapi(
        fileInfo.filePath,
        originalName,
        token,
        'showcase'
      );

      if (uploadResult) {
        const url =
          uploadResult.url && uploadResult.url.startsWith('http')
            ? uploadResult.url
            : `${strapiBaseUrl}${uploadResult.url}`;
        uploadedByUploadId.set(uploadId, {
          id: uploadResult.id,
          url,
          name: uploadResult.name,
        });
      }
    }

    // Map uploaded files back into showcaseSections using uploadId references
    const processedSections = (showcaseSections || []).map(
      (section: any, sectionIndex: number) => {
        const items = Array.isArray(section.items)
          ? section.items
          : [section.items];

        const processedItems = (items || []).map(
          (item: any, itemIndex: number) => {
            if (
              item &&
              item.uploadId &&
              uploadedByUploadId.has(item.uploadId)
            ) {
              const up = uploadedByUploadId.get(item.uploadId)!;
              return {
                ...item,
                id: item.id || `item-${sectionIndex}-${itemIndex}`,
                src: up.url,
                type: item.type || 'image',
                title: item.title || `Item ${itemIndex + 1}`,
                alt: item.alt || item.title || `Item ${itemIndex + 1}`,
                width: item.width || 1300,
                height: item.height || 800,
                order: item.order !== undefined ? item.order : itemIndex,
              };
            }

            return {
              ...item,
              id: item.id || `item-${sectionIndex}-${itemIndex}`,
              type: item.type || 'image',
              title: item.title || `Item ${itemIndex + 1}`,
              alt: item.alt || item.title || `Item ${itemIndex + 1}`,
              src: item.src || item.url || '',
              width: item.width || 1300,
              height: item.height || 800,
              order: item.order !== undefined ? item.order : itemIndex,
            };
          }
        );

        // Section-level background/image
        let background = section.background || null;
        if (
          section.backgroundUploadId &&
          uploadedByUploadId.has(section.backgroundUploadId)
        ) {
          const up = uploadedByUploadId.get(section.backgroundUploadId)!;
          background = { id: up.id, url: up.url, name: up.name };
        }

        let image = section.image || null;
        if (
          section.imageUploadId &&
          uploadedByUploadId.has(section.imageUploadId)
        ) {
          const up = uploadedByUploadId.get(section.imageUploadId)!;
          image = { id: up.id, url: up.url, name: up.name };
        }

        return {
          ...section,
          id: section.id || `section-${sectionIndex}`,
          title: section.title || `Section ${sectionIndex + 1}`,
          type: section.type || 'image',
          layout: section.layout || 'single',
          items: processedItems,
          ...(background ? { background } : {}),
          ...(image ? { image } : {}),
          order: section.order !== undefined ? section.order : sectionIndex,
        };
      }
    );

    return res.status(200).json({ processedShowcase: processedSections });
  } catch (error: any) {
    console.error('Error in process-showcase:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message || 'Failed to process showcase',
    });
  }
}
