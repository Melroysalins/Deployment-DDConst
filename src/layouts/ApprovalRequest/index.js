import useMain from 'pages/context/context'
import React, { useState } from 'react'
import Box from '@mui/material/Box'
import LeftDrawer from 'components/LeftDrawer'
import { Avatar, Button, InputAdornment, Paper, Stack, TextField, Typography } from '@mui/material'
import Iconify from 'components/Iconify'
import PayAttention from './Dialogs/PayAttention'
import Rejection from './Dialogs/Rejection'

export default function ApprovalRequest() {
	const { openaccoutReview, setopenaccoutReview } = useMain()
	const [addComment, setaddComment] = useState(false)
	const [openSaveDialog, setopenSaveDialog] = React.useState(false)
	const [openRejectionDialog, setopenRejectionDialog] = React.useState(false)

	const handleCloseDrawer = () => {
		setopenaccoutReview(false)
	}

	const handleSaveDialogOpen = () => {
		setopenSaveDialog(true)
	}
	const handleSaveDialogClose = () => {
		setopenSaveDialog(false)
		handleCloseDrawer()
	}

	const handleRejectionDialogOpen = () => {
		setopenRejectionDialog(true)
	}
	const handleRejectionDialogClose = () => {
		setopenRejectionDialog(false)
		handleCloseDrawer()
	}

	return (
		<>
			<LeftDrawer
				open={openaccoutReview}
				setopen={setopenaccoutReview}
				headerText={'Approval Request'}
				onBack={() => setopenaccoutReview(false)}
				headerRightSide={
					<Typography sx={{ color: '#FF6B00', fontSize: '0.8rem' }}>
						Deadline: {new Date().toLocaleDateString()}
					</Typography>
				}
			>
				<Stack
					direction="row"
					gap={1}
					alignItems={'center'}
					sx={{ height: 70, padding: '3px 20px', background: '#F9F9FA' }}
				>
					<Avatar alt="avatar image" sx={{ width: 50, height: 50 }}>
						<Iconify icon="icon-park-solid:avatar" width={40} height={40} />
					</Avatar>
					<Typography variant="body1">Name</Typography>
				</Stack>
				<Box style={{ padding: '5px 20px' }}>
					<Stack direction="row" gap={1} alignItems={'center'} justifyContent={'space-between'}>
						<Typography sx={{}}>Comments</Typography>
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

					<Stack direction="row" gap={'12px'} mt={1}>
						{[1, 2, 3, 4, 5].map((e) => (
							<Box key={e} sx={{ position: 'relative', textAlign: 'center' }}>
								<Avatar alt="avatar image" sx={{ width: 50, height: 50 }}>
									<Iconify icon="icon-park-solid:avatar" width={40} height={40} />
								</Avatar>
								{/* <CheckCircleTwoToneIcon sx={{ position: 'absolute', right: 1, top: 32, color: '#33cc33' }} /> */}
								<Typography variant="body2" fontWeight={600} mt={1}>
									이준호
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
								<Typography variant="body2">일진전기 _ 345kV 삼척화력발전소 </Typography>
							</Stack>

							<Stack direction="row" gap={1} alignItems={'center'} width={'45%'}>
								<Iconify icon="grommet-icons:form-attachment" sx={{ minWidth: 25, minHeight: 25 }} />
								<Typography variant="body2">주간 프로세스 계획</Typography>
							</Stack>
						</Stack>
						<Stack direction="row" gap={1} alignItems={'center'} mt={1}>
							<Iconify icon="mdi:timer-sand" sx={{ minWidth: 20, minHeight: 20 }} />
							<Typography variant="body2">04/03/2022-04/05/2023</Typography>
						</Stack>
					</Box>

					<Paper elevation={12} sx={{ border: '1px solid transparent', borderRadius: 1, padding: '7px', marginTop: 2 }}>
						<Stack direction="row" justifyContent={'space-between'}>
							<Box>
								<Typography variant="body2">Overtime, Vincent J. Powell, 02/24/2022</Typography>
								<Typography variant="body2" sx={{ color: '#596570', fontSize: '0.8rem' }}>
									Why did this person have to work overtime?
								</Typography>
							</Box>
							<Iconify icon="pepicons-pencil:dots-y" />
						</Stack>
					</Paper>

					<Paper elevation={12} sx={{ border: '1px solid transparent', borderRadius: 1, padding: '7px', marginTop: 1 }}>
						<Stack direction="row" justifyContent={'space-between'}>
							<Box>
								<Typography variant="body2">Lodging, Steven T. Joy, 03/01/2022</Typography>
							</Box>
							<Iconify icon="pepicons-pencil:dots-y" />
						</Stack>
					</Paper>

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

					<Stack direction={'row'} justifyContent={'space-between'} mt={2} gap={2}>
						<Button
							variant="contained"
							size="medium"
							color="inherit"
							sx={{ border: '1px solid #FF6B00', color: '#FF6B00', flex: 1 }}
							startIcon={<Iconify icon="carbon:close" width={17} height={17} />}
							onClick={handleRejectionDialogOpen}
						>
							Reject
						</Button>

						<Button
							variant="contained"
							size="medium"
							color="inherit"
							sx={{ border: '1px solid #8CCC67', color: '#8CCC67', flex: 1 }}
							startIcon={<Iconify icon="charm:tick" width={17} height={17} />}
							onClick={handleCloseDrawer}
						>
							Approve
						</Button>
					</Stack>

					<Box sx={{ margin: 'auto', width: '100%', textAlign: 'center' }}>
						<Button size="medium" color="inherit" sx={{ margin: '12px 0 25px' }} onClick={handleSaveDialogOpen}>
							Save & Continue Later
						</Button>
					</Box>
				</Box>
			</LeftDrawer>

			<PayAttention handleClose={handleSaveDialogClose} open={openSaveDialog} />

			<Rejection handleClose={handleRejectionDialogClose} open={openRejectionDialog} />
		</>
	)
}
