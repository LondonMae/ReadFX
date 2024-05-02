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

let invertedcss = `
img{
    filter:invert(1);
}`
// :link{
//     color:orange;
// }
// :visited{
//     color:#80FF80;
// }


chrome.runtime.onMessage.addListener(({ name, data }) => {
  if(name === 'tab'){
    try{
      document.getElementById("invertcss").remove()
    }catch{

    }
    console.log("here!")
    document.body.style.fontSize = data.fontSize + "px";
    document.body.style.background = data.background;
    
    let red = Number("0x" + data.background.slice(1,3));
    let blue = Number("0x" + data.background.slice(3,5));
    let green = Number("0x" + data.background.slice(5,7));
    document.body.style.color = (red*0.299 + green*0.587 + blue*0.114) > 186 ? "#000000" : "#ffffff"
    if(data.invert){
      let inverthtml = document.createElement("style")
      inverthtml.id = "invertcss"
      inverthtml.innerHTML = invertedcss;
      document.head.appendChild(inverthtml)
    }else{
      document.getElementById("invertcss").remove()
    }
    
    var el = document.querySelectorAll('*');
    for(var i=0;i<el.length;i++){
      el[i].style.fontFamily = data.fontFamily;
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


// window.addEventListener("mouseup", (e)=>{
//     if (window.getSelection().toString() != "") {
//         if(!highlight_active){
//           console.log("enable show highlights first")
//           return
//         }
//         let wikipopup = document.createElement("div");
//         wikipopup.classList.add("wikipopup")
//         wiki_preview(wikipopup, window.getSelection().toString());
//         document.body.appendChild(wikipopup);
//     } 
// })

// async function wiki_preview(ele, word){
//   let data = fetch("https://en.wikipedia.org/api/rest_v1/page/summary/" + word, {
//   "headers": {
//     "accept": "application/json; charset=utf-8; profile=\"https://www.mediawiki.org/wiki/Specs/Summary/1.2.0\"",
//     "origin":"*",
//   },
//   "method": "GET",
//   "mode": "cors"
//   }).then((response) => {
//     if (response.status == 404){
//       return "no wiki"
//     }
//     const reader = response.body.getReader();
//     reader.read().then(({ done, value }) => {
//         const string= new TextDecoder().decode(value);;
//         const json = JSON.parse(string);
//         console.log(json)
//         ele.innerHTML = `<img src='` + json.thumbnail.source + `'>`
//         ele.innerHTML += json.extract_html
//         ele.innerHTML += `<a href='`+ json.content_urls.desktop.page +`'> Open Full URL </a>`
//     })
//   })
// }

async function wiki_search(word){
  let data = fetch("https://en.wikipedia.org/w/api.php?action=query&format=json&gsrlimit=1&generator=search&origin=*&gsrsearch=" + word, {
  "headers": {
    "origin":"*",
  },
  "method": "GET"
  }).then((response) => {
    const reader = response.body.getReader();
    reader.read().then(({ done, value }) => {
        const string= new TextDecoder().decode(value);;
        const json = JSON.parse(string);
        const page = json.query.pages;
        console.log(page)
        console.log(page[Object.keys(page)[0]].title)
    })
  })
}