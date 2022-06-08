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
const { TimerComp } = require('../../source/components/timer-comp/timer-comp');
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
      '</body>';
    localStorage.clear();
    localStorage.setItem('currentTask', 'test1');
    localStorage.setItem('allTasks', JSON.stringify(allTasks));
    localStorage.setItem('todayPomo', 0);
    const timerButtons = document.createElement('timer-buttons');
    document.querySelector('body').appendChild(timerButtons);
    const timerComp = document.createElement('timer-comp');
    timerComp.setAttribute('data-running', 'false');
    document.querySelector('body').appendChild(timerComp);
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

  test('Test autoContinue() on a work session', () => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');
    const hideButtonsSpy = jest.spyOn(
      document.querySelector('timer-buttons'),
      'hideButtons'
    );
    localStorage.setItem('shortBreak', 'true');
    autoContinue();
    jest.advanceTimersByTime(2000);
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(hideButtonsSpy).toHaveBeenCalled();
  });

  test('Test autoContinue() on a break session', () => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');
    const displaySpy = jest.spyOn(
      document.querySelector('timer-buttons'),
      'displayBreakComplete'
    );
    localStorage.setItem('shortBreak', 'false');
    autoContinue();
    jest.advanceTimersByTime(2000);
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(displaySpy).toHaveBeenCalled();
  });

  test('Test changeTask()', () => {
    Object.defineProperty(window, 'location', {
      value: {
        href: '/timer-page/timer.html',
      },
    });
    changeTask();
    expect(window.location.href).toBe('../tasks-page/tasks.html');
  });

  test('Test startBreak()', () => {
    startBreak();
    expect(document.querySelector('timer-comp').dataset.running).toBe('true');
  });

  test('Test deselectTask()', () => {
    deselectTask();
    expect(localStorage.getItem('currentTask')).toBe(null);
    expect(document.getElementById('currTask').innerHTML).toBe(
      'No Task Selected'
    );
    expect(document.getElementById('deselect-task').style.display).toBe('none');
  });

  test('Test startTimer()', () => {
    startTimer();
    expect(localStorage.getItem('todayPomo')).toBe('1');
    expect(localStorage.getItem('currentDistractCounter')).toBe('0');
    expect(document.getElementById('deselect-task').style.display).toBe('none');
    expect(document.querySelector('timer-comp').dataset.running).toBe('true');
  });

  test('Test setTimer()', () => {
    const timerComp = document.querySelector('timer-comp');
    setTimer(1, 2);
    expect(timerComp.dataset.minutesLeft).toBe('1');
    expect(timerComp.dataset.secondsLeft).toBe('2');
    setTimer(25, 0);
    expect(timerComp.dataset.minutesLeft).toBe('25');
    expect(timerComp.dataset.secondsLeft).toBe('0');
    setTimer(15, 12);
    expect(timerComp.dataset.minutesLeft).toBe('15');
    expect(timerComp.dataset.secondsLeft).toBe('12');
    setTimer(5, 20);
    expect(timerComp.dataset.minutesLeft).toBe('5');
    expect(timerComp.dataset.secondsLeft).toBe('20');
  });

  test(
    'Test timerCompCallback() with runnning to false with isPomo to true and ' +
      'sessionCounter to 0 (also tests finishedTask())',
    () => {
      localStorage.setItem('sessionCounter', 0);
      localStorage.setItem('isPomo', 'true');
      const mutations = [
        {
          attributeName: 'data-running',
          target: {
            dataset: {
              running: 'false',
            },
          },
        },
      ];
      const breakDialog = document
        .querySelector('timer-buttons')
        .shadowRoot.getElementById('breakCompleteDialog');
      breakDialog.showModal = jest.fn(() => {
        breakDialog.setAttribute('not-hidden', 'true');
      });
      timerCompCallback(mutations);
      expect(breakDialog.getAttribute('not-hidden')).toBe('true');
      expect(localStorage.getItem('sessionCounter')).toBe('0');
      expect(localStorage.getItem('isPomo')).toBe('false');
    }
  );

  test(
    'Test timerCompCallback() with runnning to false with isPomo to false' +
      'and sessionCounter to 0 (short break)',
    () => {
      jest.useFakeTimers();
      localStorage.setItem('sessionCounter', 0);
      localStorage.setItem('isPomo', 'false');
      localStorage.setItem('shortBreak', 'true');
      const mutations = [
        {
          attributeName: 'data-running',
          target: {
            dataset: {
              running: 'false',
            },
          },
        },
      ];
      const failDialog = document
        .querySelector('timer-buttons')
        .shadowRoot.getElementById('failDialog');
      failDialog.close = jest.fn(() => {
        failDialog.setAttribute('hidden', 'true');
      });
      timerCompCallback(mutations);
      jest.advanceTimersByTime(2000);
      expect(failDialog.hidden).toBe(true);
      expect(localStorage.getItem('sessionCounter')).toBe('1');
      expect(localStorage.getItem('isPomo')).toBe('true');
      expect(document.getElementById('deselect-task').style.display).toBe(
        'none'
      );
      expect(document.getElementById('currTask').innerHTML).toBe('Short Break');
    }
  );

  test(
    'Test timerCompCallback() with runnning to false with isPomo to false' +
      'and sessionCounter to 0 (long break)',
    () => {
      jest.useFakeTimers();
      localStorage.setItem('sessionCounter', 3);
      localStorage.setItem('isPomo', 'false');
      const mutations = [
        {
          attributeName: 'data-running',
          target: {
            dataset: {
              running: 'false',
            },
          },
        },
      ];
      const failDialog = document
        .querySelector('timer-buttons')
        .shadowRoot.getElementById('failDialog');
      failDialog.close = jest.fn(() => {
        failDialog.setAttribute('hidden', 'true');
      });
      timerCompCallback(mutations);
      jest.advanceTimersByTime(2000);
      expect(failDialog.hidden).toBe(true);
      expect(localStorage.getItem('sessionCounter')).toBe('4');
      expect(localStorage.getItem('isPomo')).toBe('true');
      expect(document.getElementById('deselect-task').style.display).toBe(
        'none'
      );
      expect(document.getElementById('currTask').innerHTML).toBe('Long Break');
    }
  );

  test('Test timerCompCallback() with non data-running mutation', () => {
    const mutations = [
      {
        attributeName: 'not-data',
        target: {
          dataset: {
            running: 'true',
          },
        },
      },
    ];

    timerCompCallback(mutations);
    const timer = document.getElementsByTagName('timer-comp')[0];
    timer.dataset.minutesLeft = 1;
    timer.dataset.secondsLeft = 2;
    timerCompCallback(mutations);
    expect(document.title).toBe('Tomo Timer - 1:02');
    timer.dataset.minutesLeft = 10;
    timer.dataset.secondsLeft = 32;
    timerCompCallback(mutations);
    expect(document.title).toBe('Tomo Timer - 10:32');
  });

  test('Test createTask() with existing task', () => {
    const id = 'test2';
    createTask(id);
    expect(document.getElementById('currTask').innerHTML).toBe('Task2');
    expect(localStorage.getItem('currentTask')).toBe('test2');
  });

  test('Test createTask() with new task', () => {
    const name = 'newName';
    const count = 3;
    createTask(null, name, count);
    expect(document.getElementById('currTask').innerHTML).toBe('newName');
  });

  test('Test failSession()', () => {
    Object.defineProperty(window, 'location', {
      value: {
        href: '/timer-page/timer.html',
      },
    });
    failSession();
    expect(window.location.href).toBe('../tasks-page/tasks.html');
  });
});
