import { Box, Button, FormControlLabel, MenuItem, Paper, Radio, RadioGroup, Stack, TextField } from '@mui/material'
import { Select } from 'components'
import BasicDateRangePicker from 'components/DatePicker'
import Iconify from 'components/Iconify'
import React, { useState } from 'react'
import { dummyArray } from 'utils/helper'
import ConfirmationDialog from '../ConfirmationDialog'

function Approval({ setopen }) {
	const [addApprover, setaddApprover] = useState(false)
	const [openDialog, setopenDialog] = React.useState(false)

	const handleClickOpen = () => {
		setopenDialog(true)
	}

	const handleClose = (value) => {
		setopenDialog(false)
		setopen(false)
	}

	return (
		<>
			<Box>
				<div style={{ fontSize: '0.85rem', marginBottom: 3 }}>Project Name</div>
				<Select value={''} label="Project Name" sx={{ mb: 1, mt: 0 }} name="project" size="small">
					{dummyArray('Project', 5)?.map((e) => (
						<MenuItem key={e} value={e}>
							{e}
						</MenuItem>
					))}
				</Select>
				<div style={{ fontSize: '0.85rem', marginBottom: 3 }}>Page/Stage</div>
				<Select value={''} label="Page/Stage" sx={{ mb: 1, mt: 0 }} name="page" size="small">
					{dummyArray('Page', 5)?.map((e) => (
						<MenuItem key={e} value={e}>
							{e}
						</MenuItem>
					))}
				</Select>

				<div style={{ fontSize: '0.85rem', marginBottom: 3 }}>TimeFrame</div>
				<BasicDateRangePicker
					startLabel="Start"
					endLabel="End"
					setvalueRange={() => console.log('range')}
					valueRange={[new Date(), new Date()]}
				/>

				<div style={{ fontSize: '0.85rem', marginBottom: 3, paddingTop: 7 }}>Approval dedline</div>
				<BasicDateRangePicker
					startLabel="Start"
					endLabel="End"
					setvalueRange={() => console.log('range')}
					valueRange={[new Date(), new Date()]}
				/>

				<div style={{ fontSize: '0.85rem', marginBottom: 3, paddingTop: 7 }}>Comment</div>
				<TextField name="comment" value={''} fullWidth label="Text here" multiline />
			</Box>

			<Box mb={3} mt={3}>
				{Array.from(Array(4).keys()).map(() => (
					// eslint-disable-next-line react/jsx-key
					<Stack direction="row" justifyContent={'space-between'} alignItems={'center'} mt={2}>
						<Stack direction={'row'} gap={2} alignItems={'center'}>
							<img src={'/static/icons/Drag.svg'} alt={'drag'} />

							<img
								src={`/static/mock-images/avatars/avatar_4.jpg`}
								alt="employee"
								style={{ borderRadius: 100 }}
								width="46px"
								height="46px"
							/>
							<Box>
								<h5>Pasty T.Roy</h5>
								<div style={{ fontSize: '0.75rem', color: '#596570' }}>EIn Charge </div>
							</Box>
						</Stack>

						<Iconify icon="ic:round-close" width={14} height={14} />
					</Stack>
				))}
			</Box>

			<Paper elevation={12} sx={{ border: '1px solid transparent', borderRadius: 1, padding: '5px 7px' }}>
				{addApprover ? (
					<>
						<h5 style={{ marginBottom: 5 }}>Add approver</h5>
						<div style={{ fontSize: '0.85rem', marginBottom: 3 }}>Approver</div>
						<Select value={''} label="Approver" sx={{ mb: 1, mt: 0 }} name="approver" size="small">
							{dummyArray('Approver', 5)?.map((e) => (
								<MenuItem key={e} value={e}>
									{e}
								</MenuItem>
							))}
						</Select>

						<div style={{ fontSize: '0.85rem', marginBottom: 3 }}>Occupation</div>
						<Select value={''} label="Occupation" sx={{ mb: 1, mt: 0 }} name="occupation" size="small">
							<MenuItem value="Private Co.">Private Co.</MenuItem>
						</Select>

						<Stack direction={'row'} justifyContent={'space-between'} mt={1}>
							<Stack
								direction={'row'}
								gap={1}
								alignItems={'center'}
								color={'#FF6B00'}
								sx={{ cursor: 'pointer' }}
								onClick={() => setaddApprover(!addApprover)}
							>
								<Iconify icon="ic:round-close" width={16} height={16} />
								Cancel
							</Stack>
							<Stack
								direction={'row'}
								gap={1}
								alignItems={'center'}
								color={'#8CCC67'}
								sx={{ cursor: 'pointer' }}
								onClick={() => setaddApprover(!addApprover)}
							>
								<Iconify icon="charm:tick" width={16} height={16} />
								Add
							</Stack>
						</Stack>
					</>
				) : (
					<>
						<Stack
							direction={'row'}
							justifyContent={'space-between'}
							sx={{ cursor: 'pointer' }}
							mt={1}
							onClick={() => setaddApprover(true)}
						>
							<h5 style={{ marginBottom: 5 }}>Add approver</h5>
							<Iconify icon="material-symbols:add" width={16} height={16} />
						</Stack>
					</>
				)}
			</Paper>
			{!addApprover && (
				<>
					<Stack direction={'row'} gap={1} justifyContent={'space-between'} sx={{ cursor: 'pointer' }} mt={1}>
						<Paper elevation={12} sx={{ border: '1px solid transparent', borderRadius: 1, padding: '5px 7px' }}>
							<Radio size="small" style={{ padding: '0 3px' }} />
							<span style={{ fontSize: '0.8rem' }}>Include all approvals</span>
						</Paper>
						<Paper elevation={12} sx={{ border: '1px solid transparent', borderRadius: 1, padding: '5px 7px' }}>
							<Radio size="small" style={{ padding: '0 3px' }} />
							<span style={{ fontSize: '0.8rem' }}>Continue rejector</span>
						</Paper>
					</Stack>

					<Button fullWidth variant="contained" sx={{ marginTop: 2 }} onClick={handleClickOpen}>
						Request approval
					</Button>
				</>
			)}

			<ConfirmationDialog handleClose={handleClose} open={openDialog} />
		</>
	)
}

export default Approval
