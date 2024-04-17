const notes_body = document.getElementsByClassName('notes_body')[0];
const notes_title = document.getElementsByClassName('notes_title')[0];
const regex = /(?<=#)[a-zA-Z0-9]+/m;
const sidebar = document.getElementById("notes-container");

var idx;
var n;
async function test() {
  n = await chrome.storage.local.get("notes")

  idx = lunr( async function () {
    console.log("in search")
    this.field("title")
    this.field("body")

      console.log("testing search ")
      var london = n["notes"]
      var id = 0;
      for (note in london) {
        console.log(london[note]);
        this.add(
          {"title": london[note]["title"],
          "body": london[note]["body"],
          "id": london[note]["title"]
        })
        id += 1;
          }
  })
  console.log(n)

  console.log("after notes")


  return idx
}




const ENTER_KEY_CODE = 13;
var search_bar = document.getElementById('search-bar');
search_bar.addEventListener('keyup', function(e) {
  if (e.keyCode === ENTER_KEY_CODE) {
    var val = search_bar.value;
    search_func(val)
  }
});


async function search_func(val) {
  idx = await test()
  await n;
  console.log(n)
  var indexes;
  var res = idx.search(val)
  console.log(res)
  sidebar.innerHTML = ""
  for (note in res) {
    console.log(res[note]["ref"])
    new_n = res[note]["ref"]
    update_n(new_n)
  }


}

function update_n(new_n) {
  let note_tab = document.createElement("div");
  note_tab.innerHTML = note_tab_temp.replace('$', new_n);
  note_tab.children[0].addEventListener('click', ()=>{
    deletenote(new_n)
  })
  note_tab.classList.add("notelink");
//        note_tab.innerText = n;
  note_tab.addEventListener('click', () => {switchNotes(new_n)});
  sidebar.appendChild(note_tab);
}


// Saves options to chrome.storage
const saveOptions = () => {
  notes_body.innerHTML = notes_body.innerHTML.replaceAll(/&gt;/g, ">").replaceAll(/&lt;/g, "<")
  let notePage = {
    body: notes_body.innerHTML,
    title: notes_title.innerHTML
  }
  chrome.storage.local.get("notes", (n)=>{
    if(Object.keys(n).length == 0){
      chrome.storage.local.set({"notes": {}})
    }
    n["notes"][notePage["title"]] = notePage
    chrome.storage.local.set({notes: n["notes"]},
    () => {
      // Update status to let user know options were saved.
      const status = document.getElementById('status');
      status.textContent = 'Notes saved.';

    })
    update_noteslist()
  });
};

chrome.runtime.onMessage.addListener(({ name, data }) => {
    if (name === 'test')
      console.log(data)
});

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
  <button class="delete-button">-</button>
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
        note_tab.querySelector(".delete-button").addEventListener('click', ()=>{
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
      if(Object.keys(items).length == 0){
        chrome.storage.local.set({"notes": {
          "Notes": {
            "title": "Notes",
            "body": "notes go here"
          }}})
      }
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


let prevKeyCode = 0;
document.addEventListener("keydown", function(e) {
    if (document.getElementsByClassName('highlight-links').length > 0){
        document.getElementsByClassName('highlight-links')[0].remove()
    }
  if (e.keyCode === 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
    e.preventDefault();
    saveOptions();
  }
  if (e.keyCode === 191 && prevKeyCode === 191){
    let popup = document.createElement("div");
    popup.innerHTML = "Highlight <br>"
    popup.style.position = "absolute"
    let range = window.getSelection().getRangeAt(0).getBoundingClientRect()
    popup.style.top =  range.x + "px";
    popup.style.left = range.y + "px";
    popup.classList.add("highlight-links")
    document.body.appendChild(popup)
    listHighlights()

  }
  prevKeyCode = e.keyCode
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


function add_link(h, highlight_colors){

  let link_ele = document.createElement('div');
  console.log(h.color.match('[0-9]')[0])
  link_ele.style.background = highlight_colors[h.color.match('[0-9]')[0]]
  const regex = /(?<=https:\/\/)[a-z.]+(?=\/)/gm;
  link_ele.innerHTML = "<a href='" + h.url + "'>" + regex.exec(h.url) + "</a>" + "<div>" + h.text + "</div>";
  let button = document.createElement("button");
  button.innerText = "X"
  button.classList.add("delete-button");
  button.addEventListener("click", (e)=>{
      console.log(e)
      deletehighlight(h)
  })
  link_ele.appendChild(button);
  link_ele.classList.add('highlight-link');
  link_ele.addEventListener('click', ()=>{
      jump_to_highlights()
  })
  document.getElementsByClassName("notes_body")[0].appendChild(link_ele)
  document.getElementsByClassName("notes_body")[0].innerHTML += "<br>"
}

function listHighlights(){
    let highlight_colors = [];
    console.log("show highlights")
    let colors = document.getElementsByClassName("highlight_color")
    chrome.storage.local.get(["colors"]).then((e)=>{
        try{
          console.log(e.colors)
        }catch{
          e.colors = [ "#ba75ff","#00ff88","#d07676","#81c1fd"]
          chrome.storage.local.set({"colors": colors})
        }
        highlight_colors = e.colors
        for(let i = 0; i < colors.length; i++){
            colors[i].value = e.colors[i]
        }
    })

    let list = document.getElementsByClassName("highlight-links")[0];
    list.innerHTML = ""

    chrome.storage.local.get(["highlights"]).then((result)=>{
        for(let w in result.highlights){
            console.log(w);
            for(let h of result.highlights[w]){
                let link_ele = document.createElement('div');
                console.log(h.color.match('[0-9]')[0])
                link_ele.style.background = highlight_colors[h.color.match('[0-9]')[0]]
                const regex = /(?<=https:\/\/)[a-z.]+(?=\/)/gm;
                link_ele.innerHTML = "<a href='" + h.url + "'>" + regex.exec(h.url) + "</a>" + "<div>" + h.text + "</div>";
                let button = document.createElement("button");
                button.innerText = "X"
                button.classList.add("delete-button");
                button.addEventListener("click", (e)=>{
                    console.log(e)
                    deletehighlight(h)
                })
                link_ele.appendChild(button);
                link_ele.classList.add('highlight-link');
                link_ele.addEventListener('click', ()=>{
                    add_link(h, highlight_colors)
                })
                list.appendChild(link_ele)

            }
        }
    })
}
