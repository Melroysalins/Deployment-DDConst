import * as React from 'react'
import DialogTitle from '@mui/material/DialogTitle'
import Dialog from '@mui/material/Dialog'
import { Box, InputAdornment, Stack, TextField } from '@mui/material'
import Iconify from 'components/Iconify'

function SimpleDialog(props) {
	const { onClose, selectedValue, open } = props

	const handleClose = () => {
		onClose(selectedValue)
	}

	return (
		<Dialog onClose={handleClose} open={open} sx={{ maxWidth: '40%', margin: 'auto' }}>
			<DialogTitle sx={{ background: '#DA4C57', color: '#fff', fontWeight: 500 }}>Add rejection reason</DialogTitle>
			<Box sx={{}} p={3}>
				<span style={{ fontSize: '1.1rem', fontWeight: 600 }}>Please add a comment to continue.</span>
				<br />
				<span style={{ fontSize: '0.9rem' }}>Comment(s) are required when rejecting an Approval Request. </span>

				<Box mt={2}>
					<div style={{ fontSize: '0.85rem', marginBottom: 3 }}>Connected Reason</div>
					<TextField
						size="small"
						name="instanse"
						value={''}
						fullWidth
						label="Instanse type, Employee, Date"
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<Iconify icon="ph:cursor-click" />
								</InputAdornment>
							),
						}}
					/>
				</Box>

				<Box mt={1}>
					<div style={{ fontSize: '0.85rem', marginBottom: 3 }}>Comment</div>
					<TextField name="comment" value={''} fullWidth label="Text here" multiline minRows={3} />
				</Box>
				<Stack direction={'row'} justifyContent={'space-between'} mt={2}>
					<Stack
						direction={'row'}
						gap={1}
						alignItems={'center'}
						color={'#596570'}
						sx={{ cursor: 'pointer' }}
						onClick={handleClose}
					>
						<Iconify icon="ic:round-close" width={16} height={16} />
						Cancel
					</Stack>
					<Stack
						direction={'row'}
						gap={1}
						alignItems={'center'}
						color={'#919EAB'}
						sx={{ cursor: 'pointer' }}
						onClick={handleClose}
					>
						<Iconify icon="charm:tick" width={16} height={16} />
						Save
					</Stack>
				</Stack>
			</Box>
		</Dialog>
	)
}

export default function Rejection({ handleClose, open }) {
	return (
		<>
			<SimpleDialog open={open} onClose={handleClose} />
		</>
	)
}
