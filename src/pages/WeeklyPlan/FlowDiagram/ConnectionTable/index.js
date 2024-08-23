import React, { useState } from 'react'
import {
	Box,
	InputLabel,
	FormControl,
	FormHelperText,
	Typography,
	IconButton,
	MenuItem,
	Select,
	Table,
	TableBody,
	TableContainer,
	TableHead,
	TableCell,
	TableRow,
	Collapse,
	Tooltip,
	TextField,
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

const renderTableRow = (connection, index, handleNewObjChange, objId, isEdit, hoveredRowIndex, setHoveredRowIndex, handleOpenPopup, isNotePopupOpen) => (
	<TableRow key={index} sx={{ position: 'relative'}} onMouseEnter={() => setHoveredRowIndex(index)}
	onMouseLeave={() => {
        if (!isNotePopupOpen) { // Check if NotePopup is not open
            setHoveredRowIndex(null);
        }
    }}>
		<TableCell className={style.TableCell} sx={{ width: '10%' }}>
			<Typography
				className={style.Typography}
				variant="body1"
				sx={{ padding: '0px', fontSize: '14px', textAlign: 'center' }}
			>{`#${index + 1}`}</Typography>
		</TableCell>
		<TableCell className={style.TableCell} sx={{ width: '15%' }}>
			{isEdit ? (
				<FormControl variant="outlined" sx={{ width: '100%', height: '32px' }} className={style.FormControl}>
					<InputLabel className={style.InputLabel} color="primary">
						Jb Type
					</InputLabel>
					<Select
						className={style.Select}
						color="primary"
						sx={{ height: '32px' }}
						value={connection.joinType}
						label="Jb Type"
						onChange={(e) => handleNewObjChange(e.target.value, 'joinType', objId, index)}
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
					{JB_TYPE_MAP[connection.joinType]}
				</Typography>
			)}
		</TableCell>

		<TableCell className={style.TableCell} sx={{ width: '15%' }}>
			{isEdit ? (
				<FormControl variant="outlined" sx={{ width: '100%', height: '32px' }} className={style.FormControl}>
					<InputLabel className={style.InputLabel} color="primary">
						PMJ
					</InputLabel>
					<Select
						className={style.Select}
						color="primary"
						sx={{ height: '32px' }}
						value={connection.pmj}
						label="PMJ"
						onChange={(e) => handleNewObjChange(e.target.value, 'pmj', objId, index)}
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
			sx={{ padding: '0px', fontSize: '14px', textAlign: 'center' }}
		>
			{index + 1}T/L
		</Typography>
	</TableCell>
)

const renderStatus = (connection, isEdit, handleNewObjChange, objId, connIndex, statusIndex) => (
	<TableCell index={connIndex}>
		{isEdit ? (
			<FormControl variant="outlined" sx={{ width: '100%', height: '32px' }} className={style.FormControl}>
				<InputLabel className={style.InputLabel} color="primary">
					Status
				</InputLabel>
				<Select
					className={style.StyledSelect}
					label="Status"
					sx={{ height: '32px' }}
					value={connection.statuses?.[statusIndex]}
					onChange={(e) => handleNewObjChange(e.target.value, 'statuses', objId, connIndex, statusIndex)}
					variant="outlined"
					size="small"
				>
					{STATUS.map((e) => (
						<MenuItem value={e.value} key={e.value}>
							{e.label}
						</MenuItem>
					))}
				</Select>
			</FormControl>
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
	<TableCell index={index}>
		{isEdit ? (
			<FormControl variant="outlined" size="small">
				<InputLabel className={style.InputLabel} color="primary">
					Status
				</InputLabel>
				<Select
					className={style.StyledSelect}
					label="Status"
					value={newObj.currentObj[name]?.[index]}
					onChange={(e) => handleNewObjChange(e.target.value, name, newObj.id, index)}
					variant="outlined"
					size="small"
				>
					{STATUS.map((e) => (
						<MenuItem value={e.value} key={e.value}>
							{e.label}
						</MenuItem>
					))}
				</Select>
			</FormControl>
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
				}}
			>
				<Box
					sx={{
						minHeight: '96px',
						width: '100%',
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
				<TableContainer sx={{ width: '100%', border: '1px solid lightgrey', borderTopRightRadius: '8px', overflow: 'visible clip' }}>
					<Table >
						<TableHead > 
							<TableRow style={{ backgroundColor: '#f9f9fa' }}>
								<TableCell className={style.TableCell} sx={{ width: '10%' }}>
									<Typography
										className={style.Typography}
										variant="body1"
										sx={{ padding: '0px', fontSize: '14px', textAlign: 'center' }}
									>
										Location
									</Typography>
								</TableCell>
								<TableCell className={style.TableCell} sx={{ width: '15%' }}>
									<Typography
										className={style.Typography}
										variant="body1"
										sx={{ padding: '0px', fontSize: '14px', textAlign: 'center' }}
									>
										Transformer
									</Typography>
								</TableCell>
								<TableCell className={style.TableCell} sx={{ width: '15%' }}>
									<Typography
										className={style.Typography}
										variant="body1"
										sx={{ padding: '0px', fontSize: '14px', textAlign: 'center' }}
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
								<TableCell className={style.TableCell} sx={{ width: '10%' }}>
									<Typography
										className={style.Typography}
										variant="body1"
										sx={{ padding: '0px', fontSize: '14px', textAlign: 'center' }}
									>
										Namyang
									</Typography>
								</TableCell>
								<TableCell className={style.TableCell} sx={{ width: '15%' }}>
									{isEdit ? (
										<FormControl
											variant="outlined"
											sx={{ width: '100%' }}
											className={style.FormControl} // Add className here
										>
											<InputLabel className={style.InputLabel} color="primary">
												Start
											</InputLabel>
											<Select
												className={style.Select}
												color="primary"
												sx={{ height: '32px' }}
												value={newObj.currentObj.start}
												label="Start"
												onChange={(e) => handleNewObjChange(e.target.value, 'start', newObj.id)}
												size="small"
												disableUnderline
												displayEmpty
											>
												{JUNCTION_BOX.map((e) => (
													<MenuItem value={e.value} key={e.value}>
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
											{newObj.currentObj.start}
										</Typography>
									)}
								</TableCell>
								<TableCell className={style.TableCell} sx={{ width: '15%' }}>
									{isEdit ? (
										<FormControl
											variant="outlined"
											sx={{ width: '100%' }}
											className={style.FormControl} // Add className here
										>
											<InputLabel className={style.InputLabel} color="primary">
												Connector
											</InputLabel>
											<Select
												className={style.Select}
												color="primary"
												sx={{ height: '32px' }}
												label="Connector"
												value={newObj.currentObj.startConnector}
												onChange={(e) => handleNewObjChange(e.target.value, 'startConnector', newObj.id)}
												disableUnderline
												displayEmpty
											>
												{CONNECTORS.map((e) => (
													<MenuItem value={e.value} key={e.value}>
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
										<FormControl
											variant="outlined"
											sx={{ width: '100%', height: '32px' }}
											className={style.FormControl} // Add className here
										>
											<InputLabel className={style.InputLabel} color="primary">
												End
											</InputLabel>
											<Select
												className={style.Select}
												color="primary"
												sx={{ height: '32px' }}
												value={newObj.currentObj.end}
												label="End"
												onChange={(e) => handleNewObjChange(e.target.value, 'end', newObj.id)}
												disableUnderline
												displayEmpty
											>
												{JUNCTION_BOX.map((e) => (
													<MenuItem value={e.value} key={e.value}>
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
											{newObj.currentObj.end}
										</Typography>
									)}
								</TableCell>
								<TableCell className={style.TableCell} sx={{ width: '15%' }}>
									{isEdit ? (
										<FormControl
											variant="outlined"
											sx={{ width: '100%', height: '32px' }}
											className={style.FormControl} // Add className here
										>
											<InputLabel className={style.InputLabel} color="primary">
												Connector
											</InputLabel>
											<Select
												className={style.Select}
												color="primary"
												sx={{ height: '32px' }}
												label="Connector"
												value={newObj.currentObj.endConnector}
												onChange={(e) => handleNewObjChange(e.target.value, 'endConnector', newObj.id)}
												disableUnderline
												displayEmpty
											>
												{CONNECTORS.map((e) => (
													<MenuItem value={e.value} key={e.value}>
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
						minHeight: '67px',
						width: '100%',
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
					sx={{overflow: 'visible', width: '100%'}}
					in={isExpanded}
					collapsedSize={
						newObj.currentObj.connections.length < 7 ? newObj.currentObj.connections.length * 65 : 392
					}
				>
					<Box sx={{ maxHeight: isExpanded ? 'none' : '392px', overflow: 'auto', width: '100%'}}>
						<TableContainer
							sx={{
								width: '95%',
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
