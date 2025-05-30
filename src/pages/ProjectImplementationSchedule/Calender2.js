import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
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

import { customMonthViewPreset, features, getTimelineRange, dependencyTypeMap } from './SchedulerConfig'
import { filter, forEach } from 'lodash'
import FilterPopup from 'components/FilterPopUp'
import { getProjectDiagram } from 'supabase/project_diagram'
import { da } from 'date-fns/locale'

const Calender2 = () => {
	const [range, setRange] = React.useState(getTimelineRange())
	const [resources, SetResources] = useState([])
	const [allWorkTypes, SetAllWorkTypes] = useState([
		'Connection',
		'Installation',
		'Office Work',
		'Completion Testing',
		'Metal Fittings Installation',
		'Auxiliary Construction',
	])
	const [isFilterOpen, SetIsFilterOpen] = useState(false)
	const [isFilteredApplied, SetIsFilterApplied] = useState(false)
	const [taskGroup, SetTaskGroup] = useState([])
	const [allTaskGroup, SetAllTaskGroup] = useState([])
	const [allResources, SetAllRescources] = useState([])
	const [teamsDetails, SetTeamDetails] = useState(new Set())
	const [taskType, SetTaskType] = useState([])
	const [filters, SetFilters] = useState({
		tasktype: '',
		lines: '',
		demolition: '',
	})
	const schedulerRef = useRef(null)
	const { id } = useParams()
	console.log('myID', id)

	const { data, isLoading, error } = useQuery(['projectData', id], async () => {
		const [tasks, dependencies] = await Promise.all([listAllTasksByProject2(id), getAllTaskDependencyByProject(id)])

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

	// Filters Code

	const handleChange = (field, value) => {
		SetTaskGroup(allTaskGroup)
		if (field === 'tasktype') {
			SetFilters((prev) => ({ ...prev, [field]: value }))
		} else {
			SetFilters((prev) => ({ ...prev, [field]: value }))
		}
	}

	const handleonClearFilter = () => {
		SetFilters({
			diagramName: '',
			lines: '',
			demolition: '',
			diagramId: '',
		})

		SetResources(allResources)
		SetTaskGroup(allTaskGroup)
		SetIsFilterOpen(false)

		console.log('myresoucers', resources, allResources)
	}

	const handleApplyFilters = (filters) => {
		SetIsFilterApplied(true)
		console.log('value', filters)

		const { tasktype, lines, demolition } = filters

		if (tasktype) {
			const filteredResources = allResources?.filter((resource) => resource?.id === tasktype)

			SetResources(filteredResources)
		} else {
			SetResources(allResources)
		}

		if (lines?.length || demolition?.length) {
			console.log('mecalled')
			const filterTasks = (tasks) =>
				tasks?.filter((item) => {
					const matchLines = item?.title?.toLowerCase()?.includes(lines.toLowerCase())
					const matchDemolition = demolition !== ' ' && String(item?.isDemolition) === demolition

					if (lines?.length && demolition?.length) {
						return matchLines && matchDemolition
					}

					if (lines) {
						return matchLines
					}

					if (demolition !== undefined) {
						return matchDemolition
					}
					return true
				})

			const modifiedData = {
				metal_fittings: filterTasks(allTaskGroup?.metal_fittings),
				connections: filterTasks(allTaskGroup?.connections),
				installations: filterTasks(allTaskGroup?.installations),
				completion_test: filterTasks(allTaskGroup?.completion_test),
				office_work: filterTasks(allTaskGroup?.office_work),
				auxiliary_construction: filterTasks(allTaskGroup?.auxiliary_construction),
			}

			SetTaskGroup(modifiedData)

			console.log('Melroy', modifiedData)
		}
	}

	// Group tasks as before
	const groupedTasks = React.useMemo(() => {
		if (!data?.tasks) return null
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
		SetTaskGroup(grouped)
		SetAllTaskGroup(grouped)
		return grouped
	}, [data?.tasks])

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

	useEffect(() => {
		async function buildExpandedResources() {
			const expandedResources = []

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

				console.log('unique', normalized, taskGroup[resourceId])

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
		})()
	}, [selectedWorkTypesData, dependencies])

	const events = React.useMemo(() => {
		if (!taskGroup) return []

		// const { connections, installations, metal_fittings, completion_test } = taskGroup

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
				const teamNumber = connection.team
				const event = {
					id: connection.id || `connection-${index + 1}`,
					resourceId: teamNumber ? `connections-${teamNumber}` : `connections`,
					startDate: connection.start_date ? new Date(connection.start_date).toISOString() : new Date().toISOString(),
					endDate: connection.end_date
						? new Date(connection.end_date).toISOString()
						: (() => {
								const today = new Date()
								today.setDate(today.getDate() + 3)
								return today.toISOString()
						  })(),
					name: connection.title,
					manuallyScheduled: true,
					expanded: true,
					leaf: false,
				}
				if (connection.children && connection.children.length > 0) {
					event.children = connection.children.map((child) => ({
						id: child.id || `child-${child.id}`,
						resourceId: teamNumber ? `connections-${teamNumber}` : 'connections',
						startDate: child.start_date ? new Date(`${child.start_date}T00:00:00`) : new Date(),
						endDate: child.end_date ? new Date(`${child.end_date}T00:00:00`) : new Date(),
						name: child.title,
						leaf: true,
						eventColor: 'red',
					}))
				}
				return event
			}),
			...installations?.map((installation, index) => {
				const teamNumber = installation.team
				const event = {
					id: installation.id,
					resourceId: teamNumber ? `installations-${teamNumber}` : 'installations',
					startDate: installation.start_date
						? new Date(installation.start_date).toISOString()
						: new Date().toISOString(),
					endDate: installation.end_date
						? new Date(installation.end_date).toISOString()
						: (() => {
								const today = new Date()
								today.setDate(today.getDate() + 3)
								return today.toISOString()
						  })(),
					name: installation.title,
					manuallyScheduled: true,
				}
				if (installation.children && installation.children.length > 0) {
					event.children = installation.children.map((child) => ({
						id: child.id || `child-${child.id}`,
						resourceId: teamNumber ? `installations-${teamNumber}` : 'installations',
						startDate: child.start_date ? new Date(`${child.start_date}T00:00:00`) : new Date(),
						endDate: child.end_date ? new Date(`${child.end_date}T00:00:00`) : new Date(),
						name: child.title,
						leaf: true,
						eventColor: 'blue',
					}))
				}
				return event
			}),
			...metal_fittings?.map((metal_fitting, index) => {
				const teamNumber = metal_fitting?.team
				const event = {
					id: metal_fitting.id || `metal_fitting-${index + 1}`,
					resourceId: teamNumber ? `metal_fittings-${teamNumber}` : 'metal_fittings',
					startDate: metal_fitting.start_date
						? new Date(metal_fitting.start_date).toISOString()
						: new Date().toISOString(),
					endDate: metal_fitting.end_date
						? new Date(metal_fitting.end_date).toISOString()
						: (() => {
								const today = new Date()
								today.setDate(today.getDate() + 3)
								return today.toISOString()
						  })(),
					name: metal_fitting.title,
					manuallyScheduled: true,
				}
				if (metal_fitting.children && metal_fitting.children.length > 0) {
					event.children = metal_fitting.children.map((child) => ({
						id: child.id || `child-${child.id}`,
						resourceId: teamNumber ? `metal_fittings-${teamNumber}` : 'metal_fittings',
						startDate: child.start_date ? new Date(`${child.start_date}T00:00:00`) : new Date(),
						endDate: child.end_date ? new Date(`${child.end_date}T00:00:00`) : new Date(),
						name: child.title,
						leaf: true,
						eventColor: 'green',
					}))
				}
				return event
			}),
			...completion_test?.map((completion_test, index) => {
				const teamNumber = completion_test?.team
				const event = {
					id: completion_test.id || `completion_test-${index + 1}`,
					resourceId: teamNumber ? `completion_test-${teamNumber}` : 'completion_test',
					startDate: completion_test.start_date
						? new Date(completion_test.start_date).toISOString()
						: new Date().toISOString(),
					endDate: completion_test.end_date
						? new Date(completion_test.end_date).toISOString()
						: (() => {
								const today = new Date()
								today.setDate(today.getDate() + 3)
								return today.toISOString()
						  })(),
					name: completion_test.title || `Completion Test + ${index + 1}`,
					manuallyScheduled: true,
				}
				if (completion_test.children && completion_test.children.length > 0) {
					event.children = completion_test.children.map((child) => ({
						id: child.id || `child-${child.id}`,
						resourceId: teamNumber ? `completion_test-${teamNumber}` : 'completion_test',
						startDate: child.start_date ? new Date(`${child.start_date}T00:00:00`) : new Date(),
						endDate: child.end_date ? new Date(`${child.end_date}T00:00:00`) : new Date(),
						name: child.title,
						leaf: true,
						eventColor: 'green',
					}))
				}
				return event
			}),
			...office_work?.map((office_work, index) => {
				const teamNumber = office_work?.team
				const event = {
					id: office_work.id || `office_work-${index + 1}`,
					resourceId: teamNumber ? `office_work-${teamNumber}` : 'office_work',
					startDate: office_work.start_date ? new Date(office_work.start_date).toISOString() : new Date().toISOString(),
					endDate: office_work.end_date
						? new Date(office_work.end_date).toISOString()
						: (() => {
								const today = new Date()
								today.setDate(today.getDate() + 3)
								return today.toISOString()
						  })(),
					name: office_work.title || `Office Work + ${index + 1}`,
					manuallyScheduled: true,
				}
				if (office_work.children && office_work.children.length > 0) {
					event.children = office_work.children.map((child) => ({
						id: child.id || `child-${child.id}`,
						resourceId: teamNumber ? `office_work-${teamNumber}` : 'office_work',
						startDate: child.start_date ? new Date(`${child.start_date}T00:00:00`) : new Date(),
						endDate: child.end_date ? new Date(`${child.end_date}T00:00:00`) : new Date(),
						name: child.title,
						leaf: true,
						eventColor: 'green',
					}))
				}
				return event
			}),
			...auxiliary_construction?.map((auxiliary_construction, index) => {
				const teamNumber = auxiliary_construction?.team
				const event = {
					id: auxiliary_construction.id || `auxiliary_construction-${index + 1}`,
					resourceId: teamNumber ? `auxiliary_construction-${teamNumber}` : 'auxiliary_construction',
					startDate: auxiliary_construction.start_date
						? new Date(auxiliary_construction.start_date).toISOString()
						: new Date().toISOString(),
					endDate: auxiliary_construction.end_date
						? new Date(auxiliary_construction.end_date).toISOString()
						: (() => {
								const today = new Date()
								today.setDate(today.getDate() + 3)
								return today.toISOString()
						  })(),
					name: auxiliary_construction.title || `Auxiliary Construction + ${index + 1}`,
					manuallyScheduled: true,
				}
				if (auxiliary_construction.children && auxiliary_construction.children.length > 0) {
					event.children = auxiliary_construction.children.map((child) => ({
						id: child.id || `child-${child.id}`,
						resourceId: teamNumber ? `auxiliary_construction-${teamNumber}` : 'auxiliary_construction',
						startDate: child.start_date ? new Date(`${child.start_date}T00:00:00`) : new Date(),
						endDate: child.end_date ? new Date(`${child.end_date}T00:00:00`) : new Date(),
						name: child.title,
						leaf: true,
						eventColor: 'green',
					}))
				}
				return event
			}),
		]
	}, [taskGroup])

	console.log('events', events)

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

	console.log('groupedTasks2', taskType)

	useEffect(() => {
		if (!schedulerRef.current) return
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
			eventLayout: 'stack',
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
					console.log('Event drag ended:', eventRecords)
					forEach(eventRecords, (event) => {
						const start_date = event.data.startDate
						const end_date = event.data.endDate
						updateTask({ start_date, end_date }, event.data.id).then((res) => {
							if (res.status >= 200 && res.status < 300) {
								console.log('Task updated successfully:', res.data)
							} else {
								console.error('Error updating: ', res.error.message)
							}
						})
					})
				},
				// eventDragAbort: (data) => {
				//     console.log('Event drag aborted:', data);
				// },
				eventResizeStart: ({ eventRecord }) => {
					console.log('Event resize started:', eventRecord)
				},
				eventResizeEnd: ({ eventRecord }) => {
					// update the start and end date in the backend
					const start_date = eventRecord.data.startDate.toISOString()
					const end_date = eventRecord.data.endDate.toISOString()
					console.log('start date', start_date)
					console.log('end date', end_date)
					updateTask({ start_date, end_date }, eventRecord.data.id).then((res) => {
						if (res.status >= 200 && res.status < 300) {
							console.log('Task updated successfully:', res.data)
						} else {
							console.error('Error updating: ', res.error.message)
						}
					})
					console.log('Event resize ended:', eventRecord)
				},
				eventDragSelect: ({ selectedEvents }) => {
					console.log(
						'Selected events:',
						selectedEvents.map((event) => event.name)
					)
				},
				beforeEventDelete: ({ eventRecords }) => {
					console.log('Before event delete:', data)
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
					//     const dependencies = scheduler.dependencyStore.getEventDependencies(eventRecord);
					//     console.log('dependencies', dependencies);
					//     console.log(dependencies.length);
					//     if (dependencies.length > 0) {
					//         console.warn(`Cannot delete event "${eventRecord.name}" because it has dependencies.`);
					//         console.warn(`Cannot delete event "${eventRecord.name}" because it has dependencies.`);
					//         // Replace this with a custom notification or modal
					//         // Example: showNotification({ message: `Cannot delete event "${eventRecord.name}" because it has dependencies. Please remove the dependencies first.`, type: 'warning' });
					//         return false; // Prevent deletion for all events
					//     }
					// });
					console.log(`Events to be deleted:`, eventIds)
					return deleteTasks(eventIds)
						.then((res) => {
							console.log(`Backend response:`, res)
							if (res.error === null) {
								console.log(`Events deleted successfully from backend:`, eventIds)
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
			},
			eventRenderer({ eventRecord }) {
				return `<div class="custom-event">${eventRecord.name}</div>`
			},
			features,
		})

		scheduler.dependencyStore.on('add', ({ records }) => {
			console.log('Dependency added:', records)
			records.forEach((dep) => {
				console.log('New dependency created: from', dep.fromEvent, ' to  → ', dep.toEvent)
				createTaskDependency({
					from_task_id: dep.fromEvent.data.id,
					to_task_id: dep.toEvent.data.id,
					project_id: id,
					type: dependencyTypeMap[dep.type] || dependencyTypeMap[2],
					lag: DateHelper.diff(
						new Date(dep.fromEvent.originalData.endDate),
						new Date(dep.toEvent.originalData.startDate),
						dep.lagUnit[0]
					),
					lag_unit: dep.lagUnit[0],
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
				// sendDependencyToBackend('delete', dep.id);
				deleteTaskDependency(dep.data.id)
					.then((res) => {
						console.log('Backend dependency deleted:', res)
						if (res.error === null) {
							console.log('Dependency deleted successfully:', res)
							// return true;
						} else {
							console.error('Error deleting dependency:', res.error)
							alert('Error deleting dependency:', res.error)
							// return false; // Prevent deletion if there's an error
						}
					})
					.catch((err) => {
						console.error('Error deleting dependency:', err)
						alert('Error deleting dependency:', err.message)
						// return false; // Prevent deletion if there's an error
					})
			})
		})
		scheduler.on('afterEventSave', ({ eventRecord }) => {
			const isNewEvent = !events.some((e) => e.id === eventRecord.id)
			const task_groups = {
				metal_fittings: 1,
				installations: 2,
				connections: 3,
				completion_test: 4,
			}
			console.log('eventRecord.resourceId', eventRecord.resourceId)
			const groupName = eventRecord.resourceId
			const taskGroupId = task_groups[groupName]
			const formattedData = {
				task_group_id: taskGroupId,
				start_date: eventRecord.startDate,
				end_date: eventRecord.endDate,
				title: eventRecord.name,
			}
			if (isNewEvent) {
				formattedData.project = id
				createNewTasks(formattedData).then((res) => {
					console.log('Backend created:', res)
					if (res.error === null) {
						console.log('Task created successfully ', res)
						eventRecord.id = res.data[0].id
						eventRecord.commit()
						console.log('Event created:', eventRecord)
					} else {
						console.log('Error creating task:', res.error.message)
						eventRecord.remove()
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
			const formattedData = {
				id: eventRecord.id,
				resourceId: eventRecord.resourceId,
				startDate: eventRecord.startDate,
				endDate: eventRecord.endDate,
				name: eventRecord.name,
			}
			console.log('Event updated:', formattedData)
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

	console.log('taskType', taskType)
	console.log('isFilteredApplied', isFilteredApplied)

	if (isLoading) return <div>Loading...</div>
	if (error) return <div>Error loading tasks</div>
	return (
		<>
			<Stack mb={2} direction={'row'} justifyContent={'flex-end'}>
				<MuiButton
					size="small"
					variant="contained"
					sx={{ padding: 0.5, minWidth: 0, width: 30 }}
					onClick={(e) => {
						e.stopPropagation() // Stop Accordion behv(open or close) on click on button
						SetIsFilterOpen(true)
					}}
				>
					<Iconify icon="heroicons-funnel" width={20} height={20} />
				</MuiButton>
				{isFilterOpen && (
					<FilterPopup
						open={isFilterOpen}
						onClose={() => {
							SetIsFilterOpen(false)
						}}
						onClearFilter={handleonClearFilter}
						onApplyFilters={handleApplyFilters}
						handleChange={handleChange}
						filters={filters}
						SetFilters={SetFilters}
						isTaskType={true}
						taskType={taskType}
					/>
				)}
			</Stack>

			<div ref={schedulerRef} style={{ height: '500px', width: '100%', marginTop: '15px' }} />
		</>
	)
}

export default Calender2
