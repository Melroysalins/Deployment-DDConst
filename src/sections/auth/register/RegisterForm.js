import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
// form
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
// @mui
import { LoadingButton } from '@mui/lab'
import { IconButton, InputAdornment, Stack } from '@mui/material'
// components
import useAlert from 'hooks/useAlert'
import { useTranslation } from 'react-i18next'
import { createProfile } from 'supabase/profiles'
import Iconify from '../../../components/Iconify'
import { FormProvider, RHFTextField } from '../../../components/hook-form'
import { supabase } from '../../../supabaseClient'

// ----------------------------------------------------------------------

export default function RegisterForm() {
	const navigate = useNavigate()
	const { ShowAlert, setmessage } = useAlert()
	const [showPassword, setShowPassword] = useState(false)
	const { t } = useTranslation(['register'])

	const RegisterSchema = Yup.object().shape({
		firstName: Yup.string().required('First name required'),
		lastName: Yup.string().required('Last name required'),
		company: Yup.string().required('commpany is required'),
		jobTitle: Yup.string().required('job title is required'),
		email: Yup.string().email('Email must be a valid email address').required('Email is required'),
		password: Yup.string().required('Password is required'),
	})

	const defaultValues = {
		firstName: '',
		lastName: '',
		company: '',
		jobTitle: '',
		email: '',
		password: '',
	}

	const methods = useForm({
		resolver: yupResolver(RegisterSchema),
		defaultValues,
	})

	const {
		handleSubmit,
		formState: { isSubmitting },
	} = methods

	const onSubmit = async (e) => {
    console.log('form submission values',e)
		try {
			const { data, error } = await supabase.auth.signUp(e)

			if (error) throw error
			else if (data.session && data.user) {
				const res = await createProfile({
					id: data.user.id,
					email: data.user.email,
					compant: e.company,
					job_title: e.jobTitle,
				})
        console.log('profile response',res)
				// navigate('/dashboard/projects/list', { replace: true })
			}
		} catch (error) {
			setmessage(error.error_description || error.message)
		}
	}

	return (
		<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
			<Stack spacing={3}>
				<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
					<RHFTextField name="firstName" label={t('first_name')} />
					<RHFTextField name="lastName" label={t('last_name')} />
				</Stack>

				<RHFTextField name="company" label={t('company')} />
				<RHFTextField name="jobTitle" label={t('job_title')} />
				<RHFTextField name="email" label={t('email_address')} />

				<RHFTextField
					name="password"
					label={t('password')}
					type={showPassword ? 'text' : 'password'}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
									<Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
								</IconButton>
							</InputAdornment>
						),
					}}
				/>

				<ShowAlert />

				<LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
					{t('register')}
				</LoadingButton>
			</Stack>
		</FormProvider>
	)
}
