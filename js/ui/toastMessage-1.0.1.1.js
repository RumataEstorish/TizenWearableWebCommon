/*global $, tau*/

/*
 * v1.1
 * Insert html content automatically
 **/


/**
 * Toast message
 */
function ToastMessage(popupName, popupContent) {
	var isOpened = false, self = this, _pName = popupName[0] === '#' ? popupName : '#' + popupName, _pContent = popupContent[0] === '#' ? popupContent : '#' + popupContent;

	if (!$(_pName).length){
		$('body').append('<div id="' + _pName.substring(1) + '" class="ui-popup ui-popup-toast"><div id="' + _pContent.substring(1) + '" class="ui-popup-content"></div></div>');
	}
	
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
			return _pName;
		}
	});

	/**
	 * Name of popup content
	 */
	Object.defineProperty(this, "popupContent", {
		get : function() {
			return _pContent;
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