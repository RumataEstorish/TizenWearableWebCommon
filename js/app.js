/*global $, ActionMenu, ToastMessage, Input, KeyboardModes, tau*/
/*jshint unused: false*/
/*jslint laxbreak: true*/

var actionMenu = null;
var toastMessage = null;
var model = null;

function showActionMenu() {
	actionMenu.show();
}

function showToastMessage() {
	toastMessage.show('This is TOAST!', 100);
}

function showInput() {
	var input = new Input(model);

	input.open('', 'Input text', KeyboardModes.SINGLE_LINE, function(txt) {
		alert('Input text: ' + txt);
		tau.changePage('#main');
	}, function() {
		alert('Input cancelled');
		tau.changePage('#main');
	}, function(e) {
		if (e === "Please, install TypeGear from store. It's free.") {
			alert('No typeGear installed');
		} else {
			alert(e);
		}
		
	});
}

function showMultilineInput(){
	var input = new Input(model);

	input.open('', 'Input text', KeyboardModes.NORMAL, function(txt) {
		alert('Input text: ' + txt);
		tau.changePage('#main');
	}, function() {
		alert('Input cancelled');
		tau.changePage('#main');
	}, function(e) {
		if (e === "Please, install TypeGear from store. It's free.") {
			alert('No typeGear installed');
		} else {
			alert(e);
		}
		
	});
}

function initActionMenu() {
	actionMenu = new ActionMenu('actionMenuPage', 'actionMenu', [ {
		name : 'add_item',
		title : 'Add',
		image : 'images/add.png',
		onclick : function() {
			toastMessage.show('Add menu clicked');
		}
	}, {
		name : 'edit_item',
		title : 'Edit',
		image : 'images/edit.png',
		onclick : function() {
			toastMessage.show('Edit menu clicked');
		}
	}, {
		name : 'delete_item',
		title : 'Delete',
		image : 'images/delete.png',
		onclick : function() {
			toastMessage.show('Delete menu clicked');
		}
	} ]);
}

$(window).on('load', function() {

	initActionMenu();
	toastMessage = new ToastMessage('popupToast', 'popupToastContent');

	tizen.systeminfo.getPropertyValue("BUILD", function(res) {
		model = res.model;
	});

	window.addEventListener("tizenhwkey", function(ev) {
		var activePopup = null, page = null, pageid = "";

		if (ev.keyName === "back") {

			if (actionMenu.isOpened) {
				actionMenu.close();
				return;
			}

			activePopup = document.querySelector(".ui-popup-active");
			page = document.getElementsByClassName("ui-page-active")[0];
			pageid = page ? page.id : "";

			if (pageid === "main" && !activePopup) {
				try {
					tizen.application.getCurrentApplication().exit();
				} catch (ignore) {
				}
			} else {
				window.history.back();
			}
		}
	});
});