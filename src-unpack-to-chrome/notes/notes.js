// Saves options to chrome.storage
const saveOptions = () => {
  let notes_body =document.getElementsByClassName('notes_body')[0]; 
  notes_body.innerHTML = notes_body.innerHTML.replaceAll(/&gt;/g, ">").replaceAll(/&lt;/g, "<")
  const notes = document.getElementsByClassName('notes_body')[0].innerHTML;
  
  chrome.storage.local.set(
    { notes: notes},
    () => {
      // Update status to let user know options were saved.
      const status = document.getElementById('status');
      status.textContent = 'Notes saved.';
      setTimeout(() => {
        status.textContent = '';
      }, 750);
    }
  );
};

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restoreOptions = () => {
  chrome.storage.local.get(["notes"]).then(
    (items) => {
        const regex = /(?<=#)[a-zA-Z0-9]+/m;
        m = regex.exec(items.notes)
        document.getElementsByClassName('notes_title')[0].value = m
        document.getElementsByClassName('notes_body')[0].innerHTML = items.notes
    }
  );
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save-button').addEventListener('click', saveOptions);


document.addEventListener("keydown", function(e) {
  if (e.keyCode === 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
    e.preventDefault();
    saveOptions();
  }
}, false);


let closed = true;
document.getElementById("toggle-button").addEventListener("click", ()=>{
  if(closed){
    document.getElementsByClassName("sidebar")[0].classList.add("sidebar-closed")
    document.getElementsByClassName("sidebar")[0].classList.remove("sidebar-open")
    closed = false;
  }else{
    document.getElementsByClassName("sidebar")[0].classList.remove("sidebar-closed")
    document.getElementsByClassName("sidebar")[0].classList.add("sidebar-open")
    closed = true;
  }
})