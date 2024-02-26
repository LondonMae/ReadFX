var doc = ""
var test = [document.getElementsByTagName('p'),
// document.getElementsByTagName('span')
]
// test.append(document.getElementsByTagName('span'))
for (thing of test) {
  for (t of thing) {
    doc += t.innerText
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
  // catch errors

  //text_elements = document.getElementsByTagName('p') + document.getElementsByTagName('span')
  // text_elements = [
  //   document.getElementsByTagName('p'),
  //   // document.getElementsByTagName('h1'),
  //   // document.getElementsByTagName('h2'),
  //   // document.getElementsByTagName('h3'),
  //   // document.getElementsByTagName('h4'),
  //   // document.getElementsByTagName('h5'),
  //   // document.getElementsByTagName('span')
  //   //document.getElementsByTagName('div')
  // ]

  // console.log(wordlist.length)

      for (ele of text_elements) {
        for(p of ele){
            console.log("hey")
            for (var i = 0; i < words.length && i < 500; i ++) {
              if (words[i] == "") {
                continue
              }
              try {
                re = "( " + words[i] + " )"
                re = new RegExp(re, 'gi')
                p.innerHTML = p.innerHTML.replaceAll(re, "<b>$1</b>")
          }
          catch(error) {
            continue
          }
        }
        await sleep(100)
      }

}
}


console.log(doc)
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
