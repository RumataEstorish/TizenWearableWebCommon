/*global jQuery, tau*/

function List(jList) {
    var tList = null;
    if (jList instanceof jQuery) {
        tList = tau.widget.Listview(jList[0]);
    } else {
        tList = tau.widget.Listview(jList);
    }
    var self = this;
    this._count = 0;

    Object.defineProperties(this, {
        'tauList': {
            get: function () {
                return tList;
            }
        },
        'jQueryList': {
            get: function () {
                return jList;
            }
        },
        'count': {
            get: function () {
                return self._count;
            }
        }
    });
}

List.prototype.addItem = function (item, position) {
    this.add(item, position);
};

List.prototype.add = function (item, position) {
    if (item instanceof jQuery) {
        this.tauList.addItem(item.prop('outerHTML'), position);
    } else {
        this.tauList.addItem(item, position);
    }
    this._count++;
};

List.prototype.append = function (item) {
    this.add(item, this.count);
};

List.prototype.remove = function (position) {
    this.tauList.removeItem(position);
    this._count--;
};

List.prototype.replace = function (item, position) {
    this.remove(position);
    this.add(item, position);
};

List.prototype.clear = function () {
    for (var i = 0; i < this._count; i++) {
        this.remove(i);
    }
    this._count = 0;
};

List.prototype.empty = function () {
    this.clear();
};