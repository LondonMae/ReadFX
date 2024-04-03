// Static functions

let current_theme = 0;
const palettes = {
    "purpl": ["51344d", "6f5060", "a78682", "e7ebc5", "ffffff"],
    "default": ["57614e", "6a755f", "8a977c", "fcc0d2", "ffffff"],
    "frutiger": ["cde7b0", "a3bfa8", "E4DFC8", "222823", "08090a"],
    "dark": ["020202", "222222", "312d2e", "dabaff", "ffffff"],
    "flag": ["2d3142", "4f5d75", "bfc0c0", "ef8354", "ffffff"], 
    "green-blindness": ["006837", "31a354", "78c679", "c2e699", "ffffcc"],
    "Protanopia": ["67000d", "a50f15", "cb181d", "ef3b2c", "fb6a4a"],
    "Tritanopia": ["045a8d", "2b8cbe", "74a9cf", "bdc9e1", "f1eef6"],
    "Monochromacy": ["000000", "666666", "999999", "cccccc", "ffffff"]
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
    document.getElementById("current-theme").innerText = Object.keys(palettes)[current_theme]
}

function copyText() {
    var copyText = document.getElementById("select-a-word");
    // Select the text field
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices

    // Copy the text inside the text field
    navigator.clipboard.writeText(copyText.value);
}

function saveText() {
    chrome.runtime.sendMessage({
        name: 'save',
        data: document.getElementById("select-a-word").value
    })

}

function saveNotebook() {
    chrome.runtime.sendMessage({
        name: 'write_notebook',
        data: document.getElementById("notebook").value
    })

}

// Local event listeners
document.addEventListener('DOMContentLoaded', function() {
    var openReadingModeButton = document.getElementById('open-reading-mode-button');
    openReadingModeButton.addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var activeTab = tabs[0];
            var url = activeTab.url;

            
            var newUrl = 'view-source:' + url;
            chrome.tabs.create({url: newUrl});
        });
    });
});


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




    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const fonts = document.getElementById('input-font');

        function changingFont(font) {
            console.log('Current font is: ' + font);
            console.log(fontstyle.value);
            console.log(document.getElementById('output-text'));
            document.getElementById('output-text').className = 'text-center ' + font;
            return;
        }

        fonts.addEventListener('change', (e) => {
            console.log('Font change invoked');
            console.log(`e.target.value = ${e.target.value}`);
            selectedFont = e.target.value;
            console.log(selectedFont);
            const tab = tabs[0];

            console.log("Before  Script ");
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: changingFont,
                args: [selectedFont],
            }).then(() => console.log('Middle of Script')).catch(error => console.log(error));
        });
        console.log("After  Script ");
    });



//Chrome functions

chrome.runtime.onMessage.addListener(({ name, data }) => {
    if (name === 'summarize-sentence') {
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
    }
    if (name === 'display-notes') {
        document.getElementById("notebook").value = data
    }
});

console.log("loaded")
chrome.runtime.sendMessage({
    name: 'loaded',
    data: { value: "loaded" }
});
