/* eslint-disable no-unused-vars */
import {
	Box,
	Button,
	FormHelperText,
	MenuItem,
	Paper,
	Radio,
	Stack,
	TextField,
	Select,
	FormControl,
	InputLabel,
	CircularProgress,
	Avatar,
} from '@mui/material'
import Iconify from 'components/Iconify'
import React, { useState } from 'react'
import ConfirmationDialog from '../ConfirmationDialog'
import { listAllEmployees, listAllProjects } from 'supabase'
import { useQuery } from 'react-query'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import moment from 'moment'
import { useParams } from 'react-router-dom'
import { createApproval, createApprovers } from 'supabase/approval'
import PropTypes from 'prop-types'
import { approvalStatus } from 'constant'
import DragList from './DragList'

const validationSchema = Yup.object().shape({
	project: Yup.string().required('Required').nullable(),
	status: Yup.string().required('Required').nullable(),
	from_page: Yup.string().required('Required').nullable(),
	start: Yup.date().required('Required').nullable(),
	end: Yup.date().required('Required').nullable(),
	deadline: Yup.date().required('Required').nullable(),
})

Approval.propTypes = {
	setopen: PropTypes.func,
}

function Approval({ setopen }) {
	const { id: projectId } = useParams()
	const [addedEmp, setaddedEmp] = React.useState([])
	const [currentApprover, setcurrentApprover] = useState(null)
	const [loader, setLoader] = React.useState(false)
	const [addApprover, setaddApprover] = useState(false)
	const [openDialog, setopenDialog] = React.useState(false)
	const { data: projects } = useQuery(['Projects'], () => listAllProjects(), {
		select: (r) => r.data,
	})
	const { data: employees } = useQuery(['Employees'], () => listAllEmployees(), {
		select: (r) => r.data.filter((e) => e.user),
	})

	const handleClickOpen = () => {
		setopenDialog(true)
	}

	const handleClose = (value) => {
		setopenDialog(false)
		setopen(false)
	}

	const handleEmployeeAdd = () => {
		setaddedEmp([...addedEmp, JSON.parse(currentApprover)])
		setaddApprover(!addApprover)
		setcurrentApprover(null)
	}
	const handleEmployeeRemove = (id) => {
		setaddedEmp(addedEmp.filter((e) => e.id !== id))
	}

	function filterEmployeesNotAdded() {
		const filteredEmployees = employees?.filter((employee) => !addedEmp.some((emp) => emp.id === employee.id))
		return filteredEmployees
	}

	return (
		<>
			<Formik
				initialValues={{
					project: projectId,
					start: null,
					end: null,
					deadline: null,
					status: 'Planned',
					from_page: 'weekly_plan',
				}}
				validationSchema={validationSchema}
				onSubmit={async (values) => {
					setLoader(true)
					try {
						const res = await createApproval(values)
						if (res.status === 201) {
							const promises = addedEmp.map((obj, index) =>
								createApprovers({
									approval: res.data[0].id,
									employee: obj.id,
									user: obj.user,
									order: index + 1,
									status: 'Planned',
								})
							)
							Promise.all(promises).then(() => {
								setopenDialog(false)
								setopen(false)
								setLoader(false)
							})
						}
					} catch (err) {
						setLoader(false)
						console.error(err)
					}
				}}
			>
				{({ values, handleSubmit, errors, touched, handleChange, handleBlur, setFieldValue }) => (
					<Form onSubmit={handleSubmit}>
						<Box>
							<div style={{ fontSize: '0.85rem', marginBottom: 5 }}>Project Name</div>
							<FormControl fullWidth>
								<InputLabel id="demo-simple-select-helper-label">Project Name</InputLabel>
								<Select
									label="Project Name"
									sx={{ mb: 1, mt: 0 }}
									name="project"
									size="small"
									value={values.project}
									onChange={handleChange}
									onBlur={handleBlur}
									fullWidth
								>
									{projects?.map((e) => (
										<MenuItem key={e.id} value={e.id}>
											{e.title}
										</MenuItem>
									))}
								</Select>
								<FormHelperText error={errors.project && touched.project}>
									{touched.project ? errors.project : null}
								</FormHelperText>
							</FormControl>

							<div style={{ fontSize: '0.85rem', marginBottom: 5 }}>Page/Stage</div>
							<FormControl fullWidth>
								<InputLabel id="demo-simple-select-helper-label">Page/Stage</InputLabel>
								<Select
									label="Page/Stage"
									sx={{ mb: 1, mt: 0 }}
									name="page"
									size="small"
									value={values.from_page}
									onChange={handleChange}
									onBlur={handleBlur}
									fullWidth
								>
									{approvalStatus.map((e) => (
										<MenuItem key={e.id} value={e.id}>
											{e.name}
										</MenuItem>
									))}
								</Select>
								<FormHelperText error={errors.from_page && touched.from_page}>
									{touched.from_page ? errors.from_page : null}
								</FormHelperText>
							</FormControl>

							<div style={{ fontSize: '0.85rem', marginBottom: 3 }}>TimeFrame</div>
							<Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
								<Box sx={{ width: '45%' }}>
									<LocalizationProvider dateAdapter={AdapterMoment}>
										<DatePicker
											inputFormat="YYYY-MM-DD"
											onChange={(newValue) => {
												const date = moment(newValue).format('YYYY-MM-DD')
												setFieldValue('start', date)
											}}
											onBlur={handleBlur}
											value={values.start}
											name="start"
											fullWidth
											id="outlined-textarea"
											label="Start"
											placeholder=""
											renderInput={(params) => (
												<TextField
													size="small"
													{...params}
													fullWidth
													error={errors.start && touched.start}
													helperText={errors.start && touched.start ? errors.start : null}
												/>
											)}
										/>
									</LocalizationProvider>
								</Box>
								<Box>-</Box>
								<Box sx={{ width: '45%' }}>
									<LocalizationProvider dateAdapter={AdapterMoment}>
										<DatePicker
											inputFormat="YYYY-MM-DD"
											onChange={(newValue) => {
												const date = moment(newValue).format('YYYY-MM-DD')
												setFieldValue('end', date)
											}}
											onBlur={handleBlur}
											value={values.end}
											name="end"
											fullWidth
											id="outlined-textarea"
											label="End"
											placeholder=""
											renderInput={(params) => (
												<TextField
													size="small"
													{...params}
													error={errors.end && touched.end}
													fullWidth
													helperText={errors.end && touched.end ? errors.end : null}
												/>
											)}
										/>
									</LocalizationProvider>
								</Box>
							</Box>

							<div style={{ fontSize: '0.85rem', marginBottom: 3, marginTop: 8 }}>Deadline</div>
							<LocalizationProvider dateAdapter={AdapterMoment}>
								<DatePicker
									inputFormat="YYYY-MM-DD"
									onChange={(newValue) => {
										const date = moment(newValue).format('YYYY-MM-DD')
										setFieldValue('deadline', date)
									}}
									onBlur={handleBlur}
									value={values.deadline}
									name="deadline"
									fullWidth
									id="outlined-textarea"
									label="Deadline"
									placeholder=""
									renderInput={(params) => (
										<TextField
											size="small"
											{...params}
											error={errors.deadline && touched.deadline}
											fullWidth
											helperText={errors.deadline && touched.deadline ? errors.deadline : null}
										/>
									)}
								/>
							</LocalizationProvider>

							<div style={{ fontSize: '0.85rem', marginBottom: 3, paddingTop: 7 }}>Comment</div>
							<TextField name="comment" value={''} fullWidth label="Text here" multiline />
						</Box>

						<DragList addedEmp={addedEmp} setaddedEmp={setaddedEmp} handleEmployeeRemove={handleEmployeeRemove} />

						{/* <Box mb={3} mt={3}>
							{addedEmp.map((e) => (
								// eslint-disable-next-line react/jsx-key
								<Stack direction="row" justifyContent={'space-between'} alignItems={'center'} mt={2} key={e.id}>
									<Stack direction={'row'} gap={2} alignItems={'center'}>
										<img src={'/static/icons/Drag.svg'} alt={'drag'} />
										<Avatar alt="avatar image" sx={{ width: 46, height: 46 }}>
											{e.name ? e.name[0] : e.email_address[0]}
										</Avatar>
										<Box>
											<h5>{e.name || e.email_address}</h5>
											<div style={{ fontSize: '0.75rem', color: '#596570' }}>{e.rating}</div>
										</Box>
									</Stack>

									<Iconify icon="ic:round-close" width={14} height={14} onClick={() => handleEmployeeRemove(e.id)} />
								</Stack>
							))}
						</Box> */}

						<Paper elevation={12} sx={{ border: '1px solid transparent', borderRadius: 1, padding: '5px 7px' }}>
							{addApprover ? (
								<>
									<h5 style={{ marginBottom: 5 }}>Add approver</h5>
									<div style={{ fontSize: '0.85rem', marginBottom: 3 }}>Approver</div>
									<FormControl fullWidth>
										<InputLabel id="demo-simple-select-helper-label">Approver</InputLabel>
										<Select
											label="Approver"
											sx={{ mb: 1, mt: 0 }}
											name="approver"
											size="small"
											value={currentApprover}
											onChange={(e) => setcurrentApprover(e.target.value)}
										>
											{filterEmployeesNotAdded()?.map((e) => (
												<MenuItem
													key={e.id}
													value={JSON.stringify({
														id: e.id,
														name: e.name,
														rating: e.rating,
														email_address: e.email_address,
														user: e.user,
													})}
												>
													{e.name || e.email_address}
												</MenuItem>
											))}
										</Select>
									</FormControl>

									<div style={{ fontSize: '0.85rem', marginBottom: 3 }}>Occupation</div>
									<FormControl fullWidth>
										<InputLabel id="demo-simple-select-helper-label">Occupation</InputLabel>
										<Select
											label="Occupation"
											sx={{ mb: 1, mt: 0 }}
											name="occupation"
											size="small"
											value={values.occupation}
											onChange={handleChange}
											onBlur={handleBlur}
										>
											<MenuItem value="Private Co.">Private Co.</MenuItem>
										</Select>
										<FormHelperText error={errors.occupation && touched.occupation}>
											{touched.occupation ? errors.occupation : null}
										</FormHelperText>
									</FormControl>

									<Stack direction={'row'} justifyContent={'space-between'} mt={1}>
										<Stack
											direction={'row'}
											gap={1}
											alignItems={'center'}
											color={'#FF6B00'}
											sx={{ cursor: 'pointer' }}
											onClick={() => setaddApprover(!addApprover)}
										>
											<Iconify icon="ic:round-close" width={16} height={16} />
											Cancel
										</Stack>
										<Stack
											direction={'row'}
											gap={1}
											alignItems={'center'}
											color={currentApprover ? '#8CCC67' : 'gray'}
											sx={{ cursor: currentApprover ? 'pointer' : 'auto' }}
											onClick={() => currentApprover && handleEmployeeAdd()}
										>
											<Iconify icon="charm:tick" width={16} height={16} />
											Add
										</Stack>
									</Stack>
								</>
							) : (
								<>
									<Stack
										direction={'row'}
										justifyContent={'space-between'}
										sx={{ cursor: 'pointer' }}
										mt={1}
										onClick={() => setaddApprover(true)}
									>
										<h5 style={{ marginBottom: 5 }}>Add approver</h5>
										<Iconify icon="material-symbols:add" width={16} height={16} />
									</Stack>
								</>
							)}
						</Paper>
						{!addApprover && (
							<>
								<Stack direction={'row'} gap={1} justifyContent={'space-between'} sx={{ cursor: 'pointer' }} mt={1}>
									<Paper elevation={12} sx={{ border: '1px solid transparent', borderRadius: 1, padding: '5px 7px' }}>
										<Radio size="small" style={{ padding: '0 3px' }} />
										<span style={{ fontSize: '0.8rem' }}>Include all approvals</span>
									</Paper>
									<Paper elevation={12} sx={{ border: '1px solid transparent', borderRadius: 1, padding: '5px 7px' }}>
										<Radio size="small" style={{ padding: '0 3px' }} />
										<span style={{ fontSize: '0.8rem' }}>Continue rejector</span>
									</Paper>
								</Stack>

								<Button
									fullWidth
									variant="contained"
									sx={{ marginTop: 2 }}
									// onClick={handleClickOpen}
									type="submit"
									disabled={loader || !addedEmp.length}
								>
									{loader ? <CircularProgress size={17} fontSize="inherit" /> : 'Request approval'}
								</Button>
							</>
						)}

						<ConfirmationDialog handleClose={handleClose} open={openDialog} />
					</Form>
				)}
			</Formik>
		</>
	)
}

export default Approval
