// console.log(doc)
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {

  if (msg == 'get_docs') {
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

    docs = []



    docs[0] = window.getSelection().toString()
    count = 1
    for (thing of test) {
      for (t of thing) {
          docs[count] = t.innerText
          count++
      }
    }

    sendResponse(docs)
  }

  if (msg[0] == 'similarities') {

    similar = msg[1]

    test = [document.getElementsByTagName('p'),
    document.getElementsByTagName('h1'),
    document.getElementsByTagName('h2'),
    document.getElementsByTagName('h3'),
    document.getElementsByTagName('blockquote'),
    document.getElementsByTagName('li'),
      document.getElementsByTagName('br')
    ]

    docs = []

    count = 0
    for (thing of test) {
      for (t of thing) {
          docs[count] = t
          docs[count].style.color = "black"
          count++
      }
    }


    for (i = 0; i < similar.length; i++) {
      console.log(docs[similar[i]].innerText);
      console.log(similar[i])
      docs[similar[i]].style.color = "blue"
    }

    console.log(msg[1])

  }


});
