/*jshint unused: false*/
/*jshint multistr: true */

function Log(){
	
}

Log.DEBUG = false;
Log.ITEM = null;
Log.FORCE_ERROR_ALERT = false;

Log.info = function(e, al){
	console.info(e);
	if (al){
		alert(e);
	}
	if (Log.ITEM){
		Log.ITEM.append('i: ' + e + '\
				');
	}
};

Log.warn = function(e, al){
	console.warn(e);
	if (al){
		alert(e);
	}
	if (Log.ITEM){
		Log.ITEM.append('w: ' + e + '\
				');
	}
};

Log.error = function(e, silent){
	console.error(e);
	if (!silent || Log.FORCE_ERROR_ALERT === true){
		alert(e);
	}
	if (Log.ITEM){
		Log.ITEM.append('e: ' + e + '\
				');
	}
};

Log.debug = function(e){
	if (!Log.DEBUG){
		return;
	}
	console.debug(e);
	if (Log.ITEM){
		Log.ITEM.append('d: ' + e + '\
				');
	}
};

Log.d = function(e){
	Log.debug(e);
};


Log.e = function(e, silent){
	Log.error(e, silent);
};

Log.w = function(e, al) {
	Log.warn(e, al);
};

Log.i = function(e, al){
	Log.info(e, al);
};
