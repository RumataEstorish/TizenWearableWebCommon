/*global AndroidRequestData, SAP*/

/**
 * Request type - image
 */
AndroidHttpRequest.IMAGE_TYPE = "IMAGE";

/**
 * Execute http requests through android
 * @param sap - communication class
 */
function AndroidHttpRequest(sap) {

	var onreadystatechange = null, status = 0, readyState = 0, image = null, request = new AndroidRequestData(), responseText = null, sapPreviousConnectOnNotConnected = sap.connectOnDeviceNotConnected, 
	
	onreceive = function(channelId, data){
				
		//Skip useless info
		if (channelId !== SAP.NETWORK_CHANNEL_ID) {
			return;
		}

		var res = JSON.parse(data);

		image = res.filePath;
		status = res.status;
		readyState = res.readyState;
		responseText = res.responseText;
		request.address = res.requestAddress;
		onreadystatechange();
		sap.connectOnDeviceNotConnected = sapPreviousConnectOnNotConnected;
	};

	Object.defineProperty(this, 'sap', {
		get: function(){
			return sap;
		}
	});
	
	Object.defineProperty(this, 'image', {
		get : function(){
			return image;
		}
	});
	
	Object.defineProperty(this, 'status', {
		get: function(){
			return status;
		}
	});
	
	Object.defineProperty(this, 'readyState', {
		get: function(){
			return readyState;
		}
	});
	
	Object.defineProperty(this, 'address', {
		get: function(){
			return request.address;
		}
	});
	
	Object.defineProperty(this, 'request', {
		get: function(){
			return request;
		},
		set: function(val){
			request = val;
		}
	});
	
	Object.defineProperty(this, 'responseText', {
		get: function(){
			return responseText;
		}
	});
	
	Object.defineProperty(this, 'onreadystatechange', {
		get: function(){
			return onreadystatechange;
		},
		set: function(val){
			onreadystatechange = val;
		}
	});
	
	sap.connectOnDeviceNotConnected = true;
	sap.onnetreceive = onreceive;
	/* sap.imageReceiveArray.push(function(j, data){
		if (data.requestAddress === request.address){
			sap.imageReceiveArray.splice(j, 1);
			onreceive(SAP.NETWORK_CHANNEL_ID, JSON.stringify(data));
		}
	});*/ 
}

/**
 * Open request. Requires for javascript XMLHttpRequest compatibility.
 * @param type - request type (POST, GET...)
 * @param address - request address
 */
AndroidHttpRequest.prototype.open = function(type, address) {
	this.request = new AndroidRequestData();
	this.request.type = type;
	this.request.address = address;
};

/**
 * Send data. Returns promise.
 * @param args - POST request args
 */
AndroidHttpRequest.prototype.send = function(args) {	
	this.request.args = args;
	return this.sap.sendData(SAP.NETWORK_CHANNEL_ID, this.request.serialize());
};

/**
 * Set request header
 */
AndroidHttpRequest.prototype.setRequestHeader = function(name, value) {
	this.request.setRequestHeader(name, value);
};

/**
 * Request image from Android
 * @param address - image address
 * @deprecated not working
 */
AndroidHttpRequest.prototype.getImage = function(address) {
	this.request = new AndroidRequestData();
	this.request.address = address;
	this.request.type = AndroidHttpRequest.IMAGE_TYPE;
	
	return this.sap.sendData(SAP.NETWORK_CHANNEL_ID, this.request.serialize());
};
