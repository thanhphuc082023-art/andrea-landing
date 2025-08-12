export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  isFeatured?: boolean;
  isLarge?: boolean;
  slug?: string;
}

export interface ProjectCardProps {
  project: Project;
  className?: string;
}
