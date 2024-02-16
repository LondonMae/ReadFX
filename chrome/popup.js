$(function(){

    //on button click
    $('#keywordsubmit').click(function(){
    //
    // // what was entered in textbox
		// var search_topic = $('#keyword').val();
    //
    // // if not empty, then send message to background
		// if (search_topic) {
    //             chrome.runtime.sendMessage(
		// 			{topic: search_topic},
		// 			function(response) {
		// 				result = response.farewell;
		// 				alert(result.summary);
    //
		// 				var notifOptions = {
    //                     type: "basic",
    //                     title: "WikiPedia Summary For Your Result",
    //                     message: result.summary
		// 				};
    //
		// 				chrome.notifications.create('WikiNotif', notifOptions);
    //
		// 			});
		// }
    //
    //
		// $('#keyword').val('');

  t = document.getSelection();
  console.log(t.toString())



    });
});
