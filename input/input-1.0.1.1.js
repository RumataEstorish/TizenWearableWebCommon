/*global $, Utils, GearModel, pickText, KeyboardModes, tau*/

/**
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
 * Input wrapper. Shows input field depending on Gear model and preferred settings
 * 
 * @param model -
 *            Gear model. If no model, then Gear S2 by default
 */
function Input(model) {

	try {
		var self = this, height = window.innerHeight, mode = KeyboardModes.SINGLE_LINE;

		this.oncancel = null;
		this.onerror = null;
		this.ontext = null;

		this.inputField = null;

		Object.defineProperty(this, "mode", {
			get : function() {
				if (Utils.getGearVersion(model) === GearModel.GEAR_S) {
					return KeyboardModes.SINGLE_LINE;
				}
				return mode;
			},
			set : function(val){
				mode = val;
			}
		});

		Object.defineProperty(this, "windowStartHeight", {
			get : function() {
				return height;
			}
		});

		Object.defineProperty(this, "model", {
			get : function() {
				return model;
			}
		});

		$(window).on("resize", function() {
			var placeholder = "", page = Utils.getActivePage(), inputField = self.getInputField();

			try {
				switch (page) {
				case 'inputCirclePage':
					try {
						if (window.innerHeight < self.windowStartHeight) {
							placeholder = inputField.prop("placeholder");
							inputField.prop("placeholder", "");
							$("#confirmCircleButton").hide();
							$("#inputContentCircle").addClass("input-content-active");
						}
						if (window.innerHeight >= self.windowStartHeight) {
							$("#confirmCircleButton").show();
							inputField.prop("placeholder", placeholder);
							$("#inputContentCircle").removeClass("input-content-active");
						}
					} catch (e) {
						alert(e);
					}
					break;
				case 'inputSquarePage':
					if (window.innerHeight < self.windowStartHeight) {
						$("#confirmButton").show();
						$("#confirmFooter").hide();
					}
					if (window.innerHeight >= self.windowStartHeight) {
						$("#confirmButton").hide();
						$("#confirmFooter").show();
					}
					break;
				default:
					if (inputField){
						inputField.removeClass("input-area-active");
					}
					return;
				}

				if (window.innerHeight < self.windowStartHeight) {
					inputField.addClass("input-area-active");

				}
				if (window.innerHeight >= self.windowStartHeight) {
					if (inputField){
						inputField.removeClass("input-area-active");
					}
				}
			} catch (e) {
				alert(e);
			}
		});

		document.addEventListener('tizenhwkey', function(e) {
			if (e.keyName === "back") {
				if (Input.isInputPage()) {
					self.cancel();
				}
			}
		});

		$("#confirmButton").off("click");
		$("#confirmFooter").off("click");
		$("#confirmCircleButton").off("click");
		$("#confirmCircleButton").show();
	} catch (e) {
		alert(e);
	}
}

/**
 * Returns $ active input field for manipulation. Depends on KeyboardModes and square/circle style
 * 
 * @returns $ object
 */
Input.prototype.getInputField = function() {
	try {
		var page = Utils.getActivePage();

		switch (this.mode) {
		case KeyboardModes.NORMAL:
			if (page === 'inputCirclePage') {
				return $("#inputCircleArea");
			}
			return $("#inputSquareArea");
		case KeyboardModes.SINGLE_LINE:
			if (page === 'inputCirclePage') {
				return $("#inputCircleAreaOneLine");
			}
			return $("#inputSquareAreaOneLine");
		}
	} catch (e) {
		alert(e);
	}
};

/**
 * Checks if active page belongs to input pages
 * 
 * @returns {Boolean} true is input page
 */
Input.isInputPage = function() {
	return Utils.getActivePage() === 'inputSquarePage' || Utils.getActivePage() === 'inputCirclePage';
};

/**
 * Getting text from input field. Also fires ontext event
 * 
 * @returns text string
 */
Input.prototype.getText = function() {
	var text = this.getInputField().val();
	if (this.text) {
		this.text(text);
	}
	return text;
};

/**
 * Fires ontext event
 * 
 * @param t
 */
Input.prototype.text = function(t) {
	tau.back();
	if (this.ontext) {
		this.ontext(t);
	}
};

/**
 * Fires onerror event
 */
Input.prototype.error = function(e) {
	if (this.onerror) {
		this.onerror(e);
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

	try {
		var model = Utils.getGearVersion(this.model), self = this;

		this.mode = mode;
		this.ontext = ontext;
		this.onerror = onerror;
		this.oncancel = oncancel;

		switch (model) {
		case GearModel.GEAR_1:
		case GearModel.GEAR_2:
			pickText(text, KeyboardModes.SINGLE_LINE, ontext, onerror, oncancel);
			return;
		case GearModel.GEAR_S:
			switch (this.mode) {
			case KeyboardModes.NORMAL:
				$("#inputSquareAreaOneLine").hide();
				$("#inputSquareArea").show();
				break;
			case KeyboardModes.SINGLE_LINE:
				$("#inputSquareAreaOneLine").show();
				$("#inputSquareArea").hide();
				$("#inputSquareAreaOneLine").putCursorAtEnd();
				break;
			}
			$(".input-area").prop("placeholder", placeholder);
			$(".input-area").val(text);
			$("#confirmButton").one("click", function() {
				self.getText();
			});
			$("#confirmFooter").one("click", function() {
				self.getText();
			});
			$("#inputSquareContent").focus();
			tau.changePage("inputSquarePage");
			break;
		default:
			switch (this.mode) {
			case KeyboardModes.NORMAL:
				$("#inputCircleAreaOneLine").hide();
				$("#inputCircleArea").show();
				$("#inputCircleArea").putCursorAtEnd();
				break;
			case KeyboardModes.SINGLE_LINE:
				$("#inputCircleArea").hide();
				$("#inputCircleAreaOneLine").show();
				$("#inputCircleAreaOneLine").putCursorAtEnd();
				break;
			}
			$(".input-area").prop("placeholder", placeholder);
			$(".input-area").val(text);

			$("#confirmCircleButton").one("click", function() {
				self.getText();
			});
			$("#inputContentCircle").focus();
			tau.changePage("inputCirclePage");
			break;
		}
	} catch (e) {
		alert(e);
	}
};