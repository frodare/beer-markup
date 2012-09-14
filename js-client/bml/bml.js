(function($) {
	'use strict';

	var defaultRecipe = '';
	defaultRecipe += 'info\n';
	defaultRecipe += '----------------------------\n';
	defaultRecipe += 'style: 10A 2008\n';
	defaultRecipe += 'brewers: \n';
	defaultRecipe += 'size: 5 Gallons\n';
	defaultRecipe += '\n';
	defaultRecipe += 'grain\n';
	defaultRecipe += '----------------------------\n';
	defaultRecipe += '8 lbs American 2 row 1.8L 37PPG\n';
	defaultRecipe += '6 lbs crystal 1.8L 37PPG\n';
	defaultRecipe += '\n';
	defaultRecipe += 'hops\n';
	defaultRecipe += '----------------------------\n';
	defaultRecipe += '60 min 3/4 oz Magnum 12%\n';
	defaultRecipe += '\n';
	defaultRecipe += 'yeast\n';
	defaultRecipe += '----------------------------\n';
	defaultRecipe += '1pkg Safeale US-05 75%\n';
	defaultRecipe += '\n';
	defaultRecipe += 'notes\n';
	defaultRecipe += '----------------------------\n';

	var reserved = ['grain','hops','yeast','notes', 'info'];

	var process = {
		info: function(data, line) {
			var match = line.match(/^\s*([a-z]+)\s*:\s*(.*)\s*/i);
			if (!match) {
				return;
			}
			var key = match[1];
			if($.inArray(key, reserved) < 0){
				data[key] = match[2];
			}
		},
		grain: function (data, line) {
			var match = line.match(/^\s*([0-9\/.]+)\s*(lbs|lb|oz)\s*(.*?)\s*([0-9.]+)l\s*([0-9.]+)ppg/i);
			if (!match) {
				return;
			}
			data.grain.push({
				amount: match[1],
				unit: match[2],
				name: match[3],
				color: match[4],
				ppg: match[5]
			});
		},
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
		}
	};


	$.widget("bml.bmlParser", {
		options: {
			delay: 500
		},

		_create: function() {
			var self = this,
				o = self.options,
				e = self.element;

			e.addClass('bml-parser');
			e.addClass('ui-helper-clearfix');

			self.input = $('<textarea></textarea>').text(defaultRecipe);

			e.append(self.input);

			self.input.on('keyup change', function () {
				self.parseWithDelay();
			});

			self.parse();

		},

		text: function() {
			return this.input.val().toLowerCase();
		},

		parseWithDelay: function () {
			var self = this;

			if(self.wait){
				clearTimeout(self.wait);
			}

			self.wait = setTimeout(function() {
				self.parse();
				self.wait = undefined;
			}, self.options.delay);
		},

		parse: function() {
			var self = this,
				text = self.text(),
				prev, curr, section;

			var data = {
				grain: [],
				hops: [],
				yeast: []
			};

			$.each(text.split('\n'), function(i, line) {
				prev = curr;
				curr = line;


				/*
				 * detect new section
				 */
				if (line.match(/^-{2,}/)) {
					section = prev;
					return;
				}

				if (!section) {
					return;
				}

				if (process[section]) {
					process[section](data, line);
				}

				
			});
			self.data = data;
			self._trigger('update', null, data);
		}
	});



}(jQuery));