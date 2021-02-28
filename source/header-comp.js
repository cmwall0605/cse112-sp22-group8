/**
 * This file defines the <header-comp> web components and its functions,
 * also implements the behaviors of header.
 */

/**
 * Method for creating Date object and get the local current Date
 * @return today's date
 */
const createDate = () => {
  const todayDate = new Date();
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return todayDate.toLocaleDateString('en-us', options);
};

/**
 * Method for creating styles for this component
 * @return the styles tag with css embedded code
 */
const headerStyle = () =>
  `<style>
  .dot {
    height: 10px;
    width: 10px;
    padding: 10px;
    margin-right: 5px;
    background-color: #e5e5e5;
    border-radius: 77%;
    border: 2px solid #ef7869;
    display: inline-block;
  }
  
  .filled-dot {
    height: 10px;
    width: 10px;
    padding: 10px;
    margin-right: 5px;
    background-color: #f2998e;
    border-radius: 77%;
    border: 2px solid #ef7869;
    display: inline-block;
  }
  
  .top-nav {
    background: #2e4756;
    margin: 0;
    padding-top: 1%;
    padding-left: 50px;
    padding-bottom: 5px;
    width: 100%;
    color: #e5e5e5;
    font-size: 24px;
  }
  
  h2 {
    margin-top: 0;
    display: inline; 
    color:#C4C4C4;
    font-size: 1.5em;
    text-align: left;
    font-weight: bold;
    font-family: "Poppins", sans-serif;
  }
  
  </style>`;

/**
 * HeaderComp is the web component of custom header;
 * this represents the current date and completed cycles count
 */
class HeaderComp extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({
      mode: 'open',
    });
    this.completed = localStorage.getItem('sessionCounter');
    this.count = 4 - this.completed;
    const nav = document.createElement('nav');
    nav.setAttribute('class', 'top-nav');
    const date = document.createElement('h2');
    date.innerText = createDate() ? createDate() : `Today's date`;
    const section = document.createElement('section');
    section.setAttribute('id', 'cycle-count');
    section.innerHTML = `      
  <span>
    <h2 id="completed-cycle" style="display: inline; color: #c4c4c4">
      | Not yet completed
    </h2>
  </span>`;

    nav.appendChild(date);
    nav.appendChild(section);
    shadow.innerHTML = headerStyle();
    shadow.appendChild(nav);
  }

  get completedCycles() {
    return this.completed;
  }

  get cycleCount() {
    return this.count;
  }

  // the browser calls this method when an element is added to the document
  connectedCallback() {
    renderCounter(this);
    renderCompletedCount(this);
    renderText(this);
  }
}
customElements.define('header-comp', HeaderComp);

/**
 * create unfilled circle for cycles
 * @param {object} elem the class object that it belongs to
 */
function renderCounter(elem) {
  const shadow = elem.shadowRoot;
  for (let i = 0; i < elem.cycleCount; i++) {
    const newCycle = document.createElement('span');
    newCycle.setAttribute('class', 'dot');
    shadow.getElementById('cycle-count').prepend(newCycle);
  }
}

/**
 * create filled circle for completed cycles
 * @param {object} elem the class object that it belongs to
 */
function renderCompletedCount(elem) {
  for (let i = 0; i < elem.completedCycles; i++) {
    const newCycle = document.createElement('span');
    newCycle.setAttribute('class', 'filled-dot');
    elem.shadowRoot.getElementById('cycle-count').prepend(newCycle);
  }
}

/**
 * Render the text shown on header
 * @param {object} elem the class object that it belongs to
 */
function renderText(elem) {
  const cycleText = elem.shadowRoot.getElementById('completed-cycle');
  cycleText.innerText = `| Completed Cycles: ${elem.completedCycles}`;
}
