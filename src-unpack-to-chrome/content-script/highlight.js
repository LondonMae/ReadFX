// TODO: highlight all text before anything 

let highlight_applied = false;
// set this to true before applying the newest highlight

let highlight = {
  "url":"https",
  "scroll": 0,
  "headindex": 0,
  "tailindex": 0
}

let pageHighlights = []

let color_block = `
  <input id="%1" type="radio" name="choice" value="%2">     
  <label for="%1" class="color_label">
    %3
  </label>
`

window.addEventListener("keydown", (e)=>{
    if (document.getElementsByClassName('readfxpopup').length > 0){
        document.getElementsByClassName('readfxpopup')[0].remove()
    }
})

String.prototype.hashCode = function() {
  var hash = 0,
    i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
}

chrome.runtime.onMessage.addListener(({ name, data }) => {
  if(name === 'show_highlights'){
    console.log("show highlights")
    highlight_applied = true
    construct_range(data)
  }
  if(name === 'jump_to_highlights'){
    console.log("jump to highlights")
    jump_to_highlights(data)
  }
})


async function add_new_highlight(e){
  if(!highlight_applied){
    // await chrome.runtime.sendMessage(()=>{

    // })
  }
  const regex = new RegExp(/%(\d)/, 'g')
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


window.addEventListener("mouseup", (e)=>{
  
    if(e.target.classList[0] == "color_label"){
      
      chrome.runtime.sendMessage({
        name: 'highlight_text',
        data: highlight
      })
      
      let key = window.location.href.hashCode()
      let data = {}
      data[key] = [highlight]
      construct_range(data)
    }

    if (document.getElementsByClassName('readfxpopup').length > 0){
        document.getElementsByClassName('readfxpopup')[0].remove()
    }
    if (window.getSelection().toString() != "") {
        if(!highlight_applied){
          console.log("enable show highlights first")
          //return
        }
        add_new_highlight(e)
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
    node.innerHTML = htext +  "<highlight-tag>" + text + "</highlight-tag>" + ttext
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
    let markElement = document.createElement('highlight-tag');
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
    highlight.hnodeindex = nodeindex
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
    highlight.tnodeindex = nodeindex
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

  range.setStart(range.startContainer, range.startOffset + 2)
  
  fullnodes = range.extractContents().childNodes
  head = fullnodes.item(0).cloneNode();
  tail = fullnodes.item(fullnodes.length - 1).cloneNode();
  parentnode = document.createDocumentFragment();
  let i = 0;
  while (fullnodes.length > i){
    if(fullnodes.item(i).innerHTML == undefined){
      let hi = document.createElement("highlight-tag")
      hi.innerHTML = fullnodes.item(i).data
      parentnode.appendChild(hi)
      i++
      continue
    }
    fullnodes.item(i).innerHTML = "<highlight-tag>" + fullnodes.item(i).innerHTML + " </highlight-tag>"
    console.log(fullnodes.item(i))
    parentnode.appendChild(fullnodes.item(i))
  }
  range.insertNode(parentnode)
}

async function jump_to_highlights(h){
  let headele = document.querySelector(h.headnode)
  // let data = {}
  // data[h.url.hashCode()] = [h]
  // construct_range(data)
  //await window.open(h.url, "_blank")
  headele.scrollIntoView()
}

function construct_range(highlights){
  console.log(highlights)
  for(let h of highlights[window.location.href.hashCode()]){
    console.log(h.url, window.location.href)
      console.log(h.url)
      let range = document.createRange()
      let headele = document.querySelector(h.headnode)
      let tailele = document.querySelector(h.tailnode)

      console.log(headele)
      console.log(h.headindex, h.tailindex)
      if (h.headtype == 3){
        try {
          range.setStart(headele.childNodes[h.hnodeindex], h.headindex)
        } catch (e) {
          console.log(headele)
          console.log(h)
          console.error(e);
        }

        //range.setStart(headele.childNodes[0], h.headindex)
      }else{
        range.setStart(headele, h.headindex)
      }
      if (h.tailtype == 3){
        try {
          range.setEnd(tailele.childNodes[h.tnodeindex], h.tailindex)
        }
        catch(e){

        }
      }else{
      range.setEnd(tailele, h.tailindex)


      }selection = window.getSelection()
      if (selection.rangeCount > 0) {
        selection.removeAllRanges();
      }    
      selection.addRange(range)
      highlight_all()  
  //  }
    
    
  }
}


function changeHighlightColor(){
    var r = document.querySelector(':root');
    r.style.setProperty('--highlight-color', "#0000ff")
}
