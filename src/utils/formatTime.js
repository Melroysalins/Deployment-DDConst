import { WeekName } from 'constant'
import { format, formatDistanceToNow } from 'date-fns'
import moment from 'moment'
import i18n from './locales/i18n'
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

export function getDateTimeEngKorean(date) {
	const isEng = i18n.language === 'en'
	return new Intl.DateTimeFormat(isEng ? 'en-US' : 'ko-KR', {
		year: 'numeric',
		month: isEng ? 'short' : 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		hour12: true,
	}).format(new Date(date))
}

export function getDateEngKorean(date) {
	const isEng = i18n.language === 'en'
	return new Intl.DateTimeFormat(isEng ? 'en-US' : 'ko-KR', {
		year: 'numeric',
		month: isEng ? 'short' : 'long',
		day: 'numeric',
	}).format(new Date(date))
}

export function getWeekName(date) {
	const currentDate = moment().startOf('week')
	const inputDate = moment(date).startOf('week')

	if (currentDate.isSame(inputDate, 'week')) {
		return WeekName.Current
	}
	if (inputDate.isAfter(currentDate)) {
		return WeekName.Next
	}
	return WeekName.Previous
}

export function differenceInDays(start, end) {
	const startDate = new Date(start)
	const endDate = new Date(end)
	const differenceInMilliseconds = endDate - startDate
	return differenceInMilliseconds / (1000 * 60 * 60 * 24)
}
