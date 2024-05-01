/* eslint-disable react/prop-types */
import { InputLabel, Box, FormControl, MenuItem, Select, Button, Typography, TextField } from '@mui/material'
import React from 'react'

export const NAMYUNG = ['XLPE', 'OF', 'Other']
export const CABLE_TYPE = ['154kV', '345kV', '746kV']
export const PMJ = ['XLPE', 'OF', 'Other']
export const JUNCTION_BOX = [
	{ label: 'T/R', value: 'recTri' },
	{ label: 'S/S', value: 'square' },
]

export default function FormDiagram({ handleNewObjChange, newObj, seqNumber, handleAdd }) {
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
				</Box>
			</>
			<>
				<Typography variant="h4" mb={1}>
					Connection :
				</Typography>
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
								value={newObj.joinType}
								label="Jb Type"
								onChange={(e) => handleNewObjChange(e.target.value, 'joinType')}
							>
								<MenuItem value={'J/B'}>J/B</MenuItem>
								<MenuItem value={'M/H'}>M/H</MenuItem>
							</Select>
						</FormControl>
					</div>

					<div>
						<FormControl style={{ width: 200 }}>
							<InputLabel>PMJ</InputLabel>
							<Select
								size="small"
								value={newObj.pmj}
								label="PMJ"
								// onChange={(e) => handleNewObjChange(e.target.value, 'joinType')}
							>
								<MenuItem value={'IJ'}>IJ</MenuItem>
								<MenuItem value={'NJ'}>NJ</MenuItem>
								<MenuItem value={'Pass'}>Pass</MenuItem>
							</Select>
						</FormControl>
					</div>

					<div>
						<FormControl style={{ width: 200 }}>
							<InputLabel>Seq Number</InputLabel>
							<Select size="small" value={seqNumber} label="Seq Number" disabled>
								<MenuItem value={seqNumber}>{seqNumber}</MenuItem>
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
								<MenuItem value={'notStarted'}>Not Started</MenuItem>
								<MenuItem value={'inProgress'}>In Progress</MenuItem>
								<MenuItem value={'completed'}>Completed</MenuItem>
							</Select>
						</FormControl>
					</div>

					<div>
						<FormControl style={{ width: 200 }}>
							<InputLabel>Nodes</InputLabel>
							<Select
								size="small"
								value={newObj.nodes}
								label="Nodes"
								onChange={(e) => handleNewObjChange(e.target.value, 'nodes')}
							>
								<MenuItem value={2}>2</MenuItem>
								<MenuItem value={3}>3</MenuItem>
								<MenuItem value={4}>4</MenuItem>
								<MenuItem value={5}>5</MenuItem>
							</Select>
						</FormControl>
					</div>
					<Button variant="contained" size="small" sx={{ marginLeft: 3 }} onClick={handleAdd}>
						Apply
					</Button>
				</Box>
			</>
		</div>
	)
}
