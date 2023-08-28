// @mui
import { Box, Stack } from '@mui/material'
import { Outlet, useLocation } from 'react-router-dom'
// components
import { StoreProvider, useStore } from 'pages/Dashboard/store/Store'
import BreadCrumb from '../Dashboard/BreadCrumb'

// ----------------------------------------------------------------------

export default function MangeEmpLayout() {
	const location = useLocation()
	const paths = location.pathname.split('/').filter((path) => path)
	let selected = paths[paths.length - 1]
	switch (selected) {
		case 'emplist':
			selected = 'employeesList'
			break
		case 'add':
			selected = 'addNewEmployee'
			break
		case 'teamlist':
			selected = 'teamList'
			break
		case 'teamadd':
			selected = 'addNewTeam'
			break
		default:
			selected = 'viewEmployee'
			break
	}

	return (
		<StoreProvider>
			<Stack justifyContent="space-between">
				<Box pl={3} pr={3} mb={4} component="div">
					<EmpHeader />
				</Box>

				<Outlet isprop={true} />
			</Stack>
		</StoreProvider>
	)
}

function EmpHeader({ selected }) {
	const { actionFunction } = useStore()
	return (
		<>
			<BreadCrumb selected={selected} typeName={'manageEmp'} />
			{typeof actionFunction === 'function' && actionFunction()}
		</>
	)
}
