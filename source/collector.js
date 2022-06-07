/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js';
import {
  collection,
  getFirestore,
  addDoc,
  doc,
  setDoc,
} from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBjvad4RH1m4V4MyeBdCUr8PIfi04MkF-w',
  authDomain: 'pomodoro-timer-c1a2a.firebaseapp.com',
  projectId: 'pomodoro-timer-c1a2a',
  storageBucket: 'pomodoro-timer-c1a2a.appspot.com',
  messagingSenderId: '171220856895',
  appId: '1:171220856895:web:1fcf38ee095fcfcb93c88a',
  measurementId: 'G-8XG1RFRDCV',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Used to store user activity
let activity = {};

document.addEventListener('DOMContentLoaded', init);

/**
 * Initialize the cookie generate, actiity dispatch, and the data sending system
 */
function init() {
  generateCookies();
  dispatchActivity();
  sendDataInterval();
}

/**
 * Generates a cookie to act as a session id for the activity.
 * @returns 1 if a cookie was generated and 0 if one was already present.
 */
function generateCookies() {
  const isCookiePresent = document.cookie.indexOf('session=');
  if (isCookiePresent === -1) {
    let randomNumber = Math.random().toString();
    randomNumber = randomNumber.substring(2, randomNumber.length);
    document.cookie = `session=${randomNumber}`;
    activity.session = randomNumber;
    return 1;
  }
  return 0;
}

/**
 * Gets the values of a given cookie.
 * @param {String} cname The name of the cookie being gotten.
 * @returns The value of the cookie if it is found, otherwise an emptry string.
 */
function getCookie(cname) {
  const name = `${cname}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

/**
 * Adds an event listener to the activity of the user which stores info to be
 * sent when triggered.
 */
function dispatchActivity() {
  const activityEvent = new Event('activity');

  activity.mouseClicks = [];
  document.addEventListener('click', (event) => {
    const click = {
      x: event.clientX,
      y: event.clientX,
    };
    activity.mouseClicks.push(click);
    document.dispatchEvent(activityEvent);
  });

  activity.pageName = window.location.host;

  document.addEventListener(
    'activity',
    () => {
      sessionStorage.setItem('activity', JSON.stringify(activity));
    },
    false
  );
}

/**
 * Sends the stored activity data to the firebase storage async.
 */
function sendDataInterval() {
  setInterval(async () => {
    activity = sessionStorage.getItem('activity');
    if (activity !== undefined) {
      const dataObj = JSON.parse(activity);
      if (getCookie('session') === '') {
        dataObj.session = generateCookies();
      } else {
        dataObj.session = getCookie('session');
      }
      try {
        if (sessionStorage.getItem('id')) {
          const refCollection = collection(db, 'analytics');
          await setDoc(
            doc(refCollection, sessionStorage.getItem('id')),
            dataObj
          );
        } else {
          const docRef = await addDoc(collection(db, 'analytics'), dataObj);
          sessionStorage.setItem('id', docRef.id);
        }
      } catch (e) {
        // Continue
      }
    }
  }, 5000);
}
