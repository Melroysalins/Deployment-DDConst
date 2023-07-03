import * as React from 'react'
import DialogTitle from '@mui/material/DialogTitle'
import Dialog from '@mui/material/Dialog'
import { Box, Stack } from '@mui/material'
import Iconify from 'components/Iconify'

function SimpleDialog(props) {
	const { onClose, selectedValue, open } = props

	const handleClose = () => {
		onClose(selectedValue)
	}

	return (
		<Dialog onClose={handleClose} open={open} sx={{ maxWidth: '40%', margin: 'auto' }}>
			<DialogTitle sx={{ background: '#8D99FF', color: '#fff', fontWeight: 500 }}>Pay Attention</DialogTitle>
			<Box textAlign={'center'} sx={{ padding: '10px', maxWidth: '75%', margin: 'auto' }}>
				<span style={{ fontSize: '1.1rem', fontWeight: 600 }}>
					Date Range 24/06/2023 -24/06/2023 was previously approved.
				</span>
				<div style={{ marginTop: 10, fontSize: '0.9rem' }}>
					By requesting an Approval, you will be overwriting any approved Date Ranges back to Pending. Would you still
					like to proceed?
				</div>
			</Box>

			<Stack direction={'row'} justifyContent={'space-between'} m={'7px 20px 17px 20px'}>
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
					color={'#8D99FF'}
					sx={{ cursor: 'pointer' }}
					onClick={handleClose}
				>
					<Iconify icon="charm:tick" width={16} height={16} />
					Confirm
				</Stack>
			</Stack>
		</Dialog>
	)
}

export default function ConfirmationDialog({ handleClose, open }) {
	return (
		<>
			<SimpleDialog open={open} onClose={handleClose} />
		</>
	)
}
