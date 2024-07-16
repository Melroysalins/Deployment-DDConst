import React, { useState } from 'react'
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
import style from './ConnectionTable.module.scss'
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

const renderTableRow = (connection, index, handleNewObjChange, objId, isEdit, hoveredRowIndex, setHoveredRowIndex, handleOpenPopup, isNotePopupOpen) => (
	<TableRow key={index} sx={{ position: 'relative'}} onMouseEnter={() => setHoveredRowIndex(index)}
	onMouseLeave={() => {
        if (!isNotePopupOpen) { // Check if NotePopup is not open
            setHoveredRowIndex(null);
        }
    }}>
		<TableCell className={style.TableCell}>
			<Typography
				className={style.Typography}
				variant="body1"
				sx={{width: '3.32vw', padding: '0px', fontSize: '14px', textAlign: 'center' }}
			>{`#${index + 1}`}</Typography>
		</TableCell>
		<TableCell sx={{ padding: '0.425rem 0.175rem', width: '4.86vw', minWidth: '70.44px'}}>
			{isEdit ? (
					<Select
						className={style.Select}
						color="primary"
						value={connection.joinType}
						label="Jb Type"
						onChange={(e) => handleNewObjChange(e.target.value, 'joinType', objId, index)}
						disableUnderline
						displayEmpty
						IconComponent={CustomSelectIcon}

					>
						{JB_TYPE.map((e) => (
							<MenuItem value={e.value} key={e}>
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
					{JB_TYPE_MAP[connection.joinType]}
				</Typography>
			)}
		</TableCell>

		<TableCell sx={{ padding: '0.425rem 0.175rem', width: '4.86vw', minWidth: '60.95px'}}>
			{isEdit ? (
					<Select
						className={style.Select}
						color="primary"
						value={connection.pmj}
						label="PMJ"
						onChange={(e) => handleNewObjChange(e.target.value, 'pmj', objId, index)}
						disableUnderline
						displayEmpty
						IconComponent={CustomSelectIcon}

					>
						{PMJ.map((e) => (
							<MenuItem value={e} key={e}>
								{e}
							</MenuItem>
						))}
					</Select>
			) : (
				<Typography
					className={style.Typography}
					variant="body1"
					sx={{ padding: '0px', fontSize: '14px', textAlign: 'center' }}
				>
					{connection.pmj}
				</Typography>
			)}
		</TableCell>
		{connection.statuses.map((e, statusIndex) => (
			<>{renderStatus(connection, isEdit, handleNewObjChange, objId, index, statusIndex)}</>
		))}
		{hoveredRowIndex === index && isEdit && (
			<HoverBox index={index} setVisibleNotes={handleOpenPopup} />
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

const renderStatus = (connection, isEdit, handleNewObjChange, objId, connIndex, statusIndex) => (
	<TableCell sx={{ width: '4.72vw', padding: ' 0.425rem 0.175rem'}} index={connIndex}>
		{isEdit ? (
				<StyledSelect
					className={style.StyledSelect}
					label="Status"
					value={connection.statuses?.[statusIndex]}
					onChange={(e) => handleNewObjChange(e.target.value, 'statuses', objId, connIndex, statusIndex)}
					variant="outlined"
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
				className={style.Typography}
				variant="body1"
				sx={{ padding: '0px', fontSize: '14px', textAlign: 'center' }}
			>
				{STATUS_MAP[connection.statuses?.[statusIndex]]}
			</Typography>
		)}
	</TableCell>
)

const renderStatusStartEnd = (isEdit, handleNewObjChange, newObj, index, name) => (
	<TableCell sx={{ width: '4.72vw', padding: ' 0.425rem 0.175rem'}} index={index}>
		{isEdit ? (
				<StyledSelect
					className={style.StyledSelect}
					label="Status"
					value={newObj.currentObj[name]?.[index]}
					onChange={(e) => handleNewObjChange(e.target.value, name, newObj.id, index)}
					variant="outlined"
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
				className={style.Typography}
				variant="body1"
				sx={{ padding: '0px', fontSize: '14px', textAlign: 'center' }}
			>
				{STATUS_MAP[newObj.currentObj[name]?.[index]]}
			</Typography>
		)}
	</TableCell>
)

const ConnectionTable = ({
	handleAddConnection,
	handleCloseInstallation,
	handleNewObjChange,
	newObj,
	isEdit,
	isExpanded,
	toggleExpand,
	handleAddNote
}) => {
	const addPanel = () => {
		handleAddConnection(newObj.id)
	}

	const [hoveredRowIndex, setHoveredRowIndex] = useState(null)
	const [isNotePopupOpen, setIsNotePopupOpen] = useState(false)
	const [inputValue, setInputValue] = useState(); 

	const handleOpenPopup = (index) => {
		setIsNotePopupOpen(true);
		if (index === 'start') {
			setInputValue(newObj.currentObj.startNote)
		} else if (index === 'end') {
			setInputValue(newObj.currentObj.endNote)
		} else {
		setInputValue(newObj.currentObj.connections[index].note)
		}
	};

	const handleClosePopup = () => {
		setIsNotePopupOpen(false);
		setInputValue('')
	};

	const AddNote = () => {
		handleAddNote(newObj.id, inputValue, "connections", hoveredRowIndex)
		setIsNotePopupOpen(false)
		setInputValue('')
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
					maxWidth: '100%', // Ensure the box does not exceed the width of its parent
					overflow: 'visible', // Clip any overflowing content
					flexShrink: 1, 
				}}
			>
				<Box
					sx={{
						minHeight: '96px',
						maxWidth: '28px',
						borderRadius: '8px 0px 0px 8px',
						backgroundColor: '#ffa58d',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						padding: '16px 2px',
						boxSizing: 'border-box',
					}}
				>
					<Typography
						className={style.Typography} // Add className here
						sx={{
							writingMode: 'vertical-rl',
							fontWeight: '600',
							color: '#fff',
							transform: 'rotate(180deg)',
						}}
					>
						End point
					</Typography>
				</Box>
				<TableContainer sx={{ width: '100%', border: '1px solid lightgrey', borderTopRightRadius: '8px', overflow: 'visible' }}>
					<Table >
						<TableHead > 
							<TableRow style={{ backgroundColor: '#f9f9fa' }}>
								<TableCell className={style.TableCell} >
									<Typography
										className={style.Typography}
										variant="body1"
										sx={{ padding: '0px', fontSize: '14px', textAlign: 'center', fontWeight: 600 }}
									>
										Location
									</Typography>
								</TableCell>
								<TableCell className={style.TableCell} >
									<Typography
										className={style.Typography}
										variant="body1"
										sx={{ padding: '0px', fontSize: '14px', textAlign: 'center', fontWeight: 600 }}
									>
										Transformer
									</Typography>
								</TableCell>
								<TableCell className={style.TableCell} >
									<Typography
										className={style.Typography}
										variant="body1"
										sx={{ padding: '0px', fontSize: '14px', textAlign: 'center', fontWeight: 600 }}
									>
										Connector
									</Typography>
								</TableCell>
								{newObj.currentObj.startStatuses.map((e, index) => renderTypography(index))}
							</TableRow>
						</TableHead>
						<TableBody>
							<TableRow sx={{ position: 'relative' }} onMouseEnter={() => setHoveredRowIndex('start')} onMouseLeave={() => {
								if (!isNotePopupOpen) { // Check if NotePopup is not open
									setHoveredRowIndex(null);
								}
							}} >
								<TableCell className={style.TableCell} >
									<Typography
										className={style.Typography}
										variant="body1"
										sx={{ padding: '0px', fontSize: '14px', textAlign: 'center' }}
									>
										Namyang
									</Typography>
								</TableCell>
								<TableCell className={style.TableCell} >
									{isEdit ? (
											<Select
												className={style.Select}
												color="primary"
												value={newObj.currentObj.start}
												onChange={(e) => handleNewObjChange(e.target.value, 'start', newObj.id)}
												disableUnderline
												displayEmpty
												IconComponent={CustomSelectIcon}

											>
												{JUNCTION_BOX.map((e) => (
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
											{newObj.currentObj.start}
										</Typography>
									)}
								</TableCell>
								<TableCell className={style.TableCell} >
									{isEdit ? (
											<Select
												className={style.Select}
												color="primary"
												value={newObj.currentObj.startConnector}
												onChange={(e) => handleNewObjChange(e.target.value, 'startConnector', newObj.id)}
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
											{JUNCTION_BOX_MAP[newObj.currentObj.startConnector]}
										</Typography>
									)}
								</TableCell>
								{newObj.currentObj.startStatuses.map((e, index) => (
									<>{renderStatusStartEnd(isEdit, handleNewObjChange, newObj, index, 'startStatuses')}</>
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
								<TableCell className={style.TableCell} sx={{ width: '10%' }}>
									<Typography
										className={style.Typography}
										variant="body1"
										sx={{ padding: '0px', fontSize: '14px', textAlign: 'center' }}
									>
										Yeonsu
									</Typography>
								</TableCell>
								<TableCell className={style.TableCell} sx={{ width: '15%' }}>
									{isEdit ? (
										<Select
											className={style.Select}
											color="primary"
											value={newObj.currentObj.end}
											onChange={(e) => handleNewObjChange(e.target.value, 'end', newObj.id)}
											disableUnderline
											displayEmpty
												IconComponent={CustomSelectIcon}

										>
											{JUNCTION_BOX.map((e) => (
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
											{newObj.currentObj.end}
										</Typography>
									)}
								</TableCell>
								<TableCell className={style.TableCell}>
									{isEdit ? (		
											<Select
												className={style.Select}
												color="primary"
												label="Connector"
												value={newObj.currentObj.endConnector}
												onChange={(e) => handleNewObjChange(e.target.value, 'endConnector', newObj.id)}
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
											{JUNCTION_BOX_MAP[newObj.currentObj.endConnector]}
										</Typography>
									)}
								</TableCell>
								{newObj.currentObj.endStatuses.map((e, index) => (
									<>{renderStatusStartEnd(isEdit, handleNewObjChange, newObj, index, 'endStatuses')}</>
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
					
				}}
			>
				<Box
					sx={{
						maxHeight: '104px',
						height: `${newObj.currentObj.connections.length > 1 ? '78px' : '40.5px' }`,
						maxWidth: '28px',
						borderRadius: '8px 0px 0px 8px',
						backgroundColor: '#ffa58d',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						padding: '12px 2px',
						boxSizing: 'border-box',
					}}
				>
					<Typography
						sx={{
							writingMode: 'vertical-rl',
							fontWeight: '600',
							color: '#fff',
							transform: 'rotate(180deg)',
						}}
						className={style.Typography}
					>
						Mid {newObj.currentObj.connections.length > 1 ? 'point' : ''}
					</Typography>
				</Box>
				<Collapse
					sx={{width: '100%', paddingBottom: '8px'}}
					in={isExpanded}
					collapsedSize={
						newObj.currentObj.connections.length < 7 ? newObj.currentObj.connections.length * 38 : 228
					}
				>
					<Box sx={{ maxHeight: isExpanded ? 'none' : '228px', overflow: 'auto', width: '100%'}}>
						<TableContainer
							sx={{
								borderRadius: '0px 0px 8px 0px',
								border: '1px solid lightgrey',
								overflow: 'visible'
							}}
						>
							<Table>
								<TableBody>
									{newObj.currentObj.connections.map((connection, index) => (
										<>{renderTableRow(connection, index, handleNewObjChange, newObj.id, isEdit, hoveredRowIndex, setHoveredRowIndex, handleOpenPopup, isNotePopupOpen)}</>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</Box>
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
								width: '24px',
								height: '24px',
							}}
							onClick={addPanel} // Add onClick event handler here
						>
							<AddIcon sx={{ color: '#fff' }} />
						</IconButton>
						{!newObj.isEnd && (
							<Tooltip title="Done adding" arrow placement="right">
								<IconButton
									style={{
										border: '1px solid #6ac79b',
										backgroundColor: '#fff',
										boxShadow: '0px 8px 16px rgba(152, 210, 195, 0.24)',
										borderRadius: '32px',
										padding: '0px',
										width: '24px',
										height: '24px',
									}}
									onClick={() => handleCloseInstallation(newObj.id)} // Add onClick event handler here
								>
									<Iconify icon="ic:round-check" width={16} height={16} sx={{ color: '#6ac78b' }} />
								</IconButton>
							</Tooltip>
						)}
					</Box>
				)}
				{newObj.currentObj.connections.length > 6 && (
					<TableRow>
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
								right: '100px',
								bottom: '-12px',
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
					</TableRow>
				)}
			</Box>
			<NotePopup isOpen={isNotePopupOpen} onClose={handleClosePopup} title={"Add Note"} button={button} inputValue={inputValue} setInputValue={setInputValue} /> 
		</>
	)
}

ConnectionTable.propTypes = {
	handleAddConnection: PropTypes.func.isRequired,
	handleCloseInstallation: PropTypes.func.isRequired,
	handleNewObjChange: PropTypes.func.isRequired,
	newObj: PropTypes.object.isRequired,
	isEdit: PropTypes.bool,
	isExpanded: PropTypes.bool,
	toggleExpand: PropTypes.func,
	isNotePopupOpen: PropTypes.bool.isRequired,
	setIsNotePopupOpen: PropTypes.func.isRequired,
	handleAddNote: PropTypes.func.isRequired,
}

export default ConnectionTable
