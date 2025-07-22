import { StrapiAPI } from '@/lib/strapi';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { TagEntity } from '@/types/strapi';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { page = 1, pageSize = 100, sort = 'name:asc' } = req.query;

    const params: any = {
      sort: Array.isArray(sort) ? sort : [sort],
      pagination: {
        page: Number(page),
        pageSize: Number(pageSize),
      },
      publicationState: 'live',
    };

    const response = await StrapiAPI.getCollection<TagEntity>('tags', params);
    return res.status(200).json({
      data: response.data,
      meta: response.meta,
    });
  } catch (error) {
    console.error('Error fetching tags:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
