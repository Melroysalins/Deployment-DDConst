import React, { useEffect, useRef, useState } from 'react'
import {
	Box,
	InputLabel,
	FormControl,
	FormHelperText,
	Typography,
	IconButton,
	MenuItem,
	Select as MuiSelect,
	Table,
	TableBody,
	TableContainer,
	TableHead,
	TableCell,
	TableRow,
	Collapse,
	Tooltip,
	TextField,
	styled,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import Iconify from 'components/Iconify'
import style from './DemolitionTable.module.scss'
import PropTypes from 'prop-types'
import {
	CONNECTORS,
	JB_TYPE,
	JB_TYPE_MAP,
	JUNCTION_BOX,
	JUNCTION_BOX_MAP,
	PMJ,
	STATUS,
	STATUS_MAP,
} from '../diagramHelper'
import HoverBox from 'components/hover'
import NotePopup from 'components/NotePopup'
import { getColorFromValue } from '../helper'
import { useTranslation } from 'react-i18next';

const StyledSelect = styled(MuiSelect)(({ bgColor, textColor }) => ({
	height: '24px',
	borderRadius: '4px',
	backgroundColor: bgColor,
	width: 'max-content',
	minWidth: '79px',
	fontFamily: "'Manrope', sans-serif",
	fontWeight: 500,
	lineHeight: '24px',
	fontSize: '14px',
	'& .MuiOutlinedInput-notchedOutline': {
		border: 'none',
	},
	'& .MuiSelect-select': {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center', // Center the text horizontally
		paddingRight: '0.2rem !important',
		gap: '4px',
		color: textColor,
		padding: '0.2rem !important',
		'@media (max-width: 105rem)': {
			fontSize: '12px',
			height: '14px',
		}, 
	},
}));

const Select = styled(MuiSelect)({
	height: '3vh',
	minHeight: '28px',
	borderRadius: '8px',
	width: '100%',
	color: '#596570',
	fontWeight: 400,
	lineHeight: '24px',
	fontSize: '14px',
	'@media (max-width: 105rem)': {
		fontSize: '13px',
		// padding: '0.5556vh 0.3125vw',
	},

	'& .MuiSelect-select': {
		minWidth: '40px',
		paddingRight: '0px !important',
		padding: '0.25rem 0.375rem 0.25rem 0.5rem '
	},

	'& .css-z83vip-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-z83vip-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-z83vip-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input':{
		width: '20px',
		paddingRight: '0px',
		padding: '0.25rem 0.375rem 0.25rem 0.5rem',	
	},
});

const CustomSelectIcon = () => (
	<Iconify
		icon="iconamoon:arrow-down-2-light"
		width="24px" // Adjusted size
		height="24px" // Adjusted size
		sx={{ color: '#596570', marginRight: '0.5rem' }}
	/>
  );

const renderTableRow = (demolition, index, handleChangeDemolition, objId, isEdit, hoveredRowIndex, setHoveredRowIndex, handleOpenPopup, isNotePopupOpen, deleteRow, t) => (
	<TableRow key={index} sx={{ position: 'relative'}} onMouseEnter={() => setHoveredRowIndex(index)}
	onMouseLeave={() => {
        if (!isNotePopupOpen) { // Check if NotePopup is not open
            setHoveredRowIndex(null);
        }
    }}>
		<TableCell sx={{ padding: '0.425rem 0.175rem', width: '4.86vw', height: '48px', minWidth: '70px' }}>
			<Typography
				className={style.Typography}
				variant="body1"
				sx={{ padding: '0px', fontSize: '14px', textAlign: 'center', color: '#596570'  }}
			>{`#${index + 1}`}</Typography>
		</TableCell>
		<TableCell className={style.TableCell}>
			{isEdit ? (
					<Select
						className={style.Select}
						color="primary"
						value={demolition.joinType}
						label="Jb Type"
						onChange={(e) => handleChangeDemolition(e.target.value, 'joinType', objId, index)}
						disableUnderline
						displayEmpty
						IconComponent={CustomSelectIcon}
						renderValue={(value) => t(value)}

					>
						{JB_TYPE.map((e) => (
							<MenuItem value={e.value} key={e}>
								{t(e.label)}
							</MenuItem>
						))}
					</Select>
			) : (
				<Typography
					className={style.Typography}
					variant="body1"
					sx={{ padding: '0px', fontSize: '14px', textAlign: 'center' }}
				>
					{t(JB_TYPE_MAP[demolition.joinType])}
				</Typography>
			)}
		</TableCell>

		<TableCell className={style.TableCell}>
			{isEdit ? (
					<Select
						className={style.Select}
						color="primary"
						value={demolition.pmj}
						label="PMJ"
						onChange={(e) => handleChangeDemolition(e.target.value, 'pmj', objId, index)}
						disableUnderline
						displayEmpty
						IconComponent={CustomSelectIcon}
						renderValue={(value) => t(value)}
					>
						{PMJ.map((e) => (
							<MenuItem value={e} key={e}>
								{t(e)}
							</MenuItem>
						))}
					</Select>
			) : (
				<Typography
					className={style.Typography}
					variant="body1"
					sx={{ padding: '0px', fontSize: '14px', textAlign: 'center' }}
				>
					{t(demolition.pmj)}
				</Typography>
			)}
		</TableCell>
		{demolition.statuses.map((e, statusIndex) => (
			<>{renderStatus(demolition, isEdit, handleChangeDemolition, objId, index, statusIndex, t)}</>
		))}
		{hoveredRowIndex === index && isEdit && (
			<HoverBox index={index} setVisibleNotes={handleOpenPopup} isDelete={true} deleteRow={deleteRow} />
		)}
	</TableRow>
)

const renderTypography = (index) => (
	<TableCell index={index} className={style.TableCell} sx={{ width: '13%' , borderTopRightRadius: '8px' }}>
		<Typography
			className={style.Typography}
			variant="body1"
			sx={{ padding: '0px', fontSize: '14px', textAlign: 'center', fontWeight: 600 }}
		>
			{index + 1}T/L
		</Typography>
	</TableCell>
)

const renderInput = (index, t) => {
	return (
		<TableCell index={index} className={style.TableCell} sx={{ width: '13%' , borderTopRightRadius: '8px' }}>
			<TextField
				variant="outlined"
				placeholder="320"
				value={t('TLWithNumber', { number: index + 1, tl: t('T/L') })}
				InputProps={{
					readOnly: true,
				}}
				sx={{
					'& .MuiOutlinedInput-input': { padding: '0px 0px 0px 5px', fontSize: '13px', height: '28px', color: '#596570' }, // Adjust padding for the input field
					'& .MuiOutlinedInput-root': { borderRadius: '7px', backgroundColor: '#fff' }, // Adjust padding for the root if necessary
				}}
			/>
		</TableCell>
	)
}

const renderStatus = (demolition, isEdit, handleChangeDemolition, objId, connIndex, statusIndex, t) => {
	const { bgColor, textColor } = getColorFromValue(demolition.statuses?.[statusIndex]);
	
	return (
		<TableCell sx={{ width: '0%', padding: ' 0.425rem 0.175rem'}} index={connIndex}>
			{isEdit ? (
					<StyledSelect
						className={style.StyledSelect}
						label={t('Status')}
						value={demolition.statuses?.[statusIndex]}
						onChange={(e) => handleChangeDemolition(e.target.value, 'statuses', objId, connIndex, statusIndex)}
						variant="outlined"
						IconComponent=""
						bgColor={bgColor}
						textColor={textColor} 
						renderValue={(value) => t(value)}
					>
						{STATUS.map((e) => (
							<MenuItem value={e.value} key={e.value}>
								{t(e.label)}
							</MenuItem>
						))}
					</StyledSelect>
			) : (
				<Typography
					className={style.Typography}
					variant="body1"
					sx={{ padding: '0px', fontSize: '14px', textAlign: 'center' }}
				>
					{t(STATUS_MAP[demolition.statuses?.[statusIndex]])}
				</Typography>
			)}
		</TableCell>
	)
}

const renderStatusStartEnd = (isEdit, handleChangeDemolition, newObj, index, name, t) => {
	const { bgColor, textColor } = getColorFromValue(newObj.currentObj.endpointsDemolition[name]?.[index]);
	
	return (
		<TableCell sx={{ width: '0%', padding: ' 0.425rem 0.175rem'}} index={index}>
			{isEdit ? (
					<StyledSelect
						className={style.StyledSelect}
						label={t('Status')}
						value={newObj.currentObj.endpointsDemolition[name]?.[index]}
						onChange={(e) => handleChangeDemolition(e.target.value, name, newObj.id, index)}
						variant="outlined"
						IconComponent=""
						bgColor={bgColor}
						textColor={textColor} 
						renderValue={(value) => t(value)}
					>
						{STATUS.map((e) => (
							<MenuItem value={e.value} key={e.value}>
								{t(e.label)}
							</MenuItem>
						))}
					</StyledSelect>
			) : (
				<Typography
					className={style.Typography}
					variant="body1"
					sx={{ padding: '0px', fontSize: '14px', textAlign: 'center' }}
				>
					{t(STATUS_MAP[newObj.currentObj.endpointsDemolition[name]?.[index]])}
				</Typography>
			)}
		</TableCell>
	)
}

const DemolitionTable = ({ handleAddDemolition, handleChangeDemolition, newObj, isEdit, handleAddNote, handleDeleteRow, toggleDemolitionExpand, isDemolitionExpanded, handleNewObjChange }) => {
	const [isExpanded, setIsExpanded] = useState(false)
	const [hoveredRowIndex, setHoveredRowIndex] = useState(null)
	const [isNotePopupOpen, setIsNotePopupOpen] = useState(false)
	const [inputValue, setInputValue] = useState(); 
	const [scrollPosition, setScrollPosition] = useState(0);
	const boxRef = useRef(null);

	const addPanel = () => {
		handleAddDemolition(newObj.id)
	}

	const { t } = useTranslation(['diagram']);

	const handleOpenPopup = (index) => {
		setIsNotePopupOpen(true);
		if (index === 'start') {
			setInputValue(newObj.currentObj.endpointsDemolition.startNote)
		} else if (index === 'end') {
			setInputValue(newObj.currentObj.endpointsDemolition.endNote)
		} else {
		setInputValue(newObj.currentObj.demolitions[index].note)
		}
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

	const deleteRow = (index) => {	
		handleDeleteRow(newObj.id, index, "demolitions") 
	}

	const button = { label: 'Continue', onClick: (() => AddNote()) }

	return (
		<>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'flex-start',
					alignItems: 'flex-end',
					width: '100%',
					overflow: 'visible', // Clip any overflowing content
				}}
			>
				<Box
					sx={{
						minHeight: '86px',
						maxWidth: '28px',
						borderRadius: '8px 0px 0px 8px',
						backgroundColor: '#ffa58d',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						padding: '12px 2px',
						boxSizing: 'border-box',
						'@media (max-width: 105rem)': {
							padding: '12px 0.0001%',
						},
					}}
				>
					<Typography
						className={style.Typography} // Add className here
						sx={{
							writingMode: 'vertical-rl',
							fontWeight: '600',
							color: '#fff',
							transform: 'rotate(180deg)',
							fontSize: '16px',
							'@media (max-width: 105rem)': {
								fontSize: '14px',
							},
						}}
					>
						{t('End point')}
					</Typography>
				</Box>
				<TableContainer sx={{ width: '100%', border: '1px solid lightgrey', borderRadius: '8px 8px 8px 0px', overflow: 'visible' }}>
					<Table >
						<TableHead > 
							<TableRow style={{ backgroundColor: '#f9f9fa' }}>
								<TableCell sx={{ padding: '0.425rem 0.175rem', width: '4.86vw', height: '48px', minWidth: '70px' }} >
									<Typography
										className={style.Typography}
										variant="body1"
										sx={{ padding: '0px', fontSize: '14px', textAlign: 'center', fontWeight: 600 }}
									>
										{t('Location')}
									</Typography>
								</TableCell>
								<TableCell className={style.TableCell} >
									<Typography
										className={style.Typography}
										variant="body1"
										sx={{ padding: '0px', fontSize: '14px', textAlign: 'center', fontWeight: 600 }}
									>
										{t('Transformer')}
									</Typography>
								</TableCell>
								<TableCell className={style.TableCell} >
									<Typography
										className={style.Typography}
										variant="body1"
										sx={{ padding: '0px', fontSize: '14px', textAlign: 'center', fontWeight: 600 }}
									>
										{t('Connector')}
									</Typography>
								</TableCell>
								{newObj.currentObj.endpointsDemolition.startStatuses.map((e, index) => renderInput(index, t))}
							</TableRow>
						</TableHead>
						<TableBody>
							<TableRow sx={{ position: 'relative' }} onMouseEnter={() => setHoveredRowIndex('start')} onMouseLeave={() => {
								if (!isNotePopupOpen) { // Check if NotePopup is not open
									setHoveredRowIndex(null);
								}
							}} >
								<TableCell sx={{ padding: '0.425rem 0.175rem', width: '4.86vw', height: '48px', minWidth: '70px' }} >
									<Typography
										className={style.Typography}
										variant="body1"
										sx={{ padding: '0px', fontSize: '14px', textAlign: 'center', color: '#596570' }}
									>
										{newObj?.cable_name?.startLocation}
									</Typography>
								</TableCell>
								<TableCell className={style.TableCell} >
									{isEdit ? (
											<Select
												className={style.Select}
												color="primary"
												value={newObj.currentObj.endpointsDemolition.start}
												onChange={(e) => handleChangeDemolition(e.target.value, 'start', newObj.id)}
												disableUnderline
												displayEmpty
												IconComponent={CustomSelectIcon}
												renderValue={(value) => t(value)}
											>
												{JUNCTION_BOX.map((e) => (
													<MenuItem value={e.value} key={e.value}>
														{t(e.label)}
													</MenuItem>
												))}
											</Select>	
									) : (
										<Typography
											className={style.Typography}
											variant="body1"
											sx={{ padding: '0px', fontSize: '14px', textAlign: 'center' }}
										>
											{t(newObj.currentObj.endpointsDemolition.start)}
										</Typography>
									)}
								</TableCell>
								<TableCell className={style.TableCell} >
									{isEdit ? (
											<Select
												className={style.Select}
												color="primary"
												value={newObj.currentObj.endpointsDemolition.startConnector}
												onChange={(e) => handleChangeDemolition(e.target.value, 'startConnector', newObj.id)}
												disableUnderline
												displayEmpty
												IconComponent={CustomSelectIcon}

											>
												{CONNECTORS.map((e) => (
													<MenuItem value={e.value} key={e.value}>
														{e.label}
													</MenuItem>
												))}
											</Select>
									) : (
										<Typography
											className={style.Typography}
											variant="body1"
											sx={{ padding: '0px', fontSize: '14px', textAlign: 'center' }}
										>
											{JUNCTION_BOX_MAP[newObj.currentObj.endpointsDemolition.startConnector]}
										</Typography>
									)}
								</TableCell>
								{newObj.currentObj.endpointsDemolition.startStatuses.map((e, index) => (
									<>{renderStatusStartEnd(isEdit, handleChangeDemolition, newObj, index, 'startStatuses', t)}</>
								))}
								{hoveredRowIndex === 'start' && isEdit && (
									<HoverBox index={'start'} setVisibleNotes={handleOpenPopup} />
								)}
							</TableRow>
							<TableRow sx={{ position: 'relative' }} onMouseEnter={() => setHoveredRowIndex('end')} onMouseLeave={() => {
								if (!isNotePopupOpen) { // Check if NotePopup is not open
									setHoveredRowIndex(null);
								}
							}} >
								<TableCell sx={{ padding: '0.425rem 0.175rem', width: '4.86vw', height: '48px', minWidth: '70px' }}>
									<Typography
										className={style.Typography}
										variant="body1"
										sx={{ padding: '0px', fontSize: '14px', textAlign: 'center', color: '#596570'  }}
									>
										{newObj?.cable_name?.endLocation}
									</Typography>
								</TableCell>
								<TableCell className={style.TableCell} >
									{isEdit ? (
										<Select
											className={style.Select}
											color="primary"
											value={newObj.currentObj.endpointsDemolition.end}
											onChange={(e) => handleChangeDemolition(e.target.value, 'end', newObj.id)}
											disableUnderline
											displayEmpty
											IconComponent={CustomSelectIcon}
											renderValue={(value) => t(value)}
										>
											{JUNCTION_BOX.map((e) => (
												<MenuItem value={e.value} key={e.value}>
													{t(e.label)}
												</MenuItem>
											))}
										</Select>	
									) : (
										<Typography
											className={style.Typography}
											variant="body1"
											sx={{ padding: '0px', fontSize: '14px', textAlign: 'center' }}
										>
											{t(newObj.currentObj.endpointsDemolition.end)}
										</Typography>
									)}
								</TableCell>
								<TableCell className={style.TableCell}>
									{isEdit ? (		
											<Select
												className={style.Select}
												color="primary"
												label="Connector"
												value={newObj.currentObj.endpointsDemolition.endConnector}
												onChange={(e) => handleChangeDemolition(e.target.value, 'endConnector', newObj.id)}
												disableUnderline
												displayEmpty
												IconComponent={CustomSelectIcon}

											>
												{CONNECTORS.map((e) => (
													<MenuItem value={e.value} key={e.value}>
														{e.label}
													</MenuItem>
												))}
											</Select>
									) : (
										<Typography
											className={style.Typography}
											variant="body1"
											sx={{ padding: '0px', fontSize: '14px', textAlign: 'center' }}
										>
											{JUNCTION_BOX_MAP[newObj.currentObj.endpointsDemolition.endConnector]}
										</Typography>
									)}
								</TableCell>
								{newObj.currentObj.endpointsDemolition.endStatuses.map((e, index) => (
									<>{renderStatusStartEnd(isEdit, handleChangeDemolition, newObj, index, 'endStatuses', t)}</>
								))}
								{hoveredRowIndex === 'end' && isEdit && (
									<HoverBox index={'end'} setVisibleNotes={handleOpenPopup} />
								)}
							</TableRow>

						</TableBody>
					</Table>
				</TableContainer>
			</Box>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'flex-start',
					alignItems: 'flex-start',
					width: '100%',
					position: 'relative',
					
				}}
			>
				<Box
					sx={{
						// maxHeight: '80px',
						maxHeight: `${newObj.currentObj.demolitions.length > 1 ? '96px' : '39.5px' }`,
						maxWidth: '28px',
						borderRadius: '8px 0px 0px 8px',
						backgroundColor: '#ffa58d',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						padding: '12px 2px',
						boxSizing: 'border-box',
						'@media (max-width: 105rem)': {
							padding: '14px 0.0001%',
						},
					}}
				>
					<Typography
						sx={{
							writingMode: 'vertical-rl',
							fontWeight: '600',
							color: '#fff',
							fontSize: '16px',
							transform: 'rotate(180deg)',
							'@media (max-width: 105rem)': {
								fontSize: '14px',
							},
						}}
						className={style.Typography}
					>
						Mid {newObj.currentObj.demolitions.length > 1 ? 'point' : ''}
					</Typography>
				</Box>
				<Collapse
					sx={{width: '100%', position: 'relative', overflow: 'hidden', borderRadius: '0px 8px 8px 8px', border: '1px solid lightgrey' }}
					in={isDemolitionExpanded}
					collapsedSize={
						newObj.currentObj.demolitions.length < 7 ? `${newObj.currentObj.demolitions.length * 48}px` : '290px'
					}
				>
					<TableContainer
						sx={{
							overflow: 'visible',
							minWidth: '430px',
						}}
					>
						<Table>
							<TableBody>
								{newObj.currentObj.demolitions.map((demolition, index) => (
									<>{renderTableRow(demolition, index, handleChangeDemolition, newObj.id, isEdit, hoveredRowIndex, setHoveredRowIndex, handleOpenPopup, isNotePopupOpen, deleteRow, t)}</>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</Collapse>
				{isEdit && (
					<Box
						sx={{
							position: 'absolute',
							bottom: '-12px',
							left: '40px',
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
								width: '24px', // Adjusted size
								height: '24px', // Adjusted size
							}}
							onClick={addPanel} // Add onClick event handler here
						>
            				<AddIcon sx={{ color: '#fff', fontSize: window.innerWidth < 1600 ? 16 : 'inherit' }} /> {/* Adjusted icon size */}
						</IconButton>
					</Box>
				)}
				{newObj.currentObj.demolitions.length > 6 && (
					<TableRow>
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
								right: '20px',
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
					</TableRow>
				)}
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
	isDemolitionExpanded: PropTypes.bool,
	toggleDemolitionExpand: PropTypes.func,
	isNotePopupOpen: PropTypes.bool,
	setIsNotePopupOpen: PropTypes.func.isRequired,
	handleAddNote: PropTypes.func.isRequired,
	handleDeleteRow: PropTypes.func.isRequired,
	handleNewObjChange: PropTypes.func.isRequired,
}

export default DemolitionTable
