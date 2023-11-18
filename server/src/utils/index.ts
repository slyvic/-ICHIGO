/**
 * delay process for delayTimes
 * @param {Number} delayTimes - timePeriod for delay
 */
export const delay = (delayTimes: number) => {
	return new Promise((resolve: any) => {
		setTimeout(() => {
			resolve(2);
		}, delayTimes);
	});
};

export const checkIfString = (data: any) => {
	return (typeof data === 'string' || data instanceof String)
}
export const checkIfNumber = (data: any) => {
	return (typeof data === "number")
}

export const getThisYear = (date: string = null) => {
	var now = new Date()
	if (date) now = new Date(date)
	return now.getUTCFullYear();
}

export const getStartDateOfYear = (year: number) => {
	return (new Date(Date.UTC(year, 0, 1))).toUTCString();
}