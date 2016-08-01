'use strict';

const P = require('bluebird');

module.exports = {
	sortDateByAscending(input) {
		input.sort((el1, el2) => {
			return  el1.date - el2.date;
		});

		return input;
	},
	bubbleSwapByDate(list) {
		for (let counter = 0; counter < list.length-1; counter++) {
			if (list[counter].date > list[counter+1].date) {
				const temp = list[counter+1];
				list[counter+1] = list[counter];
				list[counter] = temp;
				continue;
			}
			break;
		}

		return list;
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