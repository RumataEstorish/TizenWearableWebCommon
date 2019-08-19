/*global Log, $*/
/*jslint laxbreak: true*/

/*
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
 * Reconnect timeout
 */
SAP.RECONNECT_TIMEOUT = 5000;

/**
 * Constructor of SAP class
 * @param providerName - name of host app
 * @param onReceive - on receive from host callback (function(channelId, data))
 * @param 
 */
function SAP(providerName, onReceive) {
	var fileReceiveCallback = null, fileSendCallback = null, saSocket = null, peerAgent = null, deviceAttached = false, connectOnDeviceNotConnected = true, fileOrder = [], fileTransfer = null, receiveListeners = [], saAgent = null, _onreceive = onReceive, onnetreceive = null, onImageReceive = null;

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
			return (this.peerAgent ? true : false) && (this.saSocket ? true : false);
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
				var i = 0;
				for (i = files.length - 1; i >= 0; i--) {
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

/**
 * Send request to open host app
 */
SAP.prototype.openPhoneApp = function() {
	var data = {
		name : SAP.OPEN_APP
	};
	this.saSocket.sendData(SAP.SERVICE_CHANNEL_ID, JSON.stringify(data));
};

/**
 * Send request to open link on phone
 * @param url - url to open
 */
SAP.prototype.openLinkOnPhone = function(url) {
	var data = {
		name : SAP.OPEN_LINK,
		value : url
	};
	this.saSocket.sendData(SAP.SERVICE_CHANNEL_ID, JSON.stringify(data));
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
 * Connect to phone
 * @returns promise. Resolved when connected, rejected when cannot connect
 */
SAP.prototype.connect = function() {
	var self = this, d = $.Deferred(),
	
	onReceive = function(channelId, data){
		var res = null;

		if (self.onReceive && channelId !== SAP.NETWORK_CHANNEL_ID) {
			self.onReceive(channelId, data);
		}

		self.receiveListeners.forEach(function(x) {
			x(channelId, data);
		});

		if (self.onnetreceive && channelId === SAP.NETWORK_CHANNEL_ID) {
			res = JSON.parse(data);
			if (res.type === "IMAGE") {
				self.fileOrder.push(res);
			} else {
				self.onnetreceive(channelId, data);
			}
		}
		self.receive(channelId, data);
	},
	
	handleError = function(err) {
		Log.warn(err);

		switch (err) {
		case SAP.ERRORS.DUPLICATE_REQUEST:
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
			self.saAgent.setServiceConnectionListener(agentCallback);
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
				d.reject(SAP.ERRORS.SOCKET_CLOSED);
			});
			self.saSocket.setDataReceiveListener(function(channelId, data) {
				onReceive(channelId, data);
			});

			d.resolve();
		},
		onerror : handleError
	};
	
	if (self.saAgent && self.isConnected) {
		d.resolve();
		return d.promise();
	}

	if (self.saAgent && !self.isConnected) {
		self.saAgent.setPeerAgentFindListener(peerAgentFindCallback);
		self.saAgent.findPeerAgents();
		return d.promise();
	}

	try {
		webapis.sa.requestSAAgent(function(agents) {
			if (!agents || agents.length === 0) {
				d.reject(SAP.ERRORS.NO_AGENTS_FOUND);
				return;
			}
			self.saAgent = agents[0];
			self.saAgent.setPeerAgentFindListener(peerAgentFindCallback);
			self.fileTransfer = self.saAgent.getSAFileTransfer();

			self.fileTransfer.setFileSendListener({
				onprogress : function(id, progress) {
					if (self.fileSendCallback && self.fileSendCallback.onprogress) {
						self.fileSendCallback.onprogress(id, progress);
					}
				},
				oncomplete : function(id, localPath) {
					if (self.fileSendCallback && self.fileSendCallback.oncomplete) {
						self.fileSendCallback.oncomplete(id, localPath);
					}
				},
				onerror : function(errCode, id) {
					if (self.fileSendCallback && self.fileSendCallback.onerror) {
						self.fileSendCallback.onerror(errCode, id);
					}
				}
			});

			self.fileTransfer.setFileReceiveListener({
				onreceive : function(id, fileName) {

					var i = 0;

					for (i = 0; i < self.fileOrder.length; i++) {
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
					var i = 0;
					for (i = 0; i < self.fileOrder.length; i++) {
						if (self.fileOrder[i].id === id) {
							return;
						}
					}
					if (self.fileReceiveCallback && self.fileReceiveCallback.onprogress) {
						self.fileReceiveCallback.onprogress(id, progress);
					}
				},
				oncomplete : function(id, localPath) {
					var i = 0;
					for (i = 0; i < self.fileOrder.length; i++) {
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
			Log.error(err, false);
			d.reject(err);
		});

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