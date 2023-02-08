/* eslint-disable no-nested-ternary */
import { useState } from 'react'
import PropTypes from 'prop-types'
import { NavLink as RouterLink, matchPath, useLocation } from 'react-router-dom'
// material
import { alpha, useTheme, styled } from '@mui/material/styles'
import { Box, List, Collapse, ListItemText, ListItemIcon, ListItemButton } from '@mui/material'
//
import Iconify from './Iconify'
import { supabase } from '../supabaseClient'

// ----------------------------------------------------------------------

const ListItemStyle = styled((props) => <ListItemButton disableGutters {...props} />)(({ theme }) => ({
	...theme.typography.body2,
	height: 48,
	position: 'relative',
	textTransform: 'capitalize',
	color: theme.palette.text.secondary,
	borderRadius: theme.shape.borderRadius,
}))

const ListItemIconStyle = styled(ListItemIcon)({
	width: 22,
	height: 22,
	color: 'inherit',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
})

// ----------------------------------------------------------------------

NavItem.propTypes = {
	item: PropTypes.object,
	active: PropTypes.func,
	leftDrawerOpened: PropTypes.bool,
}

const handleTargetLink = (link) => {
	window.open(link, '_blank')
}

function NavItem({ item, active, leftDrawerOpened }) {
	const theme = useTheme()

	const isActiveRoot = active(item.path)

	const { title, path, icon, info, children, target_link } = item

	const [open, setOpen] = useState(isActiveRoot)

	const handlesignOut = async () => {
		const { error } = await supabase.auth.signOut()
		if (error) throw error
	}

	const handleOpen = () => {
		setOpen((prev) => !prev)
	}

	const activeRootStyle = {
		color: 'secondary.contrastText',
		fontWeight: 'fontWeightMedium',
		bgcolor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
	}

	const activeSubStyle = {
		color: 'text.primary',
		fontWeight: 'fontWeightMedium',
	}

	if (children) {
		return (
			<>
				<ListItemStyle
					onClick={handleOpen}
					sx={{
						...(isActiveRoot ? activeRootStyle : {}),
					}}
				>
					{icon ? <ListItemIconStyle>{icon}</ListItemIconStyle> : null}
					<ListItemText disableTypography primary={title} />
					{info ?? ''}
					<Iconify
						icon={open ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'}
						sx={{ width: 16, height: 16, ml: 1 }}
					/>
				</ListItemStyle>

				<Collapse in={open} timeout="auto" unmountOnExit>
					<List component="div" disablePadding>
						{children.map((item) => {
							const { title, path } = item
							const isActiveSub = active(path)

							return (
								<ListItemStyle
									key={title}
									LinkComponent={RouterLink}
									to={path}
									sx={{
										...(isActiveSub ? activeSubStyle : {}),
									}}
								>
									<ListItemIconStyle>
										<Box
											component="span"
											sx={{
												width: 4,
												height: 4,
												display: 'flex',
												borderRadius: '50%',
												alignItems: 'center',
												justifyContent: 'center',
												bgcolor: 'text.disabled',
												transition: (theme) => theme.transitions.create('transform'),
												...(isActiveSub
													? {
															transform: 'scale(2)',
															bgcolor: 'primary.main',
													  }
													: {}),
											}}
										/>
									</ListItemIconStyle>
									<ListItemText disableTypography primary={title} />
								</ListItemStyle>
							)
						})}
					</List>
				</Collapse>
			</>
		)
	}

	const isLogout = title === 'logout'
	return (
		<ListItemStyle
			onClick={() => (isLogout ? handlesignOut() : target_link ? handleTargetLink(target_link) : null)}
			LinkComponent={!isLogout && !target_link ? RouterLink : null}
			to={!isLogout && !target_link ? path : ''}
			sx={{
				...(isActiveRoot ? activeRootStyle : {}),
			}}
		>
			{icon ? <ListItemIconStyle>{icon}</ListItemIconStyle> : null}
			{leftDrawerOpened ? (
				<>
					<ListItemText disableTypography primary={title} />
					{info || ''}
				</>
			) : null}
		</ListItemStyle>
	)
}

NavSection.propTypes = {
	navConfig: PropTypes.array,
	leftDrawerOpened: PropTypes.bool,
}

export default function NavSection({ navConfig, leftDrawerOpened, ...other }) {
	const { pathname } = useLocation()

	const match = (path) => (path ? !!matchPath({ path, end: false }, pathname) : false)

	return (
		<Box {...other}>
			<List disablePadding sx={{ p: 1 }}>
				{navConfig.map((item) => (
					<NavItem leftDrawerOpened={leftDrawerOpened} key={item.title} item={item} active={match} />
				))}
			</List>
		</Box>
	)
}
