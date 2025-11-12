export interface Frontmatter {
  title: string;
  date: string;
  excerpt?: string;
  tags: string[];
  published: boolean;
}

export interface ProjectFrontmatter extends Frontmatter {
  coverImage?: string;
  githubUrl?: string;
  liveUrl?: string;
  status: 'completed' | 'in-progress' | 'archived';
  featured?: boolean;
}

export interface ExperimentFrontmatter extends Frontmatter {
  githubUrl?: string;
  status: 'in-progress' | 'completed' | 'paused';
}

export interface BlogPostFrontmatter extends Frontmatter {
  category: 'insight' | 'reflection';
  readingTime?: string;
}

export interface ContentItem<T = Frontmatter> {
  slug: string;
  frontmatter: T;
  content: string;
}

export interface GitHubRepo {
  name: string;
  description: string;
  stars: number;
  language: string;
  url: string;
  lastUpdated: string;
}

export interface GitHubData {
  username: string;
  repos: GitHubRepo[];
}

export interface ExperienceItem {
  id: string;
  company: string;
  title: string;
  period: string;
  description: string;
  technologies: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
}

export interface NowData {
  lastUpdated: string;
  currentFocus: string[];
  learning: string[];
  reading: string[];
}
