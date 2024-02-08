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


document.addEventListener('DOMContentLoaded', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const fonts = document.getElementById('input-font');
        const tab = tabs[0];

        function changingFont(font) {
            return font;
        }

        fonts.addEventListener('change', (e) => {
            selectedFont = e.target.value;

            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: changingFont,
                args: [selectedFont],
            }).then((result) => {
                const selectedFont = result[0].result;
                document.getElementById("output-text").style.fontFamily = selectedFont;
                fonts.addEventListener('change', changeFontListener);

            });
        fonts.removeEventListener('change', changeFontListener);
        });
        fonts.addEventListener('change', changeFontListener);
    });
});

console.log("loaded")
chrome.runtime.sendMessage({
    name: 'loaded',
    data: { value: "loaded" }
});
