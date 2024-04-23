// if document selected, send message to background.js
if (document.getSelection) {
  var t = document.getSelection(); //selected text on doc
  chrome.runtime.sendMessage(
			{topic: t.toString()},
			function(response) {
				result = response.farewell;

        //response is a summary of selected text field
				alert(result.summary);


				var notifOptions = {
                    type: "basic",
                    title: "Summary For Your Result",
                    message: result.summary
				};

        // chrome notif 
				chrome.notifications.create('WikiNotif', notifOptions);

			});
    }

    

// content.js
chrome.scripting.executeScript({
  target: {tabId: activeTab.id},
  function: () => {
      //  link to custom CSS file
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = chrome.runtime.getURL('src-unpack-to-chrome/content-script/reading-mode.css'); // Update path to your CSS file
      document.head.appendChild(link);

      // Remove all event listeners from the page
      document.querySelectorAll('*').forEach(node => {
          node.removeEventListener('click', event => event.stopPropagation(), true);
          node.removeEventListener('mousedown', event => event.stopPropagation(), true);
          node.removeEventListener('mouseup', event => event.stopPropagation(), true);
      });

      // Remove images and graphics
      document.querySelectorAll('img, svg').forEach(node => node.remove());

      // Remove hyperlinks
      document.querySelectorAll('a').forEach(node => {
          const textNode = document.createTextNode(node.textContent);
          node.parentNode.replaceChild(textNode, node);
      });

      // Remove references
      document.querySelectorAll('sup.reference').forEach(node => node.remove());

      // Remove edit buttons
      document.querySelectorAll('.mw-editsection').forEach(node => node.remove());

      // Change font size of the remaining text
      document.body.style.fontSize = '16px'; // Change '16px' to the desired font size

      // Remove all colors
      document.querySelectorAll('*').forEach(node => {
          node.style.color = 'black'; // Change 'black' to any other color you prefer
          node.style.backgroundColor = 'white'; // Change 'white' to any other color you prefer
      });
  }
});
