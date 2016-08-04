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
		P.coroutine(function*() {	
			while (peekLogList.length > 0) {
				printer.print(peekLogList[0], peekLogList);
				const logSource = logMap.get(peekLogList[0]);
				yield P.resolve(logSource.popAsync())
				.then((result) => {
					peekLogList[0] = result;
					logMap.set(peekLogList[0], logSource);

					if (!peekLogList[0]) {
						peekLogList.shift();
					} else {
						utils.binaryInsertion(peekLogList);
					}
				});
			}
		})()
		.done(() => {
			utils.checkDrained(logSources)
		})
	})
}
