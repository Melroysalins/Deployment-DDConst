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
import { JB_TYPE_MAP, JUNCTION_BOX_MAP, STATUS, STATUS_MAP } from '../diagramHelper'
import Iconify from 'components/Iconify'
import HoverBox from 'components/hover'
import { visitNode } from 'typescript'
import Label from 'components/Label'
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
        '@media (max-width: 1440px)': {
            fontSize: '10px',
            padding: '0.1rem',
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

const CustomSelectIcon = () => (
	<>
		<Box sx={{ width: '0px', height: '0px'}} />
	</>
  );

const renderTableCell = (text) => (
	<TableCell className={style.TableCell} sx={{ width: '60%'}}>
		<Typography
			variant="body1"
			sx={{ padding: '0px', fontSize: '14px', textAlign: 'center' }}
			className={style.Typography}
		>
			{text}
		</Typography>
	</TableCell>
)

const renderTableRow = (installation, index, handleChangeInstallation, displayName, newObj, isEdit, hoveredRowIndex, setHoveredRowIndex, handleOpenPopup, isNotePopupOpen) => {
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
					sx={{ maxWidth: '70px', '& .MuiInputBase-root': { height: '3vh', borderRadius: '6px' } }}
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
			<>{renderStatus(installation, isEdit, handleChangeInstallation, newObj.id, index, statusIndex)}</>
		))}
		{hoveredRowIndex === index && isEdit && (
			<HoverBox index={index} setVisibleNotes={handleOpenPopup} />
		)}
	</TableRow>
	</>
	
)}

const renderStatus = (installation, isEdit, handleChangeInstallation, objId, connIndex, statusIndex) => (
	<TableCell className={style.TableCell} sx={{ width: '20%'}}>
		{isEdit ? (
			<StyledSelect
				value={installation.statuses?.[statusIndex]}
				label="Status"
				onChange={(e) => handleChangeInstallation(e.target.value, 'statuses', objId, connIndex, statusIndex)}
				variant="outlined"
				className={style.StyledSelect}
				IconComponent={CustomSelectIcon}
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

const InstallationTable = ({ handleChangeInstallation, newObj, isEdit, isExpanded, toggleExpand, handleAddNote}) => {
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

	const button = { label: 'Continue', onClick: (() => AddNote()) }

	return (
	<>
	<Box sx={{ position: 'relative', width: '100%'}}>
		<Collapse
			sx={{ overflow: 'visible', position: 'relative', zIndex: 1}}
			in={isExpanded}
			collapsedSize={
				newObj.currentObj.installations.length < 7 ? (newObj.currentObj.installations.length * 38) + 33.9: '261.9px'
			}
		>
			<Box
				sx={{
					maxHeight: isExpanded ? 'none' : '261.9px',
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
								{renderTableCell('T/L Section')}
								{renderTableCell('Length(m)')}
								{newObj.currentObj.installations[0]?.statuses.map((_, index) => (
									<>{renderTableCell(`${index + 1}T/L`)}</>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{newObj.currentObj.installations.map((installation, index) => {
								let status = ''
								const joinType = newObj.currentObj.connections[index]?.joinType
								console.log(newObj, newObj.currentObj.installations)
								if (index === 0) {
									status = `Namyang${newObj.currentObj.start}#${index + 1}~${JB_TYPE_MAP[joinType]}#${
										index + 1
									}`
								} else if (index === newObj.currentObj.installations.length - 1) {
									if (newObj.isEnd) {
										status = `${JB_TYPE_MAP[newObj.currentObj.connections[index - 1]?.joinType]}#${index}~Yeonsu${newObj.currentObj.end}`;
									} else {
										status = `${JB_TYPE_MAP[newObj.currentObj.connections[index - 1].joinType]}#${index}~${JB_TYPE_MAP[joinType]}#${index + 1}`;
									}
								} else {
									status = `${JB_TYPE_MAP[newObj.currentObj.connections[index - 1].joinType]}#${index}~${
										JB_TYPE_MAP[joinType]
									}#${index + 1}`
								}
								return <>{renderTableRow(installation, index, handleChangeInstallation, status, newObj, isEdit, hoveredRowIndex, setHoveredRowIndex, handleOpenPopup, isNotePopupOpen)}</>
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
					width: '24px',
					height: '24px',
					boxSizing: 'border-box',
					zIndex: '5',
					position: 'relative',
					right: `-${newObj.currentObj.installations[0]?.statuses.length * 140 + 200}px`,
					bottom: '12px',
					padding: '0px',
				}}
				onClick={toggleExpand}
			>
				<Iconify
					icon={isExpanded ? 'mi:chevron-double-up' : 'mi:chevron-double-down'}
					width={16}
					height={16}
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
}

export default InstallationTable
