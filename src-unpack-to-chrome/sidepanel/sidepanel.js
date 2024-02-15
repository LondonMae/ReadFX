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



// Summarizes Sentence
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
                console.log(selectedText);
                document.getElementById("select-a-word").innerText = data.value;
                add();

            });

        });
    }
});

// Dynamically added text box with previous values
function add() {
    // Create new elements
    var newParagraph = document.createElement("p");

    // Set content for new elements
    var definitionText = document.getElementById("select-a-word").innerText;
    newParagraph.textContent = definitionText;
    // newParagraph.style.border = "1px solid black";
    newParagraph.style.padding = "10px";
    newParagraph.style.color = "white";
    newParagraph.style.backgroundColor = "8a9481";
    newParagraph.style.borderRadius = "10px";

    // Append the new elements to the desired location
    var container = document.getElementById("HistoryFx");

    // Add to top
    var historyDataDiv = document.getElementById('HistoryData');
    container.insertBefore(newParagraph, historyDataDiv);

}





// Changes Font
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
                document.getElementById("select-a-word").style.fontFamily = selectedFont;
                fonts.addEventListener('change', changeFontListener);

            });
        fonts.removeEventListener('change', changeFontListener);
        });
        fonts.addEventListener('change', changeFontListener);
    });
});


// Changes Font size
document.addEventListener('DOMContentLoaded', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const fontSize = document.getElementById('input-font-size');
        const tab = tabs[0];

        function changingFontSize(fontSize) {
            return fontSize;
        }

        fontSize.addEventListener('change', (e) => {
            selectedFontSize = e.target.value;

            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: changingFontSize,
                args: [selectedFontSize],
            }).then((result) => {
                const selectedFontSize = result[0].result;
                document.getElementById("select-a-word").style.fontSize = selectedFontSize;
                fonts.addEventListener('change', changeFontSizeListener);

            });
            fontSize.removeEventListener('change', changeFontSizeListener);
        });
        fontSize.addEventListener('change', changeFontSizeListener);
    });
})


console.log("loaded")
chrome.runtime.sendMessage({
    name: 'loaded',
    data: { value: "loaded" }
});
