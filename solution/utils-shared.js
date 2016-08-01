'use strict';

const P = require('bluebird');

module.exports = {
	sortDateByAscending(input) {
		input.sort((el1, el2) => {
			return  el1.date - el2.date;
		});
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
	},
	checkDrained(logSources) {
		for (var i=0; i<logSources.length; i++){
			if (!logSources[i].drained) {
				throw new Error('Log sources are not drained');
			}
		}
		console.log('Done');
	},
	promiseWhile(condition, action) {
		const deferred = P.defer();

		const loop = () => {
			if (!condition()) {
				return deferred.resolve();
			}
			return P.cast(action())
				.then(loop)
				.catch(deferred.reject);
		}
		process.nextTick(loop);

		return deferred.promise;
	}
}