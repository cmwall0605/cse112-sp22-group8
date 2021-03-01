/**
 * This file defines web component <task-item> and have helper methods
 * for each small node that to be appended to the <task-item>.
 * All the helper methods for childNodes are defined above line 152
 * The class TaskItem and construdtor defines at line 152.
 * There are getter as helper methods for retrieving childNodes from the shadow root
 * There is callback function as eventlistener for the <task-item> which
 *    is under the getter.
 */

// Section for ESLint
/* global allTasks */

/**
 * Method for creating drag icon for the task-item
 */
const createDrag = () => {
  const dragIcon = document.createElement('span');
  dragIcon.setAttribute('class', 'p-2 inline material-icons drag-btn hide');
  // dragIcon.setAttribute('draggable', "true");
  dragIcon.textContent = 'drag_indicator';
  return dragIcon;
};

/**
 * Method for creating checkbox icon for the task-item
 */
const createCheckmark = () => {
  const checkmark = document.createElement('span');
  checkmark.setAttribute('class', 'p-2 form-check form-check-inline');
  const checkmarkInput = document.createElement('input');
  checkmarkInput.setAttribute('class', 'form-check-input input-mysize large');
  checkmarkInput.setAttribute('type', 'checkbox');
  checkmarkInput.setAttribute('job', 'check');
  const checkmarkLabel = document.createElement('label');
  checkmarkLabel.setAttribute('for', 'checkbox');
  checkmark.appendChild(checkmarkInput);
  checkmark.appendChild(checkmarkLabel);
  return checkmark;
};

/**
 * Method for creating task with the input todo task for the task-item
 * @param {object} newTask the newly created task item from the task.js
 */
const createTask = (name) => {
  const todoTask = document.createElement('p');
  todoTask.setAttribute('class', 'p-2 flex-md-fill text-nowrap task-item');
  todoTask.innerHTML = name;
  return todoTask;
};

/**
 * Method for creating progress bar for the task-item
 * @param {object} newTask the new task object created by task.js
 */
const createProgressBar = (elem) => {
  // calculate the percentage of progress for the styles
  let percent = (elem.current / elem.number) * 100;
  if (percent >= 100) {
    percent = '100%';
  } else {
    percent = `${percent.toFixed(2)}%`;
  }
  // the outer div containng the progress-bar
  const progressBar = document.createElement('div');
  progressBar.setAttribute('class', 'flex-column progress');
  // the inner div for the progress itserlf and uses the attribute from the newTask object
  const progress = document.createElement('div');
  if (elem.current > elem.number) {
    progress.setAttribute(
      'class',
      'progress-bar progress-bar-striped bg-danger'
    );
  } else {
    progress.setAttribute(
      'class',
      'progress-bar progress-bar-striped bg-success'
    );
  }
  progress.setAttribute('role', 'progressbar');
  progress.setAttribute('style', `width: ${percent};`);
  progress.setAttribute('aria-valuenow', `${elem.current}`);
  progress.setAttribute('aria-valuemin', 0);
  progress.setAttribute('aria-valuemin', `${elem.number}`);
  progress.innerHTML = `${percent}`;
  // append the inner div to outer div
  progressBar.appendChild(progress);
  return progressBar;
};

/**
 * Method for creating text representing the finished pomo over the expect required pomo
 * @param {object} newTask the new task object created by task.js
 * @return the text element as described as p1 tag
 */
const createProgressText = (elem) => {
  const progressT = `${elem.current}/${elem.number}`;
  const progressText = document.createElement('p1');
  progressText.setAttribute('class', 'progress-text');
  progressText.innerHTML = `${progressT}`;
  return progressText;
};

/**
 * Method for creating the play-button to start the timer for the task-item
 * @return the button element with the play-icon
 */
const createPlayButton = () => {
  const playButton = document.createElement('button');
  playButton.setAttribute(
    'class',
    'p-2 bd-highlight btn  play-btn flex-right hide'
  );
  playButton.setAttribute('type', 'button');
  const playIcon = document.createElement('span');
  playIcon.setAttribute('class', 'material-icons play-btn hide');
  playIcon.setAttribute('job', 'play');
  playIcon.textContent = 'play_circle';
  playButton.appendChild(playIcon);
  return playButton;
};

/**
 * Method for creating edit button for the task-item
 * @return The edit button show on the task-item
 */
const createEditButton = () => {
  const editButton = document.createElement('button');
  editButton.setAttribute(
    'class',
    'p-2 bd-highlight btn  edit-btn flex-right hide'
  );
  editButton.setAttribute('type', 'button');
  const editIcon = document.createElement('span');
  editIcon.setAttribute('class', 'material-icons edit-btn hide');
  editIcon.setAttribute('job', 'edit');
  editIcon.textContent = 'mode_edit';
  editButton.appendChild(editIcon);
  return editButton;
};

/**
 * Method for creating delete button for the task-item
 * @return The delete button show on the task-item
 */
const createDeleteButton = () => {
  const deleteButton = document.createElement('button');
  deleteButton.setAttribute(
    'class',
    'p-2 bd-highlight btn  delete-btn flex-right hide'
  );
  deleteButton.setAttribute('type', 'button');
  const deleteIcon = document.createElement('span');
  deleteIcon.setAttribute('class', 'material-icons delete-btn hide');
  deleteIcon.setAttribute('job', 'delete');
  deleteIcon.textContent = 'delete';
  deleteButton.appendChild(deleteIcon);
  return deleteButton;
};

/**
 * Method for the styles sheets
 */
const styleSheets = () =>
  `<link rel="stylesheet" href="task.css"/>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1" crossorigin="anonymous"/>`;

/**
 * TaskItem class which is the task-item component that containing all the
 * buttons and the to-do task on the listed item
 */
class TaskItem extends HTMLElement {
  /**
   * Constructor for the TaskItem
s   */
  constructor() {
    super();
    this.attachShadow({
      mode: 'open',
    });
  }

  // setter for name attribute
  set setName(newValue) {
    this.setAttribute('name', newValue);
  }

  // setter for current attribute
  set setCurrent(newValue) {
    this.setAttribute('current', newValue);
  }

  // setter for number attribute
  set setNumber(newValue) {
    this.setAttribute('number', newValue);
  }

  // getter for name attribute
  get getName() {
    return this.getAttribute('name');
  }

  // getter for current attribute
  get getCurrent() {
    return this.getAttribute('current');
  }

  // getter for number attribute
  get getNumber() {
    return this.getAttribute('number');
  }

  // Helper method for retrieving the <input> for checkmark from <task-item>
  get checkmark() {
    return this.shadowRoot.querySelector('input');
  }

  // Helper method for retrieving the <p>'s content from <task-item>
  get taskName() {
    return this.shadowRoot.querySelector('p').textContent;
  }

  // invoked each time the custom element is appended into a document-connected element
  connectedCallback() {
    const shadow = this.shadowRoot;
    this.setAttribute('class', 'taskNode d-flex flex-row bd-highlight');
    this.setAttribute('draggable', 'true');

    this.name = this.getName;
    this.current = this.getCurrent;
    this.number = this.getNumber;

    // Creating the drag icon
    const dragIcon = createDrag();
    // Creating the checkmark
    const checkmark = createCheckmark();
    // Creating p tag for task name
    const todoTask = createTask(this.name);
    // Creating the progress-bar
    const progressBar = createProgressBar(this);
    const progressText = createProgressText(this);
    // Creating the play-button
    const playButton = createPlayButton();
    // Creating the edit-button
    const editButton = createEditButton();
    // Creating the edit-button
    const deleteButton = createDeleteButton();

    shadow.innerHTML = styleSheets();
    shadow.appendChild(dragIcon);
    shadow.appendChild(checkmark);
    shadow.appendChild(todoTask);
    shadow.appendChild(progressBar);
    shadow.appendChild(progressText);
    shadow.appendChild(playButton);
    shadow.appendChild(editButton);
    shadow.appendChild(deleteButton);

    this.shadowRoot
      .querySelector('.play-btn')
      .addEventListener('click', showModalTask);
    this.shadowRoot
      .querySelector('.edit-btn')
      .addEventListener('click', editTask);
    this.shadowRoot
      .querySelector('.delete-btn')
      .addEventListener('click', deleteTask);
    this.shadowRoot
      .querySelector('.form-check-input')
      .addEventListener('click', setCheck);
  }

  // Invoked when the custom element is disconnected from the document's DOM.
  disconnectedCallback() {
    this.shadowRoot
      .querySelector('.play-btn')
      .removeEventListener('click', showModalTask);
    this.shadowRoot
      .querySelector('.edit-btn')
      .addEventListener('click', editTask);
    this.shadowRoot
      .querySelector('.delete-btn')
      .addEventListener('click', deleteTask);
    this.shadowRoot
      .querySelector('.form-check-input')
      .addEventListener('click', setCheck);
  }
}
customElements.define('task-item', TaskItem);

/**
 * Retrieving the task name and notes that are stored in allTasks array
 * and show on the Modal before starting the timer.
 * @param {Element} element: the task-item that is being clicked
 */
function showModalTask(event) {
  document.getElementById('play-modal').style.display = 'block';
  const targetTask = event.target.getRootNode().host;
  document.getElementById('timer-name').innerText = targetTask.taskName;
  const taskStorageIndex = allTasks.findIndex(
    (elem) => elem.id === targetTask.id
  );
  // make the note from storage appear in the timer modal
  document.getElementById('timer-note').innerText =
    allTasks[taskStorageIndex].note;
  // set the current task id to localStorage
  const currentTask = targetTask.id;
  localStorage.setItem('currentTask', JSON.stringify(currentTask));
}

/**
 * Edit task for the allTask array and suppose to refresh after edit-save-btn is click
 * @param {Element} element the element that is being clicked
 */
function editTask(event) {
  document.getElementById('edit-modal').style.display = 'block';
  const targetID = event.target.getRootNode().host.id;
  // get the element Index in the object list
  const taskIndex = allTasks.findIndex((elem) => elem.id === targetID);
  document.getElementById('edit-save-btn').addEventListener('click', () => {
    allTasks[taskIndex].name = document.getElementById('edit-name').value;
    allTasks[taskIndex].number = document.getElementById('edit-num').value;
    allTasks[taskIndex].note = document.getElementById('edit-note').value;
  });
}

/**
 * Delete task from allTasks array and the task-list
 * @param {Element} element the element that is being clicked
 */
function deleteTask(event) {
  document.getElementById('delete-modal').style.display = 'block';
  // Delete item in the DOM
  const element = event.target;
  const itemToDelete = element.getRootNode().host;
  // Delete item in allTasks array
  const name = itemToDelete.taskName;
  document.getElementById('task-delete').innerText = `[${name}]`;
  document.getElementById('confirm-button').addEventListener('click', () => {
    for (let i = 0; i < allTasks.length; i++) {
      if (allTasks[i].name === name) {
        allTasks.splice(i, 1);
        break;
      }
    }
    // Delete item in the DOM
    itemToDelete.remove();
    document.getElementById('delete-modal').style.display = 'none';
  });
}

/**
 * Retrieving the note in Storage by getting its id
 * and update the checkmark status on the array
 * @param element the element that is being click which is passing from handleEdit()
 */
function setCheck(event) {
  const targetID = event.target.getRootNode().host.id;
  // get the element Index in the object list
  const taskIndex = allTasks.findIndex((elem) => elem.id === targetID);
  allTasks[taskIndex].completed = !allTasks[taskIndex].completed;
}

// Output module for testing
if (typeof exports !== 'undefined') {
  module.exports = {
    TaskItem,
    showModalTask,
    editTask,
    deleteTask,
    setCheck,
  };
}
