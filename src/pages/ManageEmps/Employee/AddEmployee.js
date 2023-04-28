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
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { FileInput } from 'components'
import Iconify from 'components/Iconify'
import Page from 'components/Page'
import { certificateColors } from 'constant'
import { Form, Formik } from 'formik'
import moment from 'moment-timezone'
import React, { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { createEmployee, getEmployeeDetails, listAllBranches, listAllTeams, updateEmployee } from 'supabase'
import * as Yup from 'yup'

// components
// api
// ----------------------------------------------------------------------
const validationSchema = Yup.object().shape({
	name: Yup.string().min(2, 'Too Short!').required('Required').nullable(),
	email_address: Yup.string().email('Must be a valid email').max(255).required('Email is Required').nullable(),
	phone_number: Yup.number().min(6, 'Too Short!').min(18, 'Too long!').required('Required').nullable(),
	team: Yup.string().required('Required').nullable(),
	branch: Yup.string().required('Required').nullable(),
	rating: Yup.string().required('Required').nullable(),
})

const initialValues = {
	name: '',
	email_address: '',
	phone_number: '',
	team: '',
	branch: '',
	rating: '',
}

export default function CreateNewEmployee() {
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
	const { data: teams } = useQuery(['Teams'], () => listAllTeams())

	const { data: employee } = useQuery(['employee'], () => getEmployeeDetails(id), {
		enabled: !!edit,
		select: (r) => r.data,
	})

	const handleClose = () => {
		setToast(null)
	}

	const AvatarRating = (value) => (
		<div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
			<Avatar sx={{ width: 20, height: 20, fontSize: 12, background: certificateColors[value] }}>{value}</Avatar>{' '}
			<span style={{ color: '#596570' }}>Level of certfication</span>
		</div>
	)

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
									name: employee?.name,
									email_address: employee?.email_address,
									phone_number: employee?.phone_number,
									team: employee?.team || '',
									branch: employee?.branch || '',
									rating: employee?.rating,
							  }
							: initialValues
					}
					enableReinitialize
					validationSchema={validationSchema}
					onSubmit={async (values) => {
						setLoader(true)
						if (edit) {
							const res = await updateEmployee(values, id)
							if (res.status >= 200 && res.status < 300) {
								setToast({ severity: 'success', message: 'Succesfully updated employee details!' })
								// navigate(`/manageEmp/employee/emplist`)
							} else {
								setToast({ severity: 'error', message: 'Failed to updated employee details!' })
							}
						} else {
							const res = await createEmployee(values)
							if (res.status === 201) {
								setToast({ severity: 'success', message: 'Succesfully added new employee!' })
								navigate(`/manageEmp/employee/emplist`)
							} else {
								setToast({ severity: 'error', message: 'Failed to added new employee!' })
							}
						}
						setLoader(false)
					}}
				>
					{({ values, handleSubmit, errors, touched, handleChange, handleBlur, setFieldValue }) => (
						<Form onSubmit={handleSubmit}>
							<Grid item xs={12} style={{ background: '#fff', padding: 10, borderRadius: 5 }}>
								<Grid container spacing={3} display={'flex'} justifyContent={'center'} alignItems={'center'}>
									<Grid item xs={12} md={6} lg={6}>
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
										<span style={{ paddingLeft: 10 }}>Employee_CMS</span>
									</Grid>
									<Grid item xs={12} md={2} lg={2}>
										<FileInput height={85} name="employee_summary" label="Summary" />
									</Grid>
									<Grid item xs={12} md={2} lg={2}>
										<FileInput height={85} name="contract_file" label="Contract" />
									</Grid>
									<Grid item xs={12} md={2} lg={2}>
										<FileInput height={85} name="drug_file" label="Drug Test" />
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
													label="Full name"
													placeholder=""
													margin="normal"
												/>

												<TextField
													error={errors.email_address && touched.email_address}
													helperText={errors.email_address && touched.email_address ? errors.email_address : null}
													onChange={handleChange}
													onBlur={handleBlur}
													name="email_address"
													value={values.email_address}
													fullWidth
													id="outlined-textarea"
													label="Email Address"
													placeholder=""
													margin="normal"
												/>

												<TextField
													error={errors.phone_number && touched.phone_number}
													helperText={errors.phone_number && touched.phone_number ? errors.phone_number : null}
													onChange={handleChange}
													onBlur={handleBlur}
													name="phone_number"
													value={values.phone_number}
													fullWidth
													id="outlined-textarea"
													label="Phone number"
													placeholder=""
													margin="normal"
												/>
											</Grid>
										</Grid>
									</Box>
								</Grid>
								<Grid item xs={6}>
									<Box style={{ background: '#fff', padding: 10, borderRadius: 5 }}>
										<h4>Professional details</h4>
										<Grid container spacing={3}>
											<Grid item xs={12}>
												<FormControl fullWidth style={{ marginTop: 16 }} error={errors.rating && touched.rating}>
													<InputLabel id="demo-simple-select-label">Level of certification</InputLabel>
													<Select
														labelId="demo-simple-select-label"
														id="demo-simple-select"
														value={values.rating}
														label="Level of certification"
														onChange={handleChange}
														onBlur={handleBlur}
														name="rating"
													>
														{Object.keys(certificateColors)?.map((name) => (
															<MenuItem key={name} value={name}>
																{AvatarRating(name)}
															</MenuItem>
														))}
													</Select>
													<FormHelperText error={errors.rating && touched.rating}>
														{touched.rating ? errors.rating : null}
													</FormHelperText>
												</FormControl>

												<FormControl fullWidth style={{ marginTop: 16 }} error={errors.branch && touched.branch}>
													<InputLabel id="demo-simple-select-label">Branch and/or Supplier</InputLabel>
													<Select
														labelId="demo-simple-select-label"
														id="demo-simple-select"
														value={values.branch}
														label="Branch and/or Supplier"
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

												<FormControl fullWidth style={{ marginTop: 16 }} error={errors.team && touched.team}>
													<InputLabel id="demo-simple-select-label">Team involved in</InputLabel>
													<Select
														labelId="demo-simple-select-label"
														id="demo-simple-select"
														value={values.team}
														label="Team involved in"
														onChange={handleChange}
														onBlur={handleBlur}
														name="team"
													>
														{teams?.data?.map(({ id, name }) => (
															<MenuItem key={id} value={id}>
																{name}
															</MenuItem>
														))}
													</Select>
													<FormHelperText error={errors.team && touched.team}>
														{touched.team ? errors.team : null}
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
											style={{ float: 'right' }}
										>
											<Iconify icon="ic:round-save-alt" width={15} height={15} style={{ marginRight: 5 }} />
											{loader ? <CircularProgress size={17} fontSize="inherit" /> : edit ? 'Update' : 'Save'}
										</Button>
									</Grid>
								</Grid>
							</Grid>
						</Form>
					)}
				</Formik>
			</Container>
		</Page>
	)
}
