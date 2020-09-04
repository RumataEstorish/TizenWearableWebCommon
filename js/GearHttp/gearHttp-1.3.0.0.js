/*global AndroidHttpRequest*/

/**
 * v1.3.0.0 added phone model to constructor.
 * WARNING! You have to pass model, otherwise won't work
 @example
 tizen.systeminfo.getPropertyValue("BUILD", function(res) {
		res.model;
	});
 *
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
 * Abstract network request layer. Sends network requests via XmlHTTPRequest
 * when Gear S+ otherwise through android phone
 *
 * @param sap - SAP to communicate with phone
 * @param model - model of gear
 * @param forcePhone - force communication through phone any way

 @tutorial
 //Get model:
 tizen.systeminfo.getPropertyValue("BUILD", function(res) {
		res.model;
	});
 */
function GearHttp(sap, model, forcePhone) {

    var lastOnline = false, onreadystatechange = null, request = null, onlinechangelistener = null, listenerId = null;

    Object.defineProperties(this, {
        /**
         * Watch model
         */
        'model': {
            get: function () {
                return model;
            }
        },
        /**
         * Force to use phone to communicate with network
         */
        'forcePhone': {
            get: function () {
                return forcePhone;
            }
        },
        /**
         * SAP to communicate with phone
         */
        'sap': {
            get: function () {
                return sap;
            }
        },

        /**
         * onreadystatechange callback
         * */
        'onreadystatechange': {
            get: function () {
                return onreadystatechange;
            },
            set: function (val) {
                if (request) {
                    request.onreadystatechange = val;
                }
                onreadystatechange = val;
            }
        },

        /**
         * Request itself
         */
        'request': {
            get: function () {
                try {
                    if (forcePhone === true) {
                        if (!request) {
                            request = new AndroidHttpRequest(sap);
                        }
                        return request;
                    }

                    switch (this.model) {
                        case "SM-R380":
                        case "SM-R381":
                        case "SM-V700":
                            // For Gear 1 - Gear 2/neo net through Android
                            if (!request) {
                                request = new AndroidHttpRequest(sap);
                            }
                            break;
                        default:
                            // For Gear S+ net through XmlHttpRequest
                            if (!request) {
                                request = new XMLHttpRequest();
                            }
                            break;
                    }
                }catch (e) {
                    if (!request) {
                        request = new XMLHttpRequest();
                    }
                }
                finally {
                    request.onreadystatechange = onreadystatechange;
                }
                return request;
            }
        }
    });

    Object.defineProperty(this, 'onlinechangelistener', {
        get: function () {
            return onlinechangelistener;
        },
        set: function (val) {
            onlinechangelistener = val;
            if (val) {
                listenerId = setInterval(function () {
                    GearHttp.isOnline(function () {
                        if (lastOnline !== true) {
                            lastOnline = true;
                            onlinechangelistener(true);
                        }
                    }, function () {
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
}


/**
 * Request creation
 *
 * @param type -
 *            request type
 * @param address -
 *            request address
 */
GearHttp.prototype.open = function (type, address) {
    this.request.open(type, address);
};

/**
 * Network connection check
 *
 * @param online -
 *            online callback
 * @param offline -
 *            offline callback
 */
GearHttp.isOnline = function (online, offline) {
    if (!online && !offline) {
        return;
    }
    try {
        // noinspection JSCheckFunctionSignatures
        tizen.systeminfo.getPropertyValue("NETWORK", function (res) {
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
        }, function(){
            if (online){
                online();
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
GearHttp.prototype.send = function (args) {
    this.request.send(args);
};

/**
 * Set request header
 *
 * @param name -
 *            header name
 * @param val -
 *            header value
 */
GearHttp.prototype.setRequestHeader = function (name, val) {
    this.request.setRequestHeader(name, val);
};

/**
 * Get image. If js request, returns address back. If android then base64 image
 * string
 *
 * @param address -
 *            image address
 * @deprecated not working obviously
 */
GearHttp.prototype.getImage = function (address) {
    if (!this.onreadystatechange) {
        return;
    }

    if (this.request instanceof XMLHttpRequest) {
        this.request.requestAddress = address;
        this.request.image = address;
        // noinspection JSValidateTypes
        this.onreadystatechange();
        return;
    }

    this.request.getImage(address);
};