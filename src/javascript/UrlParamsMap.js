var UrlParamsMap = function(url) {
	var tag = document.createElement('a');
	tag.href = url;
	var splitter = (tag.search.indexOf('&amp;') !== -1) ? '&amp;' : '&';
	var params_arr = tag.search.substring(1).split(splitter);
	var params_map = {};
	var kv;
	var cb = function(param) {
			kv = param.split('=');
			params_map[kv[0]] = kv[1];
	};
	params_arr.forEach(cb);
	return params_map;
};
