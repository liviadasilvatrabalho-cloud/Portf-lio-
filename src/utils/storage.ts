import { SystemSettings, Achievement } from '../types';
import { INITIAL_ACHIEVEMENTS } from '../data/portfolioData';

const SETTINGS_KEY = 'macos_portfolio_settings_v2';
const ACHIEVEMENTS_KEY = 'macos_portfolio_achievements_v1';

export const DEFAULT_SETTINGS: SystemSettings = {
  theme: 'neon-blue',
  language: 'pt-BR',
  wallpaper: 'jake-night',
  graphicQuality: 'high',
  rainDensity: 3,
  soundEnabled: true,
  soundVolume: 40,
  dockMagnification: true,
  dockAutoHide: false,
  animationsEnabled: true
};

export function loadSettings(): SystemSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    let raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      // Check v1 key for migration
      raw = localStorage.getItem('macos_portfolio_settings_v1');
    }
    if (!raw) {
      saveSettings(DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    }
    
    const parsed = JSON.parse(raw);
    // Enforce jake-night as the main wallpaper
    if (!parsed.wallpaper || parsed.wallpaper !== 'jake-night') {
      parsed.wallpaper = 'jake-night';
    }
    
    const settings = { ...DEFAULT_SETTINGS, ...parsed };
    saveSettings(settings);
    return settings;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: SystemSettings) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {}
}

export function loadAchievements(): Achievement[] {
  if (typeof window === 'undefined') return INITIAL_ACHIEVEMENTS;
  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (!raw) return INITIAL_ACHIEVEMENTS;
    return JSON.parse(raw);
  } catch {
    return INITIAL_ACHIEVEMENTS;
  }
}

export function saveAchievements(achievements: Achievement[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
  } catch {}
}
