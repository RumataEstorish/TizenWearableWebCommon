/*global AndroidHttpRequest, $*/

/**
 * v1.2.1.0 fixed model not receiving with request crete v1.1.3.1 fixed offline
 * v1.1.3.0 added address and type property for comparation v1.1.2.1 added
 * forcePhone flag to force connection through phone v1.1.2 added
 * onlinechangelistener. Passes true/false when network connected/disconnected
 * v1.1.1 fixed online check exception on Gear 2. Always invokes online added
 * encodeURIComponent when send to web v1.1.0 added check online and if not
 * online, it will wait for online to send again
 */

GearHttp.OFFLINE = 'OFFLINE';

/**
 * Gear model
 */
GearHttp.model = null;

/**
 * Abstract network request layer. Sends network requests via XmlHTTPRequest
 * when Gear S+ otherwise through android phone
 * 
 * @param sap -
 *            SAP to communicate with phone
 * @param forcePhone -
 *            force communucation through phone any way
 */
function GearHttp(sap, forcePhone) {

	var lastOnline = false, onreadystatechange = null, request = null, onlinechangelistener = null, listenerId = null;

	Object.defineProperty(this, 'forcePhone', {
		get : function() {
			return forcePhone;
		}
	});

	Object.defineProperty(this, 'sap', {
		get : function() {
			return sap;
		}
	});

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
			if (request) {
				request.onreadystatechange = val;
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
		},
		set : function(val) {
			request = val;
		}
	});
}

GearHttp.prototype.getRequest = function() {
	var d = $.Deferred(), self = this;

	if (this.request) {
		d.resolve(this.request);
		return d.promise();
	}

	// Retrieving device model to detect communication way

	tizen.systeminfo.getPropertyValue("BUILD", function(res) {
		try {

			GearHttp.model = res.model;

			if (self.forcePhone === true) {
				if (!self.request) {
					self.request = new AndroidHttpRequest(self.sap);
				}
				d.resolve(self.request);

				return;
			}

			switch (GearHttp.model) {
			case "SM-R380":
			case "SM-R381":
			case "SM-V700":
				// For Gear 1 - Gear 2/neo net through Android
				if (!self.request) {
					self.request = new AndroidHttpRequest(self.sap);
				}
				d.resolve(self.request);
				break;
			default:
				// For Gear S+ net through XmlHttpRequest
				if (!self.request) {
					self.request = new XMLHttpRequest();
				}
				d.resolve(self.request);
				break;
			}
		} catch (e) {
			// In case of emulator through javascript
			if (!self.request) {
				d.resolve(new XMLHttpRequest());
			}
		} finally {
			self.request.onreadystatechange = self.onreadystatechange;
		}
	});

	return d.promise();
};

/**
 * Request creation
 * 
 * @param type -
 *            request type
 * @param address -
 *            request address
 */
GearHttp.prototype.open = function(type, address) {
	this.getRequest().then(function(req) {
		req.open(type, address);
	});
};

/**
 * Network connection check
 * 
 * @param online -
 *            online callback
 * @param offline -
 *            offline callback
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
 * 
 * @param args -
 *            POST reqeust args
 */
GearHttp.prototype.send = function(args) {
	this.getRequest().then(function(req) {
		req.send(args);
	});
};

/**
 * Set request header
 * 
 * @param name -
 *            header name
 * @param val -
 *            header value
 */
GearHttp.prototype.setRequestHeader = function(name, val) {
	this.getRequest().then(function(req) {
		req.setRequestHeader(name, val);
	});
};

/**
 * Get image. If js request, returns address back. If android then base64 image
 * string
 * 
 * @param address -
 *            image address
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