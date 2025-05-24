import {
	DateHelper,
	DependencyMenu,
	EventEdit,
	DependencyStore,
	PredecessorsTab,
	SuccessorsTab,
	NestedEvents,
} from '@bryntum/schedulerpro'
import React from 'react'

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

// resources array
export const resources = [
	{ id: 'metal_fittings', name: 'Metal Fittings', width: 100 },
	{ id: 'installations', name: 'Installation', width: 100 },
	{ id: 'connections', name: 'Connection', width: 100 },
	{ id: 'completion_test', name: 'Completion Test (AC)', width: 100 },
]

export const columns = [{ text: 'Work / Team', field: 'name', width: 200 }]

export const features = {
	// autoAdjustTimeAxis: true,
	dependencyEdit: true,
	nestedEvents: true,

	eventDrag: {
		constrainDragToTimeline: false,
		showExactDropPosition: true,
		constrainDragToResource: true, // <-- Only allow dragging within the same row/resource
	},
	eventResize: true,
	// Add event drag selection feature
	eventDragSelect: {
		disabled: false,
		allowSelect: true, // Allow selecting events
		showTooltip: true, // Show tooltip with selected events count
	},
	eventCopyPaste: {
		disabled: false,
	},
	taskEdit: {
		items: {
			generalTab: true,
			predecessorsTab: true,
			successorsTab: true,
		},
	},
	// eventEdit: {
	//     // Custom event editor to handle task creation and editing
	//     editorConfig: {
	//         items: {
	//             // Add custom fields for task creation
	//             dependency: true,
	//         },
	//     },
	// },
	dependencies: {
		clickWidth: 6,
		radius: 30,
	}, // draw dependency lines
	// dependencyEdit: true,            // allow editing dependencies
	dependencyMenu: true, // (optional) context-menu support
	// eventEdit: {                // configure the task editor
	//     // show Predecessors/Successors tabs
	//     items: {
	//         general: true,          // default fields
	//         predecessors: true,          // Predecessors dropdown
	//         successors: true           // Successors dropdown
	//     }
	// },
	// taskEdit: {
	//     items: {
	//         successorsTab: {
	//             items: {
	//                 grid: {
	//                     columns: {
	//                         // Columns are held in a store, thus it uses `data`
	//                         // instead of `items`
	//                         data: {
	//                             name: {
	//                                 // Change header text for the name column
	//                                 text: 'Linked to'
	//                             }
	//                         }
	//                     }
	//                 }
	//             }
	//         }
	//     }
	// },
	// Optionally add tooltip to show scheduling conflicts
	eventTooltip: {
		template: (data) => {
			return `
                        <div class="b-sch-event-title">${data.eventRecord.name}</div>
                        <div class="b-sch-event-time">${DateHelper.format(
													data.eventRecord.startDate,
													'HH:mm'
												)} - ${DateHelper.format(data.eventRecord.endDate, 'HH:mm')}</div>
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
