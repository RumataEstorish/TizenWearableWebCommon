/*global $, tau*/

/*
 * v1.0.1.1
 * documented
 * v1.0.1
 * added click on popup to close it
 * popup closing after 1500ms
 * */


/**
 * Toast message
 */
function ToastMessage(popupName, popupContent) {
	var isOpened = false, self = this;

	/**
	 * Is returns true if toast opened, false if not
	 */
	Object.defineProperty(this, "isOpened", {
		get : function() {
			return isOpened;
		},
		set : function(val) {
			isOpened = val;
		}
	});

	/**
	 * Name of popup component
	 */
	Object.defineProperty(this, "popupName", {
		get : function() {
			return popupName;
		}
	});

	/**
	 * Name of popup content
	 */
	Object.defineProperty(this, "popupContent", {
		get : function() {
			return popupContent;
		}
	});
	
	$(this.popupName).on("popuphide", function() {
		self.isOpened = false;
	});
}

/**
 * Show toast
 * @param txt text to show
 * @param delay before toast closes. If not set, toast won't auto close
 */
ToastMessage.prototype.show = function(txt, delay) {
	var self = this;
	if (!txt || txt === "") {
		return;
	}

	$(this.popupName).on("click", function(){
		tau.closePopup(self.popupName);
	});
	
	setTimeout(function(){
		tau.closePopup(self.popupName);
	},1500);
	$(this.popupContent).html(txt);
	if (this.isOpened !== true) {
		if (delay) {
			setTimeout(function() {
				tau.openPopup(self.popupName);
				self.isOpened = true;
			}, delay);
		} else {
			tau.openPopup(this.popupName);
			this.isOpened = true;
		}
	}
};

/**
 * Close toast message
 */
ToastMessage.prototype.close = function() {
	if (this.isOpened === true) {
		tau.closePopup(this.popupName);
	}
};