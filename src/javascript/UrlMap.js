var UrlMap = function(url) {
	var tag = document.createElement('a');
	tag.href = url;
	return {
		'hash': tag.hash,
		'host': tag.host,
		'hostname': tag.hostname,
		'href': tag.href,
		'protocol': tag.protocol,
		'search': tag.search,
		'basepath': tag.href.substr(0, tag.href.lastIndexOf('/')+1)
	};
};
