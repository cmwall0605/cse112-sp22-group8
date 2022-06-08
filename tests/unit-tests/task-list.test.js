const { TaskList } = require('../../source/components/task-list/task-list');

require('../../source/components/task-item/task-item');
require('../../source/components/task-list/task-list');

/**
 * Created a mock local storage object since local storage does not exist in the
 * jest enviornment.
 * Inspired By:
 * https://stackoverflow.com/questions/57092154/how-to-test-img-onload-using-jest
 */
class MockLocalStorage {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = String(value);
  }

  removeItem(key) {
    delete this.store[key];
  }
}

// Set up the mock local storage as the global local storage
global.localStorage = new MockLocalStorage();

describe('test task-list constructor', () => {
  beforeEach(() => {
    document.body.innerHTML =
      '<div id = "test"> ' +
      '</div>' +
      '<button id="button" />' +
      '<input type="text" id="task-name">' +
      '<input type="text" id="task-num">' +
      '<input type="text" id="task-note">';
  });

  test('component initialize', () => {
    // Create Element
    const taskList = document.createElement('task-list');

    // Expect check
    expect(taskList.dropzone).toBe(null);
    expect(taskList.checked).toBe(false);
    expect(taskList.node).toBe(undefined);
    expect(taskList.preNodePos).toBe(null);
    expect(taskList.shadowRoot.querySelector('link').rel).toBe('stylesheet');
    expect(taskList.shadowRoot.querySelector('link').href).toBe(
      'http://localhost/components/task-list/task-list.css'
    );
  });

  // test("test connectedCallback")
});

describe('test task-list function', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML =
      '<div id = "test"> ' +
      '</div>' +
      '<button id="button" />' +
      '<input type="text" id="task-name">' +
      '<input type="text" id="task-num">' +
      '<input type="text" id="task-note">';
  });

  test('addTask test', () => {
    // Create Element
    const taskList = document.createElement('task-list');
    document.getElementById('test').appendChild(taskList);

    // Call Function
    taskList.addTask(1, true, 'test1', 2, 3, 'testing note');

    // Expect check
    const allTasks = localStorage.getItem('allTasks');
    const expectedTask = JSON.parse(allTasks)[0];
    expect(expectedTask.id).toBe(1);
    expect(expectedTask.completed).toBe(true);
    expect(expectedTask.name).toBe('test1');
    expect(expectedTask.number).toBe(2);
    expect(expectedTask.current).toBe(3);
    expect(expectedTask.note).toBe('testing note');
  });

  test('deleteTask test', () => {
    // Create Element
    const taskList = document.createElement('task-list');
    document.getElementById('test').appendChild(taskList);

    // Call Function
    const event = new Event('build');
    taskList.handleDragOver(event);

    expect(localStorage.getItem('allTasks')).toBe(null);
  });

  test('editTask test', () => {
    // Create Element
    const taskList = document.createElement('task-list');
    document.getElementById('test').appendChild(taskList);

    // Call Function
    taskList.addTask(1, true, 'test1', 2, 3, 'testing note');
    taskList.editTask(1, 'newTitle', 5);

    // Expect check
    const allTasks = localStorage.getItem('allTasks');
    const expectedTask = JSON.parse(allTasks)[0];
    expect(expectedTask.id).toBe(1);
    expect(expectedTask.completed).toBe(true);
    expect(expectedTask.name).toBe('newTitle');
    expect(expectedTask.number).toBe(5);
    expect(expectedTask.current).toBe(3);
    expect(expectedTask.note).toBe('testing note');
  });

  test('establishNodePosition Test', () => {
    // Create Element
    const taskList = document.createElement('task-list');
    document.getElementById('test').appendChild(taskList);

    // Call Function
    taskList.addTask(1, true, 'test1', 2, 3, 'testing note');
    taskList.establishNodePositions();

    // Expect Check
    expect(taskList.nodes[0].yPos).toBe(0);
  });
});

describe('Test other event functions', () => {
  beforeEach(() => {
    // Set up the inner HTML so that functions inside of Task can find elements
    //  in the document they are looking for.
    document.body.innerHTML = '<body><body>';

    const allTasks = [];

    // Set up first task item to me inserted into the mock memory
    const inputTask1 = {
      id: '1',
      completed: false,
      name: 'name1',
      number: 1,
      current: 0,
      note: 'note1',
    };
    allTasks.push(inputTask1);

    // Set up second task item to me inserted into the mock memory
    const inputTask2 = {
      id: '2',
      completed: true,
      name: 'name2',
      number: 2,
      current: 1,
      note: 'note2',
    };
    allTasks.push(inputTask2);

    // Mock Storage
    Storage.prototype.getItem = jest.fn(() => JSON.stringify(allTasks));
  });

  test('Test playTask even (aka play event)', () => {
    // Create and set task list element in document
    const taskList = document.createElement('task-list');
    document.querySelector('body').appendChild(taskList);

    // Get task item 1's button
    const taskItem = taskList.shadowRoot.getElementById('1');
    const taskItemPlayBtn =
      taskItem.shadowRoot.querySelector('button[job="play"]');

    // Define play event
    const playEvent = new Event('click');
    Object.defineProperty(playEvent, 'target', {
      writable: false,
      value: taskItemPlayBtn,
    });

    // Run playTask
    TaskList.playTask(playEvent);

    // expect(window.location).toEqual('/timer-page/timer.html');
  });

  test('Test setCheck event', () => {
    // Create and set task list element in document
    const taskList = document.createElement('task-list');
    document.querySelector('body').appendChild(taskList);

    // Get task item 1's button
    const taskItem = taskList.shadowRoot.getElementById('1');
    const taskItemCheck = taskItem.shadowRoot.querySelector('input');

    // Define check event
    const checkEvent = new Event('click');
    Object.defineProperty(checkEvent, 'target', {
      writable: false,
      value: taskItemCheck,
    });

    // Run setCheck
    taskList.setCheck(checkEvent);

    // comfirm changes
    expect(taskList.allTasks[0].completed).toBe(true);
    expect(taskItem.completed).toBe('true');

    // Run setCheck again
    taskList.setCheck(checkEvent);

    // comfirm changes
    expect(taskList.allTasks[0].completed).toBe(false);
    expect(taskItem.completed).toBe('false');
  });
});

describe('Test task-list dragging', () => {
  beforeEach(() => {
    // Set up the inner HTML so that functions inside of Task can find elements
    //  in the document they are looking for.
    document.body.innerHTML = '<body><body>';

    const allTasks = [];

    // Set up first task item to me inserted into the mock memory
    const inputTask1 = {
      id: '1',
      completed: false,
      name: 'name1',
      number: 1,
      current: 0,
      note: 'note1',
    };
    allTasks.push(inputTask1);

    // Set up second task item to me inserted into the mock memory
    const inputTask2 = {
      id: '2',
      completed: true,
      name: 'name2',
      number: 2,
      current: 1,
      note: 'note2',
    };
    allTasks.push(inputTask2);

    // Mock Storage
    Storage.prototype.getItem = jest.fn(() => JSON.stringify(allTasks));
  });

  test('Test dragging', () => {
    // Create and set task list element in document
    const taskList = document.createElement('task-list');
    document.querySelector('body').appendChild(taskList);

    // Mock establishNodePositions function as this function is dependent on
    // the .getBoundingClientRect() function.
    taskList.establishNodePositions = jest.fn(() => {});

    // get the first task item (one at top)
    const draggedTask = taskList.shadowRoot.getElementById('1');

    // Get the dropzone which handles drag n' drop functionality
    const dropzone = taskList.shadowRoot.querySelector('section');

    // Create events to mimic dragging events that the user would trigger.
    const dragStartEvent = new Event('dragstart');
    const dragOverEvent = new Event('dragover');
    Object.defineProperty(dragStartEvent, 'target', {
      writable: false,
      value: draggedTask,
    });

    // Before drag event has occured, expect it to be the same element
    expect(taskList.allTasks[0].id).toBe('1');

    // Set up event.
    taskList.nodes[0].yPos = 1;
    taskList.nodes[1].yPos = 4;
    dragOverEvent.clientY = 5;
    expect(taskList.checked).toBe(false);
    expect(taskList.selectedNode).toBe(null);
    dropzone.dispatchEvent(dragStartEvent);
    expect(taskList.checked).toBe(false);
    expect(taskList.selectedNode).toBe(draggedTask);
    dropzone.dispatchEvent(dragOverEvent);

    // New First Child Testing
    // Test id
    expect(
      taskList.shadowRoot.querySelectorAll('task-item')[0].getAttribute('id')
    ).toBe('2');

    // Test name
    expect(
      taskList.shadowRoot.querySelectorAll('task-item')[0].getAttribute('name')
    ).toBe('name2');

    // Test number
    expect(
      taskList.shadowRoot
        .querySelectorAll('task-item')[0]
        .getAttribute('number')
    ).toBe('2');

    // Test current
    expect(
      taskList.shadowRoot
        .querySelectorAll('task-item')[0]
        .getAttribute('current')
    ).toBe('1');

    // Test completed
    expect(
      taskList.shadowRoot
        .querySelectorAll('task-item')[0]
        .getAttribute('completed')
    ).toBe('true');

    // Test the allTasks values for the task item
    expect(taskList.allTasks[0].name).toBe('name1');
    expect(taskList.allTasks[0].number).toBe(1);
    expect(taskList.allTasks[0].note).toBe('note1');

    // New Second Child Testing
    // Test id
    expect(
      taskList.shadowRoot.querySelectorAll('task-item')[1].getAttribute('id')
    ).toBe('1');

    // Test name
    expect(
      taskList.shadowRoot.querySelectorAll('task-item')[1].getAttribute('name')
    ).toBe('name1');

    // Test numumber
    expect(
      taskList.shadowRoot
        .querySelectorAll('task-item')[1]
        .getAttribute('number')
    ).toBe('1');

    // Test current
    expect(
      taskList.shadowRoot
        .querySelectorAll('task-item')[1]
        .getAttribute('current')
    ).toBe('0');

    // Test completed
    expect(
      taskList.shadowRoot
        .querySelectorAll('task-item')[1]
        .getAttribute('completed')
    ).toBe('false');

    // Test the allTasks values for the task item
    expect(taskList.allTasks[1].name).toBe('name2');
    expect(taskList.allTasks[1].number).toBe(2);
    expect(taskList.allTasks[1].note).toBe('note2');
  });

  test('Test establishNodePositions function', () => {
    // Create and set task list element in document
    const taskList = document.createElement('task-list');
    document.querySelector('body').appendChild(taskList);
    taskList.nodes[0].getBoundingClientRect = jest.fn(() => ({
      bottom: 2,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      width: 0,
    }));
    taskList.nodes[1].getBoundingClientRect = jest.fn(() => ({
      bottom: 4,
      height: 0,
      left: 0,
      right: 0,
      top: 2,
      width: 0,
    }));
    taskList.establishNodePositions();
    expect(taskList.nodes[0].yPos).toBe(1);
    expect(taskList.nodes[1].yPos).toBe(3);
  });
});
