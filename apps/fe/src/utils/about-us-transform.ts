import {
  AboutUsPageData,
  HeroVideoData,
  WorkflowSection,
} from '@/types/about-us';

/**
 * Transform hero video data to format expected by Header component
 */
export function transformHeroVideoForHeader(
  heroVideo: HeroVideoData | undefined
) {
  if (!heroVideo) {
    return {
      desktopVideo: { url: '/assets/video/about-us.mp4' },
      mobileVideo: { url: '/assets/video/about-us.mp4' },
    };
  }

  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || '';

  return {
    desktopVideo: {
      url: heroVideo.desktopVideo?.url?.startsWith('http')
        ? heroVideo.desktopVideo.url
        : `${strapiUrl}${heroVideo.desktopVideo?.url || '/assets/video/about-us.mp4'}`,
    },
    mobileVideo: {
      url: heroVideo.mobileVideo?.url?.startsWith('http')
        ? heroVideo.mobileVideo.url
        : `${strapiUrl}${heroVideo.mobileVideo?.url || '/assets/video/about-us.mp4'}`,
    },
  };
}

/**
 * Transform workflow data to format expected by SloganSection component
 */
export function transformWorkflowDataForSlogan(
  workflowSection: WorkflowSection | undefined
) {
  if (!workflowSection?.images) {
    return [];
  }

  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || '';

  return workflowSection.images.map((item, index) => {
    const imageUrl = item.file?.url;
    const fullImageUrl = imageUrl?.startsWith('http')
      ? imageUrl
      : `${strapiUrl}${imageUrl || '/assets/images/workflow/workflow-image-1.jpg'}`;

    return {
      id: index + 1,
      position: index + 1,
      image: fullImageUrl,
      alt:
        item?.file?.name ||
        item.file?.alternativeText ||
        `Workflow step ${index + 1}`,
    };
  });
}

/**
 * Extracts SEO data from About Us page data with fallbacks
 */
export function extractAboutUsSEO(
  aboutUsData: AboutUsPageData | null,
  siteName: string = 'ANDREA'
) {
  const defaultTitle = `Về chúng tôi - ${siteName}`;
  const defaultDescription =
    'Liên hệ Andrea — dịch vụ thiết kế thương hiệu và digital. Liên hệ để thảo luận dự án, hợp tác hoặc gửi hồ sơ ứng tuyển.';

  if (!aboutUsData?.seo) {
    return {
      title: defaultTitle,
      description: defaultDescription,
      image: null,
    };
  }

  return {
    title: aboutUsData.seo.metaTitle || defaultTitle,
    description: aboutUsData.seo.metaDescription || defaultDescription,
    image: aboutUsData.seo.metaImage || null,
  };
}
