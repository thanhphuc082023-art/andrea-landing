import { StrapiAPI } from '@/lib/strapi';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { ArticleEntity } from '@/types/strapi';

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
      tag,
      search,
      featured,
      sort = 'publishedAt:desc',
    } = req.query;

    const params: any = {
      populate: ['featuredImage', 'author', 'categories', 'tags'],
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
      filters['categories.slug'] = { $eq: category };
    }

    if (tag) {
      filters['tags.slug'] = { $eq: tag };
    }

    if (search) {
      filters.$or = [
        { title: { $containsi: search } },
        { content: { $containsi: search } },
        { excerpt: { $containsi: search } },
      ];
    }

    if (featured === 'true') {
      filters.featured = { $eq: true };
    }

    if (Object.keys(filters).length > 0) {
      params.filters = filters;
    }

    const response = await StrapiAPI.getCollection<ArticleEntity>(
      'articles',
      params
    );

    // Transform the response to include full URLs for images
    const transformedData = response.data.map((article) => ({
      ...article,
      attributes: {
        ...article.attributes,
        featuredImage: article.attributes.featuredImage
          ? {
              data: {
                ...article.attributes.featuredImage,
                url: StrapiAPI.getMediaUrl(
                  article.attributes.featuredImage.url
                ),
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
    console.error('Error fetching articles:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
