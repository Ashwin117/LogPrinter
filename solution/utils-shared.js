'use strict';

const P = require('bluebird');

module.exports = {
	sortDateByAscending(input) {
		input.sort((el1, el2) => {
			return  el1.date - el2.date;
		});

		return input;
	},
	binaryInsertion(list) {
		if (list.length === 1) {
			return list;
		}

		return binarySwap(list, list.shift(), 0, list.length-1);
		function binarySwap(list, moveable, begin, end) {
			if (begin === end) {
				if (moveable.date <= list[begin].date) {
					if (list.length == 1) {
						list.splice(begin, 0, moveable);
						return list;
					}
					return begin;
				} else {
					if (list.length == 1) {
						list.splice(begin+1, 0, moveable);
						return list;
					}
					return begin+1;
				}
			}
			var half = Math.floor((begin + end) / 2);
			var lindex, rindex;
			if (moveable.date <= list[half].date) {
				lindex = binarySwap(list, moveable, begin, half);
			} else {
				rindex = binarySwap(list, moveable, half+1, end);
			}

			if (!isNaN(lindex)) {
				list.splice(lindex, 0, moveable);
			}
			if (!isNaN(rindex)) {
				list.splice(rindex, 0, moveable);
			}

			return list;
		}
	},
	checkDrained(logSources) {
		for (var i=0; i<logSources.length; i++){
			if (!logSources[i].drained) {
				debugger;
				throw new Error('Log sources are not drained');
			}
		}
		console.log('Log sources are all drained');
	}
}