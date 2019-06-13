/*global $, ActionMenu, ToastMessage*/
/*jshint unused: false*/
/*jslint laxbreak: true*/

var actionMenu = null;
var toastMessage = null;

function showActionMenu() {
	actionMenu.show();
}

function showToastMessage() {
	toastMessage.show('This is TOAST!', 100);
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
		onclick : function(){
			toastMessage.show('Delete menu clicked');
		}
	} ]);
}

$(window).on('load', function(){

	initActionMenu();
	toastMessage = new ToastMessage('popupToast', 'popupToastContent');

	window.addEventListener("tizenhwkey", function(ev) {
		var activePopup = null, page = null, pageid = "";

		if (ev.keyName === "back") {
			
			if (actionMenu.isOpened){
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