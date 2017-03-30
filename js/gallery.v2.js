function TemplateEngine(data=[]) {
	var _this = this;
	this.data = data;
	this.parentElement = function (_this) {
		var el = document.getElementById('TEMPLATE_ENGINE_ELEMENT');
		if (el == null) {
			el = document.createElement('DIV');
			el.id = 'TEMPLATE_ENGINE_ELEMENT';
			document.body.appendChild(el);
		}
		return el;
	};
	this.template = function (_this) { return "<span>{{ value }}<br></span>"; };
	this.template_signals = ["{{ ", " }}"];
	this.builders = {
		'id': function (_this, index, value) { return '_' + Math.random().toString(36).substr(2, 9); },
		'value': function (_this, index, value) { return value; }
	};
	this.bootware = [];
	this.middleware = [];
	this.onClickFunction = function (_this, element) { return _this; };
	this.addBuilder = function (index, value) {
		_this.builders[index] = value;
		return _this;
	};
	this.addBootware = function (func) {
		if (typeof func == 'function') { _this.bootware.push(func); }
		return _this;
	};
	this.addMiddleware = function (func) {
		if (typeof func == 'function') { _this.middleware.push(func); }
		return _this;
	};
	this.injectHTML = function(_this, data) {
		var signals = _this.template_signals;
		var keys = [];
		var index = 0;
		for (var k in _this.builders) { keys.push(k); }
		return _this.template(_this).replace(new RegExp(keys.map(function(k) {return signals[0]+k+signals[1];}).join("|"), 'g'), function (k) {
			k = k.replace(new RegExp(signals.join("|"), 'g'), '');
			if (typeof _this.builders[k] == 'function') { return _this.builders[k](_this, data.index, data.value);
			} else { return ""; }
		});
	};
	this.run = function (_this) {
		for (var i=0;i<_this.data.length;i++) {
			_this.skip = false;
			_this.index = i;
			for (var j=0;j<_this.middleware.length;j++) {
				_this = _this.middleware[j](_this);
			}
			if (_this.skip) { continue; }
			_this.parentElement(_this).innerHTML += _this.injectHTML(_this, {'index': i, 'value': _this.data[i]}, _this.template(), _this.builders);
			Array.from(_this.parentElement(_this).childNodes).forEach(function (node) {
				node.onclick = function () { _this.onClickFunction(_this, node); };
			});
		}
		return _this;
	};
	this.init = function () {
		for (var i=0;i<_this.bootware.length;i++) {
			_this = _this.bootware[i](_this);
		}
		return _this.run(_this);
	};
	return _this;
}