const BASE_CALENDAR_URL = 'https://www.googleapis.com/calendar/v3/calendars'
const BASE_CALENDAR_ID_FOR_PUBLIC_HOLIDAY = process.env.REACT_APP_BASE_CALENDAR_ID_FOR_PUBLIC_HOLIDAY
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY
const CALENDAR_REGION = 'en.south_korea'

export default async function getHolidays(timeMin, timeMax) {
	let res = await fetch(
		`${BASE_CALENDAR_URL}/${CALENDAR_REGION}%23${BASE_CALENDAR_ID_FOR_PUBLIC_HOLIDAY}/events?key=${API_KEY}&timeMin=${timeMin}&timeMax=${timeMax}`
	)
	res = await res.json()
	const formattedResponse = res.items
		?.map(({ start, end }) => {
			const _start = new Date(start.date)
			_start.setHours(0, 0, 0, 0)
			const _end = new Date(end.date)
			_end.setHours(0, 0, 0, 0)
			return {
				start: _start,
				end: _end,
				background: 'rgba(255, 0, 0, 0.1)',
			}
		})
		.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
	return formattedResponse || []
}
