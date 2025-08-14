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
import { ProjectData } from '@/types/project';
import {
  transformStrapiProject,
  validateProjectData,
  debugProjectData,
} from '@/utils/project-transform';

interface ProjectPageProps extends PagePropsWithGlobal {
  project: ProjectData | null;
}

function ProjectPage({
  serverGlobal = null,
  project = null,
}: ProjectPageProps) {
  const router = useRouter();
  console.log('project', project);
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
      <ProjectDetailContents project={project} />
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
      params: { slug: project.slug },
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
      console.log(`Fetching project with slug: ${slug}`);

      // Fetch specific project with comprehensive population
      const project = await StrapiAPI.getEntryBySlug<ProjectEntity>(
        'projects',
        slug,
        {
          populate: '*',
          publicationState: 'live',
        }
      );
      console.log('project', project);
      if (!project) {
        console.error(`Project not found with slug: ${slug}`);
        throw new Error('Project not found');
      }

      console.log(`Found project: ${project.title} (ID: ${project.id})`);

      // Transform Strapi data to standardized ProjectData format
      const transformedProject = transformStrapiProject(project);

      // Validate the transformed data for UI compatibility
      const validation = validateProjectData(transformedProject);
      if (!validation.isValid) {
        console.warn('Project data validation warnings:', validation.errors);

        // Log debug information
        debugProjectData(transformedProject);
      }

      console.log(
        `Project transformation complete. Showcase sections: ${transformedProject.showcaseSections.length}`
      );

      return {
        project: transformedProject,
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
