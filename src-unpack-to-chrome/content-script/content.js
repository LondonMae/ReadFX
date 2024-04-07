var doc = ""
var test = [document.getElementsByTagName('p'),
document.getElementsByTagName('h1'),
document.getElementsByTagName('h2'),
document.getElementsByTagName('h3'),
document.getElementsByTagName('blockquote'),
document.getElementsByTagName('li')
]



// console.log(test[1].length);
// test.append(document.getElementsByTagName('span'))
for (thing of test) {
  for (t of thing) {
    doc += t.innerText + "\n"
      // t.style.fontFamily = "Arial";
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function bold_text(word, text_elements) {

  words = word.split("/")
  if (words.length < 2) {
    return
  }


      for (ele of text_elements) {
        for(p of ele){
            console.log("hey")
            for (var i = 0; i < words.length && i < 500; i ++) {
              if (words[i] == "") {
                continue
              }
              console.log(words[i])
              try {
                re = "( " + words[i] + " )"
                re = new RegExp(re, 'gi')
                p.innerHTML = p.innerHTML.replaceAll(re, "<strong>$1</strong>")
          }
          catch(error) {
            continue
          }
        }
        await sleep(100)
      }

}
}

chrome.runtime.onMessage.addListener(({ name, data }) => {
  if(name === 'tab'){
    for (thing of test) {
      for (t of thing) {
          t.style.fontFamily = data;
      }
    }
  }
})

// console.log(doc)
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {

  if (msg == 'get_document') {
    sendResponse(doc)
  }


  if (msg[0] == "extract keywords") {
    // for (t of test) {
    //   for (p of t){
    bold_text(msg[1], test)
  // }
  // }
  }
});
