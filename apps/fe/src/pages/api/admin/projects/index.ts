import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const {
      title,
      description,
      content,
      slug,
      technologies,
      featured,
      status,
      overview,
      challenge,
      solution,
      categoryId,
      results,
      metrics,
      seo,
      projectIntroTitle,
      projectMetaInfo,
      credits,
      featuredImageUploadId,
      galleryUploadIds,
      heroVideoUploadId,
      thumbnailUploadId,
      showcase,
    } = req.body;

    // Validate required fields
    if (!title || !description || !projectIntroTitle) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Title, description, and projectIntroTitle are required',
      });
    }

    // Create project data for Strapi (without file uploads for now)
    const projectData = {
      data: {
        title,
        description,
        content: content || '',
        slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
        technologies: technologies || [],
        featured: featured || false,
        status: status || 'draft',
        overview: overview || '',
        challenge: challenge || '',
        solution: solution || '',
        categoryId: categoryId || null,
        results: results || [],
        metrics: metrics || [],
        seo: seo || {},
        projectIntroTitle,
        projectMetaInfo: projectMetaInfo || [],
        credits: credits || {},
        // Store upload IDs as strings for now, can be processed later
        featuredImageUploadId: featuredImageUploadId || null,
        galleryUploadIds: galleryUploadIds || [],
        heroVideoUploadId: heroVideoUploadId || null,
        thumbnailUploadId: thumbnailUploadId || null,
        showcaseSections: showcase || [],
        publishedAt: status === 'completed' ? new Date().toISOString() : null,
      },
    };

    // Create project in Strapi
    const strapiBaseUrl =
      process.env.NEXT_PUBLIC_STRAPI_URL ||
      'https://joyful-basket-ea764d9c28.strapiapp.com/api';
    const strapiUrl = `${strapiBaseUrl}/projects`;

    // Test if Strapi API is accessible
    try {
      const testResponse = await fetch(`${strapiBaseUrl}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Strapi API test response status:', testResponse.status);
    } catch (testError) {
      console.error('Strapi API test failed:', testError);
    }

    const response = await fetch(strapiUrl, {
      method: 'POST',
      body: JSON.stringify(projectData),
    });

    console.log('Strapi response status:', response.status);
    console.log(
      'Strapi response headers:',
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
        console.error('Strapi API error:', errorData);
        throw new Error(
          errorData.error?.message ||
            `Strapi API error: ${response.status} ${response.statusText}`
        );
      } catch (parseError) {
        // If response is not JSON (e.g., HTML error page), use status text
        console.error(
          'Strapi API error (non-JSON):',
          response.status,
          response.statusText
        );
        throw new Error(
          `Strapi API error: ${response.status} ${response.statusText}`
        );
      }
    }

    const result = await response.json();

    return res.status(201).json({
      success: true,
      data: result.data,
      message: 'Project created successfully',
    });
  } catch (error: any) {
    console.error('Error creating project:', error);

    // Handle network errors specifically
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return res.status(500).json({
        error: 'Network error',
        message:
          'Unable to connect to Strapi API. Please check your network connection and Strapi URL.',
      });
    }

    return res.status(500).json({
      error: 'Internal server error',
      message: error.message || 'Failed to create project',
    });
  }
}
