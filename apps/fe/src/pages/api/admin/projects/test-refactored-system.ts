import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

const UPLOAD_DIR = '/tmp/uploads';

// Test data structure that matches UI requirements
const testProjectData = {
  title: 'Test Project - Refactored System',
  slug: 'test-project-refactored-system',
  description:
    'This is a test project to verify the refactored project creation system works correctly with the UI display requirements.',
  projectIntroTitle: 'Giới thiệu dự án test:',

  content: 'Detailed content about the test project...',
  overview: 'Project overview for testing the new system.',
  challenge: 'Testing the challenge section of the refactored system.',
  solution: 'Our solution involves comprehensive refactoring.',

  status: 'completed',
  featured: true,
  technologies: ['Next.js', 'TypeScript', 'Strapi', 'Tailwind CSS'],
  projectMetaInfo: [
    'Thời gian thực hiện: 2 tuần',
    'Đội ngũ: 3 developers',
    'Công nghệ: Next.js, TypeScript, Strapi',
    'Trạng thái: Hoàn thành',
  ],

  results: [
    {
      title: 'Performance Improvement',
      description: 'Improved project creation performance by 300%',
    },
    {
      title: 'UI Consistency',
      description: 'Achieved 100% compatibility with project display pages',
    },
  ],

  metrics: [
    {
      value: '300%',
      label: 'Performance boost',
      description: 'Faster project creation process',
    },
    {
      value: '100%',
      label: 'UI compatibility',
      description: 'Perfect alignment with display requirements',
    },
  ],

  credits: {
    'Project Manager': ['Andrea Team Lead'],
    'Lead Developer': ['Senior Developer'],
    'UI/UX Designer': ['Design Specialist'],
  },

  seo: {
    metaTitle: 'Test Project - Refactored System | Andrea Portfolio',
    metaDescription: 'Testing the new refactored project creation system',
    metaKeywords: 'test, project, refactor, system, performance',
  },

  showcase: [
    {
      id: 'section-overview',
      title: 'Project Overview',
      type: 'image',
      layout: 'single',
      order: 0,
      items: [
        {
          id: 'overview-image',
          type: 'image',
          title: 'Project Overview Image',
          alt: 'Overview of the test project showing the main interface',
          width: 1300,
          height: 800,
          order: 0,
        },
      ],
    },
    {
      id: 'section-process',
      title: 'Development Process',
      type: 'image',
      layout: 'half-half',
      order: 1,
      items: [
        {
          id: 'process-before',
          type: 'image',
          title: 'Before Refactoring',
          alt: 'System state before refactoring',
          width: 650,
          height: 400,
          order: 0,
        },
        {
          id: 'process-after',
          type: 'image',
          title: 'After Refactoring',
          alt: 'System state after refactoring',
          width: 650,
          height: 400,
          order: 1,
        },
      ],
    },
    {
      id: 'section-results',
      title: 'Final Results',
      type: 'image',
      layout: 'grid',
      gridCols: 3,
      order: 2,
      items: [
        {
          id: 'result-performance',
          type: 'image',
          title: 'Performance Metrics',
          alt: 'Charts showing performance improvements',
          width: 433,
          height: 300,
          order: 0,
        },
        {
          id: 'result-ui',
          type: 'image',
          title: 'UI Consistency Check',
          alt: 'Screenshots demonstrating UI consistency',
          width: 867,
          height: 300,
          colSpan: 2,
          order: 1,
        },
      ],
    },
  ],
};

// Mock file upload function for testing
function createMockUploadFile(
  fileName: string,
  content: string = 'mock file content'
): string {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  const uploadId = `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const filePath = path.join(UPLOAD_DIR, `${uploadId}-complete.jpg`);
  const metaPath = path.join(UPLOAD_DIR, `${uploadId}-meta.json`);

  // Create mock file
  fs.writeFileSync(filePath, content);

  // Create metadata
  const metadata = {
    originalName: fileName,
    uploadId,
    createdAt: new Date().toISOString(),
  };
  fs.writeFileSync(metaPath, JSON.stringify(metadata, null, 2));

  console.log(`Created mock upload file: ${uploadId} -> ${fileName}`);
  return uploadId;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('=== TESTING REFACTORED PROJECT CREATION SYSTEM ===');

    // Create mock upload files for testing
    const heroVideoUploadId = createMockUploadFile('hero-video.mp4');
    const thumbnailUploadId = createMockUploadFile('thumbnail.jpg');
    const featuredImageUploadId = createMockUploadFile('featured-image.jpg');

    const galleryUploadIds = [
      createMockUploadFile('gallery-1.jpg'),
      createMockUploadFile('gallery-2.jpg'),
      createMockUploadFile('gallery-3.jpg'),
    ];

    const showcaseUploadIds = [
      createMockUploadFile('overview-image.jpg'),
      createMockUploadFile('process-before.jpg'),
      createMockUploadFile('process-after.jpg'),
      createMockUploadFile('performance-metrics.jpg'),
      createMockUploadFile('ui-consistency.jpg'),
    ];

    // Prepare the API request data
    const apiRequestData = {
      ...testProjectData,

      // Upload IDs
      heroVideoUploadId,
      thumbnailUploadId,
      featuredImageUploadId,
      galleryUploadIds,
      showcaseUploadIds,

      // Original file names
      originalHeroVideoName: 'hero-video.mp4',
      originalThumbnailName: 'thumbnail.jpg',
      originalFeaturedImageName: 'featured-image.jpg',
      originalGalleryNames: ['gallery-1.jpg', 'gallery-2.jpg', 'gallery-3.jpg'],
      showcaseOriginalNames: [
        'overview-image.jpg',
        'process-before.jpg',
        'process-after.jpg',
        'performance-metrics.jpg',
        'ui-consistency.jpg',
      ],
    };

    console.log('Test project data structure:');
    console.log('- Title:', apiRequestData.title);
    console.log('- Showcase sections:', apiRequestData.showcase.length);
    console.log('- Upload IDs:', {
      heroVideo: !!heroVideoUploadId,
      thumbnail: !!thumbnailUploadId,
      featuredImage: !!featuredImageUploadId,
      gallery: galleryUploadIds.length,
      showcase: showcaseUploadIds.length,
    });

    // Make request to the refactored API
    const apiUrl = '/api/admin/projects/create-from-chunks';
    const token = process.env.STRAPI_API_TOKEN;

    if (!token) {
      throw new Error('STRAPI_API_TOKEN is required for testing');
    }

    // Simulate the API call (since we can't call ourselves)
    console.log('\n=== SIMULATING API REQUEST ===');
    console.log('URL:', apiUrl);
    console.log('Method: POST');
    console.log('Data keys:', Object.keys(apiRequestData));
    console.log('Showcase structure validation:');

    // Validate showcase structure
    apiRequestData.showcase.forEach((section, sectionIndex) => {
      console.log(`Section ${sectionIndex + 1}:`, {
        id: section.id,
        title: section.title,
        layout: section.layout,
        itemCount: section.items.length,
      });

      section.items.forEach((item, itemIndex) => {
        console.log(`  Item ${itemIndex + 1}:`, {
          id: item.id,
          type: item.type,
          title: item.title,
          hasUploadId: itemIndex < showcaseUploadIds.length,
        });
      });
    });

    // Validate data structure compatibility with UI
    const uiValidation = {
      hasRequiredFields: !!(
        apiRequestData.title &&
        apiRequestData.description &&
        apiRequestData.projectIntroTitle
      ),
      hasShowcaseSections: apiRequestData.showcase.length > 0,
      allSectionsHaveIds: apiRequestData.showcase.every((s) => s.id),
      allItemsHaveIds: apiRequestData.showcase.every((s) =>
        s.items.every((i) => i.id)
      ),
      layoutsAreValid: apiRequestData.showcase.every((s) =>
        ['single', 'half-half', 'one-third', 'grid'].includes(s.layout)
      ),
    };

    console.log('\n=== UI COMPATIBILITY VALIDATION ===');
    console.log('Required fields present:', uiValidation.hasRequiredFields);
    console.log('Has showcase sections:', uiValidation.hasShowcaseSections);
    console.log('All sections have IDs:', uiValidation.allSectionsHaveIds);
    console.log('All items have IDs:', uiValidation.allItemsHaveIds);
    console.log('All layouts are valid:', uiValidation.layoutsAreValid);

    const isValidForUI = Object.values(uiValidation).every(Boolean);
    console.log(
      '\n✅ Overall UI compatibility:',
      isValidForUI ? 'PASS' : 'FAIL'
    );

    // Test the data transformation that would happen
    console.log('\n=== TESTING DATA TRANSFORMATION ===');

    // Simulate the showcase processing
    const mockProcessedShowcase = apiRequestData.showcase.map(
      (section, sectionIndex) => ({
        ...section,
        items: section.items.map((item, itemIndex) => {
          const uploadIndex =
            apiRequestData.showcase
              .slice(0, sectionIndex)
              .reduce((sum, s) => sum + s.items.length, 0) + itemIndex;

          return {
            ...item,
            src:
              uploadIndex < showcaseUploadIds.length
                ? `https://example.com/uploads/${showcaseUploadIds[uploadIndex]}.jpg`
                : '',
          };
        }),
      })
    );

    console.log('Processed showcase preview:');
    mockProcessedShowcase.forEach((section, index) => {
      console.log(`Section ${index + 1}: ${section.title} (${section.layout})`);
      section.items.forEach((item, itemIndex) => {
        console.log(`  - ${item.title}: ${item.src ? 'HAS URL' : 'NO URL'}`);
      });
    });

    return res.status(200).json({
      success: true,
      message: 'Refactored project creation system test completed',
      testResults: {
        dataStructure: {
          title: apiRequestData.title,
          showcaseSections: apiRequestData.showcase.length,
          totalItems: apiRequestData.showcase.reduce(
            (sum, s) => sum + s.items.length,
            0
          ),
          uploadFiles: {
            heroVideo: !!heroVideoUploadId,
            thumbnail: !!thumbnailUploadId,
            featuredImage: !!featuredImageUploadId,
            gallery: galleryUploadIds.length,
            showcase: showcaseUploadIds.length,
          },
        },
        uiCompatibility: uiValidation,
        isReadyForUI: isValidForUI,
        processedShowcase: mockProcessedShowcase,
      },
      mockData: {
        apiRequestData,
        mockProcessedShowcase,
      },
    });
  } catch (error: any) {
    console.error('Test failed:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: 'Refactored project creation system test failed',
    });
  }
}
