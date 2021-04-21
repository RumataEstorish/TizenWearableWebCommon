/*global $, ActionMenu, ToastMessage, List, Input, KeyboardModes, tau, Utils, SwipeList, tizen*/
/*jshint unused: false*/
/*jslint laxbreak: true*/

var actionMenu = null;
var toastMessage = null;
var model = null;
var list = null;

function showSwipeList(){
	tau.changePage('#swipeListPage');
}

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

function addListItem(){
	list.addItem($('<li class="li-has-multiline"><a href="#">Item2<span class="ui-li-sub-text">test</span></li>'), 5);
}

function showMultilineInput() {
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

	list = new List($('#main ul'));

	initActionMenu();
	toastMessage = new ToastMessage('popupToast', 'popupToastContent');
	new SwipeList('swipeListPage', function(evt) {
		alert('Swipe left: ' + evt.target.id);
	}, function(evt) {
		alert('Swipe right: ' + evt.target.id);
	});

	tizen.systeminfo.getPropertyValue("BUILD", function(res) {
		model = res.model;
	});

	window.addEventListener("tizenhwkey", function(ev) {
		if (ev.keyName === "back") {

			if (actionMenu.isOpened) {
				actionMenu.close();
				return;
			}

			switch (Utils.getActivePage()) {
			case 'main':
				tizen.application.getCurrentApplication().exit();
				break;
			case 'swipeListPage':
				tau.changePage('#main');
				break;
			}
		}
	});
});