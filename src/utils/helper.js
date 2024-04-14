export const getSelectValue = (value) => (typeof value === 'string' ? value.split(',') : value)

export const isNotEmpty = (value) => !isEmpty(value)
export const isEmpty = (value) =>
	!value ||
	(Array.isArray(value) && value.length === 0) ||
	(typeof value === 'object' && Object.keys(value).length === 0)

export const dummyArray = (name, count = 10) => [...Array(count).keys()].map((e) => `${name} ${e}`)

export const dummyArrayEmpty = (count = 10) => [...Array(count).keys()].map(() => '-')

export const formatNumber = (num) => num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')

export function calculteDateDiff(startDate, endDate) {
	// Convert the input strings to Date objects
	const start = new Date(startDate)
	const end = new Date(endDate)
	const timeDiff = end.getTime() - start.getTime()
	const remainingDays = Math.ceil(timeDiff / (1000 * 3600 * 24))

	return remainingDays
}

export function calculateRemainingDays(endDate) {
	// Convert the input strings to Date objects
	const end = new Date(endDate)
	const today = new Date()
	// Calculate the time difference in milliseconds
	const timeDiff = end.getTime() - today.getTime()
	let remainingDays = Math.ceil(timeDiff / (1000 * 3600 * 24))

	// Check if the current date is after the start date
	if (today > end) {
		remainingDays = 0
	}
	return remainingDays
}

export function calculateCompletedDays(startDate, endDate) {
	// Convert the start date string to a Date object
	const start = new Date(startDate)
	const today = new Date()
	// Calculate the time difference in milliseconds
	const timeDiff = today.getTime() - start.getTime()
	// Convert milliseconds to days
	let completedDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) - 1
	const maxDiff = calculteDateDiff(startDate, endDate)

	if (completedDays > maxDiff) {
		completedDays = maxDiff
	}

	return completedDays
}

export const countTruthyLengths = (array) =>
	array
		.filter(
			(value) =>
				value !== null &&
				value !== undefined &&
				value !== '' &&
				value !== false &&
				(Array.isArray(value) ? value.length !== 0 : true)
		)
		.map((value) => (typeof value === 'string' || (Array.isArray(value) && value.length !== 0) ? value.length : 0))
