import { Project } from './Project';
import { addProject, getProjects, validateProjectData } from './projects';

const addProjectForm = document.getElementById(
  'add-project-form'
) as HTMLFormElement;

const formError = document.getElementById('form-error') as HTMLSpanElement;
const formErrorContainer = document.getElementById(
  'form-error-container'
) as HTMLDivElement;
formErrorContainer.hidden = true;

const projectsList = document.getElementById(
  'projects-list'
) as HTMLUListElement;

addProjectForm.addEventListener('submit', event => {
  event.preventDefault();

  const projectName = addProjectForm.elements[0] as HTMLInputElement;
  const projectDescription = addProjectForm.elements[1] as HTMLTextAreaElement;

  const response = validateProjectData(
    projectName.value,
    projectDescription.value
  );

  if (response) {
    formError.innerHTML = response;
    formErrorContainer.hidden = false;
  } else {
    formError.innerHTML = '';
    formErrorContainer.hidden = true;
    addProject(projectName.value, projectDescription.value);
    updateProjectsList();
  }
});

const updateProjectsList = () => {
  const projects = getProjects();
  projectsList.innerHTML = '';
  projects.map((project: Project) => {
    {
      const listItem = document.createElement('li');
      listItem.innerText = project.name;
      projectsList.appendChild(listItem);
    }
  });
};

window.onload = () => {
  updateProjectsList();
};
