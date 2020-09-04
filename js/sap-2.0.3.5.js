/*global Log, $*/
/*jslint laxbreak: true*/

/*
 * v 2.0.3.5
 * ref from IntelliJ Idea warnings
 * v 2.0.3.4
 * fixed openLink
 * deprecated openPhoneApp
 * when PEER_DISCONNECTED socket status, close everything to allow reconnect
 * v 2.0.3.3
 * added SAP.LOCATION_ERROR_CODES constants
 * v 2.0.3.2
 * added SAP.GET_LOCATION_CANCELLED constant
 * v 2.0.3.1
 * fixed acceptServiceConnectionRequest
 * v 2.0.3.0 
 * location support
 * added peer not found connect error callback 
 * v 2.0.2.2
 * accept connection
 * v 2.0.2.1
 * fixed self.receive is not a function
 * setServiceConnectionListener moved to webapis.sa.requestSAAgent 
 * v 2.0.2.0
 * bug fixes
 * ref
 * comments in english
 * v 2.0.1.0
 * fixed fileSendCallback, fileReceiveCallback
 */

/**
 * SAP common errors
 */
SAP.ERRORS = {
	INVALID_PEER_AGENT : 'INVALID_PEER_AGENT',
	PEER_NOT_FOUND : 'PEER_NOT_FOUND',
	NO_AGENTS_FOUND : 'NO_AGENTS_FOUND',
	SOCKET_CLOSED : 'SOCKET_CLOSED',
	DEVICE_NOT_CONNECTED : 'DEVICE_NOT_CONNECTED',
	DUPLICATE_REQUEST : 'DUPLICATE_REQUEST'
};

/**
 * Temp folder path
 */
SAP.tempFolder = null;

/** ************System commands************* */
/**
 * Authorization request
 */
SAP.AUTH_NEEDED = 'AUTH_NEEDED';

/**
 * Reauthorization request
 */
SAP.REAUTH_NEEDED = 'REAUTH_NEEDED';

/**
 * No response from web
 */
SAP.NO_RESPONSE = 'NO_RESPONSE';

/**
 * Open host app command
 */
SAP.OPEN_APP = 'OPEN_APP';

/**
 * Open link on host app
 */
SAP.OPEN_LINK = 'OPEN_LINK';

/**
 * Get location from phone.
 * @since v2.0.3.0
 */
SAP.GET_LOCATION = 'GET_LOCATION';

/**
 * Get location cancelled from phone side
 * @since v2.0.3.2
 */
SAP.GET_LOCATION_CANCELLED = 'GET_LOCATION_CANCELLED';

/**
 * Location error codes
 * @since v2.0.3.3 
 */
SAP.LOCATION_ERROR_CODES = {
	PERMISSION_DENIED : 1,
	POSITION_UNAVAILABLE : 2,
	TIMEOUT : 3
};

/** ************System channels************* */
/**
 * Channel for some service info
 */
SAP.SERVICE_CHANNEL_ID = 98;

/**
 * Channel for network requests through android phone
 */
SAP.NETWORK_CHANNEL_ID = 99;


/**
 * Channel for location requests through android phone
 */
SAP.LOCATION_CHANNEL_ID = 97;

/**
 * Reconnect timeout
 */
SAP.RECONNECT_TIMEOUT = 5000;

/**
 * Constructor of SAP class
 * @param providerName - name of host app
 * @param onReceive - on receive from host callback (function(channelId, data))
 */
function SAP(providerName, onReceive) {
	var fileReceiveCallback = null, fileSendCallback = null, saSocket = null, peerAgent = null, deviceAttached = false, connectOnDeviceNotConnected = false, fileOrder = [], fileTransfer = null, receiveListeners = [], saAgent = null, _onreceive = onReceive, onnetreceive = null, onImageReceive = null,
	onLocationReceive = null;

	/**
	 * Array of onReceive listeners. [function(channelId, data)]
	 */
	Object.defineProperty(this, 'receiveListeners', {
		get : function() {
			return receiveListeners;
		}
	});

	/**
	 * Is phone device attached
	 */
	Object.defineProperty(this, "isDeviceAttached", {
		get : function() {
			return deviceAttached;
		},
		set : function(val) {
			deviceAttached = val;
		}
	});

	/**
	 * If set to true, repeat attempts to connect phone if it's not connected
	 */
	Object.defineProperty(this, "connectOnDeviceNotConnected", {
		get : function() {
			return connectOnDeviceNotConnected;
		},
		set : function(val) {
			connectOnDeviceNotConnected = val;
		}
	});

	/**
	 * Provider name
	 */
	Object.defineProperty(this, "providerName", {
		get : function() {
			return providerName;
		}
	});

	/**
	 * Receiving files order
	 */
	Object.defineProperty(this, "fileOrder", {
		get : function() {
			return fileOrder;
		}
	});

	/**
	 * File transfer object
	 */
	Object.defineProperty(this, "fileTransfer", {
		get : function() {
			return fileTransfer;
		},
		set : function(val) {
			fileTransfer = val;
			if (fileTransfer && fileReceiveCallback) {
				fileTransfer.setFileReceiveListener(fileReceiveCallback);
			}
			if (fileTransfer && fileSendCallback) {
				fileTransfer.setFileSendListener(fileSendCallback);
			}
		}
	});

	/**
	 * Peer agent
	 */
	Object.defineProperty(this, 'peerAgent', {
		get : function() {
			return peerAgent;
		},
		set : function(val) {
			peerAgent = val;
		}
	});

	/**
	 * Is connected to phone 
	 */
	Object.defineProperty(this, 'isConnected', {
		get : function() {
			return this.peerAgent && this.saSocket;
		}
	});

	/**
	 * OnReceive callback. function(channelId, data)
	 */
	Object.defineProperty(this, 'onReceive', {
		get : function() {
			return _onreceive;
		},
		set : function(val) {
			_onreceive = val;
		}
	});

	/**
	 * Received response from network request to phone (when all net via phone) (function(channelId, data))
	 * Used internally for GearHttp
	 */
	Object.defineProperty(this, 'onnetreceive', {
		get : function() {
			return onnetreceive;
		},
		set : function(val) {
			onnetreceive = val;
		}
	});
	
	/**
	 * Location receiver from phone.
	 * Used internally
	 */
	Object.defineProperty(this, 'onLocationReceive', {
		get: function(){
			return onLocationReceive;
		},
		set: function(val){
			onLocationReceive = val;
		}
	});

	/**
	 * SASocket
	 */
	Object.defineProperty(this, 'saSocket', {
		get : function() {
			return saSocket;
		},
		set : function(val) {
			saSocket = val;
		}
	});

	/**
	 * SAAgent
	 */
	Object.defineProperty(this, 'saAgent', {
		get : function() {
			return saAgent;
		},
		set : function(val) {
			saAgent = val;
		}
	});

	/**
	 * Event when image receive from phone over net request
	 */
	Object.defineProperty(this, 'onImageReceive', {
		get : function() {
			return onImageReceive;
		},
		set : function(val) {
			onImageReceive = val;
		}
	});

	/**
	 * File receive callback { onreceive, onsuccess, onerror, onprogress }
	 */
	Object.defineProperty(this, "fileReceiveCallback", {
		get : function() {
			return fileReceiveCallback;
		},
		set : function(val) {
			fileReceiveCallback = val;
			if (this.fileTransfer) {
				this.fileTransfer.setFileReceiveListener(fileReceiveCallback);
			}
		}
	});

	/**
	 * File send callback { oncomplete, onerror, onprogress }
	 */
	Object.defineProperty(this, 'fileSendCallback', {
		get : function() {
			return fileSendCallback;
		},
		set : function(val) {
			fileSendCallback = val;
			if (this.fileTransfer) {
				this.fileTransfer.setFileSendListener(fileSendCallback);
			}
		}
	});
}

/**
 * Close connection and clear cache
 */
SAP.prototype.close = function() {
	if (this.saSocket) {
		this.saSocket.close();
		this.saSocket = null;
	}
	this.peerAgent = null;

	if (SAP.tempFolder) {
		try {
			SAP.tempFolder.listFiles(function(files) {
				for (var i = files.length - 1; i >= 0; i--) {
					try {
						if (files[i].isDirectory) {
							SAP.tempFolder.deleteDirectory(files[i].toURI(), true, function() {
							}, function() {
							});
						}
						if (files[i].isFile) {
							SAP.tempFolder.deleteFile(files[i].toURI(), function() {
							}, function() {
							});
						}
					} catch (ignore) {
					}

				}
			}, function(e) {
				alert(e);
			});
		} catch (e) {
			alert(e);
		}
	}

};

// noinspection JSUnusedGlobalSymbols
/**
 * Send request to open host app
 * @Deprecated not applied to Android 10 anymore
 * @See https://developer.android.com/guide/components/activities/background-starts
 */
SAP.prototype.openPhoneApp = function() {
	var data = {
		name : SAP.OPEN_APP
	};
	return this.sendData(SAP.SERVICE_CHANNEL_ID, JSON.stringify(data));
};

// noinspection JSUnusedGlobalSymbols
/**
 * Send request to open link on phone
 * @param url - url to open
 */
SAP.prototype.openLinkOnPhone = function(url) {
	var data = {
		name : SAP.OPEN_LINK,
		value : url
	};
	return this.sendData(SAP.SERVICE_CHANNEL_ID, JSON.stringify(data));
};

/**
 * Send data to phone
 * @param channelId - channel number
 * @param data - data to send
 * @returns promise. Resolved when sent successfully or reject on error
 */
SAP.prototype.sendData = function(channelId, data) {
	var self = this, d = $.Deferred();

	this.connect().then(function() {
		if (self.saSocket) {
			self.saSocket.sendData(channelId, data);
		}
		d.resolve();
	}, function(err) {
		d.reject(err);
	});
	return d.promise();
};

/**
 * Send file to phone
 * @param path to file
 * @returns promise. Resolved with transfer Id on success or reject on error
 */
SAP.prototype.sendFile = function(path) {
	var self = this, d = $.Deferred();

	this.connect().then(function() {
		var transferId = self.fileTransfer.sendFile(self.peerAgent, path);
		d.resolve(transferId);
	}, function(err) {
		d.reject(err);
	});

	return d.promise();
};

/**
 * Get location. If watch don't have navigator.geolocation, then request from phone.
 * @returns promise and position object:
 {
  	coords.latitude 	// The latitude as a decimal number (always returned)
	coords.longitude 	// The longitude as a decimal number (always returned)
	coords.accuracy 	// The accuracy of position (always returned)
	coords.altitude 	// The altitude in meters above the mean sea level (returned if available)
	coords.altitudeAccuracy 	// The altitude accuracy of position (returned if available)
	coords.heading 	// The heading as degrees clockwise from North (returned if available)
	coords.speed 	// The speed in meters per second (returned if available)
	timestamp // The date/time of the response (returned if available)
}
 @since v2.0.3.0
 * @param forceAcquireFromPhone force acquire from phone, not from watch
 */
SAP.prototype.getLocation = function(forceAcquireFromPhone){
	var d = $.Deferred();
	
	if (navigator.geolocation && !forceAcquireFromPhone){
		navigator.geolocation.getCurrentPosition(function(position){
			d.resolve(position);
		}, function(err){
			d.reject(err);
		});
	}
	else{
		this.onLocationReceive = function(channelId, data){
			var position = JSON.parse(data);
			if (position.coords){
				d.resolve(position);
			}
			else{
				d.reject(position);
			}			
		}; 
		this.sendData(SAP.LOCATION_CHANNEL_ID, SAP.GET_LOCATION).then(function(){});
	}
	
	return d.promise();
};

/**
 * Connect to phone
 * @returns promise. Resolved when connected, rejected when cannot connect
 */
SAP.prototype.connect = function() {
	// noinspection JSUnusedGlobalSymbols
	var self = this, d = $.Deferred(),
		
	onReceive = function(channelId, data){
		var res = null;

		Log.d('onReceive: ' + channelId + ' - ' + data);
		if (self.onReceive && channelId !== SAP.NETWORK_CHANNEL_ID) {
			self.onReceive(channelId, data);
		}

		self.receiveListeners.forEach(function(x) {
			x(channelId, data);
		});

		if (self.onLocationReceive && channelId === SAP.LOCATION_CHANNEL_ID){
			self.onLocationReceive(channelId, data);
		}
		
		if (self.onnetreceive && channelId === SAP.NETWORK_CHANNEL_ID) {
			res = JSON.parse(data);
			if (res.type === "IMAGE") {
				self.fileOrder.push(res);
			} else {
				self.onnetreceive(channelId, data);
			}
		}
	},
	
	handleError = function(err) {
		Log.warn('HandleError: ' + err);

		switch (err) {
		case SAP.ERRORS.DUPLICATE_REQUEST:
			break;
		case SAP.ERRORS.PEER_NOT_FOUND:
			Log.w(SAP.ERRORS.PEER_NOT_FOUND);
			d.reject(SAP.ERRORS.PEER_NOT_FOUND);
			break;
		case SAP.ERRORS.INVALID_PEER_AGENT:
			Log.w(SAP.ERRORS.INVALID_PEER_AGENT);
			d.reject(SAP.ERRORS.INVALID_PEER_AGENT);
			break;
		default:
			if (err === SAP.ERRORS.DEVICE_NOT_CONNECTED && !self.connectOnDeviceNotConnected) {
				Log.d('CONNECT ERROR: ' + SAP.ERRORS.DEVICE_NOT_CONNECTED);
				d.reject(SAP.ERRORS.DEVICE_NOT_CONNECTED);
				break;
			}
			setTimeout(function() {
				if (!self.isConnected) {
					self.saAgent.findPeerAgents();
				} else {
					d.resolve();
				}
			}, SAP.RECONNECT_TIMEOUT);
			break;
		}
	},

	peerAgentFindCallback = {
		onpeeragentfound : function(peerAgent) {
			Log.d('PEERAGENT FOUND: ' + peerAgent.appName);
			self.peerAgent = peerAgent;
			self.saAgent.acceptServiceConnectionRequest(peerAgent);
			self.saAgent.requestServiceConnection(peerAgent);
		},
		onpeeragentupdated : function(peerAgent, status) {
			Log.d('PEERAGENT UPDATED: ' + peerAgent + ' status: ' + status);
			switch (status) {
			case 'AVAILABLE':
				self.saAgent.requestServiceConnection(peerAgent);
				self.peerAgent = peerAgent;
				break;
			case 'UNAVAILABLE':
				self.peerAgent = null;
				Log.d("Uninstalled application package of peerAgent on remote device.");
				break;
			}
		},

		onerror : handleError
	},

	agentCallback = {
		onconnect : function(socket) {
			Log.d('AGENT CALLBACK: onconnect');
			self.isDeviceAttached = true;
			self.saSocket = socket;

			self.saSocket.setSocketStatusListener(function(reason) {
				Log.d("SOCKET STATUS: " + reason);
				if (reason === 'PEER_DISCONNECTED'){
					self.close();
				}
				d.reject(SAP.ERRORS.SOCKET_CLOSED);
			});
			self.saSocket.setDataReceiveListener(function(channelId, data) {
				onReceive(channelId, data);
			});

			d.resolve();
		},
		onrequest : function(peerAgent) {
			Log.d('AGENT CALLBACK: onrequest');
            self.saAgent.acceptServiceConnectionRequest(peerAgent);
        },
		onerror : handleError
	};
	
	if (self.saAgent && self.isConnected) {
		d.resolve();
		return d.promise();
	}

	if (self.saAgent && !self.isConnected) {
		self.saAgent.setServiceConnectionListener(agentCallback);
		self.saAgent.setPeerAgentFindListener(peerAgentFindCallback);
		self.fileTransfer = self.saAgent.getSAFileTransfer();
		self.saAgent.findPeerAgents();
		return d.promise();
	}

	try {
		// noinspection JSUnresolvedVariable
		webapis.sa.requestSAAgent(function(agents) {
			if (!agents || agents.length === 0) {
				d.reject(SAP.ERRORS.NO_AGENTS_FOUND);
				return;
			}
			self.saAgent = agents[0];
			self.saAgent.setServiceConnectionListener(agentCallback);
			self.saAgent.setPeerAgentFindListener(peerAgentFindCallback);
			self.fileTransfer = self.saAgent.getSAFileTransfer();

			self.fileTransfer.setFileSendListener({
				onprogress : function(id, progress) {
					Log.d('FT onProgress: ' + id + ' - ' + progress);
				
					if (self.fileSendCallback && self.fileSendCallback.onprogress) {
						self.fileSendCallback.onprogress(id, progress);
					}
				},
				oncomplete : function(id, localPath) {
					Log.d('FT onComplete: ' + id + ' - ' + localPath);
					if (self.fileSendCallback && self.fileSendCallback.oncomplete) {
						self.fileSendCallback.oncomplete(id, localPath);
					}
				},
				onerror : function(errCode, id) {
					Log.d('FT onError: '+ errCode + ' - ' + id);
					if (self.fileSendCallback && self.fileSendCallback.onerror) {
						self.fileSendCallback.onerror(errCode, id);
					}
				}
			});

			self.fileTransfer.setFileReceiveListener({
				onreceive : function(id, fileName) {
					Log.d('SAP.fileTransfer.onreceive: ' + id + ' => ' + fileName);

					for (var i = 0; i < self.fileOrder.length; i++) {
						if (self.fileOrder[i].fileName === fileName) {
							self.fileOrder[i].id = id;
							self.fileOrder[i].filePath = SAP.tempFolder.toURI() + '/' + fileName;
							self.fileTransfer.receiveFile(id, self.fileOrder[i].filePath);
							return;
						}
					}

					if (self.fileReceiveCallback && self.fileReceiveCallback.onreceive) {
						self.fileReceiveCallback.onreceive(id, fileName);
					}

				},
				onprogress : function(id, progress) {
					for (var i = 0; i < self.fileOrder.length; i++) {
						if (self.fileOrder[i].id === id) {
							return;
						}
					}
					if (self.fileReceiveCallback && self.fileReceiveCallback.onprogress) {
						self.fileReceiveCallback.onprogress(id, progress);
					}
				},
				oncomplete : function(id, localPath) {
					for (var i = 0; i < self.fileOrder.length; i++) {
						if (self.fileOrder[i].id === id) {
							if (self.onImageReceive) {
								self.onImageReceive(self.fileOrder[i]);
							}
							self.fileOrder.splice(i, 1);
							return;
						}
					}
					if (self.fileReceiveCallback && self.fileReceiveCallback.oncomplete) {
						self.fileReceiveCallback.oncomplete(id, localPath);
					}
				},

				onerror : function(errCode, id) {
					if (self.fileReceiveCallback && self.fileReceiveCallback.onerror) {
						self.fileReceiveCallback.onerror(errCode, id);
					}
				}
			});

			self.saAgent.findPeerAgents();
		}, function(err) {
			Log.e(err);
			d.reject(err);
		});

		// noinspection JSUnresolvedVariable
		webapis.sa.setDeviceStatusListener(function(type, status) {
			switch (status) {
			case 'ATTACHED':
				Log.d('DEVICE ATTACHED: ' + type);
				self.isDeviceAttached = true;
				break;
			case 'DETACHED':
				self.peerAgent = null;
				Log.d('DEVICE DETACHED: ' + type);
				self.isDeviceAttached = false;
				break;
			}
		});
	} catch (e) {
		if (!(e instanceof ReferenceError)) {
			d.reject(e);
			alert(e);
		}
	}
	return d.promise();

};