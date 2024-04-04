const notes_body = document.getElementsByClassName('notes_body')[0];
const notes_title = document.getElementsByClassName('notes_title')[0];
const regex = /(?<=#)[a-zA-Z0-9]+/m;
const sidebar = document.getElementById("notes-container");

const idx = lunr(function () {
  console.log("this is a notes test")
	this.field("title")
	this.field("description")

  this.add({
    "title": "Philosophy of Science",
    "description": "Einstein's own philosophy of science is an original synthesis of elements drawn from sources as diverse as neo Kantianism, conventionalism, and logical empiricism. Einstein s relations with and influence on other prominent twentieth century philosophers of science, including Moritz Schlick, Hans Reichenbach, Ernst Cassirer.",
    "author": "Albert Einstein",
    "id": "1"
  })

  this.add({
    "title": "Quantum Mechanics",
    "description": "Quantum systems have bound states that are quantized to discrete values of energy, momentum, angular momentum, and other quantities. Measurements of quantum systems show characteristics of both particles and waves. Most theories in classical physics can be derived from quantum mechanics as an approximation valid at large scale.",
    "author": "Wiki",
    "id": "2"
  })

})

console.log(idx)
console.log(idx.search("science"))
// Saves options to chrome.storage
const saveOptions = () => {
  notes_body.innerHTML = notes_body.innerHTML.replaceAll(/&gt;/g, ">").replaceAll(/&lt;/g, "<")
  let notePage = {
    body: notes_body.innerHTML,
    title: notes_title.innerHTML
  }
  chrome.storage.local.get("notes", (n)=>{
    n["notes"][notePage["title"]] = notePage
    chrome.storage.local.set({notes: n["notes"]},
    () => {
      // Update status to let user know options were saved.
      const status = document.getElementById('status');
      status.textContent = 'Notes saved.';
      setTimeout(() => {
        status.textContent = '';
      }, 750);
    })
  });
  update_noteslist()
};

// Switch notes
const switchNotes = (title) => {
  console.log(title)
  chrome.storage.local.get("notes").then(
    (items) => {
      let selected_note = items["notes"][title];
        m = regex.exec(items.notes)
        document.getElementsByClassName('notes_title')[0].innerHTML = selected_note.title
        document.getElementsByClassName('notes_body')[0].innerHTML = selected_note.body
    }
  );
};

let note_tab_temp = `
  $
  <button class="delete-button">x</button>
`

const deletenote = (title)=>{
  console.log("delete"+ title )
  chrome.storage.local.get("notes").then(
  (items) => {
      let selected_note = items["notes"][title];
      console.log(items)
      delete items["notes"][title]
      chrome.storage.local.set({notes: items["notes"]} )
      update_noteslist()
    }
  );
}

const update_noteslist = ()=>{
  sidebar.innerHTML = ""
  chrome.storage.local.get(["notes"]).then(
    (notes) => {

      for (let n in notes["notes"]){
        console.log(n)
        let note_tab = document.createElement("div");
        note_tab.innerHTML = note_tab_temp.replace('$', n);
        note_tab.children[0].addEventListener('click', ()=>{
          deletenote(n)
        })
        note_tab.classList.add("notelink");
//        note_tab.innerText = n;
        note_tab.addEventListener('click', () => {switchNotes(n)});
        sidebar.appendChild(note_tab);

      }
    })

}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restoreOptions = () => {
  update_noteslist()
  chrome.storage.local.get(["notes"]).then(
    (items) => {
      m = items["notes"][Object.getOwnPropertyNames(items["notes"])[0]]
      console.log(m)
      document.getElementsByClassName('notes_title')[0].innerHTML = m.title;
      document.getElementsByClassName('notes_body')[0].innerHTML = m.body;
    }
  );
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save-button').addEventListener('click', saveOptions);
let noteslist = document.getElementsByClassName('notelink');
for (let n of noteslist){
  n.addEventListener('click', () => {switchNotes(n.innerHTML)});
}


document.addEventListener("keydown", function(e) {
  if (e.keyCode === 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
    e.preventDefault();
    saveOptions();
  }
}, false);


let closed = true;
document.getElementById("toggle-button").addEventListener("click", ()=>{
  if(closed){
    sidebar.parentElement.classList.add("sidebar-closed")
    sidebar.parentElement.classList.remove("sidebar-open")
    closed = false;
  }else{
    sidebar.parentElement.classList.remove("sidebar-closed")
    sidebar.parentElement.classList.add("sidebar-open")
    closed = true;
  }
})
document.getElementById("add-note-button").addEventListener("click", ()=>{
  //changes only the html
  notes_body.innerHTML = "";
  notes_title.innerHTML = "";
  notes_title.focus();
  update_noteslist();
})
