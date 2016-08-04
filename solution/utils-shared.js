'use strict';

const P = require('bluebird');

module.exports = {
	sortDateByAscending(input) {
		input.sort((el1, el2) => {
			return  el1.date - el2.date;
		});

		return input;
	},
	binarySwap(list) {
		if (list.length === 1) {
			return list;
		}

		const moveable = list.shift();
		if (list.length === 1) {
			if (moveable.date <= list[0].date) {
				list.splice(0, 0, moveable);
			} else {
				list.splice(1, 0, moveable);
			}
			return list;

		}
		return binaryInsertion(list, moveable, 0, list.length-1);
	},
	checkDrained(logSources) {
		for (var i=0; i<logSources.length; i++){
			if (!logSources[i].drained) {
				throw new Error('Log sources are not drained');
			}
		}
		console.log('Log sources are all drained');
	}
}

function binaryInsertion(list, moveable, begin, end) {
	if (begin === end) {
		if (moveable.date <= list[begin].date) {
			return begin;
		} else {
			return begin+1;
		}
	}
	const half = Math.floor((begin + end) / 2);
	let lindex, rindex;
	if (moveable.date <= list[half].date) {
		lindex = binaryInsertion(list, moveable, begin, half);
	} else {
		rindex = binaryInsertion(list, moveable, half+1, end);
	}

	if (!isNaN(lindex)) {
		list.splice(lindex, 0, moveable);
	}
	else if (!isNaN(rindex)) {
		list.splice(rindex, 0, moveable);
	}

	return list;
}