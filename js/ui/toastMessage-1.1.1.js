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
	var self = this;
	var pName = popupName[0] === '#'? popupName.slice(1) : popupName;
	var pContent = popupContent[0] === '#' ? popupContent.slice(1) : popupContent;

	this._isOpened = false;

	Object.defineProperties(this, {
		'isOpened' : {
			get: function(){
				return self._isOpened;
			}
		},
		'popupName': {
			get: function(){
				return pName;
			}
		},
		'popupContent': {
			get: function(){
				return pContent;
			}
		}
	});

	$(this.popupName).on("popuphide", function() {
		self._isOpened = false;
	});
	
	
	$('body').append('<div class="ui-page" id="' + pName + '">' +
		'<div class="ui-content">' +
		'<div class="ui-popup ui-popup-toast toast-text-only">' +
		'<div id="'+ pContent +'" class="ui-popup-content">' +
		'</div>' +
		'</div>' +
		'</div>' +
		'</div>');
}

/**
 * Show toast popup
 * @param txt - text to show
 * @param delay - open toast delay
 */
ToastMessage.prototype.show = function(txt, delay) {
	var self = this;
	var open = function(){
		tau.changePage('#' + self.popupName);
		$('#' + self.popupName).one('pageshow', function() {
			tau.openPopup('#' + self.popupName + '.ui-popup');
			self._isOpened = true;
		});
	}
	if (!txt || txt === "") {
		return;
	}

	$(this.popupName).on("click", function(){
		tau.closePopup('#' + self.popupName);
	});
	
	setTimeout(function(){
		tau.closePopup('#' + self.popupName + '.ui-popup');
		self._isOpened = false;
	}, ToastMessage.CLOSE_DELAY);
	
	$('#' + this.popupContent).html(txt);
	if (this._isOpened !== true) {
		if (delay) {
			setTimeout(open, delay);
		} else {
			open();
		}
	}
};

/**
 * Close popup
 */
ToastMessage.prototype.close = function() {
	if (this._isOpened === true) {
		tau.closePopup(this.popupName);
	}
};