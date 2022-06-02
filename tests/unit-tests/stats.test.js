const { resetStats } = require('../../source/stats-page/stats');

const ONE_DAY = 1000 * 60 * 60 * 24;

const todaysDate = new Date();

const dates = [];

for (let i = 0; i < 100; i++) {
  const date = new Date(todaysDate - ONE_DAY * i).toLocaleDateString('en-US');
  dates.push(JSON.stringify(date));
}

// Stat list used to mock previous sessions

const statsListArray = [
  {
    day: dates[1],
    pomoCount: 2,
    distractions: 5,
    completedPomos: 2,
  },
  {
    day: dates[2],
    pomoCount: 2,
    distractions: 5,
    completedPomos: 2,
  },
  {
    day: dates[3],
    pomoCount: 2,
    distractions: 5,
    completedPomos: 2,
  }, // longer than 7 days
  {
    day: dates[10],
    pomoCount: 2,
    distractions: 5,
    completedPomos: 0,
  },
  {
    day: dates[11],
    pomoCount: 2,
    distractions: 5,
    completedPomos: 2,
  },
  {
    day: dates[12],
    pomoCount: 2,
    distractions: 5,
    completedPomos: 2,
  },
  {
    day: dates[13],
    pomoCount: 2,
    distractions: 5,
    completedPomos: 2,
  },
  {
    day: dates[14],
    pomoCount: 2,
    distractions: 5,
    completedPomos: 2,
  },
  {
    day: dates[15],
    pomoCount: 2,
    distractions: 5,
    completedPomos: 2,
  },
  {
    day: dates[16],
    pomoCount: 2,
    distractions: 5,
    completedPomos: 2,
  },
  // more than 31 day
  {
    day: dates[99],
    pomoCount: 2,
    distractions: 50,
    completedPomos: 2,
  },
];

// Variables used in the mock.
const statsList = JSON.stringify(statsListArray);
const currentDate = new Date();
const lastVisit = JSON.stringify(currentDate.toLocaleDateString('en-US'));
const todayPomo = '2';
const distractCount = '2';
const sessionCount = '2';

// Local storage mock.
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

document.body.innerHTML =
  '<div id="info-modal" class="modal"></div>' +
  '<p id="todayPomos">0</p>' +
  '<p id="todayAvgDistractions">0</p>' +
  '<p id="todaySuccess">0%</p>' +
  '<p id="weekPomos">0</p>' +
  '<p id="weekAvgDistractions">0</p>' +
  '<p id="weekSuccess">0%</p>' +
  '<p id="monthPomos">0</p>' +
  '<p id="monthAvgDistractions">0</p>' +
  '<p id="monthSuccess">0%</p>' +
  '<header-comp id="header"></header-comp>';

describe('"resetStats" Function Test', () => {
  test('Test to see if the stats are reset after function', () => {
    resetStats();
    expect(localStorage.getItem('sessionCounter')).toBe('0');
    expect(localStorage.getItem('todayPomo')).toBe('0');
    expect(localStorage.getItem('distractCounter')).toBe('0');
  });
});
