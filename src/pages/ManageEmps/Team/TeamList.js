import React, { useState } from 'react'
import Table from '../Table'
import { deleteTeam, listTeamDetailsWithEmp } from 'supabase'
import { Box, Button } from '@mui/material'
import Iconify from 'components/Iconify'
import { useNavigate } from 'react-router-dom'

const headCells = [
	{
		id: 'name',
		label: 'Team title',
	},
	{
		id: 'branch',
		label: 'Company',
	},
	{
		id: 'employees',
		label: 'Employees',
	},
	{
		id: 'actions',
		label: 'Actions',
		actions: {
			view: true,
			edit: true,
			delete: true,
		},
	},
]

export default function TeamList() {
	const [rows, setrows] = useState([])
	const navigate = useNavigate()
	const [loader, setloader] = useState(false)
	const [selectedId, setselectedId] = useState(null)

	const fetchTeam = () => {
		setloader(true)
		listTeamDetailsWithEmp().then((data) => {
			const _rows = []
			data?.data?.map((e) => {
				const obj = {
					name: e.name,
					branch: e.branch?.name,
					employees: e.employees,
					id: e.id,
				}
				return _rows.push(obj)
			})
			setrows(_rows)
			setloader(false)
			setselectedId(null)
		})
	}
	React.useEffect(() => {
		fetchTeam()
	}, [])

	const handleView = (id) => {
		navigate(`/manageEmp/team/teamview/${id}`)
	}
	const handleEdit = (id) => {
		navigate(`/manageEmp/team/teamedit/${id}`)
	}
	const handleDelete = async (id) => {
		setselectedId(id)
		setloader(true)
		await deleteTeam(id)
		fetchTeam()
	}

	return (
		<>
			<Box sx={{ position: 'absolute', top: '24px', right: '40px' }}>
				<Button
					variant="outlined"
					href="/manageEmp/team/teamadd"
					startIcon={<Iconify icon={'fluent:add-16-filled'} sx={{ width: 16, height: 16, ml: 1 }} />}
					sx={{
						color: (theme) => theme.palette.text.default,
						border: '1px solid rgba(0, 0, 0, 0.1)',
						boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.04)',
						borderRadius: '8px',
					}}
				>
					Add new Team
				</Button>
			</Box>

			<Table
				headCells={headCells}
				rows={rows}
				hasActions={true}
				handleView={handleView}
				handleEdit={handleEdit}
				handleDelete={handleDelete}
				loader={loader}
				selectedId={selectedId}
			/>
		</>
	)
}
