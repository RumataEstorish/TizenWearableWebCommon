/*global $*/
/**
 * v1.1.0
 * Added support for tau 1.2.9
 * v1.0.2.0
 * Code cleanup
 * v1.0.1.1
 * Code cleanup. Removed event preventdefault - useless on tizen 3.0
 * v1.0.1
 * fixed processing events futhermore
 */

ContextMenu.HOLD_DELAY = 1000;

/**
 * Context menu for item. Process click and hold events
 * @param object to apply context menu
 * @param onclick callback when object is clicked
 * @param ontaphold callback when tap and hold on object
 * @constructor
 */
function ContextMenu(object, onclick, ontaphold) {

    this._object = object;

    var self = this;
    var _releaseTimer = null;
    var _longTap = false;

    /**
     * Internal properties
     */
    Object.defineProperties(this, {
        '_releaseTimer': {
            get: function () {
                return _releaseTimer;
            },
            set: function (val) {
                _releaseTimer = val;
            }
        },
        '_longTap': {
            get: function () {
                return _longTap;
            },
            set: function (val) {
                _longTap = val;
            }
        }
    });

    /**
     * Public properties
     */
    Object.defineProperties(this, {
        'onclick': {
            get: function () {
                return onclick;
            }
        },
        'onclickhold': {
            get: function () {
                return ontaphold;
            }
        }
    });

    this._object.get(0).addEventListener('click', function(){
        alert('clicked at last');
    });

    $(this._object).on("touchstart", function () {
        self._touchStart(this._object);
    });
    $(this._object).on("touchend", function () {
        self._touchEnd(this._object);
    });
    $(this._object.children()[0]).on("click", function () {
        self._touchClick(this._object);
    });
}

ContextMenu.prototype._touchClick = function (sender) {
    this._touchEnd();
    if (this._longTap === false) {
        if (this.onclick && typeof this.onclick === 'function') {
            // noinspection JSValidateTypes
            this.onclick(sender);
        }
    }
    this._longTap = false;
};

ContextMenu.prototype._touchStart = function (sender) {
    var self = this;
    this._longTap = false;

    if (!this._releaseTimer) {
        this._releaseTimer = setTimeout(function () {
            self._longTap = true;

            if (self.onclickhold && typeof self.onclickhold === 'function') {
                // noinspection JSValidateTypes
                self.onclickhold(sender);
            }
        }, ContextMenu.HOLD_DELAY);
    }
};

ContextMenu.prototype._touchEnd = function () {
    if (this._releaseTimer) {
        clearTimeout(this._releaseTimer);
    }
    this._releaseTimer = null;
};