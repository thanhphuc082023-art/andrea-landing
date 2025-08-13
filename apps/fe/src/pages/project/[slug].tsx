import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import StrapiHead from '@/components/meta/StrapiHead';
import ProjectDetailContents from '@/contents/project-detail';
import {
  getStaticPropsWithGlobalAndData,
  type PagePropsWithGlobal,
} from '@/lib/page-helpers';
import { getStrapiMediaUrl } from '@/utils/helper';
import { StrapiAPI } from '@/lib/strapi';
import type { ProjectEntity } from '@/types/strapi';

interface ProjectPageProps extends PagePropsWithGlobal {
  project: ProjectEntity['attributes'] | null;
  showcaseData?: any[];
}

function ProjectPage({
  serverGlobal = null,
  heroData = null,
  project = null,
  showcaseData,
  footerData = null,
}: ProjectPageProps) {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">Dự án không tìm thấy</h1>
          <p className="mb-8 text-gray-600">
            Dự án bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <a
            href="/"
            className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
          >
            Quay lại trang chủ
          </a>
        </div>
      </div>
    );
  }

  const currentGlobal = serverGlobal;
  const projectTitle = project?.title || 'Dự án';
  const projectDescription = project?.description || '';

  return (
    <>
      <StrapiHead
        title={`${projectTitle} - Andrea`}
        description={projectDescription}
        ogImage={getStrapiMediaUrl(project?.featuredImage?.url)}
        seo={project?.seo}
        global={currentGlobal}
      />
      <ProjectDetailContents
        heroData={heroData}
        project={project}
        showcaseData={showcaseData}
      />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    // Fetch projects from Strapi
    const response = await StrapiAPI.getCollection('projects', {
      pagination: { pageSize: 100 },
      publicationState: 'live',
    });

    const paths = response.data.map((project: any) => ({
      params: { slug: project.attributes.slug },
    }));

    return {
      paths,
      fallback: 'blocking',
    };
  } catch (error) {
    console.error('Error fetching project paths:', error);
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
};

export const getStaticProps: GetStaticProps<ProjectPageProps> = async ({
  params,
}) => {
  const slug = params?.slug as string;

  if (!slug) {
    return {
      notFound: true,
    };
  }

  try {
    return await getStaticPropsWithGlobalAndData(async () => {
      // Fetch specific project
      const project = await StrapiAPI.getEntryBySlug<ProjectEntity>(
        'projects',
        slug,
        {
          populate: [
            'featuredImage',
            'gallery',
            'seo.metaImage',
            'technologies',
            'category',
            'showcaseSections',
          ],
          publicationState: 'live',
        }
      );

      if (!project) {
        throw new Error('Project not found');
      }

      // Transform image URLs
      const transformedProject = {
        ...project.attributes,
        featuredImage: project.attributes.featuredImage
          ? {
              ...project.attributes.featuredImage,
              url: StrapiAPI.getMediaUrl(project.attributes.featuredImage.url),
            }
          : null,
        gallery:
          project.attributes.gallery?.map((img: any) => ({
            ...img,
            url: StrapiAPI.getMediaUrl(img.url),
          })) || [],
      };

      // Extract showcase data
      const showcaseData = project.attributes.showcaseSections || [];

      return {
        project: transformedProject,
        showcaseData,
      };
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    return {
      notFound: true,
    };
  }
};

export default ProjectPage;
