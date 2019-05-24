/*global RequestHeader*/

/**
 * Данные для передачи на андроид для запроса
 */
function AndroidRequestData(){
	var address = "", type = "", args = "", headers = [];
		
	this.__defineGetter__("address", function(){
		return address;
	});
	
	this.__defineSetter__("address", function(val){
		address = val;
	});
	
	this.__defineGetter__("type", function(){
		return type;
	});
	this.__defineSetter__("type", function(val){
		type = val;
	});
	
	this.__defineGetter__("args", function(){
		return args;
	});
	this.__defineSetter__("args", function(val){
		args = val;
	});
	
	this.__defineGetter__("headers", function(){
		return headers;
	});
}

/**
 * Установка заголовков запроса
 * @param name - название
 * @param value - значение
 */
AndroidRequestData.prototype.setRequestHeader = function(name, value){
	this.headers.push(new RequestHeader(name, value));
};

