function viewOverlay(){
    let o = document.createElement("div")
    o.classList.add("highlight_button")
    o.innerHTML = `<div class="highlight_info">click to enable highlights</div><img src="` +chrome.runtime.getURL("images/highlighter.png")   + `"></img>`
    //o.style.background = "black";
    o.addEventListener("click", (e)=>{
        highlight_active = true;
    })
    
    document.body.appendChild(o)

}

viewOverlay()