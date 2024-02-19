
// let text = "";
// let element;
// let selection; 

let highlight = {
  "url":"https",
  "scroll": 0,
  "headindex": 0,
  "tailindex": 0
}

let pageHighlights = []

// let template = `
// <div>
// Highlight
// </div>
// `
let color_block = `
  <input id="%1" type="radio" name="choice" value="%2">     
  <label for="%1" class="color_label">
    %3
  </label>
`


// function getCharOffset(textNode, offset) {
//   const parentRect = textNode.parentElement.getBoundingClientRect()
//   const range = document.createRange()
//   range.setStart(textNode, offset)
//   range.setEnd(textNode, offset + 1)
//   const charRect = range.getBoundingClientRect()
//   return {
//     top: charRect.top - parentRect.top,
//     left: charRect.left - parentRect.left
//   }
// }


// function getElementIndex(parent, node){
//   let eleindex = 0;
//   parent.childNodes.forEach((n,i)=>{
//     if (n.isSameNode(node)) eleindex = i
//   })
//   return eleindex;
// }



// function getHTMLOfSelection () {
//     var range;
//     if (document.selection && document.selection.createRange) {
//       range = document.selection.createRange();
//       return range.htmlText;
//     }
//     else if (window.getSelection) {
//       var selection = window.getSelection();
//       if (selection.rangeCount > 0) {
//         range = selection.getRangeAt(0);
//         var clonedSelection = range.cloneContents();
//         var div = document.createElement('div');
//         div.appendChild(clonedSelection);
//         return div.innerHTML;
//       }
//       else {
//         return '';
//       }
//     }
//     else {
//       return '';
//     }
//   }

//   function highlight_text(txt, ele){
//     // if already marked, remove
//     re = new RegExp(/\<mark\>|\<\/mark\>/g)
//     selection = selection.replace(re, "")

//     console.log(txt)

//     re = "(" + txt + ")"
//     re = new RegExp(re)
//     highlight.query = jsPath(ele) 
//     ele.innerHTML = ele.innerHTML.replace(re, "<mark>$1</mark>")
//     highlight.scroll = window.scrollY
//     highlight.url = window.location.href
//     pageHighlights.push(highlight)
//     console.log(highlight)

//     chrome.runtime.sendMessage({
//       name: 'highlight_text',
//       data: highlight
//     })
  
// }

// window.addEventListener("keydown", (e)=>{
//     if (document.getElementsByClassName('readfxpopup').length > 0){
//         document.getElementsByClassName('readfxpopup')[0].remove()
//     }
// })


// window.addEventListener("mouseup", (e)=>{
//     const regex = new RegExp(/%(\d)/, 'g')
//     if(e.target.classList[0] == "color_label"){
//         highlight_text(text, element)
//     }

//     if (document.getElementsByClassName('readfxpopup').length > 0){
//         document.getElementsByClassName('readfxpopup')[0].remove()
//     }
//     if (window.getSelection().toString() != "") {

//         element = window.getSelection().focusNode.parentNode;  

        
//         let popup = document.createElement("div");
//         popup.innerHTML = "Highlight <br>"
//         for(let i = 0; i < 4; i++){
//             popup.innerHTML += color_block.replaceAll(regex, "color" + i)
//         }
//         popup.style.top = e.clientY + "px";
//         popup.style.left = e.clientX + "px";
//         popup.classList.add("readfxpopup")
//         document.body.appendChild(popup)
//         text = window.getSelection().toString();

//         highlight.headindex = window.getSelection().anchorOffset
//         highlight.tailindex = window.getSelection().focusOffset
//         selection = getHTMLOfSelection();

//     } 
//     // else if (document.selection && document.selection.type != "Control") {
//     //     text = document.selection;
//     // }
//     return text;
// })


window.addEventListener("keydown", (e)=>{
    if (document.getElementsByClassName('readfxpopup').length > 0){
        document.getElementsByClassName('readfxpopup')[0].remove()
    }
})


chrome.runtime.onMessage.addListener(({ name, data }) => {
  if(name === 'show_highlights'){
    console.log("show highlights")
    construct_range(data)
  }
})



window.addEventListener("mouseup", (e)=>{
    const regex = new RegExp(/%(\d)/, 'g')
    if(e.target.classList[0] == "color_label"){
      
      chrome.runtime.sendMessage({
        name: 'highlight_text',
        data: highlight
      })
    
      construct_range([highlight])
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

        let selection = window.getSelection()
        let range = selection.getRangeAt(0)
        
        highlight = save_range(range)
    } 
    // else if (document.selection && document.selection.type != "Control") {
    //     text = document.selection;
    // }
})

function highlight_text_node(n, start, end){
  let node = n
  let htext, text, ttext;

  // If is element
  if(node.nodeType == 1){
    htext = node.innerHTML.substring(0, start);
    text = node.innerHTML.substring(start, end);
    ttext = node.innerHTML.substring(end); 

    // If selection is to end
    if(end == -1){
      text = node.innerHTML.substring(start);
      ttext = "";
    }
    console.log("node: " + text)
    node.innerHTML = htext +  "<mark>" + text + "</mark>" + ttext
    return
  }
  
  // if text node
  if(node.nodeType == 3){
    // Get element
    let parent = node.parentNode;
    htext = node.data.substring(0, start);
    text = node.data.substring(start, end);
    ttext = node.data.substring(end); 
    
    if(end == -1){
      text = node.data.substring(start);
      ttext = "";
    }
    let eleindex = 0;
    try{
      parent.childNodes
    }catch{
      console.log(parent, node)
    }
    parent.childNodes.forEach((n,i)=>{
        if (n.isSameNode(node)) eleindex = i
    })
    //console.log(eleindex)

    let headElement = document.createTextNode(htext);
    let markElement = document.createElement('mark');
    let tailElement = document.createTextNode(ttext);

    markElement.classList.add("highlight_text")
    markElement.innerHTML = text;

    parent.removeChild(parent.childNodes[eleindex])
    parent.insertBefore(tailElement, parent.childNodes[eleindex]);
    parent.insertBefore(markElement, parent.childNodes[eleindex]);
    parent.insertBefore(headElement, parent.childNodes[eleindex]);
    return
  }
}

function save_range(range){
  // let highlight = range;
  // return highlight
  let highlight = {
    url: window.location.href,
    headtype: range.startContainer.nodeType,
    tailtype: range.endContainer.nodeType,
    headindex: range.startOffset,
    tailindex: range.endOffset,
    scroll: window.scrollY
  }
  if (highlight.headtype == 3){
    highlight.headnode = jsPath(range.startContainer.parentElement)
    let nodeindex = 0;
    let p = range.startContainer.parentElement.childNodes;
    for(let i = 0; i < p.length; i++){
      if(p[i].isSameNode(range.startContainer)){
        nodeindex = i  
      }
    }
    highlight.nodeindex = nodeindex
    highlight.text = range.startContainer.data.substring(highlight.headindex)
  }
  if (highlight.tailtype == 3){
    let nodeindex = 0;
    let p = range.endContainer.parentElement.childNodes;
    for(let i = 0; i < p.length; i++){
      if(p[i].isSameNode(range.endContainer)){
        nodeindex = i  
      }
    }
    highlight.nodeindex = nodeindex
    highlight.tailnode = jsPath(range.endContainer.parentElement)
  }
    
  if (highlight.tailtype == 1){
    highlight.tailnode = jsPath(range.endContainer)
    highlight.text = range.startContainer.innerText.substring(highlight.headindex)
  }
  if (highlight.headtype == 1){
    highlight.headnode = jsPath(range.startContainer)
  }
  
  console.log(highlight)
  return highlight
}

function highlight_all(){
  let htmlselection = window.getSelection()
  let range = htmlselection.getRangeAt(0)
  let range_save = range.cloneRange()
  save_range(range_save)
  let extent = htmlselection.focusNode
  let anchor = htmlselection.anchorNode;
  let startindex = htmlselection.anchorOffset
  let endindex = htmlselection.focusOffset

  // Within single element
  if(extent.isSameNode(anchor)){
    highlight_text_node(anchor, startindex, endindex)
    return
  }
  highlight_text_node(anchor, startindex, -1)
  highlight_text_node(extent, 0, endindex)

  if(range.startContainer.nextSibling == null){
    range.setStartAfter(range.startContainer.parentElement.nextElementSibling)    
    range.setEndBefore(range.endContainer.parentElement.previousElementSibling)    
  }else{
    range.setStartAfter(range.startContainer.nextSibling)
    range.setEndBefore(range.endContainer.previousSibling)
  }
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



function construct_range(highlights){
  highlights.forEach((h)=>{
    console.log(h.url, window.location.href)
    if(h.url == window.location.href){
      let range = document.createRange()
      let headele = document.querySelector(h.headnode)
      let tailele = document.querySelector(h.tailnode)

      console.log(headele)
      console.log(h.headindex, h.tailindex)
      if (h.headtype == 3){


        try {
          range.setStart(headele.childNodes[h.nodeindex], h.headindex)
        } catch (e) {
          console.log(headele)
          console.error(e);
        }

        //range.setStart(headele.childNodes[0], h.headindex)
      }else{
        range.setStart(headele, h.headindex)
      }
      if (h.tailtype == 3){
        range.setEnd(tailele.childNodes[h.nodeindex], h.tailindex)
      }else{
      range.setEnd(tailele, h.tailindex)


      }selection = window.getSelection()
      if (selection.rangeCount > 0) {
        selection.removeAllRanges();
      }    
      selection.addRange(range)
      highlight_all()  
    }
    
    
  })
}

