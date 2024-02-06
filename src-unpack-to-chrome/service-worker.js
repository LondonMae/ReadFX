async function sendDataToServer(selectedText) {
  const serverEndpoint = 'http://127.0.0.1:8000/api/get_wiki_summary/';
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
//When the context menu is invoked
chrome.contextMenus.onClicked.addListener(async(data, tab) => {
  //first open the side panel, wait for promise
  const opened = await chrome.sidePanel.open({ windowId: tab.windowId });
  tabdata = stripHTML(data.selectionText);

  chrome.runtime.sendMessage({
    name: 'summarize-sentence',
    data: { value: "summarizing: " + tabdata }
  });

  console.log(typeof tabdata)

  const response =  await sendDataToServer(tabdata);
  console.log("Back at client")
  console.log(response["summary"])
  
  chrome.runtime.sendMessage({
    name: 'summarize-sentence',
    data: { value: response["summary"] }
  });

});

function bold_text(word){
  //text_elements = document.getElementsByTagName('p') + document.getElementsByTagName('span')
  text_elements = [
    document.getElementsByTagName('p'), 
    document.getElementsByTagName('h1'), 
    document.getElementsByTagName('h2'), 
    document.getElementsByTagName('h3'), 
    document.getElementsByTagName('h4'), 
    document.getElementsByTagName('h5'),
    document.getElementsByTagName('span')
  ]
  re = "(" + word + ")"
  re = new RegExp(re)
  for(ele of text_elements){
    for(p of ele){
        p.innerHTML = p.innerHTML.replace(re, "<b>$1</b>")
    }
  }
}

chrome.runtime.onMessage.addListener(({ name, data }) => {
  if (name === 'loaded') {
    chrome.runtime.sendMessage({
      name: 'summarize-sentence',
      data: { value: "summarizing: " + tabdata }
    });
  }
  if (name === 'bold_text') {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: bold_text,
        args: [ data.value], //please change this to reflect the words given by the model
      });
    });
    
  }
});


