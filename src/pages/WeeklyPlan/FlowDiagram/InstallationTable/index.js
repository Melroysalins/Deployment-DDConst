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
	Select,
	MenuItem,
	Collapse,
	Box,
	IconButton,
} from '@mui/material'
import style from './InstallationTable.module.scss'
import { JB_TYPE_MAP, JUNCTION_BOX_MAP, STATUS, STATUS_MAP, COLOR_MAP } from '../diagramHelper'
import Iconify from 'components/Iconify'
import HoverBox from 'components/hover'
import { visitNode } from 'typescript'
import Label from 'components/Label'
import NotePopup from 'components/NotePopup'

const renderTableCell = (text) => (
	<TableCell className={style.TableCell} sx={{ padding: '12px 8px', width: '100%' }}>
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
		<TableCell className={style.TableCell} sx={{ padding: '12px 8px', width: '100%', textAlign: 'center' }}>
			{isEdit ? (
				<TextField
					variant="outlined"
					sx={{ width: '70px', '& .MuiInputBase-root': { height: 32 } }}
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
			<HoverBox index={index} setVisibleNotes={handleOpenPopup} />
		)}
	</TableRow>
	</>
	
)}

const renderStatus = (installation, isEdit, handleChangeInstallation, newObj, connIndex, statusIndex) => (
	<TableCell className={style.TableCell} sx={{ padding: '12px 8px', width: '100%', textAlign: 'center' }}>
		{isEdit ? (
			<Select
				value={installation.statuses?.[statusIndex]}
				label="Status"
				onChange={(e) => handleChangeInstallation(e.target.value, 'statuses', newObj.id, connIndex, statusIndex)}
				variant="outlined"
				className={style.StyledSelect}
				size="small"
			>
				{STATUS.map((e) => (
					<MenuItem value={e.value} key={e.value}>
						{e.label}
					</MenuItem>
				))}
			</Select>
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
	<Box sx={{ position: 'relative', left: '2px', width: '98%' }}>
		<Collapse
			sx={{ overflow: 'visible', position: 'relative', zIndex: 1}}
			in={isExpanded}
			collapsedSize={
				newObj.currentObj.installations.length < 7 ? (newObj.currentObj.installations.length * 65.5) + 45: isEdit ? '438px' : '350px'
			}
		>
			<Box
				sx={{
					maxHeight: isExpanded ? 'none' : isEdit ? '438px' : '350px',
					overflow: 'auto',
				}}
			>
				<TableContainer
					sx={{
						border: '1px solid lightgrey',
						width: '60%',
						marginLeft: '25px',
						borderRadius: '8px',
						overflow: 'visible',
					}}
				>
					<Table>
						<TableHead>
							<TableRow style={{ backgroundColor: '#f9f9fa' }}>
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
									status = `${newObj?.currentObj?.inputValues?.first?.startLocation}${newObj.currentObj.start}#${index + 1}~${JB_TYPE_MAP[joinType]}#${
										index + 1
									}`
								} else if (index === newObj.currentObj.installations.length - 1) {
									if (newObj.isEnd) {
										status = `${JB_TYPE_MAP[newObj.currentObj.connections[index - 1]?.joinType]}#${index}~${newObj?.currentObj?.inputValues?.first?.endLocation}${newObj.currentObj.end}`;
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
