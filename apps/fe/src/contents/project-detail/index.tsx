import ProjectCredits from '@/contents/project-detail/ProjectCredits';
import ProjectHero from './ProjectHero';
import ProjectShowcase from './ProjectShowcase';
import ContactForm from '@/contents/index/ContactForm';
import NextProjects from '@/contents/project-detail/NextProjects';

interface ProjectDetailContentsProps {
  heroData?: any;
  project?: any;
  showcaseData?: any[];
}

function ProjectDetailContents({
  heroData = null,
  project = null,
  showcaseData,
}: ProjectDetailContentsProps) {
  return (
    <>
      {/* Hero Section */}
      <ProjectHero heroData={heroData} project={project} />

      {/* Project Showcase */}
      <ProjectShowcase project={project} showcaseData={showcaseData} />

      {/* Project Credits */}
      <ProjectCredits project={project} />

      {/* Next Projects */}
      <div className="my-[73px] max-md:my-[60px]">
        <NextProjects />
      </div>

      {/* Contact Form */}
      <div>
        <ContactForm />
      </div>
    </>
  );
}

export default ProjectDetailContents;
