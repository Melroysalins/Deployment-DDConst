import React, { useState } from 'react'
import {
	TableContainer,
	Box,
	Typography,
	IconButton,
	Table,
	TextField,
	TableRow,
	TableCell,
	Select as MuiSelect,
	MenuItem,
	FormControl,
	InputLabel,
	FormHelperText,
	TableHead,
	TableBody,
	Collapse,
	styled,
} from '@mui/material'
import style from './DemolitionTable.module.scss'
import PropTypes from 'prop-types'
import AddIcon from '@mui/icons-material/Add'
import Iconify from 'components/Iconify'
import HoverBox from 'components/hover'
import { JB_TYPE, JB_TYPE_MAP, JUNCTION_BOX_MAP, PMJ, STATUS, STATUS_MAP } from '../diagramHelper'
import NotePopup from 'components/NotePopup'

const StyledSelect = styled(MuiSelect)({
    borderRadius: '4px',
    backgroundColor: '#f8dbdd',
	width: '100%',
    '& .MuiOutlinedInput-notchedOutline': {
        border: 'none',
    },
    '& .MuiSelect-select': {
        display: 'flex',
        alignItems: 'center',
        paddingRight: '0px',
        gap: '4px',
        color: '#da4c57',
		padding: '0.1rem',
        '@media (max-width: 1440px)': {
            fontSize: '10px',
            height: '14px',
        },
        // '@media (max-width: 1336px)': {
        //     fontSize: '8px',
        //     padding: '2px 4px',
        //     height: '10px',
        // },
        // '@media (max-width: 1280px)': {
        //     fontSize: '6px',
        //     padding: '2px 4px',
        //     height: '8px',
        // },
    },
	'& .css-9q3kl4-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-9q3kl4-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input':{
		paddingRight: '0.1rem',
		fontFamily: "'Manrope', sans-serif",
        fontWeight: 600,
        fontSize: '11px',
	},
});

const Select = styled(MuiSelect)({
		height: '3vh',
		borderRadius: '8px',
		width: '100%',
		'@media (min-width: 1441px)': {
            maxWidth: '121px',
        },
        '@media (max-width: 1440px)': {
            fontSize: '11px',
			borderRadius: '6px',
			// padding: '0.5556vh 0.3125vw',
        },
        // '@media (max-width: 1336px)': {
        //     fontSize: '8px',
        //     height: '16px',
        // },
        // '@media (max-width: 1280px)': {
        //     fontSize: '6px',
        //     height: '12px',
        // },
    '& .MuiInputBase-formControl': {
        '@media (max-width: 1440px)': {
            height: '25px',
        },
    },
	'& .css-z83vip-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-z83vip-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-z83vip-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input':{
		width: '20px',
		paddingRight: '0px',
		padding: '0.25rem 0.375rem 0.25rem 0.5rem'
		
	},

	'& .css-9q3kl4-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-9q3kl4-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-9q3kl4-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input':{
		minWidth: '40px',
		paddingRight: '0px',
		padding: '0.25rem 0.375rem 0.25rem 0.5rem'
	},
});

const CustomSelectIcon = () => (
	<>
		<Box sx={{ width: '0px', height: '0px'}} />

	</>
  );


const renderTableCell = (text, tableWidth) => (
	<TableCell className={style.TableCell} sx={{ width: `${tableWidth}%` }}>
		<Typography variant="body1" className={style.Typography}>
			{text}
		</Typography>
	</TableCell>
)

const getStatusTLSection = (newObj, demolition, index) => {
	let status = ''
	const demolitionsLength = newObj.currentObj.demolitions.length

	if (index === 0) {
		status = `Namyang${newObj.currentObj.start}#${index + 1}~${JB_TYPE_MAP[demolition.joinType]}#${index + 1}`
	} else if (index === demolitionsLength) {
		status = `${JB_TYPE_MAP[demolition.joinType]}#${index + 1}~Yeonsu${JUNCTION_BOX_MAP[newObj.currentObj.end]}`
	} else {
		status = `${JB_TYPE_MAP[newObj.currentObj.demolitions[index - 1].joinType]}#${index}~${
			JB_TYPE_MAP[demolition.joinType]
		}#${index + 1}`
	}

	return status
}

const renderStatus = (demolition, isEdit, handleChangeDemolition, objId, connIndex, statusIndex) => (
	<TableCell className={style.TableCell} sx={{ width: '100%' }}>
		{isEdit ? (
			<FormControl>
				<InputLabel className={style.InputLabel} color="primary">
					Status
				</InputLabel>
				<StyledSelect
					className={style.StyledSelect}
					value={demolition.statuses?.[statusIndex]}
					label="Status"
					onChange={(e) => handleChangeDemolition(e.target.value, 'statuses', objId, connIndex, statusIndex)}
					variant="outlined"
					IconComponent={CustomSelectIcon}
				>
					{STATUS.map((e) => (
						<MenuItem value={e.value} key={e.value}>
							{e.label}
						</MenuItem>
					))}
				</StyledSelect>
			</FormControl>
		) : (
			<Typography
				className={style.Typography}
				variant="body1"
				sx={{ padding: '0px', fontSize: '14px', textAlign: 'center' }}
			>
				{STATUS_MAP[demolition.statuses?.[statusIndex]]}
			</Typography>
		)}
	</TableCell>
)

const renderTableRow = (demolition, index, handleChangeDemolition, objId, isEdit, newObj, hoveredRowIndex, setHoveredRowIndex, handleOpenPopup, isNotePopupOpen) => (
	<TableRow index={index} sx={{ position: 'relative'}} onMouseEnter={() => setHoveredRowIndex(index)}
	onMouseLeave={() => {
        if (!isNotePopupOpen) { // Check if NotePopup is not open
            setHoveredRowIndex(null);
        }
    }} >
		{renderTableCell(`#${index + 1}`, '10%')}

		<TableCell className={style.TableCell} sx={{ width: '70%' }}>
			{isEdit ? (
				<FormControl variant="outlined" sx={{ width: '95%', height: '32px' }} className={style.FormControl}>
					<InputLabel className={style.InputLabel} color="primary">
						Jb Type
					</InputLabel>
					<Select
						className={style.Select}
						color="primary"
						sx={{ height: '32px' }}
						value={demolition.joinType}
						label="Jb Type"
						onChange={(e) => handleChangeDemolition(e.target.value, 'joinType', objId, index)}
						disableUnderline
						displayEmpty
					>
						{JB_TYPE.map((e) => (
							<MenuItem value={e.value} key={e}>
								{e.label}
							</MenuItem>
						))}
					</Select>
					<FormHelperText />
				</FormControl>
			) : (
				<Typography
					className={style.Typography}
					variant="body1"
					sx={{ padding: '0px', fontSize: '14px', textAlign: 'center' }}
				>
					{JB_TYPE_MAP[demolition.joinType]}
				</Typography>
			)}
		</TableCell>

		<TableCell className={style.TableCell} sx={{ width: '70%' }}>
			{isEdit ? (
				<FormControl variant="outlined" sx={{ width: '95%', height: '32px' }} className={style.FormControl}>
					<InputLabel className={style.InputLabel} color="primary">
						PMJ
					</InputLabel>
					<Select
						className={style.Select}
						color="primary"
						sx={{ height: '32px' }}
						value={demolition.pmj}
						label="PMJ"
						onChange={(e) => handleChangeDemolition(e.target.value, 'pmj', objId, index)}
						disableUnderline
						displayEmpty
					>
						{PMJ.map((e) => (
							<MenuItem value={e} key={e}>
								{e}
							</MenuItem>
						))}
					</Select>
					<FormHelperText />
				</FormControl>
			) : (
				<Typography
					className={style.Typography}
					variant="body1"
					sx={{ padding: '0px', fontSize: '14px', textAlign: 'center' }}
				>
					{demolition.pmj}
				</Typography>
			)}
		</TableCell>
		{renderTableCell(getStatusTLSection(newObj, demolition, index), '19%')}
		<TableCell className={style.TableCell} sx={{ width: '10px', textAlign: 'center' }}>
			{isEdit ? (
				<TextField
					variant="outlined"
					sx={{ width: '70px', '& .MuiInputBase-root': { height: 32 } }}
					placeholder="320"
					onChange={(e) => handleChangeDemolition(e.target.value, 'length_demolition', newObj.id, index)}
					value={newObj.currentObj.length_demolition[index]}
				/>
			) : (
				<Typography
					variant="body1"
					sx={{ padding: '0px', fontSize: '14px', textAlign: 'center' }}
					className={style.Typography}
				>
					{newObj.currentObj.length_demolition[index]}
				</Typography>
			)}
		</TableCell>
		{demolition.statuses.map((_, statusIndex) => (
			<>{renderStatus(demolition, isEdit, handleChangeDemolition, newObj.id, index, statusIndex)}</>
		))}
		{hoveredRowIndex === index && isEdit && (
			<HoverBox index={index} setVisibleNotes={handleOpenPopup} />
		)}
	</TableRow>
)

const DemolitionTable = ({ handleAddDemolition, handleChangeDemolition, newObj, isEdit, handleAddNote }) => {
	const [isExpanded, setIsExpanded] = useState(false)
	const [hoveredRowIndex, setHoveredRowIndex] = useState(null)
	const [isNotePopupOpen, setIsNotePopupOpen] = useState(false)
	const [inputValue, setInputValue] = useState(); 

	const { demolitions } = newObj.currentObj || {}

	const addPanel = () => {
		handleAddDemolition(newObj.id)
	}

	const handleOpenPopup = (index) => {
		setIsNotePopupOpen(true);
		setInputValue(newObj.currentObj.demolitions[index].note)
	};

	const handleClosePopup = () => {
		setIsNotePopupOpen(false);
		setInputValue('')
	};

	const AddNote = () => {
		handleAddNote(newObj.id, inputValue, "demolitions", hoveredRowIndex)
		setIsNotePopupOpen(false)
		setInputValue('')
	}

	const button = { label: 'Continue', onClick: (() => AddNote()) }

	return (
		<>
		<Box sx={{ position: 'relative', left: '2px', width: '95.42%', marginLeft: '3.58%'}}>
			<Collapse sx={{ overflow: 'visible' }} in={isExpanded} collapsedSize={demolitions.length < 7 ? demolitions.length * 53 + 34 : 350}>
				<Box
					sx={{ maxHeight: isExpanded ? 'none' : '350px', overflow: 'auto', width: '100%'}}
				>
					<TableContainer sx={{ overflow: 'visible', border: '1px solid lightgrey', borderRadius: '8px'}}>
						<Table>
							<TableHead>
								<TableRow style={{ backgroundColor: '#f9f9fa' }}>
									{renderTableCell('#', '10%')}
									{renderTableCell('Transformer', '19%')}
									{renderTableCell('Connector', '19%')}
									{renderTableCell('T/L Section', '19%')}
									{renderTableCell('Length', '19%')}
									{demolitions[0].statuses.map((_, index) => (
										<>{renderTableCell(`${index + 1}T/L`)}</>
									))}
								</TableRow>
							</TableHead>
							<TableBody >
								{demolitions.map((demolition, index) => (
									<>{renderTableRow(demolition, index, handleChangeDemolition, newObj.id, isEdit, newObj, hoveredRowIndex, setHoveredRowIndex, handleOpenPopup, isNotePopupOpen)}</>
								))}
							</TableBody>
							{isEdit && (
								<Box
									sx={{
										position: 'absolute',
										bottom: '-12px',
										left: '48px',
										display: 'flex',
										flexDirection: 'row',
										alignItems: 'center',
										justifyContent: 'flex-start',
										gap: '12px',
										zIndex: 4,
									}}
								>
									<IconButton
										style={{
											backgroundColor: '#ffa58d',
											boxShadow: '0px 8px 16px rgba(255, 165, 141, 0.24)',
											borderRadius: '32px',
											width: '24px',
											height: '24px',
										}}
										onClick={addPanel}
									>
										<AddIcon sx={{ color: '#fff' }} />
									</IconButton>
								</Box>
							)}
							{demolitions.length > 6 && (
								<IconButton
									style={{
										border: '1px solid rgba(0, 0, 0, 0.1)',
										backgroundColor: '#fff',
										boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.04)',
										borderRadius: '32px',
										width: '24px',
										height: '24px',
										boxSizing: 'border-box',
										zIndex: '5',
										position: 'absolute',
										right: '12px',
										bottom: '-12px',
										padding: '0px',
									}}
									onClick={() => setIsExpanded((prevIsExpanded) => !prevIsExpanded)}
								>
									<Iconify
										icon={isExpanded ? 'mi:chevron-double-up' : 'mi:chevron-double-down'}
										width={16}
										height={16}
										sx={{ color: '#596570' }}
									/>
								</IconButton>
							)}
						</Table>
					</TableContainer>
				</Box>
			</Collapse>
		</Box>
		<NotePopup isOpen={isNotePopupOpen} onClose={handleClosePopup} title={"Add Note"} button={button} inputValue={inputValue} setInputValue={setInputValue} /> 
		</>
	)
}

DemolitionTable.propTypes = {
	handleAddDemolition: PropTypes.func.isRequired,
	handleChangeDemolition: PropTypes.func.isRequired,
	newObj: PropTypes.object.isRequired,
	isEdit: PropTypes.bool,
	isNotePopupOpen: PropTypes.bool.isRequired,
	setIsNotePopupOpen: PropTypes.func.isRequired,
	handleAddNote: PropTypes.func.isRequired,
}

export default DemolitionTable
