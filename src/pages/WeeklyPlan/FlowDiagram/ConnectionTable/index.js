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
import typography from 'theme/typography'
import { render } from 'react-dom'
import { constant } from 'lodash'

const renderTableRow = (connection, index, handleNewObjChange, objId, isEdit, midLines) => (
<TableRow key={index}>
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
	{Array.from({ length: midLines }, (_, index) => (
		<>{renderStatus(connection, isEdit, handleNewObjChange, objId, index)}</>
	))}
</TableRow>
)

const renderTypography = (index) => {
return (
	<TableCell className={style.TableCell} sx={{ width: '13%' }}>
	  <Typography 
		className={style.Typography}
		variant="body1"
		sx={{ padding: '0px', fontSize: '14px', textAlign: 'center' }}
	  >
		{index + 1}T/L
	  </Typography>
	</TableCell>
)
};

const renderStatus = (connection, isEdit, handleNewObjChange, objId, index,  ) => {

console.log("render Status: ", connection)
return (
  <TableCell>
	{isEdit ? (
	  <FormControl variant="outlined" size="small">
		<Select
		  className={style.StyledSelect}
		  label="Status"
		  value={connection.status}
		  onChange={(e) => handleNewObjChange(e.target.value, 'status', objId, index)}
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
		{STATUS_MAP[connection.status]}
	  </Typography>
	)}
  </TableCell>
);
};

const ConnectionTable = ({ handleAddConnection, handleCloseInstallation, handleNewObjChange, newObj, isEdit, midLines=1, isExpanded, toggleExpand }) => {

const addPanel = () => {
	handleAddConnection(newObj.id)
}

console.log('connection length: ', newObj.currentObj.connections.length)

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
			<TableContainer sx={{ width: 'max-content', border: '1px solid lightgrey', borderRadius: '0px 8px 0px 0px' }}>
				<Table sx={{ overflow: 'hidden' }}>
					<TableHead>
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
							{Array.from({ length: midLines }, (_, index) => (
								renderTypography(index)
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow>
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
							{Array.from({ length: midLines }, (_, index) => (
								<>{renderStatus(newObj.currentObj.connections[0], isEdit, handleNewObjChange, newObj.id, index)}</>
							))}
						</TableRow>
						<TableRow>
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
							{Array.from({ length: midLines }, (_, index) => (
								<>{renderStatus(newObj.currentObj.connections[0], isEdit, handleNewObjChange, newObj.id, index)}</>
							))}
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
			<TableContainer sx={{ width: 'max-content', borderRadius: '0px 0px 8px 0px', border: '1px solid lightgrey' }}>
				<Box sx={{ overflow: 'hidden' }}>
					<Table sx={{}}>
						<TableBody>
							<Collapse
								in={isExpanded}
								collapsedSize={
									newObj.currentObj.connections.length < 7 ? newObj.currentObj.connections.length * 73 : 438
								}
							>
								<Box sx={{ maxHeight: isExpanded ? 'none' : '438px', overflow: 'auto' }}>
									{newObj.currentObj.connections.map((connection, index) => (
										<>{renderTableRow(connection, index, handleNewObjChange, newObj.id, isEdit, midLines)}</>
									))}
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
							</TableBody>
						</Table>
					</Box>
				</TableContainer>
			</Box>
		</>
	)
}

ConnectionTable.propTypes = {
	handleAddConnection: PropTypes.func.isRequired,
	handleCloseInstallation: PropTypes.func.isRequired,
	handleNewObjChange: PropTypes.func.isRequired,
	newObj: PropTypes.object.isRequired,
	isEdit: PropTypes.bool,
	midLines: PropTypes.any.isRequired,
}

export default ConnectionTable
