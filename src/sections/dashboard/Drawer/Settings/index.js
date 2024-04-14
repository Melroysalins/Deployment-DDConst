import { Button, Checkbox, CircularProgress, FormControlLabel, Stack, Typography } from '@mui/material'
import Iconify from 'components/Iconify'
import { Form, Formik } from 'formik'
import useMain from 'pages/context/context'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { updateEmployee } from 'supabase'

const defaultValues = {
	branch: false,
	code: false,
	value: false,
	expected_profit: false,
	expected_margin: false,
	timeline: false,
	spent_time_progress: false,
	spent_money_progress: false,
	completed_tasks_progress: false,
}

const cardAppearances = [
	'branch',
	'code',
	'value',
	'expected_profit',
	'expected_margin',
	'timeline',
	'spent_time_progress',
	'spent_money_progress',
	'completed_tasks_progress',
]

function Settings() {
	const { t } = useTranslation()
	const { currentEmployee, refetchCurrentEmployee } = useMain()
	const [loader, setLoader] = useState(false)

	return (
		<>
			<Typography sx={{ fontSize: 14, fontWeight: 600 }} mb={'10px'}>
				{t('project_card_appearance')}:
			</Typography>

			<Formik
				initialValues={
					Object.keys(currentEmployee?.settings_appearance).length ? currentEmployee.settings_appearance : defaultValues
				}
				onSubmit={async (values) => {
					try {
						setLoader(true)
						await updateEmployee({ settings_appearance: values }, currentEmployee?.id)
						refetchCurrentEmployee()
					} catch (err) {
						console.error(err)
					} finally {
						setLoader(false)
					}
				}}
			>
				{({ values, handleSubmit, handleChange, setValues }) => (
					<Form onSubmit={handleSubmit}>
						{cardAppearances.map((appearance) => (
							<FormControlLabel
								key={appearance}
								label={t(appearance)}
								sx={{ width: '100%', '.MuiTypography-root': { fontSize: 14 } }}
								control={
									<Checkbox
										name={appearance}
										checked={values[appearance]}
										onChange={handleChange}
										color="success"
										inputProps={{ 'aria-label': 'controlled' }}
									/>
								}
							/>
						))}

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
								type="submit"
								disabled={loader}
							>
								{t('save')}
							</Button>
						</Stack>
					</Form>
				)}
			</Formik>
		</>
	)
}

export default Settings
