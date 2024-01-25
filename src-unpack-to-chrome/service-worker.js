
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'summarize-sentence',
    title: 'Summarize in side panel',
    contexts: ['all','selection','action']
  });
  chrome.tabs.create({ url: 'sidepanel/sidepanel.html' });
});

chrome.contextMenus.onClicked.addListener(async (data, info, tab) => {

  console.log("Before trying to open side panel")
  console.log(info)
  console.log(info.menuItemId)
  
  // if (info.menuItemId === 'summarize-sentence') {
  //   // This will open the panel in all the pages on the current window.
  //   console.log("Trying to open side panel")
  //   chrome.sidePanel.open({ windowId: tab.windowId });
  // }
  chrome.sidePanel.open({ windowId: tab.windowId });

  chrome.runtime.sendMessage({
    name: 'summarize-sentence',
    data: { value: data.selectionText }
  });
  
  
  console.log(typeof data.selectionText)
  var response = await sendDataToServer(data.selectionText);
  console.log("Back at client")
  console.log(response["summary"])

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