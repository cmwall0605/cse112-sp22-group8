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
const activity = {};
document.addEventListener('DOMContentLoaded', init);

/**
 * Initialize the analytics.
 */
function init() {
  generateCookies();
  dispatchActivity();
  sendDataInterval();
}

/**
 * Generates a session cookie with a randomly generated session ID.
 * @returns 1 If a cookie was made, 0 if the cookie already existed.
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
 * Gets the given cookie's value.
 * @param {String} cname Name of the cookie whose value we are getting.
 * @returns The value of the cookie
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
 * Gathers info about the page naem and window screen size. Sets up the event
 * listener for mouse clicks.
 */
async function dispatchActivity() {
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

  activity.pageName = window.location.pathname;
  activity.window = [window.screen.width, window.screen.height];

  document.addEventListener(
    'activity',
    () => {
      sessionStorage.setItem('activity', JSON.stringify(activity));
    },
    false
  );

  try {
    const docRef = await addDoc(collection(db, 'analytics'), activity);
    sessionStorage.setItem('id', docRef.id);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
}

function sendDataInterval() {
  setInterval(async () => {
    const storedActivity = sessionStorage.getItem('activity');
    if (storedActivity !== undefined) {
      const dataObj = JSON.parse(storedActivity);
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
        console.error('Error adding document: ', e);
      }
    }
  }, 5000);
}
