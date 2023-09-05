import { Link as RouterLink, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
// @mui
import { Alert, Box, Container, IconButton, InputAdornment, Link, Snackbar, TextField, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
// hooks
// components
import { LoadingButton } from '@mui/lab'
import Iconify from 'components/Iconify'
import { useState } from 'react'
import { supabase } from 'supabaseClient'
import Page from '../components/Page'
// sections

// ----------------------------------------------------------------------

const ContentStyle = styled('div')(({ theme }) => ({
	margin: 'auto',
	minHeight: '100vh',
	width: '100%',
	maxWidth: 464,
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	flexDirection: 'column',
	padding: theme.spacing(12, 0),
	gap: '32px',
}))

// ----------------------------------------------------------------------

export default function NewPassword() {
	const navigate = useNavigate()
	const [isSubmitting, setSubmitting] = useState(false)
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [password, setPassword] = useState('')
	const [new_password, setNewPassword] = useState('')
	const [toast, setToast] = useState(null)
	const handleClose = () => {
		setToast(null)
	}
	const passwordValidation = Yup.object().shape({
		password: Yup.string().min(8, 'Password must be of minimum 8 characters').required('Password is required'),
	})
	const handleSubmit = () => {
		if (password !== new_password) {
			setToast({ severity: 'error', message: 'Both passwords should be same!' })
		} else
			passwordValidation
				.validate({ password })
				.then(({ password }) => {
					supabase.auth
						.updateUser({ password })
						.then((res) => {
							if (res.error) {
								setToast({ severity: 'error', message: res.error.message })
							} else {
								setToast({ severity: 'success', message: 'Password is updated!' })
								setTimeout(() => {
									navigate('/dashboard/profile')
								}, [3000])
							}
						})
						.catch((err) => {
							setToast({ severity: 'error', message: err.message })
						})
				})
				.catch((err) => {
					console.log(err)
					setToast({ severity: 'error', message: err.message })
				})
	}

	return (
		<Page title="New Password">
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
			<Container>
				<Box display="flex" justifyContent="center" alignItems="center">
					<ContentStyle>
						<Typography variant="h3" gutterBottom>
							New password
						</Typography>

						<Typography textAlign="center" variant="body2">
							Please enter the new password below.
						</Typography>
						<TextField
							fullWidth
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							name="password"
							label="New Password"
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
						<TextField
							fullWidth
							value={new_password}
							onChange={(e) => setNewPassword(e.target.value)}
							name="new password"
							label="Confirm Password"
							type={showConfirmPassword ? 'text' : 'password'}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
											<Iconify icon={showConfirmPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
										</IconButton>
									</InputAdornment>
								),
							}}
						/>

						<LoadingButton
							onClick={handleSubmit}
							fullWidth
							size="large"
							type="submit"
							variant="contained"
							loading={isSubmitting}
						>
							Update Password
						</LoadingButton>
						<Typography variant="body2" align="center">
							<Link
								display="flex"
								alignItems="center"
								justifyContent="center"
								underline="hover"
								variant="subtitle2"
								component={RouterLink}
								to="/dashboard/profile"
							>
								<Iconify icon="eva:chevron-left-fill" width={20} height={20} />
								Return to profile
							</Link>
						</Typography>
					</ContentStyle>
				</Box>
			</Container>
		</Page>
	)
}
