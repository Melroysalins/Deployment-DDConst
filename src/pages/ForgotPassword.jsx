import { Link as RouterLink } from 'react-router-dom'
import * as Yup from 'yup'
// @mui
import { Alert, Box, Container, Link, Snackbar, TextField, Typography } from '@mui/material'
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

export default function ForgotPassword() {
	const [isSubmitting, setSubmitting] = useState(false)
	const [email, setEmail] = useState('')
	const [toast, setToast] = useState(null)
	const handleClose = () => {
		setToast(null)
	}
	const emailValidation = Yup.object().shape({
		email: Yup.string().email('Email must be a valid email address').required('Email is required'),
	})
	const handleSubmit = () => {
		emailValidation
			.validate({ email })
			.then(({ email }) => {
				supabase.auth
					.resetPasswordForEmail(email, {
						redirectTo: 'http://localhost:3000/update-password',
					})
					.then((res) => {
						console.log(res)
						if (res.error) setToast({ severity: 'error', message: res.error.message })
						else
							setToast({
								severity: 'success',
								message: `Request sent successfully on ${email}. Please check your spam folder once!`,
							})
					})
			})
			.catch((err) => {
				console.log(err)
				setToast({ severity: 'error', message: err.message })
			})
	}

	return (
		<Page title="Forgot Password">
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
							Forgot your password?
						</Typography>

						<Typography textAlign="center" variant="body2">
							Please enter the email address associated with your account and We will email you a link to reset your
							password{' '}
						</Typography>

						<TextField
							fullWidth
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							name="email"
							label="Email address"
						/>

						<LoadingButton
							onClick={handleSubmit}
							fullWidth
							size="large"
							type="submit"
							variant="contained"
							loading={isSubmitting}
						>
							Send Request
						</LoadingButton>
						<Typography variant="body2" align="center">
							<Link
								display="flex"
								alignItems="center"
								justifyContent="center"
								underline="hover"
								variant="subtitle2"
								component={RouterLink}
								to="/login"
							>
								<Iconify icon="eva:chevron-left-fill" width={20} height={20} />
								Return to sign in
							</Link>
						</Typography>
					</ContentStyle>
				</Box>
			</Container>
		</Page>
	)
}
