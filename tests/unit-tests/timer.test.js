const {
  continueTask,
  changeTask,
  startBreak,
  deselectTask,
  startTimer,
  createTask,
  failSession,
} = require('../../source/timer-page/timer');

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

describe('Test Timer functions', () => {
  beforeEach(() => {
    document.body.innerHTML =
      '<body></body>' +
      '<div id = "test"> ' +
      '</div>' +
      '<button id="button" />' +
      '<input type="text" id="currTask">' +
      '<input type="text" id="deselect-task">' +
      '<input type="text" id="task-note">' +
      '<timer-comp></timer-comp>';
    localStorage.clear();
    localStorage.setItem('currentTask', '123456');
    localStorage.setItem('allTasks', JSON.stringify(allTasks));
  });

  //   test('test Create Task', () => {
  //     createTask(null,'test Task', 1);
  //     expect(localStorage.getItem('currTask')).toBe('test Task');
  //   })

  test('test continueTask', () => {
    const timerComp = document.createElement('timer-comp');
    document.getElementById('test').appendChild(timerComp);
    localStorage.setItem('timerMinutes', 100);
    continueTask();
    expect(document.getElementById('currTask').innerHTML).toBe(
      'No Task Selected'
    );
    expect(document.getElementById('deselect-task').style.display).toBe('none');
  });

  //   // Tests to be exported out to timer-component.test.js
  //   /* test('Set Progress function test', () => {
  //     setProgress(50);
  //     expect(
  //       document.getElementById('progress-ring-circle').style.strokeDashoffset
  //     ).toBe('-628.3185307179587');
  //   });

  //   test('reset Progress Ring function test', () => {
  //     resetProgressRing();
  //     expect(
  //       document.getElementById('progress-ring-circle').style.strokeDashoffset
  //     ).toBe('0');
  //   }); */

  //   test('display break complete function test', () => {
  //     window.HTMLMediaElement.prototype.play = () => {
  //       /* do nothing */
  //     };
  //     displayBreakComplete();
  //     expect(document.getElementById('breakCompleteModal').style.display).toBe(
  //       'block'
  //     );
  //   });

  //   test('change Task function test', () => {
  //     global.window = Object.create(window);
  //     const url = 'http://dummy.com';
  //     Object.defineProperty(window, 'location', {
  //       value: {
  //         href: url,
  //       },
  //     });
  //     changeTask();
  //     expect(document.getElementById('breakCompleteModal').style.display).toBe(
  //       'none'
  //     );
  //     expect(window.location.href).toEqual('../tasks-page/tasks.html');
  //   });

  //   test('startBreak function test', () => {
  //     localStorage.clear();
  //     localStorage.setItem('ShortBreak', 'true');
  //     startBreak();
  //     expect(document.getElementById('start-break-btn').disabled).toBe(true);
  //     expect(document.getElementById('start-break-btn').className).toBe(
  //       'disable'
  //     );
  //   });

  //   test('display short break function test', () => {
  //     startBreak();
  //   });

  //   test('startTimer function test', () => {
  //     startTimer();
  //     expect(document.getElementById('distraction-btn').style.display).toBe('');
  //     expect(document.getElementById('fail-btn').style.display).toBe('');
  //   });

  //   // Tests that need to be rewritten/maybe exported to timer component tests
  //   /*
  //   test('start function test 1', () => {
  //     start(1, 9);
  //     expect(document.getElementById('minutes').innerHTML).toBe('01');
  //     expect(document.getElementById('seconds').innerHTML).toBe('09');
  //     expect(document.getElementById('title_timer').innerHTML).toBe('1:09');
  //   });

  //   test('start function test 2', () => {
  //     start(15, 30);
  //     expect(document.getElementById('minutes').innerHTML).toBe('15');
  //     expect(document.getElementById('seconds').innerHTML).toBe('30');
  //     expect(document.getElementById('title_timer').innerHTML).toBe('15:30');
  //   }); */

  //   test('distraction count', () => {
  //     distractionCount();
  //     expect(document.getElementById('distraction-btn').innerHTML).toBe(
  //       'Distraction : 1'
  //     );
  //   });

  //   test('display fail modal function test', () => {
  //     displayFailModal();
  //     expect(document.getElementById('failModal').style.display).toBe('block');
  //   });

  //   test('fail session function test', () => {
  //     global.window = Object.create(window);
  //     const url = 'http://dummy.com';
  //     Object.defineProperty(window, 'location', {
  //       value: {
  //         href: url,
  //       },
  //     });
  //     failSession();
  //     expect(document.getElementById('failModal').style.display).toBe('none');
  //     expect(window.location.href).toEqual('../tasks-page/tasks.html');
  //   });

  //   test('quit Fail Modal function test', () => {
  //     quitFailModal();
  //     expect(document.getElementById('failModal').style.display).toBe('none');
  //   });
});
