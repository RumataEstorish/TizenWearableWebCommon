/*global tizen*/
/*jshint unused: false*/
/*jslint laxbreak: true*/

/**
 * Check variable is function
 * 
 * @param functionToCheck
 * @returns true if function, false if not
 */
function isFunction(functionToCheck) {
	var getType = {};
	if (functionToCheck === null) {
		return false;
	}
	return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

/**
 * Keyboard modes
 */
var KeyboardModes = {
	// Normal mode allows multiline input and closes with tick button
	'NORMAL' : 0,
	// Input field contains asterisks instead of text, single line mode is on
	'PASSWORD' : 1,
	// Tick button is hidden and enter key works as tick button
	'SINGLE_LINE' : 2,
	properties : {
		0 : {
			name : "normal",
			value : 0,
			code : "N"
		},
		1 : {
			name : "password",
			value : 1,
			code : "P"
		},
		2 : {
			name : "single_line",
			value : 2,
			code : "S"
		}
	}
};

/**
 * Open keyboard and return result into callback
 * 
 * @param text,
 *            that should be shown in keyboard input field on open
 * @param mode -
 *            keyboard modes from enum
 * @param onsuccess -
 *            success input
 * @param onerror -
 *            error
 * @param oncancelled -
 *            user cancelled input
 */
function pickText(text, mode, onsuccess, onerror, oncancelled) {
	var appControl = null, appControlReplyCallback = null;

	// Onsuccess is necessary
	if (onsuccess === null || onsuccess === 'undefined' || !isFunction(onsuccess)) {
		throw "Onsuccess not defined";
	}

	if (onerror === null || onerror === 'undefined' || !isFunction(onerror)) {
		throw "Onerror not defined";
	}

	if (oncancelled !== null && !isFunction(oncancelled)) {
		throw "Oncancelled must be function";
	}

	// Creating app control
	switch (mode) {
	case KeyboardModes.NORMAL:
		appControl = new tizen.ApplicationControl("http://tizen.org/appcontrol/operation/pick", null, "input/keyboard", null,
				[ new tizen.ApplicationControlData("SET_TEXT", [ text ]) ]);
		break;
	case KeyboardModes.PASSWORD:
		appControl = new tizen.ApplicationControl("http://tizen.org/appcontrol/operation/pick", null, "input/keyboard", null, [
				new tizen.ApplicationControlData("SET_TEXT", [ text ]), new tizen.ApplicationControlData("SETTINGS", [ "PASSWORD" ]) ]);
		break;
	case KeyboardModes.SINGLE_LINE:
		appControl = new tizen.ApplicationControl("http://tizen.org/appcontrol/operation/pick", null, "input/keyboard", null, [
				new tizen.ApplicationControlData("SET_TEXT", [ text ]), new tizen.ApplicationControlData("SETTINGS", [ "SINGLE_LINE" ]) ]);
		break;
	}

	appControlReplyCallback = {
		// callee sent a reply
		onsuccess : function(data) {
			var i = 0;
			if (data === null || data.length === 0) {
				if (oncancelled !== null) {
					oncancelled();
				}
				return;
			}
			for (i = 0; i < data.length; i++) {
				if (data[i].key === "http://tizen.org/appcontrol/data/selected") {
					onsuccess(data[i].value[0]);
				}
			}

		},
		// callee returned failure
		onfailure : function() {	
				onerror("Callback failure");
		}
	};

	tizen.application.launchAppControl(appControl, null, null, function() {
			onerror("Please, install TypeGear from store. It's free.");
	}, appControlReplyCallback);
}