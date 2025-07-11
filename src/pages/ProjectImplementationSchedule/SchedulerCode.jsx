import { useRef, useEffect } from 'react'
import {
	// Scheduler,
	SchedulerPro,
	// ResourceStore,
	DependencyStore,
	DateHelper,
	ProjectModel,
	TaskEdit,
	EventEdit,
	DependencyEdit,
	PredecessorsTab,
	SuccessorsTab,
	Grid,
} from '../../lib/bryntum/schedulerpro.module'
import '../../lib/bryntum/schedulerpro.stockholm.css'

import moment, { duration } from 'moment-timezone'

import {
	customMonthViewPreset,
	features,
	getTimelineRange,
	dependencyTypeMap,
	getISODateString,
	zoomPresets,
} from './SchedulerConfig'

const SchedulerComponent = ({
	events,
	resources,
	project,
	customMonthViewPreset,
	weekendTimeRanges,
	createNewTasks,
	updateTask,
	deleteTasks,
	createTaskDependency,
	updateTaskDependency,
	deleteTaskDependency,
	id,
	myQueryClient,
	teamsDetails,
}) => {
	const schedulerRef = useRef(null)
	const instanceRef = useRef(null)

	let originalStartDate = null

	let orignalEndDate = null

	let suppressNextEditor = null

	function sortTasksByStartDate(tasks) {
		const seenStartDates = new Set()
		const uniqueStartDateTasks = []
		const duplicateStartDateTasks = []

		// Define the desired order of subtask names
		const defaultSubTaskNames = ['Line', 'Assemble', 'Trim', 'Galvanize', 'Install']
		// Create a map for quick lookup of their order index
		const subTaskOrderMap = new Map(defaultSubTaskNames.map((name, index) => [name, index]))

		// First pass: Separate tasks into unique and duplicate start dates based on their original start date
		tasks?.forEach((task) => {
			const startDate = task.data.startDate instanceof Date ? task.data.startDate : new Date(task.data.startDate)
			const startDateString = startDate.toDateString() // Use toDateString() to ignore time part for uniqueness check

			if (!seenStartDates.has(startDateString)) {
				uniqueStartDateTasks.push(task)
				seenStartDates.add(startDateString)
			} else {
				duplicateStartDateTasks.push(task)
			}
		})

		// Combined sorting function for both unique and duplicate tasks
		const combinedSort = (a, b) => {
			// 1. Primary Sort: By Start Date
			const dateA = a.data.startDate instanceof Date ? a.data.startDate : new Date(a.data.startDate)
			const dateB = b.data.startDate instanceof Date ? b.data.startDate : new Date(b.data.startDate)
			const dateComparison = dateA.getTime() - dateB.getTime()

			if (dateComparison !== 0) {
				return dateComparison // If dates are different, sort by date
			}

			// 2. Secondary Sort: By Subtask Name Order (only if dates are the same)
			const nameA = a.data.title // Assuming 'title' holds the subtask name like 'Line', 'Trim'
			const nameB = b.data.title

			// Get the defined order index, default to a high number if not found (e.g., put unknown names last)
			const orderA = subTaskOrderMap.has(nameA) ? subTaskOrderMap.get(nameA) : Infinity
			const orderB = subTaskOrderMap.has(nameB) ? subTaskOrderMap.get(nameB) : Infinity

			return orderA - orderB // Sort by the predefined order of subtask names
		}

		// Apply the combined sort to both lists
		uniqueStartDateTasks.sort(combinedSort)
		duplicateStartDateTasks.sort(combinedSort) // IMPORTANT: Sort duplicates as well!

		// Return both lists explicitly
		return { unique: uniqueStartDateTasks, duplicates: duplicateStartDateTasks }
	}

	useEffect(() => {
		if (!schedulerRef.current) return

		const ganttProps = {
			stripeFeature: true,
			dependenciesFeature: true,
		}

		const scheduler = new SchedulerPro({
			appendTo: schedulerRef.current,
			autoHeight: true,
			width: '100%',
			infiniteScroll: true,
			viewPreset: customMonthViewPreset,
			tickSize: 100,
			rowHeight: 100,
			endDateIsInclusive: true,
			eventLayout: 'stack',
			dependenciesFeature: true,
			dependencyEditFeature: true,
			ganttProps,
			autoAdjustTimeAxis: false,
			maxZoomLevel: 12,
			timeResolution: {
				unit: 'day',
				increment: 1,
			},
			snapToIncrement: true,
			resourceTimeRanges: weekendTimeRanges,
			features: {
				dependencyEdit: true,
				nestedEvents: true,
				dependencies: true,
				eventDrag: {
					constrainDragToTimeline: false,
					showExactDropPosition: true,
					constrainDragToResource: true,
				},
				eventResize: true,
				eventDragSelect: {
					disabled: false,
					allowSelect: true,
					showTooltip: true,
				},
				eventCopyPaste: {
					disabled: false,
				},
				dependencyMenu: true,
				eventEdit: {
					editorConfig: {
						title: 'Task Info',
					},
					items: {
						generalTab: {
							// Customize the title of the general tab
							title: 'Common',
							items: {
								// Hide the end date field
								endDateField: null,
								// Add a field to edit order name
								orderField: {
									type: 'text',
									name: 'order',
									label: 'Order',
									// Place after name field
									weight: 150,
								},
								priority: {
									type: 'radiogroup',
									name: 'priority',
									label: 'Priority',
									labelWidth: '6em',
									flex: '1 0 100%',
									weight: 150, // Place before resources field
									options: {
										high: 'High',
										med: 'Medium',
										low: 'Low',
									},
								},
							},
						},
						customTab: {
							defaults: {
								labelWidth: '5em',
							},
							title: 'Job',
							items: {
								noteField: {
									type: 'text',
									name: 'note',
									label: 'Note',
								},
								costField: {
									type: 'number',
									name: 'cost',
									label: 'Cost',
								},
								contactField: {
									type: 'text',
									name: 'contact',
									label: 'Contact',
								},
								phoneField: {
									type: 'text',
									name: 'phone',
									label: 'Phone',
								},
							},
							// Show it after generalTab, which has weight 100
							weight: 150,
						},
					},
				},
			},
			columns: [
				{
					text: 'WORK',
					field: 'work',
					width: 160,
					mergeCells: true,
					renderer: ({ record }) => record.name || '',
				},
				{
					text: 'WORK TEAM',
					field: 'workTeam',
					width: 100,
					mergeCells: true,
					renderer: ({ record }) => record.workTeam || '',
				},
				{
					text: 'Y/M',
					children: [
						{
							text: 'D',
							width: 100,
							renderer: ({ record }) => ({
								children: [
									{
										tag: 'div',
										text: record.date || '',
										style: 'margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #e0e0e0;',
									},
									{
										tag: 'div',
										text: record.section || '',
										style: 'color: #666;',
									},
								],
							}),
						},
					],
				},
			],
			eventRenderer: ({ eventRecord }) => {
				const originalName = eventRecord.name
				const startDate = new Date(eventRecord.startDate)
				const endDate = new Date(eventRecord.endDate)
				const durationDays = DateHelper.diff(startDate, endDate, 'day')
				const actualEndDate = DateHelper.add(endDate, -1, 'day')

				let mandays = 0
				const tempStart = new Date(startDate)
				while (tempStart <= actualEndDate) {
					const day = tempStart.getDay()
					if (day !== 0 && day !== 6) mandays += 1
					tempStart.setDate(tempStart.getDate() + 1)
				}

				const isSubtask = eventRecord.parentId && eventRecord.parentId !== 'events-rootNode'

				if (isSubtask) {
					return {
						tag: 'div',
						className: 'b-sch-event-content',
						style: 'display: flex; justify-content: center; align-items: center; width: 100%; height: 100%;',
						children: [
							{
								tag: 'div',
								className: 'b-sch-event-name',
								text: originalName,
								style:
									'flex-grow: 1; text-align: center; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; color: white;',
							},
						],
					}
				}

				const hasChildren = eventRecord.children && eventRecord.children.length > 0
				const parentColor = hasChildren ? '#666' : 'white'

				return {
					tag: 'div',
					className: 'b-sch-event-content',
					style: 'display: flex; justify-content: space-between; align-items: center; width: 100%;',
					children: [
						{
							tag: 'div',
							className: 'b-sch-event-name',
							text: originalName,
							style: `font-size: ${
								durationDays - 1 < 2 ? '11px' : '1em'
							}; flex-grow: 1; text-align: left; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; color: ${parentColor};`,
						},
						{
							tag: 'div',
							className: 'event-duration-info',
							style: `flex-shrink: 0; margin-left: ${durationDays - 1 <= 2 ? '10px' : '30px'}; font-size: ${
								durationDays - 1 < 2 ? '6.2px' : '0.8em'
							}; opacity: 1; color: black; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; display: flex; align-items: center; justify-content: flex-end;`,
							children: [
								{ tag: 'span', text: `[ ${mandays} Mandays ` },
								{ tag: 'i', className: 'b-fa b-fa-arrow-right', style: 'margin: 0 6px; color: black;' },
								{ tag: 'span', text: `${durationDays} Work Days ]` },
							],
						},
					],
				}
			},
			project,
			listeners: {
				beforeDependencySave: (data) => {
					console.log('before Dependency save:', data)
				},
				beforeDependencyCreateFinalize: ({ source, target }) => {
					console.log('before Dependency create finalize:')
					console.log('source', source)
					console.log('target', target)
				},
				afterDependencySave: (data) => {
					console.log('Dependency saved:', data)
				},
				beforeDependencyDelete: (data) => {
					console.log('Before dependency delete:', data)
				},

				eventDragStart: (data) => {
					console.log('Event drag started:', data)
				},
				eventDrop: ({ eventRecords }) => {
					if (eventRecords?.[0]?.data?.isTask) {
						eventRecords.forEach((event) => {
							const bryntumStartDate = event.data.startDate
							const bryntumEndDate = event.data.endDate

							const start_date_for_backend = DateHelper.format(bryntumStartDate, 'YYYY-MM-DD')
							const inclusiveEndDate = DateHelper.add(bryntumEndDate, -1, 'day')
							const end_date_for_backend = DateHelper.format(inclusiveEndDate, 'YYYY-MM-DD')

							const lastEndDate = new Date(end_date_for_backend)

							lastEndDate.setDate(lastEndDate.getDate() + 1)

							const final_end_date = DateHelper.format(lastEndDate, 'YYYY-MM-DD')

							//  basically converting string date type to object to compare
							const end_date_obj = new Date(end_date_for_backend)
							const final_end_date_obj = new Date(final_end_date)

							console.log('Updating main task:', {
								id: event.data.id,
								start_date: start_date_for_backend,
								end_date: end_date_for_backend,
								final_end_date,
							})

							// 1. Update parent task
							updateTask({ start_date: start_date_for_backend, end_date: end_date_for_backend }, event.data.id).then(
								(res) => {
									if (res.status >= 200 && res.status < 300) {
										// 2. Update subtasks
										const subtasks = event.children || []

										const { unique, duplicates } = sortTasksByStartDate(subtasks)

										console.log('Parent task updated:', duplicates)

										if (unique?.length > 0) {
											let subtaskStart = new Date(bryntumStartDate)

											const tempStartData = subtaskStart

											unique.forEach((subtask, index) => {
												const subtaskStartDate = new Date(subtaskStart)
												const subtaskEndDate = DateHelper.add(subtaskStartDate, 1, 'day')

												const formattedStart = DateHelper.format(subtaskStartDate, 'YYYY-MM-DD')
												const formattedEnd = DateHelper.format(subtaskEndDate, 'YYYY-MM-DD')

												console.log(`Updating subtask ${index + 1}`, {
													id: subtask.data.id,
													start_date: formattedStart,
													end_date: formattedEnd,
												})

												updateTask({ start_date: formattedStart, end_date: formattedEnd }, subtask.data.id)

												console.log('formattedStart', formattedEnd, final_end_date, formattedEnd === final_end_date)

												subtaskStart = subtaskEndDate
											})
										}
										if (duplicates?.length > 0) {
											let subtaskStart = new Date(bryntumStartDate)

											const tempStartData = subtaskStart

											duplicates.forEach((subtask, index) => {
												const subtaskStartDate = new Date(subtaskStart)
												const subtaskEndDate = DateHelper.add(subtaskStartDate, 1, 'day')

												const formattedStart = DateHelper.format(subtaskStartDate, 'YYYY-MM-DD')
												const formattedEnd = DateHelper.format(subtaskEndDate, 'YYYY-MM-DD')

												console.log('MyCurrent', duplicates, subtask.data.name, formattedStart, formattedEnd)

												console.log(`Updating subtask ${index + 1}`, {
													id: subtask.data.id,
													start_date: formattedStart,
													end_date: formattedEnd,
												})

												updateTask({ start_date: formattedStart, end_date: formattedEnd }, subtask.data.id)

												subtaskStart = subtaskEndDate
												console.log('formattedStart', formattedStart, formattedEnd)
											})
										}
									} else {
										console.error('Error updating parent task:', res.error.message)
									}
								}
							)
						})
					} else {
						const bryntumStartDate = eventRecords?.[0]?.data.startDate
						const bryntumEndDate = eventRecords?.[0]?.data.endDate

						const id = eventRecords?.[0]?.data?.id

						const start_date_for_backend = DateHelper.format(bryntumStartDate, 'YYYY-MM-DD')
						const end_date_for_backend = DateHelper.format(bryntumEndDate, 'YYYY-MM-DD')

						updateTask({ start_date: start_date_for_backend, end_date: end_date_for_backend }, id)

						console.log("eventDrop you're dragging subtasks", eventRecords?.[0]?.data)
					}
				},

				eventResizeStart: ({ eventRecord }) => {
					console.log('Event resize started:', eventRecord)
					originalStartDate = eventRecord.data.startDate
					orignalEndDate = eventRecord.data.endDate
				},
				eventResizeEnd: async ({ eventRecord }) => {
					const titleSubTasks = []

					// let title = 1

					const defaultSubTaskNames = ['Line', 'Assemble', 'Trim', 'Galvanize', 'Install']
					const parentId = eventRecord?.data?.id

					eventRecord.set('manuallyScheduled', true)

					if (!eventRecord.isTask) {
						eventRecord.set('isTask', true)
					}

					// Mark it as a leaf if it doesn’t have children yet
					if (!eventRecord.children || eventRecord.children.length === 0) {
						eventRecord.set('leaf', true)
					}
					// Get Bryntum's Date objects
					const bryntumStartDate = eventRecord.data.startDate
					const bryntumEndDate = eventRecord.data.endDate // This is the start of the day AFTER the event ends
					console.log('EventResize', bryntumStartDate, bryntumEndDate)
					// Format start_date to YYYY-MM-DD
					const start_date_for_backend = DateHelper.format(bryntumStartDate, 'YYYY-MM-DD')

					// Adjust endDate to be inclusive and format to YYYY-MM-DD
					const inclusiveEndDate = DateHelper.add(bryntumEndDate, -1, 'day')
					const end_date_for_backend = DateHelper.format(inclusiveEndDate, 'YYYY-MM-DD')

					console.log('eventResizeEnd - Sending to backend:', {
						id: eventRecord.data.id,
						start_date: start_date_for_backend,
						end_date: end_date_for_backend,
					})

					updateTask(
						{ start_date: start_date_for_backend, end_date: end_date_for_backend },
						eventRecord.data.id || eventRecord?.id
					)

					myQueryClient.invalidateQueries(['projectData', eventRecord.data.id || eventRecord.id])

					await scheduler.project.commitAsync()

					const currentEndDate = new Date(bryntumEndDate)

					const previousEndDate = new Date(orignalEndDate)

					console.log('Hello', currentEndDate > previousEndDate)
				},
				eventDragSelect: ({ selectedEvents }) => {
					console.log(
						'Selected events:',
						selectedEvents.map((event) => event.name)
					)
				},

				beforeEventDelete: ({ eventRecords }) => {
					console.log('Before event delete:', eventRecords) // Changed `data` to `eventRecords` for consistency

					const eventIds = eventRecords.map((eventRecord) => eventRecord.id)

					// Check if any event has dependencies
					const hasDependencies = eventRecords.some((eventRecord) => {
						const dependencies = scheduler.dependencyStore.getEventDependencies(eventRecord)

						if (dependencies.length > 0) {
							console.warn(`Cannot delete event "${eventRecord.name}" because it has dependencies.`)
							alert(
								`Cannot delete event "${eventRecord.name}" because it has dependencies. Please remove the dependencies first.`
							)
							return true // Found an event with dependencies
						}
						return false // No dependencies for this event
					})
					if (hasDependencies) {
						return false
					}
					console.log(`Events to be deleted:`, eventIds)
					return deleteTasks(eventIds)
						.then((res) => {
							console.log(`Backend response:`, res)
							if (res.error === null) {
								console.log(`Events deleted successfully from backend:`, eventIds)
								myQueryClient.invalidateQueries(['projectData', id])
								return true
							}
							console.error(`Error deleting events:`, res.error.message)
							alert(`Error deleting events: ${res.error.message}`)
							return false
						})
						.catch((err) => {
							console.error(`Error deleting events:`, err)
							alert(`Error deleting events: ${err.message}`)
							return false // Prevent deletion
						})
				},
				afterEventEdit: ({ source, action }) => {
					console.log('After event edit listener:', action)
				},
				// beforeEventEditShow({ editor, eventRecord }) {
				// 	const subtasksContainer = editor.widgetMap.subtasksContainer

				// 	console.log('beforeeventEditShow', eventRecord)

				// 	let subTaskToBeDeleted = []

				// 	if (subtasksContainer) {
				// 		subtasksContainer.items.forEach((item) => item.destroy())
				// 		subtasksContainer.removeAll()
				// 	}
				// 	subtasksContainer?.removeAll()

				// 	console.log('OP', eventRecord?.children)
				// 	console.log(
				// 		'TabPanel items:',
				// 		editor.tabPanel?.items.map((tab) => tab.title || tab.type)
				// 	)

				// 	let subtasksGridInstance

				// 	const createSubtasksGrid = (initialData = []) => {
				// 		const noSubtasksLabel = subtasksContainer?.widgetMap?.noSubtasksLabel

				// 		if (noSubtasksLabel) {
				// 			noSubtasksLabel.destroy()
				// 		}

				// 		return subtasksContainer?.add({
				// 			type: 'grid',
				// 			height: '272px',
				// 			ref: 'subtasksGridWidget',
				// 			scrollable: true,
				// 			features: {
				// 				cellEdit: true,
				// 			},
				// 			store: {
				// 				data: initialData,
				// 				listeners: {
				// 					update: ({ record, changes }) => {
				// 						const { id } = record
				// 						const newName = changes?.name?.value

				// 						const childToUpdate = eventRecord.children.find((child) => child.id === id)

				// 						const gridWidget = subtasksContainer?.widgetMap?.subtasksGridWidget

				// 						const labelWidget = gridWidget?.widgetMap?.deleteStatusLabel

				// 						const deleteButtonWidget = gridWidget?.widgetMap?.deleteButton

				// 						deleteButtonWidget?.hide()

				// 						console.log('gridWidget', gridWidget, labelWidget)

				// 						if (!childToUpdate) {
				// 							console.warn('Could not find matching subtask in eventRecord.children for ID:', id)
				// 							return
				// 						}

				// 						if (childToUpdate.isPhantom) {
				// 							console.warn(' The subtask is a phantom (unsaved). May cause duplication on save.')
				// 						}

				// 						childToUpdate.set('name', newName)

				// 						childToUpdate.set('yesModified', true)

				// 						if (changes?.startDate) {
				// 							const startDate = changes?.startDate?.value

				// 							childToUpdate.set('startDate', startDate)

				// 							console.log('changesStartDate', record, changes)

				// 							childToUpdate.set('yesModified', true)

				// 							const currentStartData = new Date(startDate)

				// 							const currentEndDate = new Date(childToUpdate?.endDate)

				// 							const diffinMins = currentEndDate - currentStartData

				// 							const diffinDays = diffinMins / (1000 * 60 * 60 * 24)

				// 							childToUpdate.set('duration', diffinDays)

				// 							record.set('duration', diffinDays)

				// 							if (Array.isArray(eventRecord.data?.children) && Array.isArray(eventRecord.children)) {
				// 								eventRecord.children.forEach((child) => {
				// 									const matchingData = eventRecord.data.children.find((dataChild) => dataChild.id === child.id)
				// 									if (matchingData && matchingData.name) {
				// 										child.set('name', matchingData.name)
				// 									}
				// 								})
				// 							}
				// 						}
				// 						if (changes?.endDate) {
				// 							const endDate = changes?.endDate?.value
				// 							childToUpdate.set('endDate', endDate)

				// 							childToUpdate.set('yesModified', true)

				// 							const currentStartData = new Date(childToUpdate?.startDate)

				// 							const currentEndDate = new Date(endDate)

				// 							const diffinMins = currentEndDate - currentStartData

				// 							const diffinDays = diffinMins / (1000 * 60 * 60 * 24)

				// 							childToUpdate.set('duration', diffinDays)

				// 							record.set('duration', diffinDays)
				// 						}
				// 						if (changes?.workDays) {
				// 							const workDaysValue = changes.workDays.value

				// 							console.log('changesStartDate', workDaysValue)
				// 						}

				// 						if (changes?.completed?.value) {
				// 							subTaskToBeDeleted.push(record?.data?.id)

				// 							console.log('MyChanges ', subTaskToBeDeleted)
				// 							if (labelWidget) {
				// 								if (subTaskToBeDeleted.length > 0) {
				// 									labelWidget.show()
				// 									labelWidget.html = `Items selected: ${subTaskToBeDeleted.length}`
				// 									deleteButtonWidget.show()
				// 								} else {
				// 									labelWidget.hide()
				// 									deleteButtonWidget?.hide()
				// 								}
				// 							}
				// 						} else {
				// 							const filteredIDs = subTaskToBeDeleted?.filter((id) => id !== record?.data?.id)

				// 							subTaskToBeDeleted = filteredIDs
				// 							if (labelWidget) {
				// 								if (subTaskToBeDeleted.length > 0) {
				// 									labelWidget.show()
				// 									labelWidget.html = `Items selected: ${subTaskToBeDeleted.length}`
				// 									deleteButtonWidget?.show()
				// 								} else {
				// 									labelWidget.hide()
				// 									deleteButtonWidget?.hide()
				// 								}
				// 							}
				// 						}
				// 					},
				// 				},
				// 			},

				// 			columns: [
				// 				{
				// 					type: 'check',
				// 					text: '',
				// 					field: 'completed',
				// 					width: 70,
				// 					editor: true,
				// 					align: 'center',
				// 				},
				// 				// { text: 'ID', field: 'id', flex: 0.5 },
				// 				{ text: 'Task Name', field: 'name', flex: 0.5, editor: 'text', editable: true },
				// 				{
				// 					text: 'Mandays',
				// 					field: 'duration',
				// 					flex: 0.5,
				// 					editable: false,
				// 					renderer: ({ record }) => {
				// 						const start = new Date(record.data.startDate)
				// 						const end = new Date(record.data.endDate)

				// 						if (
				// 							start instanceof Date &&
				// 							end instanceof Date &&
				// 							!Number.isNaN(start.getTime()) &&
				// 							!Number.isNaN(end.getTime())
				// 						) {
				// 							const millisecondsPerDay = 1000 * 60 * 60 * 24
				// 							const diff = Math.round((end - start) / millisecondsPerDay)
				// 							return `${diff}`
				// 						}
				// 						return ''
				// 					},
				// 				},
				// 				{ text: 'Start Date', field: 'startDate', type: 'date', format: 'YYYY-MM-DD', flex: 1 },
				// 				{ text: 'End Date', field: 'endDate', type: 'date', format: 'YYYY-MM-DD', flex: 1 },
				// 				// {
				// 				// 	text: 'Team',
				// 				// 	field: 'team',
				// 				// 	flex: 1,
				// 				// 	editable: false,
				// 				// 	renderer: ({ record }) => {
				// 				// 		const currentResourceID = record?.data?.resourceId

				// 				// 		const teamName = teamsDetails?.find((item) => item?.name === currentResourceID)?.teamNumber

				// 				// 		const teamInfo = teams?.flatMap((res) => res.data || []).find((team) => team.id === teamName)?.name

				// 				// 		const team = teamInfo || ' '

				// 				// 		console.log('POPUP', record)

				// 				// 		return `${team}`
				// 				// 	},
				// 				// },
				// 			],
				// 			bbar: [
				// 				'->',
				// 				{
				// 					type: 'label',
				// 					ref: 'deleteStatusLabel',
				// 					html: '',
				// 					hidden: true,
				// 					margin: '0 0.5em 0 1em',
				// 				},
				// 				{
				// 					type: 'button',
				// 					icon: 'b-icon b-icon-trash',
				// 					cls: 'b-blue',
				// 					ref: 'deleteButton',
				// 					hidden: true,
				// 					onClick: async () => {
				// 						try {
				// 							const res = await deleteTasks(subTaskToBeDeleted)
				// 							console.log('Deleted', res, eventRecord)

				// 							subTaskToBeDeleted.forEach((id) => {
				// 								const index = eventRecord.children.findIndex((child) => child.id === id)
				// 								if (index !== -1) {
				// 									eventRecord.children.splice(index, 1)
				// 								}
				// 								subTaskToBeDeleted.forEach((id) => {
				// 									const taskRecord = scheduler.eventStore.getById(id)
				// 									if (taskRecord) {
				// 										scheduler.eventStore.remove(taskRecord)
				// 									}
				// 								})

				// 								const dataIndex = eventRecord.data?.children?.findIndex((child) => child.id === id)
				// 								if (dataIndex !== -1) {
				// 									eventRecord.data.children.splice(dataIndex, 1)
				// 								}
				// 							})

				// 							eventRecord?.children?.forEach((element) => {
				// 								if (!subTaskToBeDeleted?.includes(element?.id)) {
				// 									element?.set('yesModified', true)
				// 								}
				// 							})

				// 							subTaskToBeDeleted = []

				// 							// Refresh the grid if needed
				// 							const gridWidget = subtasksContainer?.widgetMap?.subtasksGridWidget
				// 							gridWidget?.store?.loadData(eventRecord.children)

				// 							// Hide label and button again
				// 							const labelWidget = gridWidget?.widgetMap?.deleteStatusLabel
				// 							const deleteButtonWidget = gridWidget?.widgetMap?.deleteButton

				// 							labelWidget?.hide()
				// 							deleteButtonWidget?.hide()
				// 							if (Array.isArray(eventRecord.data?.children) && Array.isArray(eventRecord.children)) {
				// 								eventRecord.children.forEach((child) => {
				// 									const matchingData = eventRecord.data.children.find((dataChild) => dataChild.id === child.id)
				// 									if (matchingData && matchingData.name) {
				// 										child.set('name', matchingData.name)
				// 									}
				// 								})
				// 							}
				// 							await scheduler.project.commitAsync()
				// 						} catch (error) {
				// 							console.error('Delete failed:', error)
				// 						}
				// 					},
				// 				},
				// 			],
				// 		})
				// 	}

				// 	if (eventRecord.children?.length) {
				// 		const sortedSubtasks = [...(eventRecord.data?.children || [])].sort((a, b) => {
				// 			const startA = new Date(a.startDate)
				// 			const startB = new Date(b.startDate)

				// 			// If startDates are equal, sort by endDate
				// 			if (startA.getTime() === startB.getTime()) {
				// 				return new Date(a.endDate) - new Date(b.endDate)
				// 			}

				// 			return startA - startB
				// 		})

				// 		subtasksGridInstance = createSubtasksGrid(sortedSubtasks)
				// 	} else {
				// 		subtasksContainer?.add({
				// 			type: 'label',
				// 			html: 'No subtasks',
				// 			ref: 'noSubtasksLabel',
				// 		})
				// 	}

				// 	subtasksContainer?.add({
				// 		type: 'button',
				// 		text: 'Add New Subtask',
				// 		cls: 'b-blue b-raised',
				// 		margin: '1em 0',
				// 		// onClick: async () => {
				// 		// 	const sortedSubtasks = [...(eventRecord?.children || [])].sort((a, b) => {
				// 		// 		const startA = new Date(a.startDate)
				// 		// 		const startB = new Date(b.startDate)

				// 		// 		// If startDates are equal, sort by endDate
				// 		// 		if (startA.getTime() === startB.getTime()) {
				// 		// 			return new Date(a.endDate) - new Date(b.endDate)
				// 		// 		}

				// 		// 		return startA - startB
				// 		// 	})
				// 		// 	const alreadyExistingSubTasks = eventRecord?.children || []

				// 		// 	console.log('ALREADY', alreadyExistingSubTasks)

				// 		// 	const parentStartDate = moment(eventRecord.startDate)
				// 		// 	const parentEndDate = moment(eventRecord.endDate)
				// 		// 	const parentID = eventRecord?.id
				// 		// 	const { team, task_group_id, id } = eventRecord?.data

				// 		// 	let newSubtaskStartDate
				// 		// 	let newSubtaskEndDate

				// 		// 	if (sortedSubtasks.length === 0) {
				// 		// 		// First subtask
				// 		// 		newSubtaskStartDate = parentStartDate.clone()
				// 		// 	} else {
				// 		// 		// Get the last added subtask
				// 		// 		const lastTask = sortedSubtasks[sortedSubtasks.length - 1]
				// 		// 		const lastStart = moment(lastTask.startDate)
				// 		// 		const nextStart = lastStart.clone().add(1, 'day')

				// 		// 		// If nextStart exceeds parent end, wrap to parentStartDate
				// 		// 		if (nextStart.isSameOrAfter(parentEndDate)) {
				// 		// 			newSubtaskStartDate = parentStartDate.clone()
				// 		// 		} else {
				// 		// 			newSubtaskStartDate = nextStart.clone()
				// 		// 		}
				// 		// 	}

				// 		// 	// Set endDate as +1 day
				// 		// 	newSubtaskEndDate = newSubtaskStartDate.clone().add(1, 'day')

				// 		// 	// Make sure subtask end doesn't go beyond parent endDate
				// 		// 	if (newSubtaskEndDate.isAfter(parentEndDate)) {
				// 		// 		// Optional: if needed, clip the endDate to parentEndDate (but this will reduce duration to <1 day)
				// 		// 		newSubtaskEndDate = parentEndDate.clone()
				// 		// 	}

				// 		// 	const newSubtaskData = {
				// 		// 		id: Math.floor(Date.now() / 1000) + Math.floor(Math.random() * 1000),
				// 		// 		name: ' ',
				// 		// 		startDate: newSubtaskStartDate.toDate(),
				// 		// 		endDate: newSubtaskEndDate.toDate(),
				// 		// 		duration: 1,
				// 		// 		team,
				// 		// 		project: id,
				// 		// 		parent_task: parentID,
				// 		// 		task_group_id,
				// 		// 		isSaved: false,
				// 		// 		resourceId: alreadyExistingSubTasks[alreadyExistingSubTasks?.length - 1]?.data?.resourceId,
				// 		// 	}

				// 		// 	console.log('ECW', alreadyExistingSubTasks)

				// 		// 	const EventModel = scheduler.eventStore.modelClass
				// 		// 	const newTaskModel = new EventModel(newSubtaskData)
				// 		// 	eventRecord.appendChild(newTaskModel)

				// 		// 	if (!subtasksGridInstance) {
				// 		// 		subtasksGridInstance = createSubtasksGrid([newSubtaskData])
				// 		// 	} else if (subtasksGridInstance?.store) {
				// 		// 		subtasksGridInstance.store.add(newSubtaskData)

				// 		// 		const grid = subtasksContainer?.widgetMap?.subtasksGridWidget
				// 		// 		grid.store.add(newSubtaskData)
				// 		// 		const newRecord = grid.store.last

				// 		// 		const editingFeature = grid.features.cellEdit

				// 		// 		if (editingFeature) {
				// 		// 			setTimeout(() => {
				// 		// 				requestAnimationFrame(() => {
				// 		// 					editingFeature.startEditing({
				// 		// 						record: newRecord,
				// 		// 						field: 'name',
				// 		// 					})
				// 		// 				})
				// 		// 			}, 10) // slight delay ensures rendering is done
				// 		// 		} else {
				// 		// 			console.warn('❌ cellEdit feature is not available on the grid.')
				// 		// 		}
				// 		// 	}

				// 		// 	console.log('✅ Added new subtask on:', newSubtaskStartDate.format('YYYY-MM-DD'))
				// 		// },
				// 		onClick: async () => {
				// 			const sortedSubtasks = [...(eventRecord?.children || [])].sort((a, b) => {
				// 				const startA = new Date(a.startDate)
				// 				const startB = new Date(b.startDate)

				// 				if (startA.getTime() === startB.getTime()) {
				// 					return new Date(a.endDate) - new Date(b.endDate)
				// 				}

				// 				return startA - startB
				// 			})

				// 			const alreadyExistingSubTasks = eventRecord?.children || []

				// 			console.log('ALREADY', alreadyExistingSubTasks)

				// 			const parentStartDate = moment(eventRecord.startDate)
				// 			const parentEndDate = moment(eventRecord.endDate)
				// 			const parentID = eventRecord?.id
				// 			const { team, task_group_id, id } = eventRecord?.data

				// 			let newSubtaskStartDate = null
				// 			let newSubtaskEndDate

				// 			const cycleLength = parentEndDate.diff(parentStartDate, 'days') // e.g., 12–16 = 4 days
				// 			if (cycleLength <= 0) {
				// 				console.warn('❌ Invalid parent start/end dates')
				// 				return
				// 			}

				// 			const subtaskCount = sortedSubtasks.length

				// 			// Wrap around using modulo to cycle within the parent range
				// 			newSubtaskStartDate = parentStartDate.clone().add(subtaskCount % cycleLength, 'days')
				// 			newSubtaskEndDate = newSubtaskStartDate.clone().add(1, 'day')

				// 			// Make sure subtask end doesn't exceed parentEndDate
				// 			if (newSubtaskEndDate.isAfter(parentEndDate)) {
				// 				newSubtaskEndDate = parentEndDate.clone()
				// 			}

				// 			const newSubtaskData = {
				// 				id: Math.floor(Date.now() / 1000) + Math.floor(Math.random() * 1000),
				// 				name: ' ',
				// 				startDate: newSubtaskStartDate.toDate(),
				// 				endDate: newSubtaskEndDate.toDate(),
				// 				duration: 1,
				// 				team,
				// 				project: id,
				// 				parent_task: parentID,
				// 				task_group_id,
				// 				isSaved: false,
				// 				resourceId: sortedSubtasks[sortedSubtasks.length - 1]?.data?.resourceId,
				// 			}

				// 			console.log(
				// 				'✅ Subtask Dates:',
				// 				newSubtaskStartDate.format('YYYY-MM-DD'),
				// 				'→',
				// 				newSubtaskEndDate.format('YYYY-MM-DD')
				// 			)

				// 			const EventModel = scheduler.eventStore.modelClass
				// 			const newTaskModel = new EventModel(newSubtaskData)
				// 			eventRecord.appendChild(newTaskModel)

				// 			if (!subtasksGridInstance) {
				// 				subtasksGridInstance = createSubtasksGrid([newSubtaskData])
				// 			} else if (subtasksGridInstance?.store) {
				// 				subtasksGridInstance.store.add(newSubtaskData)

				// 				const grid = subtasksContainer?.widgetMap?.subtasksGridWidget
				// 				grid.store.add(newSubtaskData)
				// 				const newRecord = grid.store.last

				// 				const editingFeature = grid.features.cellEdit

				// 				if (editingFeature) {
				// 					setTimeout(() => {
				// 						requestAnimationFrame(() => {
				// 							editingFeature.startEditing({
				// 								record: newRecord,
				// 								field: 'name',
				// 							})
				// 						})
				// 					}, 10)
				// 				} else {
				// 					console.warn('❌ cellEdit feature is not available on the grid.')
				// 				}
				// 			}
				// 		},
				// 	})
				// 	return true
				// },
				eventAdd: async ({ records }) => {
					console.log('Add NewEVent CLicked', records)
				},
			},
		})

		// Register all listeners
		registerListeners(scheduler)

		// Commit data
		;(async () => {
			await scheduler.project.commitAsync()
		})()

		instanceRef.current = scheduler
		return () => scheduler.destroy()
	}, [events, resources])

	const registerListeners = (scheduler) => {
		scheduler.on('beforeEventEditShow', ({ editor, eventRecord }) => {
			const subtasksContainer = editor.widgetMap.subtasksContainer

			// Clear any existing widgets
			subtasksContainer?.removeAll?.()

			// Create and add your grid widget
			const subtasksGridWidget = new Grid({
				appendTo: subtasksContainer?.element,
				height: 200,
				columns: [
					{ text: 'Subtask Name', field: 'name', flex: 1 },
					{ text: 'Duration', field: 'duration' },
				],
				data: eventRecord?.children || [],
			})

			subtasksContainer?.add(subtasksGridWidget)
		})

		scheduler.eventStore.on('add', ({ source, records, isMove, isReplace }) => {
			suppressNextEditor = true
			const event = records[0]

			const resourceId = event.resourceId
			const resourceRecord = scheduler.resourceStore.getById(resourceId)

			const currentTeam = teamsDetails?.find((item) => item?.name === resourceId)?.teamNumber

			const isTrueSubtask = event.data.parentId && event.data.parentId !== scheduler.project.id

			const projectDiagramID = resourceRecord?.data?.tasksWithoutTeam?.find(
				(item) => item?.project_diagram_id
			)?.project_diagram_id

			if (isTrueSubtask) {
				return
			}

			if (event.copyOf) {
				return ''
			}
			// eslint-disable-next-line
			if (event.data.isPastedEvent) {
				return ''
			}

			if (event.data?.isAddNewSubTask) {
				return ''
			}

			// eslint-disable-next-line
			else {
				scheduler.features.eventEdit.disabled = true

				let taskGroupID = null

				if (resourceRecord?.name === 'Connection') {
					taskGroupID = 3
				}
				if (resourceRecord?.name === 'Completion Testing') {
					taskGroupID = 4
				}
				if (resourceRecord?.name === 'Metal Fittings Installation') {
					taskGroupID = 1
				}
				if (resourceRecord?.name === 'Auxiliary Construction') {
					taskGroupID = 6
				}
				if (resourceRecord?.name === 'Office Work') {
					taskGroupID = 5
				}
				if (resourceRecord?.name === 'Installation') {
					taskGroupID = 2
				}

				try {
					const formattedSubtaskData = {
						title: event?.data?.name,
						start_date: DateHelper.format(event?.data?.startDate, 'YYYY-MM-DD'),
						end_date: DateHelper.format(DateHelper.add(event?.data?.endDate, -1, 'd'), 'YYYY-MM-DD'),
						team: currentTeam,
						project: id,
						task_group_id: taskGroupID,
						project_diagram_id: projectDiagramID,
						// resourceId: eventRecords?.[0]?.data?.resourceId,
					}

					console.log('Melroy', taskGroupID, formattedSubtaskData)
				} catch (error) {
					console.log('Error !! Failed to add new event', error)
				}
			}
		})

		scheduler.dependencyStore.on('add', ({ records }) => {
			console.log('Dependency added:', records)
			records.forEach((dep) => {
				console.log('New dependency created: from', dep.fromEvent, ' to  → ', dep.toEvent)
				// Here, originalData is often already in string format, but it's safer
				// to use DateHelper to ensure consistent formatting to YYYY-MM-DD
				const from_date_for_backend = DateHelper.format(dep.fromEvent.startDate, 'YYYY-MM-DD')
				const to_date_for_backend = DateHelper.format(dep.toEvent.startDate, 'YYYY-MM-DD') // Assuming toEvent start date is used for lag calculation reference

				const lagUnitMap = {
					day: 'd',
					hour: 'h',
					minute: 'm',
				}
				createTaskDependency({
					from_task_id: dep.fromEvent.data.id,
					to_task_id: dep.toEvent.data.id,
					project_id: id,
					type: dependencyTypeMap[dep.type] || dependencyTypeMap[2],
					// Ensure lag calculation uses the correctly formatted dates if needed by your backend
					// Or use Bryntum's internal Date objects for the diff, then format the result
					lag: DateHelper.diff(
						dep.fromEvent.endDate, // Bryntum's endDate (start of day after)
						dep.toEvent.startDate, // Bryntum's startDate (start of day)
						dep.lagUnit
					),
					lag_unit: lagUnitMap[dep.lagUnit] || dep.lagUnit,
					active: dep.active || true,
				}).then(async (res) => {
					console.log('Backend dependency created:', res)
					if (res.error === null) {
						const realId = res.data?.[0]?.id
						const days = DateHelper.diff(dep.fromEvent.endDate, dep.toEvent.startDate, dep.lagUnit) + 1

						dep.set('lag', days)
						dep.set('id', realId)

						await scheduler.project.propagateAsync()

						console.log('dependency created successfully ', res)
					} else {
						console.log('Error creating task:', res.error.message)
					}
				})
			})
		})

		scheduler.dependencyStore.on('remove', ({ records }) => {
			console.log('Dependency removed:', records)
			records.forEach((dep) => {
				console.log('Dependency removed:', dep)
				deleteTaskDependency(dep.data.id)
					.then((res) => {
						console.log('Backend dependency deleted:', res)
						if (res.error === null) {
							console.log('Dependency deleted successfully:', res)
						} else {
							console.error('Error deleting dependency:', res.error)
							alert('Error deleting dependency:', res.error)
						}
					})
					.catch((err) => {
						console.error('Error deleting dependency:', err)
						alert('Error deleting dependency:', err.message)
					})
			})
		})
		scheduler.on('afterEventSave', ({ eventRecord }) => {
			const isNewEvent = !events.some((e) => e.id === eventRecord.id) // Assuming 'events' is your original events data array
			// saveSubtasks(eventRecord, createNewTasks, updateTask)
			const task_groups = {
				metal_fittings: 1,
				installations: 2,
				connections: 3,
				completion_test: 4,
			}
			const resourceId = eventRecord.resourceId

			const resourceRecord = scheduler.resourceStore.getById(resourceId)

			let taskGroupID = null

			if (resourceRecord?.name === 'Connection') {
				taskGroupID = 3
			}
			if (resourceRecord?.name === 'Completion Testing') {
				taskGroupID = 4
			}
			if (resourceRecord?.name === 'Metal Fittings Installation') {
				taskGroupID = 1
			}
			if (resourceRecord?.name === 'Auxiliary Construction') {
				taskGroupID = 6
			}
			if (resourceRecord?.name === 'Office Work') {
				taskGroupID = 5
			}
			if (resourceRecord?.name === 'Installation') {
				taskGroupID = 2
			}

			console.log('eventRecord.resourceId', eventRecord.resourceId)
			const groupName = eventRecord.resourceId
			const taskGroupId = task_groups[groupName]

			// Get Bryntum's Date objects
			const bryntumStartDate = eventRecord.startDate
			const bryntumEndDate = eventRecord.endDate // This is the start of the day AFTER the event ends

			// Format start_date to YYYY-MM-DD
			const start_date_for_backend = DateHelper.format(bryntumStartDate, 'YYYY-MM-DD')

			// Adjust endDate to be inclusive and format to YYYY-MM-DD
			const inclusiveEndDate = DateHelper.add(bryntumEndDate, -1, 'day')
			const end_date_for_backend = DateHelper.format(inclusiveEndDate, 'YYYY-MM-DD')

			const formattedData = {
				task_group_id: taskGroupId || eventRecord?.data?.task_group_id || taskGroupID,
				start_date: start_date_for_backend, // Use formatted date
				end_date: end_date_for_backend, // Use formatted date
				title: eventRecord.name,
			}

			console.log('afterEventSave100', formattedData)

			console.log('afterEventSave - Sending to backend:', {
				id: eventRecord.id, // For existing events
				...formattedData,
			})

			if (isNewEvent) {
				formattedData.project = id // Assuming 'id' is defined in your scope
				createNewTasks(formattedData).then((res) => {
					console.log('Yes its new Event')
					console.log('Backend created:', res)
					if (res.error === null) {
						console.log('Task created successfully ', res)
						eventRecord.set({ id: res.data[0].id })
						eventRecord.set({ task_group_id: taskGroupID })
						// eventRecord.id = res.data[0].id // Update Bryntum record with backend ID
						// eventRecord.data.task_group_id = taskGroupID
						eventRecord.commit() // Commit changes to the record
						console.log('Event created:', eventRecord)
						scheduler.project.commitAsync()
					} else {
						console.log('Error creating task:', res.error.message)
						eventRecord.remove() // Remove event if backend creation failed
					}
				})
			} else {
				updateTask(formattedData, eventRecord.id).then((res) => {
					console.log('Backend updated:', res)
					console.log('No its new Event')
					if (res.error === null) {
						console.log('Task updated successfully')
						saveSubtasks(eventRecord, createNewTasks, updateTask)
					} else {
						console.log('Error updating task:', res.error.message)
					}
				})
			}
		})

		async function saveSubtasks(parentEventRecord, createFn, updateFn) {
			console.log('save function called savesubtasks', parentEventRecord)
			const promises = parentEventRecord?.children?.map(async (subtask) => {
				if (subtask.get('isSaved') === undefined) {
					subtask.set('isSaved', true)
				}
				const formattedSubtaskData = {
					title: subtask.name,
					start_date: DateHelper.format(subtask.startDate, 'YYYY-MM-DD'),
					end_date: DateHelper.format(subtask.endDate, 'YYYY-MM-DD'),
					team: subtask.team,
					project: id,
					parent_task: parentEventRecord?.id,
					task_group_id: subtask?.task_group_id || parentEventRecord?.data?.task_group_id,
				}

				console.log('Saving subtask:', subtask.get('isSaved'), formattedSubtaskData)

				if (subtask.get('yesModified') && subtask.get('isSaved')) {
					try {
						const res = await updateFn(formattedSubtaskData, subtask?.id)
						if (res.error === null && res.data?.[0]?.id) {
							console.log(' Subtask created: yes modified', res, formattedSubtaskData)
							subtask.set('id', res.data[0].id)

							parentEventRecord.data.children = parentEventRecord.data.children.filter(
								(child) => child.id !== res.data[0].id
							)

							// Add the updated subtask
							parentEventRecord.data.children.push({
								id: res.data[0].id,
								name: res.data[0].title,
								startDate: res.data[0].start_date,
								endDate: res.data[0].end_date,
								team: res.data[0].team,
							})

							await scheduler.project.commitAsync()

							// myQueryClient.invalidateQueries(['projectData', id])
						} else {
							console.error(' Create error:', res.error?.message || 'No data')
							subtask.remove()
						}
					} catch (err) {
						console.error(' Create exception:', err)
					}
				} else if (!subtask.get('isSaved')) {
					try {
						const res = await createFn(formattedSubtaskData)
						const backendNewSubtask = res?.data?.[0]

						const bryntumReadySubtask = {
							id: backendNewSubtask.id,
							name: backendNewSubtask.title,
							startDate: backendNewSubtask?.start_date,
							endDate: backendNewSubtask?.end_date,
							team: backendNewSubtask.team,
							notes: backendNewSubtask.notes,
							task_group_id: backendNewSubtask.task_group_id,
							project: backendNewSubtask.project,
							parentId: backendNewSubtask.parent_task,
							resourceId: parentEventRecord?.data?.resourceId,
							isSaved: true,
						}

						const newTaskRecord = scheduler.eventStore.add(bryntumReadySubtask)[0]

						await scheduler.project.commitAsync()

						if (!parentEventRecord.data.children) {
							parentEventRecord.data.children = []
						}
						parentEventRecord.data.children.push({
							name: backendNewSubtask.title,
							startDate: backendNewSubtask.start_date,
							endDate: backendNewSubtask.end_date,
							id: backendNewSubtask?.id,
							resourceId: parentEventRecord?.data?.resourceId,
						})

						scheduler.assignmentStore.add({
							id: backendNewSubtask?.id,
							eventId: newTaskRecord.id,
							resourceId: parentEventRecord?.data?.resourceId,
						})

						subtask.set('isSaved', true)

						await scheduler.project.commitAsync()
					} catch (err) {
						console.error(' Update exception:', err)
					}
				}
			})

			if (parentEventRecord?.children) await Promise?.all(promises)
		}

		scheduler.on('afterEventUpdate', ({ eventRecord }) => {
			// This listener fires after the Bryntum record has been updated internally.
			// The dates here (eventRecord.startDate, eventRecord.endDate) will still be Date objects.
			// If you need to send them to the backend from *this* listener, apply the same formatting.
			const formattedData = {
				id: eventRecord.id,
				resourceId: eventRecord.resourceId,
				startDate: DateHelper.format(eventRecord.startDate, 'YYYY-MM-DD'),
				endDate: DateHelper.format(DateHelper.add(eventRecord.endDate, -1, 'day'), 'YYYY-MM-DD'),
				name: eventRecord.name,
			}
			console.log('Event updated (afterEventUpdate listener):', formattedData)
		})

		scheduler.on('afterEventCancel', ({ eventRecord }) => {
			console.log('Event cancelled:', eventRecord)
		})

		scheduler.on(
			'afterEventEdit',
			({ source, action, eventEdit, eventRecord, resourceRecord, eventElement, editor }) => {
				console.log('Event edit action:', action)
			}
		)

		scheduler.on('beforePaste', ({ context }) => {
			context?.preventDefault()
		})

		scheduler.on(
			'paste',
			async ({ pastedEventRecords, eventRecords, assignmentRecords, resourceRecord, entityName, context }) => {
				context?.preventDefault()

				const currentResouceID = pastedEventRecords?.[0]?.data?.resourceId

				const destinationResource = scheduler.resourceStore.getById(currentResouceID)

				let taskGroupID = destinationResource?.data?.tasksWithoutTeam?.[0]?.task_group_id

				const withTeams = destinationResource?.data?.name

				if (!taskGroupID) {
					if (withTeams === 'Connection') {
						taskGroupID = 3
					} else if (withTeams === 'Completion Testing') {
						taskGroupID = 4
					} else if (withTeams === 'Metal Fittings Installation') {
						taskGroupID = 1
					} else if (withTeams === 'Auxiliary Construction') {
						taskGroupID = 6
					} else if (withTeams === 'Office Work') {
						taskGroupID = 5
					} else {
						taskGroupID = 2
					}
				}

				const currentTeam = teamsDetails?.find((item) => item?.name === currentResouceID)?.teamNumber

				console.log('COPYPASTE', resourceRecord.id, currentResouceID)

				const projectDiagramID = resourceRecord?.data?.tasksWithoutTeam?.find(
					(item) => item?.project_diagram_id
				)?.project_diagram_id

				/* eslint-disable no-await-in-loop */
				for (let i = 0; i < eventRecords.length; i += 1) {
					const eventRecord = eventRecords[i]

					const hasChildren = eventRecord?.data?.children?.length > 0

					const formattedSubtaskData = {
						title: eventRecord?.data?.name,
						start_date: DateHelper.format(eventRecord?.data?.startDate, 'YYYY-MM-DD'),
						end_date: DateHelper.format(DateHelper.add(eventRecord?.data?.endDate, -1, 'd'), 'YYYY-MM-DD'),
						team: currentTeam,
						project: id,
						project_diagram_id: projectDiagramID,
						task_group_id: taskGroupID,
					}
					eventRecord.set('resourceId', currentResouceID)

					try {
						const res = await createNewTasks(formattedSubtaskData)
						const backendNewSubtask = res?.data?.[0]

						if (!hasChildren) {
							const bryntumReadytask = {
								id: backendNewSubtask.id,
								name: backendNewSubtask.title,
								startDate: backendNewSubtask?.start_date,
								endDate: backendNewSubtask?.end_date,
								team: currentTeam,
								notes: backendNewSubtask.notes,
								task_group_id: taskGroupID,
								project: backendNewSubtask.project,
								// parentId: backendNewSubtask?.id,
								resourceId: currentResouceID,
								isPastedEvent: true,
								manuallyScheduled: true,
							}
							console.log('My New Event', res, bryntumReadytask)

							scheduler.eventStore.add(bryntumReadytask)

							await scheduler.project.commitAsync()

							// Remove Bryntum's auto-generated pasted ghost events
						} else {
							const parentID = backendNewSubtask.id
							const childTasks = eventRecord.data.children || []

							const childPromises = childTasks.map((item) => {
								const subTaskData = [
									{
										title: item?.data?.name,
										team: item?.data?.team,
										start_date: DateHelper.format(item?.data?.startDate, 'YYYY-MM-DD'),
										end_date: DateHelper.format(item?.data?.endDate, 'YYYY-MM-DD'),
										notes: '',
										task_group_id: taskGroupID,
										project: id,
										parent_task: parentID,
									},
								]
								eventRecord.set('resourceId', currentResouceID)
								return createNewTasks(subTaskData)
							})

							await Promise.all(childPromises)
							console.log('Pasted New Event with children:', backendNewSubtask.title, childTasks.length)
						}
					} catch (error) {
						console.error('Error pasting event:', error)
					}
				}
			}
		)

		scheduler.dependencyStore.on('update', ({ record, changes }) => {
			console.log('Dependency updated:', record)
			console.log('Changes:', changes)
			// Prepare the update payload for all changed fields
			if (changes && Object.keys(changes).length > 0) {
				const updatePayload = { id: record.id }
				console.log('updatePayload', updatePayload)
				const enumMap = {
					start_to_start: 'StartToStart',
					start_to_end: 'StartToEnd',
					end_to_start: 'EndToStart',
					end_to_end: 'EndToEnd',
				}
				Object.entries(changes).forEach(([key, valueObj]) => {
					console.log('myLagUnit', key)
					if (key === 'toEvent') updatePayload.to_task_id = valueObj.value
					else if (key === 'fromEvent') updatePayload.from_task_id = valueObj.value
					else if (key === 'type') {
						updatePayload.type = enumMap[valueObj.value] || valueObj.value
					} else if (key === 'lag') updatePayload.lag = valueObj.value
					else if (key === 'lagUnit') {
						const lagUnitMap = {
							day: 'd',
							hour: 'h',
							minute: 'm',
						}
						const rawValue = valueObj?.value || record.lagUnit
						updatePayload.lag_unit = lagUnitMap[rawValue] || rawValue
					} else if (key === 'active') {
						updatePayload.active = 'FALSE'
					}
				})

				updateTaskDependency(updatePayload)
					.then(async (res) => {
						if (res.error === null) {
							const fromTask = res?.data?.[0]?.from_task_id

							const toTask = res?.data?.[0]?.to_task_id

							const lagDays = res?.data?.[0]?.lag

							const fromEventRecord = scheduler.eventStore.getById(fromTask)

							const toEventRecord = scheduler.eventStore.getById(toTask)

							const fromStartDate = fromEventRecord?.data?.startDate
							const fromEndDate = fromEventRecord?.data?.endDate

							const toStartDate = toEventRecord?.data?.startDate
							const toEndDate = toEventRecord?.data?.endDate

							if (lagDays || !lagDays) {
								const fromTaskEndDate = DateHelper.add(fromEndDate, -1, 'day') // 30 -> 29

								const toTaskStartDateForBackend = DateHelper.add(fromTaskEndDate, +lagDays, 'day') // 29->4

								const toTaskEndDateForBackend = DateHelper.add(toTaskStartDateForBackend, +5, 'day') // 4->9

								const toTaskStartDateForBryntum = DateHelper.add(toTaskStartDateForBackend, +1, 'day') // 5 start date for bryntum

								const toTaskStartDateForBryntum2 = DateHelper.add(toTaskStartDateForBryntum, -1, 'day') // 5 start date for bryntum

								const toTaskEndDateForBryntum = DateHelper.add(toTaskEndDateForBackend, +1, 'day') // 5 end date for bryntum

								const formatToTaskStartDateForBackend = DateHelper.format(toTaskStartDateForBackend, 'YYYY-MM-DD')

								const formatToTaskEndDateForBackend = DateHelper.format(toTaskEndDateForBackend, 'YYYY-MM-DD')

								updateTask(
									{ start_date: formatToTaskStartDateForBackend, end_date: formatToTaskEndDateForBackend },
									toTask
								)

								myQueryClient.invalidateQueries(['projectData', toTask])

								toEventRecord.set('startDate', toTaskStartDateForBryntum2)
								toEventRecord.set('endDate', toTaskEndDateForBryntum)

								await scheduler.project.commitAsync()
							}
							console.log('Dependency updated in backend:', res)
						} else {
							console.error('Error updating dependency:', res.error)
						}
					})
					.catch((err) => {
						console.error('Exception updating dependency:', err)
					})
			}
		})

		scheduler.displayDateFormat = 'll'

		// Add more listeners like eventResizeStart, eventResizeEnd, etc.
	}

	return <div ref={schedulerRef} style={{ height: '100vh', width: '100%' }} />
}

export default SchedulerComponent
