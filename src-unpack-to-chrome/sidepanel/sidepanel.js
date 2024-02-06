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
                document.getElementById("select-a-word").innerText = data.value;
            });
        
        });
    }
});


document.addEventListener('DOMContentLoaded', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const fonts = document.getElementById('input-font');
    
        function changingFont (font) {
            alert('Font change invoked');
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

console.log("loaded")
chrome.runtime.sendMessage({
    name: 'loaded',
    data: { value: "loaded" }
});
