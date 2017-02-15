var UrlParamsMap = function(url) {
	var tag = document.createElement('a');
	tag.href = url;
	var params_arr = tag.search.substring(1).split('&');
	var params_map = new Map();
	var kv;
	var cb = function(param) {
			kv = param.split('=');
			params_map.set(kv[0], kv[1]);
	};
	params_arr.forEach(cb);
	return params_map;
};
