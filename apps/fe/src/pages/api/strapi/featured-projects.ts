import { StrapiAPI } from '@/lib/strapi';
import type { NextApiRequest, NextApiResponse } from 'next';

interface FeaturedProject {
  id: number;
  title: string;
  position: number;
  [key: string]: any;
}

interface FeaturedProjectsResponse {
  title: string;
  projects: FeaturedProject[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const response = await StrapiAPI.getEntry<any>({
      collection: 'home-featured-project',
      publicationState: 'live',
      populate: ['projects', 'projects.projectItem'],
    });

    if (!response.data) {
      return res.status(404).json({ message: 'Featured projects not found' });
    }
    console.log('response.data', response.data);
    // Sort projects by position
    const sortedProjects = response.data.projects
      ? [...response.data.projects].sort(
          (a, b) => (a.position || 0) - (b.position || 0)
        )
      : [];

    // Transform the response
    const transformedData: FeaturedProjectsResponse = {
      title: response.data.title || 'Dự án tiêu biểu',
      projects: sortedProjects,
    };

    res.status(200).json(transformedData);
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
