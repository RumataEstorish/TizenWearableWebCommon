/*global AndroidHttpRequest*/

/**
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

/**
 * Нужно настроить а) доступ к системной информации б) канал для обмена с
 * андроидом в) подождать секунду, чтобы получилась модель часов
 */
function GearHttp(sap, forcePhone) {

	var self = this, lastOnline = false, onreadystatechange = null, request = null, onlinechangelistener = null, listenerId = null, _type = null, _address = null;

	// Протокол обмена с устройстом
	this.sap = sap;

	// Получение модели девайса для выбора способа коммуникации
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
				// Для часов Gear 1 - Gear 2/neo способо доступа к интернету
				// через
				// андроид
				request = new AndroidHttpRequest(self.sap);
				break;
			default:
				// Для Gear S+ доступ к интернету через JavaScript
				request = new XMLHttpRequest();
				break;
			}
		}
	} catch (e) {
		// В случае с эмулятором доступ через JavaScript
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
	 * Функция, получающая состояние запроса
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
	 * Объект запроса
	 */
	Object.defineProperty(this, 'request', {
		get : function() {
			return request;
		}
	});

	
	/**
	 * Создание запроса
	 * 
	 * @param type -
	 *            тип запроса
	 * @param address -
	 *            адрес запроса
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
	
	Object.defineProperty(this, 'type', {
		get : function(){
			return _type;
		}
	});
	
	Object.defineProperty(this, 'address', {
		get : function(){
			return _address;
		}
	});
}

GearHttp.OFFLINE = "OFFLINE";

/**
 * Модель часов
 */
GearHttp.model = null;


/**
 * Проверка, что есть подключение к сети
 * 
 * @param online -
 *            в сети
 * @param notonline -
 *            не в сети
 */
GearHttp.isOnline = function(online, offline) {
	if (!online && !offline) {
		return;
	}
	try {
		tizen.systeminfo.getPropertyValue("NETWORK", function(res) {
			switch (res.networkType) {
			case "NONE":
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
 * Отправка запроса
 * 
 * @param args -
 *            аргументы запроса
 */
GearHttp.prototype.send = function(args) {
	var listenerId = null, self = this, online = function() {
		if (self.request instanceof XMLHttpRequest && args) {
			self.request.send(args);
		} else {
			self.request.send(args);
		}
	}, offline = function() {
		if (self.sap.ontoastmessage) {
			self.sap.ontoastmessage(GearHttp.OFFLINE);
		}
		listenerId = tizen.systeminfo.addPropertyValueChangeListener("NETWORK", function() {
			if (listenerId) {
				tizen.systeminfo.removePropertyValueChangeListener(listenerId);
				listenerId = null;
			}
			online();
		});
	};
	GearHttp.isOnline(online, offline);
};

/**
 * Установка заголовков запроса
 * 
 * @param name -
 *            название заголовка
 * @param val -
 *            значение заголовка
 */
GearHttp.prototype.setRequestHeader = function(name, val) {
	this.request.setRequestHeader(name, val);
};

/**
 * Получение изображения из интернета. Если через js запрос, то возвращает
 * обратно адрес. Если через андроид, то картинку строкой Base64
 * 
 * @param address -
 *            адрес картинки
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