import { Fragment } from 'react';
import { type ProjectFormData } from '@/lib/validations/project';
import ProjectDetailContents from '@/contents/project-detail';

interface ProjectPreviewContentProps {
  formData: Partial<ProjectFormData>;
  showcaseSections?: any[];
}

export default function ProjectPreviewContent({
  formData,
  showcaseSections = [],
}: ProjectPreviewContentProps) {
  // Transform form data to match project structure
  const projectData = {
    id: 0,
    title: formData.title || 'Tiêu đề dự án',
    slug: formData.slug || 'project-slug',
    description: formData.description || 'Mô tả dự án sẽ hiển thị ở đây...',
    projectMetaInfo: formData.projectMetaInfo || [],
    projectIntroTitle: formData.projectIntroTitle || 'Giới thiệu dự án:',

    // Required fields for ProjectData interface
    projectStatus:
      (formData.status as 'draft' | 'in-progress' | 'completed') || 'draft',
    featured: formData.featured || false,
    technologies: formData.technologies || [],
    gallery: [], // Empty gallery for preview

    // Transform showcase sections to ensure items have valid URLs
    showcaseSections: showcaseSections,

    results: [], // Empty results for preview
    metrics: [], // Empty metrics for preview

    // Add heroVideo to project data for ProjectHero component
    heroVideo: formData.heroVideo
      ? {
          id: 0,
          url:
            formData.heroVideo.url ||
            (formData.heroVideo.file
              ? URL.createObjectURL(formData.heroVideo.file)
              : ''),
          name: 'Hero Video',
          mime: 'video/mp4',
          alt: 'Hero Video',
        }
      : null,

    // Add heroBanner to project data
    heroBanner: formData.heroBanner
      ? {
          id: 0,
          url:
            formData.heroBanner.url ||
            (formData.heroBanner.file
              ? URL.createObjectURL(formData.heroBanner.file)
              : ''),
          name: 'Hero Banner',
          mime: 'image/jpeg',
          alt: 'Hero Banner',
        }
      : null,

    category: {
      id: 1,
      name: 'Thiết kế & Phát triển',
      slug: 'design-development',
    },

    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),

    // Credits in the format that ProjectCredits.tsx expects
    credits: formData.credits || {
      title: 'Thanks for watching',
      creditLabel: 'Credit:',
      date: new Date().getFullYear().toString(),
      projectManager:
        'Project Manager: Chưa có\nGraphic Designer: Chưa có\nShowcase: Chưa có',
    },

    seo: formData.seo || {
      title: '',
      description: '',
      keywords: [],
    },
  };

  return (
    <div className="bg-white [&>#project-header]:!mt-0">
      <ProjectDetailContents
        project={projectData as any} // Cast to any because ProjectCredits component expects different structure
      />
    </div>
  );
}
