// global vars
let tabdata = "" // selected text
let loaded = false; // is side panel loaded?


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
});

//When the context menu is invoked
chrome.contextMenus.onClicked.addListener(async(data, tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId });
  tabdata = stripHTML(data.selectionText);

  // send selected text to sidepanel if loaded
  if (loaded == true){
    chrome.runtime.sendMessage({
      name: 'summarize-sentence2',
      data: { value: "summarizing: " + tabdata }
    });
  }
});

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

  if (name === 'save') {
    addToNotes(data);
  }

  if (name === 'write-notebook') {
    writeNotes(data);
  }
});


function addToNotes(text){
  chrome.storage.local.get(["notes"]).then((result)=>{
    console.log(result.notes)
    updated_notes = result.notes + text
    chrome.storage.local.set({notes: updated_notes})

    chrome.runtime.sendMessage({name: 'display-notes', data: updated_notes})
  })
}


function writeNotes(text){
  chrome.storage.local.remove(["notes"]).then(result=>console.log(result))
  console.log(text)
  chrome.storage.local.set({notes: text})
}

// when sidepanel closed set flag to false
chrome.runtime.onConnect.addListener(function (port) {
  if (port.name === 'mySidepanel') {
    port.onDisconnect.addListener(async () => {
      loaded = false
    });
  }
});
