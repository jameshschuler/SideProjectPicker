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

  const validationResult = validateProjectData(
    projectName.value,
    projectDescription.value
  );

  if (validationResult) {
    formError.innerHTML = validationResult;
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

      const editIcon = document.createElement('span');
      editIcon.appendChild(createElement('i', ['fas', 'fa-pencil-alt']));
      editIcon.addEventListener('click', () => {
        buildEditDialog(project);

        const dialog: any = document.getElementById('edit-project-dialog');

        document
          .getElementById('cancel-edit-button')
          .addEventListener('click', event => {
            event.stopPropagation();
            dialog.close();
          });

        dialog.showModal();
      });

      const deleteIcon = document.createElement('span');
      deleteIcon.appendChild(createElement('i', ['fas', 'fa-trash']));
      deleteIcon.addEventListener('click', () => {
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

      const icons = createElement('div', ['icons']);
      icons.appendChild(editIcon);
      icons.appendChild(deleteIcon);

      const contentContainer = document.createElement('div');
      contentContainer.classList.add('content-container');
      contentContainer.appendChild(content);
      contentContainer.appendChild(icons);

      const projectContainer = document.createElement('div');
      projectContainer.dataset.projectName = project.name;
      projectContainer.classList.add(
        'nes-container',
        'is-rounded',
        'with-title',
        'nes-pointer',
        'project-container'
      );
      projectContainer.appendChild(title);
      projectContainer.appendChild(contentContainer);

      projectsList.appendChild(projectContainer);
    }
  });
};

const buildEditDialog = (project: Project) => {
  const title = document.getElementById('edit-dialog-title');
  title.innerText = `Edit '${project.name}'`;

  const projectId = document.getElementById('project-id') as HTMLInputElement;
  projectId.value = project.id;

  const projectNameInput = document.getElementById(
    'edit-project-name'
  ) as HTMLInputElement;
  projectNameInput.value = project.name;

  const projectDescriptionInput = document.getElementById(
    'edit-project-description'
  ) as HTMLInputElement;
  projectDescriptionInput.value = project.description;

  const editForm = document.getElementById('edit-project-form');
  editForm.addEventListener('submit', event => {
    event.preventDefault();
    console.log('submit');
  });
};

const buildDeleteDialog = () => {};

function createElement(type: string, classes: string[]) {
  const element = document.createElement(type);
  element.classList.add(...classes);
  return element;
}

// TODO: hide error message after 3000
function setErrorMessage(message?: string) {
  if (message || message === '') {
    document.getElementById('general-error').innerText = message;
    document
      .getElementById('general-error-container')
      .classList.remove('hidden');
  } else {
    document.getElementById('general-error-container').classList.add('hidden');
  }
}

window.onload = () => {
  updateProjectsList();
};
