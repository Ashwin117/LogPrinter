'use strict'

const utils = require('./utils-shared');

module.exports = (logSources, printer) => {	
	// Retrieve the first first log entry in each logSource and store it into an Array
	
	const logMap = new Map();

	const peekLogList = logSources.map(logSource => {
		const firstLogEntry = logSource.pop();
		logMap.set(firstLogEntry, logSource);
		return firstLogEntry;
	});

	// Sort the peekLogList
	utils.sortDateByAscending(peekLogList);

	while (peekLogList.length > 0) {
		printer.print(peekLogList[0], peekLogList);
		const logSource = logMap.get(peekLogList[0]);
		peekLogList[0] = logSource.pop();
		logMap.set(peekLogList[0], logSource);

		if (!peekLogList[0]) {
			// Remove the element from array with with a queue-like shift if the log source is drained
			peekLogList.shift();
		} else {
			// Use bubbleswap to efficiently resort the list
			utils.binaryInsertion(peekLogList);
		}
	}

	utils.checkDrained(logSources);
}
