'use strict'
const P = require('bluebird');

module.exports = (logSources, printer) => {

	const logMap = new Map();

	let peekLogList = logSources.map(logSource => {
		return logSource.popAsync();
	});

	P.all(peekLogList)
	.then((result) => {
		logSources.forEach((logSource, index) => {
			logMap.set(result[index], logSource);
		});
		return result;
	})
	.then((result) => {
		result.sort((el1, el2) => {
			return  el1.date - el2.date;
		});
		return result;
	})
	.then((result) => {
		const peekLogList = result;
		promiseWhile(() => {
			return peekLogList.length > 0;
		}, () => {
			printer.print(peekLogList[0], peekLogList);
			const logSource = logMap.get(peekLogList[0]);
			return logSource.popAsync()
			.then((result) => {
				peekLogList[0] = result;
				logMap.set(peekLogList[0], logSource);

				if (!peekLogList[0]) {
					// Remove the element from array with with a queue-like shift if the log source is drained
					peekLogList.shift();
				} else {
					// Use bubbleswap to efficiently resort the list
					bubbleSwapByDate(peekLogList);
				}
			})
		})
	})
}

function promiseWhile(condition, action) {
	const resolver = P.defer();

	const loop = () => {
		if (!condition()) {
			return resolver.resolve();
		}
		return P.cast(action())
			.then(loop)
			.catch(resolver.reject);
	}
	process.nextTick(loop);

	return resolver.promise;
}

function bubbleSwapByDate(list) {
	for (let counter = 0; counter < list.length-1; counter++) {
		if (list[counter].date > list[counter+1].date) {
			const temp = list[counter+1];
			list[counter+1] = list[counter];
			list[counter] = temp;
			continue;
		}
		break;
	}
}
