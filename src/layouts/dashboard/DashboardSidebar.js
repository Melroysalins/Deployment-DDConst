import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
// material
import { styled, useTheme } from '@mui/material/styles'
import { Box, Link, Button, Drawer, Typography, Avatar, useMediaQuery, ListItemButton } from '@mui/material'
// mock
import account from '../../_mock/account'
// hooks
import useResponsive from '../../hooks/useResponsive'
// components
import Logo from '../../components/Logo'
import Scrollbar from '../../components/Scrollbar'
import NavSection, { ListItemIconStyle } from '../../components/NavSection'
//
import navConfig from './NavConfig'
import { DRAWER_WIDTH, DRAWER_WIDTH_COLLAPSED } from 'constant'
import useMain from 'pages/context/context'
import Iconify from 'components/Iconify'
import Notifications from 'layouts/Notifications'
import ApprovalRequest from 'layouts/ApprovalRequest'

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
	padding: theme.spacing(2, 2.5),
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

export default function DashboardSidebar({ leftDrawerOpened, onCloseSidebar }) {
	const { user, openNotification, setopenNotification, openaccoutReview } = useMain()
	const { pathname } = useLocation()
	const theme = useTheme()
	const isDesktop = useResponsive('up', 'lg')
	const matchUpMd = useMediaQuery(theme.breakpoints.up('md'))

	useEffect(() => {
		if (leftDrawerOpened && !matchUpMd) {
			onCloseSidebar()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname])

	const renderContent = (leftDrawerOpened) => (
		<Scrollbar
			sx={{
				height: 1,
				'& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
			}}
		>
			<Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
				<Logo disabledLink handleClick={onCloseSidebar} />
			</Box>

			<NavSection leftDrawerOpened={leftDrawerOpened} navConfig={navConfig} />

			<Box sx={{ flexGrow: 1 }} />
			<Box sx={{ mt: 2.5 }}>
				<ListItemStyle>
					<ListItemIconStyle onClick={() => setopenNotification(!openNotification)}>
						<Iconify icon="ion:mail-notification-outline" sx={{ width: 16, height: 16 }} />
					</ListItemIconStyle>
				</ListItemStyle>

				<Link underline="none" component={RouterLink} to="#">
					<AccountStyle>
						<Avatar src={account.photoURL} alt="photoURL" />
						<Box sx={{ ml: 2 }}>
							<Typography variant="subtitle2" sx={{ color: 'text.default' }}>
								{user.email}
							</Typography>
							<Typography variant="body2" sx={{ color: 'text.default' }}>
								{account.role}
							</Typography>
						</Box>
					</AccountStyle>
				</Link>
			</Box>
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
				{renderContent(leftDrawerOpened)}
			</Drawer>
			{openNotification && <Notifications />}
			{openaccoutReview && <ApprovalRequest />}
		</RootStyle>
	)
}
