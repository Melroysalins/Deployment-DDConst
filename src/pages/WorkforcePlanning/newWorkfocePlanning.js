import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useQueryClient } from 'react-query'
import {
	// Scheduler,
	SchedulerPro,
	// ResourceStore,
	DependencyStore,
	DateHelper,
	ProjectModel,
	Grid,
	PresetManager,
	// DependencyTab,
	// PredecessorsTab,
	// SuccessorsTab,
	// DependencyEdit,
	// DependencyMenu,
	WidgetHelper,
	CalendarModel,
} from '../../lib/bryntum/schedulerpro.module'
import '../../lib/bryntum/schedulerpro.stockholm.css'

import {
	createNewTasks,
	listAllTasksByProject2,
	updateTask,
	deleteTasks,
	createTaskDependency,
	deleteTaskDependency,
	getAllTaskDependencyByProject,
	getSelectedWorkTypes,
	getTeamDetails,
	updateTaskDependency,
	listAllTeams,
} from 'supabase'

import {
	customMonthViewPreset,
	features,
	getTimelineRange,
	dependencyTypeMap,
	getISODateString,
	zoomPresets,
	CustomViewDay,
} from '../ProjectImplementationSchedule/SchedulerConfig'

import { listAllEvents, createNewEvent, deleteEvent, listSelectedEvents } from 'supabase/events'
import { listAllEmployees, listEmployeesByProject } from 'supabase/employees'
import { getProjectDetails, listAllProjects, listParicularProjects } from 'supabase/projects'
import { Field } from 'formik'
import { sanitizeForDataId } from './WorkforcePlanning'

const filters = { dw: true }

const NewWorkfocePlanning = () => {
	const [teamsDetails, SetTeamDetails] = useState([])
	const [loader, setLoader] = useState(false)
	const [myResources, setMyResources] = useState([])
	const [projectSites, setProjectSites] = useState([])
	const [selectedEvents, SetSelectedEvents] = useState([])
	const [events, SetEvents] = useState([])

	const schedulerRef = useRef(null)

	const currentCenterDate = null

	let originalStartDate = null

	let orignalEndDate = null

	const myQueryClient = useQueryClient()

	const { projectid } = useParams()

	const {
		data: allProjectSites = [],
		isLoading,
		isError,
	} = useQuery(['allProjectSites'], () => listAllProjects().then((res) => res.data))

	function generateUniqueId({ name, email_address, project, phone_number }) {
		const base = `${name}-${email_address}-${project}-${phone_number}`
		const hash = hashString(base)
		return `member-${hash}` // You can prefix for clarity
	}

	// Simple hash function (djb2 algorithm)
	function hashString(str) {
		const utf8 = new TextEncoder().encode(str)
		let hash = 0
		for (let i = 0; i < utf8.length; i += 1) {
			hash = (hash + utf8[i] * (i + 1)) % 1000000007
		}
		return `id-${hash.toString(36)}` // Base36 for compactness
	}

	function transformResourceData(original) {
		return original.map((group) => ({
			collapsed: false,
			eventCreation: false,
			id: group.id,
			name: group.name,
			children: group.children.map((member) => ({
				id: member.id,
				newid: generateUniqueId(member),
				name: member.name,
				team: member.team,
				team_lead: member.team_lead,
				rating: member.rating,
			})),
		}))
	}

	React.useEffect(() => {
		;(async function () {
			setLoader(true)

			listAllProjects().then((data) => {
				const mappedProjects = data?.data.map((item) => ({ text: item.title, value: item.id }))

				listAllEmployees().then((dataEmp) => {
					const groupedEmployees = {}

					dataEmp.data.forEach((employee) => {
						const projectId = employee.project || 'No Project'

						if (!groupedEmployees[projectId]) {
							groupedEmployees[projectId] = {
								id: projectId,
								name: mappedProjects.find((project) => project.value === projectId)?.text || 'Unknown Project',
								collapsed: false,
								eventCreation: false,
								children: [],
							}
						}

						const uniqueId = generateUniqueId(employee)

						groupedEmployees[projectId].children.push({
							newid: uniqueId,
							id: employee.id,
							name: employee.name,
							team: employee.team,
							team_lead: employee.team_lead,
							rating: employee.rating,
						})
					})

					const resourceArray = Object.values(groupedEmployees)
					setMyResources(resourceArray)
				})
			})
		})()
		return () => {}
	}, [projectid])

	useEffect(() => {
		if (!myResources?.length) return

		// listAllProjects().then((data) => SetAllProjectSites(data?.data))

		listAllEvents(filters).then((eventData) => {
			const eventsArray = []

			// myResources?.forEach((group) => {
			// 	group?.children?.forEach((item) => {
			// 		const matchingEvent = eventData?.map((ev) => ev.employee === item.id)

			// 		console.log('events', matchingEvent)

			// 		if (matchingEvent) {
			// 			eventsArray.push({
			// 				id: matchingEvent.employee,
			// 				resourceId: item.id,
			// 				startDate: matchingEvent.start,
			// 				endDate: matchingEvent.end,
			// 				employee: matchingEvent.employee,
			// 				project: matchingEvent.project,
			// 				stat: matchingEvent.stat,
			// 				status: matchingEvent.status,
			// 				sub_type: matchingEvent.sub_type,
			// 				name: matchingEvent.title,
			// 				type: matchingEvent.type,
			// 			})
			// 		}
			// 	})
			// })

			myResources?.forEach((group) => {
				group?.children?.forEach((item) => {
					const matchingEvents = eventData?.filter((ev) => ev.employee === item.id)

					matchingEvents.forEach((event) => {
						eventsArray.push({
							id: event.id, // Use actual event.id, not employee ID
							resourceId: item.id,
							startDate: event.start,
							endDate: event.end,
							employee: event.employee,
							project: event.project,
							stat: event.stat,
							status: event.status,
							sub_type: event.sub_type,
							name: event.title,
							type: event.type,
						})
					})
				})
			})

			SetEvents(eventsArray)
			SetSelectedEvents(eventData)
		})
	}, [myResources])

	// const weekendTimeRanges = resources.map((resource, index) => ({
	// 	id: `weekend-${resource.id || index}`, // give each a unique id
	// 	resourceId: resource.id, // dynamic resourceId from your resources array
	// 	cls: 'light-red-time-range', // your custom class
	// 	name: '',
	// 	startDate: '2025-01-05T00:00:00', // starting from a Saturday
	// 	duration: 1,
	// 	recurrenceRule: 'FREQ=WEEKLY;BYDAY=SA,SU',
	// }))

	const project = React.useMemo(() => {
		if (!events?.length || !myResources?.length)
			return new ProjectModel({
				eventsData: [...events],
				resourcesData: myResources,
				dependencyStore: new DependencyStore({ data: [], autoLoad: true }),
			})

		return new ProjectModel({
			eventsData: [...events],
			resourcesData: myResources,
			// dependencyStore: new DependencyStore({
			// 	data: dependencies,
			// 	autoLoad: true,
			// }),
		})
	}, [myResources, events])

	useEffect(() => {
		if (!schedulerRef.current) return

		PresetManager.add(CustomViewDay)
		PresetManager.add(customMonthViewPreset)

		const ganttProps = {
			stripeFeature: true,
			dependenciesFeature: true,
		}

		const currentZoomIndex = 1

		const scheduler = new SchedulerPro({
			appendTo: schedulerRef.current,
			autoHeight: true,
			width: '100%',
			infiniteScroll: true,
			viewPreset: customMonthViewPreset,
			tickSize: 100,
			rowHeight: 100,
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
			features: {
				taskEdit: {
					editorConfig: {
						title: 'Task Info ',
					},
					items: {
						generalTab: {
							title: 'General',
							items: {
								nameField: {
									type: 'combo',
									name: 'name',
									label: 'Project Sites',
									required: true,
									value: null,
									weight: 100,
									items:
										allProjectSites?.map((item) => ({
											value: sanitizeForDataId(item?.title),
											text: item?.title,
										})) || [],
								},
								startDateField: {
									type: 'datefield',
									name: 'startDate',
									label: 'Start Date',
									format: 'YYYY-MM-DD',
									weight: 200,
								},
								endDateField: {
									type: 'datefield',
									name: 'endDate',
									label: 'End Date',
									format: 'YYYY-MM-DD',
									weight: 300,
								},
								effortField: false,
								resourcesField: false,
								completedField: false,
							},
						},
						notesTab: true,
						predecessorsTab: true,
						successorsTab: true,
						resourcesTab: false,
					},
				},
				tree: true,
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
				...features,
				eventCopyPaste: true,
				eventEdit: false,
				resourceTimeRanges: {
					enableResizing: false,
					showHeaderElements: true,
					renderer({ resourceTimeRangeRecord, resourceRecord, renderData }) {
						if (resourceTimeRangeRecord.id === 1) {
							renderData.cls.important = 1

							return [
								{
									tag: 'i',
									class: 'b-fa b-fa-warning',
									style: 'margin-inline-end:.5em',
								},
								{
									tag: 'strong',
									text: `${DateHelper.format(resourceTimeRangeRecord.startDate, 'MMM DD')} ${
										resourceTimeRangeRecord.name
									}`,
								},
							]
						}

						return resourceTimeRangeRecord.name
					},
				},
				eventMenu: true,
			},

			// resourceTimeRanges: weekendTimeRanges,

			columns: [
				{
					type: 'tree',
					text: 'Employee',
					field: 'name',
					width: 250,
					headerRenderer: () => '<b style="font-weight: 800; font-size: 18px;">Employee</b>',
					htmlEncode: false,
					renderer: ({ record }) => {
						console.log('record', record, record.name, record.data.team_lead)
						const isGroup = record.children?.length > 0
						const name = record.name

						if (isGroup) {
							return `<b style="margin-left:5px">${name}</b>`
						}

						const rating = record.rating || ''
						const badge = '👤'

						const teamLeadTag = record.data.team_lead
							? `<span style="background-color: #ff7b00; color: white; font-size: 10px; padding: 2px 6px; border-radius: 4px; margin-left: 13px;">TEAM LEAD</span>`
							: ''

						return `
            <span style="margin-right: 8px; font-weight:600">${badge}</span>
            <span>${name}</span>
            ${teamLeadTag}
            `
					},
				},
			],

			project,

			listeners: {
				beforeEventAdd: ({ eventRecord }) => {
					// Clear name so combo box starts blank
					eventRecord.set('name', null)
				},
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
					console.log('eventDrop', eventRecords)
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

					// eventRecord.set('manuallyScheduled', true)

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
				},
				afterEventEdit: ({ source, action }) => {
					console.log('After event edit listener:', action)
				},
				beforeEventEditShow({ editor, eventRecord, context }) {
					console.log('beforeeventeditshow', eventRecord)

					const subtasksContainer = editor.widgetMap.subtasksContainer
					if (!subtasksContainer) return true

					subtasksContainer.removeAll(true) // true = destroy

					subtasksContainer.removeAll()

					subtasksContainer.add({
						type: 'container',
						layout: 'vbox',
						cls: 'b-subtask-editor-container',
						defaults: {
							labelWidth: '150px',
							width: '100%',
							style: 'margin-bottom: 1em;',
						},
						items: [
							{
								type: 'textfield',
								label: 'Parent Task Name',
								name: 'name',
								value: eventRecord.name,
								required: true,
							},
							{
								type: 'datefield',
								label: 'Start Date',
								name: 'startDate',
								value: eventRecord.startDate,
								format: 'YYYY-MM-DD',
							},
							{
								type: 'datefield',
								label: 'End Date',
								name: 'endDate',
								value: eventRecord.endDate,
								format: 'YYYY-MM-DD',
							},
						],
					})

					return true
				},
				eventAdd: async ({ records }) => {
					console.log('Add NewEVent CLicked', records)
				},
			},
		})
		scheduler.on('afterEventSave', async ({ eventRecord }) => {
			const startDate = eventRecord.startDate
			const endDate = eventRecord.endDate
			const resourceID = eventRecord.resourceId
			const name = eventRecord.name

			const backendStartDate = DateHelper.format(startDate, 'YYYY-MM-DD')
			const backendEndDate = DateHelper.format(endDate, 'YYYY-MM-DD')

			const newEvent = {
				title: name,
				start: backendStartDate,
				end: backendEndDate,
				project: projectid,
				employee: resourceID,
				type: 'dw',
			}

			createNewEvent(newEvent).then((res) => {
				if (res?.error === null) {
					// eventRecord.set({ id: resourceID })
				}
				console.log('afterSave', res, newEvent)
			})
		})

		scheduler.on('eventMenuItem', async ({ item, eventRecord }) => {
			if (item.text === 'Delete') {
				deleteEvent(eventRecord.id).then((res) => {
					console.log('delete clicked', res)
				})
			}
		})

		scheduler.displayDateFormat = 'll'

		// // ✅ Proper async commit block
		;(async () => {
			await scheduler.project.commitAsync()
		})()

		return () => scheduler.destroy()
	}, [myResources, events])

	console.log('events', events, myResources)

	return <div ref={schedulerRef} style={{ height: '900px', width: '100%', marginTop: '15px' }} />
}

export default NewWorkfocePlanning
