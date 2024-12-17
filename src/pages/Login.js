import { Link as RouterLink } from 'react-router-dom'
// @mui
import { Box, Card, Container, Link, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
// hooks
import useResponsive from '../hooks/useResponsive'
// components
import Page from '../components/Page'
import { useTranslation } from 'react-i18next'
// sections
import { LoginForm } from '../sections/auth/login'

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
	[theme.breakpoints.up('md')]: {
		display: 'flex',
	},
}))

const HeaderStyle = styled('header')(({ theme }) => ({
	top: 0,
	zIndex: 9,
	lineHeight: 0,
	width: '100%',
	display: 'flex',
	background: 'transparent',
	alignItems: 'center',
	position: 'absolute',
	padding: theme.spacing(3),
	justifyContent: 'space-between',
	[theme.breakpoints.down('sm')]: {
		justifyContent: 'center',
	  },
	[theme.breakpoints.up('md')]: {
		alignItems: 'flex-start',
		padding: theme.spacing(7, 5, 0, 7),
	},
}))

const SectionStyle = styled(Card)(({ theme }) => ({
	width: '100%',
	maxWidth: 464,
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
	margin: theme.spacing(2, 0, 2, 2),
}))

const ContentStyle = styled('div')(({ theme }) => ({
	maxWidth: 480,
	margin: 'auto',
	minHeight: '100vh',
	display: 'flex',
	justifyContent: 'center',
	flexDirection: 'column',
	padding: theme.spacing(12, 0),
}))

// ----------------------------------------------------------------------

export default function Login() {
	const smUp = useResponsive('up', 'sm')

	const mdUp = useResponsive('up', 'md')

	const { t } = useTranslation(['login'])

	return (
		<Page title="Login">
			<RootStyle>
				<HeaderStyle>
					<Box sx={{ width: 60, height: 60 }}>
						{!smUp && <img src={`/static/logos/gwalli_purple_with_slogan.png`} alt="gwalli slogan" />}
					</Box>

					{smUp && (
						<Typography variant="body2" sx={{ mt: { md: -2 } }}>
							{t('dont_have_account')} {''}
							<Link variant="subtitle2" component={RouterLink} to="/register">
							{t('get_started')}
							</Link>
						</Typography>
					)}
				</HeaderStyle>

				{mdUp && (
					<SectionStyle>
											<Box sx={{ width: 200, height: 300 }}>
												<img src={`/static/logos/gwalli_purple_with_slogan.png`} alt="gwalli slogan" />
											</Box>
										</SectionStyle>
					// <SectionStyle>
					// 	<Box sx={{ width: 60, height: 60 }}>
					// 		<img src={`/static/logos/gwalli_purple_with_slogan.png`} alt="gwalli slogan" />
					// 	</Box>
					// 	<Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
					// 		{t('greetings')}
					// 	</Typography>
					// 	<img src="/static/illustrations/illustration_login.png" alt="login" />
					// </SectionStyle>
				)}

				<Container maxWidth="sm">
					<ContentStyle>
						<Typography variant="h4" gutterBottom>
							{t('title')}
						</Typography>

						<Typography sx={{ color: 'text.secondary', mb: 5 }}>{t('description')}</Typography>

						{/* <AuthSocial /> */}

						<LoginForm />

						<Typography variant="body2" align="center" sx={{ mt: 3 }}>
							{t('dont_have_account')}{' '}
							<Link variant="subtitle2" component={RouterLink} to="/register">
								{t('get_started')}
							</Link>
						</Typography>
					</ContentStyle>
				</Container>
			</RootStyle>
		</Page>
	)
}
