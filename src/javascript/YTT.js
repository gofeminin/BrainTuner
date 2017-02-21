var YTT = function(str, dict) {
	var _store = {
		string: str || '',
		dict: dict || {}
	};
	this.setString = function(s) {
		_store.string = s;
	};
	this.getString = function() {
		return _store.string;
	};
	this.setStr = this.setString;
	this.getStr = this.getString;
	this.setDictionary = function(d) {
		_store.dict = d;
	};
	this.getDictionary = function() {
		return _store.dict;
	};
	this.setDict = this.setDictionary;
	this.getDict = this.getDictionary;
	this.getMappedString = function() {
		var keys = Object.keys(dict),
		re = null,
		val = null,
		mapped_string = _store.string,
		cb = function(key) {
			val = dict[key];
			re = new RegExp('{{'+key+'}}', 'g');
			mapped_string = mapped_string.replace(re, val);
		};
		keys.forEach(cb);
		return mapped_string;
	};
	return this;
};
