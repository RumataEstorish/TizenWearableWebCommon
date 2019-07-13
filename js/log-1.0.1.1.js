/*jshint unused: false*/
/*jshint multistr: true */

function Log(){
}

/**
 * Global property enables write Log.debug
 */
Log.DEBUG = false;

/**
 * Set dom item to write log into
 */
Log.ITEM = null;

/**
 * If set to true, will always launch alert on errors
 */
Log.FORCE_ERROR_ALERT = false;

/**
 * Write info to log
 * @param e. Log data
 * @param al. If set, alert info
 */
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

/**
 * Write warning to log
 * @param e. Log data
 * @param al. If set, alert warning
 */
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

/**
 * Write error to log
 * @param e. Log data
 * @param silent. If not set, alert on error
 */
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

/**
 * Write debug to log
 * @param e. Log data
 */
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

/**
 * Write debug to log
 * @param e. Log data
 */
Log.d = function(e){
	Log.debug(e);
};

/**
 * Write error to log
 * @param e. Log data
 * @param silent. If set, no alert on error
 */
Log.e = function(e, silent){
	Log.error(e, silent);
};

/**
 * Write warning to log
 * @param e. Log data
 * @param al. If set, alert on warning
 */
Log.w = function(e, al) {
	Log.warn(e, al);
};

/**
 * Write info to log
 * @param e. Log data
 * @param al. If set, alert on info
 */
Log.i = function(e, al){
	Log.info(e, al);
};