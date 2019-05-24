/*global $, tau*/
/*jslint bitwise: true */

/* v2.1.4.8
 * fixed stringToBoolean. returns defaultVal on error
 * v2.1.4.7 
 * bugfix
 * v2.1.4.6
 * added toYYYYMMDDTHHMMSS
 * tryParseInt
 * v2.1.4.5
 * added Gear Sport
 * v2.1.4.4
 * added hashCode function
 * v2.1.4.3
 * added stringToBoolean
 * v2.1.4.2
 * added Gear Fit 2 to models
 * v2.1.4.1
 * added Gear S3 to models
 * v2.1.4
 * added Date.toDateInputValue
 * added Date.toYYYYMMDD
 * added Date.toYYYYMMDDTHHMM
 * renamed generageUUID to generateUUID
 * v2.1.3
 * fixed createIndexScrollBar when list have no items
 * v2.1.2
 * added Date.prototype.toDisplayDateTime
 * added Date.prototype.toDisplayDate
 * added Date.prototype.toDisplayTime
 * v2.1.1
 * added getFileNameWithoutExtension
 * added getFileName
 * v2.1.0
 * fixed model definition if null
 * added putCursorAtEnd
 * added Gear S2 models
 * added generateUUID
 * added setTheme
 * added getTheme
 * added focusToEnd
 * jQuery required
 * fixed isNewGear
 * added getGearVersion
 * added createIndexScrollBar
 * v2.0.2
 * added appendHtmlAtCaret
 * v2.0.1
 * added isNewGear method 
 * v2.0.0
 * wrapped to class Utils
 * v1.0.2
 * added bytesToSize
 * v1.0.1
 * added dynamicSortMultiple
 * added getActivePage
 * added isString
 */

/*
 * Date for filling date input box
 */
Date.prototype.toDateInputValue = function() {
	var local = new Date(this);
	local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
	return local.toJSON().slice(0, 10);
};

Utils.tryParseInt = function(str,defaultValue) {
    var retValue = defaultValue;
    if(str !== null) {
        if(str.length > 0) {
            if (!isNaN(str)) {
                retValue = parseInt(str);
            }
        }
    }
    return retValue;
};


/**
 * Time for display without seconds
 * 
 * @returns {String}time in hh:mm and minutes with leading zero
 */
tizen.TZDate.prototype.toDisplayTime = function(){
	return this.getHours() + ":" + (this.getMinutes() < 10 ? "0" + this.getMinutes() : this.getMinutes());
};

/**
 * Date for display without year
 * 
 * @returns {String} date in dd.mm and month with leading zero
 */
tizen.TZDate.prototype.toDisplayDate = function() {
	return this.getDate() + "." + (this.getMonth() < 9 ? "0" + (this.getMonth() + 1) : this.getMonth() + 1);
};

/**
 * Time for display without seconds
 * 
 * @returns {String}time in hh:mm and minutes with leading zero
 */
Date.prototype.toDisplayTime = function() {
	return this.getHours() + ":" + (this.getMinutes() < 10 ? "0" + this.getMinutes() : this.getMinutes());
};

/**
 * Date for display without year
 * 
 * @returns {String} date in dd.mm and month with leading zero
 */
Date.prototype.toDisplayDate = function() {
	"use strict";
	return this.getDate() + "." + (this.getMonth() < 9 ? "0" + (this.getMonth() + 1) : this.getMonth() + 1);
};


Date.prototype.toYYYYMMDD = function(){
	var month = (this.getMonth() + 1), date = this.getDate();
	if (month < 10){
		month = "0" + month;
	}
	if (date < 10){
		date = "0" + date;
	}
	
	return this.getFullYear() + "-" + month + "-" + date;
};

/**
 * Date to UTC. Returns in YYY-MM-DDTHH:MM
 */
Date.prototype.toYYYYMMDDTHHMM = function(){
	var minutes = this.getMinutes(), hours = this.getHours();
	if (minutes < 10){
		minutes = "0" + minutes;
	}
	if (hours < 10){
		hours = "0" + hours;
	}
	
	return this.toYYYYMMDD() + "T" + hours + ":" + minutes;
};

tizen.TZDate.prototype.toYYYYMMDD = function(){
	var month = (this.getMonth() + 1), date = this.getDate();
	if (month < 10){
		month = "0" + month;
	}
	if (date < 10){
		date = "0" + date;
	}
	
	return this.getFullYear() + "-" + month + "-" + date;
};

tizen.TZDate.prototype.toYYYYMMDDTHHMM = function(){
	var minutes = this.getMinutes(), hours = this.getHours();
	
	if (hours < 10){
		hours = "0" + hours;
	}
	if (minutes < 10){
		minutes = "0" + minutes;
	}
	
	return this.toYYYYMMDD() + "T" + hours + ":" + minutes;
};

tizen.TZDate.prototype.toYYYYMMDDTHHMMSS = function() {
	var minutes = this.getMinutes(), hours = this.getHours(), seconds = this.getSeconds();

	if (hours < 10) {
		hours = "0" + hours;
	}
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	if (seconds < 10) {
		seconds = "0" + seconds;
	}

	return this.toYYYYMMDD() + "T" + hours + ":" + minutes + ":" + seconds;
};

/**
 * Date and time for display without year
 * 
 * @returns {String} dd.mm hh:MM, mm and MM with leading zero
 */
Date.prototype.toDisplayDateTime = function() {
	return this.toDisplayDate() + " " + this.toDisplayTime();
};

/**
 * Date and time for display without year
 * 
 * @returns {String} dd.mm hh:MM, mm and MM with leading zero
 */
tizen.TZDate.prototype.toDisplayDateTime = function() {
	return this.toDisplayDate() + " " + this.toDisplayTime();
};

var Theme = {
	'BLUE' : 0,
	'BROWN' : 1,
	properties : {
		0 : {
			name : "blue",
			value : 0,
			code : "BL"
		},
		1 : {
			name : "brown",
			value : 1,
			code : "BR"
		}
	}
};

var GearModel = {
	'GEAR_1' : 0,
	'GEAR_2' : 1,
	'GEAR_S' : 2,
	'GEAR_S2' : 3,
	'GEAR_S3' : 4,
	'GEAR_FIT2' : 5,
	'GEAR_SPORT' : 6,
	properties : {
		0 : {
			name : "gear_1",
			value : 0,
			code : "1"
		},
		1 : {
			name : "gear_2",
			value : 1,
			code : "2"
		},
		2 : {
			name : "gear_s",
			value : 2,
			code : "s"
		},
		3 : {
			name : "gear_s2",
			value : 3,
			code : "s2"
		},
		4 : {
			name : "gear_s3",
			value : 4,
			code : "s4"
		},
		5 : {
			name : "gear_fit2",
			value : 5,
			code : "f2"
		},
		6 : {
			name : 'gear_sport',
			value : 6,
			code : 'gs'
		}
	}
};

$.fn.focusToEnd = function() {
	return this.each(function() {
		var v = $(this).val();
		$(this).focus().val("").val(v);
	});
};

$.fn.putCursorAtEnd = function() {

	return this.each(function() {

		$(this).focus();

		// If this function exists...
		if (this.setSelectionRange) {
			// ... then use it (Doesn't work in IE)

			// Double the length because Opera is inconsistent about whether a carriage return is one character or two. Sigh.
			var len = $(this).val().length * 2;

			this.setSelectionRange(len, len);

		} else {
			// ... otherwise replace the contents with itself
			// (Doesn't work in Google Chrome)

			$(this).val($(this).val());

		}

		// Scroll to the bottom, in case we're in a tall textarea
		// (Necessary for Firefox and Google Chrome)
		this.scrollTop = 999999;

	});

};

function Utils() {
	this.temp = null;
}

Utils.THEME_STORAGE = "THEME";
Utils.AUDIO_MIME = "audio/*";
Utils.VIDEO_MIME = "video/*";
Utils.IMAGE_MIME = "image/*";
Utils.DOCS_MIME = "application/*";
Utils.OTHER_MIME = "*/*";
Utils.TEXT_MIME = "text/*";

/**
 * Get current stored theme
 * 
 * @returns Theme enum value
 */
Utils.getTheme = function() {
	switch (localStorage.getItem("THEME")) {
	case "0":
		return Theme.BLUE;
	case "1":
		return Theme.BROWN;
	default:
		return Theme.BLUE;
	}
};

/**
 * Get file name without extension
 * 
 * @param fileName -
 *            full file name with extension
 * @returns file name without extension
 */
Utils.getFileNameWithoutExtension = function(fileName) {
	return fileName.substr(0, fileName.lastIndexOf('.'));
};

/**
 * Get file name with extension
 * 
 * @param fileName -
 *            full file name
 * @returns file name with extension
 */
Utils.getFileName = function(fileName) {
	return fileName.substr(fileName.lastIndexOf("/") + 1);
};

/**
 * Set theme and store selected
 * 
 * @param themeLink -
 *            theme link
 * @param theme -
 *            new theme to set
 */
Utils.setTheme = function(themeLink, theme) {
	switch (theme) {
	case Theme.BLUE:
		$("#" + themeLink).attr("href", "lib/tau/wearable/theme/default/tau.min.css");
		break;
	case Theme.BROWN:
		$("#" + themeLink).attr("href", "lib/tau/wearable/theme/brown/tau.min.css");
		break;
	}
	localStorage.setItem("THEME", theme);
};

Utils.createIndexScrollBar = function(indexPage, indexScrollBar, listName) {
	var page = document.getElementById(indexPage), listviewElement = document.getElementById(listName), isCircle = tau.support.shape.circle, scroller, indexScrollbar;

	page.addEventListener("pageshow", function() {
		var indexScrollbarElement = document.getElementById(indexScrollBar), listDividers = listviewElement.getElementsByClassName("ui-listview-divider"), // list dividers
		dividers = {}, // collection of list dividers
		indices = [], // index list
		divider, i, idx;

		// For all list dividers,
		for (i = 0; i < listDividers.length; i++) {
			// Add the list divider elements to the collection
			divider = listDividers[i];
			idx = divider.innerText;
			dividers[idx] = divider;

			// Add the index to the index list
			indices.push(idx);
		}

		scroller = tau.util.selectors.getScrollableParent(listviewElement);

		if (!indexScrollbarElement || !indices) {
			return;
		}
		if (!isCircle) {
			indexScrollbar = new tau.widget.IndexScrollbar(indexScrollbarElement, {
				index : indices,
				container : scroller
			});
		} else {
			// Create IndexScrollbar
			indexScrollbar = new tau.widget.CircularIndexScrollbar(indexScrollbarElement, {
				index : indices
			});
			// Add SnapListview item "selected" event handler.
			listviewElement.addEventListener("selected", function(ev) {
				var indexValue = ev.target.textContent[0];
				indexScrollbar.value(indexValue);
			});
		}

		// Add IndexScrollbar index "select" event handler.
		indexScrollbarElement.addEventListener("select", function(ev) {
			var divider, idx = ev.detail.index;

			divider = dividers[idx];
			if (divider && scroller) {
				// Scroll to the ui-listview-divider element
				scroller.scrollTop = divider.offsetTop - scroller.offsetTop;
			}
		});
	});

	page.addEventListener("pagehide", function() {
		if (indexScrollbar) {
			indexScrollbar.destroy();
		}
	});
};

Utils.generateUUID = function() {
	var d = new Date().getTime(), uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = (d + Math.random() * 16) % 16 | 0;
		d = Math.floor(d / 16);
		return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
	});
	return uuid;
};

/**
 * Append html to div with contenteditable attribute
 */
Utils.appendHtmlAtCaret = function(html, selectPastedContent) {
	var sel, range;
	if (window.getSelection) {
		// IE9 and non-IE
		sel = window.getSelection();
		if (sel.getRangeAt && sel.rangeCount) {
			range = sel.getRangeAt(0);
			range.deleteContents();

			// Range.createContextualFragment() would be useful here but is
			// only relatively recently standardized and is not supported in
			// some browsers (IE9, for one)
			var el = document.createElement("div");
			el.innerHTML = html;
			var frag = document.createDocumentFragment(), node, lastNode;
			while ((node = el.firstChild)) {
				lastNode = frag.appendChild(node);
			}
			var firstNode = frag.firstChild;
			range.insertNode(frag);

			// Preserve the selection
			if (lastNode) {
				range = range.cloneRange();
				range.setStartAfter(lastNode);
				if (selectPastedContent) {
					range.setStartBefore(firstNode);
				} else {
					range.collapse(true);
				}
				sel.removeAllRanges();
				sel.addRange(range);
			}
		}
	} else if ((sel = document.selection) && sel.type !== 'Control') {
		// IE < 9
		var originalRange = sel.createRange();
		originalRange.collapse(true);
		sel.createRange().pasteHTML(html);
		if (selectPastedContent) {
			range = sel.createRange();
			range.setEndPoint("StartToStart", originalRange);
			range.select();
		}
	}
};

/**
 * Gets random integer number between min and max
 * 
 * @param min -
 *            minimum value
 * @param max -
 *            maximum value
 * @returns random integer number
 */
Utils.getRandomInt = function(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Get gear version
 * 
 * @param model -
 *            current gear model
 * @returns GearModel enum value
 */
Utils.getGearVersion = function(model) {
	if (!model) {
		return GearModel.GEAR_S2;
	}
	switch (model.toUpperCase()) {
	case "SM-R380":
	case "SM-R381":
		return GearModel.GEAR_2;
	case "SM-V700":
		return GearModel.GEAR_1;
	case "SM-R750":
	case "SM-R750A":
	case "SM-R750B":
	case "SM-R750D":
	case "SM-R750J":
	case "SM-R750T":
	case "SM-R750W":
	case "SM-R750V":
	case "SM-R750P":
		return GearModel.GEAR_S;
	case "SM-R720":
	case "SM-R730":
	case "SM-R732":
	case "SM-R735":
		return GearModel.GEAR_S2;
	case "SM-R770":
	case "SM-R760":
	case "SM-R765":
		return GearModel.GEAR_S3;
	case "SM-R360":
		return GearModel.GEAR_FIT2;
	case "SM-R600":
		return GearModel.GEAR_SPORT;
	default:
		return GearModel.GEAR_S3;
	}
};

/**
 * Check if GearS+
 * 
 * @param model -
 *            current model of Gear
 * @returns {Boolean} true if GearS+ models or false if older
 */
Utils.isNewGear = function(model) {
	switch (Utils.getGearVersion(model)) {
	case GearModel.GEAR_1:
	case GearModel.GEAR_2:
		return false;
	default:
		return true;
	}
};

/**
 * Get active page
 * 
 * @returns active page
 */
Utils.getActivePage = function() {
	var page = document.getElementsByClassName('ui-page-active')[0];

	return (page && page.id) || '';
};

/**
 * Convert bytes to size
 * 
 * @param bytes
 *            to convert
 * @returns size + dimension
 */
Utils.bytesToSize = function(bytes) {
	var k = 1000, sizes = [ 'Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB' ], i = 0;
	if (bytes === 0) {
		return '0 Byte';
	}
	i = Math.floor(Math.log(bytes) / Math.log(k));
	return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
};

/**
 * Check if object is string
 * 
 * @param o -
 *            object to check
 * @returns true if string, false if not
 */
Utils.isString = function(o) {
	return typeof o === "string" || (typeof o === "object" && o.constructor === String);
};

/**
 * Получение расширения файла
 * 
 * @param имя
 *            файла
 * @returns расширение файла
 */
Utils.getFileExtension = function(fname) {
	return fname.substr((~-fname.lastIndexOf(".") >>> 0) + 2).toLowerCase();
};

/**
 * Динамеческая сортировка массива
 * 
 * @param property
 * @returns {Function}
 * @example var People = [ {Name: "Name", Surname: "Surname"}, {Name:"AAA", Surname:"ZZZ"}, {Name: "Name", Surname: "AAA"} ]; People.sort(dynamicSort("Name")); People.sort(dynamicSort("Surname")); People.sort(dynamicSort("-Surname"));
 */
Utils.dynamicSort = function(property) {
	var sortOrder = 1;
	if (property[0] === "-") {
		sortOrder = -1;
		property = property.substr(1);
	}
	return function(a, b) {
		var result = null;
		if (Utils.isString(a[property]) && Utils.isString(b[property])) {
			result = (a[property].toLowerCase() < b[property].toLowerCase()) ? -1 : (a[property].toLowerCase() > b[property].toLowerCase()) ? 1 : 0;
		} else {
			result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
		}

		return result * sortOrder;
	};
};

Utils.dynamicSortMultiple = function() {
	/*
	 * save the arguments object as it will be overwritten note that arguments object is an array-like object consisting of the names of the properties to sort by
	 */

	var props = arguments;

	return function(obj1, obj2) {
		var i = 0, result = 0, numberOfProperties = props.length;
		/*
		 * try getting a different result from 0 (equal) as long as we have extra properties to compare
		 */
		while (result === 0 && i < numberOfProperties) {
			result = Utils.dynamicSort(props[i])(obj1, obj2);
			i++;
		}
		return result;
	};
};

String.prototype.startsWith = function(s) {
	if (this.indexOf(s) === 0) {
		return true;
	}
	return false;
};

/**
 * Converts string to boolean
 * @param val - string value to convert
 * @param defaultVal - default value when incorrect string. 
 * @returns - defaultVal if val not bool
 */
Utils.stringToBoolean = function(val, defaultVal) {
    if (val === true || val === false){
        return val;
    }
    if (val === "true") {
        return true;
    }
    if (val === "false") {
        return false;
    }
    return defaultVal;
};

/**
 * @returns {String} image/asterisk for images, audio/asterisk for sounds, video/asterisk for movies, application/asterisk for documents, text/asterisk for text files, and asterisk/asterisk for others
 */
Utils.getMime = function(fileName) {
	var extension = Utils.getFileExtension(fileName);

	switch (extension.toLowerCase()) {
	case "png":
	case "jpg":
	case "jpeg":
	case "tiff":
	case "ico":
	case "gif":
	case "svg":
	case "bmp":
		return Utils.IMAGE_MIME;
	case "avi":
	case "mp4":
	case "3gp":
	case "mpeg":
	case "flv":
	case "quicktime":
	case "wmv":
	case "webm":
	case "mov":
	case "qt":
		return Utils.VIDEO_MIME;
	case "mp3":
	case "ogg":
	case "wav":
	case "wma":
	case "oga":
		return Utils.AUDIO_MIME;
	case "odt":
	case "odp":
	case "ods":
	case "odg":
	case "xlsx":
	case "xlsm":
	case "xlsb":
	case "xltm":
	case "xlam":
	case "xls":
	case "xla":
	case "xlt":
	case "xlm":
	case "doc":
	case "dot":
	case "docx":
	case "ppt":
	case "pptx":
	case "pptm":
	case "potx":
	case "potm":
	case "ppam":
	case "ppsx":
	case "ppsm":
	case "sldx":
	case "sldm":
	case "pdf":
	case "fb2":
	case "epub":
	case "djvu":
	case "rtf":
		return Utils.DOCS_MIME;
	case "txt":
		return Utils.TEXT_MIME;
	default:
		return Utils.OTHER_MIME;
	}
};


Utils.hashCode = function(s){
	  return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a;},0);              
	};
	