// Allows users to open the side panel by clicking on the action toolbar icon
// chrome.sidePanel
//   .setPanelBehavior({ openPanelOnActionClick: true })
//   .catch((error) => console.error(error));

  
function setupContextMenu() {
  chrome.contextMenus.create({
    id: 'summarize-sentence',
    title: 'Summarize',
    contexts: ['selection']
  });
}

chrome.runtime.onInstalled.addListener(() => {
  setupContextMenu();
});

chrome.contextMenus.onClicked.addListener((data) => {
  chrome.runtime.sendMessage({
    name: 'summarize-sentence',
    data: { value: data.selectionText }
  });
});