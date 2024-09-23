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
import style from './DemolitionInstallation.module.scss'
import { JB_TYPE_MAP, STATUS, STATUS_MAP } from '../diagramHelper'
import Iconify from 'components/Iconify'
import HoverBox from 'components/hover'
import NotePopup from 'components/NotePopup'
import { getColorFromValue } from '../helper'

const StyledSelect = styled(MuiSelect)(({ bgColor, textColor }) => ({
	height: '24px',
	borderRadius: '4px',
	backgroundColor: bgColor,
	width: 'max-content',
	minWidth: '79px',
	maxWidth: '87px',
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
		'@media (max-width: 105rem)': {
			fontSize: '13px',
			height: '14px',
		}, 
	},
}));

const CustomSelectIcon = () => (
	<>
		<Box sx={{ width: '0px', height: '0px'}} />
	</>
  );

  const renderTableCell = (text, cellWidth='3.73vw', isTableHead=false, BoxWidth) => { 
	const shouldEllipsis = BoxWidth === 2;
	return (
	<TableCell sx={{ padding: '0.425rem 0.175rem', width: '100%', height: '48px'}}>
	  <Typography 
	  	sx={{ 
			maxWidth: '10.47vw', 
			whiteSpace: 'nowrap', 
			overflow: 'hidden', 
			textOverflow: 'ellipsis', 
			padding: '0px', 
			fontSize: '14px', 
			textAlign: isTableHead && 'center', 
			color: isTableHead ? '#000' : '#596570', // Conditional color
			fontWeight: isTableHead ? 600 : 'normal', // Conditional fontWeight
			'@media (max-width: 1510px)': {
				maxWidth: shouldEllipsis ? '6.47vw': 'none',
			},
		}}>
		  {text}
	  </Typography>
	</TableCell>
  )
  };
  
const renderTableRow = (demolitionInstallation, index, handleChangeInstallation, displayName, newObj, isEdit, hoveredRowIndex, setHoveredRowIndex, handleOpenPopup, isNotePopupOpen) => {
	const BoxWidth = demolitionInstallation.statuses.length
	return (
	<>
	<TableRow  sx={{ position: 'relative'}} onMouseEnter={() => setHoveredRowIndex(index)}
	onMouseLeave={() => {
        if (!isNotePopupOpen) { // Check if NotePopup is not open
            setHoveredRowIndex(null);
        }
    }} >
		{renderTableCell(`${displayName}`, '10%', false, BoxWidth)}
		<TableCell className={style.TableCell} >
			{isEdit ? (
				<TextField
					className={style.TextField}
					variant="outlined"
					sx={{ '& .MuiInputBase-root': { height: '32px', borderRadius: '8px', maxWidth: '98px' } }}
					placeholder="320"
					onChange={(e) => handleChangeInstallation(e.target.value, 'length_demolition', newObj.id, index)}
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
		{demolitionInstallation.statuses.map((e, statusIndex) => (
			<>{renderStatus(demolitionInstallation, isEdit, handleChangeInstallation, newObj, index, statusIndex)}</>
		))}
		{hoveredRowIndex === index && isEdit && (
			<HoverBox index={index} setVisibleNotes={handleOpenPopup}/>
		)}
	</TableRow>
	</>
	
)}

const renderStatus = (demolitionInstallation, isEdit, handleChangeInstallation, newObj, connIndex, statusIndex) => {
	const { bgColor, textColor } = getColorFromValue(demolitionInstallation.statuses?.[statusIndex]);

	return (
		<TableCell className={style.TableCell} >
			{isEdit ? (
				<StyledSelect
					value={demolitionInstallation.statuses?.[statusIndex]}
					label="Status"
					onChange={(e) => handleChangeInstallation(e.target.value, 'statuses', newObj.id, connIndex, statusIndex)}
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
					{STATUS_MAP[demolitionInstallation.statuses?.[statusIndex]]}
				</Typography>
			)}
		</TableCell>
	)
}

const InstallationTable = ({ handleChangeInstallation, newObj, isEdit, isDemolitionExpanded, toggleDemolitionExpand, handleAddNote}) => {
	const [hoveredRowIndex, setHoveredRowIndex] = useState(null)
	const [isNotePopupOpen, setIsNotePopupOpen] = useState(false)
	const [inputValue, setInputValue] = useState(); 

	const handleOpenPopup = (index) => {
		setIsNotePopupOpen(true);
		setInputValue(newObj.currentObj.demolitionInstallations[index].note)
	};

	const handleClosePopup = () => {
		setIsNotePopupOpen(false);
		setInputValue('')
	};

	const AddNote = () => {
		handleAddNote(newObj.id, inputValue, "demolitionInstallations", hoveredRowIndex)
		setIsNotePopupOpen(false)
		setInputValue('')
	}

	const button = { label: 'Continue', onClick: (() => AddNote()) }

	return (
	<>
	<Box sx={{ position: 'relative', width: '100%'}}>
		<Collapse
			sx={{ overflow: 'hidden', position: 'relative', zIndex: 1, border: '1px solid lightgrey', borderRadius: '8px' }}
			in={isDemolitionExpanded}
			collapsedSize={
				newObj.currentObj.demolitionInstallations.length < 7 ? `${(newObj.currentObj.demolitionInstallations.length * 48) + 48}px`: '338px'
			}
		>
			<TableContainer
				sx={{
					width: '100%',
					overflow: 'visible',
				}}
			>
				<Table>
					<TableHead>
						<TableRow style={{width: '100%', backgroundColor: '#f9f9fa' }}>
							{renderTableCell('T/L Section', '10%', true)}
							{renderTableCell('Length(m)', '40%', true)}
							{newObj.currentObj.demolitionInstallations[0]?.statuses.map((_, index) => (
								<>{renderTableCell(`${index + 1}T/L`, '10%', true)}</>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{newObj.currentObj.demolitionInstallations.map((demolitionInstallation, index) => {
							let status = ''
							const joinType = newObj.currentObj.demolitions[index]?.joinType
							console.log(newObj, newObj.currentObj.demolitionInstallations)
							if (index === 0) {
								status = `${newObj?.cable_name?.startLocation}${newObj.currentObj.endpointsDemolition.start}#${index + 1}~${JB_TYPE_MAP[joinType]}#${
									index + 1
								}`
							} else if (index === newObj.currentObj.demolitionInstallations.length - 1) {
								status = `${JB_TYPE_MAP[newObj.currentObj.demolitions[index - 1]?.joinType]}#${index}~${newObj?.cable_name?.endLocation}${newObj.currentObj.endpointsDemolition.end}`;
							} else {
								status = `${JB_TYPE_MAP[newObj.currentObj?.demolitions[index - 1]?.joinType]}#${index}~${
									JB_TYPE_MAP[joinType]
								}#${index + 1}`
							}
							return <>{renderTableRow(demolitionInstallation, index, handleChangeInstallation, status, newObj, isEdit, hoveredRowIndex, setHoveredRowIndex, handleOpenPopup, isNotePopupOpen)}</>
						})}

					</TableBody>
				</Table>
			</TableContainer>
		</Collapse>
		{newObj.currentObj.demolitionInstallations.length > 6 && (
			<IconButton
				style={{
					border: '1px solid rgba(0, 0, 0, 0.1)',
					backgroundColor: '#fff',
					boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.04)',
					borderRadius: '32px',
					width: '24px', // Adjusted size
					height: '24px', // Adjusted size
					boxSizing: 'border-box',
					zIndex: '5',
					position: 'absolute',
					right: `20px`,
					bottom: '-12px',
					padding: '0px',
				}}
				onClick={toggleDemolitionExpand}
			>
				<Iconify
					icon={isDemolitionExpanded ? 'mi:chevron-double-up' : 'mi:chevron-double-down'}
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
	isDemolitionExpanded: PropTypes.bool.isRequired,
	toggleDemolitionExpand: PropTypes.func.isRequired,
	handleAddNote: PropTypes.func.isRequired,
}

export default InstallationTable
