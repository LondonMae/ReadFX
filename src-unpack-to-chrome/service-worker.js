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
  var serverEndpoint = "http://127.0.0.1:8000/api/"

  // summarize text
  if (test == "summarize") {
       serverEndpoint += 'get_wiki_summary/';
  }
  // extract keywords
  else if (test == "keywords") {
       serverEndpoint += 'get_wiki_keywords/';
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
    x = x.replace(/[^\x00-\x7F]/g, "")
    x = x.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "\n").replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "\n")
    var t = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gi;
    x = x.replace(t, "")
    x = x.replace(t, '<a href="$&">$&</a>')
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

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"]
  });
});

//When the context menu is invoked
chrome.contextMenus.onClicked.addListener(async(data, tab) => {
  if(data.menuItemId == "highlight"){
    chrome.runtime.sendMessage({
      name: 'highlight',
      data: { value: "hightlighting: " + tabdata }
    });

  }else if (data.menuItemId == "summarize-sentence"){
    //first open the side panel, wait for promise
    chrome.sidePanel.open({ windowId: tab.windowId });
    tabdata = stripHTML(data.selectionText);
    
    // send selected text to sidepanel if loaded
    if (loaded == true){
      chrome.runtime.sendMessage({
        name: 'summarize-sentence2',
        data: { value: "summarizing: " + tabdata }
      });

    }

    const response =  await sendDataToServer(tabdata, "summarize");
    console.log("Back at client")
    console.log(response["summary"])

    chrome.runtime.sendMessage({
      name: 'summarize-sentence',
      data: { value: response["summary"] }
    });

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


// listen for messages from other files
chrome.runtime.onMessage.addListener(async({ name, data }) => {
  // when sidepanel loaded, send selected text data
  if (name === 'loaded') {
    chrome.runtime.sendMessage({
      name: 'summarize-sentence2',
      data: { value: "summarizing: " + tabdata }
    });
    // mark loaded flag
    loaded = true;

  chrome.storage.local.get(["notes"]).then((result)=>{
    let updated_notes = result.notes

    chrome.runtime.sendMessage({name: 'display-notes', data: updated_notes})
  })
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

    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    var response = await chrome.tabs.sendMessage(tab.id, "get_document");
    response = stripHTML(response)
    response =  await sendDataToServer(response, "keywords");
    var response = await chrome.tabs.sendMessage(tab.id, ["extract keywords", response.summary]);
  }

  if (name === 'save') {
    addToNotes(data);
  }

  if (name === 'write-notebook') {
    writeNotes(data);
  }
  if(name === 'highlight_text') {
    console.log(data)
    saveHighlight(data)
  }
  if(name === 'show_highlights'){
    console.log("show highlights")
   

    // chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    //   chrome.storage.local.get(["highlights"]).then((result)=>{
    //     //sconsole.log(result.highlights)
        
    //     chrome.scripting.executeScript({
    //       target: { tabId: tabs[0].id },
    //       func: get_highlights,
    //       args: [result.highlights], //please change this to reflect the words given by the model
    //     });

    //   });
    // }); 
  }
});


function addToNotes(text){
  chrome.storage.local.get(["notes"]).then((result)=>{
    console.log(result.notes)
    let updated_notes = result.notes + text
    chrome.storage.local.set({notes: updated_notes})

    chrome.runtime.sendMessage({name: 'display-notes', data: updated_notes})
  })
}


function writeNotes(text){
  chrome.storage.local.remove(["notes"]).then(result=>console.log(result))
  console.log(text)
  chrome.storage.local.set({notes: text})
}

function saveHighlight(highlight){
  chrome.storage.local.get(["highlights"]).then((result)=>{
    let new_highlights = result.highlights
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
