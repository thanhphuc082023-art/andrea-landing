import { StrapiAPI } from '@/lib/strapi';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { ProjectEntity } from '@/types/strapi';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {
      page = 1,
      pageSize = 10,
      category,
      featured,
      status,
      sort = 'publishedAt:desc',
    } = req.query;

    const params: any = {
      populate: ['images', 'category'],
      sort: Array.isArray(sort) ? sort : [sort],
      pagination: {
        page: Number(page),
        pageSize: Number(pageSize),
      },
      publicationState: 'live',
    };

    // Add filters based on query parameters
    const filters: any = {};

    if (category) {
      filters['category.slug'] = { $eq: category };
    }

    if (featured === 'true') {
      filters.featured = { $eq: true };
    }

    if (status) {
      filters.status = { $eq: status };
    }

    if (Object.keys(filters).length > 0) {
      params.filters = filters;
    }

    const response = await StrapiAPI.getCollection<ProjectEntity>(
      'projects',
      params
    );

    // Transform the response to include full URLs for images
    const transformedData = response.data.map((project) => ({
      ...project,
    }));

    return res.status(200).json({
      data: transformedData,
      meta: response.meta,
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
