const {
  TimerComp,
} = require('../../source/components/timer-comp/timer-comp.js');

describe('Timer Componenet Test Constructor', () => {
  test('Test that timer-comp can be created properly', () => {
    const inputTimer = {
      id: 'minutes',
      dataMinutesLeft: '10',
      dataSecondsLeft: '30',
      dataRunning: 'true',
    };

    // Create Element
    const timerComponent = document.createElement('timer-comp');

    timerComponent.connectedCallback();

    // Setup testElement
    timerComponent.setAttribute('id', inputTimer.id);
    timerComponent.dataMinutesLeft = inputTimer.dataMinutesLeft;
    timerComponent.dataSecondsLeft = inputTimer.dataSecondsLeft;
    timerComponent.dataRunning = inputTimer.dataRunning;

    // Expect timerComponent elements
    expect(timerComponent.id).toBe(inputTimer.id);
    expect(timerComponent.dataMinutesLeft).toBe(inputTimer.dataMinutesLeft);
    expect(timerComponent.dataSecondsLeft).toBe(inputTimer.dataSecondsLeft);
    expect(timerComponent.dataRunning).toBe(inputTimer.dataRunning);
  });

  test('Test that timer-comp can be created properly when dataMinutesLeft < 10 and dataSecondLeft < 10', () => {
    const inputTimer = {
      id: 'minutes',
      dataMinutesLeft: '5',
      dataSecondsLeft: '5',
      dataRunning: 'true',
    };

    // Create Element
    const timerComponent = document.createElement('timer-comp');

    timerComponent.connectedCallback();

    // Setup testElement
    timerComponent.setAttribute('id', inputTimer.id);
    timerComponent.dataMinutesLeft = inputTimer.dataMinutesLeft;
    timerComponent.dataSecondsLeft = inputTimer.dataSecondsLeft;
    timerComponent.dataRunning = inputTimer.dataRunning;

    // Expect timerComponent elements
    expect(timerComponent.id).toBe(inputTimer.id);
    expect(timerComponent.dataMinutesLeft).toBe(inputTimer.dataMinutesLeft);
    expect(timerComponent.dataSecondsLeft).toBe(inputTimer.dataSecondsLeft);
    expect(timerComponent.dataRunning).toBe(inputTimer.dataRunning);
  });
});

describe('Timer Component Test Functions', () => {
  beforeEach(() => {
    document.body.innerHTML =
      '<div id = "test"> ' +
      '</div>' +
      '<button id="button" />' +
      '<input type="text" id="task-name">' +
      '<input type="text" id="task-num">' +
      '<input type="text" id="task-note">';
  });

  test('Test Set Progress', () => {
    // Create Timer Componeent
    const timerComponent = document.createElement('timer-comp');
    timerComponent.connectedCallback();

    // Call function
    timerComponent.setProgress(60);
    const circle = timerComponent.shadowRoot.getElementById(
      'progress-ring-circle'
    );
    const r = circle.getAttribute('r');
    const expectedOffset = -(60 / 100) * (parseInt(r, 10) * 2 * Math.PI);
    expect(circle.style.strokeDashoffset).toBe(`${expectedOffset}`);
  });

  test('Test StopTimer', () => {
    // Create Timer Componeent
    const timerComponent = document.createElement('timer-comp');
    timerComponent.connectedCallback();

    // Call function
    timerComponent.stopTimer();
    expect(timerComponent.dataset.running).toBe('false');
  });

  test('Test secondsTimer', () => {
    // Create Timer Componeent
    const timerComponent = document.createElement('timer-comp');
    timerComponent.connectedCallback();

    // Call function
    timerComponent.secondsTimer(100, 10000);
    const currTime = new Date();
    const elapsed = Math.floor((currTime - 100) / 1000);
    const expectedPercentage = 100 - ((10000 - elapsed) / 10000) * 100;
    const circle = timerComponent.shadowRoot.getElementById(
      'progress-ring-circle'
    );
    const r = circle.getAttribute('r');
    const expectedOffset =
      -(expectedPercentage / 100) * (parseInt(r, 10) * 2 * Math.PI);
    expect(circle.style.strokeDashoffset).toBe(`${expectedOffset}`);
  });
});
