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
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import Iconify from 'components/Iconify'
import style from './ConnectionTable.module.scss'
import PropTypes from 'prop-types'
import { CONNECTORS, JB_TYPE, JUNCTION_BOX, PMJ, STATUS } from '../diagramHelper'

const renderTableRow = (connection, index, handleNewObjChange) => (
	<TableRow key={index}>
		<TableCell className={style.TableCell} sx={{ padding: '6px 10px', width: '92px' }}>
			<Typography
				className={style.Typography}
				variant="body1"
				sx={{ padding: '0px', fontSize: '14px', textAlign: 'center' }}
			>{`#${index + 1}`}</Typography>
		</TableCell>
		<TableCell className={style.TableCell} sx={{ padding: '6px 10px', width: '141.5px' }}>
			<FormControl variant="outlined" sx={{ width: '121.5px', height: '32px' }} className={style.FormControl}>
				<InputLabel className={style.InputLabel} color="primary">
					Jb Type
				</InputLabel>
				<Select
					className={style.Select}
					color="primary"
					sx={{ height: '32px' }}
					value={connection.joinType}
					label="Jb Type"
					onChange={(e) => handleNewObjChange(e.target.value, 'joinType', index)}
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
		</TableCell>

		<TableCell className={style.TableCell} sx={{ padding: '6px 10px', width: '141.5px' }}>
			<FormControl variant="outlined" sx={{ width: '121.5px', height: '32px' }} className={style.FormControl}>
				<InputLabel className={style.InputLabel} color="primary">
					PMJ
				</InputLabel>
				<Select
					className={style.Select}
					color="primary"
					sx={{ height: '32px' }}
					value={connection.pmj}
					label="PMJ"
					onChange={(e) => handleNewObjChange(e.target.value, 'pmj', index)}
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
		</TableCell>

		<TableCell className={style.TableCell} sx={{ padding: '12px 8px', width: '130px' }}>
			<Select
				className={style.StyledSelect}
				value={connection.status}
				label="Status"
				onChange={(e) => handleNewObjChange(e.target.value, 'status', index)}
				variant="outlined"
				size="small"
			>
				{STATUS.map((e) => (
					<MenuItem value={e.value} key={e.value}>
						{e.label}
					</MenuItem>
				))}
			</Select>
		</TableCell>
	</TableRow>
)

const ConnectionTable = ({ handleAddConnection, handleCloseInstallation, handleNewObjChange, newObj }) => {
	// const [midPoints, setMidPoints] = useState([1])
	const [isExpanded, setIsExpanded] = useState(false)

	const addPanel = () => {
		// setMidPoints((prevMidPoints) => [...prevMidPoints, prevMidPoints.length + 1])
		handleAddConnection()
	}

	const toggleExpand = () => {
		setIsExpanded((prevIsExpanded) => !prevIsExpanded)
	}

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
								<TableCell className={style.TableCell} sx={{ padding: '6px 10px', width: '92px' }}>
									<Typography
										className={style.Typography}
										variant="body1"
										sx={{ padding: '0px', fontSize: '14px', textAlign: 'center' }}
									>
										Location
									</Typography>
								</TableCell>
								<TableCell className={style.TableCell} sx={{ padding: '6px 10px', width: '141.5px' }}>
									<Typography
										className={style.Typography}
										variant="body1"
										sx={{ padding: '0px', fontSize: '14px', textAlign: 'center' }}
									>
										Transformer
									</Typography>
								</TableCell>
								<TableCell className={style.TableCell} sx={{ padding: '6px 10px', width: '141.5px' }}>
									<Typography
										className={style.Typography}
										variant="body1"
										sx={{ padding: '0px', fontSize: '14px', textAlign: 'center' }}
									>
										Connector
									</Typography>
								</TableCell>
								<TableCell className={style.TableCell} sx={{ padding: '6px 10px', width: '130px' }}>
									<Typography
										className={style.Typography}
										variant="body1"
										sx={{ padding: '0px', fontSize: '14px', textAlign: 'center' }}
									>
										Status
									</Typography>
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							<TableRow>
								<TableCell className={style.TableCell} sx={{ padding: '6px 10px', width: '92px' }}>
									<Typography
										className={style.Typography}
										variant="body1"
										sx={{ padding: '0px', fontSize: '14px', textAlign: 'center' }}
									>
										Namyang
									</Typography>
								</TableCell>
								<TableCell className={style.TableCell} sx={{ padding: '6px 10px', width: '141.5px' }}>
									<FormControl
										variant="outlined"
										sx={{ width: '121.5px' }}
										className={style.FormControl} // Add className here
									>
										<InputLabel className={style.InputLabel} color="primary">
											Start
										</InputLabel>
										<Select
											className={style.Select}
											color="primary"
											sx={{ height: '32px' }}
											value={newObj.start}
											label="Start"
											onChange={(e) => handleNewObjChange(e.target.value, 'start')}
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
								</TableCell>
								<TableCell className={style.TableCell} sx={{ padding: '6px 10px', width: '141px' }}>
									<FormControl
										variant="outlined"
										sx={{ width: '121.5px' }}
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
											value={newObj.startConnector}
											onChange={(e) => handleNewObjChange(e.target.value, 'startConnector')}
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
								</TableCell>
								<TableCell className={style.TableCell} sx={{ padding: '6px 10px', width: '130px' }}>
									<Select
										className={style.StyledSelect}
										label="Status"
										value={newObj.startStatus}
										onChange={(e) => handleNewObjChange(e.target.value, 'startStatus')}
										variant="outlined"
										size="small"
									>
										{STATUS.map((e) => (
											<MenuItem value={e.value} key={e.value}>
												{e.label}
											</MenuItem>
										))}
									</Select>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell className={style.TableCell} sx={{ padding: '6px 10px', width: '92px' }}>
									<Typography
										className={style.Typography}
										variant="body1"
										sx={{ padding: '0px', fontSize: '14px', textAlign: 'center' }}
									>
										Yeonsu
									</Typography>
								</TableCell>
								<TableCell className={style.TableCell} sx={{ padding: '6px 10px', wiscssdth: '141px' }}>
									<FormControl
										variant="outlined"
										sx={{ width: '121.5px', height: '32px' }}
										className={style.FormControl} // Add className here
									>
										<InputLabel className={style.InputLabel} color="primary">
											End
										</InputLabel>
										<Select
											className={style.Select}
											color="primary"
											sx={{ height: '32px' }}
											value={newObj.end}
											label="End"
											onChange={(e) => handleNewObjChange(e.target.value, 'end')}
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
								</TableCell>
								<TableCell className={style.TableCell} sx={{ padding: '6px 10px', width: '141px' }}>
									<FormControl
										variant="outlined"
										sx={{ width: '121.5px', height: '32px' }}
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
											value={newObj.endConnector}
											onChange={(e) => handleNewObjChange(e.target.value, 'endConnector')}
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
								</TableCell>
								<TableCell className={style.TableCell} sx={{ padding: '12px 8px', width: '130px' }}>
									<Select
										className={style.StyledSelect}
										label="Status"
										value={newObj.endStatus}
										onChange={(e) => handleNewObjChange(e.target.value, 'endStatus')}
										variant="outlined"
										size="small"
									>
										{STATUS.map((e) => (
											<MenuItem value={e.value} key={e.value}>
												{e.label}
											</MenuItem>
										))}
									</Select>
								</TableCell>
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
						Mid {newObj.connections.length > 1 ? 'point' : ''}
					</Typography>
				</Box>
				<TableContainer sx={{ width: 'max-content', borderRadius: '0px 0px 8px 0px', border: '1px solid lightgrey' }}>
					<Box sx={{ overflow: 'hidden' }}>
						<Table sx={{}}>
							<TableBody>
								<Collapse
									in={isExpanded}
									collapsedSize={newObj.connections.length < 7 ? newObj.connections.length * 65 : 390}
								>
									<Box sx={{ maxHeight: isExpanded ? 'none' : '390px', overflow: 'auto' }}>
										{newObj.connections.map((connection, index) => (
											<>{renderTableRow(connection, index, handleNewObjChange)}</>
										))}
									</Box>
								</Collapse>
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
										disabled
										onClick={handleCloseInstallation} // Add onClick event handler here
									>
										<Iconify icon="ic:round-check" width={16} height={16} sx={{ color: '#6ac78b' }} />
									</IconButton>
								</Box>
								{newObj.connections.length > 6 && (
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
										onClick={toggleExpand} // Add onClick event handler here
									>
										<Iconify
											icon={isExpanded ? 'mi:chevron-double-up' : 'mi:chevron-double-down'}
											width={16}
											height={16}
											sx={{ color: '#596570' }}
										/>
									</IconButton>
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
}

export default ConnectionTable
