import useMain from 'pages/context/context'
import React, { useState } from 'react'
import Box from '@mui/material/Box'
import LeftDrawer from 'components/LeftDrawer'
import {
	Avatar,
	Button,
	Chip,
	CircularProgress,
	Divider,
	InputAdornment,
	Paper,
	Skeleton,
	Stack,
	TextField,
	Typography,
} from '@mui/material'
import Iconify from 'components/Iconify'
import PayAttention from './Dialogs/PayAttention'
import Rejection from './Dialogs/Rejection'
import { useQuery } from 'react-query'
import { getApproversByApproval, updateApproval, updateApprovers } from 'supabase/approval'
import { fDateLocale } from 'utils/formatTime'
import { ApprovalStatus, getNameApprovalStatus } from 'constant'
import { useTranslation } from 'react-i18next'
import { colorApprovalTask } from 'pages/WeeklyPlan/WeeklyPlan'
import { createComment, getCommentsByApproval } from 'supabase'

export default function ApprovalRequest() {
	const { t } = useTranslation()
	const {
		openaccoutReview,
		setopenaccoutReview,
		currentApproval,
		setopenNotification,
		setcurrentApproval,
		setrefetchApprovals,
		setrefetchtaskProjects,
		allowTaskCursor,
		setallowTaskCursor,
		commentTasks,
		handleCommentTask,
		currentEmployee,
		setcommentTasks,
	} = useMain()
	const { approval, employee } = currentApproval || {}
	const { project, from_page, start, end } = approval || {}
	const [addComment, setaddComment] = useState(false)
	const [openSaveDialog, setopenSaveDialog] = React.useState(false)
	const [openRejectionDialog, setopenRejectionDialog] = useState(false)
	const [isUpdating, setisUpdating] = useState(false)
	const [commentText, setcommentText] = useState('')

	const { data: approvers } = useQuery(['Approvers'], () => getApproversByApproval(approval.id), {
		select: (r) => r.data.sort((a, b) => a.order - b.order),
		enabled: !!currentApproval,
	})

	const {
		data: comments,
		isFetching: loadingComments,
		refetch: refetchApprovalComments,
	} = useQuery(['ApprovalComments'], () => getCommentsByApproval(approval.id), {
		select: (r) => r.data.sort((a, b) => a.order - b.order),
		enabled: !!currentApproval,
	})

	const currentApproverStatus = approvers?.find((e) => e.employee.id === employee.id)?.status

	const handleCloseDrawer = () => {
		setcurrentApproval(null)
		setopenaccoutReview(false)
	}

	const handleSaveDialogOpen = () => {
		setopenSaveDialog(true)
	}
	const handleSaveDialogClose = () => {
		setopenSaveDialog(false)
		handleCloseDrawer()
	}

	// eslint-disable-next-line no-unused-vars
	const handleRejectionDialogOpen = () => {
		setopenRejectionDialog(true)
	}
	const handleRejectionDialogClose = () => {
		setopenRejectionDialog(false)
		handleCloseDrawer()
	}

	const handleApproveReject = (status, rejection_comment = '') => {
		setisUpdating(true)
		updateApprovers(
			{
				status,
				rejection_comment,
			},
			currentApproval.id
		)
			.then(async () => {
				// if all approvers mark this as approved then update approval status
				const checkTotalApproved = approvers.filter((e) => e.status === ApprovalStatus.Approved)
				const checkTotalRejected = approvers.filter((e) => e.status === ApprovalStatus.Rejected)
				if (
					(checkTotalApproved?.length === approvers.length - 1 && status === ApprovalStatus.Approved) ||
					(checkTotalRejected?.length === approvers.length - 1 && status === ApprovalStatus.Rejected)
				) {
					await updateApproval({ status }, approval.id)
					setrefetchApprovals(true)
				}

				setisUpdating(false)
				handleCloseDrawer()
			})
			.catch((err) => {
				console.error(err)
				setisUpdating(false)
			})
	}

	const saveComment = async () => {
		if ((allowTaskCursor && !commentTasks.length) || !commentText) return
		if (!commentTasks.length) {
			await createComment({
				body: commentText,
				employee: currentEmployee.id,
				approval: approval.id,
			})
			refetchApprovalComments()
			resetComment()
		} else {
			const promises = commentTasks?.map((obj) => {
				createComment({
					body: commentText,
					project_task: obj.id,
					employee: currentEmployee.id,
					approval: approval.id,
				})
				return null
			})
			await Promise.all(promises)
			setrefetchtaskProjects(true)
			resetComment()
		}
	}

	const resetComment = () => {
		setallowTaskCursor(false)
		setcommentTasks([])
		setcommentText('')
		setaddComment(false)
	}

	return (
		<>
			<LeftDrawer
				variant="permanent"
				open={openaccoutReview}
				setopen={setopenaccoutReview}
				headerText={t('approval_request')}
				onBack={() => {
					setopenNotification(true)
					handleCloseDrawer()
				}}
				headerRightSide={
					<Typography sx={{ color: '#FF6B00', fontSize: '0.8rem' }}>
						{t('deadline')}: {fDateLocale(approval.deadline)}
					</Typography>
				}
			>
				{/* <Stack
					direction="row"
					gap={1}
					alignItems={'center'}
					sx={{ height: 50, padding: '3px 25px', background: '#F9F9FA' }}
				>
					<>
						<Avatar alt="avatar image" sx={{ width: 40, height: 40, textTransform: 'capitalize' }}>
							{employee.name ? employee.name[0] : employee.email_address[0]}
						</Avatar>
						<Typography variant="body1">{employee.name || employee.email_addres}</Typography>
					</>
				</Stack> */}
				<Box style={{ padding: '3px 18px' }}>
					<Stack direction="row" gap={1} alignItems={'center'} justifyContent={'space-between'}>
						<Typography sx={{ fontWeight: 600 }}>{t('approvers')}</Typography>
						<Typography
							sx={{
								color: (theme) => theme.palette.primary.light,
								fontSize: '0.8rem',
								display: 'flex',
								alignItems: 'center',
							}}
						>
							{t('detail_history')}
							<Iconify icon={'ic:round-arrow-forward'} width={15} height={15} />
						</Typography>
					</Stack>

					<Stack
						direction="row"
						gap={'12px'}
						mt={1}
						sx={{
							overflowX: 'auto',
							'&::-webkit-scrollbar': {
								height: '0.1rem',
							},
							'&::-webkit-scrollbar-thumb': {
								backgroundColor: '#8D99FF',
								outline: '1px solid #8D99FF',
							},
						}}
					>
						{approvers?.map((e) => (
							<Box
								key={e.id}
								sx={{
									position: 'relative',
									textAlign: 'center',
									maxWidth: 55,
								}}
							>
								<Avatar alt="avatar image" sx={{ width: 45, height: 45, textTransform: 'capitalize' }}>
									{e.employee.name ? e.employee.name[0] : e.employee.email_address[0]}
								</Avatar>
								<Box sx={{ position: 'absolute', right: 5, top: 28 }}>
									<img
										style={{ width: 20, height: 20 }}
										src={`/static/icons/${
											// eslint-disable-next-line no-nested-ternary
											e.status === ApprovalStatus.Planned
												? 'pending.svg'
												: e.status === ApprovalStatus.Approved
												? 'approve.svg'
												: 'reject.svg'
										}`}
										alt="icon"
									/>
								</Box>
								<Typography
									variant="body2"
									fontWeight={600}
									mt={'5px'}
									sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
								>
									{e.employee.name || e.employee.email_address}
								</Typography>
							</Box>
						))}
					</Stack>
				</Box>

				<Box sx={{ background: '#F9F9FA' }}>
					<Box mt={1} sx={{ padding: '3px 12px' }}>
						<Stack direction="row" gap={1} alignItems={'center'} mt={'3px'}>
							<Iconify icon="pepicons-pop:ruler-off" sx={{ minWidth: 18, minHeight: 18, paddingLeft: '5px' }} />
							<Typography variant="body2">{project?.title}</Typography>
						</Stack>

						<Stack direction="row" gap={1} alignItems={'center'} mt={'3px'}>
							<Iconify icon="grommet-icons:form-attachment" sx={{ minWidth: 22, minHeight: 22 }} />
							<Typography variant="body2">{getNameApprovalStatus[from_page]}</Typography>
						</Stack>

						<Stack direction="row" gap={1} alignItems={'center'} mt={'3px'}>
							<Iconify icon="mdi:timer-sand" sx={{ minWidth: 16, minHeight: 16, paddingLeft: '3px' }} />
							<Typography variant="body2">
								{fDateLocale(start)} - {fDateLocale(end)}
							</Typography>
						</Stack>
					</Box>

					<Divider sx={{ marginTop: 1 }} />

					<Box sx={{ padding: '3px 10px', background: '#F9F9FA' }}>
						<Typography variant="body2" fontWeight={600} fontSize={16}>
							{t('comments')}
						</Typography>

						<Box
							sx={{
								height: '37vh',
								overflowY: 'auto',
								'&::-webkit-scrollbar': {
									width: '0.1rem',
									height: '10px',
								},
								'&::-webkit-scrollbar-thumb': {
									backgroundColor: '#212B36',
									outline: '1px solid #212B36',
									borderRadius: 2,
								},
							}}
						>
							{!comments?.length && (
								<>
									{loadingComments ? (
										<Skeleton variant="rectangular" width={'100%'} height={60} sx={{ borderRadius: 1 }} />
									) : (
										<Typography variant="body2" fontWeight={600} fontSize={16} textAlign={'center'}>
											{t('no_comment')}
										</Typography>
									)}
								</>
							)}
							{comments?.map((c) => (
								<Paper
									key={c.id}
									elevation={2}
									sx={{ border: '1px solid transparent', borderRadius: 1, padding: '7px', margin: '8px 5px 0' }}
								>
									<Box>
										<Stack direction={'row'} alignItems={'center'} gap={'6px'}>
											<Avatar alt="emp image" sx={{ width: 35, height: 35, textTransform: 'capitalize' }}>
												{c.employee.name ? c.employee.name[0] : c.employee.email_address[0]}
											</Avatar>
											<Typography variant="body2">
												{c.employee?.name || c.employee?.email_address}, {new Date(c.created_at).toLocaleDateString()}
											</Typography>
										</Stack>
										<Typography variant="body2" sx={{ color: '#596570', fontSize: '0.8rem' }}>
											{c.body}
										</Typography>
									</Box>
								</Paper>
							))}
						</Box>
					</Box>
				</Box>

				<Paper
					elevation={8}
					sx={{ padding: '2px 15px', background: 'white', position: 'absolute', bottom: 0, width: '100%' }}
				>
					<Box
						sx={{
							background: '#F9F9FA',
							border: '1px solid transparent',
							borderRadius: 1,
							padding: '3px 7px',
							marginTop: 1,
						}}
					>
						{addComment ? (
							<>
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
										margin: '4px 0px',
										paddingBottom: '1px',
										justifyContent: 'space-between',
									}}
								>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
										<h5>{t('add_comment')}</h5>
										{!allowTaskCursor && (
											<Chip
												size="small"
												variant="outlined"
												label={t('global')}
												color="info"
												sx={{
													borderRadius: '6px',
													height: 20,
													fontSize: '0.78rem',
													'.MuiChip-label': { padding: '0 4px' },
												}}
											/>
										)}
										<Button
											sx={{
												background: !allowTaskCursor ? '#FF6B00' : 'white',
												padding: '4px 0',
												minWidth: 20,
												borderRadius: '5px',
												boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)',
											}}
											onClick={() => setallowTaskCursor(!allowTaskCursor)}
										>
											<Iconify
												icon="ph:cursor-click-light"
												sx={{ color: !allowTaskCursor ? 'white' : 'black' }}
												width={12}
												height={12}
											/>
										</Button>
									</Box>
									<Iconify icon="charm:cross" sx={{ float: 'right' }} onClick={resetComment} width={20} height={20} />
								</Box>

								<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, paddingBottom: commentTasks ? '10px' : '3px' }}>
									{commentTasks?.map((t) => (
										<Box
											key={t.id}
											sx={{
												background: colorApprovalTask[t.status],
												padding: '0 5px',
												borderRadius: '7px',
												textTransform: 'uppercase',
												display: 'flex',
												alignItems: 'center',
												color: 'white',
												fontSize: '0.8rem',
											}}
										>
											{t.title}
											<Iconify
												icon="basil:cross-outline"
												sx={{ cursor: 'pointer', marginLeft: '3px' }}
												width={22}
												height={22}
												onClick={() => handleCommentTask(t.id)}
											/>
										</Box>
									))}
								</Box>

								<TextField
									name="comment"
									value={commentText}
									onChange={(e) => setcommentText(e.target.value)}
									fullWidth
									label="Text here"
									multiline
									onKeyPress={(e) => {
										if (e.key === 'Enter') {
											e.preventDefault()
											saveComment()
										}
									}}
									InputProps={{
										endAdornment: (
											<InputAdornment position="end">
												{!!commentText && (
													<Button
														onClick={saveComment}
														sx={{
															background: '#8D99FF',
															padding: '4px 0',
															float: 'right',
															minWidth: 22,
															minHeight: 22,
															borderRadius: 5,
														}}
														disabled={false}
													>
														<Iconify icon="formkit:arrowup" sx={{ color: 'white' }} width={15} height={15} />
													</Button>
												)}
											</InputAdornment>
										),
									}}
									helperText={allowTaskCursor && commentText && !commentTasks.length && t('please_select_task')}
								/>
							</>
						) : (
							<>
								<Stack
									direction={'row'}
									justifyContent={'space-between'}
									sx={{ cursor: 'pointer' }}
									mt={1}
									onClick={() => setaddComment(true)}
								>
									<h5 style={{ marginBottom: 5 }}>{t('add_comment')}</h5>
									<Iconify icon="material-symbols:add" width={16} height={16} />
								</Stack>
							</>
						)}
					</Box>

					{currentApproverStatus === ApprovalStatus.Planned ? (
						<>
							<Stack direction={'row'} justifyContent={'space-between'} mt={1} gap={2}>
								<Button
									variant="contained"
									size="small"
									color="inherit"
									sx={{ border: '1px solid #FF6B00', color: '#FF6B00', flex: 1 }}
									startIcon={
										isUpdating ? (
											<CircularProgress size={17} sx={{ color: '#FF6B00' }} />
										) : (
											<Iconify icon="carbon:close" width={17} height={17} />
										)
									}
									onClick={handleRejectionDialogOpen}
									disabled={isUpdating}
								>
									{t('reject')}
								</Button>

								<Button
									variant="contained"
									size="small"
									color="inherit"
									sx={{
										border: '1px solid #8CCC67',
										color: '#8CCC67',
										flex: 1,
										':disabled': {
											color: '#8CCC67',
										},
									}}
									startIcon={
										isUpdating ? (
											<CircularProgress size={17} sx={{ color: '#8CCC67' }} />
										) : (
											<Iconify icon="charm:tick" width={17} height={17} />
										)
									}
									onClick={() => handleApproveReject(ApprovalStatus.Approved)}
									disabled={isUpdating}
								>
									{t('approve')}
								</Button>
							</Stack>

							<Box sx={{ margin: 'auto', width: '100%', textAlign: 'center' }}>
								<Button
									size="small"
									color="inherit"
									sx={{ margin: '5px' }}
									onClick={handleSaveDialogOpen}
									disabled={isUpdating}
								>
									{t('continue_later')}
								</Button>
							</Box>
						</>
					) : (
						!!currentApproverStatus && (
							<Box sx={{ margin: 'auto', width: '100%', textAlign: 'center' }} pt={2} pb={3}>
								<Typography variant="h5" sx={{ color: colorApprovalTask[currentApproverStatus] }}>
									{t('status')} {currentApproverStatus === ApprovalStatus.Approved ? 'Approved' : 'Rejected'}
								</Typography>
							</Box>
						)
					)}
				</Paper>
			</LeftDrawer>

			<PayAttention handleClose={handleSaveDialogClose} open={openSaveDialog} setopenSaveDialog={setopenSaveDialog} />

			<Rejection
				handleClose={handleRejectionDialogClose}
				open={openRejectionDialog}
				setopenRejectionDialog={setopenRejectionDialog}
				handleApproveReject={handleApproveReject}
				isUpdating={isUpdating}
			/>
		</>
	)
}
