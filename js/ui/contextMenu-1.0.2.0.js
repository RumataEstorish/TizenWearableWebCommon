/*global $*/
/**
 * v1.0.2.0
 * Code cleanup
 * v1.0.1.1
 * Code cleanup. Removed event preventdefault - useless on tizen 3.0
 * v1.0.1
 * fixed processing events futhermore
 */
function ContextMenu(object, onclick, ontaphold) {

    var self = this;
    var releaseTimer = null;
    var longTap = false;

    /**
     * Internal properties
     */
    Object.defineProperties(this, {
        'releaseTimer': {
            get: function () {
                return releaseTimer;
            },
            set: function (val) {
                releaseTimer = val;
            }
        },
        'longTap': {
            get: function () {
                return longTap;
            },
            set: function (val) {
                longTap = val;
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
        'onclickhold' : {
            get : function () {
                return ontaphold;
            }
        }
    });

    $(object).on("touchstart", function () {
        self.touchStart($(object));
    });
    $(object).on("touchend", function () {
        self.touchEnd($(object));
    });
    $(object).on("click", function () {
        self.touchClick($(object));
    });
}

ContextMenu.prototype.touchClick = function (sender) {
    this.touchEnd();
    if (this.longTap === false) {
        if (this.onclick && typeof this.onclick === 'function') {
            // noinspection JSValidateTypes
            this.onclick(sender);
        }
    }
    this.longTap = false;
};

ContextMenu.prototype.touchStart = function (sender) {
    var self = this;
    this.longTap = false;

    if (!this.releaseTimer) {
        this.releaseTimer = setTimeout(function () {
            self.longTap = true;

            if (self.onclickhold && typeof self.onclickhold === 'function') {
                // noinspection JSValidateTypes
                self.onclickhold(sender);
            }
        }, 1000);
    }
};

ContextMenu.prototype.touchEnd = function () {
    if (this.releaseTimer) {
        clearTimeout(this.releaseTimer);
    }
    this.releaseTimer = null;
};