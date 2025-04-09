/* eslint-disable no-unused-vars */
import {
	Box,
	Button,
	CircularProgress,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	TextField,
	Typography,
} from '@mui/material'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import Iconify from 'components/Iconify'
import { Form, Formik } from 'formik'
import moment from 'moment'
import useMain from 'pages/context/context'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { listAllProjects } from 'supabase'
import { createView, listAllViewsByEmp, updateView } from 'supabase/view'
import { countTruthyLengths } from 'utils/helper'
import AiFilterGeneration from './AiFilterGeneration'
import SaveFilterDialog from './SaveFilterDialog'

const defaultValues = {
	id: '',
	projects: null,
	organizations: [],
	started_from: null,
	completed_till: null,
	value_from_million: null,
	completed_till_million: null,
	completed_more_percent: '',
	completed_less_percent: '',
}

// eslint-disable-next-line react/prop-types
function Filters({ setopen, onAiFilterResponseData }) {
	const { t } = useTranslation()
	const { currentEmployee, setmainFilters, mainFilters } = useMain()
	const [loader, setLoader] = useState(false)
	const [filterName, setfilterName] = React.useState('')
	const [openSaveDialog, setopenSaveDialog] = React.useState(false)
	const { data: projects } = useQuery(['Projects'], () => listAllProjects(), {
		select: (r) => r.data,
	})

	const { data: views } = useQuery(['EmpViews'], () => listAllViewsByEmp(currentEmployee.id), {
		select: (r) => r.data,
		enabled: !!currentEmployee?.id,
	})

	const handleOrganizations = (id, setFieldValue, organizations) => {
		const index = organizations?.indexOf(id)
		if (index > -1) {
			organizations.splice(index, 1)
			setFieldValue('organizations', organizations)
		} else {
			setFieldValue('organizations', [...organizations, id])
		}
	}

	const handleSaveDialogOpen = () => {
		setopenSaveDialog(true)
	}
	const handleSaveDialogClose = () => {
		setopenSaveDialog(false)
	}

	return (
		<>
		<Box>
					<AiFilterGeneration onAiFilterResponseData={onAiFilterResponseData} showFilterData={true} />
				</Box>
			<Formik
				initialValues={mainFilters || defaultValues}
				onSubmit={async (values) => {
					// empty array save remove filters
					if (!countTruthyLengths(Object.values(values)).length) {
						handleSaveDialogClose()
						setopen(false)
						return setmainFilters(null)
					}
					const { id, ...rest } = values
					const obj = {
						filter: rest,
						page_name: 'main',
						employee: currentEmployee?.id,
						name: filterName || views.find((detail) => detail.id === id).name,
					}
					try {
						let data = null
						setLoader(true)
						if (id) {
							data = await updateView(obj, id)
						} else {
							data = await createView(obj)
						}
						// eslint-disable-next-line no-unused-expressions
						data?.data && setmainFilters({ ...data.data?.filter, id: data.data.id })
					} catch (err) {
						console.error(err)
					} finally {
						setLoader(false)
						handleSaveDialogClose()
						setopen(false)
					}
				}}
			>
				{({ values, handleSubmit, handleChange, handleBlur, setFieldValue, setValues }) => (
					<>
						<Form onSubmit={handleSubmit}>
							<Box>
								<div style={{ fontSize: '0.8rem', marginBottom: 5 }}>{t('load_saved_view')}</div>
								<FormControl fullWidth>
									<InputLabel id="demo-simple-select-helper-label">{t('choose_view')}</InputLabel>
									<Select
										label={t('choose_view')}
										sx={{ mb: 1, mt: 0 }}
										name="id"
										size="small"
										value={values?.id}
										onChange={(e) => {
											setValues(views.find((detail) => detail.id === e.target.value).filter)
											setFieldValue('id', e.target.value)
										}}
										onBlur={handleBlur}
										fullWidth
									>
										{views?.map((e) => (
											<MenuItem key={e.id} value={e.id}>
												{e.name}
											</MenuItem>
										))}
									</Select>
								</FormControl>

								<Typography sx={{ fontSize: 13, margin: '8px 0', fontWeight: 600 }}>{t('view_filters')}:</Typography>

								<div style={{ fontSize: '0.8rem', marginBottom: 5, marginTop: 5 }}>{t('projects')}</div>
								<Box sx={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
									{['completed_projects', 'active_projects', 'planning_projects'].map((e) => (
										<Button
											sx={{
												fontSize: '11px',
												color: 'black',
												fontWeight: 600,
												background: 'white',
												borderColor: '#e0e0e0',
												borderRadius: '4px',
												...(values.projects === e && {
													color: 'white',
													background: '#8D99FF',
													borderColor: 'transparent',
												}),
											}}
											onClick={() => setFieldValue('projects', e)}
											key={e}
											variant="outlined"
											size="small"
										>
											{t(e)}
										</Button>
									))}{' '}
								</Box>

								<div style={{ fontSize: '0.8rem', marginBottom: 5, marginTop: 7 }}>{t('organizations')}</div>
								<Box sx={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
									{projects?.map((e) => (
										<Button
											sx={{
												fontSize: '11px',
												color: 'black',
												fontWeight: 600,
												background: 'white',
												borderColor: '#e0e0e0',
												borderRadius: '4px',
												...(values.organizations?.includes(e.id) && {
													color: 'white',
													background: '#8D99FF',
													borderColor: 'transparent',
												}),
											}}
											onClick={() => handleOrganizations(e.id, setFieldValue, values.organizations)}
											key={e.id}
											variant="outlined"
											size="small"
										>
											{e.title}
										</Button>
									))}{' '}
								</Box>

								<Box
									sx={{
										display: 'flex',
										width: '100%',
										justifyContent: 'space-between',
										alignItems: 'center',
										margin: '15px 0 5px',
									}}
								>
									<Box sx={{ width: '48%' }}>
										<div style={{ fontSize: '0.8rem', marginBottom: 5 }}>{t('started_from')}</div>
										<LocalizationProvider dateAdapter={AdapterMoment}>
											<DatePicker
												inputFormat="YYYY-MM-DD"
												onChange={(newValue) => {
													const date = !newValue ? null : moment(newValue).format('YYYY-MM-DD')
													setFieldValue('started_from', date)
												}}
												onBlur={handleBlur}
												value={values.started_from}
												name="started_from"
												fullWidth
												id="outlined-textarea"
												label={t('started_from')}
												placeholder=""
												renderInput={(params) => <TextField size="small" {...params} fullWidth />}
											/>
										</LocalizationProvider>
									</Box>
									<Box sx={{ width: '48%' }}>
										<div style={{ fontSize: '0.8rem', marginBottom: 5 }}>{t('completed_till')}</div>
										<LocalizationProvider dateAdapter={AdapterMoment}>
											<DatePicker
												inputFormat="YYYY-MM-DD"
												onChange={(newValue) => {
													const date = !newValue ? null : moment(newValue).format('YYYY-MM-DD')
													setFieldValue('completed_till', date)
												}}
												onBlur={handleBlur}
												value={values.completed_till}
												name="completed_till"
												fullWidth
												id="outlined-textarea"
												label={t('completed_till')}
												placeholder=""
												renderInput={(params) => <TextField size="small" {...params} fullWidth />}
											/>
										</LocalizationProvider>
									</Box>
								</Box>

								<Box
									sx={{
										display: 'flex',
										width: '100%',
										justifyContent: 'space-between',
										alignItems: 'center',
										margin: '15px 0 5px',
									}}
								>
									<Box sx={{ width: '48%' }}>
										<div style={{ fontSize: '0.8rem', marginBottom: 5 }}>{t('value_from_million')}</div>
										<LocalizationProvider dateAdapter={AdapterMoment}>
											<DatePicker
												inputFormat="YYYY-MM-DD"
												onChange={(newValue) => {
													const date = !newValue ? null : moment(newValue).format('YYYY-MM-DD')
													setFieldValue('value_from_million', date)
												}}
												onBlur={handleBlur}
												value={values.value_from_million}
												name="value_from_million"
												fullWidth
												id="outlined-textarea"
												label={t('value_from_million')}
												placeholder=""
												renderInput={(params) => <TextField size="small" {...params} fullWidth />}
											/>
										</LocalizationProvider>
									</Box>
									<Box sx={{ width: '48%' }}>
										<div style={{ fontSize: '0.8rem', marginBottom: 5 }}>{t('completed_till_million')}</div>
										<LocalizationProvider dateAdapter={AdapterMoment}>
											<DatePicker
												inputFormat="YYYY-MM-DD"
												onChange={(newValue) => {
													const date = !newValue ? null : moment(newValue).format('YYYY-MM-DD')
													setFieldValue('completed_till_million', date)
												}}
												onBlur={handleBlur}
												value={values.completed_till_million}
												name="completed_till_million"
												fullWidth
												id="outlined-textarea"
												label={t('completed_till_million')}
												placeholder=""
												renderInput={(params) => <TextField size="small" {...params} fullWidth />}
											/>
										</LocalizationProvider>
									</Box>
								</Box>

								<Box
									sx={{
										display: 'flex',
										width: '100%',
										justifyContent: 'space-between',
										alignItems: 'center',
										margin: '15px 0 5px',
									}}
								>
									<Box sx={{ width: '48%' }}>
										<div style={{ fontSize: '0.8rem', marginBottom: 5 }}>{t('completed_more_percent')}</div>
										<TextField
											name="completed_more_percent"
											value={values.completed_more_percent}
											onChange={handleChange}
											onBlur={handleBlur}
											fullWidth
											label={t('completed_more_percent')}
											size="small"
										/>
									</Box>
									<Box sx={{ width: '48%' }}>
										<div style={{ fontSize: '0.8rem', marginBottom: 5 }}>{t('completed_less_percent')}</div>
										<TextField
											name="completed_less_percent"
											value={values.completed_less_percent}
											onChange={handleChange}
											onBlur={handleBlur}
											fullWidth
											label={t('completed_less_percent')}
											size="small"
										/>
									</Box>
								</Box>
							</Box>

							<Stack direction={'row'} justifyContent={'space-between'} mt={2} gap={1}>
								<Button
									variant="text"
									size="medium"
									color="inherit"
									sx={{ color: '#596570', flex: 1 }}
									startIcon={<Iconify icon="carbon:close" width={18} height={18} />}
									onClick={() => setValues(defaultValues)}
								>
									{t('clear')}
								</Button>

								<Button
									variant="text"
									size="medium"
									color="inherit"
									sx={{
										color: '#8D99FF',
										flex: 1,
										':disabled': {
											color: '#8CCC67',
										},
									}}
									startIcon={
										loader ? (
											<CircularProgress size={17} sx={{ color: '#8D99FF' }} />
										) : (
											<Iconify icon="charm:tick" width={17} height={17} />
										)
									}
									// type="submit"
									onClick={() =>
										values.id || !countTruthyLengths(Object.values(values)).length
											? handleSubmit()
											: handleSaveDialogOpen()
									}
									disabled={loader}
								>
									{values.id ? t('update_view') : t('save_view')}
								</Button>
							</Stack>
						</Form>
						<SaveFilterDialog
							handleClose={handleSaveDialogClose}
							open={openSaveDialog}
							loader={loader}
							filterName={filterName}
							setfilterName={setfilterName}
						/>
					</>
				)}
			</Formik>
			
			
		</>
	)
}

export default Filters
