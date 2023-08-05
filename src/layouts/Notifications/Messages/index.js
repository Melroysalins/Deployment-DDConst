import { useState } from 'react'
import {
	Avatar,
	Typography,
	ListItemText,
	ListItemAvatar,
	ListItemButton,
	Box,
	CircularProgress,
	Stack,
} from '@mui/material'
import Scrollbar from 'components/Scrollbar'
import Iconify from 'components/Iconify'
import { getApproversDetailByEmployee } from 'supabase/approval'
import { useQuery } from 'react-query'
import moment from 'moment'
import PropTypes from 'prop-types'
import { fDateLocale } from 'utils/formatTime'
import useMain from 'pages/context/context'
import { useNavigate } from 'react-router-dom'
import { ApprovalStatus } from 'constant'

const currentDate = moment()
const groupObjectsByDate = (approvals) => {
	const today = []
	const yesterday = []
	const older = []

	approvals.sort((a, b) => moment(b.approval.created_at) - moment(a.approval.created_at))

	approvals.forEach((obj) => {
		const objDate = moment(obj.approval.created_at)

		if (objDate.isSame(currentDate, 'day')) {
			today.push(obj)
		} else if (objDate.isSame(currentDate.clone().subtract(1, 'days'), 'day')) {
			yesterday.push(obj)
		} else {
			older.push(obj)
		}
	})

	return { today, yesterday, older }
}

export default function Messages() {
	const [approvalsArr, setapprovalsArr] = useState([])
	const { currentEmployee } = useMain()

	const { isFetching } = useQuery(['ApproverDetail'], () => getApproversDetailByEmployee(currentEmployee.id), {
		select: (r) => r.data,
		enabled: !!currentEmployee?.id,
		onSuccess: (data) => {
			setapprovalsArr(groupObjectsByDate(data))
		},
	})
	return (
		<>
			<Scrollbar>
				{approvalsArr.today?.map((notification) => (
					<TaskNotification key={notification.id} notification={notification} />
				))}

				<Box>
					<Typography variant="body1" sx={{ fontWeight: 600 }}>
						Yesterday
					</Typography>
					{!approvalsArr.yesterday?.length ? (
						<Box sx={{ fontWeight: 600, marginBottom: 3 }} align="center" mt={2}>
							{isFetching ? <CircularProgress size={22} fontSize="inherit" /> : 'No Notication Found'}
						</Box>
					) : null}
				</Box>

				{approvalsArr.yesterday?.map((notification) => (
					<TaskNotification key={notification.id} notification={notification} />
				))}
				<Box>
					<Typography variant="body2" sx={{ fontWeight: 600 }}>
						Older
					</Typography>
					{!approvalsArr.older?.length ? (
						<Box sx={{ fontWeight: 600, marginBottom: 3 }} align="center" mt={2}>
							{isFetching ? <CircularProgress size={22} fontSize="inherit" /> : 'No Notication Found'}
						</Box>
					) : null}
				</Box>

				{approvalsArr.older?.map((notification) => (
					<TaskNotification key={notification.id} notification={notification} />
				))}
			</Scrollbar>
		</>
	)
}

TaskNotification.propTypes = {
	notification: PropTypes.object,
}

function TaskNotification({ notification }) {
	const { avatar, title, created_at } = RenderContent(notification)
	const hoursAgo = moment().diff(moment(created_at), 'hours')
	return (
		<ListItemButton sx={{ padding: '0px' }}>
			<ListItemAvatar sx={{ width: 50, height: 90 }}>
				<Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
			</ListItemAvatar>
			<ListItemText
				primary={title}
				secondary={<Typography variant="caption">{hoursAgo} hours ago . Task</Typography>}
			/>
		</ListItemButton>
	)
}

// ----------------------------------------------------------------------

function RenderContent(notification) {
	const { setopenaccoutReview, setcurrentApproval, setopenNotification } = useMain()
	const navigate = useNavigate()

	const handlePageNavigation = (detail) => {
		setcurrentApproval(detail)
		setopenaccoutReview(true)
		navigate(`/dashboard/projects/${detail.approval.project.id}/weekly-plan`, { replace: true })
		setopenNotification(false)
	}

	const { project, from_page, start, end, created_at, status } = notification.approval || {}
	const title = (
		<>
			<Stack flexDirection={'row'} justifyContent={'space-between'}>
				<Typography variant="subtitle2">Approval Request</Typography>
				{status !== ApprovalStatus.Planned && (
					<img
						style={{ width: 18, height: 18 }}
						src={`/static/icons/${status === ApprovalStatus.Approved ? 'approve.svg' : 'reject.svg'}`}
						alt="icon"
					/>
				)}
			</Stack>
			<Typography variant="body2">
				<Typography variant="caption" sx={{ color: (theme) => theme.palette.primary.light, fontSize: '14px' }}>
					{notification.title}
				</Typography>

				<Typography
					component="span"
					variant="body2"
					sx={{ color: (theme) => theme.palette.primary.light, cursor: 'auto' }}
				>
					Automated
				</Typography>
				<Typography
					component="span"
					variant="body2"
					sx={{ color: 'text.secondary', cursor: 'auto', fontSize: '0.9rem' }}
				>
					&nbsp;Approval request for {project.title} {from_page} ( {fDateLocale(start)} - {fDateLocale(end)} )
				</Typography>

				<Typography
					variant="body2"
					sx={{
						color: (theme) => theme.palette.primary.light,
						fontSize: '12px',
						fontWeight: 600,
						display: 'flex',
						alignItems: 'center',
					}}
					onClick={() => handlePageNavigation(notification)}
				>
					Go to Page&nbsp;
					<Iconify icon="ic:round-arrow-forward" width={15} sx={{ fontWeight: 600 }} />
				</Typography>
			</Typography>
		</>
	)

	return {
		avatar: (
			<img
				alt={notification.approval.title}
				style={{ width: 35, height: 35 }}
				src={notification.approval.avatar || '/static/logo.svg'}
			/>
		),
		title,
		created_at,
	}
}
