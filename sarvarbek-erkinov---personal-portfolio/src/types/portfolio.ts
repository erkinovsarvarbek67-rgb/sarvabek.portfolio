export type Language = 'uz' | 'en' | 'ru';
export type Theme = 'dark' | 'light';

export type ProjectCategory = 'all' | 'web' | 'games' | 'tools';
export type ProjectStatus = 'Demo' | 'In development' | 'Completed';

export interface Project {
  id: string;
  title: string;
  category: 'web' | 'games' | 'tools';
  status: ProjectStatus;
  description: Record<Language, string>;
  detailedDescription: Record<Language, string>;
  features: Record<Language, string[]>;
  tags: string[];
  gradient: string;
  icon: string;
  isPlayable?: boolean;
  demoUrl?: string;
  githubUrl?: string;
}

export type SkillCategory = 'frontend' | 'backend' | 'design' | 'tools';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  iconName: string;
  description: Record<Language, string>;
  tagline: Record<Language, string>;
  accentColor: string;
}

export interface JourneyMilestone {
  id: string;
  phase: Record<Language, string>;
  title: Record<Language, string>;
  description: Record<Language, string>;
  tags: string[];
  isCurrent?: boolean;
}

export interface StatItem {
  id: string;
  value: string;
  label: Record<Language, string>;
  subtext: Record<Language, string>;
}

export interface ContactDetails {
  email: string;
  phone: string;
  phoneDisplay: string;
  telegramUsername: string;
  telegramUrl: string;
  telegramBotToken?: string;
  telegramChatId?: string;
  githubUsername: string;
  githubUrl: string;
  location: Record<Language, string>;
  availability: Record<Language, string>;
}

export interface PortfolioData {
  name: string;
  initials: string;
  roles: Record<Language, string[]>;
  heroTagline: Record<Language, string>;
  aboutBio: Record<Language, string>;
  aboutDetailed: Record<Language, string>;
  learningFocus: Record<Language, string[]>;
  stats: StatItem[];
  skills: Skill[];
  projects: Project[];
  journey: JourneyMilestone[];
  contacts: ContactDetails;
}
