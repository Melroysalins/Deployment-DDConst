/* eslint-disable react/prop-types */
import { useState } from 'react'
import DialogTitle from '@mui/material/DialogTitle'
import Dialog from '@mui/material/Dialog'
import { Box, CircularProgress, InputAdornment, Stack, TextField } from '@mui/material'
import Iconify from 'components/Iconify'
import useMain from 'pages/context/context'
import { ApprovalStatus } from 'constant'
import { useTranslation } from 'react-i18next'

function SimpleDialog(props) {
	const { t } = useTranslation()
	const [comment, setcomment] = useState('')
	const { currentApproval } = useMain()
	const { employee, approval } = currentApproval || {}
	const { onClose, selectedValue, open, setopenRejectionDialog, handleApproveReject, isUpdating } = props

	const handleClose = () => {
		onClose(selectedValue)
	}

	return (
		<Dialog onClose={handleClose} open={open} sx={{ maxWidth: '40%', margin: 'auto' }}>
			<DialogTitle sx={{ background: '#DA4C57', color: '#fff', fontWeight: 500 }}>{t('rejection_reason')}</DialogTitle>
			<Box sx={{}} p={3}>
				<span style={{ fontSize: '1.1rem', fontWeight: 600 }}>{t('rejection_text1')}.</span>
				<br />
				<span style={{ fontSize: '0.9rem' }}>{t('rejection_text2')}</span>

				<Box mt={2}>
					<div style={{ fontSize: '0.85rem', marginBottom: 3 }}>{t('connected_reason')}</div>
					<TextField
						size="small"
						name="instanse"
						disabled
						value={`${employee.name || employee.email}, ${new Date(approval.created_at).toLocaleDateString()}`}
						fullWidth
						label={t('intance_type_date')}
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
					<div style={{ fontSize: '0.85rem', marginBottom: 3 }}>{t('comment')}</div>
					<TextField
						name="comment"
						value={comment}
						onChange={(e) => setcomment(e.target.value)}
						fullWidth
						label={t('text_here')}
						multiline
						minRows={3}
					/>
				</Box>
				<Stack direction={'row'} justifyContent={'space-between'} mt={2}>
					<Stack
						direction={'row'}
						gap={1}
						alignItems={'center'}
						color={'#596570'}
						sx={{ cursor: 'pointer' }}
						onClick={() => setopenRejectionDialog(false)}
					>
						<Iconify icon="ic:round-close" width={16} height={16} />
						{t('cancel')}
					</Stack>
					<Stack
						direction={'row'}
						gap={1}
						alignItems={'center'}
						color={comment ? '#596570' : '#919EAB'}
						sx={{ cursor: 'pointer', pointerEvents: comment ? 'initial' : 'none' }}
						onClick={() => handleApproveReject(ApprovalStatus.Rejected, comment)}
					>
						{isUpdating ? (
							<CircularProgress size={17} sx={{ color: '#596570' }} />
						) : (
							<Iconify icon="charm:tick" width={16} height={16} />
						)}
						{t('save')}
					</Stack>
				</Stack>
			</Box>
		</Dialog>
	)
}

export default function Rejection({ handleClose, open, setopenRejectionDialog, handleApproveReject, isUpdating }) {
	return (
		<>
			<SimpleDialog
				open={open}
				onClose={handleClose}
				setopenRejectionDialog={setopenRejectionDialog}
				handleApproveReject={handleApproveReject}
				isUpdating={isUpdating}
			/>
		</>
	)
}
