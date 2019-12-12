/*global RequestHeader*/

/**
 * Android http request data
 */
function AndroidRequestData() {
	var address = '', type = '', args = '', headers = [];

	Object.defineProperty(this, 'address', {
		get : function() {
			return address;
		},
		set : function(val) {
			address = val;
		}
	});

	Object.defineProperty(this, 'type', {
		get : function() {
			return type;
		},
		set : function(val) {
			type = val;
		}
	});

	Object.defineProperty(this, 'args', {
		get : function() {
			return args;
		},
		set : function(val) {
			args = val;
		}
	});

	Object.defineProperty(this, 'headers', {
		get : function() {
			return headers;
		},
		set : function(val) {
			headers = val;
		}
	});
}

/**
 * Set request heder
 * 
 * @param name -
 *            name
 * @param value -
 *            value
 */
AndroidRequestData.prototype.setRequestHeader = function(name, value) {
	this.headers.push(new RequestHeader(name, value));
};

AndroidRequestData.prototype.serialize = function() {
	return JSON.stringify({
		address : this.address,
		type : this.type,
		args : this.args,
		headers : this.headers.map(function(h) {
			return {
				name : h.name,
				value : h.value
			};
		})
	});
};