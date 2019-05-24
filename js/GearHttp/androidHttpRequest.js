/*global AndroidRequestData*/
/**
 * Класс для выполнения HTTP запросов через андроид
 * 
 * @param sap -
 *            класс для коммуникации с андроид
 */
function AndroidHttpRequest(sap) {

	var onreadystatechange = null;

	this.sap = sap;
	this.status = 0;
	this.readyState = 0;
	this.image = null;
	this.requestAddress = null;

	this.request = new AndroidRequestData();
	this.responseText = null;

	this.__defineGetter__("onreadystatechange", function() {
		return onreadystatechange;
	});
	this.__defineSetter__("onreadystatechange", function(val) {
		onreadystatechange = val;
	});
}

/**
 * Канал для отправки сетевых запросов
 */
AndroidHttpRequest.NETWORK_CHANNEL_ID = 99;

/**
 * Тип запроса - рисунок
 */
AndroidHttpRequest.IMAGE_TYPE = "IMAGE";
/**
 * Тип запроса - открытие ссылки в браузере
 */
AndroidHttpRequest.OPEN_LINK = "OPEN_LINK";

/**
 * Функция для получения ответа от телфона
 * 
 * @param channelId -
 *            канал получения данных
 * @param data -
 *            данные, которые пришли с устройства
 */
AndroidHttpRequest.prototype.onreceive = function(channelId, data) {

	//Пропускаем информацию не по адресу
	if (channelId !== AndroidHttpRequest.NETWORK_CHANNEL_ID) {
		return;
	}

	var res = JSON.parse(data);

	this.image = res.filePath;
	this.status = res.status;
	this.readyState = res.readyState;
	this.responseText = res.responseText;
	this.requestAddress = res.requestAddress;
	this.onreadystatechange();

};

/**
 * Открытие запроса. Необходим для совместимости с JavaScript запросом
 * 
 * @param type -
 *            тип запроса
 * @param address -
 *            адрес запроса
 */
AndroidHttpRequest.prototype.open = function(type, address) {
	this.request = new AndroidRequestData();
	this.request.type = type;
	this.request.address = address;
};

/**
 * Отправка данных
 * 
 * @param args -
 *            аргументы (для POST - запроса)
 */
AndroidHttpRequest.prototype.send = function(args) {

	var self = this, send = function() {
		self.sap.sendData(AndroidHttpRequest.NETWORK_CHANNEL_ID, JSON.stringify(self.request), send);
	};
	this.request.args = args;
	
	this.sap.onnetreceive = function(channelId, data){
		self.onreceive(channelId, data);
	};
	
	send();
};

/**
 * Установка заголовков запроса
 */
AndroidHttpRequest.prototype.setRequestHeader = function(name, value) {
	this.request.setRequestHeader(name, value);
};

/**
 * Запрос картинки у Android
 * 
 * @param address -
 *            адрес изображения
 * @param onimage -
 *            фукнция, возвращающая изображение base64
 */
AndroidHttpRequest.prototype.getImage = function(address) {

	var self = this, send = function() {
		self.sap.sendData(AndroidHttpRequest.NETWORK_CHANNEL_ID, JSON.stringify(self.request), send);
	};
	this.request = new AndroidRequestData();
	this.request.address = address;
	this.request.type = AndroidHttpRequest.IMAGE_TYPE;

	this.sap.imageReceiveArray.push(function(j, data){
		if (data.requestAddress === self.request.address){
			self.sap.imageReceiveArray.splice(j, 1);
			self.onreceive(AndroidHttpRequest.NETWORK_CHANNEL_ID, JSON.stringify(data));
		}
	});
	/*this.sap.imageReceive = function(data){
		self.onreceive(AndroidHttpRequest.NETWORK_CHANNEL_ID, );
	};*/
	/*this.sap.onnetreceive = function(channelId, data){
		self.onreceive(channelId, data);
	};*/
	
	send();
};
