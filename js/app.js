/*global $, ActionMenu, ToastMessage, Input, KeyboardModes, tau, Utils, SwipeList, tizen, ContextMenu*/
/*jshint unused: false*/
/*jslint laxbreak: true*/

var actionMenu = null;
var toastMessage = null;
var model = null;
var list;

function showActionMenu() {
    actionMenu.show();
}

function showToastMessage() {
    toastMessage.show('This is TOAST!', 100);
}

function showInput() {
    var input = new Input(model);

    input.open('', 'Input text', KeyboardModes.SINGLE_LINE, function (txt) {
        alert('Input text: ' + txt);
        tau.changePage('#main');
    }, function () {
        alert('Input cancelled');
        tau.changePage('#main');
    }, function (e) {
        if (e === "Please, install TypeGear from store. It's free.") {
            alert('No typeGear installed');
        } else {
            alert(e);
        }

    });
}

function showMultilineInput() {
    var input = new Input(model);

    input.open('', 'Input text', KeyboardModes.NORMAL, function (txt) {
        alert('Input text: ' + txt);
        tau.changePage('#main');
    }, function () {
        alert('Input cancelled');
        tau.changePage('#main');
    }, function (e) {
        if (e === "Please, install TypeGear from store. It's free.") {
            alert('No typeGear installed');
        } else {
            alert(e);
        }

    });
}

function initActionMenu() {
    actionMenu = new ActionMenu('actionMenuPage', 'actionMenu', [{
        name: 'add_item',
        title: 'Add',
        image: 'images/add.png',
        onclick: function () {
            toastMessage.show('Add menu clicked');
        }
    }, {
        name: 'edit_item',
        title: 'Edit',
        image: 'images/edit.png',
        onclick: function () {
            toastMessage.show('Edit menu clicked');
        }
    }, {
        name: 'delete_item',
        title: 'Delete',
        image: 'images/delete.png',
        onclick: function () {
            toastMessage.show('Delete menu clicked');
        }
    }]);
}

function setupContextMenu(object) {
    new ContextMenu(object, function () {
            toastMessage.show('Context menu clicked');
        },
        function () {
            toastMessage.show('Context menu hold');
        });
}

$(window).on('load', function () {

    initActionMenu();

    toastMessage = new ToastMessage('popupToast', 'popupToastContent');

    list = new List($('#mainList'));

    var contextMenuObject = $('<li id="contextMenuLi" class="li-has-multiline"><label>Tap or hold for<span class="li-text-sub ui-li-sub-text">context menu</span></label></li>');

    list.add(contextMenuObject, 4);
    
    setupContextMenu(contextMenuObject);

    tizen.systeminfo.getPropertyValue("BUILD", function (res) {
        model = res.model;
    });

    window.addEventListener("tizenhwkey", function (ev) {
        if (ev.keyName === "back") {

            if (actionMenu.isOpened) {
                actionMenu.close();
                return;
            }

            switch (Utils.getActivePage()) {
                case 'main':
                    tizen.application.getCurrentApplication().exit();
                    break;
            }
        }
    });
});