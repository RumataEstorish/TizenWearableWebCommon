/*global $, tau*/

/*
 * v1.1.1
 * close delay increased to 2 sec
 * fixed not showing
 * v1.0.1
 * added click on popup to close it
 * popup closing after 1500ms
 * */

ToastMessage.CLOSE_DELAY = 2000;

/**
 * Constructor of class ToastMessage
 * @param popupName - popup element name on page. Should be unique.
 * @param popupContent - popup content element name on page. Should be unique.
 */
function ToastMessage(popupName, popupContent) {
	var isOpened = false, self = this, pName = popupName[0] === '#'? popupName.slice(1) : popupName, pContent = popupContent[0] === '#' ? popupContent.slice(1) : popupContent;

	Object.defineProperty(this, "isOpened", {
		get : function() {
			return isOpened;
		},
		set : function(val) {
			isOpened = val;
		}
	});

	Object.defineProperty(this, "popupName", {
		get : function() {
			return pName;
		}
	});

	Object.defineProperty(this, "popupContent", {
		get : function() {
			return pContent;
		}
	});
	
	$(this.popupName).on("popuphide", function() {
		self.isOpened = false;
	});
	
	
	$('body').append('<div id="' + pName + '" class="ui-popup ui-popup-toast"><div id="'+ pContent +'" class="ui-popup-content"	style="overflow-y: no-scroll;"></div></div>');
}

/**
 * Show toast popup
 * @param txt - text to show
 * @param delay - open toast delay
 */
ToastMessage.prototype.show = function(txt, delay) {
	var self = this;
	if (!txt || txt === "") {
		return;
	}

	$(this.popupName).on("click", function(){
		tau.closePopup('#' + self.popupName);
	});
	
	setTimeout(function(){
		tau.closePopup('#' + self.popupName);
		self.isOpened = false;
	}, ToastMessage.CLOSE_DELAY);
	
	$('#' + this.popupContent).html(txt);
	if (this.isOpened !== true) {
		if (delay) {
			setTimeout(function() {
				tau.openPopup('#' + self.popupName);
				self.isOpened = true;
			}, delay);
		} else {
			tau.openPopup('#' + this.popupName);
			this.isOpened = true;
		}
	}
};

/**
 * Close popup
 */
ToastMessage.prototype.close = function() {
	if (this.isOpened === true) {
		tau.closePopup(this.popupName);
	}
};