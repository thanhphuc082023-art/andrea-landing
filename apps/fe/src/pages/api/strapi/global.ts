import { StrapiAPI } from '@/lib/strapi';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { GlobalEntity } from '@/types/strapi';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const response = await StrapiAPI.getEntry<GlobalEntity>({
      collection: 'global',
      publicationState: 'live',
      populate: ['*'],
    });

    if (!response.data) {
      return res.status(404).json({ message: 'Global settings not found' });
    }

    // Transform the response to include full URLs for images
    const transformedData = {
      ...response.data,
      attributes: {
        ...response.data,
      },
    };

    return res.status(200).json({ data: transformedData });
  } catch (error) {
    console.error('Error fetching global settings:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
