import React from 'react'

import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import { LocalizationProvider } from '@mui/x-date-pickers-pro'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker'

export default function BasicDateRangePicker({ startLabel = '', endLabel = '', setvalueRange, valueRange }) {
	return (
		<LocalizationProvider dateAdapter={AdapterDayjs} localeText={{ start: startLabel, end: endLabel }}>
			<DateRangePicker
				value={valueRange}
				onChange={(newValue) => {
					setvalueRange(newValue)
				}}
				renderInput={(startProps, endProps) => (
					<>
						<TextField {...startProps} size="small" />
						<Box sx={{ mx: 1 }}>-</Box>
						<TextField {...endProps} size="small" />
					</>
				)}
			/>
		</LocalizationProvider>
	)
}
