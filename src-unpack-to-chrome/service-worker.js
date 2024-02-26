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

let tabdata = ""
//When the context menu is invoked
chrome.contextMenus.onClicked.addListener(async(data, tab) => {
  console.log(data, tab)
  if(data.menuItemId == "highlight"){
    console.log(data)
    chrome.runtime.sendMessage({
      name: 'highlight',
      data: { value: "hightlighting: " + tabdata }
    });

  }else if (data.menuItemId == "summarize-sentence"){
    //first open the side panel, wait for promise
    const opened = await chrome.sidePanel.open({ windowId: tab.windowId });
    tabdata = stripHTML(data.selectionText);

    chrome.runtime.sendMessage({
      name: 'summarize-sentence',
      data: { value: "summarizing: " + tabdata }
    });

    console.log(typeof tabdata)

    const response =  await sendDataToServer(tabdata, "summarize");
    console.log("Back at client")
    console.log(response["summary"])
    
    chrome.runtime.sendMessage({
      name: 'summarize-sentence',
      data: { value: response["summary"] }
    });
  }
});


async function bold_text(word, wordlist){


  words = word.split("/")
  if (words.length < 2) {
    return
  }
  // catch errors

  //text_elements = document.getElementsByTagName('p') + document.getElementsByTagName('span')
  text_elements = [
    document.getElementsByTagName('p'),
    // document.getElementsByTagName('h1'),
    // document.getElementsByTagName('h2'),
    // document.getElementsByTagName('h3'),
    // document.getElementsByTagName('h4'),
    // document.getElementsByTagName('h5'),
    // document.getElementsByTagName('span')
    //document.getElementsByTagName('div')
  ]

  console.log(text_elements[0].length)
  for (var i = 0; i < words.length && i < 500; i ++) {
    console.log(words[i])
    if (words[i] == "") {
      continue
    }
    try {
      re = "(" + words[i] + ")"
      re = new RegExp(re, 'gi')
      for(ele of text_elements){
        for(p of ele){

            p.innerHTML = p.innerHTML.replaceAll(re, "<b>$1</b>")
        }
      }
    }
    catch(error) {
      continue
    }


  }
}

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



chrome.runtime.onMessage.addListener(async({ name, data }) => {
  if (name === 'loaded') {
    chrome.runtime.sendMessage({
      name: 'summarize-sentence',
      data: { value: "summarizing: " + tabdata }
    });
  }
  if (name === 'bold_text') {

    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    var response = await chrome.tabs.sendMessage(tab.id, "get_document");
    response = stripHTML(response)
    response =  await sendDataToServer(response, "keywords");

    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: bold_text,
        args: [response.summary],
      });
    });
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
    console.log(result.highlights)
    let new_highlights = result.highlights
    new_highlights.push(highlight)
    chrome.storage.local.set({highlights: new_highlights})
  })
}

function clear_all_highlights(){
  chrome.storage.local.set({highlights:[]})
}