var doc = ""
var test = document.getElementsByTagName('p')
for (t of test) {
  doc += t.innerText
}
// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'open-reading-mode-button') {
      // Get the current page's content
      let pageContent = document.body.innerHTML;

      // Replace the entire DOM with new HTML content
      document.documentElement.innerHTML = `
          <!DOCTYPE html>
          <html>
          <head>
              <title>New Page</title>
          </head>
          <body>
              ${pageContent}
          </body>
          </html>
      `;
  }
});
console.log(doc)
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg == 'get_document') {
    sendResponse(doc)
  }
});
