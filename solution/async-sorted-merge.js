'use strict'

const P = require('bluebird');
const utils = require('./utils-shared');

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
		return utils.sortDateByAscending(result);
	})
	.then((result) => {
		const peekLogList = result;
		promiseWhile(() => {
			return peekLogList.length > 0;
		}, () => {
			return new P((resolve, reject) => {
				printer.print(peekLogList[0], peekLogList);
				const logSource = logMap.get(peekLogList[0]);
				return logSource.popAsync()
				.then((result) => {
					if (!result) {
						resolve();
					}
					peekLogList[0] = result;
					logMap.set(peekLogList[0], logSource);

					if (!peekLogList[0]) {
						// Remove the element from array with with a queue-like shift if the log source is drained
						peekLogList.shift();
					} else {
						// Use bubbleswap to efficiently resort the list
						utils.binaryInsertion(peekLogList);
					}
					resolve();
				})
			})
		})
		.done(() => {
			utils.checkDrained(logSources)
		})
	})
}

function promiseWhile(condition, action) {
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
