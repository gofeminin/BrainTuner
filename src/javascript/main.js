
var container = null;

var level_key = 1;

var level = null;

var current = 0;

var math_map  = null;

var penalty_value = 5;

var penalty_el = null;

var time_el = null;

var timer_interval = null;

var time_delimiter = ':';

var expert_mode_max_seconds = 180;

var levels = {
	'1': {
		'name': 'easy',
		'amount': 20,
		'range_min': 1,
		'range_max': 10
	},
	'2': {
		'name': 'medium',
		'amount': 50,
		'range_min': 1,
		'range_max': 15
	},
	'3': {
		'name': 'hard',
		'amount': 100,
		'range_min': 1,
		'range_max': 20
	},
	'expertmode': {
		'name': 'expert',
		'amount': 150,
		'range_min': 1,
		'range_max': 30
	}
};

var keys = {
	'true': 'j',
	'false': 'f'
};



// Fix for IE missing forEach in NodeLists
if (('forEach' in NodeList.prototype) === false) {
	NodeList.prototype.forEach = Array.prototype.forEach;
}



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
 * @return {Object}  A Map of the Get-Parameters
 */
function getScriptSelfUrlParamsMap() {
	var script_self = getScriptSelf(),
			url_params_map = new UrlParamsMap(script_self.src);
	return url_params_map;
}



function getScriptSelfUrlMap() {
	var script_self = getScriptSelf(),
			url_map = new UrlMap(script_self.src);
	return url_map;
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
	var rand = getRandomInt(0, 3),
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
	return eval(str);
}

function getMathematicaMap() {
	var mathematica_map = {},
			amount = level.amount,
			range_min = level.range_min,
			range_max = level.range_max,
			cb = null,
			i = 0;
	cb = function(i) {
		var calcu = getRandomCalcu(),
		 		num1 = getRandomInt(range_min, range_max),
				num2 = getRandomInt(range_min, range_max),
				result_offset = getRandomInt(0, 2),
				calc = num1 + calcu + num2,
				true_result = getCalcResultFromString(calc),
				offered_result = true_result+result_offset,
				offered_result_is_true = true;
		if (true_result !== offered_result) {
			offered_result_is_true = false;
		}
		mathematica_map[i.toString()] = {
			'calc': calc,
			'result': offered_result,
			'answer': offered_result_is_true
		};
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



function getRowsMap() {
	var values = [],
			i = current-1,
			len = current+2,
			empty_rows = 0,
			continue_calc = true;
	for(; i < len; i++) {
		if (current === 0 && i === -1)  {
			values.push(['&nbsp;', '&nbsp;', '&nbsp;']);
			empty_rows = empty_rows + 1;
		} else {
			var curr_map = math_map[i];
			if (curr_map === undefined) {
				values.push(['&nbsp;', '&nbsp;', '&nbsp;']);
				empty_rows = empty_rows + 1;
			} else {
				values.push([curr_map['calc'], '=', curr_map['result'].toString()]);
			}
			if (empty_rows === 2) {
				continue_calc = false;
			}
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
	return {
		'rows': rows,
		'continue_calc': continue_calc
	};
}



function incrementPenalty() {
	penalty_el.innerHTML = parseInt(penalty_el.innerHTML, 10) + penalty_value;
};



function getTimeMultiMod(number) {
	var mult = 0,
			mod = 0;
	mult = Math.floor(number / 60);
	mod = (number % 60);
	return {multiplier: mult, modulo: mod};
};



function getFormattedTimeString(time_str, seconds) {
	var split = time_str.split(time_delimiter),
			hh = parseInt(split[0], 10),
			mm = parseInt(split[1], 10),
			ss = parseInt(split[2], 10),
			offset = null;
	seconds = parseInt(seconds, 10);
	ss = ss + seconds;
	if (ss >= 60) {
		offset = getTimeMultiMod(ss);
		ss = offset.modulo;
		mm = mm + offset.multiplier;
	}
	if (mm >= 60) {
		offset = getTimeMultiMod(mm);
		mm = offset.modulo;
		hh = hh + offset.multiplier;
	}
	hh = hh.toString();
	mm = mm.toString();
	ss = ss.toString();
	if (hh.length === 1) hh = '0' + hh;
	if (mm.length === 1) mm = '0' + mm;
	if (ss.length === 1) ss = '0' + ss;
	return hh + time_delimiter + mm + time_delimiter + ss;
}



function startTimer() {
	function timerIntervalCallback() {
		time_el.innerHTML = getFormattedTimeString(time_el.innerHTML, 1);
	}
	timer_interval = window.setInterval(timerIntervalCallback, 1000);
};



function stopTimer() {
	window.clearInterval(timer_interval);
	timer_interval = null;
}



function update(answer) {
	answer = (typeof answer === 'undefined') ? null : answer;

	if (answer !== null) { // next calc
		current = current + 1;
		// start the timer only when user has interacted with the game
		if (timer_interval === null) {
			startTimer();
		}
	}
	if (answer === false) {
		incrementPenalty();
	}
	var tbody = getEl('[data-game] tbody');
	var rows_map = getRowsMap();
	var rows = null;
	// reset
	tbody.innerHTML = '';
	if (rows_map['continue_calc'] === true) {
		rows = rows_map['rows'];
		var rowCallback = function(row) {
			tbody.appendChild(row);
		};
		rows.forEach(rowCallback);
		if (answer !== null ) {
			getEl('[data-game] tr').setAttribute('class', answer.toString());
		}
	} else {
		finishGame();
	}
}



function isExpertTime(time_string) {
	var split = time_string.split(time_delimiter);
	var hours = parseInt(split[0], 10);
	var minutes = parseInt(split[1], 10);
	var seconds = parseInt(split[2], 10);
	var total = (hours*60*60) + (minutes*60) + seconds;
	if (total <= expert_mode_max_seconds) {
		return true;
	} else {
		return false;
	}
}



function showResults() {
	var hard_level = (level.name === 'hard' || level.name === 'expert') ? true : false,
			time_formatted = null,
			is_expert_time = null;
	time_formatted = getFormattedTimeString(
		time_el.innerHTML,
		penalty_el.innerHTML
	);
	is_expert_time = isExpertTime(time_formatted);
	if (hard_level && is_expert_time) {
		getEl('[data-experts]').style.display = 'block';
		getEl('[data-experts] [data-time]').innerHTML = time_formatted;
	} else {
		getEl('[data-finish]').style.display = 'block';
		getEl('[data-finish] [data-time]').innerHTML = time_formatted;
	}
}



function finishGame() {
	stopTimer();
	current = 0; // reset current, so the user can start a new game :)
	var new_game_btn = getEl('[data-footer] button');
	new_game_btn.setAttribute('data-text', new_game_btn.innerText);
	new_game_btn.innerHTML = new_game_btn.getAttribute('data-repeat');
	getEl('[data-game]').style.display = 'none';
	showResults();
}



function startGame() {
	time_el.innerHTML = '00:00:00'; // reset timer
	penalty_el.innerHTML = '0'; // reset penalty
	current = 0; // reset current calc index
	var new_game_btn = getEl('[data-footer] button');
	var new_game_btn_initial_text = new_game_btn.getAttribute('data-text');
	if (new_game_btn_initial_text) {
		new_game_btn.innerHTML = new_game_btn_initial_text;
	}
	getEl('[data-footer] [data-new]').style.display = 'block';
	getEl('[data-game]').style.display = 'block';
	getEl('[data-level]').style.display = 'none';
	getEl('[data-experts]').style.display = 'none';
	getEl('[data-footer] [data-level]').style.display = 'none';
	math_map = getMathematicaMap();
	update();
}



function registerEventHandlersIntro() {
	getEl('button[name="start"]').onclick = function(evt){
		evt.preventDefault();
		stopTimer(); // reset timers
		getEl('[data-intro]').style.display = 'none';
		getEl('[data-game]').style.display = 'none';
		getEl('[data-finish]').style.display = 'none';
		getEl('[data-experts]').style.display = 'none';
		getEl('[data-footer] [data-new]').style.display = 'none';
		getEl('[data-level]').style.display = 'block';
		getEl('[data-footer] [data-level]').style.display = 'block';
	};
}



function registerEventHandlersExpertFinish() {
	getEl('[data-experts] button').onclick = function(evt) {
		evt.preventDefault();
		level_key = this.name;
		level = levels[level_key];
		startGame();
	};
}



function registerEventHandlersLevel() {
	var buttons = getEl('[data-level] button', true),
			cb = null;
	cb = function(btn) {
		btn.onclick = function(evt){
			evt.preventDefault();
			level_key = this.name;
			level = levels[level_key];
			startGame();
		};
	};
	buttons.forEach(cb);
}



function isUserInputTrue(b) {
	if (b === 'true' || b === 'false') {
		if (b === 'true' && math_map[current]['answer'] === true) {
			return true;
		} else if (b === 'false' && math_map[current]['answer'] === false) {
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
			if (getEl('[data-game]').style.display !== 'block') return; // safe exit
			var btn_name = this.name;
			var user_input = isUserInputTrue(btn_name);
			update(user_input);
		};
	};
	getEl('[data-game] button', true).forEach(buttonCallback);
	window.addEventListener('keydown', function(evt) {
		if (evt.key === keys['true']) {
			getEl('[data-game] button[name="true"]').click();
		} else if (evt.key === keys['false']) {
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
			case 'experts':
				registerEventHandlersExpertFinish();
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
			script_self_url_map = null,
			snippet_basepath = null,
			render_to_id = script_self_url_params_map['renderTo'];
	container = document.getElementById(render_to_id);
	if (container) {
		script_self_url_map = getScriptSelfUrlMap();
		snippet_basepath = script_self_url_map['basepath'];
		loadCss(snippet_basepath + 'style.css');
		container.innerHTML = html_template;
		penalty_el = getEl('[data-game] [data-penalties]');
		time_el = getEl('[data-game] [data-time]');
		registerEventHandlers('intro,level,game,experts');
	}
}

init();
