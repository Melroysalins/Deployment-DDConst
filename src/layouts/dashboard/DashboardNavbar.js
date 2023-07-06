import PropTypes from 'prop-types'
// material
import { alpha, styled, useTheme } from '@mui/material/styles'
import { Box, Stack, AppBar, Toolbar, IconButton, Avatar, ButtonBase } from '@mui/material'

// components
import Iconify from '../../components/Iconify'
//
import Searchbar from './Searchbar'
import AccountPopover from './AccountPopover'
import LanguagePopover from './LanguagePopover'
import NotificationsPopover from './NotificationsPopover'
import { DRAWER_WIDTH, DRAWER_WIDTH_COLLAPSED, APP_BAR_MOBILE, APP_BAR_DESKTOP } from 'constant'
import Notifications from 'layouts/Notifications'

// ----------------------------------------------------------------------

const RootStyle = styled(AppBar, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
	boxShadow: 'none',
	backdropFilter: 'blur(6px)',
	WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
	backgroundColor: alpha(theme.palette.background.default, 0.72),
	transition: 'all 0.5s ease-in-out',

	...(!open && {
		[theme.breakpoints.up('md')]: {
			marginLeft: -(DRAWER_WIDTH_COLLAPSED - 20),
			width: `calc(100% - ${DRAWER_WIDTH_COLLAPSED}px)`,
		},
	}),
	...(open && {
		[theme.breakpoints.up('md')]: {
			width: `calc(100% - ${DRAWER_WIDTH}px)`,
			marginLeft: -(DRAWER_WIDTH - 20),
		},
	}),
}))

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
	minHeight: APP_BAR_MOBILE,
	[theme.breakpoints.up('lg')]: {
		minHeight: APP_BAR_DESKTOP,
		padding: theme.spacing(0, 5),
	},
}))

// ----------------------------------------------------------------------

DashboardNavbar.propTypes = {
	onOpenSidebar: PropTypes.func,
}

export default function DashboardNavbar({ onOpenSidebar, leftDrawerOpened }) {
	const theme = useTheme()
	return (
		<RootStyle open={leftDrawerOpened}>
			<ToolbarStyle>
				<ButtonBase sx={{ borderRadius: '12px', overflow: 'hidden' }}>
					<Avatar
						variant="rounded"
						sx={{
							...theme.typography.commonAvatar,
							...theme.typography.mediumAvatar,
							transition: 'all .2s ease-in-out',
							background: theme.palette.secondary.light,
							color: theme.palette.secondary.dark,
							'&:hover': {
								background: theme.palette.secondary.dark,
								color: theme.palette.secondary.light,
							},
						}}
						onClick={onOpenSidebar}
						color="inherit"
					>
						<Iconify
							icon={leftDrawerOpened ? 'eva:menu-2-fill' : 'eva:menu-arrow-fill'}
							sx={{ width: 20, height: 20 }}
						/>
					</Avatar>
				</ButtonBase>
				<Searchbar />
				<Box sx={{ flexGrow: 1 }} />

				<Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
					<LanguagePopover />
					<NotificationsPopover />
					<AccountPopover />
				</Stack>
			</ToolbarStyle>
		</RootStyle>
	)
}
