'use strict'

module.exports = (logSources, printer) => {	
	// Retrieve the first first log entry in each logSource and store it into an Array
	
	const logMap = new Map();

	const peekLogList = logSources.map(logSource => {
		const firstLogEntry = logSource.pop();
		logMap.set(firstLogEntry, logSource);
		return firstLogEntry;
	});

	// Sort the peekLogList
	peekLogList.sort((el1, el2) => {
		return  el1.date - el2.date;
	});

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
			bubbleSwapByDate(peekLogList);
		}
	}

	checkDrained(logSources);
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

function checkDrained(logSources) {
	for (var i=0; i<logSources.length; i++){
		if (!logSources[i].drained) {
			throw new Error('Log sources are not drained');
		}
	}
	console.log('Done');
}
