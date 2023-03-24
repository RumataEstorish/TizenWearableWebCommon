/*global $, jQuery, tau*/

List.SCROLL_POSITION_DELAY = 50;

/**
 * Create a list based on tizen's ArcListView
 * @param listPage - page name or jquery page object where list is placed. List should be already present in html
 * @constructor
 */
function List(listPage) {
    var self = this;
    var page = listPage;

    this.tList = null;

    this._jList = null;

    this._count = 0;
    this._listItems = [];
    this._lastSelectedIndex = 0;


    if (listPage instanceof jQuery) {
        page = listPage;
    } else {
        if (listPage[0] === '#') {
            page = $(listPage);
        } else {
            page = $('#' + listPage);
        }
    }

    this._jList = page.find('ul');

    Object.defineProperties(this, {
        'listPage': {
            get: function () {
                return page;
            }
        },
        'tauList': {
            get: function () {
                return self.tList;
            }
        },
        'jQueryList': {
            get: function () {
                return $(self.tList._items).parent();
            }
        },
        'count': {
            get: function () {
                return self._count;
            }
        }
    });

    page.on('pagebeforehide', function () {
        self.destroy();
    });

    page.on('pagebeforeshow', function () {
        self._create();
    });

    page.on('pageshow', function () {
        if (self._lastSelectedIndex > 0) {
            setTimeout(function () {
                if (self.tauList) {
                    self.tauList.scrollToPosition(self._lastSelectedIndex, false);
                }
            }, List.SCROLL_POSITION_DELAY);
        }
    });

    page.on('change', function (event) {
        if (event.detail.selected || event.detail.selected === 0) {
            self._lastSelectedIndex = event.detail.selected;
        }
    });
}

String.prototype.toJQueryId = function () {
    if (this[0] === '#') {
        return this;
    }
    return '#' + this;
};

Number.prototype.toJQueryId = function(){
    return '#' + this.toString();
};

/**
 * Get html item by it's id.
 * IMPORTANT! There's no way to detect if list is ready and should be used with small delay (10-100ms)
 * after page is changed and items added
 * @param id
 * @returns jquery item
 */
List.prototype.getRootItemById = function (id) {
    return this.jQueryList.find(id.toJQueryId() + ' .ui-marquee-content, ' + id.toJQueryId() + ' .ui-marquee');
};

/**
 * Get html of first span in multiline list
 * IMPORTANT! There's no way to detect if list is ready and should be used with small delay (10-100ms)
 * after page is changed and items added
 * @param id
 * @returns jquery item
 */
List.prototype.getFirstSubByRootId = function (id) {
    return this.getRootItemById(id).parent().parent().find('span').eq(0);
};

/**
 * Get html of second span in 2 multiline list
 * IMPORTANT! There's no way to detect if list is ready and should be used with small delay (10-100ms)
 * after page is changed and items added
 * @param id
 * @returns jquery item
 */
List.prototype.getSecondSubByRootId = function (id) {
    return this.getRootItemById(id).parent().parent().find('span').eq(1);
};

List.prototype.getImageByRootId = function(id){
    return this.getRootItemById(id).parent().parent().find('img').eq(0);
};

List.prototype._create = function () {
    if (!tau.support.shape.circle) {
        if (this._jList instanceof jQuery) {
            this.tList = this._jList;
        } else {
            if (this._jList[0] === '#') {
                this.tList = $(this._jList);
            } else {
                this.tList = $('#' + this._jList);
            }
        }
        return;
    }
    var jqueryList;
    if (this._jList instanceof jQuery) {
        jqueryList = this._jList[0];
    } else {
        jqueryList = this._jList;
    }
    // Double check list was generated
    this.tList = tau.widget.ArcListview(jqueryList);
    if (!this.tList) {
        this.tList = tau.widget.ArcListview(jqueryList);
    }
};

/**
 * Add item to list
 * @param item to add
 * @param position to insert item at
 * @param dontRefresh if set to true, list not refreshes. Useful when add several items, but should be refreshed manually
 */
List.prototype.add = function (item, position, dontRefresh) {
    if (item instanceof jQuery) {
        if (!tau.support.shape.circle) {
            if (this.tList.children().length === 0 || position === 0) {
                this.tList.append(item);
            } else {
                this.tList.children().eq(position - 1).after(item);
            }
        } else {
            var html = item.html();
            this.tauList.addItem(html, position, $(item.prop('outerHTML').replace(html, '')).get(0));
        }
    } else {
        throw 'Only jquery element supported';
    }

    this._listItems.push(item);

    this._count++;

    if (!dontRefresh) {
        this.tList.refresh();
    }
};

/**
 * Add item to the end and refresh list
 * @param item to add
 */
List.prototype.append = function (item) {
    this.add(item, this.count);
};

/**
 * Batch add items to the end of list
 * @param items to add
 */
List.prototype.appendItems = function (items) {
    var self = this;
    items.forEach(function (item) {
        self.add(item, this.count, true);
    });
    this.tList.refresh();
};

/**
 * Remove item at specified position
 * @param position of item
 */
List.prototype.remove = function (position) {
    if (!tau.support.shape.circle) {
        this.tList.children().eq(position).remove();
        return;
    }

    this.tauList.removeItem(position);
    this._listItems.splice(position, 1);
    this._count--;
};

/**
 * Replace an item in specific position
 * @param item to replace
 * @param position of item
 */
List.prototype.replace = function (item, position) {
    this.remove(position);
    this._listItems[position] = item;
    this.add(item, position);
};

/**
 * Remove all items from list
 */
List.prototype.clear = function () {
    if (!tau.support.shape.circle) {
        this.tList.empty();
        return;
    }
    for (var i = this._count - 1; i >= 0; i--) {
        this.remove(i);
    }
    this._listItems = [];
    this._count = 0;
};

/**
 * Remove all items from. Alias to clear
 * @see clear
 */
List.prototype.empty = function () {
    this.clear();
};

/**
 * Clear list and destroy widget
 */
List.prototype.destroy = function () {
    this.clear();
    if (this.tauList) {
        this.tList.destroy();
    }
};

/**
 * This code from github issue https://github.com/Samsung/TAU/issues/1545
 * and it just works...
 */
tau.widget.wearable.ArcListview.prototype.removeItem = function (index) {
    var self = this,
        item,
        state,
        lastItem,
        prevItem = null,
        top,
        bottom,
        y;

    item = self._items[index];
    self._items.splice(index, 1);

    if (item) {
        state = self._state;

        y = state.items[0].y;
        top = state.items[0].rect.top;
        bottom = state.items[0].rect.bottom;
        // recalculate items on carousel
        state.items.forEach(function (item, loopIndex) {
            if (loopIndex !== index) {
                if (prevItem !== null) {
                    y += prevItem.height;
                    top += prevItem.rect.height;
                    bottom += prevItem.rect.height;
                }
                item.y = y;
                item.rect.top = top;
                item.rect.bottom = bottom;

                prevItem = item;
            }
        });

        // remove HTML element
        if (item && item.parentElement && item.parentElement.removeChild) {
            item.parentElement.removeChild(item);
        }
        // remove item from cache
        state.items.splice(index, 1);

        // set new item position on list;
        if (state.items.length > 1) {
            lastItem = state.items[state.items.length - 1];
            prevItem = state.items[state.items.length - 2];

            lastItem.y = prevItem.y + prevItem.height;
            lastItem.rect.bottom = prevItem.rect.bottom + prevItem.rect.height;
            lastItem.rect.top = prevItem.rect.top + prevItem.rect.height;
        }

        self._setMaxScrollY();
        self._bouncingEffect._maxScrollValue.y = self._maxScrollY;

        // refresh widget view
        self.refresh();
    }
};