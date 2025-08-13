import { NextApiRequest, NextApiResponse } from 'next';

// Mock showcase data for development
const mockShowcases: Record<number, any[]> = {
  1: [
    {
      id: 'section-1',
      title: 'Moodboard',
      type: 'image',
      layout: 'single',
      items: [
        {
          id: 'item-1',
          type: 'image',
          src: 'https://api.builder.io/api/v1/image/assets/TEMP/69c14e46d1db67de2a2dd5f04e7a103bbd640f36?width=2600',
          alt: 'Moodboard - Mangrove ecosystem inspiration',
          width: 1300,
          height: 1220,
          order: 0,
        },
      ],
      order: 0,
    },
    {
      id: 'section-2',
      title: 'Design Process',
      type: 'image',
      layout: 'single',
      items: [
        {
          id: 'item-2',
          type: 'image',
          src: 'https://api.builder.io/api/v1/image/assets/TEMP/c2466bdb67294577597ec5f42d934d8822b8e88f?width=2602',
          alt: 'Design process and logo development',
          width: 1301,
          height: 1445,
          order: 0,
        },
      ],
      order: 1,
    },
  ],
  2: [
    {
      id: 'section-3',
      title: 'Brand Identity',
      type: 'image',
      layout: 'grid',
      gridCols: 2,
      items: [
        {
          id: 'item-3',
          type: 'image',
          src: 'https://api.builder.io/api/v1/image/assets/TEMP/6118edd92ff11a0ac7f998a08429a89b67c38012?width=2718',
          alt: 'Final logo animation and branding',
          width: 1359,
          height: 849,
          order: 0,
        },
        {
          id: 'item-4',
          type: 'image',
          src: 'https://api.builder.io/api/v1/image/assets/TEMP/6d1e23fb2acdcc203d186bb8cf1396a6eceec58d?width=2602',
          alt: 'Brand identity system',
          width: 1301,
          height: 911,
          order: 1,
        },
      ],
      order: 0,
    },
  ],
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { id } = req.query;
  const projectId = parseInt(id as string);

  if (isNaN(projectId)) {
    return res.status(400).json({ error: 'Invalid project ID' });
  }

  switch (method) {
    case 'GET':
      try {
        // In production, fetch from Strapi API
        // const response = await fetch(`${process.env.STRAPI_URL}/api/projects/${projectId}?populate=showcase`, {
        //   headers: {
        //     'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
        //   },
        // });
        // const data = await response.json();

        // For now, return mock data
        const showcase = mockShowcases[projectId] || [];
        res.status(200).json(showcase);
      } catch (error) {
        console.error('Error fetching showcase:', error);
        res.status(500).json({ error: 'Failed to fetch showcase' });
      }
      break;

    case 'PUT':
      try {
        const { sections } = req.body;

        if (!Array.isArray(sections)) {
          return res.status(400).json({ error: 'Sections must be an array' });
        }

        // In production, update in Strapi
        // const response = await fetch(`${process.env.STRAPI_URL}/api/projects/${projectId}`, {
        //   method: 'PUT',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
        //   },
        //   body: JSON.stringify({
        //     data: {
        //       showcase: sections,
        //     },
        //   }),
        // });

        // For now, simulate update
        mockShowcases[projectId] = sections;

        res
          .status(200)
          .json({ message: 'Showcase updated successfully', sections });
      } catch (error) {
        console.error('Error updating showcase:', error);
        res.status(500).json({ error: 'Failed to update showcase' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
