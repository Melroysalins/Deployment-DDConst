import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'

import * as Yup from 'yup'
// form
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
// @mui
import { LoadingButton } from '@mui/lab'
import { IconButton, InputAdornment, Link, Stack } from '@mui/material'
// components
import useAlert from 'hooks/useAlert'
import Iconify from '../../../components/Iconify'
import { FormProvider, RHFCheckbox, RHFTextField } from '../../../components/hook-form'
import { supabase } from '../../../supabaseClient'
// ----------------------------------------------------------------------

export default function LoginForm() {
	const navigate = useNavigate()

	const [showPassword, setShowPassword] = useState(false)
	const { ShowAlert, setmessage } = useAlert()

	const LoginSchema = Yup.object().shape({
		email: Yup.string().email('Email must be a valid email address').required('Email is required'),
		password: Yup.string().required('Password is required'),
	})

	const defaultValues = {
		email: '',
		password: '',
		remember: true,
	}

	const methods = useForm({
		resolver: yupResolver(LoginSchema),
		defaultValues,
	})

	const {
		handleSubmit,
		formState: { isSubmitting },
	} = methods

	const onSubmit = async (e) => {
		try {
			const { data, error } = await supabase.auth.signInWithPassword(e)
			if (error) throw error
			else if (data.session && data.user) navigate('/dashboard/projects/list', { replace: true })
		} catch (error) {
			setmessage(error.error_description || error.message)
		}
	}

	return (
		<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
			<Stack spacing={3}>
				<RHFTextField name="email" label="Email address" />

				<RHFTextField
					name="password"
					label="Password"
					type={showPassword ? 'text' : 'password'}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
									<Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
								</IconButton>
							</InputAdornment>
						),
					}}
				/>
			</Stack>

			<ShowAlert />

			<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
				<RHFCheckbox name="remember" label="Remember me" />
				<Link component={RouterLink} to="/forgot-password" variant="subtitle2" underline="hover">
					Forgot password?
				</Link>
			</Stack>

			<LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
				Login
			</LoadingButton>
		</FormProvider>
	)
}
