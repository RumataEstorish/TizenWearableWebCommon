/*global tau, $*/

function CircleProgress(pageName, progressBarName, resultName, max) {
	var self = this, progressBar = $(progressBarName)[0], page = $(pageName)[0], progressBarWidget = null, result = $(resultName);

	Object.defineProperty(this, "result", {
		get : function() {
			return result;
		},
	});

	Object.defineProperty(this, "progressBarWidget", {
		get : function() {
			return progressBarWidget;
		},
	});

	Object.defineProperty(this, "max", {
		get : function(){
			return max;
		}
	});
	
	page.addEventListener("pagebeforeshow", function() {
		if (tau.support.shape.circle) {
			progressBarWidget = new tau.widget.CircleProgressBar(progressBar, {
				size : "full"
			});
		} else {
			progressBarWidget = new tau.widget.CircleProgressBar(progressBar, {
				size : "large"
			});
		}
		self.progress(0, max);
	});
	page.addEventListener("pagehide", function() {
		if (progressBarWidget) {
			progressBarWidget.destroy();
			progressBarWidget = null;
		}
	});

	/*if (max > 2) {
		tau.changePage(pageName);
	}*/
}

CircleProgress.prototype.progress = function(val, max) {

	var maximum = max;
	if (!maximum){
		maximum = this.max;
	}
	
	if (this.progressBarWidget) {
		this.progressBarWidget.value(100 * parseInt(val, 0) / parseInt(maximum, 0));
		this.result.html(parseInt(this.progressBarWidget.value(), 0) + "%");
	}

	/*
	 * if (Utils.getActivePage() !== 'pageCircleProgressBar') {
	 * tau.changePage("#pageCircleProgressBar"); }
	 */
};