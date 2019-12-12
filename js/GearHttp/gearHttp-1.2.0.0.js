/*global AndroidHttpRequest*/

/**
 * v1.1.3.1
 * fixed offline
 * v1.1.3.0
 * added address and type property for comparation
 * v1.1.2.1
 * added forcePhone flag to force connection through phone
 * v1.1.2
 * added onlinechangelistener. Passes true/false when network connected/disconnected
 * v1.1.1
 * fixed online check exception on Gear 2. Always invokes online
 * added encodeURIComponent when send to web
 * v1.1.0
 * added check online and if not online, it will wait for online to send again
 */


GearHttp.OFFLINE = 'OFFLINE';

/**
 * Gear model
 */
GearHttp.model = null;

/**
 * Abstract network request layer. Sends network requests via XmlHTTPRequest when Gear S+ otherwise through android phone
 * @param sap - SAP to communicate with phone
 * @param forcePhone - force communucation through phone any way
 */
function GearHttp(sap, forcePhone) {

	var self = this, lastOnline = false, onreadystatechange = null, request = null, onlinechangelistener = null, listenerId = null, _type = null, _address = null;

	Object.defineProperty(this, 'sap', {
		get: function(){
			return sap;
		}
	});
	
	// Retrieving device model to detect communication way
	try {
		if (!GearHttp.model) {
			tizen.systeminfo.getPropertyValue("BUILD", function(res) {
				GearHttp.model = res.model;
			});
		}
		if (forcePhone === true) {
			request = new AndroidHttpRequest(self.sap);
		} else {

			switch (GearHttp.model) {
			case "SM-R380":
			case "SM-R381":
			case "SM-V700":
				// For Gear 1 - Gear 2/neo net through Android
				request = new AndroidHttpRequest(self.sap);
				break;
			default:
				// For Gear S+ net through XmlHttpRequest
				request = new XMLHttpRequest();
				break;
			}
		}
	} catch (e) {
		// In case of emulator through javascript
		request = new XMLHttpRequest();
	} finally {
		if (onreadystatechange) {
			request.onreadystatechange = onreadystatechange;
		}
	}

	Object.defineProperty(this, 'onlinechangelistener', {
		get : function() {
			return onlinechangelistener;
		},
		set : function(val) {
			onlinechangelistener = val;
			if (val) {
				listenerId = setInterval(function() {
					GearHttp.isOnline(function() {
						if (lastOnline !== true) {
							lastOnline = true;
							onlinechangelistener(true);
						}
					}, function() {
						if (lastOnline !== false) {
							lastOnline = false;
							onlinechangelistener(false);
						}
					});
				}, 5000);
			} else {
				if (listenerId) {
					clearInterval(listenerId);
				}
			}
		}
	});

	/**
	 * Request state change func
	 */
	Object.defineProperty(this, 'onreadystatechange', {
		get : function() {
			return onreadystatechange;
		},
		set : function(val) {
			if (this.request) {
				this.request.onreadystatechange = val;
			}
			onreadystatechange = val;
		}
	});

	/**
	 * Request itself
	 */
	Object.defineProperty(this, 'request', {
		get : function() {
			return request;
		}
	});

	
	/**
	 * Request creation
	 * @param type - request type
	 * @param address - request address
	 */
	Object.defineProperty(this, 'open', {
		get : function(){
			return function(type, address){
				_type = type;
				_address = address;
				request.open(type, address);	
			};
		}
	});
	
	/**
	 * Request type
	 */
	Object.defineProperty(this, 'type', {
		get : function(){
			return _type;
		}
	});
	
	/**
	 * Request address
	 */
	Object.defineProperty(this, 'address', {
		get : function(){
			return _address;
		}
	});
}




/**
 * Network connection check
 * @param online - online callback
 * @param offline - offline callback
 */
GearHttp.isOnline = function(online, offline) {
	if (!online && !offline) {
		return;
	}
	try {
		tizen.systeminfo.getPropertyValue("NETWORK", function(res) {
			switch (res.networkType) {
			case 'NONE':
				if (offline) {
					offline();
				}
				break;
			default:
				if (online) {
					online();
				}
			}
		});
	} catch (e) {
		if (online) {
			online();
		}
	}
};

/**
 * Send request
 * @param args - POST reqeust args
 */
GearHttp.prototype.send = function(args) {
	this.request.send(args);
};

/**
 * Set request header
 * @param name - header name
 * @param val - header value
 */
GearHttp.prototype.setRequestHeader = function(name, val) {
	this.request.setRequestHeader(name, val);
};

/**
 * Get image. If js request, returns address back. If android then base64 image string
 * @param address - image address
 * @deprecated not working obviously
 */
GearHttp.prototype.getImage = function(address) {
	if (!this.onreadystatechange) {
		return;
	}

	if (this.request instanceof XMLHttpRequest) {
		this.request.requestAddress = address;
		this.request.image = address;
		this.onreadystatechange();
		return;
	}

	this.request.getImage(address);
};