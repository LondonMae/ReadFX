
let text = "";
let element;
let selection; 

let highlight = {
  "url":"https",
    "query": "html",
    "scroll": 0,
    "headindex": 0,
    "tailindex": 0
}

let pageHighlights = []

let template = `
<div>
Highlight
</div>
`
let color_block = `
  <input id="%1" type="radio" name="choice" value="%2">     
  <label for="%1" class="color_label">
    %3
  </label>
`


function getCharOffset(textNode, offset) {
  const parentRect = textNode.parentElement.getBoundingClientRect()
  const range = document.createRange()
  range.setStart(textNode, offset)
  range.setEnd(textNode, offset + 1)
  const charRect = range.getBoundingClientRect()
  return {
    top: charRect.top - parentRect.top,
    left: charRect.left - parentRect.left
  }
}


function getElementIndex(parent, node){
  let eleindex = 0;
  parent.childNodes.forEach((n,i)=>{
    if (n.isSameNode(node)) eleindex = i
  })
  return eleindex;
}

function highlight_text_node(n, start, end){
  let node = n
  let htext, text, ttext;
  
  
  if(node.nodeType == 1){
  
    
    htext = node.innerHTML.substring(0, start);
    text = node.innerHTML.substring(start, end);
    ttext = node.innerHTML.substring(end); 

    
    if(end == -1){
      text = node.innerHTML.substring(start);
      ttext = "";
    }
    
    console.log("node: " + text)
    node.innerHTML = htext +  "<mark>" + text + "</mark>" + ttext
    
    return
  }
  

  let parent = node.parentNode;
  htext = node.data.substring(0, start);
  text = node.data.substring(start, end);
  ttext = node.data.substring(end); 
  

  if(end == -1){
    text = node.data.substring(start);
    ttext = "";
  }
  
  if(node.nodeType == 3){
      let eleindex = 0;
      parent.childNodes.forEach((n,i)=>{
          if (n.isSameNode(node)) eleindex = i
      })
      //console.log(eleindex)

      let headElement = document.createTextNode(htext);
      let markElement = document.createElement('mark');
      let tailElement = document.createTextNode(ttext);

      markElement.classList.add("highlight_text")
      markElement.innerHTML = text;

      //console.log("removing" + parent.childNodes[eleindex].data)
      //parent.removeChild(parent.childNodes[eleindex])
      //console.log("tail: " + ttext)
      parent.insertBefore(tailElement, parent.childNodes[eleindex]);
      //console.log("mid: " + text)
      parent.insertBefore(markElement, parent.childNodes[eleindex]);
      //console.log("head: " + htext)
      parent.insertBefore(headElement, parent.childNodes[eleindex]);

      //console.log(htext)
      //console.log(ttext)
      //markElement.innerHTML = text
      //node.parentNode.childNodes[eleindex]
  }
}

function highlight_all(){
  let htmlselection = window.getSelection()
  let range = htmlselection.getRangeAt(0)
  let extent = htmlselection.focusNode
  let anchor = htmlselection.anchorNode;
  let startindex = htmlselection.anchorOffset
  let endindex = htmlselection.focusOffset

  // Within single element
  if(extent.isSameNode(anchor)){
    highlight_text_node(anchor, startindex, endindex)
  }
  highlight_text_node(anchor, startindex, -1)
  highlight_text_node(extent, 0, endindex)


  range.setStartAfter(range.startContainer.nextSibling)
  range.setEndBefore(range.endContainer.previousSibling)
  fullnodes = range.extractContents().querySelectorAll('*');
  head = fullnodes.item(0).cloneNode();
  tail = fullnodes.item(fullnodes.length - 1).cloneNode();
  parentnode = document.createDocumentFragment();
  for (let i = 0; i < fullnodes.length; i++){
    fullnodes.item(i).innerHTML = "<mark>" + fullnodes.item(i).innerHTML + "</mark>"
    console.log(fullnodes.item(i))
    parentnode.appendChild(fullnodes.item(i))    
  }
  range.insertNode(parentnode)
}



function getHTMLOfSelection () {
    var range;
    if (document.selection && document.selection.createRange) {
      range = document.selection.createRange();
      return range.htmlText;
    }
    else if (window.getSelection) {
      var selection = window.getSelection();
      if (selection.rangeCount > 0) {
        range = selection.getRangeAt(0);
        var clonedSelection = range.cloneContents();
        var div = document.createElement('div');
        div.appendChild(clonedSelection);
        return div.innerHTML;
      }
      else {
        return '';
      }
    }
    else {
      return '';
    }
  }

  function highlight_text(txt, ele){
    // if already marked, remove
    re = new RegExp(/\<mark\>|\<\/mark\>/g)
    selection = selection.replace(re, "")

    console.log(txt)

    re = "(" + txt + ")"
    re = new RegExp(re)
    highlight.query = jsPath(ele) 
    ele.innerHTML = ele.innerHTML.replace(re, "<mark>$1</mark>")
    highlight.scroll = window.scrollY
    highlight.url = window.location.href
    pageHighlights.push(highlight)
    console.log(highlight)

    chrome.runtime.sendMessage({
      name: 'highlight_text',
      data: highlight
    })
  
}

window.addEventListener("keydown", (e)=>{
    if (document.getElementsByClassName('readfxpopup').length > 0){
        document.getElementsByClassName('readfxpopup')[0].remove()
    }
})


window.addEventListener("mouseup", (e)=>{
    const regex = new RegExp(/%(\d)/, 'g')
    if(e.target.classList[0] == "color_label"){
        highlight_text(text, element)
    }

    if (document.getElementsByClassName('readfxpopup').length > 0){
        document.getElementsByClassName('readfxpopup')[0].remove()
    }
    if (window.getSelection().toString() != "") {

        element = window.getSelection().focusNode.parentNode;  

        
        let popup = document.createElement("div");
        popup.innerHTML = "Highlight <br>"
        for(let i = 0; i < 4; i++){
            popup.innerHTML += color_block.replaceAll(regex, "color" + i)
        }
        popup.style.top = e.clientY + "px";
        popup.style.left = e.clientX + "px";
        popup.classList.add("readfxpopup")
        document.body.appendChild(popup)
        text = window.getSelection().toString();

        highlight.headindex = window.getSelection().anchorOffset
        highlight.tailindex = window.getSelection().focusOffset
        selection = getHTMLOfSelection();

    } 
    // else if (document.selection && document.selection.type != "Control") {
    //     text = document.selection;
    // }
    return text;
})


// function show_highlights(highlights){
//   highlights.forEach((h)=>{
//       if(h.url == window.location.href){
//         let range = document.createRange()
//         range.setStart(document.querySelector(testh.query).childNodes[0], testh.headindex)
//         range.setEnd(document.querySelector(testh.query).childNodes[0], testh.tailindex)
//         let ele = document.querySelector(testh.query)
//         selection = window.getSelection()
//         selection.addRange(range)
        
//         highlight_text(ele.innerText.substring(h.headindex, h.tailindex), ele)
//       }
//   })
// }

// console.log("loaded content script")

// chrome.runtime.onMessage.addListener(({ name, data }) => {
//   console.log(name)
//   if(name === 'show_highlights') {
//     show_highlights(data)
//   }
// });
