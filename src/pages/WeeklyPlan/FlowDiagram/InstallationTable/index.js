import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Typography,
	TextField,
	Select as MuiSelect,
	MenuItem,
	Collapse,
	Box,
	IconButton,
	styled,
} from '@mui/material'
import style from './InstallationTable.module.scss'
import { JB_TYPE_MAP, JUNCTION_BOX_MAP, STATUS, STATUS_MAP, COLOR_MAP } from '../diagramHelper'
import Iconify from 'components/Iconify'
import HoverBox from 'components/hover'
import { visitNode } from 'typescript'
import Label from 'components/Label'
import NotePopup from 'components/NotePopup'
import { getColorFromValue } from '../helper'

const StyledSelect = styled(MuiSelect)(({ bgColor, textColor }) => ({
	height: '2.2vh',
	borderRadius: '4px',
	backgroundColor: bgColor,
	width: '100%',
	fontFamily: "'Manrope', sans-serif",
	fontWeight: 600,
	lineHeight: '24px',
	fontSize: '14px',
	'& .MuiOutlinedInput-notchedOutline': {
		border: 'none',
	},
	'& .MuiSelect-select': {
		display: 'flex',
		alignItems: 'center',
		paddingRight: '0.2rem !important',
		gap: '4px',
		color: textColor,
		padding: '0.2rem !important',
		'@media (max-width: 110.625rem)': {
			fontSize: '11px',
			height: '14px',
		}, 
	},
}));

const CustomSelectIcon = () => (
	<>
		<Box sx={{ width: '0px', height: '0px'}} />
	</>
  );

const renderTableCell = (text, cellWidth='3.73vw', isTableHead=false) => (
	<TableCell sx={{ padding: '0.425rem 0.175rem', width: cellWidth }}>
	  <Typography
		variant="body1"
		sx={{ 
		  padding: '0px', 
		  fontSize: '14px', 
		  textAlign: 'center', 
		  color: isTableHead ? '#000' : '#596570', // Conditional color
		  fontWeight: isTableHead ? 600 : 'normal' // Conditional fontWeight
		}}
		className={style.Typography}
	  >
		{text}
	  </Typography>
	</TableCell>
);

const renderTableRow = (installation, index, handleChangeInstallation, displayName, newObj, isEdit, hoveredRowIndex, setHoveredRowIndex, handleOpenPopup, isNotePopupOpen, deleteRow) => {
	return (
	<>
	<TableRow  sx={{ position: 'relative'}} onMouseEnter={() => setHoveredRowIndex(index)}
	onMouseLeave={() => {
        if (!isNotePopupOpen) { // Check if NotePopup is not open
            setHoveredRowIndex(null);
        }
    }} >
		{renderTableCell(`${displayName}`)}
		<TableCell className={style.TableCell} sx={{ width: '20%'}} >
			{isEdit ? (
				<TextField
					className={style.TextField}
					variant="outlined"
					sx={{ '& .MuiInputBase-root': { height: '3vh', borderRadius: '6px' } }}
					placeholder="320"
					onChange={(e) => handleChangeInstallation(e.target.value, 'length', newObj.id, index)}
					value={newObj.currentObj.length[index]}
				/>
			) : (
				<Typography
					variant="body1"
					sx={{ padding: '0px', fontSize: '14px', textAlign: 'center' }}
					className={style.Typography}
				>
					{newObj.currentObj.length[index]}
				</Typography>
			)}
		</TableCell>
		{installation.statuses.map((e, statusIndex) => (
			<>{renderStatus(installation, isEdit, handleChangeInstallation, newObj, index, statusIndex)}</>
		))}
		{hoveredRowIndex === index && isEdit && (
			<HoverBox index={index} setVisibleNotes={handleOpenPopup} deleteRow={deleteRow} />
		)}
	</TableRow>
	</>
	
)}

const renderStatus = (installation, isEdit, handleChangeInstallation, newObj, connIndex, statusIndex) => {
	const { bgColor, textColor } = getColorFromValue(installation.statuses?.[statusIndex]);

	return (
		<TableCell className={style.TableCell} sx={{ width: '20%'}}>
			{isEdit ? (
				<StyledSelect
					value={installation.statuses?.[statusIndex]}
					label="Status"
					onChange={(e) => handleChangeInstallation(e.target.value, 'statuses_installation', newObj.id, connIndex, statusIndex)}
					variant="outlined"
					className={style.StyledSelect}
					IconComponent={CustomSelectIcon}
					bgColor={bgColor}
					textColor={textColor}
				>
					{STATUS.map((e) => (
						<MenuItem value={e.value} key={e.value}>
							{e.label}
						</MenuItem>
					))}
				</StyledSelect>
			) : (
				<Typography
					variant="body1"
					sx={{ padding: '0px', fontSize: '14px', textAlign: 'center', whiteSpace: 'nowrap'  }}
					className={style.Typography}
				>
					{STATUS_MAP[installation.statuses?.[statusIndex]]}
				</Typography>
			)}
		</TableCell>
	)
}

const InstallationTable = ({ handleChangeInstallation, newObj, isEdit, isExpanded, toggleExpand, handleAddNote, handleDeleteRow}) => {
	const [hoveredRowIndex, setHoveredRowIndex] = useState(null)
	const [isNotePopupOpen, setIsNotePopupOpen] = useState(false)
	const [inputValue, setInputValue] = useState(); 

	const handleOpenPopup = (index) => {
		setIsNotePopupOpen(true);
		setInputValue(newObj.currentObj.installations[index].note)
	};


	const handleClosePopup = () => {
		setIsNotePopupOpen(false);
		setInputValue('')
	};


	const AddNote = () => {
		handleAddNote(newObj.id, inputValue, "installations", hoveredRowIndex)
		setIsNotePopupOpen(false)
		setInputValue('')
	}

	const deleteRow = (index) => {	
		handleDeleteRow(newObj.id, index, "connections")
	}

	const button = { label: 'Continue', onClick: (() => AddNote()) }

	return (
	<>
	<Box sx={{ position: 'relative', width: '100%'}}>
		<Collapse
			sx={{ overflow: 'visible', position: 'relative', zIndex: 1}}
			in={isExpanded}
			collapsedSize={
				newObj.currentObj.installations.length < 7 ? `${(newObj.currentObj.installations.length * 4.5) + 4}vh`: '34vh'
			}
		>
			<Box
				sx={{
					maxHeight: isExpanded ? 'none' : '34.7vh',
					overflow: 'auto',
				}}
			>
				<TableContainer
					sx={{
						border: '1px solid lightgrey',
						width: '100%',
						borderRadius: '8px',
						overflow: 'visible',
					}}
				>
					<Table>
						<TableHead>
							<TableRow style={{width: '100%', backgroundColor: '#f9f9fa' }}>
								{renderTableCell('T/L Section', '10%', true)}
								{renderTableCell('Length(m)', '40%', true)}
								{newObj.currentObj.installations[0]?.statuses.map((_, index) => (
									<>{renderTableCell(`${index + 1}T/L`, '10%', true)}</>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{newObj.currentObj.installations.map((installation, index) => {
								let status = ''
								const joinType = newObj.currentObj.connections[index]?.joinType
								console.log(newObj, newObj.currentObj.installations)
								if (index === 0) {
									status = `${newObj?.currentObj?.inputValues?.first?.startLocation}${newObj.currentObj.start}#${index + 1}~${JB_TYPE_MAP[joinType]}#${
										index + 1
									}`
								} else if (index === newObj.currentObj.installations.length - 1) {
									status = `${JB_TYPE_MAP[newObj.currentObj.connections[index - 1]?.joinType]}#${index}~Yeonsu${newObj.currentObj.end}`;
								} else {
									status = `${JB_TYPE_MAP[newObj.currentObj?.connections[index - 1]?.joinType]}#${index}~${
										JB_TYPE_MAP[joinType]
									}#${index + 1}`
								}
								return <>{renderTableRow(installation, index, handleChangeInstallation, status, newObj, isEdit, hoveredRowIndex, setHoveredRowIndex, handleOpenPopup, isNotePopupOpen, deleteRow)}</>
							})}

						</TableBody>
					</Table>
				</TableContainer>
			</Box>
		</Collapse>
		{newObj.currentObj.installations.length > 6 && (
			<IconButton
				style={{
					border: '1px solid rgba(0, 0, 0, 0.1)',
					backgroundColor: '#fff',
					boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.04)',
					borderRadius: '32px',
					width: window.innerWidth < 1600 ? '20px' : '24px', // Adjusted size
					height: window.innerHeight < 900 ? '20px' : '24px', // Adjusted size
					boxSizing: 'border-box',
					zIndex: '5',
					position: 'absolute',
					right: `50px`,
					bottom: '-12px',
					padding: '0px',
				}}
				onClick={toggleExpand}
			>
				<Iconify
					icon={isExpanded ? 'mi:chevron-double-up' : 'mi:chevron-double-down'}
					width={window.innerWidth < 1600 ? 14 : 16} // Adjusted size
					height={window.innerHeight < 900 ? 14 : 16} // Adjusted size
					sx={{ color: '#596570' }}
				/>
			</IconButton>
		)}
	</Box>
	<NotePopup isOpen={isNotePopupOpen} onClose={handleClosePopup} title={"Add Note"} button={button} inputValue={inputValue} setInputValue={setInputValue} /> 
	</>
)
}

InstallationTable.propTypes = {
	handleChangeInstallation: PropTypes.func.isRequired,
	newObj: PropTypes.object.isRequired,
	isEdit: PropTypes.bool.isRequired,
	isExpanded: PropTypes.bool.isRequired,
	toggleExpand: PropTypes.func.isRequired,
	handleAddNote: PropTypes.func.isRequired,
	handleDeleteRow: PropTypes.func.isRequired,
}

export default InstallationTable
