import { Project } from './Project';
import {
  addProject,
  deleteProject,
  getProjects,
  validateProjectData
} from './projects';

const addProjectForm = document.getElementById(
  'add-project-form'
) as HTMLFormElement;
const chooseRandomProject = document.getElementById(
  'choose-random-project-button'
);

const formError = document.getElementById('form-error') as HTMLSpanElement;
const formErrorContainer = document.getElementById(
  'form-error-container'
) as HTMLDivElement;
formErrorContainer.hidden = true;

const projectsList = document.getElementById('projects-list') as HTMLDivElement;

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
    addProjectForm.reset();
  }
});

chooseRandomProject.addEventListener('click', () => {
  document
    .querySelectorAll('.selected')
    .forEach(item => item.classList.remove('selected'));

  const projects = getProjects();

  let iterations = Math.floor(Math.random() * 20);
  let counter = 0;
  let currentIndex = 0;

  const loop = setInterval(() => {
    document
      .querySelectorAll('.selected')
      .forEach(item => item.classList.remove('selected'));

    const { name } = projects[currentIndex];
    const projectElement = projectsList.querySelector(
      `.project-container[data-project-name="${name}"]`
    );
    projectElement.classList.add('selected');

    counter++;
    currentIndex++;

    if (currentIndex >= projects.length) {
      currentIndex = 0;
    }

    if (counter === iterations) {
      clearInterval(loop);
    }
  }, 250);
});

const updateProjectsList = () => {
  const projects = getProjects();
  projectsList.innerHTML = '';
  projects.map((project: Project) => {
    {
      const title = document.createElement('p');
      title.classList.add('title');
      title.innerText = project.name;

      const content = document.createElement('p');
      content.innerText = project.description;

      const projectContainer = document.createElement('div');
      projectContainer.dataset.projectName = project.name;
      projectContainer.classList.add(
        'nes-container',
        'is-rounded',
        'with-title',
        'nes-pointer',
        'project-container'
      );

      projectContainer.addEventListener('click', function() {
        const dialog: any = document.getElementById('delete-project-dialog');
        document.getElementById('project-name-display').innerText =
          project.name;
        const deleteButton = document.getElementById('delete-project-button');
        deleteButton.dataset.projectName = project.name;

        deleteButton.addEventListener('click', function() {
          deleteProject(project.name);
          updateProjectsList();
        });

        dialog.showModal();
      });

      projectContainer.appendChild(title);
      projectContainer.appendChild(content);
      projectsList.appendChild(projectContainer);
    }
  });
};

window.onload = () => {
  updateProjectsList();
};
