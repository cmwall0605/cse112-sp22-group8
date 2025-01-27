const {
  TimerButtons,
} = require('../../source/components/timer-buttons/timer-buttons');

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

describe('Timer Button Test Constructor', () => {
  const allTasks = [];

  const newTask1 = {
    id: '123456',
    completed: false,
    name: 'Task1',
    number: 5,
    current: 0,
    note: 'OK1',
  };

  const newTask2 = {
    id: '333333',
    completed: false,
    name: 'Task2',
    number: 6,
    current: 1,
    note: 'OK2',
  };

  const newTask3 = {
    id: '555555',
    completed: false,
    name: 'Task3',
    number: 7,
    current: 6,
    note: 'OK3',
  };

  allTasks.push(newTask1);
  allTasks.push(newTask2);
  allTasks.push(newTask3);
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('allTasks', JSON.stringify(allTasks));
    document.body.innerHTML =
      '<div id = "test"> ' +
      '</div>' +
      '<button id="button" />' +
      '<input type="text" id="task-name">' +
      '<input type="text" id="task-num">' +
      '<input type="text" id="task-note">';
  });

  test('Test ConnectedCallback', () => {
    // Create Element
    const timerButtons = document.createElement('timer-buttons');

    // Create Spies for functions called in connectedCallback
    const breakModal = jest.spyOn(timerButtons, 'createBreakEndDialog');
    const failDialog = jest.spyOn(timerButtons, 'createFailDialog');
    const buttonContainer = jest.spyOn(timerButtons, 'createButtons');
    const createTaskForm = jest.spyOn(timerButtons, 'buildCreateTaskForm');
    document.getElementById('test').appendChild(timerButtons);

    // Expect check if the function is called
    expect(breakModal).toHaveBeenCalled();
    expect(failDialog).toHaveBeenCalled();
    expect(buttonContainer).toHaveBeenCalled();
    expect(createTaskForm).toHaveBeenCalled();
  });
});

describe('Test Timer Buttons functions', () => {
  const allTasks = [];

  const newTask1 = {
    id: '123456',
    completed: false,
    name: 'Task1',
    number: 5,
    current: 0,
    note: 'OK1',
  };

  const newTask2 = {
    id: '333333',
    completed: false,
    name: 'Task2',
    number: 6,
    current: 1,
    note: 'OK2',
  };

  const newTask3 = {
    id: '555555',
    completed: false,
    name: 'Task3',
    number: 7,
    current: 6,
    note: 'OK3',
  };

  allTasks.push(newTask1);
  allTasks.push(newTask2);
  allTasks.push(newTask3);
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('allTasks', JSON.stringify(allTasks));
    document.body.innerHTML =
      '<div id = "test"> ' +
      '</div>' +
      '<button id="button" />' +
      '<input type="text" id="task-name">' +
      '<input type="text" id="task-num">' +
      '<input type="text" id="task-note">';
  });

  test('Test setDisableTaskForm', () => {
    // Create Element
    const timerButtons = document.createElement('timer-buttons');
    document.getElementById('test').appendChild(timerButtons);

    // Call Function
    timerButtons.setDisableTaskForm();

    // Expect check
    expect(localStorage.getItem('disable-create-menu')).toBe('false');
  });

  test('Test StartSession', () => {
    // Create Element
    const timerButtons = document.createElement('timer-buttons');
    document.getElementById('test').appendChild(timerButtons);

    // Call Function
    timerButtons.startSession();

    // Expect check
    expect(timerButtons.shadowRoot.querySelector('#distraction-btn').src).toBe(
      'http://localhost/assets/images/tomo-excited.webp'
    );
    expect(
      timerButtons.shadowRoot.querySelector('#distraction-btn').style.display
    ).toBe('');
    expect(
      timerButtons.shadowRoot.querySelector('.fail-button').style.display
    ).toBe('');
  });

  test('Test hideButtons', () => {
    // Create Element
    const timerButtons = document.createElement('timer-buttons');
    document.getElementById('test').appendChild(timerButtons);

    // Call Function
    timerButtons.hideButtons();
  });

  test('Test setupBreak', () => {
    // Create Element
    const timerButtons = document.createElement('timer-buttons');
    document.getElementById('test').appendChild(timerButtons);

    // Call Function
    timerButtons.setupBreak();

    // Expect check
    expect(
      timerButtons.shadowRoot.querySelector('#break-button').style.display
    ).toBe('');
  });

  test('Test displayBreakComplete; isAuto == true', () => {
    // Create Element
    const timerButtons = document.createElement('timer-buttons');
    document.getElementById('test').appendChild(timerButtons);

    // Call Function
    timerButtons.displayBreakComplete(true);

    // Expect check.
    expect(
      timerButtons.shadowRoot.getElementById('auto-continue').style.display
    ).toBe('inline-block');
    expect(
      timerButtons.shadowRoot
        .getElementById('auto-continue-progress')
        .getAttribute('running')
    ).toBe('true');
    expect(
      timerButtons.shadowRoot.getElementById('continue-btn').style.display
    ).toBe('none');
  });

  test('Test countDistraction; no currentDistractCounter localStorage', () => {
    // Create Element
    const timerButtons = document.createElement('timer-buttons');
    document.getElementById('test').appendChild(timerButtons);

    // Call Function
    timerButtons.countDistraction();

    // Expect check

    expect(localStorage.getItem('currentDistractCounter')).toBe('1');
    expect(timerButtons.src).toBe('/assets/images/tomo-happy.webp');
  });

  test('Test countDistraction; currentDistractCounter == 1', () => {
    // Create Element
    const timerButtons = document.createElement('timer-buttons');
    document.getElementById('test').appendChild(timerButtons);

    // Call Function
    localStorage.setItem('currentDistractCounter', '1');
    timerButtons.countDistraction();

    // Expect check
    expect(localStorage.getItem('currentDistractCounter')).toBe('2');
    expect(timerButtons.src).toBe('/assets/images/tomo-neutral.webp');
  });

  test('Test countDistraction; currentDistractCounter == 2', () => {
    // Create Element
    const timerButtons = document.createElement('timer-buttons');
    document.getElementById('test').appendChild(timerButtons);

    // Call Function
    localStorage.setItem('currentDistractCounter', '2');
    timerButtons.countDistraction();

    // Expect check

    expect(localStorage.getItem('currentDistractCounter')).toBe('3');
    expect(timerButtons.src).toBe('/assets/images/tomo-meh.webp');
  });

  test('Test countDistraction; currentDistractCounter >= 3', () => {
    // Create Element
    const timerButtons = document.createElement('timer-buttons');
    document.getElementById('test').appendChild(timerButtons);

    // Call Function
    localStorage.setItem('currentDistractCounter', '4');
    timerButtons.countDistraction();

    // Expect check
    expect(localStorage.getItem('currentDistractCounter')).toBe('5');
    expect(timerButtons.src).toBe('/assets/images/tomo-bleh.webp');
  });

  test('setFunctions', () => {
    // Create Element
    const timerButtons = document.createElement('timer-buttons');
    document.getElementById('test').appendChild(timerButtons);

    // Call Function
    function dummyChangeTask() {
      console.log('dummyChangeTask');
    }
    function dummyContinueTask() {
      console.log('dummyContinueTask');
    }
    function dummmyCreateTask() {
      console.log('dummmyCreateTask');
    }
    function dummyFailSession() {
      console.log('dummyFailSession');
    }
    function dummyGetTask() {
      console.log('dummyGetTask');
    }
    function dummyGetTasks() {
      console.log('dummyGetTasks');
    }
    function dummyStartBreak() {
      console.log('dummyStartBreak');
    }
    function dummyStartTimer() {
      console.log('dummyStartTimer');
    }
    timerButtons.setFunctions(
      dummyChangeTask,
      dummyContinueTask,
      dummmyCreateTask,
      dummyFailSession,
      dummyGetTask,
      dummyGetTasks,
      dummyStartBreak,
      dummyStartTimer
    );

    // Expect check
    expect(timerButtons.changeTask).toBe(dummyChangeTask);
    expect(timerButtons.continueTask).toBe(dummyContinueTask);
    expect(timerButtons.createTask).toBe(dummmyCreateTask);
    expect(timerButtons.failSession).toBe(dummyFailSession);
    expect(timerButtons.getTask).toBe(dummyGetTask);
    expect(timerButtons.getTasks).toBe(dummyGetTasks);
    expect(timerButtons.startBreak).toBe(dummyStartBreak);
    expect(timerButtons.startTimer).toBe(dummyStartTimer);
  });
});
