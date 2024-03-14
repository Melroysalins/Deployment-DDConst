import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
// @mui
import {
	Alert,
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	Grid,
	Snackbar,
	Stack,
	Typography,
	useMediaQuery,
	useTheme,
} from '@mui/material'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress'
import { styled } from '@mui/material/styles'
import Iconify from 'components/Iconify'
import PropTypes from 'prop-types'
import { listAllProjects } from 'supabase/projects'
import Skeleton from './ProjectSkelation'
import { useTranslation } from 'react-i18next'
import BasicTabs from '../Drawer/BasicTabs'
import useMain from 'pages/context/context'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

export default function ProjectList() {
	const [loader, setLoader] = React.useState(true)
	const [data, setData] = React.useState([])
	const [filterData, setfilterData] = React.useState([])
	const [toast, setToast] = React.useState(null)
	const [rightDrawer, setrightDrawer] = useState(false)
	const { t } = useTranslation()
	const { currentEmployee, mainFilters } = useMain()
	const theme = useTheme()
	const matchUpMd = useMediaQuery(theme.breakpoints.up('md'))

	useEffect(() => {
		fetchData()
		return () => null
	}, [])

	useEffect(() => {
		if (mainFilters && data.length) {
			if (mainFilters.started_from) {
				mainFilters.started_from = new Date(mainFilters.started_from)
			}
			if (mainFilters.completed_till) {
				mainFilters.completed_till = new Date(mainFilters.completed_till)
			}
			// Filter projects based on the filters
			const filteredProjects = data.filter((project) => {
				if (!mainFilters.organizations?.includes(project.id)) {
					return false
				}
				if (
					(mainFilters.started_from && new Date(project.start) < mainFilters.started_from) ||
					(mainFilters.completed_till && new Date(project.end) > mainFilters.completed_till)
				) {
					return false
				}
				return true
			})
			setfilterData(filteredProjects)
		} else {
			setfilterData(data)
		}
	}, [data, mainFilters])

	const fetchData = async () => {
		setLoader(true)
		try {
			const res = await listAllProjects()
			if (res.status === 404) {
				setToast({ severity: 'danger', message: 'Something went wrong!' })
			} else if (Array.isArray(res.data)) {
				setData(res.data)
				setfilterData(res.data)
			}
		} catch (err) {
			setToast({ severity: 'danger', message: 'Something went wrong!' })
		}
		setLoader(false)
	}

	const handleClose = () => {
		setToast(null)
	}

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
					padding: 1,
					height: '56px',
					zIndex: 1000,
				}}
			>
				<Stack direction={'row'}>
					<Typography sx={{ fontSize: 18, fontWeight: 600, color: '#212B36' }} pl={3}>
						{t('hello')}, {currentEmployee?.name}
					</Typography>
					<ArrowDropDownIcon color="#212B36" />
				</Stack>

				<Stack direction={'row'} gap={'7px'} alignItems={'center'} pr={matchUpMd ? 13 : 4}>
					<Typography sx={{ fontSize: 14, fontWeight: 600 }}>{t('status_2023')}:</Typography>
					<>
						<img style={{ width: 16, height: 16 }} src={`/static/icons/Progress_main.svg`} alt="icon" />
						<Typography sx={{ fontSize: 12 }}>65 {t('projects_progress')}</Typography>
					</>
					<>
						<img style={{ width: 16, height: 16 }} src={`/static/icons/tick_main.svg`} alt="icon" />
						<Typography sx={{ fontSize: 12 }}>145 {t('projects_completed')}</Typography>
					</>
					<>
						<img style={{ width: 16, height: 16 }} src={`/static/icons/Pay_main.svg`} alt="icon" />
						<Typography sx={{ fontSize: 12 }}>2,100 {t('revenue')}</Typography>
					</>
					<>
						<img style={{ width: 16, height: 16 }} src={`/static/icons/zigzag_main.svg`} alt="icon" />
						<Typography sx={{ fontSize: 12 }}>22,100 {t('profit')}</Typography>
					</>
					<>
						<img style={{ width: 16, height: 16 }} src={`/static/icons/Margin_main.svg`} alt="icon" />
						<Typography sx={{ fontSize: 12 }}>19.6% {t('margin')}</Typography>
					</>

					<Button
						variant="outlined"
						href="/dashboard/projects/add"
						startIcon={<Iconify icon={'fluent:add-16-filled'} sx={{ width: 16, height: 16, ml: 1 }} />}
						sx={{
							color: (theme) => theme.palette.text.default,
							border: '1px solid rgba(0, 0, 0, 0.1)',
							boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.04)',
							borderRadius: '8px',
						}}
					>
						{t('add_new_project')}
					</Button>
					<Button
						onClick={() => {
							setrightDrawer(true)
						}}
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
			<Grid container spacing={3}>
				{loader && <Skeleton />}
				{!loader && !filterData.length && (
					<Typography align="center" width={'100%'} mt={5} variant="h5">
						{t('no_project')}
					</Typography>
				)}
				{filterData.map((project, index) => (
					<Grid key={index} item xs={12} sm={6} md={3}>
						<ProjectItem data={project} />
					</Grid>
				))}
			</Grid>

			<BasicTabs open={rightDrawer} setopen={setrightDrawer} />
		</>
	)
}

// ----------------------------------------------------------------------

const BorderLinearProgress = styled(LinearProgress, {
	shouldForwardProp: (prop) => prop !== '_color',
})(({ theme, _color }) => ({
	height: 28,
	borderRadius: 8,
	[`&.${linearProgressClasses.colorPrimary}`]: {
		backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 300 : 800],
	},
	[`& .${linearProgressClasses.bar}`]: {
		borderRadius: 8,
		backgroundColor: _color,
	},
}))

const Header = styled(CardHeader)(({ theme }) => ({
	'& .MuiCardHeader-title': {
		...theme.typography.subtitle2,
		fontWeight: 700,
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		display: '-webkit-box',
		WebkitLineClamp: '3',
		WebkitBoxOrient: 'vertical',
		height: '4rem',
	},
}))

ProjectItem.propTypes = {
	data: PropTypes.shape({
		id: PropTypes.number,
		start: PropTypes.string,
		end: PropTypes.string,
		title: PropTypes.string,
		location: PropTypes.string,
		contract_code: PropTypes.string,
		color: PropTypes.string,
		contract_value: PropTypes.number,
		rate_of_completion: PropTypes.number,
	}),
}

function ProjectItem({ data }) {
	const navigate = useNavigate()
	const { title, location, contract_code, contract_value, start, end, rate_of_completion, color, id } = data

	const changeView = React.useCallback(() => {
		navigate(`/dashboard/projects/${id}`)
	}, [id])

	return (
		<>
			<Card key={id} onClick={changeView}>
				<Header
					sx={{
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						display: '-webkit-box',
						WebkitLineClamp: '2',
						WebkitBoxOrient: 'vertical',
					}}
					title={title}
					subheader={location}
				/>
				<CardContent>
					<Box sx={{ position: 'relative' }}>
						<BorderLinearProgress _color={color} variant="determinate" value={rate_of_completion} />
						<Typography
							sx={{ position: 'absolute', top: '25%', left: 'calc(50% - 65px)', fontSize: '10px' }}
							variant="overline"
						>
							COMPLETED: {rate_of_completion}%
						</Typography>
					</Box>

					<Box sx={{ p: '10px 0', color: '#596570' }}>
						<Typography variant="body2">
							{' '}
							<span style={{ color: 'black' }}>Contract code:</span> {contract_code}
						</Typography>
						<Typography variant="body2">
							<span style={{ color: 'black' }}>Contract value:</span> {contract_value}
						</Typography>
						<Typography variant="body2">
							<span style={{ color: 'black' }}>Project timeline:</span>&nbsp;
							{start} to {end}
						</Typography>
					</Box>
				</CardContent>
			</Card>
		</>
	)
}
