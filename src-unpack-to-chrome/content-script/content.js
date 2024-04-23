var doc;
var test;

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

            for (var i = 0; i < words.length && i < 500; i ++) {
              if (words[i] == "") {
                continue
              }

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
      console.log("here!")
      var el = document.querySelectorAll('*');
        for(var i=0;i<el.length;i++){
        el[i].style.fontFamily = data;
  }

  }
})

// console.log(doc)
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {

  if (msg == 'get_document') {
    doc = ""

    var articles = document.getElementsByTagName("article")
    if (articles.length > 0)
      console.log(true)

    test = [document.getElementsByTagName('p'),
    document.getElementsByTagName('h1'),
    document.getElementsByTagName('h2'),
    document.getElementsByTagName('h3'),
    document.getElementsByTagName('blockquote'),
    document.getElementsByTagName('li'),
      document.getElementsByTagName('br')
    ]




    // console.log(test[1].length);
    // test.append(document.getElementsByTagName('span'))
    for (thing of test) {
      for (t of thing) {
        if (t.innerText.length > 20)
          doc += t.innerText + "\n"
          // t.style.fontFamily = "Arial";
      }
    }

    doc = document.body.innerText
    console.log(doc)
    sendResponse(doc)
  }

  if (msg[0] == "extract keywords") {




    bold_text(msg[1], test)

  }
});
