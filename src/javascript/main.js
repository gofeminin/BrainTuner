
var container = null;

var level_key = 1;

var level = null;

var current = 0;

var math_map  = null;

var levels = new Map([
	['1', new Map([['amount', 20],['range_min', 1], ['range_max', 10]])],
	['2', new Map([['amount', 50],['range_min', 1], ['range_max', 15]])],
	['3', new Map([['amount', 100],['range_min', 1], ['range_max', 20]])],
	['expertmode', new Map([['amount', 150],['range_min', 1], ['range_max', 30]])]
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



function getRandomInt(min, max) {
	return Math.floor(Math.random() * max) + min;
}



function getRandomCalcu() {
	var rand = getRandomInt(0, 1),
			calcu = '+';
	switch (rand) {
		case 0:
			calcu = '+';
			break;
		case 1:
			calcu = '-';
			break;
		case 2:
			calcu = '*';
			break;
		case 3:
			calcu = '/';
			break;
		default:
			break;
	}
	return ' ' + calcu + ' ';
}

function getCalcResultFromString(str) {
	return new Function('return ' + str)(); // jshint ignore:line
}

function getMathematicaMap() {
	var mathematica_map = new Map(),
			amount = level.get('amount'),
			range_min = level.get('range_min'),
			range_max = level.get('range_max'),
			cb = null,
			i = 0;
	cb = function(i) {
		var calcu = getRandomCalcu(),
		 		num1 = getRandomInt(range_min, range_max),
				num2 = getRandomInt(range_min, range_max),
				result_offset = getRandomInt(0, 2),
				calc = num1 + calcu + num2,
				true_result = getCalcResultFromString(calc),
				offered_result = getCalcResultFromString(calc+calcu+result_offset),
				offered_result_is_true = true;
		if (true_result !== offered_result) {
			offered_result_is_true = false;
		}
		mathematica_map.set(i, new Map([
			['calc', calc],
			['result', offered_result],
			['answer', offered_result_is_true]
		]));
	};
	for (; i < amount; i++) {
	  cb(i);
	}
	return mathematica_map;
}



function create(name, contents, attrs) {
	var el = document.createElement(name);
	if (contents) {
		var contents_type = typeof contents;
		if (contents_type === 'string' || contents_type === 'number') {
			el.innerHTML = contents;
		} else if (contents_type === 'object') {
			if (contents.length) { // array of html elements
				var nodeCallback = function(n) {
					el.appendChild(n);
				};
				contents.forEach(nodeCallback);
			} else { // single html element
				el.appendChild(contents);
			}
		}
	}
	if (attrs && attrs.length) {
		var attrCallback = function(attr) {
			el.setAttribute(attr[0], attr[1]);
		};
		attrs.forEach(attrCallback);
	}
	return el;
}



function getRows() {
	var values = [],
			i = -1,
			len = 2;
	for(; i < len; i++) {
		if (current === 0 && i === -1)  {
			values.push(['&nbsp;', '&nbsp;', '&nbsp;']);
		} else {
			values.push([math_map.get(i).get('calc'), '=', math_map.get(i).get('result')]);
		}
	}
	var rows = [
		create('tr', [
			create('td', values[0][0]),
			create('td', values[0][1]),
			create('td', values[0][2])
		]),
		create('tr', [
			create('td', values[1][0]),
			create('td', values[1][1]),
			create('td', values[1][2])
		]),
		create('tr', [
			create('td', values[2][0]),
			create('td', values[2][1]),
			create('td', values[2][2])
		])
	];
	return rows;
}



function update() {
	var tbody = getEl('[data-game] tbody');
	// reset
	tbody.innerHTML = '';
	var rows = getRows();
	var rowCallback = function(row) {
		tbody.appendChild(row);
	};
	rows.forEach(rowCallback);
}



function finishGame() {
	getEl('[data-game]').style.display = 'none';
	getEl('[data-finish]').style.display = 'block';
}



function startGame() {
	getEl('[data-footer] [data-new]').style.display = 'block';
	getEl('[data-game]').style.display = 'block';
	getEl('[data-level]').style.display = 'none';
	getEl('[data-footer] [data-level]').style.display = 'none';
	math_map = getMathematicaMap();
	update();
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
			level_key = this.name;
			level = levels.get(level_key);
			startGame();
		};
	};
	buttons.forEach(cb);
}



function isUserInputTrue(b) {
	if (b === 'true' || b === 'false') {
		if (b === 'true' && math_map.get(current).get('answer') === true) {
			return true;
		} else if (b === 'false' && math_map.get(current).get('answer') === false) {
			return true;
		} else {
			return false;
		}
	} else {
		throw new Error('Only String("true") and String("false") allowed..');
	}
}



function registerEventHandlersGame() {
	var buttonCallback = function(btn) {
		btn.onclick = function(evt) {
			evt.preventDefault();
			var btn_name = this.name;
			var user_input = isUserInputTrue(btn_name);
			if (user_input === true) {
				alert('Correct :)');
			} else if (user_input === false) {
				alert('Incorrect :\'(');
			}
		};
	};
	getEl('[data-game] button', true).forEach(buttonCallback);
	window.addEventListener('keydown', function(evt){
		if (evt.key === keys.get('true')) {
			getEl('[data-game] button[name="true"]').click();
		} else if (evt.key === keys.get('false')) {
			getEl('[data-game] button[name="false"]').click();
		}
	});
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
