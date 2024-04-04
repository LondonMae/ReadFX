// Static functions

chrome.runtime.connect({ name: 'mySidepanel' });

let current_theme = 0;
const palettes = {
    "purpl":    ["51344d","6f5060","a78682","e7ebc5","ffffff", "000000"],
    "default": ["57614e","6a755f","8a977c","c59ca8","ffffff", "ffffff"],
    "frutiger":   ["cde7b0","a3bfa8","E4DFC8","222823","08090a", "ffffff"],
    "dark":   ["020202", "222222","312d2e","dabaff","ffffff", "000000"],
    "flag": ["2d3142","4f5d75","bfc0c0","ef8354","ffffff", "ffffff"]
}

function toggleTheme() {
    current_theme += 1
    current_theme = current_theme % Object.keys(palettes).length;
    let theme = palettes[Object.keys(palettes)[current_theme]];
    var r = document.querySelector(':root');
    r.style.setProperty('--bg', theme[0])
    r.style.setProperty('--primary', theme[1])
    r.style.setProperty('--secondary', theme[2])
    r.style.setProperty('--highlight', theme[3])
    r.style.setProperty('--text-color', theme[4])
    r.style.setProperty('--text-color-h', theme[5])
    document.getElementById("current-theme").innerText = Object.keys(palettes)[current_theme]
}

function copyText(){
    var copyText = document.getElementById("select-a-word");
    // Select the text field
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices

    // Copy the text inside the text field
    navigator.clipboard.writeText(copyText.value);
}

function saveText(){
    chrome.runtime.sendMessage({
        name: 'save',
        data: document.getElementById("select-a-word").value
    })

}


async function open_notes(){
    let newtab = await chrome.tabs.create({url: "chrome-extension://mjcpkcdfdbkepngmafjhgcfffnhhkejm/notes/notes.html"});
    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        // make sure the status is 'complete' and it's the right tab
        if (tabId == newtab.id && changeInfo.status == 'complete') {
            let response = chrome.tabs.sendMessage(newtab.id, { name: 'open_notes'});
        }
    });
}


async function jump_to_highlight(h){
    console.log(h);
    let newtab = await chrome.tabs.create({url: h.url});
    console.log(newtab)
    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        // make sure the status is 'complete' and it's the right tab
        console.log(tabId)
        console.log(newtab.id)    
        if (tabId == newtab.id && changeInfo.status == 'complete') {
            showHighlights()
            let response = chrome.tabs.sendMessage(newtab.id, { name: 'jump_to_highlights', data: h});
        }
    });
}


function showHighlights(){
    console.log("show highlights")
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        // Send a message to the content script in the active tab
        chrome.storage.local.get(["highlights"]).then((result)=>{
            chrome.tabs.sendMessage(tabs[0].id, { name: 'show_highlights', data: result.highlights});
        })
    });
}


function deletehighlight(title){
  console.log("delete"+ title )
  chrome.storage.local.get("highlights").then(
  (items) => {
      let selected_note = items["hightlights"][title];
      console.log(items)
      delete items["notes"][title]
      chrome.storage.local.set({highlights: items["notes"]} )
      //update_noteslist()
    }
  );
}

function listHighlights(){
    let list = document.getElementById("highlight-links");
    list.innerHTML = ""

    chrome.storage.local.get(["highlights"]).then((result)=>{
        for(let w in result.highlights){
            console.log(w);
            for(let h of result.highlights[w]){
                let link_ele = document.createElement('div');
                const regex = /(?<=https:\/\/)[a-z.]+(?=\/)/gm;
                link_ele.innerHTML = "<a href='" + h.url + "'>" + regex.exec(h.url) + "</a>" + "<br>" + h.text;
                let button = document.createElement("button");
                button.innerText = "X"
                button.classList.add("delete-button");
                button.addEventListener("click", ()=>{
                    deletehighlight(h)
                })
                link_ele.appendChild(button);
                link_ele.classList.add('highlight-link');
                link_ele.addEventListener('click', ()=>{
                    jump_to_highlight(h)
                })
                list.appendChild(link_ele)

               
            }
        }
    })
}

function openPdf(){
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        let url = tabs[0].url;
        var encodedString = encodeURIComponent(url);
        let newtab = chrome.tabs.create({url: "localhost:8000/index.html?data=" + encodedString});
    });
    // chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    //     // make sure the status is 'complete' and it's the right tab
    //     if (tabId == newtab.id && changeInfo.status == 'complete') {
    //         let response = chrome.tabs.sendMessage(newtab.id, { name: 'open_notes'});
    //     }
    // });

}

function saveNotebook(){
    chrome.runtime.sendMessage({
        name: 'write_notebook',
        data: document.getElementById("notebook").value
    })

}

// Local event listeners

document.getElementById("read-button").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        console.log("Button Clicked");
        const tab = tabs[0];
        function getParas() {
            var paragraphs = document.getElementsByTagName("p");
            var textCollection = [];

            for (var i = 0; i < paragraphs.length; i++) {
                textCollection.push(paragraphs[i].textContent);
            }

            console.log(textCollection);
        };

        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: getParas,
            //        files: ['contentScript.js'],  // To call external file instead
        }).then(() => console.log('Injected a function!'));
    });
});

document.getElementById("bold-button").addEventListener("click", () => {
    chrome.runtime.sendMessage({
        name: 'bold_text',
        data: { value: document.getElementById("bold-word").value }
    })

    document.getElementById("bold-word").value = ""
})

document.getElementById("open-pdf").addEventListener("click", () => {
    openPdf()
 })
document.getElementById("highlight-button").addEventListener("click", () => {
    showHighlights()
 })

 document.getElementById("list-highlights-button").addEventListener("click", () => {
    listHighlights()
 })

document.getElementById("change-theme-button").addEventListener("click", () => {
   toggleTheme()
})

document.getElementById("copy-button").addEventListener("click", () => {
    copyText()
 })

document.getElementById("save-button").addEventListener("click", () => {
    saveText()
 })


document.getElementById("save-notebook-button").addEventListener("click", () => {
    saveNotebook()
})

document.getElementById("open-notes").addEventListener("click", ()=>{
    open_notes()
})


document.addEventListener('DOMContentLoaded', function() {

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const fonts = document.getElementById('input-font');

    function changingFont (font) {
        console.log('Current font is: ' + font);
        console.log(fontstyle.value);
        console.log(document.getElementById('output-text'));
        document.getElementById('output-text').className = 'text-center ' + font;
        return;
    }

    fonts.addEventListener('change', (e) => {
        console.log('Font change invoked');
        console.log(`e.target.value = ${e.target.value}`);
        selectedFont =  e.target.value;
        console.log(selectedFont);
    const tab = tabs[0];

    console.log("Before  Script ");
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: changingFont,
        args: [selectedFont],
        }).then(() => console.log('Middle of Script')).catch(error=> console.log(error));
    });
    console.log("After  Script ");
    });

});

//Chrome functions

chrome.runtime.onMessage.addListener(({ name, data }) => {
    if (name === 'summarize-sentence') {
        console.log("summarized text gotten")
        document.getElementById("select-a-word").value = data.value;

        console.log("hi bestie")
        // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        //     const tab = tabs[0];
        //     function parseSentence() {
        //         var selection = window.getSelection().toString();
        //         console.log(selection);
        //         return selection;
        //     }
        //     chrome.scripting.executeScript({
        //         target: { tabId: tab.id },
        //         func: parseSentence,
        //         //        files: ['contentScript.js'],  // To call external file instead
        //     }).then(selectedText => {
        //         console.log('Injected a function!');
        //         console.log(selectedText)
        //         document.getElementById("select-a-word").value = data.value;
        //     });

        // });

    }

    if (name === 'summarize-sentence2') {
        console.log("hi bestie")
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tab = tabs[0];
            function parseSentence() {
                var selection = window.getSelection().toString();
                console.log(selection);
                return selection;
            }
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: parseSentence,
                //        files: ['contentScript.js'],  // To call external file instead
            }).then(selectedText => {
                console.log('Injected a function!');
                console.log(selectedText)
                document.getElementById("select-a-word").value = data.value;
            });

        });
        chrome.runtime.sendMessage({
            name: 'init-sp',
            data: { value: "loaded2" }
        });
    }
    if (name === 'display-notes'){
        document.getElementById("notebook").value = data
    }
});

console.log("loaded")
chrome.runtime.sendMessage({
    name: 'loaded',
    data: { value: "loaded" }
});
