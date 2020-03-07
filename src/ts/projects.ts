import { Project } from './Project';

export const addProject = (name: string, description: string): void => {
  const project: Project = { name, description };

  let projects: Project[] = JSON.parse(localStorage.getItem('projects')) || [];
  projects.push(project);

  localStorage.setItem('projects', JSON.stringify(projects));

  console.log(localStorage.getItem('projects'));
};

export const deleteProject = (name: string) => {
  const projects = getProjects();
  const updatedProjectsList = projects.filter(project => project.name !== name);

  localStorage.setItem('projects', JSON.stringify(updatedProjectsList));
};

export const getProjects = (): Project[] => {
  return JSON.parse(localStorage.getItem('projects')) as Project[];
};

export const validateProjectData = (
  name: string,
  description: string
): string => {
  if (name === null || name === undefined || name === '') {
    return 'Must enter a project name.';
  }

  if (name.length < 0 || name.length > 255) {
    return 'Project name must be between 1 and 255 characters';
  }

  if (description.length > 1000) {
    return 'Project description cannot be greater than 1000 characters.';
  }

  return undefined;
};
