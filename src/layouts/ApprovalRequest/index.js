import useMain from 'pages/context/context'
import React, { useState } from 'react'
import Box from '@mui/material/Box'
import LeftDrawer from 'components/LeftDrawer'
import { Avatar, Button, CircularProgress, InputAdornment, Paper, Stack, TextField, Typography } from '@mui/material'
import Iconify from 'components/Iconify'
import PayAttention from './Dialogs/PayAttention'
import Rejection from './Dialogs/Rejection'
import { useQuery } from 'react-query'
import { getApproversByApproval, updateApproval, updateApprovers } from 'supabase/approval'
import { fDateLocale } from 'utils/formatTime'
import { ApprovalStatus, getNameApprovalStatus } from 'constant'

export default function ApprovalRequest() {
	const { openaccoutReview, setopenaccoutReview, currentApproval, setopenNotification, setcurrentApproval } = useMain()
	const { approval, employee } = currentApproval || {}
	const { project, from_page, start, end } = approval || {}
	const [addComment, setaddComment] = useState(false)
	const [openSaveDialog, setopenSaveDialog] = React.useState(false)
	const [openRejectionDialog, setopenRejectionDialog] = useState(false)
	const [isUpdating, setisUpdating] = useState(false)

	const { data: approvers } = useQuery(['Approvers'], () => getApproversByApproval(approval.id), {
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
				}

				setisUpdating(false)
				handleCloseDrawer()
			})
			.catch((err) => {
				console.error(err)
				setisUpdating(false)
			})
	}

	return (
		<>
			<LeftDrawer
				variant="permanent"
				open={openaccoutReview}
				setopen={setopenaccoutReview}
				headerText={'Approval Request'}
				onBack={() => {
					setopenNotification(true)
					handleCloseDrawer()
				}}
				headerRightSide={
					<Typography sx={{ color: '#FF6B00', fontSize: '0.8rem' }}>
						Deadline: {fDateLocale(approval.deadline)}
					</Typography>
				}
			>
				<Stack
					direction="row"
					gap={1}
					alignItems={'center'}
					sx={{ height: 70, padding: '3px 20px', background: '#F9F9FA' }}
				>
					<>
						<Avatar alt="avatar image" sx={{ width: 50, height: 50, textTransform: 'capitalize' }}>
							{employee.name ? employee.name[0] : employee.email_address[0]}
						</Avatar>
						<Typography variant="body1">{employee.name || employee.email_addres}</Typography>
					</>
				</Stack>
				<Box style={{ padding: '5px 20px' }}>
					<Stack direction="row" gap={1} alignItems={'center'} justifyContent={'space-between'}>
						<Typography sx={{}}>Approvers</Typography>
						<Typography
							sx={{
								color: (theme) => theme.palette.primary.light,
								fontSize: '0.8rem',
								display: 'flex',
								alignItems: 'center',
							}}
						>
							See detailed history
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
								<Avatar alt="avatar image" sx={{ width: 50, height: 50, textTransform: 'capitalize' }}>
									{e.employee.name ? e.employee.name[0] : e.employee.email_address[0]}
								</Avatar>
								<Box sx={{ position: 'absolute', right: 2, top: 32 }}>
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
									mt={1}
									sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
								>
									{e.employee.name || e.employee.email_address}
								</Typography>
							</Box>
						))}
					</Stack>
				</Box>

				<Box sx={{ padding: '3px 20px', background: '#F9F9FA' }}>
					<Box mt={2}>
						<Stack direction="row" gap={2} justifyContent={'space-between'}>
							<Stack direction="row" gap={1} alignItems={'center'} width={'45%'}>
								<Iconify icon="pepicons-pop:ruler-off" sx={{ minWidth: 20, minHeight: 20 }} />
								<Typography variant="body2">{project?.title}</Typography>
							</Stack>

							<Stack direction="row" gap={1} alignItems={'center'} width={'45%'}>
								<Iconify icon="grommet-icons:form-attachment" sx={{ minWidth: 25, minHeight: 25 }} />
								<Typography variant="body2">{getNameApprovalStatus[from_page]}</Typography>
							</Stack>
						</Stack>
						<Stack direction="row" gap={1} alignItems={'center'} mt={1}>
							<Iconify icon="mdi:timer-sand" sx={{ minWidth: 20, minHeight: 20 }} />
							<Typography variant="body2">
								{fDateLocale(start)} - {fDateLocale(end)}
							</Typography>
						</Stack>
					</Box>

					<Paper elevation={12} sx={{ border: '1px solid transparent', borderRadius: 1, padding: '7px', marginTop: 2 }}>
						{!!approval.comment && (
							<Box>
								<Typography variant="body2">
									{approval.created_by}, {new Date(approval.created_at).toLocaleDateString()}
								</Typography>
								<Typography variant="body2" sx={{ color: '#596570', fontSize: '0.8rem' }}>
									{approval.comment}
								</Typography>
							</Box>
						)}
					</Paper>

					{/* <Paper elevation={12} sx={{ border: '1px solid transparent', borderRadius: 1, padding: '7px', marginTop: 1 }}>
						<Stack direction="row" justifyContent={'space-between'}>
							<Box>
								<Typography variant="body2">Lodging, Steven T. Joy, 03/01/2022</Typography>
							</Box>
							<Iconify icon="pepicons-pencil:dots-y" />
						</Stack>
					</Paper> */}

					<Paper
						elevation={12}
						sx={{ border: '1px solid transparent', borderRadius: 1, padding: '5px 7px', marginTop: 1 }}
					>
						{addComment ? (
							<>
								<h5 style={{ marginBottom: 5 }}>Add Comment</h5>
								<div style={{ fontSize: '0.85rem', marginBottom: 3 }}>Comment</div>
								<TextField
									name="comment"
									value={''}
									fullWidth
									label="Text here"
									multiline
									InputProps={{
										endAdornment: (
											<InputAdornment position="end">
												<Typography
													variant="body2"
													sx={{
														color: (theme) => theme.palette.primary.light,
														alignItems: 'center',
														display: 'flex',
													}}
												>
													Send
													<Iconify icon="carbon:send" style={{ transform: 'rotate(270deg)' }} />
												</Typography>
											</InputAdornment>
										),
									}}
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
									<h5 style={{ marginBottom: 5 }}>Add Comment</h5>
									<Iconify icon="material-symbols:add" width={16} height={16} />
								</Stack>
							</>
						)}
					</Paper>

					{currentApproverStatus === ApprovalStatus.Planned ? (
						<>
							<Stack direction={'row'} justifyContent={'space-between'} mt={2} gap={2}>
								<Button
									variant="contained"
									size="medium"
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
									Reject
								</Button>

								<Button
									variant="contained"
									size="medium"
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
									Approve
								</Button>
							</Stack>

							<Box sx={{ margin: 'auto', width: '100%', textAlign: 'center' }}>
								<Button
									size="medium"
									color="inherit"
									sx={{ margin: '12px 0 25px' }}
									onClick={handleSaveDialogOpen}
									disabled={isUpdating}
								>
									Save & Continue Later
								</Button>
							</Box>
						</>
					) : (
						!!currentApproverStatus && (
							<Box sx={{ margin: 'auto', width: '100%', textAlign: 'center' }} pt={2}>
								<Typography variant="h5">
									Status {currentApproverStatus === ApprovalStatus.Approved ? 'Approved' : 'Rejected'}
								</Typography>
							</Box>
						)
					)}
				</Box>
			</LeftDrawer>

			<PayAttention handleClose={handleSaveDialogClose} open={openSaveDialog} setopenSaveDialog={setopenSaveDialog} />

			<Rejection
				handleClose={handleRejectionDialogClose}
				open={openRejectionDialog}
				setopenRejectionDialog={setopenRejectionDialog}
				handleApproveReject={handleApproveReject}
			/>
		</>
	)
}
