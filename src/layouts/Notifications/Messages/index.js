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
import { useTranslation } from 'react-i18next'

const currentDate = moment()
const groupObjectsByDate = (approvals) => {
	const [today, last7Days, yesterday, older] = [[], [], [], []]

	approvals.sort((a, b) => moment(b.approval.created_at) - moment(a.approval.created_at))

	approvals.forEach((obj) => {
		const objDate = moment(obj.approval.created_at)
		const daysAgo = currentDate.diff(objDate, 'days')

		if (daysAgo === 0) {
			today.push(obj)
		} else if (daysAgo === 1) {
			yesterday.push(obj)
		} else if (daysAgo <= 7) {
			last7Days.push(obj)
		} else {
			older.push(obj)
		}
	})

	return { today, yesterday, last7Days, older }
}

export default function Messages() {
	const [approvalsArr, setapprovalsArr] = useState([])
	const { currentEmployee } = useMain()
	const { t } = useTranslation()

	const { isFetching } = useQuery(['ApproverDetail'], () => getApproversDetailByEmployee(currentEmployee.id), {
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
						{t('yesterday')}
					</Typography>
					{!approvalsArr.yesterday?.length ? (
						<Box sx={{ fontWeight: 600, marginBottom: 3 }} align="center" mt={2}>
							{isFetching ? <CircularProgress size={22} fontSize="inherit" /> : t('no_notification')}
						</Box>
					) : null}
				</Box>
				{approvalsArr.yesterday?.map((notification) => (
					<TaskNotification key={notification.id} notification={notification} />
				))}

				<Box>
					<Typography variant="body1" sx={{ fontWeight: 600 }}>
						{t('last7days')}
					</Typography>
					{!approvalsArr.last7Days?.length ? (
						<Box sx={{ fontWeight: 600, marginBottom: 3 }} align="center" mt={2}>
							{isFetching ? <CircularProgress size={22} fontSize="inherit" /> : t('no_notification')}
						</Box>
					) : null}
				</Box>
				{approvalsArr.last7Days?.map((notification) => (
					<TaskNotification key={notification.id} notification={notification} />
				))}

				<Box>
					<Typography variant="body2" sx={{ fontWeight: 600 }}>
						{t('older')}
					</Typography>
					{!approvalsArr.older?.length ? (
						<Box sx={{ fontWeight: 600, marginBottom: 3 }} align="center" mt={2}>
							{isFetching ? <CircularProgress size={22} fontSize="inherit" /> : t('no_notification')}
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
	const { setopenaccoutReview, currentApproval, setcurrentApproval, setopenNotification, currentEmployee } = useMain()
	const navigate = useNavigate()
	const { t } = useTranslation()

	const handlePageNavigation = (detail) => {
		setcurrentApproval(detail)
		setopenaccoutReview(true)
		navigate(`/dashboard/projects/${detail.approval.project.id}/${detail.approval.from_page === 'weekly_plan' ? 'weekly-plan' : 'travel-expenses'}`, { replace: true })
		setopenNotification(false)
	}

	const { approval, employee, status: approverStatus, rejection_comment } = notification
	const { project, from_page, start, end, created_at, status } = approval || {}

	const isRejected =
		currentEmployee && currentEmployee.id !== employee?.id && approverStatus === ApprovalStatus.Rejected
	const title = (
		<>
			<Stack flexDirection={'row'} justifyContent={'space-between'}>
				<Typography variant="subtitle2">{t(isRejected ? 'approval_rejected' : 'approval_request')}</Typography>
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
					{t('automated')}
				</Typography>
				<Typography
					component="span"
					variant="body2"
					sx={{ color: 'text.secondary', cursor: 'auto', fontSize: '0.9rem' }}
				>
					&nbsp;{t('approval_request_for')} {project.title} {from_page}
					{` `}
					<Typography variant="caption">
						({fDateLocale(start)} - {fDateLocale(end)})
					</Typography>
					<Typography sx={{ color: '#FF6B00' }} variant="caption">
						{isRejected ? (
							<>
								- Rejected by {employee?.name} <b>{`\n`}Reason:</b> {rejection_comment}
							</>
						) : (
							''
						)}
					</Typography>
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
					{t('goto_page')} &nbsp;
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
