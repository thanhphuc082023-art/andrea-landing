import { NextApiRequest, NextApiResponse } from 'next';

// Mock data for development - replace with actual Strapi API calls
const mockProjects = [
  {
    id: 1,
    title: 'Dự án thiết kế website Mitsubishi',
    description:
      'Thiết kế và phát triển website chính thức cho Mitsubishi Motors Vietnam',
    content:
      'Dự án bao gồm thiết kế UI/UX, phát triển frontend và backend, tích hợp hệ thống quản lý nội dung.',
    slug: 'mitsubishi-website',
    technologies: ['React', 'Node.js', 'MongoDB', 'AWS'],
    featured: true,
    status: 'completed',
    client: 'Mitsubishi Motors Vietnam',
    year: '2023',
    overview: 'Website chính thức với đầy đủ tính năng bán hàng và quản lý',
    challenge: 'Tích hợp nhiều hệ thống bên thứ 3 và đảm bảo hiệu suất cao',
    solution: 'Sử dụng kiến trúc microservices và CDN để tối ưu tốc độ',
    categoryId: 'Web Development',
    featuredImage: null,
    gallery: [],
    results: [
      {
        title: 'Tăng 40% traffic',
        description: 'Lưu lượng truy cập tăng đáng kể sau khi ra mắt',
      },
    ],
    metrics: [
      {
        label: 'Thời gian tải trang',
        value: '< 2s',
      },
    ],
    seo: {
      title: 'Mitsubishi Website - Thiết kế chuyên nghiệp',
      description:
        'Website chính thức Mitsubishi Motors Vietnam với thiết kế hiện đại',
      keywords: ['mitsubishi', 'website', 'automotive'],
    },
    projectIntroTitle: 'Giới thiệu dự án:',
    projectMetaInfo: [
      'Thiết kế nhận diện thương hiệu',
      'Quay phim chụp hình',
      'Profile công ty',
    ],
    credits: {
      title: 'Thanks for watching',
      date: '2023',
      projectManager:
        'Project Manager: Nguyễn Văn A\nGraphic Designer: Trần Thị B\nShowcase: Andrea Studio',
    },
    heroVideo: null,
    createdAt: '2023-01-15T00:00:00.000Z',
    updatedAt: '2023-01-15T00:00:00.000Z',
  },
  {
    id: 2,
    title: 'Ứng dụng di động Mobifone',
    description:
      'Phát triển ứng dụng di động cho Mobifone với tính năng thanh toán và quản lý tài khoản',
    content:
      'Ứng dụng được phát triển cho cả iOS và Android với tính năng thanh toán tích hợp.',
    slug: 'mobifone-app',
    technologies: ['React Native', 'Firebase', 'Stripe'],
    featured: false,
    status: 'in-progress',
    client: 'Mobifone',
    year: '2024',
    overview: 'Ứng dụng di động toàn diện cho khách hàng Mobifone',
    challenge: 'Tích hợp nhiều cổng thanh toán và đảm bảo bảo mật',
    solution:
      'Sử dụng Firebase Authentication và Stripe cho thanh toán an toàn',
    categoryId: 'Mobile Development',
    featuredImage: null,
    gallery: [],
    results: [
      {
        title: '100k+ downloads',
        description: 'Ứng dụng được tải xuống hơn 100,000 lần',
      },
    ],
    metrics: [
      {
        label: 'Đánh giá trung bình',
        value: '4.5/5',
      },
    ],
    seo: {
      title: 'Mobifone App - Ứng dụng di động',
      description: 'Ứng dụng di động chính thức của Mobifone',
      keywords: ['mobifone', 'mobile app', 'telecom'],
    },
    projectIntroTitle: 'Giới thiệu dự án:',
    projectMetaInfo: [
      'Phát triển ứng dụng di động',
      'Tích hợp thanh toán',
      'Quản lý tài khoản',
    ],
    credits: {
      title: 'Thanks for watching',
      date: '2024',
      projectManager:
        'Project Manager: Lê Văn C\nGraphic Designer: Phạm Thị D\nShowcase: Andrea Studio',
    },
    heroVideo: null,
    createdAt: '2024-01-10T00:00:00.000Z',
    updatedAt: '2024-01-10T00:00:00.000Z',
  },
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        // In production, fetch from Strapi API
        // const response = await fetch(`${process.env.STRAPI_URL}/api/projects`, {
        //   headers: {
        //     'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
        //   },
        // });
        // const data = await response.json();

        // For now, return mock data
        res.status(200).json(mockProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Failed to fetch projects' });
      }
      break;

    case 'POST':
      try {
        const projectData = req.body;

        // Validate required fields
        if (!projectData.title || !projectData.slug) {
          return res.status(400).json({ error: 'Title and slug are required' });
        }

        // In production, create in Strapi
        // const response = await fetch(`${process.env.STRAPI_URL}/api/projects`, {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
        //   },
        //   body: JSON.stringify({
        //     data: projectData,
        //   }),
        // });

        // For now, simulate creation
        const newProject = {
          id: Date.now(),
          ...projectData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        res.status(201).json(newProject);
      } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Failed to create project' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
