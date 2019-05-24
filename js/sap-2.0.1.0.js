/*global Log, $*/
/*jslint laxbreak: true*/

/*
 * v 2.0.1.0
 * fixed fileSendCallback, fileReceiveCallback
 * v 1.1.13.6
 * removed webapis error on emulator
 * v 1.1.13.5
 * added NO_RESPONSE constant
 * v 1.1.13.4
 * Improved logging 
 * v 1.1.13.3
 * added REAUTH_NEEDED constant
 * v 1.1.13.2
 * fixed sendFile
 * v 1.1.13.1
 * bug fixed
 * v 1.1.13.0
 * added property to reconnect if DEVICE_NOT_CONNECTED (connectOnDeviceNotConnected). Default: true
 * removed 'deviceAttached' property
 * v 1.1.12.0
 * added sendFile
 * v 1.1.11.1
 * added ondisconnected event. Fires when device detached, other cases onerror
 * v 1.1.11.0
 * Bug fixed
 * v 1.1.10.3
 * On connect try to disconnect
 * Stability
 * v 1.1.10.2 
 * On PEER_DISCONNECT try to connect on timer
 * v 1.1.10.1
 * On INVALID_PEERAGENT send onerror event
 * Close also close socket
 * v 1.1.10
 * When device is not attached, don't try to reconnect due to battery drain
 * Added property isDeviceAttached instead deviceAttached
 * On INVALID_PEERAGENT also try to findPeerAgent
 * v 1.1.9
 * When DEVICE_NOT_CONNECTED, PEER_NOT_FOUND, PEERAGENT_NO_RESPONSE agentcallback.onerror, tries to reconnect every 2 sec
 * v 1.1.8
 * When DEVICE_NOT_CONNECTED error happens, sends onerror event to allow UI handle it
 * v 1.1.7
 * added ontoastmessage to constructor for general purposes
 * v 1.1.6
 * added setFileSendListener
 * v 1.1.3
 * removed peer agent appName check due to empty value
 * fixed fileTransfer callback
 * v 1.1.2
 * removed excess findPeerAgent calling
 * v 1.1.1
 * stability improvements
 * SAP 1.1.0:
 * added FileTransfer
 * added onnetreceive where response from 99th channel goes
 * added network channel 99
 * added openPhoneApp. Need 98 channel
 */

function SAP(providerName, onReceive, ontoastmessage) {
	var fileReceiveCallback = null, fileSendCallback = null, saSocket = null, peerAgent = null, deviceAttached = false, connectOnDeviceNotConnected = true, fileOrder = [], fileTransfer = null, receiveListeners = [], 
	saAgent = null, _onreceive = onReceive, onnetreceive = null, onImageReceive = null;

	Object.defineProperty(this, 'receiveListeners', {
		get : function() {
			return receiveListeners;
		}
	});

	Object.defineProperty(this, "isDeviceAttached", {
		get : function() {
			return deviceAttached;
		},
		set : function(val) {
			deviceAttached = val;
		}
	});

	Object.defineProperty(this, "connectOnDeviceNotConnected", {
		get : function() {
			return connectOnDeviceNotConnected;
		},
		set : function(val) {
			connectOnDeviceNotConnected = val;
		}
	});

	Object.defineProperty(this, "ontoastmessage", {
		get : function() {
			return ontoastmessage;
		}
	});

	Object.defineProperty(this, "providerName", {
		get : function() {
			return providerName;
		}
	});

	Object.defineProperty(this, "fileOrder", {
		get : function() {
			return fileOrder;
		}
	});

	Object.defineProperty(this, "fileTransfer", {
		get : function() {
			return fileTransfer;
		},
		set : function(val) {
			fileTransfer = val;
			if (fileTransfer && fileReceiveCallback) {
				fileTransfer.setFileReceiveListener(fileReceiveCallback);
			}
			if (fileTransfer && fileSendCallback){
				fileTransfer.setFileSendListener(fileSendCallback);
			}
		}
	});

	Object.defineProperty(this, 'peerAgent', {
		get : function() {
			return peerAgent;
		},
		set : function(val) {
			peerAgent = val;
		}
	});

	Object.defineProperty(this, 'isConnected', {
		get : function() {
			return (this.peerAgent ? true : false) && (this.saSocket ? true : false);
		}
	});
	
	Object.defineProperty(this, 'onReceive', {
		get : function(){
			return _onreceive;
		},
		set : function(val){
			_onreceive = val;
		}
	});
	
	Object.defineProperty(this, 'onnetreceive', {
		get : function(){
			return onnetreceive;
		},
		set : function(val){
			onnetreceive = val;
		}
	});

	Object.defineProperty(this, 'saSocket',{
		get : function(){
			return saSocket;
		},
		set : function(val){
			saSocket = val;
		}
	});
	
	Object.defineProperty(this, 'saAgent', {
		get : function(){
			return saAgent;
		},
		set : function(val){
			saAgent = val;
		}
	});
	
	
	Object.defineProperty(this, 'onImageReceive', {
		get : function(){
			return onImageReceive;
		},
		set : function(val){
			onImageReceive = val;
		}
	});
	
	
	
	
	/**
	 * Объект получения файла. Методы onreceive, onsuccess, onerror, onprogress
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
	 * Объект отправки файла. Методы oncomplete, onerror, onprogress
	 */
	Object.defineProperty(this, 'fileSendCallback', {
		get : function(){
			return fileSendCallback;
		},
		set : function(val){
			fileSendCallback = val;
			 if (this.fileTransfer){
				 this.fileTransfer.setFileSendListener(fileSendCallback);
			 }
		}
	});
}

SAP.tempFolder = null;

/**
 * Запрос авторизации от телефона
 */
SAP.AUTH_NEEDED = "AUTH_NEEDED";

/**
 * Запрос переавторизации на телефоне
 */
SAP.REAUTH_NEEDED = "REAUTH_NEEDED";

/*
 * No response from web
 */
SAP.NO_RESPONSE = "NO_RESPONSE";

SAP.SERVICE_CHANNEL_ID = 98;
/**
 * Канал для отправки сетевых запросов
 */
SAP.NETWORK_CHANNEL_ID = 99;

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
 * Отправляем запрос развернуть приложение
 */
SAP.prototype.openPhoneApp = function() {
	var data = {
		name : "OPEN_APP"
	};
	this.saSocket.sendData(SAP.SERVICE_CHANNEL_ID, JSON.stringify(data));
};

/**
 * Отправляем запрос открытия ссылки на телефоне
 * 
 * @param url -
 *            адрес, который надо открыть
 */
SAP.prototype.openLinkOnPhone = function(url) {
	var data = {
		name : "OPEN_LINK",
		value : url
	};
	this.saSocket.sendData(SAP.SERVICE_CHANNEL_ID, JSON.stringify(data));
};

SAP.prototype.receive = function(channelId, data) {
	var res = null;

	if (this.onReceive && channelId !== SAP.NETWORK_CHANNEL_ID) {
		this.onReceive(channelId, data);
	}

	this.receiveListeners.forEach(function(x) {
		x(channelId, data);
	});

	if (this.onnetreceive && channelId === SAP.NETWORK_CHANNEL_ID) {
		res = JSON.parse(data);
		if (res.type === "IMAGE") {
			this.fileOrder.push(res);
		} else {
			this.onnetreceive(channelId, data);
		}
	}

};

/**
 * Отправка данных на телефон
 * 
 * @param channelId -
 *            номер канала
 * @param data -
 *            данные для отправки
 * @returns {Boolean} - истина, если устройство сейчас подключено и ложь если
 *          нет
 */
SAP.prototype.sendData = function(channelId, data) {
	var self = this, d = $.Deferred();

	this.connect().then(function() {
		self.saSocket.sendData(channelId, data);
		d.resolve();
	},
	function(){
		self.saSocket.sendData(channelId, data);
		d.resolve();
	});
	return d.promise();
};

SAP.prototype.sendFile = function(path) {
	var self = this, d = $.Deferred();
	
	this.connect().then(function(){
		var transferId = self.fileTransfer.sendFile(self.peerAgent, path);
		d.resolve(transferId);
	}, 
	function(){
		
	});
	
	return d.promise();
};

SAP.prototype.error = function(err) {
	Log.warn(err, true);
};

SAP.ERRORS = {
	PEER_NOT_FOUND : 'PEER_NOT_FOUND',
	NO_AGENTS_FOUND : 'NO_AGENTS_FOUND',
	SOCKET_CLOSED : 'SOCKET_CLOSED'
};

/**
 * Первичное подключение к телефону
 * 
 * @returns {Boolean} значение игнорируется
 */
SAP.prototype.connect = function() {
	var self = this, d = $.Deferred(), handleError = function(err) {
		Log.warn(err);

		switch (err) {
		case 'DUPLICATE_REQUEST':
			break;
		case 'INVALID_PEERAGENT':
			self.error('INVALID_PEERAGENT');
			d.reject('INVALID_PEERAGENT');
			break;
		default:
			if (err === 'DEVICE_NOT_CONNECTED' && !self.connectOnDeviceNotConnected) {
				break;
			}
			setTimeout(function() {
				if (!self.isConnected) {
					self.saAgent.findPeerAgents();
				} else {
					d.resolve();
				}
			}, 2000);
			break;
		}
	},

	peerAgentFindCallback = {

		/* Агент найден */
		onpeeragentfound : function(peerAgent) {
			Log.debug("PeerAgent found: " + peerAgent.appName);
			self.peerAgent = peerAgent;
			self.saAgent.setServiceConnectionListener(agentCallback);
			self.saAgent.requestServiceConnection(peerAgent);
		},

		/* Агент обновлён */
		onpeeragentupdated : function(peerAgent, status) {
			Log.debug("Peeragentupdated: " + peerAgent + " " + status);
			switch (status) {
			case "AVAILABLE":
				self.saAgent.requestServiceConnection(peerAgent);
				self.peerAgent = peerAgent;
				break;
			case "UNAVAILABLE":
				self.peerAgent = null;
				Log.debug("Uninstalled application package of peerAgent on remote device.");
				break;
			}
		},

		onerror : handleError
	},

	/* Надо в перевод добавить PEER_DISCONNECTED */
	agentCallback = {
		onconnect : function(socket) {
			Log.debug('Agentcallback onconnect');
			self.isDeviceAttached = true;
			self.saSocket = socket;

			self.saSocket.setSocketStatusListener(function(reason) {
				Log.debug("setSocketStatusListener: " + reason);
				self.close();
				d.reject(SAP.ERRORS.SOCKET_CLOSED);
			});
			self.saSocket.setDataReceiveListener(function(channelId, data) {
				self.receive(channelId, data);
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
			self.error(err);
		});

		webapis.sa.setDeviceStatusListener(function(type, status) {
			switch (status) {
			case 'ATTACHED':
				Log.debug('DEVICE ATTACHED: ' + type);
				self.isDeviceAttached = true;
				break;
			case 'DETACHED':
				self.peerAgent = null;
				Log.debug('DEVICE DETACHED: ' + type);
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