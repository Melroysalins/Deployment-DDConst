/* eslint-disable no-nested-ternary */
// @mui
import {
	Alert,
	Avatar,
	Badge,
	Box,
	Button,
	Container,
	FormControl,
	FormHelperText,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	Snackbar,
	TextField,
} from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import { FileInput } from 'components'
import Iconify from 'components/Iconify'
import Page from 'components/Page'
import { Form, Formik } from 'formik'
import React, { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import {
	createTeamWithEmp,
	getTeamDetailsWithEmp,
	listAllBranches,
	listAllEmployees,
	updateTeamWithEmp,
} from 'supabase'
import * as Yup from 'yup'
import EmployeeList from '../Employee/EmployeeList'

// components
// api
// ----------------------------------------------------------------------
const validationSchema = Yup.object().shape({
	name: Yup.string().min(2, 'Too Short!').required('Required').nullable(),
	branch: Yup.string().required('Required').nullable(),
	employees: Yup.array().min(1).required('Required'),
	team_lead: Yup.string().required('Required').nullable(),
})

const initialValues = {
	name: '',
	branch: '',
	team_lead: '',
	employees: [],
}

export default function AddTeam() {
	const [loader, setLoader] = React.useState(false)
	const [toast, setToast] = React.useState(null)
	const { id } = useParams()
	const [edit, setedit] = useState(false)

	useEffect(() => {
		if (id) {
			setedit(true)
		}
	}, [id])

	const navigate = useNavigate()

	const { data: branches } = useQuery(['Branches'], () => listAllBranches())

	const { data: employees } = useQuery(['employee'], () => listAllEmployees())
	const { data: team } = useQuery(['team'], () => getTeamDetailsWithEmp(id), {
		enabled: !!edit,
		select: (r) => r.data,
	})

	const handleClose = () => {
		setToast(null)
	}

	return (
		<Page title={edit ? 'Edit Employee' : 'Add New Employee'}>
			<Snackbar
				open={toast}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
				autoHideDuration={5000}
				onClose={handleClose}
			>
				<Alert onClose={handleClose} severity={toast?.severity} sx={{ width: '100%' }}>
					{toast?.message}
				</Alert>
			</Snackbar>

			<Container maxWidth="xl">
				<Formik
					initialValues={
						edit
							? {
									name: team?.name,
									team_lead: team?.team_lead,
									branch: team?.branch?.id || '',
									employees: team?.employees || [],
							  }
							: initialValues
					}
					enableReinitialize
					validationSchema={validationSchema}
					onSubmit={async (values) => {
						console.log(values, '<--values')
						setLoader(true)
						if (edit) {
							const res = await updateTeamWithEmp(values, id)
							if (res.status >= 200 && res.status < 300) {
								setToast({ severity: 'success', message: 'Succesfully updated Team details!' })
								// navigate(`/manageEmp/team/teamlist`)
							} else {
								setToast({ severity: 'error', message: 'Failed to updated Team details!' })
							}
						} else {
							const res = await createTeamWithEmp(values)
							if (res.status === 201) {
								setToast({ severity: 'success', message: 'Succesfully added new Team!' })
								navigate(`/manageEmp/team/teamlist`)
							} else {
								setToast({ severity: 'error', message: 'Failed to added new Team!' })
							}
						}
						setLoader(false)
					}}
				>
					{({ values, handleSubmit, errors, touched, handleChange, handleBlur, setFieldValue }) => (
						<>
							<Form onSubmit={handleSubmit}>
								<Grid item xs={12} style={{ background: '#fff', padding: 10, borderRadius: 5 }}>
									<Grid container spacing={3} display={'flex'} justifyContent={'center'} alignItems={'center'}>
										<Grid item xs={12} md={8} lg={8}>
											<Badge
												overlap="circular"
												anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
												badgeContent={
													<Iconify icon="mdi:pencil-circle" style={{ color: '#ff6b00' }} width={23} height={23} />
												}
											>
												<Avatar alt="avatar image" sx={{ width: 60, height: 60 }}>
													<Iconify icon="icon-park-solid:avatar" width={40} height={40} />
												</Avatar>
											</Badge>
											<span style={{ paddingLeft: 10 }}>Team Title</span>
										</Grid>
										<Grid item xs={12} md={2} lg={2}>
											<FileInput height={85} name="team_summary" label=" Summary" />
										</Grid>
										<Grid item xs={12} md={2} lg={2}>
											<FileInput height={85} name="contract_file" label="Contract" />
										</Grid>
									</Grid>
								</Grid>

								<Grid container spacing={2} marginTop={1} style={{ height: '100%' }}>
									<Grid item xs={6}>
										<Box style={{ background: '#fff', padding: 10, borderRadius: 5 }}>
											<h4>Basic settings</h4>
											<Grid container spacing={3}>
												<Grid item xs={12}>
													<TextField
														error={errors.name && touched.name}
														helperText={errors.name && touched.name ? errors.name : null}
														onChange={handleChange}
														onBlur={handleBlur}
														name="name"
														value={values.name}
														fullWidth
														id="outlined-textarea"
														label="Team name"
														placeholder=""
														margin="normal"
													/>

													<FormControl fullWidth style={{ marginTop: 16 }} error={errors.branch && touched.branch}>
														<InputLabel id="demo-simple-select-label">Comapny involved</InputLabel>
														<Select
															labelId="demo-simple-select-label"
															id="demo-simple-select"
															value={values.branch}
															label="Comapny involved"
															onChange={handleChange}
															onBlur={handleBlur}
															name="branch"
														>
															{branches?.data?.map(({ id, name }) => (
																<MenuItem key={id} value={id}>
																	{name}
																</MenuItem>
															))}
														</Select>
														<FormHelperText error={errors.branch && touched.branch}>
															{touched.branch ? errors.branch : null}
														</FormHelperText>
													</FormControl>
												</Grid>
											</Grid>
										</Box>
									</Grid>
									<Grid item xs={6}>
										<Box style={{ background: '#fff', padding: 10, borderRadius: 5 }}>
											<h4>Add employees</h4>
											<Grid container spacing={3}>
												<Grid item xs={12}>
													<FormControl
														fullWidth
														style={{ marginTop: 16 }}
														error={errors.employees && touched.employees}
													>
														<InputLabel id="demo-simple-select-label">Add Employees</InputLabel>
														<Select
															labelId="demo-simple-select-label"
															id="demo-simple-select"
															value={values.employees}
															label="Add Employees"
															onChange={(e) => {
																setFieldValue('employees', e.target.value)
																if (values.team_lead && !e.target.value.includes(values.team_lead)) {
																	setFieldValue('team_lead', '')
																}
															}}
															onBlur={handleBlur}
															name="employees"
															multiple
														>
															{employees?.data?.map(({ id, name }) => (
																<MenuItem key={id} value={id}>
																	{name}
																</MenuItem>
															))}
														</Select>
														<FormHelperText error={errors.employees && touched.employees}>
															{touched.employees ? errors.employees : null}
														</FormHelperText>
													</FormControl>

													<FormControl
														fullWidth
														style={{ marginTop: 16 }}
														error={errors.team_lead && touched.team_lead}
													>
														<InputLabel id="demo-simple-select-label">Team lead</InputLabel>
														<Select
															labelId="demo-simple-select-label"
															id="demo-simple-select"
															value={values.team_lead}
															label="Team lead"
															onChange={handleChange}
															onBlur={handleBlur}
															name="team_lead"
														>
															{employees?.data
																?.filter((e) => values.employees?.includes(e.id))
																?.map(({ id, name }) => (
																	<MenuItem key={id} value={id}>
																		{name}
																	</MenuItem>
																))}
														</Select>
														<FormHelperText error={errors.team_lead && touched.team_lead}>
															{touched.team_lead ? errors.team_lead : null}
														</FormHelperText>
													</FormControl>
												</Grid>
											</Grid>
										</Box>
									</Grid>
								</Grid>

								<Grid item xs={12} marginTop={1}>
									<Grid container spacing={3}>
										<Grid item xs={12}>
											<Button
												variant="contained"
												color="secondary"
												type="submit"
												disabled={loader}
												style={{ float: 'right', marginBottom: 20 }}
											>
												<Iconify icon="ic:round-save-alt" width={15} height={15} style={{ marginRight: 5 }} />
												{loader ? <CircularProgress size={17} fontSize="inherit" /> : edit ? 'Update' : 'Save'}
											</Button>
										</Grid>
									</Grid>
								</Grid>
							</Form>

							{values.employees?.length > 0 && <EmployeeList isTeamEmployees={values.employees} />}
						</>
					)}
				</Formik>
			</Container>
		</Page>
	)
}
