/**
 * This file defines the <timer-comp> web components and its functions,
 * also implements the behaviors of timer.
 */

/**
 * \<timer-comp\>
 *
 * This webcomponent controls the physical display of the timer. It increments
 * the appearance of the timer based on how much time remains, and also controls
 * whether the timer is visibily counting down or not.
 */
class TimerComp extends HTMLElement {
  /**
   * Returns the attributes of the timer-comp that are monitored
   * @type {string[]}
   */
  static get observedAttributes() {
    return ['data-minutes-left', 'data-seconds-left', 'data-running'];
  }

  /**
   * Constructor which attaches a shadow root to this element in open mode
   */
  constructor() {
    super();
    this.attachShadow({
      mode: 'open',
    });
  }

  /**
   * Sets the number of minutes remaining on timer
   * @type {string|number}
   */
  set dataMinutesLeft(newValue) {
    this.setAttribute('data-minutes-left', newValue);
  }

  /**
   * Gets the number of minutes remaining on timer
   * @type {string}
   */
  get dataMinutesLeft() {
    return this.getAttribute('data-minutes-left');
  }

  /**
   * Sets the number of seconds remaining on timer
   * @type {string|number}
   */
  set dataSecondsLeft(newValue) {
    this.setAttribute('data-seconds-left', newValue);
  }

  /**
   * Gets the number of seconds remaining on timer
   * @type {string}
   */
  get dataSecondsLeft() {
    return this.getAttribute('data-seconds-left');
  }

  /**
   * Sets whether timer is running
   * @type {string|boolean}
   */
  set dataRunning(newValue) {
    this.setAttribute('data-running', newValue);
  }

  /**
   * Gets whether timer is running
   * @type {string}
   */
  get dataRunning() {
    return this.getAttribute('data-running');
  }

  /**
   * Called when an attribute is changed. Triggers timer to start. Also
   * changes display of timer when minutesLeft or secondsLeft are changed.
   * @param {string} name name of the attribute being changed
   * @param {*} _ Value is not used, only exists to fit function template
   * @param {string|number} newValue new value of the attribute
   */
  attributeChangedCallback(name, _, newValue) {
    if (name === 'data-running') {
      if (newValue === 'true') {
        this.start();
      }
    } else if (name === 'data-minutes-left') {
      if (newValue < 10) {
        this.shadowRoot.getElementById('minutes').innerHTML = `0${newValue}`;
      } else {
        this.shadowRoot.getElementById('minutes').innerHTML = `${newValue}`;
      }
      this.resetProgressRing();
    } else if (name === 'data-seconds-left') {
      if (newValue < 10) {
        this.shadowRoot.getElementById('seconds').innerHTML = `0${newValue}`;
      } else {
        this.shadowRoot.getElementById('seconds').innerHTML = `${newValue}`;
      }
      this.resetProgressRing();
    }
  }

  /**
   * Called when the header is applied to the DOM; Sets up html, links css, and
   * sets initial timer ring display.
   */
  connectedCallback() {
    const timerContainer = document.createElement('div');
    timerContainer.setAttribute('class', 'container timer');

    const numberDisplay = document.createElement('span');
    numberDisplay.setAttribute('class', 'container');

    const minutes = document.createElement('p');
    minutes.setAttribute('id', 'minutes');

    const colon = document.createElement('p');
    colon.textContent = ':';

    const seconds = document.createElement('p');
    seconds.setAttribute('id', 'seconds');

    const progressRing = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg'
    );
    progressRing.setAttribute('class', 'progress-ring');
    progressRing.setAttribute('viewBox', '0 0 440 440');
    const progressRingCircle = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'circle'
    );
    progressRingCircle.setAttribute('id', 'progress-ring-circle');
    progressRingCircle.setAttribute('class', 'progress-ring-circle');
    progressRingCircle.setAttribute('stroke-width', '40');
    progressRingCircle.setAttribute('fill', 'transparent');
    progressRingCircle.setAttribute('r', '200');
    progressRingCircle.setAttribute('cx', '50%');
    progressRingCircle.setAttribute('cy', '50%');
    progressRingCircle.setAttribute('stroke', '#2E4756');

    timerContainer.appendChild(numberDisplay);
    numberDisplay.appendChild(minutes);
    numberDisplay.appendChild(colon);
    numberDisplay.appendChild(seconds);

    timerContainer.appendChild(progressRing);
    progressRing.appendChild(progressRingCircle);

    const styleSheet = document.createElement('link');
    styleSheet.rel = 'stylesheet';
    styleSheet.href = '/components/timer-comp/timer-comp.css';

    this.shadowRoot.appendChild(styleSheet);
    this.shadowRoot.appendChild(timerContainer);

    /* Set progress of timer */
    const r = progressRingCircle.getAttribute('r');
    const radius = parseInt(r, 10);
    const circumference = radius * 2 * Math.PI;
    progressRingCircle.style.strokeDasharray = circumference;
    progressRingCircle.style.strokeDashoffset = 0;
  }

  /**
   * Reset progress ring percentage to 0
   */
  resetProgressRing() {
    this.shadowRoot.getElementById(
      'progress-ring-circle'
    ).style.strokeDashoffset = 0;
  }

  /**
   * Change the style of current timer circle.
   * @param {number} percent percentage of current progress bar.
   */
  setProgress(percent) {
    const circle = this.shadowRoot.getElementById('progress-ring-circle');
    const r = circle.getAttribute('r');
    const radiust = parseInt(r, 10);
    const circumferencet = radiust * 2 * Math.PI;

    const offset = (percent / 100) * circumferencet;
    circle.style.strokeDashoffset = -offset;
  }

  /**
   * Start the timer countdown
   */
  start() {
    const startTime = new Date();
    const totalSeconds =
      Number(this.dataset.minutesLeft) * 60 + Number(this.dataset.secondsLeft);
    this.secondsInterval = setInterval(
      this.secondsTimer.bind(this),
      500,
      startTime,
      totalSeconds
    );
  }

  /**
   * The helper function used for setInterval() to achieve the dynamic timer functionality.
   * @param {number} startTime the start time for the timer
   * @param {number} totalSeconds the totally needed seconds for the timer to run
   */
  secondsTimer(startTime, totalSeconds) {
    const currTime = new Date();
    const elapsed = Math.floor((currTime - startTime) / 1000);
    const timeLeft = totalSeconds - elapsed;

    this.dataset.minutesLeft = Math.floor(timeLeft / 60);
    this.dataset.secondsLeft = timeLeft % 60;

    const finishedPercent = 100 - (timeLeft / totalSeconds) * 100;
    this.setProgress(finishedPercent);
    if (
      Number(this.dataset.secondsLeft) === 0 &&
      Number(this.dataset.minutesLeft <= 0)
    ) {
      this.stopTimer();
    }
  }

  /**
   * Stops the timer and prevents it from updating further.
   *
   * Called when the time remaining gets to 0.
   */
  stopTimer() {
    this.dataset.running = 'false';
    clearInterval(this.secondsInterval);
  }
}

customElements.define('timer-comp', TimerComp);

if (typeof exports !== 'undefined') {
  module.exports = {
    TimerComp,
  };
}
