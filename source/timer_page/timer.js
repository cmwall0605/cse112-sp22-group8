/**
 * This file implements function that start the timer and allow for transitions between work and break sessions
 * It defines functions to update the progress ring and hold the distraction button count
 * The file also contains functions that deal with edge cases and display pop-ups in between transitions
 */
// number of distraction tracked
let distractCounter = 0;

let isFailed = false;
let isInSession = false;
let isReload = true;
// distinguish refresh or back button
let currentTaskId;
let allTasks;

let circle;
let radius;
let circumference;

// The interval function used for timer logic
let secondsInterval;

localStorage.setItem('TimerLength', 3);
localStorage.setItem('ShortBreakLength',2);
localStorage.setItem('LongBreakLength', 11);

// handle timing
window.onload = function template() {
  circle = document.getElementById('progress-ring-circle');
  const r = circle.getAttribute('r');
  // eslint-disable-next-line radix
  radius = parseInt(r);
  circumference = radius * 2 * Math.PI;

  circle.style.strokeDasharray = circumference;
  circle.style.strokeDashoffset = 0;
  // add event listeners for buttons on timer page
  document.getElementById('start-btn').addEventListener('click', startTimer);
  document
    .getElementById('distraction-btn')
    .addEventListener('click', distractionCount);
  document
    .getElementById('fail-btn')
    .addEventListener('click', displayFailModal);
  document
    .getElementById('start-short-btn')
    .addEventListener('click', startBreak);
  document
    .getElementById('start-long-btn')
    .addEventListener('click', startBreak);
  document
    .getElementById('continue-btn')
    .addEventListener('click', continueTask);
  document.getElementById('change-btn').addEventListener('click', changeTask);
  document.getElementById('fail-button').addEventListener('click', failSession);
  document
    .getElementById('cancel-button')
    .addEventListener('click', quitFailModal);
  // set variable denote current timer mode
  localStorage.setItem('isPomo', 'false');
  // render current task name to timer page
  const id = JSON.parse(localStorage.getItem('currentTask'));
  allTasks = JSON.parse(localStorage.getItem('allTasks'));
  for (let i = 0; i < allTasks.length; i++) {
    if (allTasks[i].id === id) {
      currentTaskId = i;
      document.getElementById('currTask').innerHTML =
        allTasks[currentTaskId].name;
    }
  }
  resetProgressRing();
  if (localStorage.getItem('ShortBreak') === 'true') {
    document.body.style.backgroundImage = 'linear-gradient(to right,#74EBD5,#ACB6E5)';

    renderTimer(localStorage.getItem('ShortBreakLength'), 0);

    document.getElementById('currTask').innerHTML = 'Short Break';
    document.getElementById('button-container').style.display = 'none';
    document.getElementById('container-short').style.display = 'block';
  } else if (localStorage.getItem('LongBreak') === 'true') {
    document.body.style.backgroundImage = 'linear-gradient(to right,#ACB6E5,#74EBD5)';
    
    renderTimer(localStorage.getItem('LongBreakLength'), 0);

    document.getElementById('currTask').innerHTML = 'Long Break';
    document.getElementById('button-container').style.display = 'none';
    document.getElementById('container-long').style.display = 'block';
  } else {
    localStorage.setItem('isPomo', 'false');
    document.getElementById(
      'distraction-btn'
    ).innerHTML = `Distraction : ${distractCounter}`;

    renderTimer(localStorage.getItem('TimerLength'), 0);
    document.getElementById('start-btn').style.display = 'block';
    document.getElementById('button-container').style.paddingLeft = '0px';
  }
  // render starting value of timer

  /* Show fail on back */
  window.history.pushState(null, document.title, window.location.href);
  window.addEventListener('popstate', () => {
    if (isFailed) {
      displayFailModal();
    } else {
      window.history.back();
    }
  });
};

/**
 * Change the style of current timer circle.
 * @param {float} percent percentage of current progress bar.
 */
function setProgress(percent) {
  circle = document.getElementById('progress-ring-circle');
  const r = circle.getAttribute('r');
  // eslint-disable-next-line radix
  const radiust = parseInt(r);
  const circumferencet = radiust * 2 * Math.PI;

  const offset = (percent / 100) * circumferencet;
  document.getElementById(
    'progress-ring-circle'
  ).style.strokeDashoffset = -offset;
}

/**
 * Reset progress ring percentage to 0
 */
function resetProgressRing() {
  circle.style.strokeDashoffset = 0;
}

/**
 * Display break complete modal, and sound.
 */
function displayBreakComplete() {
  const audio = new Audio('../media/break-tune.mp3');
  audio.play();
  document.getElementById('breakCompleteModal').style.display = 'block';
}

/**
 * Continue on current task, start another pomo.
 */
function continueTask() {
  document.getElementById('breakCompleteModal').style.display = 'none';
  document.body.style.backgroundImage =
    'linear-gradient(to right,#E0EAFC,#CFDEF3)';
  document.getElementById('currTask').innerHTML = 'Task';
  document.getElementById('button-container').style.display = 'flex';
  document.getElementById('start-btn').style.display = 'block';
  document.getElementById('button-container').style.paddingLeft = '0px';
  resetProgressRing();
  document.getElementById(
    'distraction-btn'
  ).innerHTML = `Distraction : ${distractCounter}`;
  renderTimer(localStorage.getItem('TimerLength'), 0);
  document.getElementById('currTask').innerHTML = allTasks[currentTaskId].name;

  localStorage.setItem(
    'todayPomo',
    Number(localStorage.getItem('todayPomo')) + 1
  );
}

/**
 * Change the current task, go back to task page.
 */
function changeTask() {
  document.getElementById('breakCompleteModal').style.display = 'none';
  window.location.href = '../index.html';
}

/**
 * display short break page, play sound and change appearance of website.
 */
function displayBreak() {
  const audio1 = new Audio('../media/work-tune.mp3');
  audio1.play();
  setTimeout(() => {
    resetProgressRing();
    console.log(localStorage.getItem('ShortBreak'));
    if(localStorage.getItem('ShortBreak') === 'true'){
      document.body.style.backgroundImage = 'linear-gradient(to right,#74EBD5,#ACB6E5)';
      document.getElementById('container-short').style.display = 'block';
      document.getElementById('currTask').innerHTML = 'Short Break';
      renderTimer(localStorage.getItem('ShortBreakLength'), 0);
    }
    else {
      document.body.style.backgroundImage = 'linear-gradient(to right,#ACB6E5,#74EBD5)';
      document.getElementById('container-long').style.display = 'block';
      document.getElementById('currTask').innerHTML = 'Long Break';
      renderTimer(localStorage.getItem('LongBreakLength'), 0);
    }
    document.getElementById('button-container').style.display = 'none';

  }, 2000);
}

/**
 * start counter for short break.
 */
function startBreak() {
  if(localStorage.getItem('ShortBreak') === 'true'){
    document.getElementById('container-short').style.display = 'none';
    start(localStorage.getItem('ShortBreakLength'), 0);
  }
  else {
    document.getElementById('container-long').style.display = 'none';
    start(localStorage.getItem('LongBreakLength'), 0);
  }
}

/**
 * Start the pomodoro timer for current task.
 */
function startTimer() {
  // enable distraction button during session
  const todayPomos = Number(localStorage.getItem('todayPomo'));
  localStorage.setItem('todayPomo', todayPomos + 1);

  document.getElementById('distraction-btn').disabled = false;
  isFailed = true;
  document.getElementById('start-btn').style.display = 'none';
  document.getElementById('button-container').style.paddingLeft = '150px';
  start(localStorage.getItem('TimerLength'), 0);
}

/**
 * Set a timer that count down for 60 second.
 * @param {integer} mins minute of timer
 * @param {integer} secs second of timer
 */
function start(mins, secs) {
  isInSession = true;
  const startTime = new Date();
  // display correct distraction counter
  distractCounter = 0;
  document.getElementById(
    'distraction-btn'
  ).innerHTML = `Distraction : ${distractCounter}`;

  const totalSeconds = mins * 60 + secs;
  //renderTimer(mins, secs);
  secondsInterval = setInterval(secondsTimer, 500, startTime, totalSeconds);
}

function secondsTimer(startTime, totalSeconds) {
  document.getElementById('header').isNewCycle = 'false';
  const currTime = new Date();
  const elapsed = Math.floor((currTime - startTime) / 1000);
  const timeLeft = totalSeconds - elapsed;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const perc = 100 - (timeLeft / totalSeconds) * 100;
  setProgress(perc);
  renderTimer(minutes, seconds);
  if (seconds === 0 && minutes <= 0) {
    console.log("Task finished");
    finishedTask();
  }
}

function renderTimer(minutes, seconds) {
  if (minutes < 10) {
    document.getElementById('minutes').innerHTML = `0${minutes}`;
  } else {
    document.getElementById('minutes').innerHTML = minutes;
  }
  if (seconds < 10) {
    document.getElementById('seconds').innerHTML = `0${seconds}`;
    document.getElementById('title_timer').innerHTML = `${minutes}:0${seconds}`;
  } else {
    document.getElementById('seconds').innerHTML = seconds;
    document.getElementById('title_timer').innerHTML = `${minutes}:${seconds}`;
  }
}

function finishedTask() {
  console.log("Finished tAsk");
  clearInterval(secondsInterval);
  let counter = Number(localStorage.getItem('sessionCounter'));
  counter += 1;
  let todayDistract = Number(localStorage.getItem('distractCounter'));
  todayDistract += distractCounter;
  const pomo = localStorage.getItem('isPomo');
  isInSession = false;
  // disable distraction button
  document.getElementById('distraction-btn').disabled = true;
  if (pomo === 'true') {
    // we just finished a break session
    localStorage.setItem('isPomo', 'false');
    // clear all circles for work session following longbreak
    if (localStorage.getItem('LongBreak') === 'true') {
      document.getElementById('header').isNewCycle = 'true';
    }

    localStorage.setItem('ShortBreak', 'false');
    localStorage.setItem('LongBreak', 'false');
    displayBreakComplete();
  } else {
    // we just finished a work session
    localStorage.setItem('isPomo', 'true');
    // hide the fail modal if the timer runs out
    document.getElementById('failModal').style.display = 'none';
    isFailed = false;
    if (counter % 4 === 0) {
      document.getElementById('header').completedCycles = counter;
      localStorage.setItem('sessionCounter', counter);
      localStorage.setItem('distractCounter', todayDistract);
      localStorage.setItem('LongBreak', 'true');
      localStorage.setItem('ShortBreak', 'false');
      displayBreak();
    } else {
      document.getElementById('header').completedCycles = counter;
      localStorage.setItem('sessionCounter', counter);
      localStorage.setItem('distractCounter', todayDistract);
      localStorage.setItem('ShortBreak', 'true');
      localStorage.setItem('LongBreak', 'false');
      displayBreak();
    }

    // update progress for current task
    allTasks[currentTaskId].current += 1;
    localStorage.setItem('allTasks', JSON.stringify(allTasks));
  }
}

/**
 * Used to increment distraction count.
 */
function distractionCount() {
  distractCounter += 1;
  document.getElementById(
    'distraction-btn'
  ).innerHTML = `Distraction : ${distractCounter}`;
}

/**
 * Display modal for fail.
 */
function displayFailModal() {
  isReload = false;
  document.getElementById('failModal').style.display = 'block';
}

/**
 * go back to task page because session is failed.
 */
function failSession() {
  document.getElementById('failModal').style.display = 'none';
  window.location.href = '../index.html';
}

/**
 * do not fail current task.
 */
function quitFailModal() {
  // keep session status active if they decide not to fail
  isReload = true;
  // add confirmation functionality to back button again
  window.history.pushState(null, document.title, window.location.href);
  document.getElementById('failModal').style.display = 'none';
}

// set the session state back to a work session
window.onbeforeunload = function WarnReload() {
  if (isInSession && isReload) {
    return 'Your timer progress will reset';
  }
};

if (typeof exports !== 'undefined') {
  module.exports = {
    setProgress,
    resetProgressRing,
    displayBreakComplete,
    continueTask,
    changeTask,
    startBreak,
    startTimer,
    start,
    distractionCount,
    displayFailModal,
    failSession,
    quitFailModal,
    displayBreak,
  };
}
