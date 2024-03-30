import {
	Breadcrumbs,
	Button,
	Link,
	Button as MuiButton,
	Stack,
	Typography,
	useMediaQuery,
	useTheme,
} from '@mui/material'
import Iconify from 'components/Iconify'
import React from 'react'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'

// components
const Header = ({ title }) => {
	const theme = useTheme()
	const matchUpMd = useMediaQuery(theme.breakpoints.up('md'))
	const MainPath = `/dashboard/projects/list`

	const breadcrumbs = [
		<Link underline="hover" key="1" color="inherit" href={MainPath}>
			Main
		</Link>,
		<Link underline="hover" key="2" color="inherit" href={MainPath}>
			Projects
		</Link>,
		<Typography key="3" color="text.primary">
			{title}
		</Typography>,
		<Typography key="3" color="text.primary">
			Implementation Schedule
		</Typography>,
	]

	return (
		<>
			<Stack
				direction={'row'}
				alignItems={'center'}
				justifyContent={'space-between'}
				sx={{
					position: 'fixed',
					top: 0,
					left: matchUpMd ? 75 : 0,
					background: '#F3F3F5',
					width: '100%',
					height: '56px',
					zIndex: 1000,
				}}
				px={2}
			>
				<Stack direction={'row'} gap={'7px'}>
					<Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
						{breadcrumbs}
					</Breadcrumbs>
				</Stack>

				<Stack direction={'row'} gap={'7px'} alignItems={'center'} pr={matchUpMd ? 13 : 4}>
					<MuiButton size="small" variant="contained" color="inherit" sx={{ padding: 1, minWidth: 0 }}>
						<Iconify icon="material-symbols:download-rounded" width={20} height={20} />
					</MuiButton>
					<Button
						variant="contained"
						size="medium"
						color="inherit"
						sx={{
							background: '#8D99FF',
							minWidth: 35,
							width: 35,
							padding: '5px 0',
							height: '100%',
							borderRadius: '5px',
						}}
					>
						<Iconify icon="uil:bars" width={25} height={25} color="white" />
					</Button>
				</Stack>
			</Stack>
		</>
	)
}

export default Header
