/*global $*/
/**
 * v1.0.1.1
 * Code cleanup. Removed event preventdefault - useless on tizen 3.0
 * v1.0.1
 * fixed processing events futhermore
 */
function ContextMenu(object, onclick, ontaphold) {

	var self = this, releaseTimer = null, longTap = false, click = onclick, onhold = ontaphold;
 
	Object.defineProperty(this, "releaseTimer", {
		get : function() {
			return releaseTimer;
		},
		set : function(val) {
			releaseTimer = val;
		}
	});

	Object.defineProperty(this, "longTap", {
		get : function() {
			return longTap;
		},
		set : function(val) {
			longTap = val;
		}
	});

	Object.defineProperty(this, "onclick", {
		get : function() {
			return click;
		},
		set : function(val) {
			click = val;
		}
	});

	Object.defineProperty(this, "onclickhold", {
		get : function() {
			return onhold;
		},
		set : function(val) {
			onhold = val;
		}
	});

	$(object).on("touchstart", function() {
		self.touchStart($(object));
	});
	$(object).on("touchend", function(){
		self.touchEnd($(object));
	});
	$(object).on("click", function() {
		self.touchClick($(object));
	});
}

ContextMenu.prototype.touchClick = function(sender) {
	this.touchEnd();
	if (this.longTap === false) {
		if (this.onclick) {
			this.onclick(sender);
		}
	}
	this.longTap = false;
};

ContextMenu.prototype.touchStart = function(sender) {
	var self = this;
	this.longTap = false;
	
	if (!this.releaseTimer) {
		this.releaseTimer = setTimeout(function() {
			self.longTap = true;
			if (self.onclickhold) {
				self.onclickhold(sender);
			}
		}, 1000);
	}
};

ContextMenu.prototype.touchEnd = function() {
	if (this.releaseTimer) {
		clearTimeout(this.releaseTimer);
	}
	this.releaseTimer = null;
};