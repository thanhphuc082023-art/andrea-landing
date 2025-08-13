import ProjectDetailContents from '@/contents/project-detail';
import { sampleProject } from '@/data/projects/sample-project';

const mockHeroData = {
  slogan: {
    title: 'Dự án Sample',
    subTitle: 'Thiết kế & Phát triển',
    description: 'Trải nghiệm thiết kế web hiện đại với công nghệ tiên tiến.',
  },
};

function TestSamplePage() {
  return (
    <ProjectDetailContents heroData={mockHeroData} project={sampleProject} />
  );
}

export default TestSamplePage;
