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
  tabdata = data.selectionText;

  console.log(typeof data.selectionText)
  const response =  await sendDataToServer(data.selectionText);
  console.log("Back at client")
  console.log(response["summary"])
  
  chrome.runtime.sendMessage({
    name: 'summarize-sentence',
    data: { value: response["summary"] }
  });

});

chrome.runtime.onMessage.addListener(({ name, data }) => {
  if (name === 'loaded') {
    chrome.runtime.sendMessage({
      name: 'summarize-sentence',
      data: { value: "summarizing: " + tabdata }
    });
    console.log("loaded")
  }

});



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
  console.log("BYEBYE")
  console.log(data)
  return data
}

