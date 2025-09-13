import { ProjectData } from '@/types/project';
import { replaceMaxWidth } from '@/utils';

interface ProjectContentProps {
  project?: ProjectData | null;
}

function ProjectContent({ project = null }: ProjectContentProps) {
  if (!project?.body?.html) {
    return null;
  }

  let htmlContent = '';

  try {
    // Parse the content from rich text editor
    const contentData =
      typeof project.body === 'object'
        ? project?.body
        : JSON.parse(project.body);

    // Check if content has the new format with design and html
    htmlContent = replaceMaxWidth(contentData.html || contentData);
  } catch (e) {
    // If parsing fails, treat as plain HTML
    htmlContent = project.body;
  }

  // Ensure htmlContent is a string
  if (typeof htmlContent !== 'string') {
    htmlContent = String(htmlContent || '');
  }

  if (!htmlContent || htmlContent.trim() === '') {
    return null;
  }

  return (
    <section className="py-16 max-md:py-12">
      <div className="content-wrapper">
        <div
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </section>
  );
}

export default ProjectContent;
