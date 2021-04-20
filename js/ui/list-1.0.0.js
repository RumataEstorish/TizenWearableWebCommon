function List(jList) {

    var tList = tau.widget.Listview(jList);
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
            get: function(){
                return self._count;
            }
        }
    });
}

List.prototype.add = function (item, position) {
    this.tauList.addItem(item, position);
    this._count ++ ;
};

List.prototype.remove = function (position){
    this.tauList.removeItem(position);
    this._count --;
};

List.prototype.replace = function(item, position){
    this.remove(position);
    this.add(item, position);
};

List.prototype.clear = function(){
    for (var i = 0; i<this._count; i++){
        this.remove(i);
    }
    this._count = 0;
};