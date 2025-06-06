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
	const [teamsDetails, SetTeamDetails] = useState(new Set())

	const schedulerRef = useRef(null)
	const { id } = useParams()
	console.log('myID', id)

	const myQueryClient = useQueryClient()

	const { data, isLoading, error } = useQuery(['projectData', id], async () => {
		const [tasks, dependencies] = await Promise.all([listAllTasksByProject2(id), getAllTaskDependencyByProject(id)])

		console.log('data.tasks reference:', tasks)

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

	// Group tasks as before
	// const groupedTasks = React.useMemo(() => {
	// 	if (!data?.tasks) return null

	// 	const task_groups = {
	// 		1: 'metal_fittings',
	// 		2: 'installations',
	// 		3: 'connections',
	// 		4: 'completion_test',
	// 		5: 'office_work',
	// 		6: 'auxiliary_construction',
	// 	}
	// 	const grouped = {
	// 		metal_fittings: [],
	// 		installations: [],
	// 		connections: [],
	// 		completion_test: [],
	// 		office_work: [],
	// 		auxiliary_construction: [],
	// 	}

	// 	// Group nested tasks on the basis of parentId
	// 	const nestedTasks = data.tasks.data.filter((task) => task.parent_id !== null)
	// 	const nestedTaskGroupedOnParentId = {}

	// 	nestedTasks.forEach((task) => {
	// 		const parentId = task.parent_task
	// 		if (parentId) {
	// 			if (!nestedTaskGroupedOnParentId[parentId]) {
	// 				nestedTaskGroupedOnParentId[parentId] = []
	// 			}
	// 			nestedTaskGroupedOnParentId[parentId].push(task)
	// 		}
	// 	})

	// 	data.tasks.data?.forEach((task) => {
	// 		const groupId = task.task_group_id
	// 		if (!task.parent_task && groupId !== null && task_groups[groupId]) {
	// 			grouped[task_groups[groupId]]?.push({
	// 				...task,
	// 				children: nestedTaskGroupedOnParentId[task.id] || [],
	// 			})
	// 		}
	// 	})
	// 	console.log('yyy', data)
	// 	SetTaskGroup(grouped)
	// 	SetAllTaskGroup(grouped)
	// 	return grouped
	// }, [data?.tasks])

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
					relatedTasks.forEach((task) => {
						if (task.team) uniqueTeams.add(task.team)
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
						} catch (error) {
							console.error(`Failed to get details for team ${teamNumber}`, error)
							expandedResources.push({
								id: uniqueId,
								name: workType,
								width: 100,
								workTeam: `Team ${teamNumber}`,
							})
						}
					})

					const taskWithNoTeamID = relatedTasks?.filter((item) => item?.team === null)

					for (let i = 0; i < taskWithNoTeamID?.length; i += 1) {
						const uniqueId = `${resourceId} -  ${i + 1}`
						expandedResources.push({
							id: uniqueId,
							name: workType,
							width: 100,
							workTeam: ``,
						})
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
				console.log('gg', expandedResources)
			})

			await Promise.all(promises)
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

		return [
			...connections?.map((connection, index) => {
				const noTeamTasks = connections.filter((c) => !c.team)
				const hasTeam = connection?.team !== null && connection?.team !== undefined
				let resourceId

				if (hasTeam) {
					resourceId = `connections-${connection.team}`
				} else {
					const noTeamIndex = noTeamTasks.indexOf(connection)
					resourceId = `connections -  ${noTeamIndex + 1}`
				}
				const event = {
					id: connection.id || `connection-${index + 1}`,
					resourceId,
					startDate: connection.start_date ? getISODateString(connection.start_date) : getISODateString(new Date()),
					endDate: connection.end_date
						? getISODateString(connection.end_date)
						: (() => {
								const today = new Date()
								today.setDate(today.getDate() + 3)
								return getISODateString(today)
						  })(),
					allDay: true,
					duration: 5,
					durationunit: 'day',
					name: connection.title,
					manuallyScheduled: true,
					expanded: true,
					leaf: false,
					isTask: true,
					team: connection?.team,
					task_group_id: connection?.task_group_id,
				}

				if (connection.children && connection.children.length > 0) {
					event.children = connection.children.map((child) => ({
						id: child.id || `child-${child.id}`,
						resourceId,
						startDate: child.start_date ? getISODateString(child.start_date) : getISODateString(new Date()),
						endDate: child.end_date
							? getISODateString(child.end_date)
							: (() => {
									const today = new Date()
									return getISODateString(today)
							  })(),
						allDay: true,
						name: child.title,
						leaf: true,
						eventColor: 'red',
					}))
				}

				return event
			}),
			...installations?.map((installation, index) => {
				const noTeamTasks = installations?.filter((c) => !c.team)
				const hasTeam = installation?.team !== null && installation?.team !== undefined
				let resourceId

				if (hasTeam) {
					resourceId = `installations-${installation.team}`
				} else {
					const noTeamIndex = noTeamTasks.indexOf(installation)
					resourceId = `installations -  ${noTeamIndex + 1}`
				}
				const event = {
					id: installation.id,
					resourceId,
					startDate: installation.start_date ? getISODateString(installation.start_date) : getISODateString(new Date()),
					endDate: installation.end_date
						? getISODateString(installation.end_date)
						: (() => {
								const today = new Date()
								today.setDate(today.getDate() + 3)
								return getISODateString(today) // Use calculated end date
						  })(),
					allDay: true,
					name: installation.title,
					manuallyScheduled: true,
					expanded: true,
					leaf: false,
					duration: 5,
					durationunit: 'day',
					team: installation?.team,
					task_group_id: installation?.task_group_id,
				}
				if (installation.children && installation.children.length > 0) {
					event.children = installation.children.map((child) => ({
						id: child.id || `child-${child.id}`,
						resourceId,
						startDate: child.start_date ? getISODateString(child.start_date) : getISODateString(new Date()),
						endDate: child.end_date
							? getISODateString(child.end_date)
							: (() => {
									const today = new Date()

									return getISODateString(today) // Default end date is today's date
							  })(),
						allDay: true,
						name: child.title,
						leaf: true,
						eventColor: 'blue',
					}))
				}
				console.log('installationEvent', event)
				return event
			}),
			...metal_fittings?.map((metal_fitting, index) => {
				const noTeamTasks = metal_fittings.filter((c) => !c.team)
				const hasTeam = metal_fitting?.team !== null && metal_fitting?.team !== undefined
				let resourceId

				if (hasTeam) {
					resourceId = `metal_fittings-${metal_fitting.team}`
				} else {
					const noTeamIndex = noTeamTasks.indexOf(metal_fitting)
					resourceId = `metal_fittings -  ${noTeamIndex + 1}`
				}
				const event = {
					id: metal_fitting.id || `metal_fitting-${index + 1}`,
					resourceId,
					startDate: metal_fitting.start_date
						? getISODateString(metal_fitting.start_date)
						: getISODateString(new Date()),
					endDate: metal_fitting.end_date
						? getISODateString(metal_fitting.end_date)
						: (() => {
								const today = new Date()
								today.setDate(today.getDate() + 3)
								return getISODateString(today) // Use calculated end date
						  })(),
					allDay: true,
					name: metal_fitting.title,
					manuallyScheduled: true,
					expanded: true,
					leaf: false,
					duration: 5,
					durationunit: 'day',
					team: metal_fitting?.team,
					task_group_id: metal_fitting?.task_group_id,
				}
				if (metal_fitting.children && metal_fitting.children.length > 0) {
					event.children = metal_fitting.children.map((child) => ({
						id: child.id || `child-${child.id}`,
						resourceId,
						startDate: child.start_date ? getISODateString(child.start_date) : getISODateString(new Date()),
						endDate: child.end_date
							? getISODateString(child.end_date)
							: (() => {
									const today = new Date()

									return getISODateString(today) // Default end date is today's date
							  })(),
						allDay: true,
						name: child.title,
						leaf: true,
						eventColor: 'green',
					}))
				}
				return event
			}),
			...completion_test?.map((completion_tests, index) => {
				const noTeamTasks = completion_test?.filter((c) => !c.team)
				const hasTeam = completion_tests?.team !== null && completion_tests?.team !== undefined
				let resourceId

				if (hasTeam) {
					resourceId = `completion_test-${completion_tests.team}`
				} else {
					const noTeamIndex = noTeamTasks.indexOf(completion_tests)
					resourceId = `completion_test -  ${noTeamIndex + 1}`
				}
				const event = {
					id: completion_tests.id || `completion_test-${index + 1}`,
					resourceId,
					startDate: completion_tests.start_date
						? getISODateString(completion_tests.start_date)
						: getISODateString(new Date()),
					endDate: completion_tests.end_date
						? getISODateString(completion_tests.end_date)
						: (() => {
								const today = new Date()
								today.setDate(today.getDate() + 3)
								return getISODateString(today) // Use calculated end date
						  })(),
					allDay: true,
					name: completion_tests.title || `Completion Test + ${index + 1}`,
					manuallyScheduled: true,
					expanded: true,
					leaf: false,
					duration: 5,
					durationunit: 'day',
					team: completion_tests?.team,
					task_group_id: completion_tests?.task_group_id,
				}
				if (completion_tests.children && completion_tests.children.length > 0) {
					event.children = completion_tests.children.map((child) => ({
						id: child.id || `child-${child.id}`,
						resourceId,
						startDate: child.start_date ? getISODateString(child.start_date) : getISODateString(new Date()),
						endDate: child.end_date
							? getISODateString(child.end_date)
							: (() => {
									const today = new Date()

									return getISODateString(today) // Default end date is today's date
							  })(),
						allDay: true,
						name: child.title,
						leaf: true,
						eventColor: 'green',
					}))
				}
				return event
			}),
			...office_work?.map((office_works, index) => {
				const noTeamTasks = office_work?.filter((c) => !c.team)
				const hasTeam = office_works?.team !== null && office_works?.team !== undefined
				let resourceId

				if (hasTeam) {
					resourceId = `office_work-${office_works.team}`
				} else {
					const noTeamIndex = noTeamTasks.indexOf(office_works)
					resourceId = `office_work -  ${noTeamIndex + 1}`
				}
				const event = {
					id: office_works.id || `office_work-${index + 1}`,
					resourceId,
					startDate: office_works.start_date ? getISODateString(office_works.start_date) : getISODateString(new Date()),
					endDate: office_works.end_date
						? getISODateString(office_works.end_date)
						: (() => {
								const today = new Date()
								today.setDate(today.getDate() + 3)
								return getISODateString(today) // Use calculated end date
						  })(),
					allDay: true,
					name: office_works.title || `Office Work + ${index + 1}`,
					manuallyScheduled: true,
					expanded: true,
					leaf: false,
					duration: 5,
					durationunit: 'day',
					team: office_works?.team,
					task_group_id: office_works?.task_group_id,
				}
				if (office_works.children && office_works.children.length > 0) {
					event.children = office_works.children.map((child) => ({
						id: child.id || `child-${child.id}`,
						resourceId,
						startDate: child.start_date ? getISODateString(child.start_date) : getISODateString(new Date()),
						endDate: child.end_date
							? getISODateString(child.end_date)
							: (() => {
									const today = new Date()

									return getISODateString(today) // Default end date is today's date
							  })(),
						allDay: true,
						name: child.title,
						leaf: true,
						eventColor: 'green',
					}))
				}
				return event
			}),
			...auxiliary_construction?.map((auxiliary_constructions, index) => {
				const noTeamTasks = auxiliary_construction?.filter((c) => !c.team)
				const hasTeam = auxiliary_constructions?.team !== null && auxiliary_constructions?.team !== undefined
				let resourceId

				if (hasTeam) {
					resourceId = `auxiliary_construction-${auxiliary_constructions.team}`
				} else {
					const noTeamIndex = noTeamTasks.indexOf(auxiliary_constructions)
					resourceId = `auxiliary_construction -  ${noTeamIndex + 1}`
				}
				const event = {
					id: auxiliary_constructions.id || `auxiliary_construction-${index + 1}`,
					resourceId,
					startDate: auxiliary_constructions.start_date
						? getISODateString(auxiliary_constructions.start_date)
						: getISODateString(new Date()),
					endDate: auxiliary_constructions.end_date
						? getISODateString(auxiliary_constructions.end_date)
						: (() => {
								const today = new Date()
								today.setDate(today.getDate() + 3)
								return getISODateString(today) // Use calculated end date
						  })(),
					allDay: true,
					name: auxiliary_constructions.title || `Auxiliary Construction + ${index + 1}`,
					manuallyScheduled: true,
					expanded: true,
					leaf: false,
					duration: 5,
					durationunit: 'day',
					team: auxiliary_constructions?.team,
					task_group_id: auxiliary_constructions?.task_group_id,
				}
				if (auxiliary_constructions.children && auxiliary_constructions.children.length > 0) {
					event.children = auxiliary_constructions.children.map((child) => ({
						id: child.id || `child-${child.id}`,
						resourceId,
						startDate: child.start_date ? getISODateString(child.start_date) : getISODateString(new Date()),
						endDate: child.end_date
							? getISODateString(child.end_date)
							: (() => {
									const today = new Date()

									return getISODateString(today) // Default end date is today's date
							  })(),
						allDay: true,
						name: child.title,
						leaf: true,
						eventColor: 'green',
					}))
				}
				return event
			}),
		]
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

	useEffect(() => {
		if (!schedulerRef.current) return

		const ganttProps = {
			// other config
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
				...features,
				eventMenu: {
					processItems({ items, eventRecord }) {
						items.addCustomSubtask = {
							text: 'Add SubTask',
							icon: 'b-fa b-fa-plus',

							async onItem({ eventRecord }) {
								// 1. Find top-level parent
								let topParent = eventRecord
								while (topParent.parent) {
									topParent = topParent.parent
								}

								const subtasks = []
								const defaultSubTaskNames = ['Line', 'Assemble', 'Trim', 'Galvanize', 'Install']
								const parentId = eventRecord?.data?.id

								const existingSubtaskNames = eventRecord?.data?.children?.map((item) => item?.name) || []

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
											// Fallback: If the ideal preceding task is also missing,
											// we'll start from the parent's start date, or the latest existing child's end date
											// This is a simpler fallback. For precise placement, you might need to
											// recursively find the closest *existing* predecessor.
											// For now, let's keep it simple as per your request:
											// if the direct predecessor is missing, we use the parent's start date
											// or if there are other children, the latest existing child's end date.
											// However, to ensure correct sequential placement, we should try to find the last *known* preceding task.

											// Let's refine this fallback to find the closest *existing* predecessor
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
											resourceId: eventRecord?.data?.resourceId,
										}

										// Append to parent. Bryntum will handle placement based on dates.
										topParent.appendChild(bryntumReadySubtask)
										await scheduler.project.commitAsync()
										myQueryClient.invalidateQueries(['projectData', id])
									} catch (error) {
										console.log('Error !! Failed to add a subtask', error)
										// You might want to show a more user-friendly error here
									}
								}
							},
						}
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
					console.log('eventDrop', eventRecords)

					console.log('Event drag ended:', eventRecords)
					// Corrected from forEach to standard array forEach
					eventRecords.forEach((event) => {
						// Get Bryntum's Date objects
						const bryntumStartDate = event.data.startDate
						const bryntumEndDate = event.data.endDate // This is the start of the day AFTER the event ends

						// Format start_date to YYYY-MM-DD
						const start_date_for_backend = DateHelper.format(bryntumStartDate, 'YYYY-MM-DD')

						// Adjust endDate to be inclusive and format to YYYY-MM-DD
						const inclusiveEndDate = DateHelper.add(bryntumEndDate, -1, 'day')
						const end_date_for_backend = DateHelper.format(inclusiveEndDate, 'YYYY-MM-DD')

						console.log('eventDrop - Sending to backend:', {
							id: event.data.id,
							start_date: start_date_for_backend,
							end_date: end_date_for_backend,
						})

						updateTask({ start_date: start_date_for_backend, end_date: end_date_for_backend }, event.data.id).then(
							(res) => {
								if (res.status >= 200 && res.status < 300) {
									console.log('Task updated successfully:', res.data)
								} else {
									console.error('Error updating: ', res.error.message)
								}
							}
						)
					})
				},
				eventResizeStart: ({ eventRecord }) => {
					console.log('Event resize started:', eventRecord)
				},
				eventResizeEnd: ({ eventRecord }) => {
					// Get Bryntum's Date objects
					const bryntumStartDate = eventRecord.data.startDate
					const bryntumEndDate = eventRecord.data.endDate // This is the start of the day AFTER the event ends

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

					updateTask({ start_date: start_date_for_backend, end_date: end_date_for_backend }, eventRecord.data.id).then(
						(res) => {
							if (res.status >= 200 && res.status < 300) {
								console.log('Task updated successfully:', res.data)
							} else {
								console.error('Error updating: ', res.error.message)
							}
						}
					)
					console.log('Event resize ended:', eventRecord)
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
					console.log('beforeEventEditShow', eventRecord)
					console.log('--- Editor Debug Info ---')
					console.log('Editor object:', editor) // The main editor instance
					console.log('Editor initialConfig:', editor.initialConfig) // What config it received
					console.log('Editor widgetMap:', editor.widgetMap) // Important: check if tabs are registered here
					console.log('Editor tabPanel component:', editor.tabPanel) // THIS IS CRITICAL: check if this is null or a TabPanel instance
					console.log('--- End Editor Debug Info ---')
					const subtasksContainer = editor.widgetMap.subtasksContainer

					subtasksContainer?.removeAll()

					console.log(
						'TabPanel items:',
						editor.tabPanel?.items.map((tab) => tab.title || tab.type)
					)

					if (eventRecord.children?.length) {
						const subtaskData = eventRecord.children.map((child) => child.data)

						subtasksContainer?.add({
							type: 'grid',
							height: '400px',
							scrollable: true,
							store: {
								data: subtaskData,
							},
							columns: [
								{ text: 'ID', field: 'id' },
								{ text: 'Name', field: 'name' },
								{ text: 'Start Date', field: 'startDate' },
								{ text: 'End Date', field: 'endDate' },
								{ text: 'Duration', field: 'duration' },
							],
						})
					} else {
						subtasksContainer?.add({
							type: 'label',
							html: 'No subtasks',
						})
					}
				},
			},
		})

		scheduler.dependencyStore.on('add', ({ records }) => {
			console.log('Dependency added:', records)
			records.forEach((dep) => {
				console.log('New dependency created: from', dep.fromEvent, ' to  → ', dep.toEvent)
				// Here, originalData is often already in string format, but it's safer
				// to use DateHelper to ensure consistent formatting to YYYY-MM-DD
				const from_date_for_backend = DateHelper.format(dep.fromEvent.startDate, 'YYYY-MM-DD')
				const to_date_for_backend = DateHelper.format(dep.toEvent.startDate, 'YYYY-MM-DD') // Assuming toEvent start date is used for lag calculation reference

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
					lag_unit: dep.lagUnit, // Ensure lagUnit is a string like 'day', 'hour', etc.
					active: dep.active || true,
				}).then((res) => {
					console.log('Backend dependency created:', res)
					if (res.error === null) {
						console.log('dependency created successfully ', res)
					} else {
						console.log('Error creating task:', res.error.message)
					}
				})
			})
		})
		scheduler.dependencyStore.on('update', ({ record, changes }) => {
			console.log('Dependency updated:', record)
			console.log('Changes:', changes)
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
			const task_groups = {
				metal_fittings: 1,
				installations: 2,
				connections: 3,
				completion_test: 4,
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
				task_group_id: taskGroupId,
				start_date: start_date_for_backend, // Use formatted date
				end_date: end_date_for_backend, // Use formatted date
				title: eventRecord.name,
			}

			console.log('afterEventSave - Sending to backend:', {
				id: eventRecord.id, // For existing events
				...formattedData,
			})

			if (isNewEvent) {
				formattedData.project = id // Assuming 'id' is defined in your scope
				createNewTasks(formattedData).then((res) => {
					console.log('Backend created:', res)
					if (res.error === null) {
						console.log('Task created successfully ', res)
						eventRecord.id = res.data[0].id // Update Bryntum record with backend ID
						eventRecord.commit() // Commit changes to the record
						console.log('Event created:', eventRecord)
					} else {
						console.log('Error creating task:', res.error.message)
						eventRecord.remove() // Remove event if backend creation failed
					}
				})
			} else {
				updateTask(formattedData, eventRecord.id).then((res) => {
					console.log('Backend updated:', res)
					if (res.error === null) {
						console.log('Task updated successfully')
					} else {
						console.log('Error updating task:', res.error.message)
					}
				})
			}
		})

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
		return () => scheduler.destroy()
	}, [events, resources])

	if (isLoading) return <div>Loading...</div>
	if (error) return <div>Error loading tasks</div>

	return (
		<>
			<div ref={schedulerRef} style={{ height: '500px', width: '100%', marginTop: '15px' }} />
		</>
	)
}

export default Calender2
