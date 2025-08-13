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
    credits: {
      title: formData.credits?.title || 'Thanks for watching',
      date: formData.credits?.date || new Date().getFullYear().toString(),
      projectManager:
        formData.credits?.projectManager ||
        'Project Manager: Chưa có\nGraphic Designer: Chưa có\nShowcase: Chưa có',
    },
    technologies: formData.technologies || [],
    status: formData.status || 'draft',
    showcase: showcaseSections,
    seo: formData.seo || {
      title: '',
      description: '',
      keywords: [],
    },
  };

  // Create hero data with video support
  const heroData = {
    slogan: {
      title: projectData.title,
      subTitle: 'Thiết kế & Phát triển',
      description: projectData.description,
    },
    // Use heroVideo from form if available, otherwise use default
    desktopVideo:
      formData.heroVideo?.url ||
      'https://andrea.vn/uploads/videos/intro-website_3.mp4',
    mobileVideo:
      formData.heroVideo?.url ||
      'https://andrea.vn/uploads/videos/intro-website_3.mp4',
  };

  return (
    <div className="bg-white">
      <ProjectDetailContents
        heroData={heroData}
        project={projectData}
        showcaseData={showcaseSections}
      />
    </div>
  );
}
