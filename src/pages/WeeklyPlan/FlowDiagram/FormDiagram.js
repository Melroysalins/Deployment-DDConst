/* eslint-disable react/prop-types */
import { InputLabel, Box, FormControl, MenuItem, Select, Button, Typography, TextField } from '@mui/material'
import Iconify from 'components/Iconify'
import React from 'react'

export const MIN_X = 200
export const NAMYUNG = ['XLPE', 'OF', 'Other']
export const CABLE_TYPE = ['154kV', '345kV', '746kV']
export const JUNCTION_BOX = [
	{ label: 'T/R', value: 'recTri' },
	{ label: 'S/S', value: 'square' },
]
export const JB_TYPE = ['J/B', 'M/H']
export const PMJ = ['IJ', 'NJ', 'Pass']
export const STATUS = [
	{ label: 'Not Started', value: 'notStarted' },
	{ label: 'In Progress', value: 'inProgress' },
	{ label: 'Completed', value: 'completed' },
]

export default function FormDiagram({ handleNewObjChange, newObj, handleAdd, handleAddConnection }) {
	return (
		<div>
			<>
				<Typography variant="h4" mb={1}>
					Endpoints :
				</Typography>
				<Box
					sx={{
						display: 'flex',
						marginTop: 2,
						alignItems: 'flex-end',
						gap: 1,
						flexWrap: 'wrap',
					}}
					mb={2}
				>
					<div>
						<FormControl style={{ width: 200 }}>
							<InputLabel>Cable Type</InputLabel>
							<Select
								size="small"
								value={newObj.cableType}
								label="Cable Type"
								onChange={(e) => handleNewObjChange(e.target.value, 'cableType')}
							>
								{CABLE_TYPE.map((e) => (
									<MenuItem value={e} key={e}>
										{e}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</div>

					<div>
						<FormControl style={{ width: 200 }}>
							<Select
								size="small"
								value={newObj.namyang}
								label=""
								onChange={(e) => handleNewObjChange(e.target.value, 'namyang')}
							>
								{NAMYUNG.map((e) => (
									<MenuItem value={e} key={e}>
										{e}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</div>

					<div>
						<FormControl style={{ width: 200 }}>
							<TextField
								size="small"
								onChange={(e) => handleNewObjChange(e.target.value, 'length')}
								value={newObj.length}
								label="Length"
								type="number"
							/>
						</FormControl>
					</div>
				</Box>
				<Box
					sx={{
						display: 'flex',
						marginTop: 2,
						alignItems: 'flex-end',
						gap: 1,
						flexWrap: 'wrap',
					}}
					mb={2}
				>
					<div>
						<FormControl style={{ width: 200 }}>
							<InputLabel>Start</InputLabel>
							<Select
								size="small"
								value={newObj.start}
								label="Start"
								onChange={(e) => handleNewObjChange(e.target.value, 'start')}
							>
								{JUNCTION_BOX.map((e) => (
									<MenuItem value={e.value} key={e.value}>
										{e.label}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</div>
					<div>
						<FormControl style={{ width: 200 }}>
							<InputLabel>End</InputLabel>
							<Select
								size="small"
								value={newObj.end}
								label="End"
								onChange={(e) => handleNewObjChange(e.target.value, 'end')}
							>
								{JUNCTION_BOX.map((e) => (
									<MenuItem value={e.value} key={e.value}>
										{e.label}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</div>

					<div>
						<FormControl style={{ width: 200 }}>
							<InputLabel>Status</InputLabel>
							<Select
								size="small"
								value={newObj.status}
								label="Status"
								onChange={(e) => handleNewObjChange(e.target.value, 'status')}
							>
								{STATUS.map((e) => (
									<MenuItem value={e.value} key={e.value}>
										{e.label}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</div>
				</Box>
			</>
			<>
				<Typography variant="h4" mb={1}>
					Connection :
				</Typography>
				{newObj.connections.map((connection, index) => (
					// eslint-disable-next-line react/jsx-key
					<Box
						sx={{
							display: 'flex',
							marginTop: 2,
							alignItems: 'center',
							gap: 1,
							flexWrap: 'wrap',
						}}
						mb={2}
					>
						<div>
							<FormControl style={{ width: 200 }}>
								<InputLabel>Jb Type</InputLabel>
								<Select
									size="small"
									value={connection.joinType}
									label="Jb Type"
									onChange={(e) => handleNewObjChange(e.target.value, 'joinType', index)}
								>
									{JB_TYPE.map((e) => (
										<MenuItem value={e} key={e}>
											{e}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</div>

						<div>
							<FormControl style={{ width: 200 }}>
								<InputLabel>PMJ</InputLabel>
								<Select
									size="small"
									value={connection.pmj}
									label="PMJ"
									onChange={(e) => handleNewObjChange(e.target.value, 'pmj', index)}
								>
									{PMJ.map((e) => (
										<MenuItem value={e} key={e}>
											{e}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</div>

						<div>
							<FormControl style={{ width: 200 }}>
								<InputLabel>Seq Number</InputLabel>
								<Select size="small" value={index + 1} label="Seq Number" disabled>
									<MenuItem value={index + 1}>{index + 1}</MenuItem>
								</Select>
							</FormControl>
						</div>

						<div>
							<FormControl style={{ width: 200 }}>
								<InputLabel>Status</InputLabel>
								<Select
									size="small"
									value={connection.status}
									label="Status"
									onChange={(e) => handleNewObjChange(e.target.value, 'status', index)}
								>
									{STATUS.map((e) => (
										<MenuItem value={e.value} key={e.value}>
											{e.label}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</div>
						{index + 1 === newObj.connections.length && (
							<Iconify icon="gridicons:add-outline" width={25} height={25} onClick={handleAddConnection} />
						)}
					</Box>
				))}
				<Button variant="contained" size="small" sx={{ margin: '-5px 0 10px' }} onClick={handleAdd}>
					Apply
				</Button>
			</>
		</div>
	)
}
