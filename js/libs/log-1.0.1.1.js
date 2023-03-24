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
 * Write debug to log
 * @param d. Log data
 */
Log.debug = function(d){
	if (!Log.DEBUG){
		return;
	}
	console.debug(d);
	if (Log.ITEM){
		Log.ITEM.append('d: ' + d + '\
				');
	}
};


/**
 * Write info to log
 * @param i. Log data
 * @param al. If set, alert info
 */
Log.info = function(i, al){
	console.info(i);
	if (al){
		alert(i);
	}
	if (Log.ITEM){
		Log.ITEM.append('i: ' + i + '\
				');
	}
};

/**
 * Write warning to log
 * @param w. Log data
 * @param al. If set, alert warning
 */
Log.warn = function(w, al){
	console.warn(w);
	if (al){
		alert(w);
	}
	if (Log.ITEM){
		Log.ITEM.append('w: ' + w + '\
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
 * @param d. Log data
 */
Log.d = function(d){
	Log.debug(d);
};

/**
 * Write info to log
 * @param i. Log data
 * @param al. If set, alert on info
 */
Log.i = function(i, al){
	Log.info(i, al);
};

/**
 * Write warning to log
 * @param w. Log data
 * @param al. If set, alert on warning
 */
Log.w = function(w, al) {
	Log.warn(w, al);
};

/**
 * Write error to log
 * @param e. Log data
 * @param silent. If set, no alert on error
 */
Log.e = function(e, silent){
	Log.error(e, silent);
};