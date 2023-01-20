// @mui
import {
	Alert,
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
import { useTheme } from '@mui/material/styles'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { FileInput } from 'components'
import { Form, Formik } from 'formik'
import moment from 'moment-timezone'
import PropTypes from 'prop-types'
import React from 'react'
import { useQuery } from 'react-query'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { listAllBranches } from 'supabase'
import { createNewProject, getProjectDetails, updateProject } from 'supabase/projects'
import * as Yup from 'yup'

import Page from '../../../components/Page'

// components
// api
// ----------------------------------------------------------------------
const validationSchema = Yup.object().shape({
	title: Yup.string().min(2, 'Too Short!').required('Required').nullable(),
	contract_code: Yup.string().min(2, 'Too Short!').required('Required').nullable(),
	contract_value: Yup.number().required('Required').nullable(),
	start: Yup.date().required('Required').nullable(),
	end: Yup.date().required('Required').nullable(),
})

const initialValues = {
	title: '',
	contract_code: '',
	contract_value: '',
	start: null,
	end: null,
}

export default function CreateNewProject({ edit }) {
	const theme = useTheme()
	const [loader, setLoader] = React.useState(false)
	const [toast, setToast] = React.useState(null)

	const { id } = useParams()
	const navigate = useNavigate()

	const { data: branches } = useQuery(['Branches'], () => listAllBranches())
	const { data: project } = useQuery(['project'], () => getProjectDetails(id), {
		enabled: !!edit,
		select: (r) => r.data,
	})

	const handleClose = () => {
		setToast(null)
	}
	return (
		<Page title={edit ? 'Edit Project' : 'Add New Project'}>
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
			{(!edit || project) && (
				<Container maxWidth="xl">
					<Formik
						initialValues={
							edit
								? {
										contracted_source: project?.contracted_source,
										service: project?.service,
										voltage: project?.voltage,
										location: project?.location,
										construction_type: project?.construction_type,
										branch: project?.branch,
										title: project?.title,
										contract_code: project?.contract_code,
										start: project?.start,
										end: project?.end,
										contract_value: project?.contract_value,
										contract_value_vat: project?.contract_value_vat,
										contract_value_vat_written: project?.contract_value_vat_written,
										adjustment_rate: project?.adjustment_rate,
										contract_value_price: project?.contract_value_price,
										contract_value_price_written: project?.contract_value_price_written,
										deposit_rate: project?.deposit_rate,
										warranty_period: project?.warranty_period,
										compensation_rate: project?.compensation_rate,
								  }
								: initialValues
						}
						validationSchema={validationSchema}
						onSubmit={async (values) => {
							setLoader(true)
							if (edit) {
								const res = await updateProject(values, id)
								if (res.status >= 200 && res.status < 300) {
									setToast({ severity: 'success', message: 'Succesfully updated project details!' })
									navigate(`?tab=2`)
								} else {
									setToast({ severity: 'error', message: 'Failed to updated project details!' })
								}
							} else {
								const res = await createNewProject(values)
								if (res.status === 201) {
									setToast({ severity: 'success', message: 'Succesfully added new project!' })
									navigate(`/dashboard/projects/edit/${res.data[0].id}?tab=2`)
								} else {
									setToast({ severity: 'error', message: 'Failed to added new project!' })
								}
							}
							setLoader(false)
						}}
					>
						{({ values, handleSubmit, errors, touched, handleChange, handleBlur, setFieldValue }) => (
							<Form onSubmit={handleSubmit}>
								<Grid container spacing={3}>
									<Grid item xs={12}>
										<Grid container spacing={3}>
											<Grid item xs={12} md={4} lg={3}>
												<FormControl fullWidth>
													<InputLabel id="demo-simple-select-helper-label">Contracted Source</InputLabel>
													<Select
														labelId="demo-simple-select-helper-label"
														id="demo-simple-select-helper"
														value={values.contracted_source}
														label="Contracted Source"
														onChange={handleChange}
														onBlur={handleBlur}
														name="contracted_source"
														fullWidth
													>
														<MenuItem value="Private Co.">Private Co.</MenuItem>
													</Select>
													<FormHelperText error={errors.contracted_source && touched.contracted_source}>
														{touched.contracted_source ? errors.contracted_source : null}
													</FormHelperText>
												</FormControl>
											</Grid>
											<Grid item xs={12} md={4} lg={3}>
												<FormControl fullWidth>
													<InputLabel id="demo-simple-select-helper-label">
														Full or Partial Service(if Private Enterprise)
													</InputLabel>
													<Select
														value={values.service}
														onChange={handleChange}
														onBlur={handleBlur}
														name="service"
														fullWidth
													>
														<MenuItem value="Private Co.">Full</MenuItem>
														<MenuItem value="Private Co.">Partial</MenuItem>
													</Select>
													<FormHelperText error={errors.service && touched.service}>
														{touched.service ? errors.service : null}
													</FormHelperText>
												</FormControl>
											</Grid>
											<Grid item xs={12} md={4} lg={3}>
												<TextField
													error={errors.voltage && touched.voltage}
													helperText={errors.voltage && touched.voltage ? errors.voltage : null}
													onChange={handleChange}
													onBlur={handleBlur}
													name="voltage"
													value={values.voltage}
													fullWidth
													id="outlined-textarea"
													label="Voltage (kV)"
													placeholder=""
												/>
											</Grid>
											<Grid item xs={12} md={4} lg={3}>
												<TextField
													error={errors.location && touched.location}
													helperText={errors.location && touched.location ? errors.location : null}
													onChange={handleChange}
													onBlur={handleBlur}
													name="location"
													value={values.location}
													fullWidth
													id="outlined-textarea"
													label="Location"
												/>
											</Grid>
											<Grid item xs={12} md={4} lg={3}>
												<FormControl fullWidth>
													<InputLabel id="demo-simple-select-helper-label">Construction Type </InputLabel>
													<Select
														value={values.construction_type}
														onChange={handleChange}
														onBlur={handleBlur}
														name="construction_type"
														fullWidth
													>
														<MenuItem value="Metal Fittings Installation">Metal Fittings Installation</MenuItem>
													</Select>
													<FormHelperText error={errors.construction_type && touched.construction_type}>
														{touched.construction_type ? errors.construction_type : null}
													</FormHelperText>
												</FormControl>
											</Grid>
											<Grid item xs={12} md={4} lg={3}>
												<FormControl fullWidth>
													<InputLabel id="demo-simple-select-helper-label">Branch and/or Supplier</InputLabel>
													<Select
														value={values.branch}
														onChange={handleChange}
														onBlur={handleBlur}
														name="branch"
														fullWidth
													>
														{branches?.data.map(({ id, name }) => (
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
											<Grid item xs={12} md={4} lg={6}>
												<TextField
													error={errors.title && touched.title}
													helperText={errors.title && touched.title ? errors.title : null}
													onChange={handleChange}
													onBlur={handleBlur}
													name="title"
													value={values.title}
													fullWidth
													id="outlined-textarea"
													label="Project Name"
												/>
											</Grid>
											<Grid item xs={12} md={4} lg={3}>
												<TextField
													error={errors.contract_code && touched.contract_code}
													helperText={errors.contract_code && touched.contract_code ? errors.contract_code : null}
													onChange={handleChange}
													onBlur={handleBlur}
													name="contract_code"
													value={values.contract_code}
													fullWidth
													id="outlined-textarea"
													label="Contract Code"
												/>
											</Grid>
											<Grid item xs={12} md={4} lg={3}>
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
														label="Start Date"
														placeholder=""
														renderInput={(params) => (
															<TextField
																{...params}
																fullWidth
																error={errors.start && touched.start}
																helperText={errors.start && touched.start ? errors.start : null}
															/>
														)}
													/>
												</LocalizationProvider>
											</Grid>
											<Grid item xs={12} md={4} lg={3}>
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
														label="Completion Date"
														placeholder=""
														renderInput={(params) => (
															<TextField
																{...params}
																error={errors.end && touched.end}
																fullWidth
																helperText={errors.end && touched.end ? errors.end : null}
															/>
														)}
													/>
												</LocalizationProvider>
											</Grid>
											<Grid item xs={12} md={4} lg={3}>
												<TextField
													error={errors.contract_value && touched.contract_value}
													helperText={errors.contract_value && touched.contract_value ? errors.contract_value : null}
													onChange={handleChange}
													onBlur={handleBlur}
													name="contract_value"
													value={values.contract_value}
													fullWidth
													id="outlined-textarea"
													label="Contract Amount (₩)"
													type="number"
												/>
											</Grid>
											<Grid item xs={12} md={4} lg={3}>
												<TextField
													readOnly
													value={values.contract_value / 10}
													fullWidth
													id="outlined-textarea"
													label="VAT Amount (10% of Contract Amount) (₩)"
													type="number"
												/>
											</Grid>
											<Grid item xs={12} md={4} lg={3}>
												<TextField
													error={errors.contract_value_vat && touched.contract_value_vat}
													helperText={
														errors.contract_value_vat && touched.contract_value_vat ? errors.contract_value_vat : null
													}
													onChange={handleChange}
													onBlur={handleBlur}
													name="contract_value_vat"
													value={values.contract_value_vat}
													fullWidth
													id="outlined-textarea"
													label="Contract Value (VAT Included) (₩)"
													type="number"
												/>
											</Grid>
											<Grid item xs={12} md={4} lg={3}>
												<TextField
													error={errors.contract_value_vat_written && touched.contract_value_vat_written}
													helperText={
														errors.contract_value_vat_written && touched.contract_value_vat_written
															? errors.contract_value_vat_written
															: null
													}
													onChange={handleChange}
													onBlur={handleBlur}
													name="contract_value_vat_written"
													value={values.contract_value_vat_written}
													fullWidth
													id="outlined-textarea"
													label="Contract Value (Written Out)"
												/>
											</Grid>
											<Grid item xs={12} md={4} lg={3}>
												<TextField
													error={errors.adjustment_rate && touched.adjustment_rate}
													helperText={errors.adjustment_rate && touched.adjustment_rate ? errors.adjustment_rate : null}
													onChange={handleChange}
													onBlur={handleBlur}
													name="adjustment_rate"
													value={values.adjustment_rate}
													fullWidth
													id="outlined-textarea"
													label="Adjustment Rate (For Contract Amount Due To Price Fluctuation) (%)"
												/>
											</Grid>
											<Grid item xs={12} md={4} lg={3}>
												<TextField
													error={errors.contract_value_price && touched.contract_value_price}
													helperText={
														errors.contract_value_price && touched.contract_value_price
															? errors.contract_value_price
															: null
													}
													onChange={handleChange}
													onBlur={handleBlur}
													name="contract_value_price"
													value={values.contract_value_price}
													fullWidth
													id="outlined-textarea"
													label="Contract Value (Price Fluctuation) (₩)"
													type="number"
												/>
											</Grid>
											<Grid item xs={12} md={4} lg={3}>
												<TextField
													error={errors.contract_value_price_written && touched.contract_value_price_written}
													helperText={
														errors.contract_value_price_written && touched.contract_value_price_written
															? errors.contract_value_price_written
															: null
													}
													onChange={handleChange}
													onBlur={handleBlur}
													name="contract_value_price_written"
													value={values.contract_value_price_written}
													fullWidth
													id="outlined-textarea"
													label="Contract Value (Price Fluctuation Written Out)"
												/>
											</Grid>
											<Grid item xs={12} md={4} lg={3}>
												<TextField
													error={errors.deposit_rate && touched.deposit_rate}
													helperText={errors.deposit_rate && touched.deposit_rate ? errors.deposit_rate : null}
													onChange={handleChange}
													onBlur={handleBlur}
													name="deposit_rate"
													value={values.deposit_rate}
													fullWidth
													id="outlined-textarea"
													label="Defect Repair Deposit Rate (%)"
													type="number"
												/>
											</Grid>
											<Grid item xs={12} md={4} lg={3}>
												<FormControl fullWidth>
													<InputLabel>Defect Warranty Period</InputLabel>
													<Select
														value={values.warranty_period}
														onChange={handleChange}
														onBlur={handleBlur}
														name="warranty_period"
														fullWidth
													>
														<MenuItem value="5 years">5 years</MenuItem>
													</Select>
													<FormHelperText error={errors.warranty_period && touched.warranty_period}>
														{touched.warranty_period ? errors.warranty_period : null}
													</FormHelperText>
												</FormControl>
											</Grid>
											<Grid item xs={12} md={4} lg={3}>
												<TextField
													error={errors.compensation_rate && touched.compensation_rate}
													helperText={
														errors.compensation_rate && touched.compensation_rate ? errors.compensation_rate : null
													}
													onChange={handleChange}
													onBlur={handleBlur}
													name="compensation_rate"
													value={values.compensation_rate}
													fullWidth
													id="outlined-textarea"
													label="Late Compensation Rate (%)"
													type="number"
												/>
											</Grid>
										</Grid>
									</Grid>

									<Grid item xs={12}>
										<Grid container spacing={3}>
											<Grid item xs={12} md={4} lg={4}>
												<FileInput height={100} name="contract_file" label="Upload Contract" />
											</Grid>
											<Grid item xs={12} md={4} lg={4}>
												<FileInput height={100} name="design_book_file" label="Upload Design Book" />
											</Grid>
											<Grid item xs={12} md={4} lg={4}>
												<FileInput height={100} name="blueprint_file" label="Upload Blueprint" />
											</Grid>
										</Grid>
									</Grid>
									<Grid item xs={12}>
										<Grid container spacing={3}>
											<Grid item xs={12}>
												<Button variant="contained" color="secondary" type="submit" disabled={loader}>
													{loader ? <CircularProgress size={17} fontSize="inherit" /> : 'Submit'}
												</Button>
											</Grid>
										</Grid>
									</Grid>
								</Grid>
							</Form>
						)}
					</Formik>
				</Container>
			)}
		</Page>
	)
}

CreateNewProject.propTypes = {
	edit: PropTypes.bool,
}
