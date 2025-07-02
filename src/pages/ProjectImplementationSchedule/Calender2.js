import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useQueryClient } from 'react-query'
import {
	Scheduler,
	SchedulerPro,
	ResourceStore,
	DependencyStore,
	DateHelper,
	ProjectModel,
	DependencyTab,
	PredecessorsTab,
	SuccessorsTab,
	DependencyEdit,
	DependencyMenu,
	Widgets,
} from '@bryntum/schedulerpro'
import { Button as MuiButton, Stack } from '@mui/material'
import Iconify from 'components/Iconify'
import moment, { duration } from 'moment-timezone'

import './Calender2.css'
import '@bryntum/schedulerpro/schedulerpro.stockholm.css'

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
} from './SchedulerConfig'
import { filter, forEach } from 'lodash'
import FilterPopup from 'components/FilterPopUp'
import { getProjectDiagram } from 'supabase/project_diagram'
import { da } from 'date-fns/locale'

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
	const [allWorkTypes, SetAllWorkTypes] = useState([
		'Connection',
		'Installation',
		'Office Work',
		'Completion Testing',
		'Metal Fittings Installation',
		'Auxiliary Construction',
	])

	const [istTaskUpdated, SetIsTaskUpdated] = useState(false)
	const [isResourceBuildingLoading, setIsResourceBuildingLoading] = useState(true)
	const [teamsDetails, SetTeamDetails] = useState([])

	let originalStartDate = null

	let orignalEndDate = null

	const schedulerRef = useRef(null)
	const { id } = useParams()
	console.log('myID', id)
	let suppressNextEditor = false

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
		const nestedTasks = data.tasks.data.filter((task) => task.parent_id !== null)
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
					manuallyScheduled: true,
					expanded: false,
					leaf: !hasChildren,
					isTask: true,
					team,
					task_group_id,
					eventColor,
					...(hasChildren && {
						children: task.children.map((child) => {
							const childId = child.id || `child-${id}-${Math.random().toString(36).substr(2, 9)}` // Unique ID for child
							const childStartDate = child.start_date ? getISODateString(child.start_date) : getISODateString(startDate)
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
						manuallyScheduled: true,
						expanded: false,
						leaf: !hasChildren,
						isTask: true,
						team,
						task_group_id,
						isNoTeamIndividualTask: true,
						eventColor,
						...(hasChildren && {
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
	}, [taskGroup])

	console.log('events', taskGroup)

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
			autoAdjustTimeAxis: true,
			viewPreset: customMonthViewPreset,
			multiEventSelect: true,
			tickSize: 100,
			rowHeight: 100,
			endDateIsInclusive: true,
			eventLayout: 'stack',
			dependenciesFeature: true,
			dependencyEditFeature: true,
			ganttProps,
			features: {
				stripe: true,
				eventEdit: {
					autoEdit: false,
				},
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
				...features,

				eventMenu: {
					processItems({ items, eventRecord }) {
						const originalEventRecord = eventRecord
						items.addCustomSubtask = {
							text: 'Add SubTask',
							icon: 'b-fa b-fa-plus',

							async onItem({ eventRecord }) {
								// 1. Find top-level parent
								let topParent = eventRecord
								while (topParent.parent) {
									topParent = topParent.parent
								}

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

									subtasks.push({
										title: missingSubTask,
										team: eventRecord?.data?.team,
										start_date: newSubtaskStartDate.format('YYYY-MM-DD'),
										end_date: newSubtaskEndDate.format('YYYY-MM-DD'),
										notes: '',
										task_group_id: eventRecord?.data?.task_group_id,
										project: id,
										parent_task: parentId,
									})

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

										console.log('MyNewTask200', eventRecord?.isPhantom)

										scheduler.resumeEvents()
										scheduler.resumeRefresh()

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

										const newSubtaskStartDate = previousEndDate
										const newSubtaskEndDate = newSubtaskStartDate.clone().add(1, 'day')

										subtasks.push({
											title: missingSubTask,
											team: eventRecord?.data?.team,
											start_date: newSubtaskStartDate.format('YYYY-MM-DD'),
											end_date: newSubtaskEndDate.format('YYYY-MM-DD'),
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
				const durationDays = eventRecord.duration
				const originalName = eventRecord.name

				const startDate = new Date(eventRecord.startDate)
				const endDate = new Date(eventRecord.endDate)

				const actualEnDate = DateHelper.add(endDate, -1, 'day')

				let title = 0
				const tempStartDate = new Date(startDate)

				while (tempStartDate <= actualEnDate) {
					const day = tempStartDate.getDay()
					if (day !== 0 && day !== 6) {
						title += 1
					}

					tempStartDate.setDate(tempStartDate.getDate() + 1)

					console.log('Event Debug Info2.0', tempStartDate, endDate, title)
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
									text: `[ ${title} Task Period `, // Using 'title' (calculated workdays)
								},
								{
									tag: 'i', // The Font Awesome icon
									className: 'b-fa b-fa-arrow-right',
									style: 'margin: 0 6px; color: black;', // Icon color remains black
								},
								{
									tag: 'span', // Second part of the text
									text: `${durationDays} Mandays ]`, // Using 'durationDays' (eventRecord.duration)
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
				beforeEventEditShow({ editor, eventRecord }) {
					const subtasksContainer = editor.widgetMap.subtasksContainer

					console.log('beforeeventEditShow', eventRecord)

					let subTaskToBeDeleted = []

					if (subtasksContainer) {
						subtasksContainer.items.forEach((item) => item.destroy())
						subtasksContainer.removeAll()
					}
					subtasksContainer?.removeAll()

					console.log('OP', eventRecord?.children)
					console.log(
						'TabPanel items:',
						editor.tabPanel?.items.map((tab) => tab.title || tab.type)
					)

					let subtasksGridInstance

					const createSubtasksGrid = (initialData = []) => {
						const noSubtasksLabel = subtasksContainer?.widgetMap?.noSubtasksLabel

						if (noSubtasksLabel) {
							noSubtasksLabel.destroy()
						}

						return subtasksContainer?.add({
							type: 'grid',
							height: '272px',
							scrollable: true,

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

										console.log('gridWidget', gridWidget, labelWidget)

										if (!childToUpdate) {
											console.warn('Could not find matching subtask in eventRecord.children for ID:', id)
											return
										}

										if (childToUpdate.isPhantom) {
											console.warn(' The subtask is a phantom (unsaved). May cause duplication on save.')
										}

										childToUpdate.set('name', newName)

										childToUpdate.set('yesModified', true)

										if (changes?.startDate) {
											const startDate = changes?.startDate?.value

											childToUpdate.set('startDate', startDate)

											childToUpdate.set('yesModified', true)

											const currentStartData = new Date(startDate)

											const currentEndDate = new Date(childToUpdate?.endDate)

											const diffinMins = currentEndDate - currentStartData

											const diffinDays = diffinMins / (1000 * 60 * 60 * 24)

											childToUpdate.set('duration', diffinDays)

											record.set('duration', diffinDays)

											console.log('changesStartDate', childToUpdate, diffinDays)
										}
										if (changes?.endDate) {
											const endDate = changes?.endDate?.value
											childToUpdate.set('endDate', endDate)

											childToUpdate.set('yesModified', true)

											const currentStartData = new Date(childToUpdate?.startDate)

											const currentEndDate = new Date(endDate)

											const diffinMins = currentEndDate - currentStartData

											const diffinDays = diffinMins / (1000 * 60 * 60 * 24)

											childToUpdate.set('duration', diffinDays)

											record.set('duration', diffinDays)
										}

										if (changes?.completed?.value) {
											subTaskToBeDeleted.push(record?.data?.id)

											console.log('MyChanges ', subTaskToBeDeleted)
											if (labelWidget) {
												if (subTaskToBeDeleted.length > 0) {
													labelWidget.show()
													labelWidget.html = `Items selected: ${subTaskToBeDeleted.length}`
													deleteButtonWidget.show()
												} else {
													labelWidget.hide()
													deleteButtonWidget?.hide()
												}
											}
										} else {
											const filteredIDs = subTaskToBeDeleted?.filter((id) => id !== record?.data?.id)

											subTaskToBeDeleted = filteredIDs
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
										}
									},
								},
							},

							columns: [
								{
									type: 'check',
									text: 'Done',
									field: 'completed',
									width: 70,
									editor: true,
									align: 'center',
								},
								{ text: 'ID', field: 'id', flex: 0.5 },
								{ text: 'Name', field: 'name', flex: 1.5 },
								{ text: 'Start Date', field: 'startDate', type: 'date', format: 'YYYY-MM-DD', flex: 1 },
								{ text: 'End Date', field: 'endDate', type: 'date', format: 'YYYY-MM-DD', flex: 1 },
								{ text: 'Duration', field: 'duration', flex: 0.5, editable: true },
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
											console.log('Deleted', res, eventRecord)

											subTaskToBeDeleted.forEach((id) => {
												const index = eventRecord.children.findIndex((child) => child.id === id)
												if (index !== -1) {
													eventRecord.children.splice(index, 1)
												}
											})

											eventRecord?.children?.forEach((element) => {
												if (!subTaskToBeDeleted?.includes(element?.id)) {
													element?.set('yesModified', true)
												}
											})

											subTaskToBeDeleted = []

											// Refresh the grid if needed
											const gridWidget = subtasksContainer?.widgetMap?.subtasksGridWidget
											gridWidget?.store?.loadData(eventRecord.children)

											// Hide label and button again
											const labelWidget = gridWidget?.widgetMap?.deleteStatusLabel
											const deleteButtonWidget = gridWidget?.widgetMap?.deleteButton

											labelWidget?.hide()
											deleteButtonWidget?.hide()
										} catch (error) {
											console.error('Delete failed:', error)
										}
									},
								},
							],

							ref: 'subtasksGridWidget',
						})
					}

					if (eventRecord.children?.length) {
						const subtaskData = eventRecord.children.map((child) => child.data)
						subtasksGridInstance = createSubtasksGrid(subtaskData) // Capture the grid instance
					} else {
						subtasksContainer?.add({
							type: 'label',
							html: 'No subtasks',
							ref: 'noSubtasksLabel',
						})
					}

					subtasksContainer?.add({
						type: 'button',
						text: 'Add New Subtask',
						cls: 'b-blue b-raised',
						margin: '1em 0',
						onClick: async () => {
							const defaultSubTaskNames = ['Line', 'Trim', 'Assemble', 'Galvanize', 'Install']
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

							//  Line - 1 Trim - 2  Assemble -2

							let missingSubTask = null
							let minCount = Infinity

							defaultSubTaskNames.forEach((name) => {
								if (subtaskCounts[name] < minCount) {
									minCount = subtaskCounts[name]
									missingSubTask = name // Line
								}
							})
							const parentID = eventRecord?.id
							const { team, task_group_id, id } = eventRecord?.data

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

								const newSubtaskStartDate = previousEndDate
								const newSubtaskEndDate = newSubtaskStartDate.clone().add(1, 'day')

								const newSubtaskData = {
									id: Math.floor(Date.now() / 1000) + Math.floor(Math.random() * 1000),
									name: missingSubTask,
									startDate: newSubtaskStartDate.toDate(),
									endDate: newSubtaskEndDate.toDate(),
									duration: 1,
									team,
									project: id,
									parent_task: parentID,
									task_group_id,
								}

								const EventModel = scheduler.eventStore.modelClass
								const newTaskModel = new EventModel(newSubtaskData)
								eventRecord.appendChild(newTaskModel)

								if (subtasksGridInstance?.store) {
									subtasksGridInstance.store.add(newSubtaskData)
									subtasksGridInstance.scrollRowIntoView(subtasksGridInstance.store.last)
								}
								if (!subtasksGridInstance) {
									subtasksGridInstance = createSubtasksGrid([newSubtaskData])
								} else {
									subtasksGridInstance.store.add(newSubtaskData)
									subtasksGridInstance.scrollRowIntoView(subtasksGridInstance.store.last)
								}

								console.log(' Added missing subtask:', missingSubTask)
							} else {
								const currentCount = alreadyExistingSubTasks.length
								const bryntumStartDate = eventRecord.startDate
								const bryntumEndDate = eventRecord.endDate
								const totalAllowed = DateHelper.diff(bryntumStartDate, bryntumEndDate, 'day')
								const nextIndex = currentCount % totalAllowed
								const nextStartDate = DateHelper.add(bryntumStartDate, nextIndex, 'day')
								const nextEndDate = DateHelper.add(nextStartDate, 1, 'day')
								const nextTitle = defaultSubTaskNames[currentCount % defaultSubTaskNames.length]

								const newSubtaskData = {
									id: Math.floor(Date.now() / 1000) + Math.floor(Math.random() * 1000),
									name: nextTitle,
									startDate: nextStartDate,
									endDate: nextEndDate,
									duration: 1,
									team,
									project: id,
									parent_task: parentID,
									task_group_id,
								}

								const EventModel = scheduler.eventStore.modelClass
								const newTaskModel = new EventModel(newSubtaskData)
								eventRecord.appendChild(newTaskModel)

								if (subtasksGridInstance?.store) {
									subtasksGridInstance.store.add(newSubtaskData)
									subtasksGridInstance.scrollRowIntoView(subtasksGridInstance.store.last)
								}

								console.log(' Added new default-cycle subtask:', nextTitle)
							}
						},
					})
					return true
				},
				eventAdd: async ({ records }) => {
					console.log('Add NewEVent CLicked', records)
				},
			},
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
		// scheduler.dependencyStore.on('update', ({ record, changes }) => {
		// 	console.log('Dependency updated:', record)
		// 	console.log('Changes:', changes)
		// })
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
				const formattedSubtaskData = {
					title: subtask.name,
					start_date: DateHelper.format(subtask.startDate, 'YYYY-MM-DD'),
					end_date: DateHelper.format(subtask.endDate, 'YYYY-MM-DD'),
					team: subtask.team,
					project: id,
					parent_task: parentEventRecord?.id,
					task_group_id: subtask?.task_group_id || parentEventRecord?.data?.task_group_id,
				}

				console.log('Saving subtask:', formattedSubtaskData)

				if (subtask.get('yesModified')) {
					try {
						const res = await updateFn(formattedSubtaskData, subtask?.id)
						if (res.error === null && res.data?.[0]?.id) {
							console.log(' Subtask created: yes modified', res)
							subtask.id = res.data[0].id
							subtask.commit()
							myQueryClient.invalidateQueries(['projectData', id])
						} else {
							console.error(' Create error:', res.error?.message || 'No data')
							subtask.remove()
						}
					} catch (err) {
						console.error(' Create exception:', err)
						subtask.remove()
					}
				} else if (subtask.isModified) {
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
						}

						parentEventRecord.appendChild(bryntumReadySubtask)
						// await scheduler.project.commitAsync()
						myQueryClient.invalidateQueries(['projectData', id])
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
			'paste',
			async ({ pastedEventRecords, eventRecords, assignmentRecords, resourceRecord, entityName }) => {
				const copiedData = eventRecords?.[0]

				await scheduler.project.commitAsync()

				let taskGroupID = null

				if (resourceRecord?.name === 'Connection') {
					taskGroupID = 3
				} else if (resourceRecord?.name === 'Completion Testing') {
					taskGroupID = 4
				} else if (resourceRecord?.name === 'Metal Fittings Installation') {
					taskGroupID = 1
				} else if (resourceRecord?.name === 'Auxiliary Construction') {
					taskGroupID = 6
				} else if (resourceRecord?.name === 'Office Work') {
					taskGroupID = 5
				} else {
					taskGroupID = 2
				}

				console.log('COPYPASTE', resourceRecord?.name, taskGroupID)

				const projectDiagramID = resourceRecord?.data?.tasksWithoutTeam?.find(
					(item) => item?.project_diagram_id
				)?.project_diagram_id

				/* eslint-disable no-await-in-loop */
				for (let i = 0; i < eventRecords.length; i += 1) {
					const eventRecord = eventRecords[i]

					// const resourceId = eventRecord?.data?.resourceId

					const resourceId = resourceRecord?.id
					const currentTeam = teamsDetails?.find((item) => item?.name === resourceId)?.teamNumber

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
								task_group_id: backendNewSubtask.task_group_id,
								project: backendNewSubtask.project,
								parentId: backendNewSubtask.parent_task,
								resourceId,
								isPastedEvent: true,
							}
							scheduler.eventStore.add(bryntumReadytask)
							console.log('Pasted single event', bryntumReadytask)
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
								return createNewTasks(subTaskData)
							})

							await Promise.all(childPromises)
							console.log('Pasted parent with children:', backendNewSubtask.title, childTasks.length)
						}
					} catch (error) {
						console.error('Error pasting event:', error)
					}
				}
			}
		)

		// scheduler dependency code

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

		// // ✅ Proper async commit block
		;(async () => {
			await scheduler.project.commitAsync()
		})()

		return () => scheduler.destroy()
	}, [events, resources])

	console.log('teamsDetails', events, resources)

	if (isLoading) return <div>Loading...</div>
	if (error) return <div>Error loading tasks</div>

	return (
		<>
			<div ref={schedulerRef} style={{ height: '500px', width: '100%', marginTop: '15px' }} />
		</>
	)
}

export default Calender2
