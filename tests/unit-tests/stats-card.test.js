const { StatsCard } = require('../../source/components/stats-card/stats-card');

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

describe('Stats Card Test function', () => {
  beforeEach(() => {
    document.body.innerHTML =
      '<div id = "test"> ' +
      '</div>' +
      '<button id="button" />' +
      '<input type="text" id="task-name">' +
      '<input type="text" id="task-num">' +
      '<input type="text" id="task-note">';
  });

  test('Test getContent statType == completed', () => {
    // Create Element
    const statCards = document.createElement('stats-card');
    statCards.setAttribute('stat-type', 'completed');

    // Call getContent
    const { srcUrl, altText, imgWidth, imgHeight, stat, cardTitle } =
      statCards.getContent();

    // Expect check attribute
    expect(srcUrl).toBe('/assets/images/check.png');
    expect(altText).toBe('checkmark symbol indicating completed pomos');
    expect(imgWidth).toBe('40');
    expect(imgHeight).toBe('39');
    expect(stat).toBe(0);
    expect(cardTitle).toBe('completed pomos');
  });

  test('Test getContent statType == distractions', () => {
    // Create Element
    const statCards = document.createElement('stats-card');
    statCards.setAttribute('stat-type', 'distractions');

    // Call getContent
    const { srcUrl, altText, imgWidth, imgHeight, stat, cardTitle } =
      statCards.getContent();

    // Expect check attribute
    expect(srcUrl).toBe('/assets/images/warning.png');
    expect(altText).toBe(
      'warning symbol indicating average distractions per pomo'
    );
    expect(imgWidth).toBe('39');
    expect(imgHeight).toBe('38');
    expect(stat).toBe('0');
    expect(cardTitle).toBe('average distractions per pomo');
  });

  test('Test getContent statType == success', () => {
    // Create Element
    const statCards = document.createElement('stats-card');
    statCards.setAttribute('stat-type', 'success');

    // Call getContent
    const { srcUrl, altText, imgWidth, imgHeight, stat, cardTitle } =
      statCards.getContent();

    // Expect check attribute
    expect(srcUrl).toBe('/assets/images/star.png');
    expect(altText).toBe('star symbol indicating pomo success rate');
    expect(imgWidth).toBe('39');
    expect(imgHeight).toBe('39');
    expect(stat).toBe('0%');
    expect(cardTitle).toBe('pomo success rate');
  });

  test('Test Reset', () => {
    const allStats = [];
    const statsItem1 = {
      id: '123456',
      day: 1,
      pomoCount: 0,
      distractions: 0,
      completedPomos: 0,
    };

    const statsItem2 = {
      id: 'dfsdjak',
      day: 1,
      pomoCount: 1,
      distractions: 1,
      completedPomos: 1,
    };
    allStats.push(statsItem1);
    allStats.push(statsItem2);
    // Create Element
    const statCards = document.createElement('stats-card');
    statCards.setAttribute('stat-type', 'completed');
    document.getElementById('test').appendChild(statCards);
    localStorage.setItem('statsList', JSON.stringify(allStats));

    // Call reset
    statCards.reset();

    // Expect check attribute
    expect(statCards.shadowRoot.getElementById('stat').textContent).toBe('0');
  });
});
