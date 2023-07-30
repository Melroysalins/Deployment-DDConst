/* eslint-disable react/prop-types */
import * as React from 'react'
import DialogTitle from '@mui/material/DialogTitle'
import Dialog from '@mui/material/Dialog'
import { Box, Button, Stack } from '@mui/material'

function SimpleDialog(props) {
	const { onClose, selectedValue, open, setopenSaveDialog } = props

	const handleClose = () => {
		onClose(selectedValue)
	}

	return (
		<Dialog onClose={handleClose} open={open} sx={{ maxWidth: '38%', margin: 'auto' }}>
			<DialogTitle sx={{ background: '#8D99FF', color: '#fff', fontWeight: 500 }}>Pay Attention</DialogTitle>
			<Box textAlign={'center'} sx={{ padding: '10px', maxWidth: '75%', margin: 'auto' }}>
				<span style={{ fontSize: '1.1rem', fontWeight: 600 }}>
					Would you like to leave the approval review and continue later?
				</span>
			</Box>

			<Stack direction={'row'} justifyContent={'space-between'} gap={2} p={3}>
				<Button
					variant="contained"
					size="medium"
					color="inherit"
					sx={{ border: '1px solid #596570', flex: 1 }}
					onClick={handleClose}
				>
					Yes, save and continue
				</Button>

				<Button
					variant="contained"
					size="medium"
					color="inherit"
					sx={{ color: '#FFFFFF', flex: 1, background: '#8D99FF' }}
					onClick={() => setopenSaveDialog(false)}
				>
					No, continue approval
				</Button>
			</Stack>
		</Dialog>
	)
}

export default function PayAttention({ handleClose, open, setopenSaveDialog }) {
	return (
		<>
			<SimpleDialog open={open} onClose={handleClose} setopenSaveDialog={setopenSaveDialog} />
		</>
	)
}
