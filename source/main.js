/**
 * This file defines functions and implements the behaviors for pop-up modals 
 * and other Modals for the main page.
 */

///////// SECTION for Modals////////
// Get the modal
let modal = document.getElementById("add-task-modal");
let playModal = document.getElementById("play-modal");
let taskContent = document.getElementById("task-name");

// Get the button that opens the modal
let btns = document.getElementsByClassName("add-task-btn");
let cancelBtns = document.getElementsByClassName("cancel-btn");


// Get the <span> element that closes the modal
let spanClose = document.getElementsByClassName("close");

//add event listeners
for (let i = 0; i < spanClose.length; ++i) {
  spanClose[i].addEventListener("click", closeModal);
  cancelBtns[i].addEventListener("click", closeModal);

}


for (let i = 0; i < btns.length; ++i) {
  btns[i].addEventListener("click", displayAddModal);
}


function scrollFunc() {
  window.scrollTo(0, 0);
}


// When the user clicks the button, open the modal 
function displayAddModal() {
  modal.style.display = "block";
}

/**
 * Section for Play Modal
 */
function displayPlayModal() {
  playModal.style.display = 'block';
}

function showModalTask(element) {
  const parentList = element.closest('li')
  const targetP = element.closest("li").getElementsByTagName('p')
  document.getElementById('timer-name').innerText = targetP[0].innerHTML



}




// When the user clicks on <span> (x), close the modal
function closeModal() {
  modal.style.display = "none";
  playModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}