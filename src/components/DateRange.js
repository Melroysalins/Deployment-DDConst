import * as React from 'react'
import { Box, TextField, InputAdornment, Typography } from '@mui/material'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

export default function DateRangePickerCustom({ dataConfig, SetDataConfig }) {
	const [openStart, setOpenStart] = React.useState(false)
	const [openEnd, setOpenEnd] = React.useState(false)
	const [warning, setWarning] = React.useState('')

	const { startDate, endDate } = dataConfig
	const { t } = useTranslation(['workforce'])

	const handleDateChange = (key, value) => {
		if (!value) return

		SetDataConfig((prev) => {
			const updated = { ...prev, [key]: value.format('YYYY-MM-DD') }

			// Validation: End Date cannot be earlier than Start Date
			if (updated.startDate && updated.endDate) {
				if (dayjs(updated.endDate).isBefore(dayjs(updated.startDate), 'day')) {
					setWarning('End date cannot be earlier than start date')
				} else {
					setWarning('')
				}
			}
			return updated
		})
	}

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
				<Box sx={{ display: 'flex', gap: 2 }}>
					{/* Start Date */}
					<DatePicker
						open={openStart}
						onClose={() => setOpenStart(false)}
						value={startDate ? dayjs(startDate) : null}
						onChange={(newValue) => handleDateChange('startDate', newValue)}
						label={t('Start Date')}
						renderInput={(params) => (
							<TextField
								{...params}
								placeholder={t('Start Date')}
								variant="outlined"
								InputProps={{
									...params.InputProps,
									readOnly: true,
									sx: {
										borderRadius: '12px',
										height: '51px',
									},
									endAdornment: (
										<InputAdornment position="end">
											<CalendarMonthIcon
												sx={{ color: '#9CA3AF', cursor: 'pointer' }}
												onClick={() => setOpenStart(true)}
											/>
										</InputAdornment>
									),
								}}
								sx={{
									'& .MuiOutlinedInput-root': {
										'& fieldset': { borderColor: '#CBD5E1' },
										'&:hover fieldset': { borderColor: '#CBD5E1' },
										'&.Mui-focused fieldset': { borderColor: '#CBD5E1' },
									},
									input: { color: '#9CA3AF' },
								}}
							/>
						)}
					/>

					{/* End Date */}
					<DatePicker
						open={openEnd}
						onClose={() => setOpenEnd(false)}
						value={endDate ? dayjs(endDate) : null}
						onChange={(newValue) => handleDateChange('endDate', newValue)}
						label={t('End Date')}
						renderInput={(params) => (
							<TextField
								{...params}
								placeholder={t('End Date')}
								variant="outlined"
								InputProps={{
									...params.InputProps,
									readOnly: true,
									sx: {
										borderRadius: '12px',
										height: '51px',
									},
									endAdornment: (
										<InputAdornment position="end">
											<CalendarMonthIcon
												sx={{ color: '#9CA3AF', cursor: 'pointer' }}
												onClick={() => setOpenEnd(true)}
											/>
										</InputAdornment>
									),
								}}
								sx={{
									'& .MuiOutlinedInput-root': {
										'& fieldset': { borderColor: '#CBD5E1' },
										'&:hover fieldset': { borderColor: '#CBD5E1' },
										'&.Mui-focused fieldset': { borderColor: '#CBD5E1' },
									},
									input: { color: '#9CA3AF' },
								}}
							/>
						)}
					/>
				</Box>

				{warning && (
					<Typography variant="caption" sx={{ color: 'red', mt: 1 }}>
						{t('End date cannot be earlier than start date')}
					</Typography>
				)}
			</Box>
		</LocalizationProvider>
	)
}
