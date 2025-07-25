import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useQueryClient } from 'react-query'
import flatpickr from 'flatpickr'
import rangePlugin from 'flatpickr/dist/plugins/rangePlugin'
import TimeRangeEditor from '../Dashboard/AddNewProject/Tasks/TimeRangeEditor'
import DateRangeEditor from './workDaysEditor'
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

import { Button as MuiButton, Stack, Typography, Switch } from '@mui/material'
import Iconify from 'components/Iconify'
import moment, { duration } from 'moment-timezone'

import './Calender2.css'

import { styled } from '@mui/material/styles'

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
} from 'supabase'

import {
	customMonthViewPreset,
	features,
	getTimelineRange,
	dependencyTypeMap,
	getISODateString,
	zoomPresets,
	CustomViewDay,
} from './SchedulerConfig'
import { filter, forEach } from 'lodash'
import FilterPopup from 'components/FilterPopUp'
import { getProjectDiagram } from 'supabase/project_diagram'
import { da } from 'date-fns/locale'
import { autoDetect, Datepicker, Input, momentTimezone, setOptions } from '@mobiscroll/react'
import SchedulerComponent from './SchedulerCode'
import ManageSubtasksDialog from './ManageSubtasks'

const CompactSwitch = styled(Switch)(({ theme }) => ({
	width: 44,
	height: 23,
	padding: 4,
	'& .MuiSwitch-switchBase': {
		padding: 1,
		'&.Mui-checked': {
			transform: 'translateX(20px)',
			color: '#fff',
			'& + .MuiSwitch-track': {
				backgroundColor: '#4caf50',
				opacity: 1,
			},
		},
	},
	'& .MuiSwitch-thumb': {
		width: 20,
		height: 20,
		boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
	},
	'& .MuiSwitch-track': {
		borderRadius: 20 / 2,
		backgroundColor: '#ccc',
		opacity: 1,
		transition: theme.transitions.create(['background-color'], {
			duration: 200,
		}),
	},
}))

const Calender2 = ({
	isFilteredApplied,
	taskGroup,
	SetTaskGroup,
	SetAllTaskGroup,
	SetAllRescources,
	resources,
	SetResources,
	taskType,
	SetTaskType,
}) => {
	const [range, setRange] = React.useState(getTimelineRange())
	const [openSubtaskPopup, setOpenSubtaskPopup] = useState(false)
	const [currentEventRecord, setCurrentEventRecord] = useState(null)
	const [tempScheduler, SetTeampScheduler] = useState(null)
	const [allWorkTypes, SetAllWorkTypes] = useState([
		'Connection',
		'Installation',
		'Office Work',
		'Completion Testing',
		'Metal Fittings Installation',
		'Auxiliary Construction',
	])
	const [value, setValue] = useState([])
	const instanceRef = useRef(null)
	const activeRowRef = useRef(null)

	const [istTaskUpdated, SetIsTaskUpdated] = useState(false)
	const [isResourceBuildingLoading, setIsResourceBuildingLoading] = useState(true)
	const [teamsDetails, SetTeamDetails] = useState([])
	const [teams, SetTeam] = useState([])

	const [showSubTasks, SetshowSubTasks] = useState(true)
	const [lockWeekend, SetlockWeekend] = useState(true)

	let originalStartDate = null

	let orignalEndDate = null

	const schedulerRef = useRef(null)
	const schedulerInstanceRef = useRef(null)

	let currentCenterDate = null

	const newlyCreatedDeps = new Set()

	const tempDep = new Map()

	let scheduler = null

	const { id } = useParams()
	console.log('myID', id)
	// let suppressNextEditor = false

	const handleToggle = () => {
		SetshowSubTasks(!showSubTasks)
	}

	console.log('SHow SubTaks', taskGroup)

	const myQueryClient = useQueryClient()

	const { data, isLoading, error } = useQuery(['projectData', id], async () => {
		const [tasks, dependencies] = await Promise.all([listAllTasksByProject2(id), getAllTaskDependencyByProject(id)])

		console.log('projectData', data)

		return { tasks, dependencies }
	})
	console.log('tasks', data)
	// code to fetch selected worktype
	const { data: selectedWorkTypesData, isLoading: isLoadingWorkTypes } = useQuery(
		['selectedWorkTypes', id],
		() => getSelectedWorkTypes(id),
		{
			select: (data) => {
				return data?.selectedWorkTypes || [] // Return the selectedWorkTypes array or an empty array
			},
		}
	)

	const uniqueWorkTypes = [...new Set(selectedWorkTypesData)]

	const memoizedGroupedTasks = React.useMemo(() => {
		if (!data?.tasks) {
			return {
				metal_fittings: [],
				installations: [],
				connections: [],
				completion_test: [],
				office_work: [],
				auxiliary_construction: [],
			}
		}

		const task_groups = {
			1: 'metal_fittings',
			2: 'installations',
			3: 'connections',
			4: 'completion_test',
			5: 'office_work',
			6: 'auxiliary_construction',
		}
		const grouped = {
			metal_fittings: [],
			installations: [],
			connections: [],
			completion_test: [],
			office_work: [],
			auxiliary_construction: [],
		}

		// Group nested tasks on the basis of parentId
		const nestedTasks = data?.tasks?.data?.filter((task) => task.parent_id !== null)
		const nestedTaskGroupedOnParentId = {}

		nestedTasks.forEach((task) => {
			const parentId = task.parent_task
			if (parentId) {
				if (!nestedTaskGroupedOnParentId[parentId]) {
					nestedTaskGroupedOnParentId[parentId] = []
				}
				nestedTaskGroupedOnParentId[parentId].push(task)
			}
		})

		data.tasks.data?.forEach((task) => {
			const groupId = task.task_group_id
			if (!task.parent_task && groupId !== null && task_groups[groupId]) {
				grouped[task_groups[groupId]]?.push({
					...task,
					children: nestedTaskGroupedOnParentId[task.id] || [],
				})
			}
		})
		console.log('yyy', data)
		return grouped
	}, [data?.tasks])

	useEffect(() => {
		if (memoizedGroupedTasks) {
			SetTaskGroup(memoizedGroupedTasks)
			SetAllTaskGroup(memoizedGroupedTasks)
		}
	}, [memoizedGroupedTasks, SetTaskGroup, SetAllTaskGroup])

	// Use dependencies from the query result
	const dependencyTypeMap = {
		StartToStart: 0,
		StartToEnd: 1,
		EndToStart: 2,
		EndToEnd: 3,
	}

	const dependencies = React.useMemo(() => {
		if (!data?.dependencies?.data) return []
		return data.dependencies.data.map((dep) => ({
			id: dep.id,
			fromEvent: dep.from_task_id,
			toEvent: dep.to_task_id,
			type: dependencyTypeMap[dep.type] || 2, // default to Finish-to-Start(connection points)
			active: dep.active || true,
			lag: dep.lag || 0,
			lagUnit: dep.lag_unit || 'd',
		}))
	}, [data?.dependencies])

	console.log('mytask', taskGroup)

	useEffect(() => {
		async function buildExpandedResources() {
			const expandedResources = []
			setIsResourceBuildingLoading(true)
			const promises = uniqueWorkTypes.map(async (workType) => {
				const normalized = workType
					.toLowerCase()
					.replace(/[\s/]+/g, '_')
					.replace(/testing$/, 'test')
					.replace(/y$/, 'ie')

				let resourceId = normalized

				if (normalized === 'connection') resourceId = 'connections'
				else if (normalized === 'installation') resourceId = 'installations'
				else if (normalized === 'metal_fittings_installation') resourceId = 'metal_fittings'
				else if (normalized === 'completion_test') resourceId = 'completion_test'
				else if (normalized === 'auxiliary_construction') resourceId = 'auxiliary_construction'
				else if (normalized === 'office_work') resourceId = 'office_work'

				const relatedTasks = taskGroup[resourceId]

				console.log('unique', resourceId, relatedTasks, taskGroup[resourceId])

				if (Array.isArray(relatedTasks) && relatedTasks.length > 0) {
					const uniqueTeams = new Set()
					const taskWithNoTeam = []
					relatedTasks.forEach((task) => {
						if (task.team) {
							uniqueTeams.add(task.team)
						} else {
							taskWithNoTeam.push(task)
						}
					})

					const teamPromises = Array.from(uniqueTeams).map(async (teamNumber) => {
						const uniqueId = `${resourceId}-${teamNumber}`
						try {
							const response = await getTeamDetails(teamNumber)
							console.log('Team Promises', response, teamNumber)
							SetTeam((prev) => [...prev, response])
							const teamName = response?.data?.[0]?.name || `Team ${teamNumber}`

							expandedResources.push({
								id: uniqueId,
								name: workType,
								width: 100,
								workTeam: teamName,
							})
							SetTeamDetails((prev) => [...prev, { name: uniqueId, teamNumber }])
						} catch (error) {
							console.error(`Failed to get details for team ${teamNumber}`, error)
							expandedResources.push({
								id: uniqueId,
								name: workType,
								width: 100,
								workTeam: `Team ${teamNumber}`,
							})
							SetTeamDetails((prev) => [...prev, { name: uniqueId, teamNumber }])
						}
					})

					if (taskWithNoTeam.length > 0) {
						const uniqueId = `${resourceId}-no-team`
						expandedResources.push({
							id: uniqueId,
							name: workType,
							width: 100,
							workTeam: '',
							tasksWithoutTeam: taskWithNoTeam,
						})
						SetTeamDetails((prev) => [...prev, { name: uniqueId, teamNumber: null }])
					}

					await Promise.all(teamPromises)
				} else {
					expandedResources.push({
						id: resourceId,
						name: workType,
						width: 100,
						workTeam: null,
					})
				}
			})

			await Promise.all(promises)
			console.log('gg', expandedResources)
			return expandedResources
		}

		;(async () => {
			const results = await buildExpandedResources()

			const preferredOrder = [
				'Installation',
				'Connection',
				'Completion Testing',
				'Metal Fittings Installation',
				'Auxiliary Construction',
				'Office Work',
			]

			results.sort((a, b) => {
				const indexA = preferredOrder.indexOf(a.name)
				const indexB = preferredOrder.indexOf(b.name)

				const safeIndexA = indexA === -1 ? preferredOrder.length : indexA
				const safeIndexB = indexB === -1 ? preferredOrder.length : indexB

				return safeIndexA - safeIndexB
			})

			SetResources(results)
			SetAllRescources(results)

			SetTaskType(results)
			console.log('mGGGGG', results)
		})()
		SetIsTaskUpdated(true)
	}, [selectedWorkTypesData, taskGroup])

	const weekendTimeRanges = resources.map((resource, index) => ({
		id: `weekend-${resource.id || index}`, // give each a unique id
		resourceId: resource.id, // dynamic resourceId from your resources array
		cls: 'light-red-time-range', // your custom class
		name: '',
		startDate: '2025-01-05T00:00:00', // starting from a Saturday
		duration: 1,
		recurrenceRule: 'FREQ=WEEKLY;BYDAY=SA,SU',
	}))

	const events = React.useMemo(() => {
		if (!taskGroup) return []

		const {
			connections = [],
			installations = [],
			metal_fittings = [],
			completion_test = [],
			office_work = [],
			auxiliary_construction = [],
		} = taskGroup

		console.log('mytask', taskGroup)

		const allEvents = []

		const processWorkType = (tasks, typeName, resourcePrefix, eventColor) => {
			const eventsForType = []
			const tasksWithTeams = tasks.filter((task) => task.team)
			const tasksWithoutTeam = tasks.filter((task) => !task.team)

			console.log('TaskWithTeams', tasksWithTeams, tasksWithoutTeam)

			// 1. Create events for tasks WITH a team (one event per task)

			tasksWithTeams.forEach((task, index) => {
				const resourceId = `${resourcePrefix}-${task.team}`
				const id = task.id || `${resourcePrefix}-${task.team}-${index + 1}`
				const startDate = task.start_date ? getISODateString(task.start_date) : getISODateString(new Date())
				const endDate = task.end_date
					? getISODateString(task.end_date)
					: (() => {
							const today = new Date()
							today.setDate(today.getDate() + 3)
							return getISODateString(today)
					  })()
				const name = task.title
				const team = task?.team
				const task_group_id = task?.task_group_id

				const hasChildren = task?.children && task?.children.length > 0

				const calculateEndDate = (startDate, durationInDays) => {
					if (!startDate) {
						return null
					}
					const start = new Date(startDate)
					start.setDate(start.getDate() + durationInDays - 1)
					return getISODateString(start)
				}

				const calculateDurationInDays = (startDate, endDate) => {
					if (!startDate || !endDate) {
						return 0
					}
					const start = new Date(startDate)
					const end = new Date(endDate)
					const diffTime = Math.abs(end.getTime() - start.getTime())
					const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
					return diffDays
				}

				const DEFAULT_DURATION_DAYS = 5

				const effectiveStartDate = startDate
				let effectiveEndDate = endDate

				if (!effectiveEndDate) {
					effectiveEndDate = calculateEndDate(effectiveStartDate, DEFAULT_DURATION_DAYS)
				}

				const actualDuration = calculateDurationInDays(effectiveStartDate, effectiveEndDate)

				eventsForType.push({
					id,
					resourceId,
					startDate,
					endDate,
					allDay: true,
					duration: actualDuration,
					durationunit: 'day',
					name,
					// manuallyScheduled: false,
					expanded: false,
					leaf: !hasChildren,
					isTask: true,
					team,
					task_group_id,
					eventColor,
					...(hasChildren &&
						showSubTasks && {
							children: task.children.map((child) => {
								const childId = child.id || `child-${id}-${Math.random().toString(36).substr(2, 9)}` // Unique ID for child
								const childStartDate = child.start_date
									? getISODateString(child.start_date)
									: getISODateString(startDate)
								const childEndDate = child.end_date ? getISODateString(child.end_date) : getISODateString(endDate)
								const childName = child.title

								return {
									id: childId,
									parentId: id,
									resourceId,
									startDate: childStartDate,
									endDate: childEndDate,
									allDay: true,
									name: childName,
									leaf: true,
									eventColor,
								}
							}),
						}),
				})
			})
			if (tasksWithoutTeam.length > 0) {
				tasksWithoutTeam.forEach((task, idx) => {
					const resourceId = `${resourcePrefix}-no-team`
					const id = task.id || `${resourceId}-task-${idx}`

					const startDate = task.start_date ? getISODateString(task.start_date) : getISODateString(new Date())
					const endDate = task.end_date
						? getISODateString(task.end_date)
						: (() => {
								const today = new Date()
								today.setDate(today.getDate() + 3)
								return getISODateString(today)
						  })()
					const name = task.title
					const team = null
					const task_group_id = task?.task_group_id

					const hasChildren = task?.children && task?.children.length > 0

					const calculateEndDate = (startDate, durationInDays) => {
						if (!startDate) {
							return null
						}
						const start = new Date(startDate)
						start.setDate(start.getDate() + durationInDays - 1)
						return getISODateString(start)
					}

					const calculateDurationInDays = (startDate, endDate) => {
						if (!startDate || !endDate) {
							return 0
						}
						const start = new Date(startDate)
						const end = new Date(endDate)
						const diffTime = Math.abs(end.getTime() - start.getTime())
						const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
						return diffDays
					}

					const DEFAULT_DURATION_DAYS = 5

					const effectiveStartDate = startDate
					let effectiveEndDate = endDate

					if (!effectiveEndDate) {
						effectiveEndDate = calculateEndDate(effectiveStartDate, DEFAULT_DURATION_DAYS)
					}

					const actualDuration = calculateDurationInDays(effectiveStartDate, effectiveEndDate)

					eventsForType.push({
						id,
						resourceId,
						startDate,
						endDate,
						allDay: true,
						duration: actualDuration,
						durationunit: 'day',
						name,
						// manuallyScheduled: false,
						expanded: false,
						leaf: !hasChildren,
						isTask: true,
						team,
						task_group_id,
						isNoTeamIndividualTask: true,
						eventColor,
						...(hasChildren &&
							showSubTasks && {
								children: task.children.map((child) => {
									const childId = child.id || `child-${id}-${Math.random().toString(36).substr(2, 9)}` // Unique ID for child
									const childStartDate = child.start_date
										? getISODateString(child.start_date)
										: getISODateString(startDate)
									const childEndDate = child.end_date ? getISODateString(child.end_date) : getISODateString(endDate)
									const childName = child.title

									return {
										id: childId,
										parentId: id,
										resourceId,
										startDate: childStartDate,
										endDate: childEndDate,
										allDay: true,
										name: childName,
										leaf: true,
										eventColor,
									}
								}),
							}),
					})
				})
			}
			return eventsForType
		}

		allEvents.push(...processWorkType(connections, 'Connection', 'connections', 'green'))
		allEvents.push(...processWorkType(installations, 'Installation', 'installations', 'blue'))
		allEvents.push(...processWorkType(metal_fittings, 'Metal Fittings Installation', 'metal_fittings', 'purple'))
		allEvents.push(...processWorkType(completion_test, 'Completion Testing', 'completion_test', 'orange'))
		allEvents.push(...processWorkType(office_work, 'Office Work', 'office_work', 'grey'))
		allEvents.push(
			...processWorkType(auxiliary_construction, 'Auxiliary Construction', 'auxiliary_construction', 'brown')
		)

		return allEvents
	}, [taskGroup, showSubTasks])

	console.log('events', taskGroup)

	const calendar = new CalendarModel({
		id: 'general',
		intervals: [
			{
				recurrentStartDate: 'on Sat',
				recurrentEndDate: 'on Mon',
				isWorking: true,
			},
		],
	})

	const project = React.useMemo(() => {
		if (!events?.length || !resources?.length)
			return new ProjectModel({
				eventsData: [],
				resourcesData: [],
				dependencyStore: new DependencyStore({ data: [], autoLoad: true }),
			})

		return new ProjectModel({
			eventsData: [...events],
			resourcesData: resources,
			dependencyStore: new DependencyStore({
				data: dependencies,
				autoLoad: true,
			}),
			calendar,
		})
	}, [events, resources, dependencies])

	console.log('project', project)

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

	function openManageSubtaskPopup(eventRecord) {
		// scheduler.editEvent(eventRecord)
		const editor = scheduler.features.eventEdit?.editor
		const subtasksContainer = editor?.widgetMap?.subtasksContainer

		console.log('Manage Subtask', editor, scheduler.features.eventEdit)

		let subTaskToBeDeleted = []

		if (subtasksContainer) {
			subtasksContainer.items.forEach((item) => item.destroy())
			subtasksContainer.removeAll()
		}

		const createSubtasksGrid = (initialData = []) => {
			const noSubtasksLabel = subtasksContainer?.widgetMap?.noSubtasksLabel

			if (noSubtasksLabel) {
				noSubtasksLabel.destroy()
			}

			return subtasksContainer?.add({
				type: 'grid',
				height: '272px',
				ref: 'subtasksGridWidget',
				scrollable: true,
				cls: 'custom-aggrid-style',
				features: {
					cellEdit: true,
				},
				store: {
					data: initialData,
					listeners: {
						update: ({ record, changes }) => {
							const { id } = record
							const newName = changes?.name?.value

							const childToUpdate = eventRecord.children.find((child) => child.id === id)

							const gridWidget = subtasksContainer?.widgetMap?.subtasksGridWidget
							const labelWidget = gridWidget?.widgetMap?.deleteStatusLabel
							const deleteButtonWidget = gridWidget?.widgetMap?.deleteButton

							deleteButtonWidget?.hide()

							if (!childToUpdate) {
								console.warn('Could not find matching subtask in eventRecord.children for ID:', id)
								return
							}

							if (childToUpdate.isPhantom) {
								console.warn('The subtask is a phantom (unsaved). May cause duplication on save.')
							}

							if (newName) childToUpdate.set('name', newName)
							childToUpdate.set('yesModified', true)

							// Handle startDate and endDate changes
							;['startDate', 'endDate'].forEach((field) => {
								if (changes?.[field]) {
									const newDate = changes?.[field]?.value
									childToUpdate.set(field, newDate)
									childToUpdate.set('yesModified', true)

									const start = new Date(childToUpdate.startDate)
									const end = new Date(childToUpdate.endDate)
									const diffInDays = (end - start) / (1000 * 60 * 60 * 24)

									childToUpdate.set('duration', diffInDays)
									record.set('duration', diffInDays)
								}
							})

							if (changes?.completed?.value) {
								subTaskToBeDeleted.push(record?.data?.id)
							} else {
								subTaskToBeDeleted = subTaskToBeDeleted.filter((id) => id !== record?.data?.id)
							}

							if (labelWidget) {
								if (subTaskToBeDeleted.length > 0) {
									labelWidget.show()
									labelWidget.html = `Items selected: ${subTaskToBeDeleted.length}`
									deleteButtonWidget?.show()
								} else {
									labelWidget.hide()
									deleteButtonWidget?.hide()
								}
							}
						},
					},
				},

				columns: [
					{ type: 'check', text: '', field: 'completed', width: 70, editor: true, align: 'center' },
					{ text: 'Task Name', field: 'name', flex: 0.5, editor: 'text', editable: true },
					{
						text: 'Mandays',
						field: 'duration',
						flex: 0.5,
						editable: false,
						renderer: ({ record }) => {
							const start = new Date(record.data.startDate)
							const end = new Date(record.data.endDate)
							const diff = (end - start) / (1000 * 60 * 60 * 24)
							return Number.isNaN(diff) ? '' : Math.round(diff)
						},
					},
					{ text: 'Start Date', field: 'startDate', type: 'date', format: 'YYYY-MM-DD', flex: 1 },
					{ text: 'End Date', field: 'endDate', type: 'date', format: 'YYYY-MM-DD', flex: 1 },
				],

				bbar: [
					'->',
					{
						type: 'label',
						ref: 'deleteStatusLabel',
						html: '',
						hidden: true,
						margin: '0 0.5em 0 1em',
					},
					{
						type: 'button',
						icon: 'b-icon b-icon-trash',
						cls: 'b-blue',
						ref: 'deleteButton',
						hidden: true,
						onClick: async () => {
							try {
								const res = await deleteTasks(subTaskToBeDeleted)

								subTaskToBeDeleted.forEach((id) => {
									const index = eventRecord.children.findIndex((child) => child.id === id)
									if (index !== -1) eventRecord.children.splice(index, 1)
									const taskRecord = scheduler.eventStore.getById(id)
									if (taskRecord) scheduler.eventStore.remove(taskRecord)

									const dataIndex = eventRecord.data?.children?.findIndex((child) => child.id === id)
									if (dataIndex !== -1) eventRecord.data.children.splice(dataIndex, 1)
								})

								const gridWidget = subtasksContainer?.widgetMap?.subtasksGridWidget
								const labelWidget = gridWidget?.widgetMap?.deleteStatusLabel
								const deleteButtonWidget = gridWidget?.widgetMap?.deleteButton

								labelWidget?.hide()
								deleteButtonWidget?.hide()

								gridWidget?.store?.loadData(eventRecord.children)
								await scheduler.project.commitAsync()
							} catch (e) {
								console.error('Delete failed:', e)
							}
						},
					},
				],
			})
		}

		if (eventRecord.children?.length) {
			const sorted = [...(eventRecord.data?.children || [])].sort((a, b) => {
				const aStart = new Date(a.startDate)
				const bStart = new Date(b.startDate)
				return aStart - bStart || new Date(a.endDate) - new Date(b.endDate)
			})
			createSubtasksGrid(sorted)
		} else {
			subtasksContainer?.add({ type: 'label', html: 'No subtasks', ref: 'noSubtasksLabel' })
		}

		subtasksContainer?.add({
			type: 'button',
			text: 'Add New Subtask',
			cls: 'b-blue b-raised',
			margin: '1em 0',
			onClick: () => {
				const sorted = [...(eventRecord?.children || [])].sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
				const parentStart = moment(eventRecord.startDate)
				const parentEnd = moment(eventRecord.endDate)

				const cycleLength = parentEnd.diff(parentStart, 'days')
				if (cycleLength <= 0) return

				const validPairs = []
				const temp = new Date(parentStart)

				while (temp <= new Date(parentEnd)) {
					const next = new Date(temp)
					next.setDate(temp.getDate() + 1)
					if (![0, 6].includes(temp.getDay()) && next <= new Date(parentEnd)) {
						validPairs.push([new Date(temp), new Date(next)])
					}
					temp.setDate(temp.getDate() + 1)
				}

				const pairIndex = sorted.length % validPairs.length
				const [startDateObj, endDateObj] = validPairs[pairIndex]

				const newSubtaskData = {
					id: Math.floor(Date.now() / 1000) + Math.floor(Math.random() * 1000),
					name: ' ',
					startDate: startDateObj,
					endDate: endDateObj,
					duration: 1,
					...eventRecord.data,
					parent_task: eventRecord.id,
					isSaved: false,
					resourceId: sorted[sorted.length - 1]?.data?.resourceId,
				}

				const EventModel = scheduler.eventStore.modelClass
				const newTaskModel = new EventModel(newSubtaskData)
				eventRecord.appendChild(newTaskModel)

				const grid = subtasksContainer?.widgetMap?.subtasksGridWidget
				grid?.store?.add(newSubtaskData)

				const newRecord = grid?.store?.last
				const editingFeature = grid?.features?.cellEdit
				if (editingFeature) {
					setTimeout(() => {
						requestAnimationFrame(() => {
							editingFeature.startEditing({
								record: newRecord,
								field: 'name',
							})
						})
					}, 10)
				}
			},
		})
		return true
	}

	useEffect(() => {
		if (!schedulerRef.current) return

		PresetManager.add(CustomViewDay)
		PresetManager.add(customMonthViewPreset)

		const ganttProps = {
			stripeFeature: true,
			dependenciesFeature: true,
		}

		const currentZoomIndex = 1

		scheduler = new SchedulerPro({
			appendTo: schedulerRef.current,
			autoHeight: true,
			width: '100%',
			infiniteScroll: true,
			viewPreset: customMonthViewPreset,
			tbar: [
				{
					type: 'combo',
					label: 'View',
					editable: false,
					items: [
						{ text: 'Week', value: 'weekAndDay' },
						{ text: 'Month', value: 'monthAndYear' },
					],
					listeners: {
						change({ value }) {
							if (value === 'monthAndYear') {
								scheduler.viewPreset = value
								scheduler.startDate = new Date(2025, 0, 1) // January 1, 2025

								console.log('SchedulerDATE', scheduler.startDate)
							} else {
								scheduler.suspendRefresh()
								scheduler.viewPreset = value
								const day = currentCenterDate?.getDate()
								const year = currentCenterDate.getFullYear()
								const month = currentCenterDate.getMonth() // 0-based
								scheduler.startDate = new Date(year, month, day)

								scheduler.resumeRefresh()

								console.log(
									'SchedulerDATE123',
									currentCenterDate?.getDate(),
									currentCenterDate?.getMonth(),
									currentCenterDate?.getFullYear()
								)
							}
						},
					},
				},
			],
			tickSize: 100,
			rowHeight: 100,
			// endDateIsInclusive: true,
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
									type: 'textfield',
									name: 'name',
									label: 'Task Name',
									required: true,
								},
								startDateField: {
									type: 'datefield',
									name: 'startDate',
									label: 'Start Date',
									format: 'YYYY-MM-DD',
								},
								endDateField: {
									type: 'datefield',
									name: 'endDate',
									label: 'End Date',
									format: 'YYYY-MM-DD',
								},
								effortField: false,
								resourceField: false,
							},
						},
						notesTab: true,
						predecessorsTab: true,
						successorsTab: true,
					},
				},
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
				eventMenu: {
					processItems({ items, eventRecord }) {
						const originalEventRecord = eventRecord
						const OrignalParentStartDate = eventRecord.startDate
						const originalParentEndDate = eventRecord.endDate
						items.addCustomSubtask = {
							text: 'Add SubTask',
							icon: 'b-fa b-fa-plus',

							async onItem({ eventRecord }) {
								// 1. Find top-level parent
								let topParent = eventRecord
								while (topParent.parent) {
									topParent = topParent.parent
								}

								console.log('OriginalDATES', OrignalParentStartDate, originalParentEndDate)

								console.log('This is add new Event', eventRecord.get('startDate'), eventRecord.get('endDate'))

								await scheduler.project.commitAsync()

								const subtasks = []
								const titleSubTasks = []

								// let title = 1

								const defaultSubTaskNames = ['Line', 'Assemble', 'Trim', 'Galvanize', 'Install']
								const parentId = eventRecord?.data?.id

								const existingSubtaskNames = eventRecord?.children?.map((item) => item?.name) || []

								// Find the *first* missing subtask in the default order
								const missingSubTask = defaultSubTaskNames.find((taskName) => !existingSubtaskNames.includes(taskName))

								if (missingSubTask !== undefined) {
									let newSubtaskStartDate
									let newSubtaskEndDate = null

									// Determine the ideal index of the missing subtask in the default order
									const missingTaskIndex = defaultSubTaskNames.indexOf(missingSubTask)

									// Case 1: The missing task is the very first one ('Line'), or no children exist yet
									if (missingTaskIndex === 0 || !eventRecord?.data?.children?.length) {
										newSubtaskStartDate = moment(eventRecord.data.startDate)
									} else {
										// Case 2: The missing task is in the middle or at the end
										// Find the immediately preceding task in the default list
										const previousDefaultTaskName = defaultSubTaskNames[missingTaskIndex - 1]

										// Try to find this preceding task among the *currently existing* children
										const precedingExistingChild = eventRecord?.data?.children?.find(
											(child) => child?.name === previousDefaultTaskName
										)

										if (precedingExistingChild) {
											// If the preceding task exists, start the new subtask from its end date
											newSubtaskStartDate = moment(precedingExistingChild.endDate)
										} else {
											let closestExistingPredecessor = null
											for (let i = missingTaskIndex - 1; i >= 0; i -= 1) {
												const currentDefaultTaskName = defaultSubTaskNames[i]
												closestExistingPredecessor = eventRecord?.data?.children?.find(
													(child) => child?.name === currentDefaultTaskName
												)
												if (closestExistingPredecessor) {
													break // Found the closest existing predecessor
												}
											}

											if (closestExistingPredecessor) {
												newSubtaskStartDate = moment(closestExistingPredecessor.endDate)
											} else {
												// If no preceding task exists at all, use the parent's start date
												newSubtaskStartDate = moment(eventRecord.data.startDate)
											}
										}
									}

									// New subtask will always be 1 day duration
									newSubtaskEndDate = newSubtaskStartDate.clone().add(1, 'days')

									// skip weekend code

									const parentStartDate = eventRecord?.startDate

									const parentEndDate = eventRecord.endDate

									const tempEndDate = new Date(parentEndDate)

									const extensiveDays = 25

									const extensiveEndDate = new Date(tempEndDate)

									extensiveEndDate.setDate(extensiveEndDate.getDate() + extensiveDays)

									const isWeekend = (day) => day === 0 || day === 6

									const validPairs = []
									const temp = new Date(parentStartDate)

									while (temp <= extensiveEndDate) {
										const next = new Date(temp)
										next.setDate(temp.getDate() + 1)

										if (!isWeekend(temp.getDay()) && next <= extensiveEndDate) {
											validPairs.push([new Date(temp), new Date(next)])
										}

										temp.setDate(temp.getDate() + 1)
									}

									const currentCount = existingSubtaskNames?.length
									const pairIndex = currentCount % validPairs.length
									const [startDateObj, endDateObj] = validPairs[pairIndex]

									subtasks.push({
										title: '',
										team: eventRecord?.data?.team,
										start_date: moment(startDateObj).format('YYYY-MM-DD'),
										end_date: moment(endDateObj).format('YYYY-MM-DD'),
										notes: '',
										task_group_id: eventRecord?.data?.task_group_id,
										project: id,
										parent_task: parentId,
									})

									console.log('Creating MYSUbtask:', validPairs)

									//  skip weekend code ends

									try {
										const res = await createNewTasks(subtasks) // Create the single new subtask

										console.log('This is add new Event', eventRecord.get('startDate'), eventRecord.get('endDate'))

										const backendNewSubtask = res?.data?.[0]

										const bryntumReadySubtask = {
											id: backendNewSubtask.id,
											name: backendNewSubtask.title,
											startDate: backendNewSubtask?.start_date,
											endDate: backendNewSubtask?.end_date,
											team: backendNewSubtask.team,
											notes: backendNewSubtask.notes,
											task_group_id: eventRecord.task_group_id,
											project: backendNewSubtask.project,
											parentId: backendNewSubtask.parent_task,
											resourceId: eventRecord?.data?.resourceId,
											isAddNewSubTask: true,
											expanded: true, // optional: expand if it's a parent with children
											leaf: true, // important: explicitly mark as leaf if it's a subtask
											isTask: true, // helps Bryntum recognize this as a task if needed
										}

										const newTaskRecord = scheduler.eventStore.add(bryntumReadySubtask)[0]

										console.log(
											'This is add new Event',
											eventRecord.get('startDate'),
											eventRecord.get('endDate'),
											newTaskRecord
										)

										await scheduler.project.commitAsync()

										if (!eventRecord.data.children) {
											eventRecord.data.children = []
										}
										eventRecord.data.children.push({
											name: backendNewSubtask.title,
											startDate: backendNewSubtask.start_date,
											endDate: backendNewSubtask.end_date,
										})

										console.log('This is add new Event', eventRecord.get('startDate'), eventRecord.get('endDate'))

										scheduler.assignmentStore.add({
											id: Date.now(),
											eventId: newTaskRecord.id,
											resourceId: eventRecord?.data?.resourceId,
										})
										await scheduler.project.commitAsync()

										console.log('This is add new Event', eventRecord.get('startDate'), eventRecord.get('endDate'))

										console.log('MyNewTask200', eventRecord)

										scheduler.resumeEvents()
										scheduler.resumeRefresh()

										console.log('OriginalDATES', eventRecord.startDate, eventRecord.endDate)

										console.log('This is add new Event', originalEventRecord, eventRecord)
									} catch (error) {
										console.log('Error !! Failed to add a subtask', error)
										// You might want to show a more user-friendly error here
									}
								} else {
									const alreadyExistingSubTasks = eventRecord?.children || []

									const subtaskCounts = {}
									defaultSubTaskNames.forEach((name) => {
										subtaskCounts[name] = 0
									})

									//  Line - 0 Trim - 0  Assemble -0

									alreadyExistingSubTasks.forEach((task) => {
										if (Object.prototype.hasOwnProperty.call(subtaskCounts, task.name)) {
											subtaskCounts[task.name] += 1
										}
									})

									let missingSubTask = null
									let minCount = Infinity

									defaultSubTaskNames.forEach((name) => {
										if (subtaskCounts[name] < minCount) {
											minCount = subtaskCounts[name]
											missingSubTask = name // Line
										}
									})
									const parentID = eventRecord?.id
									const { team, task_group_id } = eventRecord?.data

									if (missingSubTask) {
										const missingIndex = defaultSubTaskNames.indexOf(missingSubTask)

										let previousEndDate = moment(eventRecord.startDate)
										for (let i = missingIndex - 1; i >= 0; i -= 1) {
											const prevTaskName = defaultSubTaskNames[i]
											const match = alreadyExistingSubTasks.find((t) => t.name === prevTaskName)
											if (match) {
												previousEndDate = moment(match.endDate)
												break
											}
										}
										// code starts from here

										const tempEndDate = new Date(previousEndDate)

										tempEndDate.setDate(tempEndDate.getDate() + 1)

										const extensiveDays = 25

										const extensiveEndDate = new Date(tempEndDate)

										extensiveEndDate.setDate(extensiveEndDate.getDate() + extensiveDays)

										const isWeekend = (day) => day === 0 || day === 6

										const validPairs = []
										const temp = new Date(eventRecord?.startDate)

										while (temp <= extensiveEndDate) {
											const next = new Date(temp)
											next.setDate(temp.getDate() + 1)

											if (!isWeekend(temp.getDay()) && next <= extensiveEndDate) {
												validPairs.push([new Date(temp), new Date(next)])
											}

											temp.setDate(temp.getDate() + 1)
										}

										const currentCount = alreadyExistingSubTasks.length
										const pairIndex = currentCount % validPairs.length
										const [startDateObj, endDateObj] = validPairs[pairIndex]

										// code ends here

										const newSubtaskStartDate = previousEndDate
										const newSubtaskEndDate = newSubtaskStartDate.clone().add(1, 'day')

										subtasks.push({
											title: missingSubTask,
											team: eventRecord?.data?.team,
											start_date: moment(startDateObj).format('YYYY-MM-DD'),
											end_date: moment(endDateObj).format('YYYY-MM-DD'),
											notes: '',
											task_group_id: eventRecord?.data?.task_group_id,
											project: id,
											parent_task: parentId,
										})

										try {
											const res = await createNewTasks(subtasks) // Create the single new subtask
											const backendNewSubtask = res?.data?.[0]

											const bryntumReadySubtask = {
												id: backendNewSubtask.id,
												name: backendNewSubtask.title,
												startDate: backendNewSubtask?.start_date,
												endDate: backendNewSubtask?.end_date,
												team: backendNewSubtask.team,
												notes: backendNewSubtask.notes,
												task_group_id: eventRecord.task_group_id,
												project: backendNewSubtask.project,
												parentId: backendNewSubtask.parent_task,
												resourceId: eventRecord?.data?.resourceId,
												isAddNewSubTask: true,
											}

											const newTaskRecord = scheduler.eventStore.add(bryntumReadySubtask)[0]

											scheduler.assignmentStore.add({
												id: Date.now(),
												eventId: newTaskRecord.id,
												resourceId: eventRecord?.data?.resourceId,
											})

											await scheduler.project.commitAsync()

											// console.log('MyNewTask200', eventRecord)

											eventRecord.set('isAddNewSubTask', true)
										} catch (error) {
											console.log('Error !! Failed to add a subtask', error)
											// You might want to show a more user-friendly error here
										}
									}
								}
							},
						}
						items.addCustomManageSubtask = {
							text: 'Manage SubTask',
							icon: 'b-fa b-fa-tasks',

							onItem({ eventRecord }) {
								setCurrentEventRecord(eventRecord)
								setOpenSubtaskPopup(true)
							},
						}
					},
				},
			},

			resourceTimeRanges: weekendTimeRanges,

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
							renderer: ({ record }) => {
								return {
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
								}
							},
						},
					],
				},
			],
			project,
			eventRenderer: ({ eventRecord }) => {
				const originalName = eventRecord.name

				const startDate = new Date(eventRecord.startDate)
				const endDate = new Date(eventRecord.endDate)

				const durationDays = DateHelper.diff(startDate, endDate, 'day')

				const actualEnDate = DateHelper.add(endDate, -1, 'day')

				let title = 0
				const tempStartDate = new Date(startDate)

				while (tempStartDate <= actualEnDate) {
					const day = tempStartDate.getDay()
					if (day !== 0 && day !== 6) {
						title += 1
					}

					tempStartDate.setDate(tempStartDate.getDate() + 1)
				}

				if (eventRecord.parentId && eventRecord.parentId !== 'events-rootNode') {
					// Render subtasks. Their text color should be white.
					return {
						tag: 'div',
						className: 'b-sch-event-content',
						style: 'display: flex; justify-content: center; align-items: center; width: 100%; height: 100%;', // Center content
						children: [
							{
								tag: 'div',
								className: 'b-sch-event-name',
								text: originalName, // Display the subtask's actual name
								style:
									'flex-grow: 1; text-align: center; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; color: white;',
							},
						],
					}
				}

				let parentNameColor = 'white'
				if (eventRecord.children && eventRecord.children.length > 0) {
					parentNameColor = '#666' // Color if it HAS subtasks
				}

				return {
					tag: 'div',
					className: 'b-sch-event-content',
					style: 'display: flex; justify-content: space-between; align-items: center; width: 100%;',
					children: [
						{
							tag: 'div',
							className: 'b-sch-event-name',
							text: originalName,
							// Apply the conditionally determined color here
							style: `  font-size: ${
								durationDays - 1 < 2 ? '11px' : '1em'
							}; flex-grow: 1; text-align: left; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; color: ${parentNameColor};`,
						},
						{
							tag: 'div',
							className: 'event-duration-info',
							style: `flex-shrink: 0; margin-left: ${durationDays - 1 <= 2 ? '10px' : '30px'}; font-size: ${
								durationDays - 1 < 2 ? '6.2px' : '0.8em'
							}; opacity: 1; color: black; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"; display: flex; align-items: center; justify-content: flex-end;`,
							children: [
								{
									tag: 'span', // First part of the text
									text: `[ ${title} Mandays `, // Using 'title' (calculated workdays)
								},
								{
									tag: 'i', // The Font Awesome icon
									className: 'b-fa b-fa-arrow-right',
									style: 'margin: 0 6px; color: black;', // Icon color remains black
								},
								{
									tag: 'span', // Second part of the text
									text: `${durationDays} Work Days ]`, // Using 'durationDays' (eventRecord.duration)
								},
							],
						},
					],
				}
			},

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

		scheduler.on('eventEditCancel', () => {
			const subtasksContainer = scheduler.features.eventEdit.editor.widgetMap.subtasksContainer
			if (subtasksContainer) subtasksContainer.removeAll(true)
		})

		scheduler.on('beforePresetChange', () => {
			// Step 1: Capture center of the current viewport
			currentCenterDate = scheduler.viewportCenterDate

			console.log('ViewPresetNoChanged', currentCenterDate)
		})

		// copy paste code

		console.log('All dependencies in store:', scheduler.startDate)
		scheduler.dependencyStore.forEach((dep) => {
			console.log(`From Event ID ${dep.fromEvent} → To Event ID ${dep.toEvent}`)
		})

		scheduler.dependencyStore.on('beforeAdd', ({ records }) => {
			records.forEach((dep) => {
				const fromTask = scheduler.eventStore.getById(dep.from)
				const toTask = scheduler.eventStore.getById(dep.to)

				if (fromTask && toTask) {
					fromTask._originalEnd = fromTask.endDate
					toTask._originalStart = toTask.startDate

					console.log(
						'[Before Add - Safe] Captured:',
						fromTask.name,
						'end →',
						fromTask._originalEnd,
						'|',
						toTask.name,
						'start →',
						toTask._originalStart
					)
				} else {
					console.warn('❗Could not find tasks during beforeAdd:', dep.from, dep.to)
				}
			})
		})

		scheduler.dependencyStore.on('add', ({ records }) => {
			const sourceEvent = records?.[0]?.data?.fromEvent
			const destinationEvent = records?.[0]?.data?.toEvent

			const sourceTask = scheduler.eventStore.getById(sourceEvent)
			const destinationTask = scheduler.eventStore.getById(destinationEvent)

			console.log('Dependency added: 0', sourceTask?.endDate, destinationTask?.startDate)

			records.forEach((dep) => {
				const fromTask = scheduler.eventStore.getById(dep.from)
				const toTask = scheduler.eventStore.getById(dep.to)

				const fromEnd = fromTask._originalEnd || fromTask.endDate
				const toStart = toTask._originalStart || toTask.startDate

				const lag = DateHelper.diff(fromEnd, toStart, dep.lagUnit)

				console.log('✅ Final lag calculation:', lag)

				console.log('Dependency added: 1', fromEnd, toStart)
				// Here, originalData is often already in string format, but it's safer
				// to use DateHelper to ensure consistent formatting to YYYY-MM-DD
				const from_date_for_backend = DateHelper.format(dep.fromEvent.startDate, 'YYYY-MM-DD')
				const to_date_for_backend = DateHelper.format(dep.toEvent.startDate, 'YYYY-MM-DD') // Assuming toEvent start date is used for lag calculation reference

				const lagUnitMap = {
					day: 'd',
					hour: 'h',
					minute: 'm',
				}
				console.log(
					'New dependency created: from',
					dep.fromEvent,
					' to  → ',
					dep.toEvent,
					from_date_for_backend,
					to_date_for_backend
				)
				console.log('Dependency added: 2', dep.fromEvent.endDate, dep.toEvent.startDate)

				dep.set('lag', lag)

				createTaskDependency({
					from_task_id: dep.fromEvent.data.id,
					to_task_id: dep.toEvent.data.id,
					project_id: id,
					type: dependencyTypeMap[dep.type] || dependencyTypeMap[2],
					// Ensure lag calculation uses the correctly formatted dates if needed by your backend
					// Or use Bryntum's internal Date objects for the diff, then format the result
					lag,
					lag_unit: lagUnitMap[dep.lagUnit] || dep.lagUnit,
					active: dep.active || true,
				}).then(async (res) => {
					if (res.error === null) {
						const realId = res.data?.[0]?.id
						const days = DateHelper.diff(dep.fromEvent.endDate, dep.toEvent.startDate, dep.lagUnit)

						console.log('Backend dependency created:', days, sourceTask, destinationTask)

						dep.setLag(lag, dep.lagUnit)

						// dep.id('id', realId)

						// dep.set('lag', days)
						dep.set('id', realId)

						newlyCreatedDeps.add(dep.internalId)

						// ✅ You can still store real ID mapping
						tempDep.set(dep?._internalId, res?.data?.[0]?.id || realId)

						await scheduler.project.propagateAsync()

						console.log('dependency created successfully ', res)
					} else {
						console.log('Error creating task:', res.error.message)
					}
				})
			})
		})

		scheduler.dependencyStore.on('update', ({ record, changes }) => {
			/* eslint-disable no-useless-return, no-else-return */
			if (newlyCreatedDeps.has(record.internalId)) {
				console.log('[SKIP] Fresh dependency update from creation:', record.id)
				setTimeout(() => {
					newlyCreatedDeps.delete(record.internalId)
				}, 0)
				return
			} else if (changes && Object.keys(changes).length > 0) {
				console.log('[SKIP]', newlyCreatedDeps, record.internalId)
				// Prepare the update payload for all changed fields
				const updatePayload = { id: record.id }
				console.log('updatePayload', updatePayload)

				console.log('Update Dependency updated:', changes, record)

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
								const fromTaskEndDate = fromEndDate // 30 -> 29

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
			} else {
				console.log('')
			}
			/* eslint-disable no-useless-return, no-else-return */
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

		scheduler.on(
			'beforePaste',
			async ({ pastedEventRecords, eventRecords, assignmentRecords, resourceRecord, entityName, context }) => {
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

				console.log('COPYPASTE', resourceRecord.id, currentResouceID, eventRecords?.resourceId)

				const projectDiagramID = resourceRecord?.data?.tasksWithoutTeam?.find(
					(item) => item?.project_diagram_id
				)?.project_diagram_id

				await scheduler.project.commitAsync()

				/* eslint-disable no-await-in-loop */
				for (let i = 0; i < eventRecords.length; i += 1) {
					const eventRecord = eventRecords[i]

					eventRecord.set('resourceId', resourceRecord.id)
				}
			}
		)

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

				console.log('COPYPASTE', resourceRecord.id, currentResouceID, eventRecords?.resourceId)

				const projectDiagramID = resourceRecord?.data?.tasksWithoutTeam?.find(
					(item) => item?.project_diagram_id
				)?.project_diagram_id

				await scheduler.project.commitAsync()

				/* eslint-disable no-await-in-loop */
				for (let i = 0; i < eventRecords.length; i += 1) {
					const eventRecord = eventRecords[i]

					const hasChildren = eventRecord?.data?.children?.length > 0

					const startdate = DateHelper.format(eventRecord?.startDate, 'YYYY-MM-DD')

					const endDate = DateHelper.format(DateHelper.add(eventRecord?.endDate, -1, 'd'), 'YYYY-MM-DD')

					const formattedSubtaskData = {
						title: eventRecord?.data?.name,
						start_date: DateHelper.format(eventRecord?.startDate, 'YYYY-MM-DD'),
						end_date: DateHelper.format(DateHelper.add(eventRecord?.endDate, -1, 'd'), 'YYYY-MM-DD'),
						team: currentTeam,
						project: id,
						project_diagram_id: projectDiagramID,
						task_group_id: taskGroupID,
					}

					eventRecord.set('resourceId', currentResouceID)

					console.log('BEFORE', eventRecord, formattedSubtaskData, eventRecord.data.startDate, eventRecord.data.endDate)

					try {
						const res = await createNewTasks(formattedSubtaskData)
						const backendNewSubtask = res?.data?.[0]

						if (!hasChildren) {
							const bryntumReadytask = {
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
								// manuallyScheduled: true,
							}
							console.log('My New Event', res, bryntumReadytask)

							scheduler.eventStore.add(bryntumReadytask)

							eventRecord.set('id', backendNewSubtask.id)

							console.log('BEFORE after', bryntumReadytask)

							await scheduler.project.commitAsync()

							// eventRecord.set('id', backendNewSubtask.id)

							eventRecord.set('resourceId', currentResouceID)

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
								eventRecord.set('id', backendNewSubtask.id)
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

		scheduler.on('presetChange', ({ preset }) => {
			if (preset.id === 'monthAndYear') {
				scheduler.setTimeSpan(new Date(2025, 0, 1))
			}
		})

		SetTeampScheduler(scheduler)

		// // ✅ Proper async commit block
		;(async () => {
			await scheduler.project.commitAsync()
		})()

		return () => scheduler.destroy()
	}, [events, resources])

	console.log('SchedulerRed', schedulerRef)

	if (isLoading) return <div>Loading...</div>
	if (error) return <div>Error loading tasks</div>

	return (
		<>
			<Stack
				direction={'row'}
				justifyContent={'flex-end'}
				marginTop={'18px'}
				padding={'3px'}
				alignItems={'center'}
				spacing={2}
			>
				<Typography variant="body1" fontWeight="bold">
					Show SubTasks
				</Typography>
				<CompactSwitch
					checked={showSubTasks}
					onChange={() => {
						scheduler?.suspendRefresh()
						SetshowSubTasks(!showSubTasks)
						scheduler?.resumeRefresh()
						if (scheduler) {
							const currentCenterDate = scheduler?.viewportCenterDate
							const day = currentCenterDate?.getDate()
							const year = currentCenterDate?.getFullYear()
							const month = currentCenterDate?.getMonth() // 0-based
							scheduler.startDate = new Date(year, month, day)
							scheduler.setTimeSpan(new Date(year, month, day))
							console.log('ToggleButton Clicked', typeof scheduler.scrollToDate)
						}
					}}
				/>
			</Stack>

			<div ref={schedulerRef} style={{ height: '500px', width: '100%', marginTop: '15px' }} />

			{openSubtaskPopup && (
				<ManageSubtasksDialog
					open={openSubtaskPopup}
					onClose={() => setOpenSubtaskPopup(false)}
					eventRecord={currentEventRecord}
					scheduler={tempScheduler}
					id={id}
					lockWeekend={lockWeekend}
				/>
			)}
		</>
	)
}

export default Calender2
