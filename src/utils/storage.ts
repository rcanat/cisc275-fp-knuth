import type { Project } from '../types';

const STORAGE_KEY = 'drafter-drafter-projects';

export function saveProjects(projects: Project[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error('Failed to save projects:', error);
  }
}

export function loadProjects(): Project[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as Project[];
    }
  } catch (error) {
    console.error('Failed to load projects:', error);
  }
  return [];
}

export function exportProjectAsJSON(project: Project): string {
  return JSON.stringify(project, null, 2);
}

export function importProjectFromJSON(json: string): Project | null {
  try {
    const parsed = JSON.parse(json) as Partial<Project>;
    if (!parsed.id || !parsed.name || !parsed.pages || !parsed.routes || !parsed.stateModel) {
      throw new Error('Invalid project structure');
    }
    return parsed as Project;
  } catch (error) {
    console.error('Failed to import project:', error);
    return null;
  }
}
