
/**
 * getScriptSelf - Get the current script tag
 *
 * @return {HTMLScriptElement}  The current script tag 
 */
function getScriptSelf() {
	var scripts = document.getElementsByTagName('script'),
			len = scripts.length;
	return scripts[len-1];
}



/**
 * getScriptSelfUrlParamsMap - Returns key-value pairs of all Get-Parameters of the script's url
 *
 * @return {Map}  A Map of the Get-Parameters
 */
function getScriptSelfUrlParamsMap() {
	var script_self = getScriptSelf(),
			url_params_map = new UrlParamsMap(script_self.src);
	return url_params_map;
}



function log(obj) {
	window.console.log(obj);
}



/**
 * loadCss - Loads external CSS ressources
 *
 * @param  {(string|string[])} url URL(s) of the CSS file(s)
 */
function loadCss(url) {
	var typeof_url = typeof url;
	var urls = [];
	function cb(u) {
		var el = document.createElement('link');
		el.rel = 'stylesheet';
		el.href = u;
		document.body.appendChild(el);
	}
	if (typeof_url === 'string') {
		urls.push(url);
	} else if (typeof_url === 'object' && url.length) {
		urls = url;
	} else {
		throw new Error('No String or Array given.');
	}
	urls.forEach(cb);
}



/**
 * onDomReady - Registers events that fire when the DOM has become ready
 *
 * @param  {function} callback Function that is invoked upon dom ready
 */
function onDomReady(callback) {
	if (document.readyState === 'complete') {
		return window.setTimeout(callback, 1);
	} else {
		document.addEventListener('DOMContentLoaded', function() {
			callback();
		});
	}
}



/**
 * init - Main function setting everything up
 *
 */
function init() {
	var script_self_url_params_map = getScriptSelfUrlParamsMap(),
			render_to_id = script_self_url_params_map.get('renderTo'),
			render_to_el = document.getElementById(render_to_id);
	if (render_to_el) {
		loadCss('style.css');
		render_to_el.innerHTML = html_template;
	}
}

init();
