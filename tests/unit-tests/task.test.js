const {
  openModal,
  closeModal,
  eventCloseModal,
  openInfoModal,
  closeInfoModal,
  handleLoad,
  handleUnload,
  scrollFunc,
} = require('../../source/tasks-page/tasks');

describe('test task.js fucntions', () => {
  beforeEach(() => {
    document.body.innerHTML =
      '<body></body>' +
      '<div id = "test"> ' +
      '</div>' +
      '<button id="button" />' +
      '<div type="text" id="add-task-modal"></div>' +
      '<div type="text" class="add-task-btn"></div>' +
      '<div type="text" class="cancel-btn"></div>' +
      '<div type="text" class="close"></div>' +
      '<div type="text" id="play-modal"></div>' +
      '<div type="text" id="edit-modal"></div>' +
      '<div type="text" id="delete-modal"></div>' +
      '<div id = "info-modal"></div>' +
      '<task-list></task-list>' +
      '<task-list></task-list>';
  });

  test('test openModal', () => {
    handleLoad();
    openModal();
    expect(document.getElementById('add-task-modal').style.display).toBe(
      'block'
    );
  });

  test('test openInfoModal', () => {
    openInfoModal();
    expect(document.getElementById('info-modal').style.display).toBe('block');
  });

  test('test closeInfoModal', () => {
    closeInfoModal();
    expect(document.getElementById('info-modal').style.display).toBe('none');
  });

  test('test scrollFunc', () => {
    scrollFunc();
    expect(window.screenX).toBe(0);
    expect(window.screenY).toBe(0);
  });

  test('test closeModal', () => {
    handleLoad();
    closeModal();
    expect(document.getElementById('add-task-modal').style.display).toBe(
      'none'
    );
    expect(document.getElementById('play-modal').style.display).toBe('none');
    expect(document.getElementById('edit-modal').style.display).toBe('none');
    expect(document.getElementById('delete-modal').style.display).toBe('none');
  });

  test('test handleUnload', () => {
    handleUnload();
    expect(document.getElementsByTagName('task-list').length).toBe(1);
  });

  test('eventCloseModal', () => {
    const event = new Event('build');
    Object.defineProperty(eventCloseModal, 'target', {
      writable: false,
      value: '<div type="text" id="delete-modal"></div>',
    });
    eventCloseModal(event);
  });
});
