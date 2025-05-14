import React, { useState } from 'react'
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	FormLabel,
	RadioGroup,
	FormControlLabel,
	Radio,
	Button,
	Stack,
} from '@mui/material'

const FilterPopup = ({ open, onClose, onApplyFilters, cableTypeData, filters, handleChange }) => {
	const handleApply = () => {
		onApplyFilters(filters)
		onClose()
	}

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="xs"
			fullWidth
			PaperProps={{
				sx: {
					background: '#fff',
					border: '1px solid #ccc',
					boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
					borderRadius: '20px',
					color: '#4f46e5',
					p: 4,
				},
				onClick: (e) => e.stopPropagation(),
			}}
		>
			<DialogTitle
				sx={{
					fontWeight: 600,
					fontSize: '1.4rem',
					textAlign: 'center',
					color: '#333',
					mb: 2,
				}}
			>
				Filter Options
			</DialogTitle>

			<DialogContent>
				<Stack spacing={3}>
					<FormControl fullWidth>
						<InputLabel
							sx={{
								color: filters.diagramName ? '#4f46e5' : '#666',
								fontWeight: 700,
								fontSize: '0.85rem',
								transition: 'color 0.3s ease',
								mt: 0.7,
							}}
						>
							Diagram Name
						</InputLabel>
						<Select
							value={filters?.diagramName}
							label="Diagram Name"
							onChange={(e) => handleChange('diagramName', e.target.value)}
							sx={{ color: '#333', fontWeight: 500 }}
						>
							{cableTypeData?.map((item, index) => (
								<MenuItem value={item} key={index}>
									{item?.cableName}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<FormControl fullWidth>
						<InputLabel
							sx={{
								color: filters.diagramName ? '#4f46e5' : '#666',
								fontWeight: 700,
								fontSize: '0.85rem',
								transition: 'color 0.3s ease',
							}}
						>
							Lines
						</InputLabel>
						<Select
							value={filters.lines}
							label="Lines"
							onChange={(e) => handleChange('lines', e.target.value)}
							sx={{ color: '#333', fontWeight: 500 }}
						>
							<MenuItem value="1T/L">1TL</MenuItem>
							<MenuItem value="2T/L">2TL</MenuItem>
							<MenuItem value="3T/L">3TL</MenuItem>
							<MenuItem value="4T/L">4TL</MenuItem>
						</Select>
					</FormControl>

					<FormControl component="fieldset">
						<FormLabel sx={{ color: '#666', fontWeight: 700, mb: 1 }}>Demolition</FormLabel>
						<RadioGroup value={filters.demolition} onChange={(e) => handleChange('demolition', e.target.value)}>
							<FormControlLabel value="true" control={<Radio />} label="Yes" />
							<FormControlLabel value="false" control={<Radio />} label="No" />
						</RadioGroup>
					</FormControl>
				</Stack>
			</DialogContent>

			<DialogActions sx={{ mt: 3, justifyContent: 'space-between' }}>
				<Button
					onClick={onClose}
					variant="text"
					sx={{
						color: '#777',
						'&:hover': { color: '#333', backgroundColor: 'transparent' },
					}}
				>
					Cancel
				</Button>
				<Button
					onClick={handleApply}
					variant="contained"
					sx={{
						background: '#4f46e5',
						color: '#fff',
						borderRadius: '10px',
						px: 3,
						fontWeight: 600,
						'&:hover': {
							background: '#6366f1',
						},
					}}
				>
					Apply
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default FilterPopup
