//for local hosting of django server
var serverhost = 'http://127.0.0.1:8000/';

	//when we recieve call from content.js
	chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {

			// http api call
			var url = serverhost + 'api/get_wiki_summary/?topic='+ encodeURIComponent(request.topic) ;

			//fetch data from http
			fetch(url)
			.then(response => response.json())
			.then(response => sendResponse({farewell: response}))
			.catch(error => console.log(error))

			return true;  // Will respond asynchronously.

	});

// when user clicks extension button, execute content script 
chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    files: ['scripts/content.js']
  });
});
