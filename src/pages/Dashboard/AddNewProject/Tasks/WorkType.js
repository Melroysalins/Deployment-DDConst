import React, { useState } from 'react'
import { Box, Checkbox, FormControlLabel, Grid, Typography } from '@mui/material'

const workTypesOptions = [
	'Office Work',
	'Metal Fittings Installation',
	'Installation',
	'Connection',
	'Completion Testing',
	'Auxiliary Construction',
]

const WorkType = ({ checkedItems, setCheckedItems, selectedWorkTypesData }) => {
	const handleChange = (event) => {
		const { value, checked } = event.target
		if (checked) {
			setCheckedItems([...checkedItems, value])
		} else {
			setCheckedItems(checkedItems.filter((item) => item !== value))
		}
	}
	return (
		<Box p={2}>
			<Typography gutterBottom fontWeight={600} variant="subtitle1" sx={{ color: 'text.default' }}>
				Select Work Types
			</Typography>
			<Grid container spacing={2}>
				{workTypesOptions?.map((type) => (
					<Grid item xs={12} sm={6} md={4} key={type}>
						<FormControlLabel
							control={<Checkbox value={type} checked={checkedItems.includes(type)} onChange={handleChange} />}
							label={
								<Typography fontWeight={600} fontSize="0.95rem">
									{type}
								</Typography>
							}
						/>
					</Grid>
				))}
			</Grid>
		</Box>
	)
}

export default WorkType
