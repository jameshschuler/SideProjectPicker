import { Project } from './Project';
import {
  addProject,
  deleteProject,
  getProjects,
  updateProject,
  validateProjectData
} from './projects';

const addProjectForm = document.getElementById(
  'add-project-form'
) as HTMLFormElement;
const chooseRandomProject = document.getElementById(
  'choose-random-project-button'
);

// Delete Dialog
const deleteDialog = document.getElementById(
  'delete-project-dialog'
) as HTMLDialogElement;
const deleteDialogTitle = document.getElementById('delete-dialog-title');
const deleteButton = document.getElementById('delete-project-button');

// Edit Dialog
const editDialog = document.getElementById(
  'edit-project-dialog'
) as HTMLDialogElement;
const editDialogTitle = document.getElementById('edit-dialog-title');
const editFormErrorContainer = document.getElementById(
  'edit-error-container'
) as HTMLDivElement;

// Edit Form
const editForm = document.getElementById('edit-project-form');
const editFormError = document.getElementById(
  'edit-form-error'
) as HTMLParagraphElement;
const projectId = document.getElementById('project-id') as HTMLInputElement;
const nameInput = document.getElementById(
  'edit-project-name'
) as HTMLInputElement;
const descriptionInput = document.getElementById(
  'edit-project-description'
) as HTMLInputElement;
const cancelEditButton = document.getElementById(
  'cancel-edit-button'
) as HTMLButtonElement;

// Add Project Form
const formError = document.getElementById('form-error') as HTMLSpanElement;
const formErrorContainer = document.getElementById(
  'form-error-container'
) as HTMLDivElement;
formErrorContainer.hidden = true;

// Projects List
const projectsList = document.getElementById('projects-list') as HTMLDivElement;
const noProjectsAlert = document.getElementById(
  'no-projects-alert'
) as HTMLDivElement;

/**
 * Register Events
 */
addProjectForm.addEventListener('submit', () => submitProject(event));
chooseRandomProject.addEventListener('click', () => selectRandomProject());

/**
 *
 * @param event
 */
const submitProject = (event: any) => {
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
};

const selectRandomProject = () => {
  document
    .querySelectorAll('.selected')
    .forEach(item => item.classList.remove('selected'));

  const projects = getProjects();

  if (projects.length === 0) return;

  let iterations = Math.floor(Math.random() * 20);
  if (iterations === 0) iterations = 1;

  let counter = 0;
  let currentIndex = 0;

  const loop = setInterval(() => {
    document
      .querySelectorAll('.selected')
      .forEach(item => item.classList.remove('selected'));

    const { id } = projects[currentIndex];
    const projectElement = projectsList.querySelector(
      `.project-container[data-project-id="${id}"]`
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
};

/**
 *
 */
const updateProjectsList = () => {
  const projects = getProjects();
  projects.length === 0
    ? noProjectsAlert.classList.remove('hidden')
    : noProjectsAlert.classList.add('hidden');

  projectsList.innerHTML = '';
  projects.map((project: Project) => {
    {
      const title = createElement('p', ['title']);
      title.innerText = project.name;

      const content = document.createElement('p');
      content.innerText = project.description;

      const showEditDialogButton = document.createElement('span');
      showEditDialogButton.appendChild(
        createElement('i', ['fas', 'fa-pencil-alt'])
      );

      showEditDialogButton.addEventListener('click', () => {
        buildEditDialog(editDialog, project);
        editDialog.showModal();
      });

      const showDeleteDialogButton = document.createElement('span');
      showDeleteDialogButton.appendChild(
        createElement('i', ['fas', 'fa-trash'])
      );
      showDeleteDialogButton.addEventListener('click', () => {
        buildDeleteDialog(project.name, project.id);

        deleteDialog.showModal();
      });

      const actions = createElement('div', ['icons']);
      actions.appendChild(showEditDialogButton);
      actions.appendChild(showDeleteDialogButton);

      const contentContainer = createElement('div', ['content-container']);
      contentContainer.appendChild(content);
      contentContainer.appendChild(actions);

      const projectContainer = createElement('div', [
        'nes-container',
        'is-rounded',
        'with-title',
        'nes-pointer',
        'project-container'
      ]);
      projectContainer.dataset.projectId = project.id;

      projectContainer.appendChild(title);
      projectContainer.appendChild(contentContainer);
      projectsList.appendChild(projectContainer);
    }
  });
};

/**
 *
 * @param dialog
 * @param project
 */
const buildEditDialog = (dialog: any, project: Project) => {
  editDialogTitle.innerText = `Editing '${project.name}'`;

  projectId.value = project.id;
  nameInput.value = project.name;
  descriptionInput.value = project.description;

  cancelEditButton.addEventListener('click', event => {
    event.stopPropagation();
    dialog.close();
  });

  editForm.addEventListener('submit', event => {
    event.preventDefault();

    const validationResult = validateProjectData(
      nameInput.value,
      descriptionInput.value
    );

    if (validationResult) {
      editFormErrorContainer.classList.remove('hidden');
      editFormError.innerText = validationResult;
      return;
    }

    editFormErrorContainer.classList.add('hidden');
    updateProject({
      id: projectId.value,
      name: nameInput.value,
      description: descriptionInput.value
    });
    editDialog.close();
    updateProjectsList();
  });
};

/**
 *
 * @param projectId
 */
const buildDeleteDialog = (name: string, projectId: string) => {
  deleteDialogTitle.innerText = name;
  deleteButton.dataset.projectId = projectId;

  deleteButton.addEventListener('click', function() {
    deleteProject(projectId);
    updateProjectsList();
  });
};

/**
 *
 * @param type
 * @param classes
 */
const createElement = (type: string, classes: string[]) => {
  const element = document.createElement(type);
  element.classList.add(...classes);
  return element;
};

window.onload = () => {
  updateProjectsList();
};
