import ProjectCredits from '@/contents/project-detail/ProjectCredits';
import ProjectHero from './ProjectHero';
import ProjectContent from './ProjectContent';
import ProjectShowcase from './ProjectShowcase';
import ContactForm from '@/contents/index/ContactForm';
import NextProjects from '@/contents/project-detail/NextProjects';
import { ProjectData } from '@/types/project';

interface ProjectDetailContentsProps {
  project?: ProjectData | null;
  nextProjects?: any[];
}

function ProjectDetailContents({
  project = null,
  nextProjects = [],
}: ProjectDetailContentsProps) {
  return (
    <>
      {/* Hero Section */}
      <ProjectHero project={project} />

      {/* Project Content */}
      <ProjectContent project={project} />

      {/* Project Showcase */}
      <ProjectShowcase project={project} />

      {/* Project Credits */}
      <ProjectCredits project={project} />

      {/* Next Projects */}
      <div className="my-[73px] max-md:my-[60px]">
        <NextProjects projects={nextProjects} />
      </div>

      {/* Contact Form */}
      <div>
        <ContactForm />
      </div>
    </>
  );
}

export default ProjectDetailContents;
