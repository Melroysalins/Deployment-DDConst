import { format, formatDistanceToNow } from 'date-fns'

// ----------------------------------------------------------------------

export function fDate(date) {
	return format(new Date(date), 'dd MMMM yyyy')
}

export function fDateTime(date) {
	return format(new Date(date), 'dd/MM/yyyy HH:mm')
}

export function fDateTimeSuffix(date) {
	return format(new Date(date), 'dd/MM/yyyy hh:mm p')
}

export function fDateLocale(date) {
	return format(new Date(date), 'dd/MM/yyyy')
}
export function fTimeLocale(date) {
	return format(new Date(date), 'HH:mm')
}

export function fToNow(date) {
	return formatDistanceToNow(new Date(date), {
		addSuffix: true,
	})
}

export function getDateTimeEngKorean(currentDate, isEng = true) {
	// Format the current date using Intl.DateTimeFormat
	return new Intl.DateTimeFormat(isEng ? 'en-US' : 'ko-KR', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		hour12: true,
	}).format(new Date(currentDate))
}
