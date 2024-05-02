const notes_body = document.getElementsByClassName("notes_body")[0];
const notes_title = document.getElementsByClassName("notes_title")[0];
const regex = /(?<=#)[a-zA-Z0-9]+/m;
const sidebar = document.getElementById("notes-container");
POST_URL_NOTES = "http://10.20.34.125:5000/notes";
GET_URL_NOTES = "http://10.20.34.125:5000/users/user_id/notes";
DELETE_URL_NOTES = "http://10.20.34.125:5000/users/user_id/notes/header";

var idx;
var n;
let cursor;

var nameList = [
  "Time",
  "Past",
  "Future",
  "Dev",
  "Fly",
  "Flying",
  "Soar",
  "Soaring",
  "Power",
  "Falling",
  "Fall",
  "Jump",
  "Cliff",
  "Mountain",
  "Rend",
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Gold",
  "Demon",
  "Demonic",
  "Panda",
  "Cat",
  "Kitty",
  "Kitten",
  "Zero",
  "Memory",
  "Trooper",
  "XX",
  "Bandit",
  "Fear",
  "Light",
  "Glow",
  "Tread",
  "Deep",
  "Deeper",
  "Deepest",
  "Mine",
  "Your",
  "Worst",
  "Enemy",
  "Hostile",
  "Force",
  "Video",
  "Game",
  "Donkey",
  "Mule",
  "Colt",
  "Cult",
  "Cultist",
  "Magnum",
  "Gun",
  "Assault",
  "Recon",
  "Trap",
  "Trapper",
  "Redeem",
  "Code",
  "Script",
  "Writer",
  "Near",
  "Close",
  "Open",
  "Cube",
  "Circle",
  "Geo",
  "Genome",
  "Germ",
  "Spaz",
  "Shot",
  "Echo",
  "Beta",
  "Alpha",
  "Gamma",
  "Omega",
  "Seal",
  "Squid",
  "Money",
  "Cash",
  "Lord",
  "King",
  "Duke",
  "Rest",
  "Fire",
  "Flame",
  "Morrow",
  "Break",
  "Breaker",
  "Numb",
  "Ice",
  "Cold",
  "Rotten",
  "Sick",
  "Sickly",
  "Janitor",
  "Camel",
  "Rooster",
  "Sand",
  "Desert",
  "Dessert",
  "Hurdle",
  "Racer",
  "Eraser",
  "Erase",
  "Big",
  "Small",
  "Short",
  "Tall",
  "Sith",
  "Bounty",
  "Hunter",
  "Cracked",
  "Broken",
  "Sad",
  "Happy",
  "Joy",
  "Joyful",
  "Crimson",
  "Destiny",
  "Deceit",
  "Lies",
  "Lie",
  "Honest",
  "Destined",
  "Bloxxer",
  "Hawk",
  "Eagle",
  "Hawker",
  "Walker",
  "Zombie",
  "Sarge",
  "Capt",
  "Captain",
  "Punch",
  "One",
  "Two",
  "Uno",
  "Slice",
  "Slash",
  "Melt",
  "Melted",
  "Melting",
  "Fell",
  "Wolf",
  "Hound",
  "Legacy",
  "Sharp",
  "Dead",
  "Mew",
  "Chuckle",
  "Bubba",
  "Bubble",
  "Sandwich",
  "Smasher",
  "Extreme",
  "Multi",
  "Universe",
  "Ultimate",
  "Death",
  "Ready",
  "Monkey",
  "Elevator",
  "Wrench",
  "Grease",
  "Head",
  "Theme",
  "Grand",
  "Cool",
  "Kid",
  "Boy",
  "Girl",
  "Vortex",
  "Paradox",
];

function generate() {
  var finalName = nameList[Math.floor(Math.random() * nameList.length)];
  document.getElementById("user_id").value = finalName;
}

async function test() {
  n = await chrome.storage.local.get("notes");

  idx = lunr(async function () {
    console.log("in search");
    this.field("title");
    this.field("body");

    console.log("testing search ");
    var london = n["notes"];
    var id = 0;
    for (note in london) {
      console.log(london[note]);
      this.add({
        title: london[note]["title"],
        body: london[note]["body"],
        id: london[note]["title"],
      });
      id += 1;
    }
  });
  console.log(n);

  console.log("after notes");

  return idx;
}

const ENTER_KEY_CODE = 13;
var search_bar = document.getElementById("search-bar");
search_bar.addEventListener("keyup", function (e) {
  if (e.keyCode === ENTER_KEY_CODE) {
    var val = search_bar.value;
    search_func(val);
  }
});

async function search_func(val) {
  idx = await test();
  await n;
  console.log(n);
  var indexes;
  var res = idx.search(val);
  console.log(res);
  sidebar.innerHTML = "";
  for (note in res) {
    console.log(res[note]["ref"]);
    new_n = res[note]["ref"];
    update_n(new_n);
  }
}

function update_n(new_n) {
  let note_tab = document.createElement("div");
  note_tab.innerHTML = note_tab_temp.replace("$", new_n);
  note_tab.children[0].addEventListener("click", () => {
    deletenote(new_n);
  });
  note_tab.classList.add("notelink");
  //        note_tab.innerText = n;
  note_tab.addEventListener("click", () => {
    switchNotes(new_n);
  });
  sidebar.appendChild(note_tab);
}

console.log(idx);
// console.log(idx.search("science"));

// Saves options to chrome.storage
const saveOptions = () => {
  notes_body.innerHTML = notes_body.innerHTML
    .replaceAll(/&gt;/g, ">")
    .replaceAll(/&lt;/g, "<");
  let notePage = {
    body: notes_body.innerHTML,
    title: notes_title.innerHTML,
  };
  chrome.storage.local.get("notes", (n) => {
    if (Object.keys(n).length == 0) {
      chrome.storage.local.set({ notes: {} });
    }
    n["notes"][notePage["title"]] = notePage;
    chrome.storage.local.set({ notes: n["notes"] }, () => {
      // Update status to let user know options were saved.
      //
      const status = document.getElementById("status");
      status.textContent = "Notes saved.";
    });
    update_noteslist();
  });
};

chrome.runtime.onMessage.addListener(({ name, data }) => {
  if (name === "test") console.log(data);
});

// Switch notes with google chrome storage
const switchNotes = (title) => {
  console.log(title);
  chrome.storage.local.get("notes").then((items) => {
    let selected_note = items["notes"][title];
    m = regex.exec(items.notes);
    document.getElementsByClassName("notes_title")[0].innerHTML =
      selected_note.title;
    document.getElementsByClassName("notes_body")[0].innerHTML =
      selected_note.body;
  });
};
// Switch notes with db
const switchNotesDB = (title, user_id) => {
  let url = GET_URL_NOTES.replace("user_id", user_id.toString());
  console.log(title);
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };
  fetch(url, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      result.forEach((item) => {
        /*         let selected_note = items["notes"][title]; */
        /*         m = regex.exec(items.notes); */
        /*         console.log(m); */
        console.log("Header is: ", item.header);
        console.log("title is: ", title);
        if (item.header == title) {
          document.getElementsByClassName("notes_title")[0].innerHTML =
            item.header;
          document.getElementsByClassName("notes_body")[0].innerHTML =
            item.content;
        }
      });
      console.log(result);
    });
};

let note_tab_temp = `
  $
  <button class="delete-button">-</button>
`;
const hashto8 = (user_name) => {
  let num = "";
  for (let c in user_name) {
    console.log("user character is: ", c);
    num += c.charCodeAt(0);
  }
  num = num.substring(0, 8);
  return parseInt(num);
};

const deletenote = (title) => {
  console.log("delete" + title);
  chrome.storage.local.get("notes").then((items) => {
    let selected_note = items["notes"][title];
    console.log(items);

    // Send DELETE request to db
    header = items["notes"][title]["title"];
    console.log("note header is: ", header);
    var user_id = document.getElementById("user_id").value;
    user_id = hashto8(user_id);
    let url = DELETE_URL_NOTES.replace("user_id", user_id.toString());
    console.log("url before replace header", url);
    url = url.replace("header", header.toString());
    console.log("url is:", url);

    const requestOptions = {
      method: "DELETE",
      redirect: "follow",
    };

    fetch(url, requestOptions)
      .then((response) => response.json()) // Parse response as JSON
      .then((result) => {
        console.log(result);
      })
      .catch((error) => console.error(error));
    delete items["notes"][title];
    chrome.storage.local.set({ notes: items["notes"] });
    update_noteslist();
  });
};

const update_noteslist = () => {
  sidebar.innerHTML = "";
  chrome.storage.local.get(["notes"]).then((notes) => {
    for (let n in notes["notes"]) {
      console.log(n);
      let note_tab = document.createElement("div");
      note_tab.innerHTML = note_tab_temp.replace("$", n);
      note_tab.querySelector(".delete-button").addEventListener("click", () => {
        deletenote(n);
      });
      note_tab.classList.add("notelink");
      // note_tab.innerText = n;
      note_tab.addEventListener("click", () => {
        switchNotes(n);
      });
      sidebar.appendChild(note_tab);
    }
  });
};

const push_notes = (user_id) => {
  user_id = hashto8(user_id);
  console.log("invoke chrome storage");
  chrome.storage.local.get("notes").then((e) => {
    let notes = e.notes;
    let keys = Object.keys(notes);
    for (let k of keys) {
      console.log(notes[k]);
      title = notes[k]["title"];
      body = notes[k]["body"];
      data = { user_id: user_id, note_header: title, note_content: body };
      console.log("data is ", data);
      postData(POST_URL_NOTES, data);
    }
  });
};

const pull_notes = (user_id) => {
  user_id = hashto8(user_id);
  sidebar.innerHTML = "";
  console.log("reached pull notes");
  console.log("user_id is:  ", user_id.toString());
  let url = GET_URL_NOTES.replace("user_id", user_id.toString());
  console.log(url);

  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  fetch(url, requestOptions)
    .then((response) => response.json()) // Parse response as JSON
    .then((result) => {
      console.log("DB Results data stored in Chrome storage");

      let notes = {};

      result.forEach((item) => {
        let nobj = {
          title: item.header,
          body: item.content,
        };
        notes[item.header] = nobj;

        let note_tab = document.createElement("div");
        note_tab.innerHTML = note_tab_temp.replace("$", item.header);
        note_tab.children[0].addEventListener("click", () => {
          deletenote(item.header);
        });

        note_tab.classList.add("notelink");
        note_tab.addEventListener("click", () => {
          switchNotesDB(item.header, user_id);
        });
        sidebar.appendChild(note_tab);
      });
      console.log("-------");
      console.log(notes);
      chrome.storage.local
        .set({ notes: notes }, () => {})
        .catch((error) => console.error(error));
    });
};

async function postData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restoreOptions = () => {
  update_noteslist();
  chrome.storage.local.get(["notes"]).then((items) => {
    console.log("deleteing notes");
    if (Object.keys(items).length == 0) {
      chrome.storage.local.set({
        notes: {
          Notes: {
            title: "Notes",
            body: "notes go here",
          },
        },
      });
    }
    m = items["notes"][Object.getOwnPropertyNames(items["notes"])[0]];
    console.log(m);
    document.getElementsByClassName("notes_title")[0].innerHTML = m.title;
    document.getElementsByClassName("notes_body")[0].innerHTML = m.body;
  });
};

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("save-button").addEventListener("click", saveOptions);
let noteslist = document.getElementsByClassName("notelink");
for (let n of noteslist) {
  n.addEventListener("click", () => {
    switchNotes(n.innerHTML);
  });
}

document.addEventListener(
  "keydown",
  function (e) {
    if (document.getElementsByClassName("highlight-links").length > 0) {
      document.getElementsByClassName("highlight-links")[0].remove();
    }
    if (
      e.keyCode === 83 &&
      (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)
    ) {
      e.preventDefault();
      saveOptions();
    }
    if (
      e.keyCode === 191 &&
      (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)
    ) {
      let popup = document.createElement("div");
      popup.innerHTML = "Highlight <br>";
      popup.style.position = "absolute";
      let range = window.getSelection().getRangeAt(0).getBoundingClientRect();
      cursor = range;
      popup.style.top = range.y + "px";
      popup.style.left = range.x + "px";
      popup.classList.add("highlight-links");
      document.body.appendChild(popup);
      listHighlights();
    }
    prevKeyCode = e.keyCode;
  },
  false,
);

let closed = true;
document.getElementById("toggle-button").addEventListener("click", () => {
  if (closed) {
    sidebar.parentElement.classList.add("sidebar-closed");
    sidebar.parentElement.classList.remove("sidebar-open");
    closed = false;
  } else {
    sidebar.parentElement.classList.remove("sidebar-closed");
    sidebar.parentElement.classList.add("sidebar-open");
    closed = true;
  }
});
document.getElementById("add-note-button").addEventListener("click", () => {
  //changes only the html
  notes_body.innerHTML = "";
  notes_title.innerHTML = "";
  notes_title.focus();
  update_noteslist();
});

document.getElementById("user_id").addEventListener("click", () => {
  var content = document.getElementById("user_id");
  content.textContent = "";
});

function jump_to_highlight(url) {
  window.location.href = url;
}

// Gernerate id which is 8 characters long
document.getElementById("generate_id").addEventListener("click", () => {
  var finalName = nameList[Math.floor(Math.random() * nameList.length)];
  // console.log("invoke generate_id");
  // var id = Math.floor(10000000 + Math.random() * 90000000);
  /*       alert("invoke generated ID"); */
  // document.getElementById("uNameInput").value = finalName;
  var content = document.getElementById("user_id");
  content.value = finalName;
});

// Invoke push button
document.getElementById("push_button").addEventListener("click", () => {
  console.log("invoke push");
  var user_id = document.getElementById("user_id").value;
  console.log("user is is   ", user_id);
  push_notes(user_id);
});

// Invoke pull button
document.getElementById("pull_button").addEventListener("click", () => {
  console.log("invoke pull");
  var user_id = document.getElementById("user_id").value;
  console.log("user is is   ", user_id);
  pull_notes(user_id);
});

function add_link(h, highlight_colors) {
  if (document.getElementsByClassName("highlight-links").length > 0) {
    document.getElementsByClassName("highlight-links")[0].remove();
  }

  let link_ele = document.createElement("div");
  link_ele.style.borderColor = highlight_colors[h.color.match("[0-9]")[0]];
  link_ele.value = h.url;
  const regex = /(?<=https:\/\/)[a-z.]+(?=\/)/gm;
  link_ele.innerHTML =
    "<a class='full-url' href='" +
    h.url +
    "'>" +
    h.url +
    "</a>" +
    '<div>"' +
    h.text +
    '"</div>';
  link_ele.addEventListener("click", (e) => {
    console.log(e);
    e.preventDefault();
    jump_to_highlights(h.url);
  });
  link_ele.classList.add("highlight-link-embed");
  link_ele.value = h.url;
  link_ele.contentEditable = false;
  console.log(h.url);
  document.getElementsByClassName("notes_body")[0].appendChild(link_ele);
  document.getElementsByClassName("notes_body")[0].innerHTML += "<br>";
}

function listHighlights() {
  let highlight_colors = [];
  console.log("show highlights");
  let colors = document.getElementsByClassName("highlight_color");
  chrome.storage.local.get(["colors"]).then((e) => {
    try {
      console.log(e.colors);
    } catch {
      e.colors = ["#ba75ff", "#00ff88", "#d07676", "#81c1fd"];
      chrome.storage.local.set({ colors: colors });
    }
    highlight_colors = e.colors;
    for (let i = 0; i < colors.length; i++) {
      colors[i].value = e.colors[i];
    }
  });

  let list = document.getElementsByClassName("highlight-links")[0];
  list.innerHTML = "";

  chrome.storage.local.get(["highlights"]).then((result) => {
    for (let w in result.highlights) {
      console.log(w);
      for (let h of result.highlights[w]) {
        let link_ele = document.createElement("div");
        link_ele.style.background = highlight_colors[h.color.match("[0-9]")[0]];
        const regex = /(?<=https:\/\/)[a-z.]+(?=\/)/gm;
        link_ele.innerHTML =
          "<a href='" +
          h.url +
          "'>" +
          regex.exec(h.url) +
          "</a>" +
          "<div>" +
          h.text +
          "</div>";
        let button = document.createElement("button");
        button.innerText = "X";
        button.classList.add("delete-button");
        button.addEventListener("click", (e) => {
          console.log(e);
          deletehighlight(h);
        });
        link_ele.appendChild(button);
        link_ele.classList.add("highlight-link");
        link_ele.addEventListener("click", () => {
          add_link(h, highlight_colors);
        });
        list.appendChild(link_ele);
      }
    }
  });
}
