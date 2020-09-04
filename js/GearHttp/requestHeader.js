/*jshint unused: false*/
/*jslint laxbreak: true*/

function RequestHeader(name, value){
	
	var _name = name, _value = value;
	
	Object.defineProperty(this, 'name',{
		get: function(){
			return _name;
		}
	});
	
	Object.defineProperty(this, 'value',{
		get: function(){
			return _value;
		}
	});
}