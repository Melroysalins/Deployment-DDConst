/* eslint-disable react/prop-types */
import * as React from 'react'
import DialogTitle from '@mui/material/DialogTitle'
import Dialog from '@mui/material/Dialog'
import { Box, Button, CircularProgress, Stack, TextField } from '@mui/material'
import { useTranslation } from 'react-i18next'
import Iconify from 'components/Iconify'
import { useFormikContext } from 'formik'

function SimpleDialog(props) {
	const { t } = useTranslation()
	const { onClose, selectedValue, open, loader, filterName, setfilterName } = props

	const { handleSubmit } = useFormikContext()

	const handleClose = () => {
		onClose(selectedValue)
	}

	return (
		<Dialog onClose={handleClose} open={open} sx={{ margin: 'auto' }}>
			<DialogTitle sx={{ background: '#8D99FF', color: '#fff', fontWeight: 500 }}>{t('save_view')}</DialogTitle>
			<Box sx={{ padding: '15px' }}>
				<div style={{ fontSize: '0.8rem', marginBottom: 5, minWidth: 320 }}>{t('filter_view_title')}</div>
				<TextField
					name="completed_less_percent"
					fullWidth
					label={t('type_view_here')}
					size="small"
					value={filterName}
					onChange={(e) => setfilterName(e.target.value)}
				/>
			</Box>

			<Stack direction={'row'} justifyContent={'space-between'} gap={2} p={1}>
				<Button
					variant="text"
					size="medium"
					color="inherit"
					sx={{ color: '#596570', flex: 1 }}
					startIcon={<Iconify icon="carbon:close" width={18} height={18} />}
					onClick={handleClose}
				>
					{t('cancel')}
				</Button>

				<Button
					disabled={!filterName}
					variant="text"
					size="medium"
					color="inherit"
					sx={{
						color: '#8D99FF',
						flex: 1,
						':disabled': {
							color: '#gray',
						},
					}}
					startIcon={
						loader ? (
							<CircularProgress size={17} sx={{ color: '#8D99FF' }} />
						) : (
							<Iconify icon="charm:tick" width={17} height={17} />
						)
					}
					onClick={handleSubmit}
				>
					{t('save')}
				</Button>
			</Stack>
		</Dialog>
	)
}

export default function SaveFilterDialog({ handleClose, open, loader, filterName, setfilterName }) {
	return (
		<>
			<SimpleDialog
				open={open}
				onClose={handleClose}
				loader={loader}
				filterName={filterName}
				setfilterName={setfilterName}
			/>
		</>
	)
}
