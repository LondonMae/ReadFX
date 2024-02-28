// Saves options to chrome.storage
const saveOptions = () => {
  const notes = document.getElementsByClassName('notes_body')[0].innerText;

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
        const regex = /.*/m;
        m = regex.exec(items.notes)
        document.getElementsByClassName('notes_title')[0].value = m
        document.getElementsByClassName('notes_body')[0].innerText = items.notes
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

