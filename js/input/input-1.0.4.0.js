/*global $, Utils, GearModel, pickText, KeyboardModes, tau*/
/*jslint laxbreak: true*/

/**
 * v1.0.4.0 
 * watch active 2 input
 * optimized codes
 * v1.0.3.0 optimized input
 * v1.0.2.0 markup moved to code
 * v1.0.1.1 on resize inputField is set at beginning of method, check if inputField is empty on removeClass call
 * v1.0.1
 * Set mode to SINGLE_LINE forever for GearS due to keyboard bug
 * Changed properties signatures to Object.defineProperty
 * In open method use of mode property of class instead of argument
 * On window resise when closing keyboard, removes input-area-active class
 * v1.0.0
 * Initial release
 */

/**
 * Input wrapper. Shows input field depending on Gear model and preferred
 * settings
 * 
 * @param model -
 *            Gear model. If no model, then Gear S2 by default
 */

Input.SQUARE_STYLE = '<link rel="stylesheet" href="js/input/inputStyleSquare.css">';
Input.CIRCLE_STYLE = '<link rel="stylesheet" media="all and (-tizen-geometric-shape: circle)" href="js/input/inputStyleCircle.css">';

Input.SQUARE_INPUT_FIELD = '<div id="inputGearPage" class="ui-page">' + '<div id="inputGearContent" class="ui-content input-content">' + '<textarea id="inputGearArea" class="input-area"></textarea>'
		+ '<input type="text" id="inputGearAreaOneLine" class="input-area" />' + '<button id="confirmGearButton" class="confirm-button"></button>' + '</div>' + '<footer class="ui-footer ui-bottom-button ui-fixed" id="confirmGearFooter">'
		+ '<button class="ui-btn ui-btn-icon-only confirm-button-footer"></button>' + '</footer>' + '</div>';

Input.CIRCLE_INPUT_FIELD = '<div id="inputGearPage" class="ui-page">' + '<div class="ui-content">' + '<div id="inputGearContent" class="input-content">' + '<textarea id="inputGearArea" class="input-area"></textarea>'
		+ '<input type="text" id="inputGearAreaOneLine" class="input-area" />' + '<button id="confirmGearButton" class="confirm-button"></button>' + '</div>' + '</div>' + '</div>';

/**
 * Constructor of class Input
 * 
 * @param model -
 *            model of Gear. You can get it following way:
 *            tizen.systeminfo.getPropertyValue('BUILD', function(res) { model =
 *            res.model; });
 */
function Input(model) {

	var gearModel = Utils.getGearVersion(model), self = this, height = window.innerHeight, mode = KeyboardModes.SINGLE_LINE, oncancel = null, ontext = null;
	
	Object.defineProperty(this, 'oncancel', {
		get: function(){
			return oncancel;
		},
		set: function(val){
			oncancel = val;
		}
	});
		
	Object.defineProperty(this, 'ontext',{
		get: function() {
			return ontext;
		},
		set: function(val){
			ontext = val;
		}
	});

	// Model of watch. Returns GearModel enum value
	Object.defineProperty(this, 'gearModel', {
		get : function() {
			return gearModel;
		}
	});

	Object.defineProperty(this, "mode", {
		get : function() {
			if (gearModel === GearModel.GEAR_S) {
				return KeyboardModes.SINGLE_LINE;
			}
			return mode;
		},
		set : function(val) {
			mode = val;
		}
	});

	/**
	 * Returns $ active input field for manipulation. Depends on KeyboardModes
	 * and square/circle style
	 */
	Object.defineProperty(this, 'inputField', {
		get : function() {
			switch (this.mode) {
			case KeyboardModes.NORMAL:
				return $('#inputGearArea');
			default:
				return $('#inputGearAreaOneLine');
			}
		}
	});

	/**
	 * Start window height
	 */
	Object.defineProperty(this, "windowStartHeight", {
		get : function() {
			return height;
		}
	});

	/**
	 * Model of Gear
	 */
	Object.defineProperty(this, "model", {
		get : function() {
			return model;
		}
	});

	switch (self.gearModel) {
	case GearModel.GEAR_1:
	case GearModel.GEAR_2:
		break;
	case GearModel.GEAR_S:
		if (!$('#inputGearPage').length) {
			$('head').append(Input.SQUARE_STYLE);
			$('body').append(Input.SQUARE_INPUT_FIELD);
		}
		break;
	default:
		if (!$('#inputGearPage').length) {
			$('head').append(Input.CIRCLE_STYLE);
			$('body').append(Input.CIRCLE_INPUT_FIELD);
		}
	}

	var windowOnResize = function() {
		var placeholder = "", inputField = self.inputField;

		switch (self.gearModel) {
		case GearModel.GEAR_S:
			if (window.innerHeight < self.windowStartHeight) {
				$("#confirmGearButton").show();
				$("#confirmGearFooter").hide();
			}
			if (window.innerHeight >= self.windowStartHeight) {
				$("#confirmGearButton").hide();
				$("#confirmGearFooter").show();
			}
			break;
		default:
			if (window.innerHeight < self.windowStartHeight) {
				placeholder = inputField.prop("placeholder");
				inputField.prop("placeholder", "");
				$("#confirmGearButton").hide();
				$("#inputGearContent").addClass("input-content-active");
			}
			if (window.innerHeight >= self.windowStartHeight) {
				$("#confirmGearButton").show();
				inputField.prop("placeholder", placeholder);
				$("#inputGearContent").removeClass("input-content-active");
			}
			break;
		}

		if (window.innerHeight < self.windowStartHeight) {
			if (self.gearModel === GearModel.GEAR_WATCH_ACTIVE_2) {
				$('#inputGearContent').css({
					opacity : 1
				});
			}
			inputField.addClass("input-area-active");

		}
		if (window.innerHeight >= self.windowStartHeight) {
			if (inputField) {
				if (self.gearModel === GearModel.GEAR_WATCH_ACTIVE_2) {
					$('#inputGearContent').css({
						opacity : 0
					});
					self.cancel();
				}
				inputField.removeClass("input-area-active");
			}
		}
	};

	$(window).on("resize", windowOnResize);

	var handleBack = function(e) {
		if (e.keyName === "back") {
			if (Input.isInputPage()) {
				self.cancel();
			}
		}
	};

	$("#confirmGearButton").off("click");
	$("#confirmGearFooter").off("click");
	$("#confirmGearButton").show();

	$('#inputGearContent').off('click');
	$('#inputGearPage').off('pageshow');

	$('#inputGearPage').on('pageshow', function() {
		document.addEventListener('tizenhwkey', handleBack);
	});

	$('#inputGearPage').on('pagebeforehide', function() {
		$('#inputGearArea').off('keypress');
		$('#inputGearAreaOneLine').off('keypress');
		$(window).off('resize', windowOnResize);
		document.removeEventListener('tizenhwkey', handleBack);
	});
}

/**
 * Checks if active page belongs to input pages
 * 
 * @returns {Boolean} true is input page
 */
Input.isInputPage = function() {
	return Utils.getActivePage() === 'inputGearPage';
};

/**
 * Getting text from input field. Also fires ontext event
 * 
 * @returns text string
 */
Input.prototype.getText = function() {
	var text = this.inputField.val();
	if (this.text) {
		this.text(text);
	}
	return text;
};

/**
 * Fires ontext event
 * 
 * @param t -
 *            text
 */
Input.prototype.text = function(t) {
	tau.back();
	if (this.ontext) {
		this.ontext(t);
	}
};

/**
 * Fires cancel event
 */
Input.prototype.cancel = function() {
	tau.back();
	if (this.oncancel) {
		this.oncancel();
	}
};

/**
 * Open input window
 * 
 * @param text -
 *            text to be set in input field. Can be empty.
 * @param placeholder -
 *            placeholder text. Can be empty.
 * @param mode -
 *            KeyboardModes. Sets field is multiline or singleline
 * @param ontext -
 *            text ready event
 * @param oncancel -
 *            cancel event.
 * @param onerror -
 *            error event.
 */
Input.prototype.open = function(text, placeholder, mode, ontext, oncancel, onerror) {

	var self = this;

	this.mode = mode;
	this.ontext = ontext;
	this.oncancel = oncancel;

	var processInputEnter = function(evt) {
		if (self.mode === KeyboardModes.SINGLE_LINE) {
			if (evt.which === 13) {
				self.getText();
				return;
			}
		}

		// Workaround for watch active 2
		switch (self.gearModel) {
		case GearModel.GEAR_WATCH_ACTIVE_2:
			switch (evt.which) {
			// Backspace
			case 8:
				var text = self.inputField.val();
				if (text.length === 0) {
					return;
				}
				self.inputField.val(text.substring(0, text.length - 1));
				break;
			default:
				self.inputField.val(self.inputField.val() + evt.key);
				break;
			}
			self.inputField.putCursorAtEnd();
		}
	};

	$('#inputGearArea').keypress(processInputEnter);
	$('#inputGearAreaOneLine').keypress(processInputEnter);

	// Workaround for Watch Active 2
	if (self.gearModel === GearModel.GEAR_WATCH_ACTIVE_2) {
		$('#inputGearContent').css({
			opacity : 0
		});
		// Force single line for Watch Active 2
		this.mode = KeyboardModes.SINGLE_LINE;
	}
	
	// Force single line for Gear S because of glitch
	if (self.gearModel === GearModel.GEAR_S){
		this.mode = KeyboardModes.SINGLE_LINE;
	}

	switch (self.gearModel) {
	case GearModel.GEAR_1:
	case GearModel.GEAR_2:
		pickText(text, KeyboardModes.SINGLE_LINE, ontext, onerror, oncancel);
		return;
	default:
		switch (this.mode) {
		case KeyboardModes.NORMAL:
			$("#inputGearAreaOneLine").hide();
			$("#inputGearArea").show();
			$("#inputGearArea").putCursorAtEnd();
			$('#inputGearPage').one('pageshow', function() {
				$("#inputGearArea").focus();
			});
			break;
		case KeyboardModes.SINGLE_LINE:
			$("#inputGearAreaOneLine").show();
			$("#inputGearArea").hide();
			$("#inputGearAreaOneLine").putCursorAtEnd();
			$('#inputGearPage').one('pageshow', function() {
				$("#inputGearAreaOneLine").focus();
			});
			break;
		}
		$(".input-area").prop("placeholder", placeholder);
		$(".input-area").val(text);
		$("#confirmGearButton").one("click", function() {
			self.getText();
		});
		$("#confirmGearFooter").one("click", function() {
			self.getText();
		});

		tau.changePage("inputGearPage");
		break;
	}
};