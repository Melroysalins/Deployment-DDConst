/* eslint-disable react/prop-types */
// @mui
import {
	Alert,
	Backdrop,
	Box,
	CircularProgress,
	FormControl,
	FormControlLabel,
	FormHelperText,
	Grid,
	InputLabel,
	MenuItem,
	Radio,
	RadioGroup,
	Select,
	Snackbar,
	TextField,
} from '@mui/material'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { useFormik } from 'formik'
import moment from 'moment-timezone'
import React, { forwardRef, useImperativeHandle } from 'react'
import { createNewTasks, updateTask } from 'supabase'
import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
	title: Yup.string().min(2, 'Too Short!').required('Required').nullable(),
	notes: Yup.string().nullable(),
	start: Yup.date().required('Required').nullable(),
	end: Yup.date().required('Required').nullable(),
	isTask: Yup.boolean(),
	task_id: Yup.string().when('isTask', {
		is: false,
		then: Yup.string().required('Required').nullable(),
		otherwise: Yup.string().nullable(),
	}),
	approval_status: Yup.string().required('Required').nullable(),
})

const initialValues = {
	title: '',
	notes: '',
	task_id: null,
	start: null,
	end: null,
	isTask: true,
	approval_status: null,
}
const AddProjectTaskForm = forwardRef((props, ref) => {
	const { data = {}, handleClose, handleSetEvent, myEvents } = props
	const [loader, setLoader] = React.useState(false)
	const [toast, setToast] = React.useState(null)

	const { handleSubmit, errors, touched, handleChange, handleBlur, values, setFieldValue, setValues } = useFormik({
		initialValues,
		validationSchema,
		onSubmit: async (values) => {
			setLoader(true)
			try {
				let res
				// eslint-disable-next-line no-unused-vars
				const { id, isTask, ...rest } = values
				if (data.id) {
					res = await updateTask(rest, id)
					if (res.status >= 200 && res.status < 300) {
						setToast({ severity: 'success', message: 'Succesfully edited event!' })
						handleSetEvent()
						handleClose()
					} else {
						setToast({ severity: 'error', message: 'Failed to edit event!' })
					}
				} else {
					res = await createNewTasks(rest)
					if (res.status >= 200 && res.status < 300) {
						setToast({ severity: 'success', message: 'Succesfully added new event!' })
						handleSetEvent()
						handleClose()
					} else {
						setToast({ severity: 'error', message: 'Failed to added new event!' })
					}
				}
			} catch (err) {
				console.log(err)
			}
			setLoader(false)
		},
	})

	useImperativeHandle(ref, () => ({
		onSubmit() {
			handleSubmit()
		},
	}))

	const handleCloseToast = () => {
		setToast(null)
	}

	React.useEffect(() => {
		if (data) setValues({ ...values, ...data, isTask: !data.task_id })
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data])

	return (
		<>
			<Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loader}>
				<CircularProgress color="inherit" />
			</Backdrop>
			<Snackbar
				open={toast}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
				autoHideDuration={5000}
				onClose={handleCloseToast}
			>
				<Alert onClose={handleCloseToast} severity={toast?.severity} sx={{ width: '100%' }}>
					{toast?.message}
				</Alert>
			</Snackbar>
			<Box onSubmit={handleSubmit} component="form" noValidate autoComplete="off" p={3}>
				<Grid container spacing={1}>
					<Grid item xs={12}>
						<TextField
							fullWidth
							label="Title"
							size="small"
							value={values.title}
							name="title"
							onChange={handleChange}
							onBlur={handleBlur}
						/>
						<FormHelperText error={errors.title && touched.title}>{touched.title ? errors.title : null}</FormHelperText>
					</Grid>
					{/* On Edit case not allow to chnage subTask to Task Or TASK to sub */}
					{!data.id && (
						<Grid item xs={12}>
							<RadioGroup
								row
								name="isTask"
								onChange={() => setFieldValue('isTask', !values.isTask)}
								onBlur={handleBlur}
								value={values.isTask}
							>
								<FormControlLabel value={true} control={<Radio size="small" />} label="Task" />
								<FormControlLabel value={false} control={<Radio size="small" />} label="Sub Task" />
							</RadioGroup>
						</Grid>
					)}

					{!values.isTask && (
						<Grid item xs={12}>
							<FormControl fullWidth>
								<InputLabel shrink id="demo-simple-select-helper-label">
									Select Task
								</InputLabel>
								<Select
									size="small"
									labelId="demo-simple-select-helper-label"
									id="demo-simple-select-helper"
									value={values.task_id}
									label="Select Task"
									onChange={handleChange}
									onBlur={handleBlur}
									name="task_id"
									fullWidth
								>
									{myEvents
										.filter((e) => e.task_id === null && e.task_group_id === values.task_group_id)
										.map((e) => (
											<MenuItem key={e.id} value={e.id}>
												{e.title}
											</MenuItem>
										))}
								</Select>
								<FormHelperText error={errors.task_id && touched.task_id}>
									{touched.task_id ? errors.task_id : null}
								</FormHelperText>
							</FormControl>
						</Grid>
					)}

					<Grid item xs={12}>
						<FormControl fullWidth>
							<InputLabel shrink id="demo-simple-select-helper-label">
								Approval Status
							</InputLabel>
							<Select
								size="small"
								labelId="demo-simple-select-helper-label"
								id="demo-simple-select-helper"
								value={values.approval_status}
								label="Approval Type"
								onChange={handleChange}
								onBlur={handleBlur}
								name="approval_status"
								fullWidth
							>
								<MenuItem value="Planned">Planned</MenuItem>
								<MenuItem value="Approved">Approved</MenuItem>
								<MenuItem value="Rejected">Rejected</MenuItem>
							</Select>
							<FormHelperText error={errors.approval_status && touched.approval_status}>
								{touched.approval_status ? errors.approval_status : null}
							</FormHelperText>
						</FormControl>
					</Grid>

					<Grid item xs={12}>
						<TextField
							value={values.notes}
							fullWidth
							label="Notes"
							size="small"
							name="notes"
							onChange={handleChange}
							onBlur={handleBlur}
						/>
						<FormHelperText error={errors.notes && touched.notes}>{touched.notes ? errors.notes : null}</FormHelperText>
					</Grid>
					<Grid item xs={6}>
						<LocalizationProvider dateAdapter={AdapterMoment}>
							<DatePicker
								inputFormat="YYYY-MM-DD"
								onChange={(newValue) => {
									const start = moment(newValue).format('YYYY-MM-DD')
									setFieldValue('start', start)
								}}
								onBlur={handleBlur}
								value={values.start}
								name="start"
								fullWidth
								id="outlined-textarea"
								label="start"
								placeholder=""
								renderInput={(params) => (
									<TextField
										{...params}
										fullWidth
										error={errors.start && touched.start}
										helperText={touched.start ? errors.start : null}
									/>
								)}
							/>
						</LocalizationProvider>
					</Grid>
					<Grid item xs={6}>
						<LocalizationProvider dateAdapter={AdapterMoment}>
							<DatePicker
								inputFormat="YYYY-MM-DD"
								onChange={(newValue) => {
									const end = moment(newValue).format('YYYY-MM-DD')
									setFieldValue('end', end)
								}}
								onBlur={handleBlur}
								value={values.end}
								name="end"
								fullWidth
								id="outlined-textarea"
								label="end"
								placeholder=""
								renderInput={(params) => (
									<TextField
										{...params}
										fullWidth
										error={errors.end && touched.end}
										helperText={touched.end ? errors.end : null}
									/>
								)}
							/>
						</LocalizationProvider>
					</Grid>
				</Grid>
			</Box>
		</>
	)
})

export default AddProjectTaskForm
