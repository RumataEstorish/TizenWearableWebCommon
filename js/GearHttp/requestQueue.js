/*global*/

RequestQueue.REQUEST_INTERVAL = 1000;

function RequestQueue() {
	var queue = [], requestInterval = RequestQueue.REQUEST_INTERVAL, requestTimer = null, processQueue = function(){
		if (queue.length === 0){
			return;
		}
		
		var r = queue.pop();
		r.req.send(r.arg);
	};
	
	Object.defineProperty(this, 'queue', {
		get : function(){
			return queue;
		}
	});
	
	Object.defineProperty(this, 'requestInterval', {
		get : function() {
			return requestInterval;
		},
		set : function(val){
			if (!isNaN(val) || val < 0){
				throw 'Request interval must be number in millisecond greater zero';
			}
			requestInterval = val;
			clearInterval(requestTimer);
			requestTimer = setInterval(processQueue, val);
		}
	});
	
	requestTimer = setInterval(processQueue, requestInterval);
	
}

RequestQueue.prototype.add = function(req, arg){
	var i = 0, r = null;
	
	for (i = 0; i<this.queue.length; i++){
		r = this.queue[i];
		if (r.req.address === req.address && r.req.type === req.type && r.arg === arg){
			return;
		}
	}
	this.queue.push({req : req, arg : arg});
};
