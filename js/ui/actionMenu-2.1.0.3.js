/*global tau, $, Utils*/
/*jshint loopfunc: true */

/**
 * 
 * REQUIRES: Utils, JQuery v2.0.0 removed opened property, changed constructor, removed level v1.1.3 bug fix v1.1.2 page, circleMenu, squareMenu can be set with # or without at beginning added isOpened alias for opened v1.1.1 bug fix v1.1.0 click on
 * center triggers onclick v1.0.1 added onclosed to close menu 2.0.0.1 fixed errors on hideMenuItem and showMenuItem if item not found menu page is added, if not exist 2.0.0.2 if close called and menu not opened, onclose fires
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

ActionMenu.POPUP_ICON_STYLE = '.popup-icon::before {position: absolute; content: ""; top: 0; left: 0; width: 100%; height: 100%; -webkit-mask-size: 100% 100%; background-color: rgb(89, 88, 91); -webkit-mask-repeat: no-repeat;}';

ActionMenu.addStyle = function(style) {
	var st = document.createElement('style');
	st.innerHTML = style;
	$('head').append(st);
};

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

	Object.defineProperty(this, "menuItems", {
		get : function() {
			return menuItems;
		}
	});

	Object.defineProperty(this, "popup", {
		get : function() {
			return _menuName;
		}
	});

	Object.defineProperty(this, "isOpened", {
		get : function() {
			return opened;
		},
		set : function(val) {
			opened = val;
		}
	});

	Object.defineProperty(this, "page", {
		get : function() {
			return _page;
		}
	});

	Object.defineProperty(this, "menuName", {
		get : function() {
			return _menuName;
		},
		set : function(val) {
			_menuName = val;
		}
	});

	Object.defineProperty(this, "prevPage", {
		get : function() {
			return prevPage;
		},
		set : function(val) {
			prevPage = val;
		}
	});

	Object.defineProperty(this, "clickBound", {
		get : function() {
			return clickBound;
		}
	});

	Object.defineProperty(this, "selectorElement", {
		get : function() {
			return selectorElement;
		},
		set : function(val) {
			selectorElement = val;
		}
	});
}

ActionMenu.prototype.createMenu = function() {
	var res = "", i = 0, self = this;

	if (!$(this.page).length) {
		$('body').append('<div class="ui-page" id="' + this.page.substring(1) + '"></div>');
	}

	if (tau.support.shape.circle) {
		if (!$(this.page + " " + this.menuName.substring(1)).length) {
			res = '<div id="' + this.menuName.substring(1) + '" class="ui-popup"><div id="selector" class="ui-selector">';

			for (i = 0; i < this.menuItems.length; i++) {
				if (this.menuItems[i].isHidden) {
					continue;
				}
				ActionMenu.addStyle('.' + this.menuItems[i].name + '::before {-webkit-mask-image: url(' + (this.menuItems[i].image[0] === '/' ? this.menuItems[i].image : '/' + this.menuItems[i].image) + ');}');
				res += '<div class="ui-item popup-icon ' + this.menuItems[i].name + '" data-title="' + this.menuItems[i].title + '" id="' + this.menuItems[i].name + '"></div>';
			}
			res += '</div>';
		}
	} else {
		res = '<div id="' + this.menuName.substring(1) + '" class="ui-popup" data-transition="slideup"><div class="ui-popup-content"><ul class="ui-listview">';
		for (i = 0; i < this.menuItems.length; i++) {
			if (this.menuItems[i].isHidden) {
				continue;
			}
			res += '<li id="' + this.menuItems[i].name + '"><a href="#">' + this.menuItems[i].title + '</a></li>';
		}
		res += '</ul></div></div></div>';
	}
	$(this.page).append(res);
	for (i = 0; i < this.menuItems.length; i++) {
		(function(i){
			$("#" + self.menuItems[i].name).on("click", function() {
				self.close(function() {
					self.menuItems[i].onclick();
				});
			});	
		})(i);
		
	}
};

ActionMenu.prototype.getMenuItemByName = function(itemName) {
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

ActionMenu.prototype.hideMenuItem = function(itemName) {
	var menuItem = null;
	if (!itemName) {
		return;
	}
	menuItem = this.getMenuItemByName(itemName);
	if (!menuItem) {
		return;
	}
	menuItem.isHidden = true;
	if ($("#" + menuItem.name).length) {
		menuItem.jContent = $("#" + menuItem.name);
		if (tau.support.shape.circle) {
			menuItem.jContent.remove();
		} else {
			menuItem.jContent.parent().hide();
		}
	}
};

ActionMenu.prototype.showMenuItem = function(itemName) {
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
		menuItem.jContent.on('click', function() {
			self.close(function() {
				menuItem.onclick();
			});
		});
	} else {
		$(this.menuName + " #selector").append(menuItem.jContent);
		menuItem.jContent.on('click', function() {
			self.close(function() {
				menuItem.onclick();
			});
		});
	}

	menuItem.jContent = null;
};

function elementClick(event) {
	if (!event || !event.target || !event.target.classList.contains('ui-selector-indicator')) {
		return;
	}
	var activeItem = $(event.target).parent().find(".ui-item-active").eq(0);
	activeItem.trigger('click');
}

ActionMenu.prototype.show = function() {
	var self = this, touchStart = false, openPopup = function() {

		try {
			$(self.popup).one("popuphide", function() {
				if (self.isOpened === true) {
					self.close();
				}
			});
			tau.openPopup(self.popup);
		} catch (e) {
			alert(e);
		}
	};
	this.createMenu();

	if (tau.support.shape.circle) {
		this.selectorElement = $(this.menuName + " #selector");
		this.selector = tau.widget.Selector(this.selectorElement[0], {
			itemRadius : window.innerHeight / 2 * 0.8
		});

		if (!this.selector) {
			return;
		}

		this.selectorElement.on('touchstart', function(){
			touchStart = true;
		});
				
		this.selectorElement.on("click", function(event) {
			if (touchStart === false){
				return;
			}
			if (!event || !event.target || !event.target.classList.contains('ui-selector-indicator')) {
				return;
			}
			touchStart = false;
			
			var activeItem = $(event.target).parent().find(".ui-item-active").eq(0);
			self.close(function() {
				self.getMenuItemByName(activeItem.prop('id')).onclick();
			});
		});
	}

	this.isOpened = true;

	this.prevPage = Utils.getActivePage();
	if ("#" + Utils.getActivePage() !== this.page) {
		$(this.page).one("pageshow", function() {
			openPopup();
		});

		tau.changePage(this.page, {
			transition : 'pop',
			referse : false
		});
	} else {
		openPopup();
	}

};

/**
 * Закрывает меню и показывает страницу, с которого оно было вызвано
 * 
 * @param backMenu.
 *            По-умолчанию ставится в true. Если попап был закрыт через кнопку назад, то возвращается на страницу, которая вызвала меню. В противном случае туда не переходит
 */
ActionMenu.prototype.close = function(onclosed) {
	var self = this;

	if (!this.isOpened) {
		if (onclosed) {
			onclosed();
		}
		return;
	}
	this.isOpened = false;

	if (tau.support.shape.circle && this.selector) {
		// this.selector.element.removeEventListener("click", elementClick);
		// this.selectorElement.off();
		this.selector.destroy();
	}

		tau.closePopup(this.popup);
		
		$(self.page + " " + self.menuName).remove();
		$(self.page + ' .ui-popup-overlay').remove();

		
		if (self.prevPage !== self.page) {
			/*if (onclosed) {
				$("#" + self.prevPage).one("pageshow", onclosed);
			}*/
			if (onclosed){
				$(this.page).one('pagehide', function(){
					onclosed();
				});
			}
			tau.changePage("#" + self.prevPage, {'transition' : 'none'});
		}
		else{
			if (onclosed){
				onclosed();
			}
		}



};