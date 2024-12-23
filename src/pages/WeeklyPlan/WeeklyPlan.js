import React, { useEffect, useCallback } from 'react'
import '@mobiscroll/react/dist/css/mobiscroll.min.css'
import {
	Eventcalendar,
	setOptions,
	momentTimezone,
	formatDate,
	CalendarPrev,
	CalendarNext,
	CalendarNav,
	localeKo,
} from '@mobiscroll/react'
import moment from 'moment-timezone'
import './calendar.scss'
import { Loader, getHolidays } from 'reusables'
import { getProjectDetails } from 'supabase/projects'

import Page from '../../components/Page'
import { Stack, Button as MuiButton, Grid, Box, Container, Typography } from '@mui/material'
import LeftMenu from './LeftMenu'
import ProgressRate from './ProgressRate'
import Drawer from './Drawer'
import { useParams } from 'react-router-dom'
import Iconify from 'components/Iconify'
import BasicTabs from 'components/Drawer/BasicTabs'
import { useQuery } from 'react-query'
import { deleteTask, listAllTaskGroups, listAllTasksByProject, updateTask } from 'supabase'
import AddFormPopup from './Popup/AddFormPopup'
import { useTranslation } from 'react-i18next'
import useMain from 'pages/context/context'
import { getApprovalsByProject } from 'supabase/approval'
import { ApprovalStatus, WeekName } from 'constant'
import { fDateLocale, getWeekName } from 'utils/formatTime'
import RequestApproval from 'layouts/RequestApproval'
import FlowDiagram from './FlowDiagram'

setOptions({
	theme: 'ios',
	themeVariant: 'light',
})
momentTimezone.moment = moment

const viewSettings = {
	timeline: {
		type: 'week',
		size: 2,
		eventList: true,
		startDay: 1,
		endDay: 0,
	},
}

const defaultHolidays = [
	{ background: 'rgba(100, 100, 100, 0.1)', recurring: { repeat: 'weekly', weekDays: 'SU' } },
	{ background: 'rgba(100, 100, 100, 0.1)', recurring: { repeat: 'weekly', weekDays: 'SA' } },
]

export const colorApprovalTask = {
	Approved: '#6AC79B',
	Planned: '#8D99FF',
	Rejected: 'red',
}
const colorHeading = {
	Approved: '#6AC79B',
	Planned: '#8D99FF',
	Pending: '#8D99FF',
	Rejected: 'red',
}
export const colorApprovalSubTask = {
	Approved: '#6AC750',
	Planned: '#BDB2E9',
	Rejected: '#FF6B00',
}

function WeeklyPlan() {
	const { i18n, t } = useTranslation(['weekly_plan', 'common'])
	const isEng = i18n.language === 'en'
	const [popupData, setPopupData] = React.useState(null)
	const {
		currentApproval,
		setrefetchApprovals,
		refetchApprovals,
		refetchtaskProjects,
		setrefetchtaskProjects,
		openRequestApproval,
		setopenRequestApproval,
		allowTaskCursor,
		handleCommentTask,
		isDrawerOpen,
		setisDrawerOpen,
		setapprovalIdDrawerRight,
		setFromPage
	} = useMain()
	const [myEvents, setMyEvents] = React.useState([])
	const [isOpen, setOpen] = React.useState(false)
	const [isEdit, setEdit] = React.useState(false)
	const [mySelectedDate, setSelectedDate] = React.useState(currentApproval?.approval?.start || new Date())
	const [myResources, setMyResources] = React.useState([])
	const [invalid] = React.useState([
		{
			recurring: {
				repeat: 'daily',
			},
			resource: [],
		},
	])
	const [loader, setLoader] = React.useState(false)
	const [holidays, setHolidays] = React.useState(defaultHolidays)

	useEffect(() => {
		setopenRequestApproval(false)
		return () => {
			setisDrawerOpen(false)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (currentApproval) {
			setSelectedDate(currentApproval?.approval?.start)
		}
	}, [currentApproval])

	const { id } = useParams()

	const { data: approvals, refetch: refetchApprovalByProject } = useQuery(
		['ApprovalsByProject', id],
		({ queryKey }) => getApprovalsByProject(queryKey[1]),
		{
			select: (r) => r.data,
		}
	)

	useEffect(() => {
		if (refetchApprovals) {
			setrefetchApprovals(false)
			refetchApprovalByProject()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [refetchApprovals])

	useEffect(() => {
		if (refetchtaskProjects) {
			setrefetchtaskProjects(false)
			handleSetEvent()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [refetchtaskProjects])

	const { data: project } = useQuery(['project', id], ({ queryKey }) => getProjectDetails(queryKey[1]), {
		select: (r) => r.data,
	})

	const { refetch: handleSetEvent } = useQuery(
		['taskProjects', id],
		({ queryKey }) => listAllTasksByProject(queryKey[1]),
		{
			select: (r) => r.data,
			onSuccess: (data) => {
				setMyEvents(data?.map((e) => ({ ...e, resource: e.task_group_id })))
				setLoader(false)
			},
		}
	)

	const findDatesInApproval = useCallback(
		(startDate, endDate) => {
			const _approvals = approvals?.filter((data) => {
				const dataStartDate = new Date(data.start)
				const dataEndDate = new Date(data.end)
				const checkStartDate = new Date(startDate)
				const checkEndDate = new Date(endDate)

				const dataStartDateWithoutTime = new Date(
					dataStartDate.getFullYear(),
					dataStartDate.getMonth(),
					dataStartDate.getDate()
				)
				const dataEndDateWithoutTime = new Date(
					dataEndDate.getFullYear(),
					dataEndDate.getMonth(),
					dataEndDate.getDate()
				)
				const checkStartDateWithoutTime = new Date(
					checkStartDate.getFullYear(),
					checkStartDate.getMonth(),
					checkStartDate.getDate()
				)
				const checkEndDateWithoutTime = new Date(
					checkEndDate.getFullYear(),
					checkEndDate.getMonth(),
					checkEndDate.getDate()
				)
				return (
					dataStartDateWithoutTime <= checkStartDateWithoutTime &&
					dataEndDateWithoutTime >= checkStartDateWithoutTime &&
					dataStartDateWithoutTime <= checkEndDateWithoutTime &&
					dataEndDateWithoutTime >= checkEndDateWithoutTime
				)
			})

			return _approvals?.[_approvals.length - 1] || null
		},
		[approvals]
	)

	const renderCustomDay = (args) => {
		const { date } = args
		const isFirstDay = date.getDay() === 1

		moment.updateLocale('en', {
			week: {
				dow: 1,
			},
		})
		let [startOfWeek, endOfWeek, startNextWeek, endNextWeek, weekName] = ['', '', '', '', '']
		if (isFirstDay) {
			weekName = getWeekName(date)
			startOfWeek = moment(date).startOf('week').toDate()
			endOfWeek = moment(date).endOf('week').toDate()
			startNextWeek = moment(date).startOf('week').toDate()
			endNextWeek = moment(date).endOf('week').toDate()
		}

		const checkStatus = (isFirstDay && findDatesInApproval(startOfWeek, endOfWeek)?.status) || 'Pending'

		const div = (
			<div>
				<div className="first-day" style={{ borderBottom: `1px solid ${colorHeading[checkStatus]}` }}>
					{isFirstDay && (
						<>
							{weekName === WeekName.Current
								? `${t('week_progress')} (${fDateLocale(startOfWeek)} - ${fDateLocale(endOfWeek)})`
								: `${t(weekName === WeekName.Next ? 'next_week_plan' : 'last_week_plan')} (${fDateLocale(
										startNextWeek
								  )} - ${fDateLocale(endNextWeek)})`}
						</>
					)}
				</div>
				<div className="first-day" style={{ marginTop: 30, left: 100, fontSize: '0.88rem' }}>
					{isFirstDay && (
						<>
							<span>
								{t('approval_satus')}:{' '}
								<span style={{ color: colorHeading[checkStatus] }}>
									{checkStatus === ApprovalStatus.Planned ? 'Pending' : checkStatus}
								</span>
							</span>
						</>
					)}
				</div>
				<div style={{ marginTop: 60 }} className="main-day">
					<Stack p="10px" justifyContent="center" alignItems="center" className="">
						<Typography variant="body2" className="">
							{formatDate('DD', date)}
						</Typography>
						<Typography variant="caption" className="">
							{formatDate('DDD', date).substring(0, 1)}
						</Typography>
					</Stack>
				</div>
			</div>
		)
		return div
	}

	useEffect(() => {
		if (!id) return
		setLoader(true)
		listAllTaskGroups().then((data) => {
			setMyResources(data?.data)
		})
		handleSetEvent()
	}, [id, handleSetEvent])

	const renderCustomResource = (resource) => (
		<div className="md-resource-header-template-cont">
			<div className="md-resource-header-template-name">{resource.name}</div>
			<div className="md-resource-header-template-seats">Location</div>
		</div>
	)

	const renderCustomHeader = () => (
		<>
			<div className="md-resource-header-template-title">
				<div className="md-resource-header-template-name">{t('work')}</div>
				<div className="md-resource-header-template-seats">{t('location')}</div>
			</div>
		</>
	)

	const loadPopupForm = React.useCallback(
		(event) => {
			try {
				let startDate = new Date(event.start)
				let endDate = new Date(event.end)
				startDate = moment(startDate).format('YYYY-MM-DD')
				endDate = moment(endDate).format('YYYY-MM-DD')

				const data = {
					title: event.title,
					notes: event.notes,
					task_id: event.task_id,
					approval_status: event.approval_status,
					team: event.team,
					start: startDate,
					end: endDate,
					id: Number(event.id) || null,
					task_group_id: event.resource,
					from_page: 'weekly_plan',
					project: id,
					comments: event.comments,
				}
				setPopupData(data)
			} catch (error) {
				console.log(error)
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[myEvents]
	)

	const onSelectedDateChange = React.useCallback((event) => {
		setSelectedDate(event.date)
	}, [])

	const onEventClick = React.useCallback(
		(args) => {
			setEdit(true)
			// fill popup form with event data
			loadPopupForm(args.event)
			setOpen(true)
		},
		[loadPopupForm]
	)

	const onEventCreated = React.useCallback(
		(args) => {
			setEdit(false)
			// fill popup form with event data
			loadPopupForm(args.event)
			// open the popup
			setOpen(true)
		},
		[loadPopupForm]
	)

	const onEventDeleted = React.useCallback(
		(args) => {
			deleteTask(args.event)
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[deleteTask]
	)

	const onClose = React.useCallback(() => {
		if (!isEdit) {
			// refresh the list, if add popup was canceled, to remove the temporary event
			setMyEvents([...myEvents])
		}
		setOpen(false)
	}, [isEdit, myEvents])

	const handleClosePopup = React.useCallback(() => {
		setOpen(false)
		onClose()
	}, [onClose])

	const extendDefaultEvent = React.useCallback(
		() => ({
			title: '',
			project: Number(id),
		}),
		[id]
	)

	async function onPageLoading(event) {
		const start = new Date(event.firstDay)
		const end = new Date(event.lastDay)
		const data = await getHolidays(start, end)
		if (data) setHolidays([...defaultHolidays, ...data])
	}
	const renderHeader = () => (
		<>
			<Stack
				sx={{ color: 'black', background: 'white' }}
				flexDirection="row"
				justifyContent="space-between"
				width="100%"
			>
				<MuiButton size="small" color="inherit" sx={{ padding: 0, minWidth: 0 }}>
					<CalendarPrev className="cal-header-prev" />
				</MuiButton>
				<CalendarNav />
				<MuiButton size="small" color="inherit" sx={{ padding: 0, minWidth: 0 }}>
					<CalendarNext className="cal-header-next" />
				</MuiButton>
			</Stack>
		</>
	)

	const renderScheduleEvent = (event) => {
		const bgColor = event.original?.task_id
			? colorApprovalSubTask[event.original?.approval_status]
			: colorApprovalTask[event.original?.approval_status]

		return (
			<>
				<Stack
					component="div"
					justifyContent="flex-between"
					className="timeline-event"
					sx={{
						background: bgColor,
						boxShadow: (theme) => theme.customShadows.z8,
						justifyContent: 'flex-between',
						alignItems: 'initial !important',
						margin: !event.original?.task_id ? '3px 0 !important' : 0,
					}}
					onClick={(e) => {
						if (allowTaskCursor && !event.original?.task_id) {
							e.stopPropagation()
							handleCommentTask(event.id, event.title, event.original?.approval_status)
						}
					}}
				>
					{event.original?.comments?.length ? (
						<>
							<Box>
								<img
									width={16}
									height={16}
									src={'/static/icons/Message.svg'}
									alt={'message'}
									style={{ position: 'absolute', right: 5, top: -5 }}
								/>
							</Box>

							{event.title}
						</>
					) : (
						<>{event.title}</>
					)}
				</Stack>
			</>
		)
	}

	const handleDrag = (event) => {
		// eslint-disable-next-line no-unused-vars
		const { id, resource, created_at, allDay, comments, ...rest } = event
		updateTask({ ...rest, task_group_id: resource }, id)
	}

	return (
		<Page title="WP">
			<Container maxWidth="xl">
				<Box sx={{ position: 'absolute', top: 28, right: 44 }}>
					<MuiButton
						variant="contained"
						size="medium"
						color="inherit"
						sx={{ border: '1px solid #596570' }}
						onClick={() => setopenRequestApproval(!openRequestApproval)}
					>
						{t('request_approval')}
					</MuiButton>
					<MuiButton
						onClick={() => {
							setapprovalIdDrawerRight(null)
							setisDrawerOpen(true)
							setFromPage("weekly_plan")
						}}
						variant="contained"
						size="medium"
						color="inherit"
						sx={{ background: '#8D99FF', marginLeft: 1, minWidth: 40, width: 40, padding: '5px 0', height: 37 }}
					>
						<Iconify icon="uil:bars" width={25} height={25} color="white" />
					</MuiButton>
				</Box>
				<Box sx={{ display: "flex", gap: "16px" }}>

					<Box sx={{ display: "flex", flexDirection: "column", width: '25% ', gap: "16px" }}> 
						<LeftMenu project={project} />
						<ProgressRate />
					</Box>
					<Box sx={{ display: "flex", flexDirection: "column", width: '100%' }}>
						<Box className="weekly-calender" position={'relative'}>
							<Loader open={loader} setOpen={setLoader} />
							<Drawer />
							<Eventcalendar
								renderResourceHeader={renderCustomHeader}
								renderHeader={renderHeader}
								view={viewSettings}
								data={myEvents}
								invalid={invalid}
								displayTimezone="local"
								dataTimezone="local"
								onPageLoading={onPageLoading}
								renderResource={renderCustomResource}
								renderScheduleEvent={renderScheduleEvent}
								resources={myResources}
								clickToCreate="double"
								dragToCreate={true}
								onEventDragEnd={({ event }) => handleDrag(event)}
								dragToMove
								dragToResize
								externalDrop
								dragTimeStep={30}
								selectedDate={mySelectedDate}
								onSelectedDateChange={onSelectedDateChange}
								onEventClick={onEventClick}
								onEventCreated={onEventCreated}
								onEventDeleted={onEventDeleted}
								extendDefaultEvent={extendDefaultEvent}
								colors={holidays}
								renderDay={renderCustomDay}
								cssClass="md-resource-header-template .mbsc-timeline.mbsc-ltr mbsc-calendar-projects md-timeline-height"
								dayNamesMin={['S', 'M', 'T', 'W', 'T', 'F', 'S']}
								locale={isEng ? undefined : localeKo}
								
 							/>

							<AddFormPopup
								data={popupData}
								handleClose={handleClosePopup}
								anchor={isOpen}
								handleSetEvent={handleSetEvent}
								myEvents={myEvents}
							/>
						</Box>
					</Box>
				</Box>
			</Container>

			{isDrawerOpen && <BasicTabs open={isDrawerOpen} setopen={setisDrawerOpen} />}
			{openRequestApproval && <RequestApproval />}
		</Page>
	)
}

export default WeeklyPlan
