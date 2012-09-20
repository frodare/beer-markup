/*global CodeMirror:true grains:true */
CodeMirror.defineMode("bml", function(cmCfg, modeCfg) {
	'use strict';

	var TOKEN_NAMES = {
		'+': 'tag',
		'-': 'string',
		'@': 'meta'
	};

	/*
	 * .cm-s-default span.cm-keyword {color: #708;}
.cm-s-default span.cm-atom {color: #219;}
.cm-s-default span.cm-number {color: #164;}
.cm-s-default span.cm-def {color: #00f;}
.cm-s-default span.cm-variable {color: black;}
.cm-s-default span.cm-variable-2 {color: #05a;}
.cm-s-default span.cm-variable-3 {color: #085;}
.cm-s-default span.cm-property {color: black;}
.cm-s-default span.cm-operator {color: black;}
.cm-s-default span.cm-comment {color: #a50;}
.cm-s-default span.cm-string {color: #a11;}
.cm-s-default span.cm-string-2 {color: #f50;}
.cm-s-default span.cm-meta {color: #555;}
.cm-s-default span.cm-error {color: #f00;}
.cm-s-default span.cm-qualifier {color: #555;}
.cm-s-default span.cm-builtin {color: #30a;}
.cm-s-default span.cm-bracket {color: #cc7;}
.cm-s-default span.cm-tag {color: #170;}
.cm-s-default span.cm-attribute {color: #00c;}
.cm-s-default span.cm-header {color: blue;}
.cm-s-default span.cm-quote {color: #090;}
.cm-s-default span.cm-hr {color: #999;}
.cm-s-default span.cm-link {color: #00c;}

span.cm-header, span.cm-strong {font-weight: bold;}
span.cm-em {font-style: italic;}
span.cm-emstrong {font-style: italic; font-weight: bold;}
span.cm-link {text-decoration: underline;}

span.cm-invalidchar {color: #f00;}
	 */

	var process = {
		info: function(stream, state) {
			if (stream.eatWhile(/[^:]/)) {
				if (stream.eol()) {
					return 'error';
				}
				return 'tag';
			} else {
				stream.skipToEnd();
				return '';
			}
		},
		grain: function(stream, state) {
			stream.skipToEnd();
			var match = stream.string.match(/^\s*([0-9\/.]+)\s*(lbs|lb|oz)\s+(.*) \[(?:\s*([0-9.]+)([a-z]+)\s*)+\]$/i);
			//console.log(match);
			if (match === null) {
				return 'error';
			}
			return '';
		}
		/*,
		hops: function (data, line) {
			var match = line.match(/^\s*([0-9]+)\s*(?:min)?\s*([0-9\/.]+)\s*(lbs|lb|oz)\s*(.*?)\s*([0-9.]+)%/i);
			if (!match) {
				return;
			}
			data.hops.push({
				min: match[1],
				amount: match[2],
				unit: match[3],
				name: match[4],
				aa: match[5]
			});
		},
		yeast: function (data, line) {
			var match = line.match(/^\s*([0-9]+)\s*(?:pkg)?\s*(.*?)\s*([0-9.]+)%/i);
			if (!match) {
				return;
			}
			data.yeast.push({
				amount: match[1],
				name: match[2],
				att: match[3]
			});
		},
		notes: function (data, line) {
			if(!data.notes){
				data.notes = line;
			}else{
				data.notes += '\n' + line;
			}
		}*/
	};

	return {
		token: function(stream, state) {
			/*
			 * read section
			 */
			var match = stream.string.match(/^\s*-{2,}([^\-]{2,})-*/);
			if (match) {

				state.section = match[1].toLowerCase();
				//console.log('seciton: [' + state.section + ']');
				state.recipe[state.section] = {};
				stream.skipToEnd();
				return 'header';
			}

			/*
			 *
			 */
			if (process[state.section]) {
				return process[state.section](stream, state);
			}

			stream.skipToEnd();
			return '';

		},
		startState: function() {
			return {
				recipe: {},
				section: ''
			};
		}
	};



});

CodeMirror.defineMIME("text/x-bml", "bml");


function sugguestGrain(pre, s) {
	'use strict';
	var i, l = grains.length,
		a = [],
		name;

	if(!pre){
		pre = '1 lb ';
	}


	for (i = 0; i < l; i++) {
		var re = new RegExp(s, "i");
		name = grains[i].name;
		if (name.match(re) !== null) {
			a.push(pre + name + ' [' + grains[i].color + 'L ' + grains[i].ppg + 'PPG]');
		}
	}


	return a;
}


CodeMirror.bmlHint = function(cm) {
	'use strict';
	var i, cursor = cm.getCursor();



	var text = cm.getRange({
		line: cursor.line,
		ch: 0
	}, cursor);


	var eol = cm.getLine(cursor.line).length;

	var symbol = '';

	var section = cm.getStateAfter(cursor.line).section;
	//console.log(state.section);
	/*
		for (i = text.length - 1; i >= 0; i--) {
			if (text[i] === ' ') {
				break;
			} else {
				typed = text[i] + typed;
			}
		}
	 */

	var hints;
	if (section === 'grain') {
		/*
		 * remove the weight
		 */
		

		var m = text.match(/^\s*([0-9\/.]+\s*(?:lbs|lb|oz)\s+)(.*)/);


		if(m !== null){
			hints = sugguestGrain(m[1], m[2]);
		}else{
			hints = sugguestGrain('', text);
		}
		
	} else {
		return;
	}



	return {
		list: hints,
		from: {
			line: cursor.line,
			ch: cursor.ch - text.length
		},
		to: {
			line: cursor.line,
			ch: eol
		}
	};

};

