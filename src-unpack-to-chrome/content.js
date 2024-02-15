var doc = ""
var test = document.getElementsByTagName('p')
for (t of test) {
  doc += t.innerText
}
console.log(doc)
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg == 'get_document') {
    sendResponse(doc)
  }
});
