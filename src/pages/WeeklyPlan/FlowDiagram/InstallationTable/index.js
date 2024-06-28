import React from 'react'
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
} from '@mui/material'
import style from './InstallationTable.module.scss'
import { JB_TYPE_MAP, JUNCTION_BOX_MAP, STATUS, STATUS_MAP } from '../diagramHelper'

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

const renderTableRow = (connection, index, handleNewObjChange, displayName, newObj, isEdit) => (
	<TableRow>
		{renderTableCell(`${displayName}`)}
		<TableCell className={style.TableCell} sx={{ padding: '12px 8px', width: '100%', textAlign: 'center' }}>
			{isEdit ? (
				<TextField
					variant="outlined"
					sx={{ width: '70px', '& .MuiInputBase-root': { height: 32 } }}
					placeholder="320"
					onChange={(e) => handleNewObjChange(e.target.value, 'length', newObj.id)}
					value={newObj.currentObj.length}
				/>
			) : (
				<Typography
					variant="body1"
					sx={{ padding: '0px', fontSize: '14px', textAlign: 'center' }}
					className={style.Typography}
				>
					{newObj.currentObj.length}
				</Typography>
			)}
		</TableCell>
		{connection.statuses.map((e, statusIndex) => (
			<>{renderStatus(connection, isEdit, handleNewObjChange, newObj.id, index, statusIndex)}</>
		))}
	</TableRow>
)

const renderStatus = (connection, isEdit, handleNewObjChange, objId, connIndex, statusIndex) => (
	<TableCell className={style.TableCell} sx={{ padding: '12px 8px', width: '100%', textAlign: 'center' }}>
		{isEdit ? (
			<Select
				value={connection.statuses?.[statusIndex]}
				label="Status"
				onChange={(e) => handleNewObjChange(e.target.value, 'statuses', objId, connIndex, statusIndex)}
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
				sx={{ padding: '0px', fontSize: '14px', textAlign: 'center' }}
				className={style.Typography}
			>
				{STATUS_MAP[connection.statuses?.[statusIndex]]}
			</Typography>
		)}
	</TableCell>
)

const InstallationTable = ({ handleNewObjChange, newObj, isEdit }) => (
	<TableContainer
		sx={{
			border: '1px solid lightgrey',
			width: 'max-content',
			marginLeft: '25px',
			borderRadius: '8px',
			overflow: 'auto',
		}}
	>
		<Table sx={{ overflow: 'auto' }}>
			<TableHead>
				<TableRow style={{ backgroundColor: '#f9f9fa' }}>
					{renderTableCell('T/L Section')}
					{renderTableCell('Length(m)')}
					{newObj.currentObj.connections[0]?.statuses.map((_, index) => (
						<>{renderTableCell(`${index + 1}T/L`)}</>
					))}
				</TableRow>
			</TableHead>
			<TableBody>
				{newObj.currentObj.connections.map((connection, index) => {
					let status = ''
					if (index === 0) {
						status = `Namyang${newObj.currentObj.start}#${index + 1}~${JB_TYPE_MAP[connection.joinType]}#${index + 1}`
					} else if (index === newObj.currentObj.connections.length) {
						status = `${JB_TYPE_MAP[connection.joinType]}#${index + 1}~Yeonsu${JUNCTION_BOX_MAP[newObj.currentObj.end]}`
					} else {
						status = `${JB_TYPE_MAP[newObj.currentObj.connections[index - 1].joinType]}#${index}~${
							JB_TYPE_MAP[connection.joinType]
						}#${index + 1}`
					}

					return <>{renderTableRow(connection, index, handleNewObjChange, status, newObj, isEdit)}</>
				})}

				{newObj.isEnd && (
					<>
						{renderTableRow(
							newObj.currentObj.connections[newObj.currentObj.connections.length - 1],
							newObj.currentObj.connections.length - 1,
							handleNewObjChange,
							`${JB_TYPE_MAP[newObj.currentObj.connections[newObj.currentObj.connections.length - 1].joinType]}#${
								newObj.currentObj.connections.length
							}~Yeonsu${newObj.currentObj.end}#1`,
							newObj,
							isEdit
						)}
					</>
				)}
			</TableBody>
		</Table>
	</TableContainer>
)

InstallationTable.propTypes = {
	handleNewObjChange: PropTypes.func.isRequired,
	newObj: PropTypes.object.isRequired,
	isEdit: PropTypes.bool.isRequired,
}

export default InstallationTable
