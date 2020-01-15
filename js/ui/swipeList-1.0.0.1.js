/*global $, tau*/
/*jshint unused: false*/
/*jslint laxbreak: true*/

/**
 * SwipeList constructor
 * @param pageName - name of page where swipe list is placed
 * @param leftSwipe - function called when swipe left performed
 * @param rightSwipe - function called when swipe right performed
 */
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