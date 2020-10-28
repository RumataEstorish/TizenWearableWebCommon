/*global tau, $, Utils*/
/*jshint loopfunc: true */

/**
 * 2.1.1.1
 * fixed setMenuItemVisibility now checks isVisible by !
 * 2.1.1.0
 * Support for tau 1.2.4
 * REQUIRES: Utils, JQuery v2.0.0+
 * 2.1.0.6
 * added setMenuItemVisibility
 * 2.1.0.4
 * commented code. Some cleanup
 * 2.1.0.3
 * previous page turning on after popup is closed
 * 2.1.0.2
 * fixed openning from context menu on Tizen 3.0
 * 2.1.0.1
 * bug fixed when creating menu for square profile
 * 2.1.0.0
 * removed onclose first argument
 * item click closes menu
 * 2.0.0.1
 * fixed errors on hideMenuItem and showMenuItem if item not found
 * menu page is added, if not exist
 */

/**
 * Internal style added to page
 */
ActionMenu.POPUP_ICON_STYLE = '.popup-icon::before {position: absolute; content: ""; top: 0; left: 0; width: 100%; height: 100%; -webkit-mask-size: 100% 100%; background-color: rgb(89, 88, 91); -webkit-mask-repeat: no-repeat;}';

/**
 * Internal.
 */
ActionMenu.addStyle = function (style) {
	var st = document.createElement('style');
	st.innerHTML = style;
	$('head').append(st);
};

/**
 * Constructor of ActionMenu class
 *
 * @param page -
 *            name of page where menu created. Better to use unique
 * @param menuName -
 *            name of menu element inside page
 * @param menuItems -
 *            array of menu items following class: { name : Unique name of menu
 *            item to manipulate it, icon : path to icon, onclick : function
 *            link when click event, title : display name of menu item}
 */
function ActionMenu(page, menuName, menuItems) {
	var i = 0, _page = page[0] === "#" ? page : "#" + page, _menuName = menuName[0] === "#" ? menuName : "#" + menuName, prevPage = null, opened = false, clickBound = elementClick.bind(null), selectorElement = null;

	if (!menuItems.length || menuItems.length === 0) {
		throw 'Menu items must be array';
	}

	ActionMenu.addStyle(ActionMenu.POPUP_ICON_STYLE);

	for (i = 0; i < menuItems.length; i++) {
		menuItems[i].id = i;
		if (!menuItems[i].name) {
			throw 'Menu item name not set';
		}
		if (!menuItems[i].title) {
			throw 'Menu item "' + menuItems[i].name + '" title not set';
		}
		if (!menuItems[i].onclick) {
			throw 'Menu item "' + menuItems[i].name + '" onclick not set';
		}
		if (tau.support.shape.circle) {
			if (!menuItems[i].image) {
				throw 'Menu item "' + menuItems[i].name + '" image not set';
			}
		}
	}

	/**
	 * List of menu items
	 */
	Object.defineProperty(this, "menuItems", {
		get: function () {
			return menuItems;
		}
	});

	/**
	 * Popup object
	 */
	Object.defineProperty(this, "popup", {
		get: function () {
			return _menuName;
		}
	});

	/**
	 * Check if menu is visible for user
	 */
	Object.defineProperty(this, "isOpened", {
		get: function () {
			return opened;
		},
		set: function (val) {
			opened = val;
		}
	});

	/**
	 * Menu's page
	 */
	Object.defineProperty(this, "page", {
		get: function () {
			return _page;
		}
	});

	/**
	 * Menu's name
	 */
	Object.defineProperty(this, "menuName", {
		get: function () {
			return _menuName;
		},
		set: function (val) {
			_menuName = val;
		}
	});

	/**
	 * Internal. Previous page where menu should open after it's closed
	 */
	Object.defineProperty(this, "prevPage", {
		get: function () {
			return prevPage;
		},
		set: function (val) {
			prevPage = val;
		}
	});

	/**
	 * Internal.
	 */
	Object.defineProperty(this, "clickBound", {
		get: function () {
			return clickBound;
		}
	});

	/**
	 * Internal
	 */
	Object.defineProperty(this, "selectorElement", {
		get: function () {
			return selectorElement;
		},
		set: function (val) {
			selectorElement = val;
		}
	});
}

/**
 * Get menu item by name
 *
 * @param itemName
 * @returns menu item
 */
ActionMenu.prototype.getMenuItemByName = function (itemName) {
	var i = 0;

	if (!itemName) {
		return;
	}

	for (i = 0; i < this.menuItems.length; i++) {
		if (this.menuItems[i].name === itemName) {
			return this.menuItems[i];
		}
	}
};

ActionMenu.prototype.setMenuItemVisibility = function (itemName, isVisible) {
	if (isVisible) {
		this.showMenuItem(itemName);
	} else {
		this.hideMenuItem(itemName);
	}
};

/**
 * Hide menu item from user
 *
 * @param itemName
 */
ActionMenu.prototype.hideMenuItem = function (itemName) {
	var menuItem = null;
	if (!itemName) {
		return;
	}
	menuItem = this.getMenuItemByName(itemName);
	if (!menuItem) {
		return;
	}
	// noinspection JSUnresolvedVariable
	var mi = $('#' + menuItem.name);
	menuItem.isHidden = true;
	if (mi.length) {
		menuItem.jContent = mi;
		if (tau.support.shape.circle) {
			menuItem.jContent.remove();
		} else {
			menuItem.jContent.parent().hide();
		}
	}
};

/**
 * Show menu item to user
 *
 * @param itemName
 */
ActionMenu.prototype.showMenuItem = function (itemName) {
	var menuItem = null, popup = null, id = -1, menuItemInsert = null, self = this;
	if (!itemName) {
		return;
	}
	menuItem = this.getMenuItemByName(itemName);
	if (!menuItem) {
		return;
	}
	menuItem.isHidden = false;
	if (!menuItem.jContent) {
		return;
	}

	if (!tau.support.shape.circle) {
		menuItem.jContent.parent().show();
		return;
	}

	popup = $(this.menuName + " .popup-icon");
	if (popup.length) {
		for (var i = 0; i < this.menuItems.length; i++) {
			// noinspection JSUnresolvedVariable
			if (this.menuItems[i].id < menuItem.id && id < menuItem.id && !this.menuItems[i].jConent) {
				id = this.menuItems[i].id;
				menuItemInsert = this.menuItems[i];
			}
		}
		if (id === -1) {
			$(this.menuName + " #selector").prepend(menuItem.jContent);
		} else {
			$("#" + menuItemInsert.name).after(menuItem.jContent);
		}
		menuItem.jContent.on('click', function () {
			self.close(function () {
				menuItem.onclick();
			});
		});
	} else {
		$(this.menuName + " #selector").append(menuItem.jContent);
		menuItem.jContent.on('click', function () {
			self.close(function () {
				menuItem.onclick();
			});
		});
	}

	menuItem.jContent = null;
};

/**
 * Internal
 */
function elementClick(event) {
	if (!event || !event.target || !event.target.classList.contains('ui-selector-indicator')) {
		return;
	}
	var activeItem = $(event.target).parent().find(".ui-item-active").eq(0);
	activeItem.trigger('click');
}

/**
 * Show menu to user
 */
ActionMenu.prototype.show = function () {
	var self = this, touchStart = false, openPopup = function () {

		try {
			$(self.popup).one("popuphide", function () {
				if (self.isOpened === true) {
					self.close();
				}
			});
			tau.openPopup(self.popup);
		} catch (e) {
			alert(e);
		}
	}, createMenu = function () {
		var res = "", i = 0;

		if (!$(self.page).length) {
			$('body').append('<div class="ui-page" id="' + self.page.substring(1) + '"></div>');
		}

		if (tau.support.shape.circle) {
			if (!$(self.page + " " + self.menuName.substring(1)).length) {
				res = '<div id="' + self.menuName.substring(1) + '" class="ui-popup" data-overlay="false"><div id="selector" class="ui-selector">';

				for (i = 0; i < self.menuItems.length; i++) {
					if (self.menuItems[i].isHidden) {
						continue;
					}
					ActionMenu.addStyle('.' + self.menuItems[i].name + '::before {-webkit-mask-image: url(' + (self.menuItems[i].image[0] === '/' ? self.menuItems[i].image : '/' + self.menuItems[i].image) + ');}');
					res += '<div class="ui-item popup-icon ' + self.menuItems[i].name + '" data-title="' + self.menuItems[i].title + '" id="' + self.menuItems[i].name + '"></div>';
				}
				res += '</div>';
			}
		} else {
			res = '<div id="' + self.menuName.substring(1) + '" class="ui-popup" data-transition="slideup"><div class="ui-popup-content"><ul class="ui-listview">';
			for (i = 0; i < self.menuItems.length; i++) {
				if (self.menuItems[i].isHidden) {
					continue;
				}
				res += '<li id="' + self.menuItems[i].name + '"><a href="#">' + self.menuItems[i].title + '</a></li>';
			}
			res += '</ul></div></div></div>';
		}
		$(self.page).append(res);
		for (i = 0; i < self.menuItems.length; i++) {
			(function (i) {
				$("#" + self.menuItems[i].name).on("click", function () {
					self.close(function () {
						self.menuItems[i].onclick();
					});
				});
			})(i);

		}
	};

	createMenu();

	if (tau.support.shape.circle) {
		this.selectorElement = $(this.menuName + " #selector");
		this.selector = tau.widget.Selector(this.selectorElement[0], {
			itemRadius: window.innerHeight / 2 * 0.8
		});

		if (!this.selector) {
			return;
		}

		this.selectorElement.on('touchstart', function () {
			touchStart = true;
		});

		this.selectorElement.on("click", function (event) {
			if (touchStart === false) {
				return;
			}
			if (!event || !event.target || !event.target.classList.contains('ui-selector-indicator')) {
				return;
			}
			touchStart = false;

			var activeItem = $(event.target).parent().find(".ui-item-active").eq(0);
			self.close(function () {
				self.getMenuItemByName(activeItem.prop('id')).onclick();
			});
		});
	}

	this.isOpened = true;

	this.prevPage = Utils.getActivePage();
	if ("#" + Utils.getActivePage() !== this.page) {
		$(this.page).one("pageshow", function () {
			openPopup();
		});

		tau.changePage(this.page, {
			transition: 'pop',
			referse: false
		});
	} else {
		openPopup();
	}

};

/**
 * Close menu and return to page where it was openned
 *
 * @param onclosed -
 *            callback fired when menu closed
 */
ActionMenu.prototype.close = function (onclosed) {
	var self = this;

	if (!this.isOpened) {
		if (onclosed) {
			onclosed();
		}
		return;
	}
	this.isOpened = false;

	if (tau.support.shape.circle && this.selector) {
		this.selector.destroy();
	}


	$(self.page).one('pagehide', function () {
		if (self.prevPage !== self.page) {
			tau.changePage("#" + self.prevPage, {
				'transition': 'none'
			});
		}
		if (onclosed) {
			onclosed();
		}
	});

	$(this.popup).one('popupbeforehide',function (){
		$(self.page + " " + self.menuName).remove();
		$(self.page + ' .ui-popup-overlay').remove();
		if (self.prevPage !== self.page) {
			tau.changePage("#" + self.prevPage, {
				'transition': 'none'
			});
		}
		else{
			tau.back();
		}
	});
	tau.closePopup(this.popup);



};