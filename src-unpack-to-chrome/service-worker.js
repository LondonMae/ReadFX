async function sendDataToServer(selectedText, test) {
  var serverEndpoint = ""
  console.log(test)
  if (test == "summarize") {
       serverEndpoint = 'http://127.0.0.1:8000/api/get_wiki_summary/';
  }
  else if (test == "keywords") {
       serverEndpoint = 'http://127.0.0.1:8000/api/get_wiki_keywords/';
  }

  console.log(selectedText);
  const response = await fetch(serverEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(selectedText),
  });

  var data = await response.json();
  console.log(data)
  return data
}



function stripHTML(x){
    x = x.replace(/[^\x00-\x7F]/g, "")
    x = x.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "\n").replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "\n")
    var t = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gi;
    x = x.replace(t, "")
    x = x.replace(t, '<a href="$&">$&</a>')
    return x
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'summarize-sentence',
    title: 'Summarize in side panel',
    contexts: ['all']
  });
});

let tabdata = ""

let loaded = false;
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
//When the context menu is invoked
chrome.contextMenus.onClicked.addListener(async(data, tab) => {
  //first open the side panel, wait for promise
  await chrome.sidePanel.open({ windowId: tab.windowId });
  tabdata = stripHTML(data.selectionText);

  if (loaded == true){


  chrome.runtime.sendMessage({
    name: 'summarize-sentence2',
    data: { value: "summarizing: " + tabdata }
  });

}


});





chrome.runtime.onMessage.addListener(async({ name, data }) => {
  if (name === 'loaded') {
    chrome.runtime.sendMessage({
      name: 'summarize-sentence2',
      data: { value: "summarizing: " + tabdata }
    });
    loaded = true;
  }

  if (name == "loaded2") {
  console.log(typeof tabdata)
  const temp = "summarize"
  const response =  await sendDataToServer(tabdata, temp);
  console.log("Back at client")
  console.log(response["summary"])

  // await sleep(3000)
  chrome.runtime.sendMessage({
    name: 'summarize-sentence',
    data: { value: response["summary"] }
  });
}

  if (name === 'bold_text') {

    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    var response = await chrome.tabs.sendMessage(tab.id, "get_document");
    response = stripHTML(response)
    response =  await sendDataToServer(response, "keywords");

    // chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    //   chrome.scripting.executeScript({
    //     target: { tabId: tabs[0].id },
    //     func: bold_text,
    //     args: [response.summary],
    //   });
    // });
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

chrome.runtime.onConnect.addListener(function (port) {
  if (port.name === 'mySidepanel') {
    port.onDisconnect.addListener(async () => {
      loaded = false
    });
  }
});
