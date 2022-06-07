/* eslint-disable no-undef */

// Note about dates: month is 0-indexed
const today = new Date(2022, 2, 14);
const tomorrow = new Date(2022, 2, 15);
const nextWeek = new Date(2022, 2, 22);
const weekPlusDay = new Date(2022, 2, 23);
const nextMonth = new Date(2022, 3, 14);

describe('Timer/stats integration tests', () => {
  beforeEach(() => {
    cy.clock(today);
    cy.visit('http://127.0.0.1:5501/timer-page/timer.html');
  });

  it('Run pomo today', () => {
    runWorkSession(today);
    runShortBreak(today);
    continueWork();
    runWorkSession(today);
    runShortBreak(today);
    continueWork();
    runWorkSession(today);
    runShortBreak(today);
    continueWork();
    runWorkSession(today);
    runLongBreak(today);
    continueWork();
    runWorkSession(today);
    runShortBreak(today);
    continueWork();
    runWorkSession(today);
    runShortBreak(today);
    continueWork();
    runWorkSession(today);
    runShortBreak(today);
    continueWork();
    switchToStats();
    checkStats([
      '7',
      '0.0',
      '100.00%',
      '7',
      '0.0',
      '100.00%',
      '7',
      '0.0',
      '100.00%',
    ]);
  });

  it('Test one distraction today', () => {
    distractedWorkSession(today);
    switchToStats();
    checkStats([
      '1',
      '1.0',
      '100.00%',
      '1',
      '1.0',
      '100.00%',
      '1',
      '1.0',
      '100.00%',
    ]);
  });

  it('Fail one pomo session today', () => {
    runWorkSession(today);
    runShortBreak(today);
    continueWork();
    failedWorkSession(today);
    switchToStats();
    checkStats([
      '1',
      '0.0',
      '50.00%',
      '1',
      '0.0',
      '50.00%',
      '1',
      '0.0',
      '50.00%',
    ]);
  });

  it('Run pomo yesterday', () => {
    runWorkSession(today);
    runShortBreak(today);
    cy.get('timer-buttons').shadow().find('#change-btn').click();
    cy.clock().invoke('restore');
    cy.clock(tomorrow);
    switchToStats();
    checkStats(['0', '0', '0%', '1', '0.0', '100.00%', '1', '0.0', '100.00%']);
  });

  it('Run complex pomo yesterday', () => {
    runWorkSession(today);
    runShortBreak(today);
    continueWork();
    distractedWorkSession(today);
    runShortBreak(today);
    continueWork();
    failedWorkSession();
    cy.clock().invoke('restore');
    cy.clock(tomorrow);
    switchToStats();
    checkStats(['0', '0', '0%', '2', '0.3', '66.67%', '2', '0.3', '66.67%']);
  });

  it('Run pomo a week ago', () => {
    runWorkSession(today);
    runShortBreak(today);
    continueWork();
    runWorkSession(today);
    runShortBreak(today);
    continueWork();
    runWorkSession(today);
    runShortBreak(today);
    cy.get('timer-buttons').shadow().find('#change-btn').click();
    cy.clock().invoke('restore');
    cy.clock(nextWeek);
    switchToStats();
    checkStats(['0', '0', '0%', '0', '0', '0%', '3', '0.0', '100.00%']);
  });

  it('Run pomo over more than one day', () => {
    runWorkSession(today);
    runShortBreak(today);
    cy.get('timer-buttons').shadow().find('#change-btn').click();
    cy.clock().invoke('restore');
    cy.clock(nextWeek);
    cy.get('header-comp').shadow().find('button[title="Go to Timer"]').click();
    runWorkSession(nextWeek);
    runShortBreak(nextWeek);
    cy.get('timer-buttons').shadow().find('#change-btn').click();
    cy.clock().invoke('restore');
    cy.clock(weekPlusDay);
    cy.get('header-comp').shadow().find('button[title="Go to Timer"]').click();
    runWorkSession(weekPlusDay);
    runShortBreak(weekPlusDay);
    cy.get('timer-buttons').shadow().find('#change-btn').click();
    switchToStats();
    checkStats([
      '1',
      '0.0',
      '100.00%',
      '2',
      '0.0',
      '100.00%',
      '3',
      '0.0',
      '100.00%',
    ]);
  });

  it('Run pomo thirty days ago', () => {
    runWorkSession(today);
    runShortBreak(today);
    cy.get('timer-buttons').shadow().find('#change-btn').click();
    cy.clock().invoke('restore');
    cy.clock(nextMonth);
    switchToStats();
    checkStats(['0', '0', '0%', '0', '0', '0%', '0', '0', '0%']);
  });
});

/* Helper functions */

function switchToStats() {
  cy.get('header-comp').shadow().find('button[title="Go to Stats"]').click();
}

function runWorkSession(date) {
  cy.get('timer-buttons').shadow().find('.start-button').click();
  cy.get('timer-buttons').shadow().find('#create-skip').click();
  cy.tick(1500000);
  cy.tick(2000);
  cy.clock().invoke('restore');
  cy.wait(2000);
  cy.clock(date);
}

function continueWork() {
  cy.get('timer-buttons').shadow().find('#continue-btn').click();
}

function runShortBreak(date) {
  cy.get('timer-buttons').shadow().find('#break-button').click();
  cy.tick(3000000);
  cy.tick(2000);
  cy.clock().invoke('restore');
  cy.wait(2000);
  cy.clock(date);
}

function runLongBreak(date) {
  cy.get('timer-buttons').shadow().find('#break-button').click();
  cy.tick(9000000);
  cy.tick(2000);
  cy.clock().invoke('restore');
  cy.wait(2000);
  cy.clock(date);
}

function distractedWorkSession(date) {
  cy.get('timer-buttons').shadow().find('.start-button').click();
  cy.get('timer-buttons').shadow().find('#create-skip').click();
  cy.tick(700000);
  cy.get('timer-buttons').shadow().find('#distraction-btn').click();
  cy.tick(800000);
  cy.tick(2000);
  cy.clock().invoke('restore');
  cy.wait(2000);
  cy.clock(date);
}

function failedWorkSession() {
  cy.get('timer-buttons').shadow().find('.start-button').click();
  cy.get('timer-buttons').shadow().find('#create-skip').click();
  cy.tick(700000);
  cy.get('timer-buttons').shadow().find('.fail-button').click();
  cy.get('timer-buttons').shadow().find('#fail-button').click();
}

function checkStats(expected) {
  for (let i = 0; i < 3; i++) {
    cy.get('stats-row')
      .eq(i)
      .find('stats-card[stat-type="completed"]')
      .shadow()
      .find('#stat')
      .then(($el) => {
        expect($el).to.have.text(expected[3 * i]);
      });

    cy.get('stats-row')
      .eq(i)
      .find('stats-card[stat-type="distractions"]')
      .shadow()
      .find('#stat')
      .then(($el) => {
        expect($el).to.have.text(expected[3 * i + 1]);
      });

    cy.get('stats-row')
      .eq(i)
      .find('stats-card[stat-type="success"]')
      .shadow()
      .find('#stat')
      .then(($el) => {
        expect($el).to.have.text(expected[3 * i + 2]);
      });
  }
}
