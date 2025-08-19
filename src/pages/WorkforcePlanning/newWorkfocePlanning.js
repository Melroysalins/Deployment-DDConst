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

import './customstyle.css'

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
	getBranchDetails,
	getAllBranchesDetails,
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

import {
	listAllEvents,
	createNewEvent,
	deleteEvent,
	listSelectedEvents,
	listEventsToCheckAvailability,
	fetchEmployeeBasedOnId,
} from 'supabase/events'
import {
	filterEmployees,
	filterEmployeesWithAvailabilityAndCertificates,
	getEmployeeBasedOnCertificate,
	getEmployeeOnlyWithHigherTier,
	getEmployeeOnlyWithLowerTier,
	listAllEmployees,
	listEmployeesByProject,
} from 'supabase/employees'
import { getProjectDetails, listAllProjects, listParicularProjects } from 'supabase/projects'
import { Field } from 'formik'
import { sanitizeForDataId } from './WorkforcePlanning'
import { Button, Stack, Button as MuiButton, Box } from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import MenuIcon from '@mui/icons-material/Menu'
import RightDrawer from 'components/RightDrawer'
import BasicTabs from 'components/Drawer/BasicTabs'
import useMain from 'pages/context/context'
import Iconify from 'components/Iconify'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'

const filters = { dw: true }

const twoMonthViewPreset = {
	base: 'monthAndYear', // Base on month/year preset
	tickWidth: 100, // Width of each day/week tick
	headers: [
		{
			unit: 'month',
			dateFormat: 'MMMM YYYY',
		},
		{
			unit: 'day',
			dateFormat: 'D',
		},
	],
	// Show 2 months
	tickSize: 50,
	timeResolution: { unit: 'day', increment: 1 },
}

const NewWorkfocePlanning = () => {
	const [teamsDetails, SetTeamDetails] = useState([])
	const [loader, setLoader] = useState(false)
	const [myResources, setMyResources] = useState([])
	const [previousResources, setPreviousResources] = useState([])
	const [previousFilterState, setPreviousFilterState] = useState({
		allowHigherTier: false,
		allowLowerTier: false,
	})
	const [projectSites, setProjectSites] = useState([])
	const [selectedEvents, SetSelectedEvents] = useState([])
	const [events, SetEvents] = useState([])

	const [isRightDrawerOpen, SetIsRightDrawerOPen] = useState(false)

	const [showNavigationButton, SetShowNavigationButton] = useState(true)

	const [dataConfig, SetDataConfig] = useState({
		startDate: null,
		endDate: null,
		quickNav: null,
		Special: 0,
		Level1: 0,
		Level2: 0,
		Level3: 0,
		projectLeadCertificate: [],
		availability: '',
		allowSplitAssignment: false,
		allowHigherTier: false,
		allowLowerTier: false,
		allowOtherCompaniesStaff: false,
		allowSelectSingleRecommendation: false,
	})

	const [schdulerStartDate, SetSchedulerStartDate] = useState('')
	const [SchedulerEndDate, SetSchedulerEndDate] = useState('')
	const [MappedProjects, SetMappedProjects] = useState([])

	const [recommendedStaff, SetRecommendedStaff] = useState([
		{
			Special: [],
			'Level 1': [],
			'Level 2': [],
			'Level 3': [],
		},
	])

	const [branchesInfo, SetBranchesInfo] = useState([])

	// Request approval and drawer functionality from original WorkforcePlanning
	const { setisDrawerOpen, isDrawerOpen, setapprovalIdDrawerRight } = useMain()

	const schedulerRef = useRef(null)

	const currentCenterDate = null

	let originalStartDate = null

	let orignalEndDate = null

	const myQueryClient = useQueryClient()

	const { projectid } = useParams()

	const schedulerInstance = useRef(null)

	const { i18n, t } = useTranslation(['workforce'])

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

	function transFormResourcesData(dataEmp, mappedProjects, thevalue, message, isTierFilter = false) {
		const groupedEmployees = {}

		console.log(`Mapped Projects  2 ${thevalue}`, dataEmp)

		console.log(`MYRESOURCES The response  100 ${message}`, dataEmp)

		dataEmp.data.forEach((employee) => {
			const projectId = employee.project || 'No Project'

			if (!groupedEmployees[projectId]) {
				groupedEmployees[projectId] = {
					id: projectId,
					name: mappedProjects.find((project) => project.value === projectId)?.text || 'Unknown Project',
					collapsed: false,
					eventCreation: false,
					children: [],
					expanded: true,
				}
			}

			const uniqueId = generateUniqueId(employee)

			// console.log(`MYRESOURCES The response  200 ${message}`, groupedEmployees)

			groupedEmployees[projectId].children.push({
				newid: uniqueId,
				id: employee.id,
				name: employee.name,
				team: employee.team,
				team_lead: employee.team_lead,
				certificate: employee.certificate,
			})
		})

		const resourceArray = Object.values(groupedEmployees)

		console.log(`MYRESOURCES The response  final${message}`, resourceArray)
		setMyResources(resourceArray)

		// Only update previous resources if not in the middle of a tier filter operation
		if (!isTierFilter) {
			setPreviousResources(resourceArray)
		}
	}

	function filterTeamLeadsNotInProjectLeadCert(myResources, projectLeadCertificate) {
		return myResources.map((resource) => ({
			...resource,
			children: resource.children.filter((employee) => {
				// Keep if NOT a team lead OR their certificate is in projectLeadCertificate
				if (employee.team_lead) {
					return projectLeadCertificate.includes(employee.certificate)
				}
				return true
			}),
		}))
	}

	React.useEffect(() => {
		;(async function () {
			setLoader(true)

			listAllProjects().then((data) => {
				const mappedProjects = data?.data.map((item) => ({ text: item.title, value: item.id }))

				SetMappedProjects(mappedProjects)

				listAllEmployees().then((dataEmp) => {
					console.log('All Employee', dataEmp)
					transFormResourcesData(dataEmp, mappedProjects, false, 'Initial load')
					setPreviousResources(dataEmp.data)
				})
			})

			getAllBranchesDetails().then((data) => {
				SetBranchesInfo(data)
			})
		})()
		return () => {}
	}, [projectid])

	useEffect(() => {
		if (!myResources?.length) return

		// listAllProjects().then((data) => SetAllProjectSites(data?.data))

		listAllEvents(filters).then((eventData) => {
			const eventsArray = []

			console.log('List All Events', eventData)

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
							cls: `custom-colored-event`,
						})
					})
				})
			})

			SetEvents(eventsArray)
			console.log(`MYRESOURCES The response  final Events`, eventsArray)
			SetSelectedEvents(eventData)
		})
	}, [myResources])

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

	function shiftMonths(months, scheduler) {
		const currentStart = scheduler.startDate
		const newStart = new Date(currentStart)
		newStart.setMonth(newStart.getMonth() + months)

		const newEnd = new Date(newStart)
		newEnd.setMonth(newEnd.getMonth() + 2)

		scheduler.setTimeSpan(newStart, newEnd)
	}

	function getDateRange(events) {
		if (!events.length) return { minStart: null, maxEnd: null }

		const minStart = events.reduce(
			(min, ev) => (dayjs(ev.startDate).isBefore(min) ? dayjs(ev.startDate) : min),
			dayjs(events[0].startDate)
		)

		const maxEnd = events.reduce(
			(max, ev) => (dayjs(ev.endDate).isAfter(max) ? dayjs(ev.endDate) : max),
			dayjs(events[0].endDate)
		)

		return {
			minStart: minStart.format('YYYY-MM-DD'),
			maxEnd: maxEnd.format('YYYY-MM-DD'),
		}
	}

	const handleConfirmFilter = async () => {
		try {
			const currentFilterState = {
				allowHigherTier: dataConfig.allowHigherTier,
				allowLowerTier: dataConfig.allowLowerTier,
			}

			// Check if we're removing tier filters
			const wasHigherTierActive = previousFilterState.allowHigherTier
			const wasLowerTierActive = previousFilterState.allowLowerTier
			const isTierFilterBeingRemoved =
				(wasHigherTierActive && !currentFilterState.allowHigherTier) ||
				(wasLowerTierActive && !currentFilterState.allowLowerTier)

			// If tier filter is being removed, restore previous state
			if (isTierFilterBeingRemoved && previousResources.length > 0) {
				setMyResources([...previousResources])
				setPreviousFilterState(currentFilterState)
				setisDrawerOpen(!isDrawerOpen)
				return
			}

			const {
				startDate,
				endDate,
				quickNav,
				Special,
				Level1,
				Level2,
				Level3,
				projectLeadCertificate,
				availability,
				allowSplitAssignment,
				allowHigherTier,
				allowLowerTier,
				allowOtherCompaniesStaff,
				allowSelectSingleRecommendation,
			} = dataConfig

			const certificateMap = {
				Special: 'Special',
				Level1: 'Level 1',
				Level2: 'Level 2',
				Level3: 'Level 3',
			}

			const limits = {
				Special: dataConfig.Special,
				Level1: dataConfig.Level1,
				Level2: dataConfig.Level2,
				Level3: dataConfig.Level3,
			}

			const { minStart, maxEnd } = getDateRange(events)

			if (startDate && endDate === null) {
				const newEndDate = dayjs(startDate).add(3, 'month').format('YYYY-MM-DD')
				SetSchedulerStartDate(startDate)
				SetSchedulerEndDate(newEndDate)
			} else {
				SetSchedulerStartDate(startDate)
				SetSchedulerEndDate(endDate)
			}

			await project.commitAsync()

			if (quickNav) {
				let start = dayjs(schedulerInstance.current.startDate || startDate)

				let end = null
				SetShowNavigationButton(true)
				switch (quickNav) {
					case '1 Month':
						end = start.add(1, 'month')
						break
					case '2 Months':
						end = start.add(2, 'month')
						break
					case 'This Year':
						end = start.endOf('year')
						SetShowNavigationButton(false)
						break
					case 'All Project':
						start = dayjs(minStart)
						end = dayjs(maxEnd)
						SetShowNavigationButton(false)
						break
					default:
						return
				}

				SetSchedulerStartDate(start)
				SetSchedulerEndDate(end)
			}

			if (Special || Level1 || Level2 || Level3) {
				const allResult = (
					await Promise.all(
						Object.entries(certificateMap)
							.filter(([key]) => dataConfig[key]) // only keep certificates with counts
							.map(async ([key, certName]) => {
								const count = dataConfig[key]
								const res = await getEmployeeBasedOnCertificate(certName, count)
								return res?.data || []
							})
					)
				).flat()

				console.log('SpecialLevel1', allResult)

				if (allResult?.length) {
					transFormResourcesData({ data: allResult }, MappedProjects, true, 'For Sepcial Level Count')
				}
			}

			if (projectLeadCertificate?.length && !Special && !Level1 && !Level2 && !Level3) {
				filterEmployees(projectLeadCertificate).then((data) =>
					transFormResourcesData(data, MappedProjects, true, 'projectLeadCertificate?.length && !Special && !Level1')
				)
				// setMyResources(filteredResources)
			}
			if (projectLeadCertificate?.length > 0 && (Special === 1 || Level1 === 1 || Level2 === 1 || Level3 === 1)) {
				const allResult = (
					await Promise.all(
						Object.entries(certificateMap)
							.filter(([key]) => dataConfig[key]) // only keep certificates with counts
							.map(async ([key, certName]) => {
								const count = dataConfig[key]
								const res = await getEmployeeBasedOnCertificate(certName, count, true, projectLeadCertificate)
								return res?.data || []
							})
					)
				).flat()

				if (allResult?.length) {
					transFormResourcesData(
						{ data: allResult },
						MappedProjects,
						true,
						'projectLeadCertificate?.length && !Special && !Level1 ELSE'
					)
				}
			}

			// First handle availability filter if enabled
			// Also works for Recommended Staff Section
			if (startDate && endDate && availability && !Special && !Level1 && !Level2 && !Level3) {
				await listEventsToCheckAvailability(startDate, endDate, availability)
					.then(async (data) => {
						console.log('Availability Test 1', data, branchesInfo)
						console.log('Yes StartDate EndDate Special Level 1 Level 2  Level 3 First COndition', data)

						const allEmployeeData = (
							await Promise.all(
								data.map(async (item) => {
									const res = await fetchEmployeeBasedOnId(item?.employee)
									return res?.data || []
								})
							)
						).flat()

						// data?.forEach((item) => {
						// 	if (item?.certificate === 'Special') {
						// 		SetRecommendedStaff((prev) => ({
						// 			...prev,
						// 			[item?.certificate]: [...prev[item?.certificate], item],
						// 		}))
						// 	}
						// 	if (item?.certificate === 'Level 1') {
						// 		SetRecommendedStaff((prev) => ({
						// 			...prev,
						// 			[item?.certificate]: [...prev[item?.certificate], item],
						// 		}))
						// 	}
						// 	if (item?.certificate === 'Level 2') {
						// 		SetRecommendedStaff((prev) => ({
						// 			...prev,
						// 			[item?.certificate]: [...prev[item?.certificate], item],
						// 		}))
						// 	}
						// 	if (item?.certificate === 'Level 3') {
						// 		SetRecommendedStaff((prev) => ({
						// 			...prev,
						// 			[item?.certificate]: [...prev[item?.certificate], item],
						// 		}))
						// 	}
						// })

						// Store the availability filtered data
						const availabilityFilteredData = allEmployeeData

						// console.log('Availability Test 2', availabilityFilteredData)

						// Apply certificate limits if any
						const filteredEmployees = Object.keys(limits).reduce((acc, certType) => {
							if (limits[certType] > 0) {
								const matching = availabilityFilteredData
									.filter((emp) => emp?.certificate === certType)
									.slice(0, limits[certType])
								acc.push(...matching)
							}
							return acc
						}, [])

						console.log('Availability Test 3', recommendedStaff)

						// If no tier filters are active, apply the availability filter
						if (!allowHigherTier && !allowLowerTier) {
							const dataToShow = Special || Level1 || Level2 || Level3 ? filteredEmployees : availabilityFilteredData
							transFormResourcesData(
								{ data: dataToShow },
								MappedProjects,
								true,
								`${availability} available employees`,
								true // Pass true to indicate we're in a filter operation
							)

							console.log('Yes StartDate EndDate Special Level 1 Level 2  Level 3 First COndition', dataToShow)
						}

						// If tier filters are also active, we'll handle them after this
					})
					.catch((error) => {
						console.error('Error in availability filter:', error)
					})
			}

			if (startDate && endDate && availability && (Special === 1 || Level1 === 1 || Level2 === 1 || Level3 === 1)) {
				const result = await filterEmployeesWithAvailabilityAndCertificates(startDate, endDate, availability, {
					Special,
					'Level 1': Level1,
					'Level 2': Level2,
					'Level 3': Level3,
				})

				// Store the availability filtered data

				if (result?.length) {
					transFormResourcesData(
						{ data: result },
						MappedProjects,
						true,
						true // Pass true to indicate we're in a filter operation
					)
				}

				console.log('Yes StartDate EndDate Special Level 1 Level 2  Level 3', result)
			}

			// Store current resources before applying tier filters
			if (
				(allowHigherTier || allowLowerTier) &&
				!(previousFilterState.allowHigherTier || previousFilterState.allowLowerTier)
			) {
				setPreviousResources([...myResources])
			}

			// Handle tier filters if any are active
			if (allowHigherTier || allowLowerTier) {
				try {
					let filteredData = []

					if (allowHigherTier && allowLowerTier) {
						// If both toggles are on, show all employees (no tier filtering)
						const res = await listAllEmployees()
						filteredData = res?.data || []
					} else if (allowHigherTier) {
						// Get only higher tier employees
						const res = await getEmployeeOnlyWithHigherTier()
						filteredData = res || []
					} else if (allowLowerTier) {
						// Get only lower tier employees
						const res = await getEmployeeOnlyWithLowerTier()
						filteredData = res || []
					}

					// If we have availability filtered data, intersect it with tier filtered data
					if (startDate && endDate && availability) {
						// Get the current resources which already have availability filter applied
						const currentResources = [...myResources]

						// Extract employee IDs from current resources
						const availabilityFilteredIds = new Set(
							currentResources.flatMap((resource) => resource.children?.map((child) => child.id) || [])
						)

						// Filter tier filtered data to only include employees that are in availability filtered data
						filteredData = filteredData.filter((emp) => availabilityFilteredIds.has(emp.id))
					}

					if (filteredData.length) {
						transFormResourcesData(
							{ data: filteredData },
							MappedProjects,
							true,
							`${allowHigherTier ? 'Higher' : 'Lower'} Tier Employees`,
							true
						)
					}
				} catch (error) {
					console.error('Error in tier filtering:', error)
				}
			}

			// Update the previous filter state
			setPreviousFilterState(currentFilterState)

			// Recommended Staff  logic
		} catch (error) {
			console.log('Error ', error)
		}
	}

	useEffect(() => {
		if (!schedulerRef.current) return

		// PresetManager.add(CustomViewDay)
		// PresetManager.add(customMonthViewPreset)

		const ganttProps = {
			stripeFeature: true,
			dependenciesFeature: true,
		}

		const currentZoomIndex = 1

		const scheduler = new SchedulerPro({
			startDate: schdulerStartDate ? new Date(schdulerStartDate) : new Date(2025, 0, 1),
			endDate: SchedulerEndDate ? new Date(SchedulerEndDate) : new Date(2025, 2, 31),
			appendTo: schedulerRef.current,
			autoHeight: true,
			width: '100%',
			infiniteScroll: false,
			viewPreset: twoMonthViewPreset,
			tickSize: 50,
			rowHeight: 60,
			stateful: false,
			stateId: 'mySchedulerState',
			eventLayout: 'stack',
			dependenciesFeature: true,
			dependencyEditFeature: true,
			ganttProps,
			autoAdjustTimeAxis: false,
			maxZoomLevel: 12,
			autoLoad: true,
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
					expanded: true,
					width: 250,
					headerRenderer: () => '<b style="font-weight: 800; font-size: 18px;">Employee</b>',
					htmlEncode: false,

					renderer: ({ record }) => {
						console.log('Currentrecord', record.data)

						const isGroup = record.children?.length > 0
						const name = record.name || ' '

						if (isGroup) {
							return `<b style="margin-left:5px;font-weight:800;font-size:19px">${name}</b>`
						}

						// Rating circle logic
						const rating = record.data?.rating || '👤'
						let bgColor = '#eee' // default color
						if (rating === 'A') bgColor = 'orange'
						else if (rating === 'B') bgColor = 'red'

						const ratingIcon = `
								<span style="
									background-color: ${bgColor}; 
									color: white; 
									border-radius: 50%; 
									height: 55px; 
									width: 55px; 
									display: flex; 
									justify-content: center; 
									align-items: center;
									font-size: 12px;
									font-weight: 700;
								">${rating}</span>
							`

						// TEAM LEAD badge
						const teamLeadTag = record.data.team_lead
							? `<span style="background-color: #ff7b00; color: white; font-size: 10px; padding: 2px 6px; border-radius: 4px; margin-left: 13px;">TEAM LEAD</span>`
							: ''
						const certificate = record.data.certificate
							? `<span style="background-color: #e4f1fe; color: black; font-size: 10px; padding: 2px 6px; border-radius: 4px; margin-left: 13px; font-weight:bold;">${record.data.certificate}</span>`
							: ''

						return `
        ${ratingIcon}
        <span style="margin-left: 8px ; font-weight:600;">${name}</span>
        ${teamLeadTag} ${certificate}
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

		schedulerInstance.current = scheduler

		// // ✅ Proper async commit block
		;(async () => {
			await scheduler.project.commitAsync()
		})()

		return () => scheduler.destroy()
	}, [myResources, events, schdulerStartDate, SchedulerEndDate])

	return (
		<>
			{/* Request Approval and Drawer Controls */}
			<Box sx={{ display: 'flex', gap: '10px', position: 'absolute', top: 28, right: 44, zIndex: 1000 }}>
				<MuiButton size="small" variant="contained" color="inherit" sx={{ padding: 1, minWidth: 0 }}>
					<Iconify icon="material-symbols:download-rounded" width={20} height={20} />
				</MuiButton>
				<MuiButton
					onClick={() => {
						SetIsRightDrawerOPen(!isRightDrawerOpen)
					}}
					variant="contained"
					size="medium"
					color="inherit"
					sx={{ background: '#8D99FF', marginLeft: 1, minWidth: 40, width: 40, padding: '5px 0', height: 37 }}
				>
					<Iconify icon="uil:bars" width={25} height={25} color="white" />
				</MuiButton>
			</Box>

			{showNavigationButton && (
				<Stack direction={'row'} gap={2} alignItems={'center'} justifyContent={'space-between'} marginTop={'18px'}>
					<Button
						variant="contained"
						style={{ background: '#eeee', boxShadow: 'none' }}
						onClick={() => shiftMonths(-2, schedulerInstance.current)}
					>
						<NavigateBeforeIcon style={{ color: 'black' }} />
					</Button>
					<Button
						variant="contained"
						style={{ background: '#eeee', boxShadow: 'none' }}
						onClick={() => shiftMonths(2, schedulerInstance.current)}
					>
						<NavigateNextIcon style={{ color: 'black' }} />
					</Button>
				</Stack>
			)}

			{/* <Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					width: '100%',
					height: '100%',
					overflowY: 'scroll',
					scrollBehavior: 'smooth',
					gap: '10px',
					border: '1px solid red',
				}}
			>
				<Box
					sx={{
						display: 'flex',
						width: isRightDrawerOpen ? '73%' : '100%',
						overflowY: 'scroll',
						scrollbarWidth: 'none',
						scrollBehavior: 'smooth',
						border: '1px solid blue',
						'&::-webkit-scrollbar': {
							display: 'none',
						},
					}}
				>
					<div ref={schedulerRef} style={{ height: '900px', width: '100%', marginTop: '15px' }} />
				</Box>

				{isRightDrawerOpen && (
					<Box
						sx={{
							display: 'flex',
							width: '27%',
							overflowY: 'scroll',
							scrollbarWidth: 'none',
							border: '1px solid orange',
							scrollBehavior: 'smooth',
							'&::-webkit-scrollbar': {
								display: 'none',
							},
						}}
					>
						<RightDrawer
							isRightDrawerOpen={isRightDrawerOpen}
							SetIsRightDrawerOPen={SetIsRightDrawerOPen}
							dataConfig={dataConfig}
							SetDataConfig={SetDataConfig}
							handleConfirmFilter={handleConfirmFilter}
							isWorkForcePage={true}
						/>
					</Box>
				)}
			</Box> */}
			<Box
				sx={{
					display: 'flex',
					width: '100%',
					height: 'calc(100vh - 180px)', // Adjust 180px based on your header and other elements
					overflow: 'hidden',
					position: 'relative',
					border: '1px solid #e0e0e0',
					borderRadius: '4px',
					backgroundColor: '#fff',
					mt: 2, // Add some top margin if needed
				}}
			>
				{/* Scheduler Container */}
				<Box
					sx={{
						flex: 1,
						overflow: 'hidden',
						display: 'flex',
						flexDirection: 'column',
						overflowY: 'scroll',
						position: 'relative',
						transition: 'width 0.3s ease',
						width: isRightDrawerOpen ? 'calc(100% - 320px)' : '100%',
					}}
				>
					<div
						ref={schedulerRef}
						style={{
							flex: 1,
							minHeight: 0,
							width: '100%',
						}}
					/>
				</Box>

				{/* Right Drawer */}
				{isRightDrawerOpen && (
					<Box
						sx={{
							width: '380px',
							height: '100%',
							overflowY: 'auto', // allow vertical scroll
							overflowX: 'hidden', // prevent horizontal scroll
							borderLeft: '1px solid #e0e0e0',
							backgroundColor: 'white',
							boxShadow: '-2px 0 4px rgba(0,0,0,0.05)',
							'&::-webkit-scrollbar': {
								display: 'none',
							},
						}}
					>
						<RightDrawer
							isRightDrawerOpen={isRightDrawerOpen}
							SetIsRightDrawerOPen={SetIsRightDrawerOPen}
							dataConfig={dataConfig}
							SetDataConfig={SetDataConfig}
							handleConfirmFilter={handleConfirmFilter}
							isWorkForcePage={true}
						/>
					</Box>
				)}
			</Box>

			{/* Request Approval Drawer from original WorkforcePlanning */}
			{isDrawerOpen && (
				<BasicTabs
					open={isDrawerOpen}
					setopen={setisDrawerOpen}
					isRightDrawerOpen={isRightDrawerOpen}
					SetIsRightDrawerOPen={SetIsRightDrawerOPen}
					dataConfig={dataConfig}
					SetDataConfig={SetDataConfig}
					handleConfirmFilter={handleConfirmFilter}
					isWorkForcePage={true}
				/>
			)}
		</>
	)
}

export default NewWorkfocePlanning
