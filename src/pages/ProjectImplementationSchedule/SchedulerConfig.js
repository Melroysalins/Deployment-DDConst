import {
	DateHelper,
	// DependencyMenu,
	// EventEdit,
	// DependencyStore,
	// PredecessorsTab,
	// SuccessorsTab,
	// NestedEvents,
} from '../../lib/bryntum/schedulerpro.module'

// view preset config object

export const customMonthViewPreset = {
	id: 'customMonthViewPreset',
	name: 'Custom Month View',
	base: 'weekAndMonth',
	tickWidth: 40,
	headers: [
		{ unit: 'year', dateFormat: 'YYYY' }, // Year header (e.g., "2025")
		{ unit: 'month', dateFormat: 'MMMM YYYY', align: 'start' }, // Month header
		{ unit: 'day', dateFormat: 'DD' },
		{
			unit: 'day',
			dateFormat: 'dd',
			align: 'center',
		},
	],
}

export const CustomViewDay = {
	id: 'customDayView',
	base: 'hourAndDay',
	headers: [
		{
			unit: 'day',
			align: 'center',
			renderer: (startDate) => {
				console.log('MYYYYYStart Date:', startDate) // Optional debug
				// Format: Sunday 06-07-2025
				return DateHelper.format(startDate, 'dddd YYYY-MM-DD')
			},
		},
		{
			unit: 'hour',
			increment: 1,
			dateFormat: 'h A',
		},
	],
}

// resources array
export const resources = [
	{ id: 'metal_fittings', name: 'Metal Fittings', width: 100 },
	{ id: 'installations', name: 'Installation', width: 100 },
	{ id: 'connections', name: 'Connection', width: 100 },
	{ id: 'completion_test', name: 'Completion Test (AC)', width: 100 },
]

export const columns = [{ text: 'Work / Team', field: 'name', width: 200 }]

export const features = {
	// dependencyEdit: true,
	// nestedEvents: true,
	// dependencies: true,
	// eventDrag: {
	// 	constrainDragToTimeline: false,
	// 	showExactDropPosition: true,
	// 	constrainDragToResource: true,
	// },
	// eventResize: true,
	// eventDragSelect: {
	// 	disabled: false,
	// 	allowSelect: true,
	// 	showTooltip: true,
	// },

	// taskEdit: {
	// 	editorConfig: {
	// 		title: 'Example ',
	// 	},
	// 	items: {
	// 		generalTab: true,
	// 		notesTab: true,
	// 		predecessorsTab: true,
	// 		successorsTab: true,
	// 		newTab: {
	// 			title: 'SubTask',
	// 			weight: 90,
	// 			items: {
	// 				subtasksContainer: {
	// 					type: 'container',
	// 					ref: 'subtasksContainer',
	// 					layout: 'vbox',
	// 					flex: 1,
	// 					style: 'padding: 10px;',
	// 				},
	// 			},
	// 		},
	// 	},
	// },
	// eventMenu: {
	// 	items: {
	// 		addTask: {
	// 			text: 'Add SubTask',
	// 			icon: 'b-fa b-fa-plus',
	// 			ref: 'addSubtaskItem',
	// 		},
	// 	},
	// },

	dependencyMenu: true,
	eventTooltip: {
		showTooltip: true,
		tooltipTemplate({ eventRecord }) {
			const start = DateHelper.format(eventRecord.startDate, 'YYYY MMM, D')
			const end = DateHelper.format(eventRecord.endDate, 'YYYY MMM, D')

			console.log('TOOLTIP', start, end)

			const name = eventRecord.name || 'Unnamed Task'

			return `
						<div class="custom-tooltip">
						  <div class="task-name">${name}</div>
						  <div class="task-dates">
							<div>
							  <span class="label">Start:</span>
							  <span class="value">${start}</span>
							</div>
							<div>
							  <span class="label">End:</span>
							  <span class="value">${end}</span>
							</div>
						  </div>
						</div>
					  `
		},
	},
}

export const dependencyTypeMap = {
	0: 'StartToStart',
	1: 'StartToEnd',
	2: 'EndToStart',
	3: 'EndToEnd',
}

const lagUnitMap = {
	ms: 'ms', // milliseconds
	s: 's', // seconds
	m: 'm', // minutes
	h: 'h', // hours
	d: 'd', // days
	w: 'w', // weeks
	M: 'M', // months
	y: 'y', // years
}

// Utility functions
export const getTimelineRange = () => {
	const today = new Date()
	const startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1) // 1 month in the past
	const endDate = new Date(today.getFullYear(), today.getMonth() + 2, 0) // 1 month in the future
	return { startDate, endDate }
}

export const getISODateString = (date) => {
	// Ensure it's a Date object
	const d = new Date(date)
	// Get year, month (0-indexed), and day
	const year = d.getFullYear()
	const month = String(d.getMonth() + 1).padStart(2, '0') // Add 1 because months are 0-indexed
	const day = String(d.getDate()).padStart(2, '0')
	return `${year}-${month}-${day}`
}

export const zoomPresets = [
	{
		id: 'zoom-out',
		tickWidth: 60,
		headers: [
			{ unit: 'month', dateFormat: 'MMMM YYYY' },
			{ unit: 'day', dateFormat: 'D ddd' },
		],
	},
	{
		id: 'zoom-normal',
		tickWidth: 100,
		headers: [
			{ unit: 'month', dateFormat: 'MMMM YYYY' },
			{ unit: 'day', dateFormat: 'D ddd' },
		],
	},
	{
		id: 'zoom-in',
		tickWidth: 160,
		headers: [
			{ unit: 'month', dateFormat: 'MMMM YYYY' },
			{ unit: 'day', dateFormat: 'D ddd' },
		],
	},
]
