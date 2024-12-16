import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
// @mui
import {
	Alert,
	Avatar,
	Box,
	Button,
	Container,
	Divider,
	Grid,
	IconButton,
	Skeleton,
	Snackbar,
	Stack,
	Typography,
} from '@mui/material'
// components
import Page from '../../components/Page'
// sections
import { useTheme } from '@mui/material/styles'
import Iconify from 'components/Iconify'
import { useQuery } from 'react-query'
import { listEmployeesByProject } from 'supabase/employees'
import { getProjectDetails, getProjectFileLink } from 'supabase/projects'
import { formatNumber } from 'utils/helper'
import { useTranslation } from 'react-i18next'

// ----------------------------------------------------------------------

export default function Projects() {
	const { id } = useParams()
	// const [data, setData] = useState(null)
	const [toast, setToast] = useState(false)
	const [loading, setLoading] = useState(false)
	const [empData, setempData] = useState(null)
	const navigate = useNavigate()
	const { t } = useTranslation(['project_details'])


	// const fetchData = async (id) => {
	// 	setLoading(true)
	// 	const res = await getProjectDetails(id)
	// 	if (res.status === 404) setToast(true)
	// 	setData(res.data)
	// 	setLoading(false)
	// }

	const {
		data,
		refetch: fetchData,
		isLoading,
	} = useQuery(['list projects', id], async ({ queryKey }) => {
		const res = await getProjectDetails(queryKey[1])
		if (res.status === 404) {
			setToast(true)
			return null
		}
		return res?.data
	})

	const fetchDataEmp = async (id) => {
		const res = await listEmployeesByProject(id)
		if (res.status === 404) setToast(true)
		setempData(res.data)
	}

	useEffect(() => {
		// fetchData(id)
		fetchDataEmp(id)
	}, [id])

	const handleClose = () => {
		setToast(null)
	}

	const events = [
		{
			icon: <Iconify width={40} height={40} color="#8CCC67" icon="ant-design:money-collect-outlined" />,
			title: 'Contract Execution Budget',
			description: '169,000,000 (Operating profit: 1,435,293 (0.8%))',
			redirect: '#',
		},
		{
			icon: <Iconify width={40} height={40} color="#7FBCFE" icon="fluent:clipboard-bullet-list-ltr-16-regular" />,
			title: 'Implementation Schedule',
			description: ' 15/06/2022 - 14/08/2022',
			redirect: `/dashboard/projects/${id}/project-schedule`,
		},
		{
			icon: <Iconify width={40} height={40} color="#8D99FF" icon="ph:users-light" />,
			title: 'Daily Workforce Planning',
			description: 'Installation team, Connection Team 1, Connection Team 2',
			redirect: `/dashboard/projects/${id}/workforce-planning`,
		},
		{
			icon: <Iconify width={40} height={40} color="#FFA58D" icon="heroicons-outline:calendar" />,
			title: 'Weekly Process Planning',
			description: '24/02/2022 - 02/03/2022 - 45.78%',
			redirect: `/dashboard/projects/${id}/weekly-plan`,
		},
		{
			icon: <Iconify width={40} height={40} color="#8D99FF" icon="heroicons:truck" />,
			title: 'Travel Expenses / Overtime',
			description: '3 day shifts, 54 night shifts, 5 Overtime, 3 Nighttime, 4 Move on rest day',
			redirect: `/dashboard/projects/${id}/travel-expenses?filters=te,ste`,
		},
		{
			icon: <Iconify width={40} height={40} color="#FF62B5" icon="heroicons:chart-bar" />,
			title: 'Profit & Loss Reports',
			description: 'Pellentesque in ipsum id orci porta dapibus',
			redirect: '#',
		},
	]

	const projectInfo = [
		[
			{
				title: data?.title,
				icon: 'material-symbols:handshake-outline-sharp',
			},
			{
				title: data?.service,
				icon: 'material-symbols:home-repair-service-outline',
			},
			{
				title: data?.voltage,
				icon: 'radix-icons:lightning-bolt',
			},
			{
				title: data?.location,
				icon: 'heroicons-outline:location-marker',
			},
			{
				title: data?.construction_type,
				icon: 'bi:buildings',
			},
			{
				title: data?.contract_code,
				icon: 'ion:document-text-outline',
			},
			{
				title: data?.contract_value ? formatNumber(data?.contract_value) : '',
				icon: 'material-symbols:account-balance-wallet-outline',
			},
		],
		[
			{
				title: 'Contract',
				icon: 'material-symbols:handshake-outline',
				value: data?.contract_file,
				file_name: 'contract_file',
			},
			{
				title: 'Design',
				icon: 'akar-icons:book-open',
				value: data?.design_file,
				file_name: 'design_file',
			},
			{
				title: 'Blueprint',
				icon: 'material-symbols:account-balance-wallet-outline',
				value: data?.blueprint_file,
				file_name: 'blueprint_file',
			},
		],
	]

	return (
		<Page title="Dashboard">
			<Box sx={{ position: 'absolute', top: 28, right: 44 }}>
				<Button
					variant="contained"
					startIcon={<Iconify icon="material-symbols:account-balance-wallet-outline" width={15} height={15} />}
					size="medium"
					color="inherit"
					sx={{ color: '#6AC79B' }}
				>
					{t('Expenditures')}
				</Button>

				<Button
					variant="contained"
					startIcon={<Iconify icon="material-symbols:edit" width={15} height={15} />}
					size="medium"
					color="inherit"
					sx={{ color: '#8D99FF', marginLeft: 1 }}
					onClick={() => navigate(`/dashboard/projects/${id}/edit`)}
				>
					{t('edit')}
				</Button>
			</Box>
			<Container maxWidth="xl">
				<Snackbar
					open={toast}
					anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
					autoHideDuration={5000}
					onClose={handleClose}
				>
					<Alert onClose={handleClose} severity="danger" sx={{ width: '100%' }}>
						{t('error')}
					</Alert>
				</Snackbar>

				{/* <Grid item xs={12}>
          {loading ? (
            <>
              <Skeleton />
              <Skeleton animation="wave" />
              <Skeleton animation={false} />
            </>
          ) : (
            <Card>
              <CardHeader title={data?.title} />
              <CardContent>
                <Typography variant="body2">Contract code: {data?.contract_code}</Typography>
                <Typography variant="body2">Contract value: {data?.contract_value}</Typography>
                <Typography variant="body2">
                  Project timeline: {data?.start} - {data?.end}
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid> */}

				<Grid container spacing={3}>
					{eventCost.map((event, index) => (
						<>
							<Grid item xs={12} sm={6} md={4} lg={2}>
								<EventCardCost event={event} t={t} key={index} />
							</Grid>
						</>
					))}

					{data && (
						<>
							<Grid item xs={12} sm={4} md={3}>
								<ProjectInfo projectInfo={projectInfo} t={t} id={id} />
							</Grid>

							<Grid item xs={12} sm={8} md={9}>
								<TeamMates empData={empData} t={t} title={data?.title} />
							</Grid>
						</>
					)}

					{loading ? (
						<Loading />
					) : (
						events.map((event, index) => (
							<>
								<Grid item xs={12} sm={6} md={4} lg={2}>
									<EventCard event={event} t={t} key={index} />
								</Grid>
							</>
						))
					)}
				</Grid>
			</Container>
		</Page>
	)
}
EventCard.propTypes = {
	key: PropTypes.number,
	event: PropTypes.shape({
		icon: PropTypes.element,
		title: PropTypes.string,
		description: PropTypes.string,
		redirect: PropTypes.string,
	}),
}

function EventCard({ event, t, key }) {
	const navigate = useNavigate()
	const redirectCard = () => {
		navigate(event.redirect)
	}
	return (
		<>
			<Box
				key={key}
				sx={{
					backgroundColor: (theme) => theme.palette.background.paper,
					alignItems: 'center',
					display: 'flex',
					flexDirection: 'column',
					borderRadius: 2,
					cursor: 'pointer',
					height: '100%',
				}}
				align="center"
				p={2}
				onClick={redirectCard}
				maxHeight={'sm'}
			>
				{event?.icon}
				<Typography m={1} align="center" sx={{ fontWeight: 600 }}>
					{t(`${event?.title}`)}
				</Typography>
				<Typography align="center" variant="caption">
					{event?.description}
				</Typography>
			</Box>
		</>
	)
}

function EventCardCost({ event, t, key }) {
	return (
		<>
			<Box
				key={key}
				sx={{
					backgroundColor: (theme) => theme.palette.background.paper,
					alignItems: 'center',
					display: 'flex',
					flexDirection: 'column',
					borderRadius: 2,
					cursor: 'pointer',
					height: '100%',
				}}
				align="center"
				p={2}
				maxHeight={'sm'}
			>
				<Typography m={1} align="center" sx={{ fontWeight: 600, fontSize: 14 }}>
					{t(`${event?.title}`)}
				</Typography>
				<Typography align="center" variant="caption" color={event?.color} fontSize={16}>
					{event?.cost}
				</Typography>
			</Box>
		</>
	)
}

function Loading() {
	return (
		<Grid item xs={12} md={6} lg={4}>
			<Stack
				sx={{
					backgroundColor: (theme) => theme.palette.background.paper,
					alignItems: 'center',
					display: 'flex',
					flexDirection: 'column',
					borderRadius: 2,
				}}
				align="center"
				p={2}
				spacing={2}
			>
				{/* For variant="text", adjust the height via font-size */}
				{/* For other variants, adjust the size with `width` and `height` */}
				<Skeleton variant="circular" width={40} height={40} />
				<Skeleton variant="rectangular" m={1} width={210} height={20} />
				<Skeleton variant="rectangular" width={210} height={20} />
			</Stack>
		</Grid>
	)
}

function ProjectInfo({ projectInfo, t, id }) {
	return (
		<>
			<Box
				sx={{
					backgroundColor: (theme) => theme.palette.background.paper,
					borderRadius: 2,
					height: '100%',
				}}
				p={2}
			>
				<Typography m={1} sx={{ fontWeight: 600, fontSize: 16 }}>
					{t('Project info')}
				</Typography>
				{projectInfo[0]
					? projectInfo[0]?.map((e) => (
							<>
								{!!e.title && (
									<Grid key={e.title} container spacing={2} style={{ alignItems: 'center', flex: 1 }} mt={1} pl={3}>
										<Iconify sx={{ minWidth: 15 }} width={15} height={15} icon={e.icon} />

										<Typography m={1} sx={{ fontSize: 12, color: 'text.secondary' }}>
											{e.title}
										</Typography>
									</Grid>
								)}
							</>
					  ))
					: null}
				<Divider />
				{projectInfo[1]
					? projectInfo[1]?.map((e) => (
							<>
								{e.value && (
									<Grid key={e.title} container spacing={2} style={{ alignItems: 'center', flex: 1 }} mt={1} pl={3}>
										<Iconify sx={{ minWidth: 15 }} width={15} height={15} icon={e.icon} />

										<Typography flexGrow={1} m={1} sx={{ fontSize: 12, color: 'text.secondary' }}>
											{e.title}
										</Typography>
										<IconButton
											onClick={async () => {
												const link = await getProjectFileLink(e.value)
												window.open(link, '_blank')
											}}
										>
											<Iconify sx={{ minWidth: 15 }} width={15} height={15} icon="material-symbols:download-rounded" />
										</IconButton>
									</Grid>
								)}
							</>
					  ))
					: null}
			</Box>
		</>
	)
}

const pickColor = (rating) => {
	switch (rating) {
		case 'A':
			return '#FF62B5'
		case 'B':
			return '#FE9F00'
		default:
			return '#8D99FF'
	}
}

function TeamMates({ empData, t, title }) {
	const theme = useTheme()

	return (
		<>
			<Box
				sx={{
					backgroundColor: (theme) => theme.palette.background.paper,
					borderRadius: 2,
					height: '100%',
				}}
				p={2}
			>
				<Typography m={1} sx={{ fontWeight: 600, fontSize: 16 }}>
					{t('TeamMates')}
				</Typography>

				{empData?.length === 0 && (
					<Grid sx={{ display: 'flex', height: '70%' }} justifyContent="center" alignItems={'center'}>
						<Typography m={1} sx={{ fontWeight: 900, fontSize: 20 }}>
							{t('No TeamMates Exist')}
						</Typography>
					</Grid>
				)}

				<Grid container spacing={4}>
					{empData?.map((e) => (
						<Grid
							key={e.name}
							item
							xs={12}
							sm={6}
							md={5}
							lg={4}
							style={{ flexDirection: 'row', height: '100%' }}
							mt={1}
							pl={3}
						>
							<Box sx={{ display: 'flex' }}>
								<Box pt={0.3}>
									<Avatar sx={{ bgcolor: pickColor(e?.rating), width: 18, height: 18, fontSize: 12 }}>
										{e?.rating}
									</Avatar>
								</Box>
								<Box pl={1}>
									<Box justifyContent={'space-between'} display="flex">
										<Typography variant="caption" color={theme.palette.text.secondary}>
											{e.name}
										</Typography>
										{e.team_lead && (
											<Typography
												style={{
													borderRadius: 3,
													background: '#FF6B00',
													color: 'white',
													fontSize: 8,
													height: 15,
													paddingInline: 5,
													paddingBlock: 1,
												}}
												variant={'caption'}
											>
												TEAM LEAD
											</Typography>
										)}
									</Box>
									<Box>
										<Typography variant="caption">{title}</Typography>
									</Box>
								</Box>
							</Box>
						</Grid>
					))}
				</Grid>
			</Box>
		</>
	)
}

const eventCost = [
	{
		title: 'Fixed Cost',
		cost: '1,278,663,306',
		color: '#8D99FF',
	},
	{
		title: 'Labor Cost',
		cost: '1,200,629,509',
		color: '#FFA58D',
	},
	{
		title: 'Administrative Expenses',
		cost: '42,033,797',
		color: '#98D2C3',
	},
	{
		title: 'Asset Maintenance Cost',
		cost: '36,000,000',
		color: '#8CCC67',
	},
	{
		title: 'Operating Profit',
		cost: '-143,207,384',
		color: '#7FBCFE',
	},
	{
		title: 'Operating Profit',
		cost: '-4%',
		color: '#FF62B5',
	},
]
