const { StatsRow } = require('../../source/components/stats-row/stats-row');

describe('Stats Row test Constructor', () => {
  beforeEach(() => {
    document.body.innerHTML =
      '<div id = "test"> ' +
      '</div>' +
      '<button id="button" />' +
      '<input type="text" id="task-name">' +
      '<input type="text" id="task-num">' +
      '<input type="text" id="task-note">';
  });

  test('Test constructor stat-length === 1', () => {
    // Create Element
    const statsRow = document.createElement('stats-row');
    const statCards = document.createElement('stats-card');
    statCards.setAttribute('stat-length', '1');
    statsRow.appendChild(statCards);
    document.getElementById('test').appendChild(statsRow);

    // Expect check
    expect(statsRow.shadowRoot.querySelector('link').rel).toBe('stylesheet');
    expect(statsRow.shadowRoot.querySelector('link').href).toBe(
      'http://localhost/components/stats-row/stats-row.css'
    );
    expect(statsRow.shadowRoot.querySelector('h2').innerHTML).toBe('Today');
  });

  test('Test constructor stat-length !== 1', () => {
    // Create Element
    const statsRow = document.createElement('stats-row');
    const statCards = document.createElement('stats-card');
    statCards.setAttribute('stat-length', '2');
    statsRow.appendChild(statCards);
    document.getElementById('test').appendChild(statsRow);

    // Expect check
    expect(statsRow.shadowRoot.querySelector('link').rel).toBe('stylesheet');
    expect(statsRow.shadowRoot.querySelector('link').href).toBe(
      'http://localhost/components/stats-row/stats-row.css'
    );
    expect(statsRow.shadowRoot.querySelector('h2').innerHTML).toBe(
      'Last 2 Days'
    );
  });
});
