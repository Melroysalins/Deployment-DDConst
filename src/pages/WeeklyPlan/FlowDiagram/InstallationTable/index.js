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
import { JB_TYPE_MAP, JUNCTION_BOX_MAP, STATUS } from '../diagramHelper'

const renderTableCell = (text) => (
	<TableCell className={style.TableCell} sx={{ padding: '12px 8px', minWidth: 170 }}>
		<Typography
			variant="body1"
			sx={{ padding: '0px', fontSize: '14px', textAlign: 'center' }}
			className={style.Typography}
		>
			{text}
		</Typography>
	</TableCell>
)

const renderTableRow = (connection, index, handleNewObjChange, displayName, newObj) => (
	<TableRow>
		{renderTableCell(`${displayName}`)}
		<TableCell className={style.TableCell} sx={{ padding: '12px 8px', width: '100%', textAlign: 'center' }}>
			<TextField
				variant="outlined"
				sx={{ width: '70px', '& .MuiInputBase-root': { height: 32 } }}
				placeholder="320"
				onChange={(e) => handleNewObjChange(e.target.value, 'length', newObj.id)}
				value={newObj.currentObj.length}
			/>
		</TableCell>
		<TableCell className={style.TableCell} sx={{ padding: '12px 8px', width: '100%', textAlign: 'center' }}>
			<Select
				value={connection.status}
				label="Status"
				onChange={(e) => handleNewObjChange(e.target.value, 'status', newObj.id, index)}
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
		</TableCell>
	</TableRow>
)

const InstallationTable = ({ handleNewObjChange, newObj }) => (
	<TableContainer sx={{ border: '1px solid lightgrey', width: 'max-content', marginLeft: '25px', borderRadius: '8px' }}>
		<Table sx={{ overflow: 'hidden' }}>
			<TableHead>
				<TableRow style={{ backgroundColor: '#f9f9fa' }}>
					{renderTableCell('T/L Section')}
					{renderTableCell('Length(m)')}
					{renderTableCell('Status')}
				</TableRow>
			</TableHead>
			<TableBody>
				{/* {renderTableRow(`NamyangS/S~M/H#1`)} */}
				{/* M/H#${index + 1}~M/H#${index + 2} */}
				{newObj.currentObj.connections.map((connection, index) => {
					let status = ''
					if (index === 0) {
						status = `Namyang${JUNCTION_BOX_MAP[newObj.currentObj.start]}~${JB_TYPE_MAP[connection.joinType]}#${
							index + 1
						}`
					} else if (index === newObj.currentObj.connections.length) {
						status = `${JB_TYPE_MAP[connection.joinType]}#${index + 1}~Yeonsu${JUNCTION_BOX_MAP[newObj.currentObj.end]}`
					} else {
						status = `${JB_TYPE_MAP[newObj.currentObj.connections[index - 1].joinType]}#${index + 1}~${
							JB_TYPE_MAP[connection.joinType]
						}#${index + 2}`
					}

					return <>{renderTableRow(connection, index, handleNewObjChange, status, newObj)}</>
				})}
			</TableBody>
		</Table>
	</TableContainer>
)

InstallationTable.propTypes = {
	installations: PropTypes.array.isRequired,
	handleNewObjChange: PropTypes.func.isRequired,
	newObj: PropTypes.object.isRequired,
}

export default InstallationTable
