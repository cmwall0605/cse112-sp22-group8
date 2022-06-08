const {
  continueTask,
  timerOnLoad,
  getTask,
  getTasks,
  autoContinue,
  changeTask,
  startBreak,
  deselectTask,
  startTimer,
  setTimer,
  timerCompCallback,
  finishedTask,
  createTask,
  failSession,
} = require('../../source/timer-page/timer');

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
  cosntructor() {
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

const allTasks = [];
const newTask1 = {
  id: 'test1',
  completed: false,
  name: 'Task1',
  number: 5,
  current: 0,
};
const newTask2 = {
  id: 'test2',
  completed: false,
  name: 'Task2',
  number: 6,
  current: 1,
};

const newTask3 = {
  id: 'test3',
  completed: false,
  name: 'Task3',
  number: 7,
  current: 6,
  note: 'OK3',
};

allTasks.push(newTask1);
allTasks.push(newTask2);
allTasks.push(newTask3);

describe('Test Timer functions', () => {
  beforeEach(() => {
    document.body.innerHTML =
      '<body>' +
      '<header-comp page="timer"></header-comp>' +
      '<div class="container">' +
      '<h1 id="currTask">No Task Selected</h1>' +
      '<button id="deselect-task">cancel</button>' +
      '</div>' +
      '<timer-comp data-running="false"></timer-comp>' +
      '<timer-buttons></timer-buttons>' +
      '</body>';
    localStorage.clear();
    localStorage.setItem('currentTask', 'test1');
    localStorage.setItem('allTasks', JSON.stringify(allTasks));
  });

  test('test timterOnLoad', () => {
    timerOnLoad();

    // Test that local storage was set up.
    expect(localStorage.getItem('timerMinutes')).toBe('25');
    expect(localStorage.getItem('shortBreakMinutes')).toBe('5');
    expect(localStorage.getItem('longBreakMinutes')).toBe('15');
    expect(localStorage.getItem('autoContinue')).toBe('false');

    // Test that the timer button functions were set up.
    expect(document.querySelector('timer-buttons').changeTask).not.toBe(null);
    expect(document.querySelector('timer-buttons').continueTask).not.toBe(null);
    expect(document.querySelector('timer-buttons').createTask).not.toBe(null);
    expect(document.querySelector('timer-buttons').failSession).not.toBe(null);
    expect(document.querySelector('timer-buttons').getTask).not.toBe(null);
    expect(document.querySelector('timer-buttons').getTasks).not.toBe(null);
    expect(document.querySelector('timer-buttons').startBreak).not.toBe(null);
    expect(document.querySelector('timer-buttons').startTimer).not.toBe(null);
  });

  test('test continueTask', () => {
    localStorage.setItem('timerMinutes', 100);
    continueTask();
    expect(document.getElementById('currTask').innerHTML).toBe('Task1');
    expect(document.getElementById('deselect-task').style.display).not.toBe(
      'none'
    );
  });

  test('Test getTask()', () => {
    const recievedTask = getTask();
    expect(recievedTask.id).toBe(localStorage.getItem('currentTask'));
  });

  test('Test getTask()', () => {
    const recievedTasks = getTasks();
    expect(JSON.stringify(recievedTasks)).toBe(
      localStorage.getItem('allTasks')
    );
  });

  test('Test autoContinue()', () => {});

  test('Test changeTask()', () => {});

  test('Test startBreak()', () => {});

  test('Test deselectTask()', () => {});

  test('Test startTimer()', () => {});

  test('Test setTimer()', () => {});

  test('Test timerCompCallback()', () => {});

  test('Test finishedTask()', () => {});

  test('Test createTask()', () => {});

  test('Test failSession()', () => {});
});
