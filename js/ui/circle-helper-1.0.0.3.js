/*global tau */
/*jshint unused: false*/
/*jslint unparam: true */
	var page,
	elScroller,
	list,
	listHelper = [],
	snapList = [],
	i, len, ignoreList = ['pageMarqueeList', 'pageTestVirtualList', 'pageAnimation'];
	

/**
 * Adds page to ignore scroll create
 * @param id - page id without #
 */
function addScrollerIgnorePage(id){
	ignoreList.push(id);
}

/**
 * Creates scroller on element
 * @params e -  object with field target contains dom element
 * @example {target : document.getElementById('mainPage')}
 */
function createScroller(e){

	if (!tau.support.shape.circle) {
		return;
	}
	
	page = e.target;
	elScroller = page.querySelector(".ui-scroller");
	
	len = listHelper.length;
	if (len) {
		for (i = 0; i < len; i++) {
			listHelper[i].destroy();
		}
		listHelper = [];
	}
	/*if(elScroller) {
		elScroller.removeAttribute("tizen-circular-scrollbar");
	}*/
	
	if (elScroller) {
		list = elScroller.querySelectorAll(".ui-listview");
		if (list) {
			
			if (page.id !== "pageMarqueeList" && page.id !== "pageTestVirtualList" && page.id !== "pageAnimation") {
				if (ignoreList.indexOf(page.id) !== -1){
					return;
				}
				len = list.length;
				for (i = 0; i < len; i++) {
					listHelper[i] = tau.helper.SnapListStyle.create(list[i]);
				}
				len = listHelper.length;
				if (len) {
					for (i = 0; i < len; i++) {
						snapList[i] = listHelper[i].getSnapList();
					}
				}
			}
			elScroller.setAttribute("tizen-circular-scrollbar", "");
		}
	}
}

(function(tau) {


	if (tau.support.shape.circle) {
		document.addEventListener("pagebeforeshow", function (e) {
			createScroller(e);
		});

		document.addEventListener("pagebeforehide", function () {
			len = listHelper.length;
			if (len) {
				for (i = 0; i < len; i++) {
					listHelper[i].destroy();
				}
				listHelper = [];
			}
			if(elScroller) {
				elScroller.removeAttribute("tizen-circular-scrollbar");
			}
		});
	}
}(tau));
