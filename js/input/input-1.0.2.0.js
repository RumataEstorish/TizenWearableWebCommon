/*global $, Utils, GearModel, pickText, KeyboardModes, tau*/
/*jslint laxbreak: true*/

/**
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

Input.INPUT_FIELDS = '<div id="inputSquarePage" class="ui-page"><link rel="stylesheet" href="js/input/inputStyleSquare.css"><div id="inputSquareContent" class="ui-content input-content">'
		+ '<textarea id="inputSquareArea" class="input-area"></textarea><input type="text" id="inputSquareAreaOneLine" class="input-area" />'
		+ '<button id="confirmButton" class="confirm-button"></button></div><footer class="ui-footer ui-bottom-button ui-fixed" id="confirmFooter">' + '<button class="ui-btn ui-btn-icon-only confirm-button-footer"></button></footer>	</div>'
		+ '<div id="inputCirclePage" class="ui-page"> <link rel="stylesheet" media="all and (-tizen-geometric-shape: circle)" href="js/input/inputStyleCircle.css">'
		+ '<div class="ui-content"> <div id="inputContentCircle" class="input-content"> <textarea id="inputCircleArea" class="input-area"></textarea>'
		+ '<input type="text" id="inputCircleAreaOneLine" class="input-area" /><button id="confirmCircleButton" class="confirm-button"></button></div></div></div>';


/**
 * Constructor of class Input
 * @param model - model of Gear. You can get it following way:
 * 	tizen.systeminfo.getPropertyValue('BUILD', function(res) {
		model = res.model;
	});
 */
function Input(model) {

	try {
		
		if (!$('#inputSquarePage').length){
			$('body').append(Input.INPUT_FIELDS);
		}
		
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
			set : function(val) {
				mode = val;
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
					if (inputField) {
						inputField.removeClass("input-area-active");
					}
					return;
				}

				if (window.innerHeight < self.windowStartHeight) {
					inputField.addClass("input-area-active");

				}
				if (window.innerHeight >= self.windowStartHeight) {
					if (inputField) {
						inputField.removeClass("input-area-active");
					}
				}
			} catch (e) {
				alert(e);
			}
		});
		
		
		var handleBack = function(e){
			if (e.keyName === "back") {
				if (Input.isInputPage()) {
					self.cancel();
				}
			}
		};
		

		$("#confirmButton").off("click");
		$("#confirmFooter").off("click");
		$("#confirmCircleButton").off("click");
		$("#confirmCircleButton").show();
		
		$('#inputSquarePage').on('pageshow', function(){
			document.addEventListener('tizenhwkey', handleBack);	
		});
		
		$('#inputCirclePage').on('pageshow', function(){
			document.addEventListener('tizenhwkey', handleBack);
		});
		
		$('#inputSquarePage').on('pagebeforehide', function(){
			$('#inputCircleArea').off('keypress');
			$('#inputCircleAreaOneLine').off('keypress');
			$("#inputSquareAreaOneLine").off('keypress');
			$("#inputSquareArea").off('keypress');
			document.removeEventListener('tizenhwkey', handleBack);
		});
		
		$('#inputCirclePage').on('pagebeforehide', function(){
			$('#inputCircleArea').off('keypress');
			$('#inputCircleAreaOneLine').off('keypress');
			$("#inputSquareAreaOneLine").off('keypress');
			$("#inputSquareArea").off('keypress');
			document.removeEventListener('tizenhwkey', handleBack);
		});
		
	} catch (e) {
		alert(e);
	}
}

/**
 * Returns $ active input field for manipulation. Depends on KeyboardModes and
 * square/circle style
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
 * @param t - text
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

		var processInputEnter = function(evt){
			if (self.mode === KeyboardModes.SINGLE_LINE){
				if (evt.which === 13){
					self.getText();
				}
			}			
		};
		
		
		$('#inputCircleArea').keypress(processInputEnter);
		$('#inputCircleAreaOneLine').keypress(processInputEnter);
		$("#inputSquareAreaOneLine").keypress(processInputEnter);
		$("#inputSquareArea").keypress(processInputEnter);
				
		
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
				$('#inputSquarePage').one('pageshow', function(){
					$("#inputSquareArea").focus();
				});
				break;
			case KeyboardModes.SINGLE_LINE:
				$("#inputSquareAreaOneLine").show();
				$("#inputSquareArea").hide();
				$("#inputSquareAreaOneLine").putCursorAtEnd();
				$('#inputSquarePage').one('pageshow', function(){
					$("#inputSquareAreaOneLine").focus();
				});
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

			tau.changePage("inputSquarePage");
			break;
		default:
			switch (this.mode) {
			case KeyboardModes.NORMAL:
				$("#inputCircleAreaOneLine").hide();
				$("#inputCircleArea").show();
				$("#inputCircleArea").putCursorAtEnd();
				$('#inputCirclePage').one('pageshow', function(){
					$("#inputCircleArea").focus();
				});
				
				break;
			case KeyboardModes.SINGLE_LINE:
				$("#inputCircleArea").hide();
				$("#inputCircleAreaOneLine").show();
				$("#inputCircleAreaOneLine").putCursorAtEnd();
				$('#inputCirclePage').one('pageshow', function(){
					$("#inputCircleAreaOneLine").focus();
				});
				break;
			}
			$(".input-area").prop("placeholder", placeholder);
			$(".input-area").val(text);

			$("#confirmCircleButton").one("click", function() {
				self.getText();
			});
			
			
			tau.changePage("inputCirclePage");

			
			break;
		}
	} catch (e) {
		alert(e);
	}
};