import Typography from '@mui/material/Typography'
import React, { memo, useState } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'

function createData(name, calories, fat, carbs1, carbs2, carbs3, protein) {
	return { name, calories, fat, carbs1, carbs2, carbs3, protein }
}

const rows = [
	createData('Froz ', 159, 6.0, 24, 4.0, 1, 1),
	createData('Ice', 237, 9.0, 37, 4.3, 1, 1),
	createData('Eclair', 262, 16.0, 24, 6.0, 1, 1),
	createData('Cupcake', 305, 3.7, 67, 4.3, 1, 1),
	createData('Ginger', 356, 16.0, 49, 3.9, 1, 1),
	createData('', '-', 3.7, 67, '-', 1, 1),
]

function ProgressRate() {
	const [isCollapsed, setisCollapsed] = useState(false)
	return (
		<>
			{/* Project Progress Rates */}
			<Box sx={{ borderRadius: !isCollapsed ? '6px 6px 3px' : '6px', border: '1px solid rgba(145, 158, 171, 0.24)' }}>
				<Paper
					sx={{
						padding: 1,
						borderRadius: !isCollapsed ? '6px 6px 0 0' : '6px',
						borderBottom: '1px solid rgba(241, 243, 244, 1)',
					}}
				>
					<Stack width={'100%'} direction="row" justifyContent={'space-between'}>
						<Typography color={'#DA4C57'} variant="body1" fontWeight={600}>
							Process/Funds
						</Typography>

						<Box
							sx={{ width: 24, height: 24, transform: isCollapsed ? ' rotate(180deg)' : 'inherit' }}
							onClick={() => setisCollapsed(!isCollapsed)}
						>
							<img src={'/static/icons/Sort-ascending.svg'} alt={'sort img'} />
						</Box>
					</Stack>
				</Paper>
				{!isCollapsed && (
					<TableContainer component={Paper}>
						<Table sx={{ minWidth: 200 }} size="small">
							<TableHead>
								<TableRow>
									<TableCell>Dessert </TableCell>
									<TableCell>Calories</TableCell>
									<TableCell>Fat</TableCell>
									<TableCell>Col1</TableCell>
									<TableCell>Col2</TableCell>
									<TableCell>Col3</TableCell>
									<TableCell>Protein</TableCell>
								</TableRow>
							</TableHead>
							<TableBody sx={{ background: '#F9FAFB' }}>
								{rows.map((row) => (
									<TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
										<TableCell sx={{ color: '#596570' }}>{row.name}</TableCell>
										<TableCell sx={{ color: '#596570' }}>{row.calories}</TableCell>
										<TableCell sx={{ color: '#596570' }}>{row.fat}</TableCell>
										<TableCell sx={{ color: '#596570' }}>{row.carbs1}</TableCell>
										<TableCell sx={{ color: '#596570' }}>{row.carbs2}</TableCell>
										<TableCell sx={{ color: '#596570' }}>{row.carbs3}</TableCell>
										<TableCell sx={{ color: '#596570' }}>{row.protein}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				)}
			</Box>
		</>
	)
}

export default memo(ProgressRate)
