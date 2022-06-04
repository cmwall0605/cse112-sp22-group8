/* eslint-disable no-undef */
describe('Overall testing', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:5501/timer-page/timer.html');
  });

  it('Check completed pomos today', () => {
    cy.clock();
    cy.get('timer-buttons').shadow().find('.start-button').click();
    cy.get('timer-buttons').shadow().find('#create-skip').click();
    cy.tick(1500000);
    cy.tick(2000);
    /*
    console.log('from cypress: ' + localStorage.getItem('todayPomo'));
    console.log('from cypress: ' + localStorage.getItem('sessionCounter'));
    console.log('from cypress: ' + localStorage.getItem('shortBreak'));
    cy.get('#currTask').then(($el) => {
      expect($el).to.have.text('Short Break');
    }); */
    // cy.get('header-comp').shadow().find('button[title="Go to Stats"]').click();
    /* 
    cy.get('stats-row').eq(0).find('stats-card[stat-type="completed"]').shadow().find('#stat').then(($el) => { 
      expect($el).to.have.text('1')
    });
  
    cy.get('timer-buttons').shadow().find('#break-button').click();
    cy.tick(300000);
    cy.tick(2000);
    cy.get('timer-buttons').shadow().find('#continue-btn').click();
    cy.get('timer-buttons').shadow().find('.start-button').click();
    cy.get('timer-buttons').shadow().find('#create-skip').click();
    cy.tick(1500000);
    cy.tick(2000);
    cy.get('timer-buttons').shadow().find('#break-button').click();
    cy.tick(300000);
    cy.tick(2000);
    cy.get('timer-buttons').shadow().find('#change-btn').click();
    cy.get('header-comp').shadow().find('button[title="Go to Stats"]').click();
    cy.tick(1);
    cy.get('stats-card[stat-type="completed"]').shadow().find('#stat').then(($el) => { 
      expect($el).to.have.text('2')});
      */
  });
});
