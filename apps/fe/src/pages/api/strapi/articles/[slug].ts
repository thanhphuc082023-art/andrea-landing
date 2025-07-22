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

  const { slug } = req.query;

  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ message: 'Invalid slug' });
  }

  try {
    const article = await StrapiAPI.getEntryBySlug<ArticleEntity>(
      'articles',
      slug,
      {
        populate: [
          'featuredImage',
          'author',
          'categories',
          'tags',
          'seo.metaImage',
        ],
        publicationState: 'live',
      }
    );

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Transform the response to include full URLs for images
    const transformedArticle = {
      ...article,
      attributes: {
        ...article.attributes,
        featuredImage: article.attributes.featuredImage
          ? {
              data: {
                ...article.attributes.featuredImage,
                attributes: {
                  ...article.attributes.featuredImage,
                  url: StrapiAPI.getMediaUrl(
                    article.attributes.featuredImage.url
                  ),
                },
              },
            }
          : null,
        seo: article.attributes.seo
          ? {
              ...article.attributes.seo,
              metaImage: article.attributes.seo.metaImage
                ? {
                    data: {
                      ...article.attributes.seo.metaImage,
                      attributes: {
                        ...article.attributes.seo.metaImage,
                        url: StrapiAPI.getMediaUrl(
                          article.attributes.seo.metaImage.url
                        ),
                      },
                    },
                  }
                : null,
            }
          : undefined,
      },
    };

    return res.status(200).json({ data: transformedArticle });
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
    return res.status(500).end();
  }
}
