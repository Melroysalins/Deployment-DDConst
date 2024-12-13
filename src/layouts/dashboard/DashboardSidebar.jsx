import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
// material
import {
	Avatar,
	Box,
	Drawer,
	FormControlLabel,
	Link,
	ListItemButton,
	Stack,
	Switch,
	Typography,
	useMediaQuery,
	Button
} from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
// mock
// components
import Logo from '../../components/Logo'
import NavSection, { ListItemIconStyle } from '../../components/NavSection'
import Scrollbar from '../../components/Scrollbar'
//
import Iconify from 'components/Iconify'
import { DRAWER_WIDTH, DRAWER_WIDTH_COLLAPSED } from 'constant'
import ApprovalRequest from 'layouts/ApprovalRequest'
import Notifications from 'layouts/Notifications'
import useMain from 'pages/context/context'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { getEmployeeDetails } from 'supabase'
import navConfig from './NavConfig'

// ----------------------------------------------------------------------

const RootStyle = styled('div', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
	transition: 'all 0.5s ease-in-out',
	...(!open && {
		[theme.breakpoints.up('md')]: {
			width: DRAWER_WIDTH_COLLAPSED,
		},
	}),
	...(open && {
		[theme.breakpoints.up('md')]: {
			flexShrink: 0,
			width: DRAWER_WIDTH,
		},
	}),
}))

const AccountStyle = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	padding: theme.spacing(2, 1.5),
	borderRadius: Number(theme.shape.borderRadius) * 1.5,
	backgroundColor: theme.palette.grey[500_12],
}))

// ----------------------------------------------------------------------

DashboardSidebar.propTypes = {
	leftDrawerOpened: PropTypes.bool,
	onCloseSidebar: PropTypes.func,
}

const ListItemStyle = styled((props) => <ListItemButton disableGutters {...props} />)(({ theme }) => ({
	...theme.typography.body2,
	height: 48,
	position: 'relative',
	textTransform: 'capitalize',
	color: theme.palette.text.secondary,
	borderRadius: theme.shape.borderRadius,
	margin: 10,
}))

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
	width: 50,
	height: 35,
	padding: 12,
	'& .MuiSwitch-switchBase': {
		margin: 6,
		padding: 0,
		transform: 'translateX(6px)',
		'&.Mui-checked': {
			color: '#fff',
			transform: 'translateX(22px)',
			'& .MuiSwitch-thumb:before': {
				backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
					'#fff'
				)}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
			},
			'& + .MuiSwitch-track': {
				opacity: 1,
				backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
			},
		},
	},
	'& .MuiSwitch-thumb': {
		backgroundColor: '#FF6B00',
		width: 22,
		height: 22,
		'&:before': {
			content: "''",
			position: 'absolute',
			width: '100%',
			height: '100%',
			left: 0,
			top: 0,
			backgroundRepeat: 'no-repeat',
			backgroundPosition: 'center',
			backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
				'#fff'
			)}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
		},
	},
	'& .MuiSwitch-track': {
		opacity: 1,
		backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
		borderRadius: 20 / 2,
	},
}))

const ToggleButton = styled(Button)(({ theme }) => ({
	padding: theme.spacing(1, 2),
	minWidth: 80,
	borderRadius: 0,
	'&:first-of-type': {
	  borderTopLeftRadius: 24,
	  borderBottomLeftRadius: 24,
	},
	'&:last-of-type': {
	  borderTopRightRadius: 24,
	  borderBottomRightRadius: 24,
	},
}))

const ToggleButton2 = styled(Button)(({ theme }) => ({
	padding: theme.spacing(1, 0),
	minWidth: 30,
	borderRadius: 0,
	'&:first-of-type': {
	  borderTopLeftRadius: 27,
	  borderTopRightRadius: 27,
	},
	'&:last-of-type': {
	  borderBottomLeftRadius: 27,
	  borderBottomRightRadius: 27,
	},
  }))

export default function DashboardSidebar({ leftDrawerOpened, onCloseSidebar }) {
	const { user, openNotification, openaccoutReview, setopenNotification, currentEmployee } = useMain()
	const { pathname } = useLocation()
	const theme = useTheme()
	const [isKorean, setIsKorean] = useState(false);
	// const isDesktop = useResponsive('up', 'lg')
	const matchUpMd = useMediaQuery(theme.breakpoints.up('md'))

	const { i18n } = useTranslation()
	const isEng = i18n.language === 'en'

	const { data: employee } = useQuery(
		['employee', currentEmployee?.id],
		({ queryKey }) => getEmployeeDetails(queryKey[1]),
		{
			enabled: !!currentEmployee?.id,
			select: (r) => r.data,
		}
	)

	const handleChangeLanguage = () => {
		i18n.changeLanguage(isEng ? 'ko' : 'en')
	}

	useEffect(() => {
		if (leftDrawerOpened && !matchUpMd) {
			onCloseSidebar()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname])

	const renderContent = (leftDrawerOpened, isKorean) => (
		<Scrollbar
			sx={{
				height: 1,
				'& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
			}}
		>
			<Box sx={{ px: 1.5, py: 3, display: 'inline-flex' }}>
				<Logo disabledLink handleClick={onCloseSidebar} />
			</Box>

			<NavSection leftDrawerOpened={leftDrawerOpened} navConfig={navConfig} />

			<Box sx={{ flexGrow: 1 }} />

			{leftDrawerOpened ? (
				<Box sx={{ px: 1.5, pb: 3, mt: 10 }}>
					<Stack alignItems="center" spacing={3} sx={{ pt: 5, position: 'relative', overflow: 'hidden' }}>

						<Box display="flex" justifyContent="center" alignItems="center" p={2}>
							<Box position="relative" display="inline-flex">
								<ToggleButton
								variant={i18n.language === "ko" ? "outlined" : "contained"}
								color="primary"
								onClick={() => i18n.changeLanguage('en')}
								>
								<Typography variant="body2">
									English
								</Typography>
								</ToggleButton>
								<ToggleButton
								variant={i18n.language === "en" ? "outlined" : "contained"}
								color="primary"
								onClick={() => i18n.changeLanguage('ko')}
								>
								<Typography variant="body2">
									한국어
								</Typography>
								</ToggleButton>
							</Box>
						</Box>

						<Box component="a" href="/dashboard/profile" sx={{ width: 100, height: 100 }}>
							<Avatar
								src={employee?.profile}
								alt={employee?.name}
								sx={{ width: '100%', height: '100%', overflow: 'hidden' }}
							/>
						</Box>

						<Box sx={{ textAlign: 'center' }}>
							<Typography gutterBottom variant="h6">
								{user.email}
							</Typography>

							<Typography variant="body2" sx={{ color: 'text.secondary' }}>
								{employee.name}
							</Typography>
						</Box>

						{/* <Button href="https://material-ui.com/store/items/minimal-dashboard/" target="_blank" variant="contained">
							Upgrade
						</Button> */}
					</Stack>
				</Box>
			) : (
				<Box sx={{ mt: 2.5 }}>
					<ListItemStyle>
						<ListItemIconStyle onClick={() => setopenNotification(!openNotification)}>
							<Iconify icon="ion:mail-notification-outline" sx={{ width: 16, height: 16 }} />
						</ListItemIconStyle>
					</ListItemStyle>

					<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", p: 2 }}>
						<Box style={{ display: 'inline-flex', flexDirection: 'column' }}>
							<ToggleButton2
							variant={i18n.language === "ko" ? "outlined" : "contained"}
							color="primary"
							onClick={() => i18n.changeLanguage('en')}
							>
							<Typography variant="body2">
								en
							</Typography>
							</ToggleButton2>
							<ToggleButton2
							variant={i18n.language === "en" ? "outlined" : "contained"}
							color="primary"
							onClick={() => i18n.changeLanguage('ko')}
							>
							<Typography variant="body2">
								ko
							</Typography>
							</ToggleButton2>
						</Box>
					</Box>

					<Link underline="none" component={RouterLink} to="/dashboard/profile">
						<AccountStyle>
							<Avatar src={employee?.profile} alt="photoURL" />
							{/* <Box sx={{ ml: 2 }}>
							<Typography variant="subtitle2" sx={{ color: 'text.default' }}>
								{user.email}
							</Typography>
							<Typography variant="body2" sx={{ color: 'text.default' }}>
								{account.role}
							</Typography>
						</Box> */}
						</AccountStyle>
					</Link>
				</Box>
			)}
		</Scrollbar>
	)

	return (
		<RootStyle open={leftDrawerOpened}>
			<Drawer
				variant={matchUpMd ? 'persistent' : 'temporary'}
				open={matchUpMd ? true : leftDrawerOpened}
				onClose={onCloseSidebar}
				PaperProps={{
					sx: {
						width: leftDrawerOpened ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED,
						bgcolor: 'background.secondary',
						borderRightStyle: 'dashed',
						color: 'secondary.contrastText',
						transition: 'all 0.5s ease-in-out',
					},
				}}
			>
				{renderContent(leftDrawerOpened, isKorean)}
			</Drawer>
			{openNotification && <Notifications />}
			{openaccoutReview && <ApprovalRequest />}
		</RootStyle>
	)
}
