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
