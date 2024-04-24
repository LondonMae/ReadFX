// global vars
let tabdata = "" // selected text
let loaded = false; // is side panel loaded?

String.prototype.hashCode = function() {
  var hash = 0,
    i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
}

// requests to Flask server
async function sendDataToServer(selectedText, test) {
  var serverEndpoint = "http://127.0.0.1:8000/v0/"

  // summarize text
  if (test == "summarize") {
       serverEndpoint += 'summary';
  }
  // extract keywords
  else if (test == "keywords") {
       serverEndpoint += 'keywords';
  }

  else if (test == "similarity") {
       serverEndpoint += 'similarity';
  }

  // POST request data as JSON
  const response = await fetch(serverEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(selectedText),
  });

  // wait to return until data recieved
  var data = await response.json();
  return data
}

// helper function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// regex formatting
function stripHTML(x){
    x = x.replace(/[^\x00-\x7F]/g, " ")
    // x = x.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "\n").replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "\n")
    // var t = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gi;
    // x = x.replace(t, " ")
    // x = x.replace(t, '<a href="$&">$&</a>')
    x = x.replace(/[0-9]+/g, " ")
    x = x.replace(/\s*\(.*?\)\s*/g, " ")
    x = x.replace(/\s*\[.*?\]\s*/g, " ")
    x = x.replace(/-/g, " ")
    x = x.replace(/"/g, " ")
    console.log(x)
    return x
}

// this creates a menu option to summarize text
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'summarize-sentence',
    title: 'Summarize in side panel',
    contexts: ['all']
  });
  chrome.contextMenus.create({
    id: 'highlight',
    title: 'Highlight sentence',
    contexts: ['all']
  });
});
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));
  
chrome.action.onClicked.addListener((tab) => {
  
  chrome.sidePanel.open({ windowId: tab.windowId });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"]
  });
});

//When the context menu is invoked
chrome.contextMenus.onClicked.addListener(async(data, tab) => {

  if(data.menuItemId == "highlight"){
    console.log("highlight")
   chrome.runtime.sendMessage({
     name: 'highlight',
     data: { value: "hightlighting: " + tabdata }
   });
 }

  if (data.menuItemId == "summarize-sentence") {
  chrome.sidePanel.open({ windowId: tab.windowId });
  tabdata = stripHTML(data.selectionText);
  // send selected text to sidepanel if loaded
  if (loaded == true){
    console.log("summary");
    chrome.runtime.sendMessage({
      name: 'summarize-sentence2',
      data: { value: "summarizing: " + tabdata }
    });
  }
}
});

function get_highlights(highlights){
  highlights.forEach((h)=>{
    console.log(h.url, window.location.href)
    if(h.url == window.location.href){
      let range = document.createRange()
      let ele = document.querySelector(h.query)
      console.log(ele)
      console.log(h.headindex, h.tailindex)
      range.setStart(ele.childNodes[0], h.headindex)
      range.setEnd(ele.childNodes[0], h.tailindex)


      selection = window.getSelection()
      selection.addRange(range)
      txt = range.cloneContents().childNodes[0].data

      console.log(txt)

      re = "(" + txt + ")"
      re = new RegExp(re)
      highlight.query = jsPath(ele)
      ele.innerHTML = ele.innerHTML.replace(re, "<mark>$1</mark>")
    }
  })
}

// new tab is opened
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab)=>{
  chrome.storage.local.get(["highlights"], (items)=>{
    let highlight;
    try{
      highlight = items.highlights[tab.url.hashCode()]
    }catch{
      return
    }
    if(highlight != undefined){
      if(tab.status == "complete"){
        chrome.storage.local.get(["colors"], (items)=>{
          chrome.tabs.sendMessage(tabId, { name: 'set_color', data: items.colors})
        })
        chrome.tabs.sendMessage(tabId, { name: 'show_highlights', data: items.highlights});
      }
    }
  })
})


// listen for messages from other files
chrome.runtime.onMessage.addListener(async({ name, data }) => {
  // when sidepanel loaded, send selected text data
  if (name == "font") {
    console.log("fonts")
  }

  if (name == "similarity") {
    let requestTy = "similarity"
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    var doc = await chrome.tabs.sendMessage(tab.id, "get_docs");
    console.log(JSON.stringify(doc));
    let response =  await sendDataToServer(doc, requestTy);
    console.log(JSON.parse(response["summary"]))
    var doc = await chrome.tabs.sendMessage(tab.id, ["similarities", JSON.parse(response["summary"])]);
  }

  if (name === 'loaded') {
    chrome.runtime.sendMessage({
      name: 'summarize-sentence2',
      data: { value: "summarizing: " + tabdata }
    });
    // mark loaded flag
    loaded = true;
  }

  // when initial text loaded in sidepanel
  if (name == "init-sp") {
    let requestTy = "summarize"
    let response =  await sendDataToServer(tabdata, requestTy);
    console.log("Back at client")

    // send summary to sidepanel
    chrome.runtime.sendMessage({
      name: 'summarize-sentence',
      data: { value: response["summary"] }
    });
  }

  // bold keywords
  if (name === 'bold_text') {
    console.log("here");
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    var response = await chrome.tabs.sendMessage(tab.id, "get_document");
    response = stripHTML(response)
    response =  await sendDataToServer(response, "keywords");
    var response = await chrome.tabs.sendMessage(tab.id, ["extract keywords", response.summary]);
  }

  if (name === 'save' || name === 'write_notebook') {
    addToNotes(data);
  }

  if(name === 'highlight_text') {
    console.log(data)
    saveHighlight(data)
  }

  if(name === 'show_highlights'){
    console.log("show highlights")
  }

});


function addToNotes(note){
  console.log(note)
  let text = note.body
  let title = note.title
  
  chrome.storage.local.get(["notes"]).then((result)=>{
    console.log(result.notes)
    let updated_notes = result.notes[title] = {
      "title": title,
      "body": text
    }
    result.notes[title] = updated_notes
    chrome.storage.local.set({notes: result.notes})
  })

}


function saveHighlight(highlight){
  chrome.storage.local.get(["highlights"]).then((result)=>{
    let new_highlights = result.highlights
    if(Object.keys(result).length == 0){
      chrome.storage.local.set({"highlights": {}})
    }
    let key = highlight.url.hashCode();
    console.log(key);
    if (new_highlights[key] == undefined) {new_highlights[key] = []}
    new_highlights[key].push(highlight);

    chrome.storage.local.set({highlights: new_highlights})
  })
}

function clear_all_highlights(){
  chrome.storage.local.set({highlights:{}})
}

// when sidepanel closed set flag to false
chrome.runtime.onConnect.addListener(function (port) {
  if (port.name === 'mySidepanel') {
    port.onDisconnect.addListener(async () => {
      loaded = false
    });
  }
});
