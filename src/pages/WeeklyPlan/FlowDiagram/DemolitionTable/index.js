import React from 'react'
import {
	TableContainer,
	Box,
	Typography,
	Table,
	TextField,
	TableRow,
	TableCell,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	FormHelperText,
} from '@mui/material'
import style from './DemolitionTable.module.scss'

const renderTableCell = (text, tableWidth) => {
	return (
		<TableCell className={style.TableCell} sx={{ width: tableWidth }}>
			<Typography variant="body1" className={style.Typography}>
				{text}
			</Typography>
		</TableCell>
	)
}

const renderFormControl = (label, selectLabel, tableWidth) => {
	return (
		<TableCell className={style.TableCell} sx={{ width: tableWidth }}>
			<FormControl variant="outlined" sx={{ width: '100%', height: '32px' }} className={style.FormControl}>
				<InputLabel className={style.InputLabel} color="primary">
					{label}
				</InputLabel>
				<Select
					className={style.Select}
					color="primary"
					sx={{ height: '32px' }}
					label={selectLabel}
					disableUnderline
					displayEmpty
				>
					<MenuItem value="">None</MenuItem>
					{/* Add more menu items here */}
				</Select>
				<FormHelperText />
			</FormControl>
		</TableCell>
	)
}

const renderTableRow = (section) => {
	return (
		<TableRow>
			{renderTableCell(section, '10%')}
			{renderFormControl('M/H', 'S/S', '19%')}
			{renderFormControl('IJ', 'EB-G', '19%')}
			{renderTableCell('NamyangS/S~M/H#1', '19%')}
			<TableCell className={style.TableCell} sx={{ padding: '12px 8px', width: '19%' }}>
				<TextField variant="outlined" sx={{ '& .MuiInputBase-root': { height: 32 } }} placeholder="320" />
			</TableCell>
			<TableCell className={style.TableCell} sx={{ padding: '12px 8px', width: '14%' }}>
				<Select className={style.StyledSelect} value="Completed" variant="outlined" size="small">
					<MenuItem value="Completed">Completed</MenuItem>
					<MenuItem value="In Progress">In Progress</MenuItem>
					<MenuItem value="Not Started">Not Started</MenuItem>
				</Select>
			</TableCell>
		</TableRow>
	)
}

const DemolitionTable = () => {
	return (
		<TableContainer
			sx={{ border: '1px solid lightgrey', width: '96.5%', borderRadius: '8px', position: 'relative', left: '24px' }}
		>
			<Table sx={{}}>
				<TableRow style={{ backgroundColor: '#f9f9fa' }}>
					{renderTableCell('#', '10%')}
					{renderTableCell('Transformer', '18%')}
					{renderTableCell('Connector', '18%')}
					{renderTableCell('T/L Section', '18%')}
					{renderTableCell('Length', '18%')}
					{renderTableCell('Status', '18%')}
				</TableRow>
				{renderTableRow(1)}
				{renderTableRow(2)}
			</Table>
		</TableContainer>
	)
}

export default DemolitionTable
