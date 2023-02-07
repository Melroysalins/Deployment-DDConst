import React from 'react'
import { useNavigate } from 'react-router-dom'
// @mui
import { Alert, Box, Button, Card, CardContent, CardHeader, Grid, Snackbar, Typography } from '@mui/material'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress'
import { styled } from '@mui/material/styles'
import Iconify from 'components/Iconify'
import PropTypes from 'prop-types'
import { listAllProjects } from 'supabase/projects'
import Skeleton from './ProjectSkelation'

export default function ProjectList(props) {
	const [loader, setLoader] = React.useState(true)
	const [data, setData] = React.useState([])
	const [toast, setToast] = React.useState(null)

	React.useEffect(() => {
		fetchData()
		return () => null
	}, [])

	const fetchData = async () => {
		setLoader(true)
		try {
			const res = await listAllProjects()
			if (res.status === 404) {
				setToast({ severity: 'danger', message: 'Something went wrong!' })
			} else if (Array.isArray(res.data)) {
				setData(res.data)
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
			<Box sx={{ position: 'absolute', top: '24px', right: '40px' }}>
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
					Add New Project
				</Button>
			</Box>

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
				{data.map((project, index) => (
					<Grid key={index} item xs={12} sm={6} md={3}>
						<ProjectItem data={project} />
					</Grid>
				))}
			</Grid>
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
