export type AppId =
  | 'about'
  | 'projects'
  | 'resume'
  | 'skills'
  | 'playground'
  | 'arcade'
  | 'contact'
  | 'settings'
  | 'terminal';

export interface AppConfig {
  id: AppId;
  title: string;
  icon: string; // lucide icon name
  color: string; // gradient / accent color
  category: 'core' | 'tools' | 'entertainment';
  defaultWidth: number;
  defaultHeight: number;
}

export interface WindowState {
  id: AppId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
}

export interface ProjectItem {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: 'Web' | 'Mobile' | 'AI & Cloud' | 'UI/UX';
  image: string;
  technologies: string[];
  status: 'Concluído' | 'Em Destaque' | 'Beta' | 'Ativo';
  year: string;
  demoUrl?: string;
  githubUrl?: string;
  highlights: string[];
  metrics?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  responsibilities: string[];
  results: string[];
  technologies: string[];
  logoText: string;
  color: string;
}

export interface SkillItem {
  name: string;
  proficiency?: string; // e.g. "Avançado", "Intermediário", "Em aprendizado", "Conhecimentos básicos"
}

export interface SkillCategory {
  name: string;
  color: string;
  skills: SkillItem[];
}

export interface TechItem {
  name: string;
  category: string;
  iconName: string;
  level: string;
  description: string;
  glowColor: string;
}

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialId: string;
  skills: string[];
  verifyUrl: string;
  imageBg: string;
}

export interface LanguageItem {
  name: string;
  level: string;
  flag?: string;
  description?: string;
}

export interface SystemSettings {
  theme: 'neon-blue' | 'midnight-oled' | 'cyber-violet' | 'emerald-tech' | 'graphite';
  language: 'pt-BR' | 'en';
  wallpaper: 'jake-night' | 'porsche-rain' | 'cyber-rain' | 'cupertino-nebula' | 'abstract-glass' | 'dark-studio';
  graphicQuality: 'high' | 'medium' | 'low';
  rainDensity: number; // 1 to 5
  soundEnabled: boolean;
  soundVolume: number; // 0 to 100
  dockMagnification: boolean;
  dockAutoHide: boolean;
  animationsEnabled: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}
