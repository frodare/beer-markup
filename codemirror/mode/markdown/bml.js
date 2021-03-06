/*global CodeMirror:true */
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

var grains;

function sugguestGrain(s) {
	'use strict';
	var i, l = grains.length,
		a = [],
		name;

	for (i = 0; i < l; i++) {
		var re = new RegExp(s, "i");
		name = grains[i].name;
		if (name.match(re) !== null) {
			a.push(name + ' [' + grains[i].color + 'L ' + grains[i].ppg + 'PPG]');
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

	console.log(text);

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
		var m = text.match(/^\s*([0-9\/.]+)\s*(lbs|lb|oz)\s+(.*)/);
		if(m !== null){
			hints = sugguestGrain(m.match(3));
		}else{
			hints = sugguestGrain(text);
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



//file:///home/cdhoward/Downloads/CodeMirror-2.33/mode/markdown/index.html
grains = [{
	"name": "Crystal 10 Malt",
	"color": 10,
	"ppg": 34,
	"type": "Grain",
	"description": "Sweet, mild caramel flavor and a golden color. Use in light lagers and light ales."
}, {
	"name": "Crystal 20 Malt",
	"color": 20,
	"ppg": 34,
	"type": "Grain",
	"description": "Sweet, mild caramel flavor and a golden color. Use in light lagers and light ales."
}, {
	"name": "Crystal 30 Malt",
	"color": 30,
	"ppg": 34,
	"type": "Grain",
	"description": "Sweet, mild caramel flavor and a golden color. Use in light lagers and light ales."
}, {
	"name": "Crystal 40 Malt",
	"color": 40,
	"ppg": 34,
	"type": "Grain",
	"description": "Sweet, mild caramel flavor and a golden color. Use in light lagers and light ales."
}, {
	"name": "Crystal 60 Malt",
	"color": 60,
	"ppg": 34,
	"type": "Grain",
	"description": "Sweet caramel flavor, deep golden to red color. For dark amber and brown ales."
}, {
	"name": "Crystal 80 Malt",
	"color": 80,
	"ppg": 34,
	"type": "Grain",
	"description": "Sweet, smooth caramel flavor and a red to deep red color. For porters, old ales."
}, {
	"name": "Crystal 90 Malt",
	"color": 90,
	"ppg": 34,
	"type": "Grain",
	"description": "Pronounced caramel flavor and a red color. For stouts, porters and black beers."
}, {
	"name": "Crystal 120 Malt",
	"color": 120,
	"ppg": 34,
	"type": "Grain",
	"description": "Pronounced caramel flavor and a red color. For stouts, porters and black beers."
}, {
	"name": "Black Patent Malt",
	"color": 500,
	"ppg": 26,
	"type": "Grain",
	"description": "Provides color and sharp flavor in stouts and porters."
}, {
	"name": "Roasted Barley",
	"color": 300,
	"ppg": 25,
	"type": "Grain",
	"description": "Sweet, grainy, coffee flavor and a red to deep brown color. For porters and stouts."
}, {
	"name": "Black Barley",
	"color": 525,
	"ppg": 25,
	"type": "Grain",
	"description": "Imparts dryness. Unmalted; use in porters and dry stouts."
}, {
	"name": "Chocolate Malt",
	"color": 350,
	"ppg": 34,
	"type": "Grain",
	"description": "Use in all types to adjust color and add nutty, toasted flavor. Chocolate flavor."
}, {
	"name": "Dextrin Malt (US carapils)",
	"color": 1.5,
	"ppg": 33,
	"type": "Grain",
	"description": "Balances body and flavor without adding color, aids in head retention. For any beer."
}, {
	"name": "Pale Malt (US 2-row)",
	"color": 1.8,
	"ppg": 37,
	"type": "Grain",
	"description": "Smooth, less grainy, moderate malt flavor. Basic malt for all beer styles."
}, {
	"name": "Pale Malt (US 6-row)",
	"color": 1.8,
	"ppg": 35,
	"type": "Grain",
	"description": "Moderate malt flavor. Basic malt for all beer styles."
}, {
	"name": "Munich Malt",
	"color": 10,
	"ppg": 34,
	"type": "Grain",
	"description": "Sweet, toasted flavor and aroma. For Oktoberfests and malty styles."
}, {
	"name": "Special Roast",
	"color": 50,
	"ppg": 35,
	"type": "Grain",
	"description": "Provides a deep golden to brown color for ales. Use in all darker ales."
}, {
	"name": "Vienna Malt",
	"color": 3.5,
	"ppg": 35,
	"type": "Grain",
	"description": "Increases malty flavor, provides balance. Use in Vienna, Märzen and Oktoberfest."
}, {
	"name": "Victory Malt",
	"color": 25,
	"ppg": 34,
	"type": "Grain",
	"description": "Provides a deep golden to brown color. Use in nut brown ales, IPAs and Scottish ales."
}, {
	"name": "Wheat Malt",
	"color": 2,
	"ppg": 38,
	"type": "Grain",
	"description": "Light flavor and creamy head. For American weizenbier, weissbier and dunkelweiss."
}, {
	"name": "White Wheat Malt",
	"color": 2,
	"ppg": 37,
	"type": "Grain",
	"description": "Imparts a malty flavor. For American wheat beers, wheat bock and doppel bock."
}, {
	"name": "Aromatic Malt",
	"color": 23,
	"ppg": 36,
	"type": "Grain",
	"description": "Imparts a big malt aroma. Use in brown ales, Belgian dubbels and tripels."
}, {
	"name": "Biscuit Malt",
	"color": 24,
	"ppg": 35,
	"type": "Grain",
	"description": "Warm baked biscuit flavor and aroma. Increases body. Use in Belgian beers."
}, {
	"name": "Caramunich Malt",
	"color": 56,
	"ppg": 33,
	"type": "Grain",
	"description": "Caramel, full flavor, copper color. For Belgian ales, German smoked and bocks."
}, {
	"name": "Caravienne Malt",
	"color": 22,
	"ppg": 34,
	"type": "Grain",
	"description": "Belgian light crystal malt. Used in lighter Abbey or Trappist style ales."
}, {
	"name": "Pale Ale Malt (Belgian)",
	"color": 3.2,
	"ppg": 38,
	"type": "Grain",
	"description": "Use as a base malt for any Belgian style beer with full body."
}, {
	"name": "Pilsen Malt",
	"color": 1.5,
	"ppg": 37,
	"type": "Grain",
	"description": "Light color, malty flavor. For pilsners, dubbels, tripels, whites and specialty ales."
}, {
	"name": "Special B Malt",
	"color": 190,
	"ppg": 31,
	"type": "Grain",
	"description": "Extreme caramel aroma and flavor. For dark Abbey beers and other dark beers."
}, {
	"name": "Scotmalt Golden Promise",
	"color": 2.4,
	"ppg": 38,
	"type": "Grain",
	"description": "Scottish pale ale malt; base malt for all Scottish beers."
}, {
	"name": "Flaked Barley",
	"color": 1.5,
	"ppg": 32,
	"type": "Grain",
	"description": "Helps head retention. imparts creamy smoothness. For porters and stouts."
}, {
	"name": "Flaked Maize",
	"color": 1,
	"ppg": 37,
	"type": "Grain",
	"description": "Lightens body and color. For light American pilsners and ales."
}, {
	"name": "Flaked Oats",
	"color": 1,
	"ppg": 33,
	"type": "Grain",
	"description": "Adds body and creamy head. For stouts and oat ales."
}, {
	"name": "Flaked Rye",
	"color": 2,
	"ppg": 36,
	"type": "Grain",
	"description": "Imparts a dry, crisp character. Use in rye beers."
}, {
	"name": "Flaked Wheat",
	"color": 2,
	"ppg": 36,
	"type": "Grain",
	"description": "Imparts a wheat flavor, hazy color. For wheat and Belgian white beers."
}, {
	"name": "Gambrinus Honey Malt",
	"color": 25,
	"ppg": 34,
	"type": "Grain",
	"description": "Nutty honey flavor. For brown ales, Belgian wheats, bocks and many other styles."
}, {
	"name": "Grits",
	"color": 1.2,
	"ppg": 37,
	"type": "Grain",
	"description": "Imparts a corn/grain taste. Use in American lagers."
}, {
	"name": "Amber Malt",
	"color": 35,
	"ppg": 32,
	"type": "Grain",
	"description": "Roasted malt used in British milds, old ales, brown ales, nut brown ales."
}, {
	"name": "Brown Malt",
	"color": 65,
	"ppg": 32,
	"type": "Grain",
	"description": "Imparts a dry, biscuit flavor. Use in porters, brown, nut brown and Belgian ales."
}, {
	"name": "Maris Otter Pale Malt",
	"color": 3,
	"ppg": 38,
	"type": "Grain",
	"description": "Premium base malt for any beer. Good for pale ales."
}, {
	"name": "Pale Ale (UK)",
	"color": 2.2,
	"ppg": 38,
	"type": "Grain",
	"description": "Moderate malt flavor. Used to produce traditional English and Scottish style ales."
}, {
	"name": "Lager Malt (UK)",
	"color": 1.6,
	"ppg": 38,
	"type": "Grain",
	"description": "Used to make light colored and flavored lagers."
}, {
	"name": "Mild Ale Malt (UK)",
	"color": 2.5,
	"ppg": 37,
	"type": "Grain",
	"description": "Dry, nutty malty flavor. Promotes body. Use in English mild ales."
}, {
	"name": "Cara-Pils Dextrin (UK)",
	"color": 12,
	"ppg": 33,
	"type": "Grain",
	"description": "Adds body; aids head retention. For porters, stouts and heavier bodied beers."
}, {
	"name": "Chocolate Malt",
	"color": 425,
	"ppg": 34,
	"type": "Grain",
	"description": "Nutty, toasted flavor, brown color. Use in brown ales, porters, stouts and bocks."
}, {
	"name": "Black Patent Malt",
	"color": 550,
	"ppg": 26,
	"type": "Grain",
	"description": "Dry, burnt, chalky character. Use in porters, stouts, brown ales and dark lagers."
}, {
	"name": "Peat Smoked Malt",
	"color": 2.8,
	"ppg": 34,
	"type": "Grain",
	"description": "Imparts a robust smoky flavor and aroma. For Scottish ales and wee heavies."
}, {
	"name": "Roasted Barley",
	"color": 500,
	"ppg": 25,
	"type": "Grain",
	"description": "Dry, roasted flavor, amber color. For stouts, porters and Scottish ales."
}, {
	"name": "Toasted Pale Malt",
	"color": 25,
	"ppg": 38,
	"type": "Grain",
	"description": "Imparts nutty flavor and aroma. Use in IPAs and Scottish ales."
}, {
	"name": "Torrified Wheat",
	"color": 1.5,
	"ppg": 36,
	"type": "Grain",
	"description": "Puffed wheat created by high heat. Use in pale ales, bitters and milds."
}, {
	"name": "Acidulated (Sauer) Malt",
	"color": 2.3,
	"ppg": 33,
	"type": "Grain",
	"description": "High lactic acid. For lambics, sour mash beers, Irish stout, pilsners and wheats."
}, {
	"name": "Carafa I",
	"color": 300,
	"ppg": 38,
	"type": "Grain",
	"description": "Gives deep aroma and color to dark beers, bocks, stout, alt and schwarzbier."
}, {
	"name": "Carafa II",
	"color": 400,
	"ppg": 38,
	"type": "Grain",
	"description": "Carafa I, II and III also are available de-husked. Adds aroma, color and body."
}, {
	"name": "Carafa III",
	"color": 500,
	"ppg": 38,
	"type": "Grain",
	"description": "Carafa I, II and III also are available de-husked. Adds aroma, color and body."
}, {
	"name": "Chocolate Wheat Malt",
	"color": 400,
	"ppg": 38,
	"type": "Grain",
	"description": "Intensifies aroma; improves color. For dark ales, alt, dark wheat, stout and porter."
}, {
	"name": "Chocolate Rye Malt",
	"color": 250,
	"ppg": 30,
	"type": "Grain",
	"description": "Enhances aroma of dark ales and improves color. For dunkel rye wheat and ale."
}, {
	"name": "CaraHell Malt (light crystal)",
	"color": 10,
	"ppg": 34,
	"type": "Grain",
	"description": "For light colored beer for body; hefeweizen, pale ale, golden ale, Oktoberfest."
}, {
	"name": "CaraMunich Malt I",
	"color": 34,
	"ppg": 34,
	"type": "Grain",
	"description": "Provides body. For Oktoberfest, bock, porter, stout, red, amber and brown ales."
}, {
	"name": "CaraMunich Malt II",
	"color": 46,
	"ppg": 34,
	"type": "Grain",
	"description": "CaraMunich Malt III is dark crystal."
}, {
	"name": "CaraMunich Malt III",
	"color": 56,
	"ppg": 34,
	"type": "Grain",
	"description": "Dark Crystal Malt"
}, {
	"name": "Light Munich Malt",
	"color": 5,
	"ppg": 34,
	"type": "Grain",
	"description": "For a desired malty, nutty flavor. Lagers, Oktoberfests and bock beer."
}, {
	"name": "Dark Munich Malt",
	"color": 9,
	"ppg": 34,
	"type": "Grain",
	"description": "Enhances body and aroma. Stout, schwarzbier, brown ale, dark and amber ales."
}, {
	"name": "Melanoidin Malt",
	"color": 27,
	"ppg": 33,
	"type": "Grain",
	"description": "For amber lagers and ales, dark lagers and ales, Scottish & red ales."
}, {
	"name": "Rauch Smoked Malt",
	"color": 3,
	"ppg": 37,
	"type": "Grain",
	"description": "For rauchbier, kellerbier, smoked porters, Scottish ales and barleywines."
}, {
	"name": "Rye Malt",
	"color": 3,
	"ppg": 29,
	"type": "Grain",
	"description": "Dry character. Can use as a base malt. For seasonal beers, roggenbier and ales."
}, {
	"name": "Wheat Malt Light",
	"color": 2,
	"ppg": 39,
	"type": "Grain",
	"description": "Typical top fermented aroma, produces superb wheat beers."
}, {
	"name": "Wheat Malt Dark",
	"color": 7,
	"ppg": 39,
	"type": "Grain",
	"description": " Darker Kilned Wheat malt"
}, {
	"name": "Caramel Wheat Malt",
	"color": 45,
	"ppg": 35,
	"type": "Grain",
	"description": "For dark ales, hefeweizen, dunkelweizen, wheat bocks and double bocks."
}, {
	"name": "Belgian Candi Sugar (clear)",
	"color": 0.5,
	"ppg": 36,
	"type": "adjunct",
	"description": "Smooth taste, good head retention, sweet aroma and high gravity without being apparent. Use in Belgian and holiday ales. Use clear for tripels."
}, {
	"name": "Candi Sugar (amber)",
	"color": 75,
	"ppg": 36,
	"type": "adjunct",
	"description": "Smooth taste, good head retention, sweet aroma and high gravity without being apparent. Use in Belgian and holiday ales. Use amber for dubbels."
}, {
	"name": "Candi Sugar (dark)",
	"color": 275,
	"ppg": 36,
	"type": "adjunct",
	"description": "Smooth taste, good head retention, sweet aroma and high gravity without being apparent. Use in Belgian and holiday ales. Use dark for brown beer and strong golden ales."
}, {
	"name": "Brown Sugar",
	"color": 40,
	"ppg": 46,
	"type": "adjunct",
	"description": "Imparts rich, sweet flavor. Use in Scottish ales, old ales and holiday beers."
}, {
	"name": "Dark Brown Sugar",
	"color": 60,
	"ppg": 46,
	"type": "adjunct",
	"description": "Imparts rich, sweet flavor. Use in Scottish ales, old ales and holiday beers."
}, {
	"name": "Corn Sugar",
	"color": 1,
	"ppg": 37,
	"type": "adjunct",
	"description": "Use in priming beer or in extract recipes where flaked maize would be used in a mash."
}, {
	"name": "Demerara Sugar",
	"color": 1,
	"ppg": 41,
	"type": "adjunct",
	"description": "Imparts mellow, sweet flavor. Use in English ales."
}, {
	"name": "Dextrose (glucose)",
	"color": 1,
	"ppg": 37,
	"type": "adjunct",
	"description": "Imparts a mild sweet taste and smoothness. Use in English beers."
}, {
	"name": "Dry Malt Extract Extra Light",
	"color": 2.5,
	"ppg": 44,
	"type": "Extract",
	"description": "Extra light (2.5), Light (3.5), Amber (10), Dark (30), Wheat (3)"
}, {
	"name": "Dry Malt Extract Light",
	"color": 3.5,
	"ppg": 44,
	"type": "Extract",
	"description": "Extra light (2.5), Light (3.5), Amber (10), Dark (30), Wheat (3)"
}, {
	"name": "Dry Malt Extract Amber",
	"color": 10,
	"ppg": 44,
	"type": "Extract",
	"description": "Extra light (2.5), Light (3.5), Amber (10), Dark (30), Wheat (3)"
}, {
	"name": "Dry Malt Extract Dark",
	"color": 30,
	"ppg": 44,
	"type": "Extract",
	"description": "Extra light (2.5), Light (3.5), Amber (10), Dark (30), Wheat (3)"
}, {
	"name": "Dry Malt Extract Wheat",
	"color": 3,
	"ppg": 44,
	"type": "Extract",
	"description": "Extra light (2.5), Light (3.5), Amber (10), Dark (30), Wheat (3)"
}, {
	"name": "Honey",
	"color": 2,
	"ppg": 32,
	"type": "adjunct",
	"description": "Imparts sweet and dry taste. For honey and brown ales. Also: specialty ales."
}, {
	"name": "Invert Sugar",
	"color": 0,
	"ppg": 46,
	"type": "adjunct",
	"description": "Increases alcohol. Use in some Belgian or English ales. Use as an adjunct for priming. Made from sucrose. No dextrins. Use 1 cup for priming."
}, {
	"name": "Lactose",
	"color": 0,
	"ppg": 43,
	"type": "adjunct",
	"description": "Adds sweetness and body. Use in sweet or milk stouts."
}, {
	"name": "Lyle's Golden Syrup",
	"color": 0,
	"ppg": 36,
	"type": "adjunct",
	"description": "Increases alcohol without flavor. Liquid Invert Sugar. Use in English and Belgian (Chimay) ales."
}, {
	"name": "Maple Syrup",
	"color": 35,
	"ppg": 30,
	"type": "adjunct",
	"description": "Imparts a dry, woodsy flavor if used in the boil. If beer is bottled with it, it gives it a smooth sweet, maple taste. Use in maple ales, pale ales, brown ales and porters."
}, {
	"name": "Maple Sap",
	"color": 3,
	"ppg": 9,
	"type": "adjunct",
	"description": "Crisp dry, earthy flavor. Use in pale ales, porters and maple ales."
}, {
	"name": "Molasses",
	"color": 80,
	"ppg": 36,
	"type": "adjunct",
	"description": "Imparts strong sweet flavor. Use in stouts and porters."
}, {
	"name": "Rice Solids",
	"color": 0.01,
	"ppg": 40,
	"type": "Grain",
	"description": "Lightens flavor without taste. Use in American and Asian lagers."
}, {
	"name": "Sucrose (white table sugar)",
	"color": 0,
	"ppg": 46,
	"type": "adjunct",
	"description": "Increases alcohol. Use in Australian lagers and English bitters."
}, {
	"name": "Syrup Extra Light Malt Extract",
	"color": 3.5,
	"ppg": 35,
	"type": "Syrup",
	"description": "Typical Malt Extract Syrup"
}, {
	"name": "Syrup Light Malt Extract",
	"color": 5,
	"ppg": 35,
	"type": "Syrup",
	"description": "Typical Malt Extract Syrup"
}, {
	"name": "Syrup Amber Malt Extract",
	"color": 10,
	"ppg": 35,
	"type": "Syrup",
	"description": "Typical Malt Extract Syrup"
}, {
	"name": "Syrup Dark Malt Extract",
	"color": 30,
	"ppg": 35,
	"type": "Syrup",
	"description": "Typical Malt Extract Syrup"
}, {
	"name": "Syrup Wheat Malt Extract",
	"color": 20,
	"ppg": 35,
	"type": "Syrup",
	"description": "Typical Malt Extract Syrup"
}, {
	"name": "Treacle",
	"color": 100,
	"ppg": 36,
	"type": "adjunct",
	"description": "Imparts intense, sweet flavor. A British mixture of molasses, invert sugar and golden syrup (corn syrup). Use in dark English ales."
}];