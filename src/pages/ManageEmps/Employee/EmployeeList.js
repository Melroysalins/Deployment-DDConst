import { Box, Button } from '@mui/material'
import Iconify from 'components/Iconify'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteEmployee, listEmployeesWithDetail } from 'supabase'
import Table from '../Table'

export default function EmployeeList({ isTeamEmployees }) {
	let headCells = [
		{
			id: 'name',
			label: 'Full name',
		},
		{
			id: 'team',
			label: 'Team',
		},
		{
			id: 'rating',
			label: 'Certificate',
		},
		{
			id: 'phone_number',
			label: 'Phone Number',
		},
		{
			id: 'email_address',
			label: 'Email Address',
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
	if (isTeamEmployees) {
		headCells = headCells.slice(0, headCells.length - 1)
	}
	const [rows, setrows] = useState([])
	const [teamEmp, setteamEmp] = useState([])
	const navigate = useNavigate()
	const [loader, setloader] = useState(false)
	const [selectedId, setselectedId] = useState(null)

	const filterTeamEmployees = () => {
		if (isTeamEmployees) {
			const _filter = rows?.filter((e) => isTeamEmployees.includes(e.id))
			setteamEmp(_filter)
		}
	}
	useEffect(() => {
		filterTeamEmployees()
	}, [isTeamEmployees, rows])

	const fetchEmployees = () => {
		setloader(true)
		listEmployeesWithDetail().then((data) => {
			const _rows = []
			data?.data?.map((e) => {
				const obj = {
					name: e.name,
					team: e.team?.name,
					rating: e.rating,
					phone_number: e.phone_number,
					email_address: e.email_address,
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
		fetchEmployees()
	}, [])

	const handleView = (id) => {
		navigate(`/manageEmp/employee/${id}/view`)
	}
	const handleEdit = (id) => {
		navigate(`/manageEmp/employee/${id}/edit`)
	}
	const handleDelete = async (id) => {
		setselectedId(id)
		setloader(true)
		await deleteEmployee(id)
		fetchEmployees()
	}

	return (
		<>
			<Box sx={{ position: 'absolute', top: '24px', right: '40px' }}>
				<Button
					variant="outlined"
					href="/manageEmp/employee/add"
					startIcon={<Iconify icon={'fluent:add-16-filled'} sx={{ width: 16, height: 16, ml: 1 }} />}
					sx={{
						color: (theme) => theme.palette.text.default,
						border: '1px solid rgba(0, 0, 0, 0.1)',
						boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.04)',
						borderRadius: '8px',
					}}
				>
					Add new employee
				</Button>
			</Box>

			<Table
				headCells={headCells}
				rows={isTeamEmployees ? teamEmp : rows}
				hasActions={true}
				handleView={handleView}
				handleEdit={handleEdit}
				handleDelete={handleDelete}
				loader={loader}
				selectedId={selectedId}
				type={'employee'}
				hideActions={isTeamEmployees}
			/>
		</>
	)
}
