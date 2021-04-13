/*global $, tau*/

/*
 * v1.2.0
 * tau 1.2.4 support
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
	var pPageName = '#' + pName;
	var pContent = popupContent[0] === '#' ? popupContent.slice(1) : popupContent;
	this._prevPage = $('.ui-page-active').prop('id');


	this._isOpened = false;

	Object.defineProperties(this, {
		'isOpened' : {
			get: function(){
				return self._isOpened;
			}
		},
		'popupPageName' : {
			get: function(){
				return pPageName;
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

	


	pName = pName + ' popup';
	$(this.popupName).on("popuphide", function() {
		self._isOpened = false;
	});

}

ToastMessage.prototype._addPopup = function(){
	$('body').append('<div class="ui-page" id="' + this.popupPageName.slice(1) + '">' +
		'<div class="ui-content">' +
		'<div id="' + this.popupName + '" class="ui-popup ui-popup-toast toast-text-only">' +
		'<div id="'+ this.popupContent +'" class="ui-popup-content">' +
		'</div>' +
		'</div>' +
		'</div>' +
		'</div>');
};

/**
 * Show toast popup
 * @param txt - text to show
 * @param delay - open toast delay
 */
ToastMessage.prototype.show = function(txt, delay) {
	var self = this;
	var open = function(){
		tau.changePage(self.popupPageName);
		$(self.popupPageName).one('pageshow', function() {
			tau.openPopup(self.popupName);
			self._isOpened = true;
		});
	}
	if (!txt || txt === "") {
		return;
	}

	this._addPopup();

	$(this.popupPageName).on("click", function(){
		self.close();
	});
	
	setTimeout(function(){
		self.close();
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
		tau.changePage('#' + this._prevPage);
		$(this.popupPageName).remove();
		this._isOpened = false;
	}
};