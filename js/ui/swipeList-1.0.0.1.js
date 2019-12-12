/*global $, tau*/
/*jshint unused: false*/
/*jslint laxbreak: true*/

function SwipeList(pageName, leftSwipe, rightSwipe) {
	var pName = pageName[0] === '#' ? pageName : '#' + pageName, swipeList = null, swipeListList = $(pName
			+ ' .ui-swipelist-list')[0];

	swipeListList.addEventListener("swipelist.left", leftSwipe);
	swipeListList.addEventListener("swipelist.right", rightSwipe);
	
	$(pName).on('pagebeforeshow', function() {
		swipeList = tau.widget.SwipeList(swipeListList, {
			swipeTarget : "li",
			swipeElement : ".ui-swipelist"
		});
	});
	
    $(pName).on("pagebeforehide", function() {
        if (swipeList) {
        	try{
        		swipeList.destroy();
        	}
        	catch(ignored){
        		
        	}
        }
    });
}