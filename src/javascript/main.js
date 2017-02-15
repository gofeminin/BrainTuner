
var container = null;

var levels = new Map([
	['1', new Map([['amount', 20],['range_min', 1], ['range_max', 10]])],
	['2', new Map([['amount', 50],['range_min', 1], ['range_max', 15]])],
	['3', new Map([['amount', 100],['range_min', 1], ['range_max', 20]])],
	['3', new Map([['amount', 150],['range_min', 1], ['range_max', 30]])]
]);

var keys = new Map([
	['true', 'j'],
	['false', 'f']
]);

/**
 * getEl - Shorthand for querySelectorAll and querySelector
 *
 * @param  {string} sel CSS Selector
 * @param  {boolean} all Set to true if you want to use querySelectorAll
 * @return {HTMLElement|NodeList} Either HTMLElement or non-live NodeList
 */
function getEl(sel, all) {
	if (all) {
		return container.querySelectorAll(sel);
	} else {
		return container.querySelector(sel);
	}
}



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



function finishGame() {
	getEl('[data-game]').style.display = 'none';
	getEl('[data-finish]').style.display = 'block';
}



function startGame(level_key) {
	getEl('[data-footer] [data-new]').style.display = 'block';
	getEl('[data-game]').style.display = 'block';
	getEl('[data-level]').style.display = 'none';
	getEl('[data-footer] [data-level]').style.display = 'none';
	var amount = levels.get(level_key);
	console.log(amount);

}


function registerEventHandlersIntro() {
	getEl('button[name="start"]').onclick = function(evt){
		evt.preventDefault();
		getEl('[data-intro]').style.display = 'none';
		getEl('[data-game]').style.display = 'none';
		getEl('[data-finish]').style.display = 'none';
		getEl('[data-experts]').style.display = 'none';
		getEl('[data-footer] [data-new]').style.display = 'none';
		getEl('[data-level]').style.display = 'block';
		getEl('[data-footer] [data-level]').style.display = 'block';
	};
}



function registerEventHandlersLevel() {
	var buttons = getEl('[data-level] button', true),
			cb = null;
	cb = function(btn) {
		btn.onclick = function(evt){
			evt.preventDefault();
			startGame(this.name);
		};
	};
	buttons.forEach(cb);
}



function registerEventHandlersGame() {
	var buttonCallback = function(btn) {
		btn.onclick = function(evt) {
			evt.preventDefault();
			finishGame();
		};
	};
	getEl('[data-game] button', true).forEach(buttonCallback);
}



function registerEventHandlers(where) {
	var cb = function(w) {
		switch (w) {
			case 'intro':
				registerEventHandlersIntro();
				break;
			case 'level':
				registerEventHandlersLevel();
				break;
			case 'game':
				registerEventHandlersGame();
				break;
			default:
				break;
		}
	};
	where = where.split(',');
	where.forEach(cb);
}



/**
 * init - Main function setting everything up
 *
 */
function init() {
	var script_self_url_params_map = getScriptSelfUrlParamsMap(),
			render_to_id = script_self_url_params_map.get('renderTo');
	container = document.getElementById(render_to_id);
	if (container) {
		loadCss('style.css');
		container.innerHTML = html_template;
		registerEventHandlers('intro,level,game');
	}
}

init();
