import { v4 as uuidv4 } from 'uuid';
import { Project } from './Project';

export const addProject = (name: string, description: string): void => {
  const project: Project = { id: '', name, description };
  saveChanges(project);
};

export const deleteProject = (name: string) => {
  const projects = getProjects();
  const updatedProjectsList = projects.filter(project => project.name !== name);

  localStorage.setItem('projects', JSON.stringify(updatedProjectsList));
};

export const getProjects = (): Project[] => {
  return JSON.parse(localStorage.getItem('projects')) as Project[];
};

export const getProject = (name: string): Project | null => {
  return (
    getProjects().filter((project: Project) => project.name === name)[0] || null
  );
};

export const updateProject = (project: Project) => {
  // TODO: validation

  saveChanges(project);
};

const saveChanges = (project: Project) => {
  const projects = getProjects();

  const existingProject = projects.filter(p => p.id === project.id)[0];

  if (existingProject) {
    existingProject.name = project.name;
    existingProject.description = project.description;
  } else {
    project.id = uuidv4();
    projects.push(project);
  }

  localStorage.setItem('projects', JSON.stringify(projects));
};

export const validateProjectData = (
  name: string,
  description: string
): string | null => {
  if (name === null || name === undefined || name === '') {
    return 'Must enter a project name.';
  }

  if (name.length < 0 || name.length > 255) {
    return 'Project name must be between 1 and 255 characters';
  }

  const projects = getProjects();
  if (projects.filter(project => project.name === name).length > 0) {
    return `A project already exists with name: ${name}`;
  }

  if (description.length > 1000) {
    return 'Project description cannot be greater than 1000 characters.';
  }

  return null;
};
