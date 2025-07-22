import { StrapiAPI } from '@/lib/strapi';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { CategoryEntity } from '@/types/strapi';

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
      populate: ['icon'],
      sort: Array.isArray(sort) ? sort : [sort],
      pagination: {
        page: Number(page),
        pageSize: Number(pageSize),
      },
      publicationState: 'live',
    };

    const response = await StrapiAPI.getCollection<CategoryEntity>(
      'categories',
      params
    );

    // Transform the response to include full URLs for images
    const transformedData = response.data.map((category) => ({
      ...category,
      attributes: {
        ...category.attributes,
        icon: category.attributes.icon
          ? {
              data: {
                ...category.attributes.icon,
                attributes: {
                  ...category.attributes.icon,
                  url: StrapiAPI.getMediaUrl(category.attributes.icon.url),
                },
              },
            }
          : null,
      },
    }));

    return res.status(200).json({
      data: transformedData,
      meta: response.meta,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
