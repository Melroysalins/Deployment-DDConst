/* eslint-disable no-unused-vars */
import {
	Box,
	Button,
	FormHelperText,
	MenuItem,
	Paper,
	Stack,
	TextField,
	Select,
	FormControl,
	InputLabel,
	CircularProgress,
	Chip,
} from '@mui/material'
import Iconify from 'components/Iconify'
import React, { useState } from 'react'
import ConfirmationDialog from '../ConfirmationDialog'
import { createComment, listAllEmployees, listAllProjects } from 'supabase'
import { useQuery } from 'react-query'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import moment from 'moment'
import { useParams } from 'react-router-dom'
import { createApproval, createApprovers, getApprovalsByProject } from 'supabase/approval'
import PropTypes from 'prop-types'
import { ApprovalStatus, approvalStatus } from 'constant'
import DragList from './DragList'
import useMain from 'pages/context/context'
import { useTranslation } from 'react-i18next'
import { colorApprovalTask } from 'pages/WeeklyPlan/WeeklyPlan'

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
	isLeftMenu: PropTypes.bool,
}

const findDatesInApproval = (approvals, newStart, newEnd) => {
	const _approvals = approvals?.filter((data) => {
		let { start, end } = data
		start = new Date(start)
		end = new Date(end)
		newStart = new Date(newStart)
		newEnd = new Date(newEnd)

		newStart = new Date(newStart.getFullYear(), newStart.getMonth(), newStart.getDate())
		newEnd = new Date(newEnd.getFullYear(), newEnd.getMonth(), newEnd.getDate())
		start = new Date(start.getFullYear(), start.getMonth(), start.getDate())
		end = new Date(end.getFullYear(), end.getMonth(), end.getDate())
		return newStart <= end && newEnd >= start && data.status !== ApprovalStatus.Planned
	})
	return _approvals?.[_approvals.length - 1] || null
}

function Approval({ setopen, isLeftMenu }) {
	const { t } = useTranslation()
	const {
		currentEmployee,
		setallowTaskCursor,
		commentTasks,
		handleCommentTask,
		allowTaskCursor,
		setopenRequestApproval,
		setrefetchtaskProjects,
	} = useMain()
	const { id: projectId } = useParams()
	const [addedEmp, setaddedEmp] = React.useState([])
	const [matchingApproval, setmatchingApproval] = React.useState(null)
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

	const { data: approvals } = useQuery(
		['ApprovalsByProject', projectId],
		({ queryKey }) => getApprovalsByProject(queryKey[1]),
		{
			select: (r) => r.data,
		}
	)
	const handleClose = () => {
		setopenDialog(false)
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
					status: ApprovalStatus.Planned,
					from_page: 'weekly_plan',
					comment: '',
				}}
				validationSchema={validationSchema}
				onSubmit={async (values) => {
					const { confirm, comment, ...rest } = values
					try {
						const findApproravls = !confirm && findDatesInApproval(approvals, values.start, values.end)
						if (findApproravls) {
							setmatchingApproval(findApproravls)
							setopenDialog(true)
							return
						}
						setopenDialog(false)
						setLoader(true)
						const res = await createApproval({ ...rest, owner: currentEmployee?.id })
						if (res.status === 201) {
							const promises = addedEmp.map((obj, index) =>
								createApprovers({
									approval: res.data[0].id,
									employee: obj.id,
									order: index + 1,
									status: ApprovalStatus.Planned,
								})
							)
							if (!commentTasks.length && comment) {
								await createComment({
									body: comment,
									employee: currentEmployee.id,
									approval: res.data[0].id,
								})
							}
							const promises2 = commentTasks?.map((obj) => {
								createComment({
									body: comment,
									project_task: obj.id,
									employee: currentEmployee.id,
									approval: res.data[0].id,
								})

								return null
							})
							try {
								await Promise.all(promises)
								await Promise.all(promises2)

								setopenDialog(false)
								if (isLeftMenu) {
									setrefetchtaskProjects(true)
									setopenRequestApproval(false)
								} else {
									setopen(false)
								}

								setLoader(false)
							} catch (error) {
								console.error(error)
							}
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
							<div style={{ fontSize: '0.85rem', marginBottom: 5 }}>{t('project_name')}</div>
							<FormControl fullWidth>
								<InputLabel id="demo-simple-select-helper-label">{t('project_name')}</InputLabel>
								<Select
									label={t('project_name')}
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

							<div style={{ fontSize: '0.85rem', marginBottom: 5 }}>{t('page_stage')}</div>
							<FormControl fullWidth>
								<InputLabel id="demo-simple-select-helper-label">{t('page_stage')}</InputLabel>
								<Select
									label={t('page_stage')}
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

							<div style={{ fontSize: '0.85rem', marginBottom: 5 }}>{t('timeframe')}</div>
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
											label={t('start')}
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
											label={t('end')}
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

							<div style={{ fontSize: '0.85rem', marginBottom: 5, marginTop: 8 }}>{t('deadline')}</div>
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
									label={t('deadline')}
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

							<Box sx={{ background: '#F9F9FA', padding: '0 7px 5px', marginTop: '8px', borderRadius: '5px' }}>
								<div style={{ fontSize: '0.9rem', marginBottom: 10, paddingTop: 7, fontWeight: 500 }}>
									{t('comment_optional')}

									{isLeftMenu && (
										<>
											{!allowTaskCursor && (
												<Chip
													size="small"
													variant="outlined"
													label={t('global')}
													color="info"
													sx={{
														borderRadius: '6px',
														height: 20,
														fontSize: '0.78rem',
														marginLeft: '4px',
														'.MuiChip-label': { padding: '0 4px' },
													}}
												/>
											)}
											<Button
												sx={{
													background: !allowTaskCursor ? '#FF6B00' : 'white',
													padding: '4px 0',
													float: 'right',
													minWidth: 20,
													borderRadius: '5px',
													boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)',
												}}
												onClick={() => setallowTaskCursor(!allowTaskCursor)}
											>
												<Iconify
													icon="ph:cursor-click-light"
													sx={{ color: !allowTaskCursor ? 'white' : 'black' }}
													width={12}
													height={12}
												/>
											</Button>
										</>
									)}
									<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
										{commentTasks.map((t) => (
											<Box
												key={t.id}
												sx={{
													background: colorApprovalTask[t.status],
													padding: '0 5px',
													borderRadius: '7px',
													textTransform: 'uppercase',
													display: 'flex',
													alignItems: 'center',
													color: 'white',
													fontSize: '0.8rem',
												}}
											>
												{t.title}
												<Iconify
													icon="basil:cross-outline"
													sx={{ cursor: 'pointer', marginLeft: '3px' }}
													width={22}
													height={22}
													onClick={() => handleCommentTask(t.id)}
												/>
											</Box>
										))}
									</Box>
								</div>
								<TextField
									name="comment"
									value={values.comment}
									onChange={handleChange}
									onBlur={handleBlur}
									fullWidth
									label={t('text_here')}
									multiline
								/>
								<FormHelperText error={errors.comment && touched.comment}>
									{touched.comment ? errors.comment : null}
								</FormHelperText>
							</Box>
						</Box>

						<DragList addedEmp={addedEmp} setaddedEmp={setaddedEmp} handleEmployeeRemove={handleEmployeeRemove} />

						<Paper elevation={12} sx={{ border: '1px solid transparent', borderRadius: 1, padding: '5px 7px' }}>
							{addApprover ? (
								<>
									<h5 style={{ marginBottom: 5 }}>{t('add_approver')}</h5>
									<div style={{ fontSize: '0.85rem', marginBottom: 5 }}>{t('approver')}</div>
									<FormControl fullWidth>
										<InputLabel id="demo-simple-select-helper-label">{t('approver')}</InputLabel>
										<Select
											label={t('approver')}
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

									<div style={{ fontSize: '0.85rem', marginBottom: 5 }}>{t('occupation')}</div>
									<FormControl fullWidth>
										<InputLabel id="demo-simple-select-helper-label">{t('occupation')}</InputLabel>
										<Select
											label={t('occupation')}
											sx={{ mb: 1, mt: 0 }}
											name="occupation"
											size="small"
											value={values.occupation}
											onChange={handleChange}
											onBlur={handleBlur}
										>
											{/* <MenuItem value="Private Co.">Private Co.</MenuItem> */}
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
											{t('cancel')}
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
											{t('add')}
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
										<h5 style={{ marginBottom: 5 }}>{t('add_approver')}</h5>
										<Iconify icon="material-symbols:add" width={16} height={16} />
									</Stack>
								</>
							)}
						</Paper>
						{!addApprover && (
							<>
								{/* <Stack direction={'row'} gap={1} justifyContent={'space-between'} sx={{ cursor: 'pointer' }} mt={1}>
									<Paper elevation={12} sx={{ border: '1px solid transparent', borderRadius: 1, padding: '5px 7px' }}>
										<Radio size="small" style={{ padding: '0 3px' }} />
										<span style={{ fontSize: '0.8rem' }}>{t('include_approvals')}</span>
									</Paper>
									<Paper elevation={12} sx={{ border: '1px solid transparent', borderRadius: 1, padding: '5px 7px' }}>
										<Radio size="small" style={{ padding: '0 3px' }} />
										<span style={{ fontSize: '0.8rem' }}>{t('continue_rejector')}</span>
									</Paper>
								</Stack> */}

								<Button
									fullWidth
									variant="contained"
									sx={{ marginTop: 2 }}
									type="submit"
									disabled={loader || !addedEmp.length || (allowTaskCursor && !commentTasks.length)}
								>
									{loader ? <CircularProgress size={17} fontSize="inherit" /> : t('request_Approval')}
								</Button>
							</>
						)}

						{openDialog && (
							<ConfirmationDialog
								handleClose={handleClose}
								open={openDialog}
								handleSubmit={handleSubmit}
								matchingApproval={matchingApproval}
								setFieldValue={setFieldValue}
							/>
						)}
					</Form>
				)}
			</Formik>
		</>
	)
}

export default Approval
