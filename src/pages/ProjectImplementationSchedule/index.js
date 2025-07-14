/* eslint-disable */
// material
import { styled } from '@mui/material/styles'
import { Box, Stack, Switch, Typography, Button as MuiButton } from '@mui/material'
import Iconify from 'components/Iconify'
// import Calendar from './Calendar'
import { useState, useEffect } from 'react'
import { getProjectDetails } from 'supabase'
import { useParams } from 'react-router'
// import EventHeader from 'components/EventHeader'
import Page from 'components/Page'
import useMain from 'pages/context/context'
import BasicTabs from 'components/Drawer/BasicTabs'
import { useTranslation } from 'react-i18next'
import RequestApproval from 'layouts/RequestApproval'
import Calendar2 from './Calender2'
import FilterPopup from 'components/FilterPopUp'

const ProjectIntro = styled(Box)(({ theme }) => ({
	backgroundColor: theme.palette.background.paper,
	padding: 24,
	marginTop: 24,
}))

const CompactSwitch = styled(Switch)(({ theme }) => ({
	width: 44,
	height: 23,
	padding: 4,
	'& .MuiSwitch-switchBase': {
		padding: 1,
		'&.Mui-checked': {
			transform: 'translateX(20px)',
			color: '#fff',
			'& + .MuiSwitch-track': {
				backgroundColor: '#4caf50',
				opacity: 1,
			},
		},
	},
	'& .MuiSwitch-thumb': {
		width: 20,
		height: 20,
		boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
	},
	'& .MuiSwitch-track': {
		borderRadius: 20 / 2,
		backgroundColor: '#ccc',
		opacity: 1,
		transition: theme.transitions.create(['background-color'], {
			duration: 200,
		}),
	},
}))
const breadcrumbElements = [
	<Typography key="4" color="text.primary">
		Implementation Schedule
	</Typography>,
]

const ProjectImplementationSchedule = () => {
	const { id } = useParams()
	const [loading, setLoading] = useState(false)
	const [data, setData] = useState({})
	// Filters code
	const [isFilterOpen, SetIsFilterOpen] = useState(false)
	const [isFilteredApplied, SetIsFilterApplied] = useState(false)
	const [filters, SetFilters] = useState({
		tasktype: '',
		lines: '',
		demolition: '',
	})
	const [taskGroup, SetTaskGroup] = useState([])
	const [allTaskGroup, SetAllTaskGroup] = useState([])
	const [allResources, SetAllRescources] = useState([])
	const [resources, SetResources] = useState([])
	const [taskType, SetTaskType] = useState([])

	const [checked, setChecked] = useState(true)

	const handleToggle = () => {
		setChecked(!checked)
	}

	// Filters Code End
	const {
		isDrawerOpen,
		setopenRequestApproval,
		openRequestApproval,
		setisDrawerOpen,
		setapprovalIdDrawerRight,
		setFromPage,
	} = useMain()

	const { t } = useTranslation(['weekly_plan', 'common'])

	const fetchData = async (id) => {
		setLoading(true)
		const res = await getProjectDetails(id)
		if (res.status === 404) return
		setData(res.data)
		setLoading(false)
	}

	useEffect(() => {
		if (id) fetchData(id)
	}, [id])

	// Filters code

	const handleChange = (field, value) => {
		SetTaskGroup(allTaskGroup)
		if (field === 'tasktype') {
			SetFilters((prev) => ({ ...prev, [field]: value }))
		} else {
			SetFilters((prev) => ({ ...prev, [field]: value }))
		}
	}

	const handleonClearFilter = () => {
		SetFilters({
			diagramName: '',
			lines: '',
			demolition: '',
			diagramId: '',
		})

		SetResources(allResources)
		SetTaskGroup(allTaskGroup)
		SetIsFilterOpen(false)

		console.log('myresoucers', resources, allResources)
	}

	const handleApplyFilters = (filters) => {
		SetIsFilterApplied(true)
		console.log('value', filters)

		const { tasktype, lines, demolition } = filters

		if (tasktype) {
			const filteredResources = allResources?.filter((resource) => resource?.id === tasktype)

			SetResources(filteredResources)
		} else {
			SetResources(allResources)
		}

		if (lines?.length || demolition?.length) {
			console.log('mecalled')
			const filterTasks = (tasks) =>
				tasks?.filter((item) => {
					const matchLines = item?.title?.toLowerCase()?.includes(lines.toLowerCase())
					const matchDemolition = demolition !== ' ' && String(item?.isDemolition) === demolition

					if (lines?.length && demolition?.length) {
						return matchLines && matchDemolition
					}

					if (lines) {
						return matchLines
					}

					if (demolition !== undefined) {
						return matchDemolition
					}
					return true
				})

			const modifiedData = {
				metal_fittings: filterTasks(allTaskGroup?.metal_fittings),
				connections: filterTasks(allTaskGroup?.connections),
				installations: filterTasks(allTaskGroup?.installations),
				completion_test: filterTasks(allTaskGroup?.completion_test),
				office_work: filterTasks(allTaskGroup?.office_work),
				auxiliary_construction: filterTasks(allTaskGroup?.auxiliary_construction),
			}

			SetTaskGroup(modifiedData)

			console.log('Melroy', modifiedData)
		}
	}

	return (
		<div>
			{/* <Box
				sx={{
					padding: '24px 30px',
				}}
			>
				 <h3>
					{data.title} {data?.start && `(${moment(data.start).format('DD/MM/YYYY')})`}
				</h3> 
				 <ProjectIntro>
					<h5>Project Name : {data?.title}</h5>
					<h5>Line Type and Length: {data?.location} - {data?.warranty_period}</h5>
					<h5>Installation & On-site : {data?.contract_value_vat_written}</h5>
				</ProjectIntro> 
			</Box> */}

			<Box
				sx={{
					display: 'flex',
					gap: '13px',
					position: 'absolute',
					flexDirection: 'row',
					top: 28,
					right: 44,
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<Stack direction={'row'} justifyContent={'flex-end'}>
					<MuiButton
						size="small"
						variant="contained"
						sx={{ padding: 0.5, minWidth: 0, width: 30 }}
						onClick={(e) => {
							e.stopPropagation() // Stop Accordion behv(open or close) on click on button
							SetIsFilterOpen(true)
						}}
					>
						<Iconify icon="heroicons-funnel" width={20} height={20} />
					</MuiButton>
					{isFilterOpen && (
						<FilterPopup
							open={isFilterOpen}
							onClose={() => {
								SetIsFilterOpen(false)
							}}
							onClearFilter={handleonClearFilter}
							onApplyFilters={handleApplyFilters}
							handleChange={handleChange}
							filters={filters}
							SetFilters={SetFilters}
							isTaskType={true}
							taskType={taskType}
						/>
					)}
				</Stack>
				<MuiButton
					variant="contained"
					size="medium"
					color="inherit"
					sx={{ border: '1px solid #596570' }}
					onClick={() => {
						setopenRequestApproval(!openRequestApproval)
						setFromPage('project_schedule')
					}}
				>
					{t('request_approval')}
				</MuiButton>
				<MuiButton size="small" variant="contained" color="inherit" sx={{ padding: 1, minWidth: 0 }}>
					<Iconify icon="material-symbols:download-rounded" width={20} height={20} />
				</MuiButton>
				<MuiButton
					onClick={() => {
						setapprovalIdDrawerRight(null)
						setisDrawerOpen(true)
						setFromPage('project_schedule')
					}}
					variant="contained"
					size="medium"
					color="inherit"
					sx={{ background: '#8D99FF', marginLeft: 1, minWidth: 40, width: 40, padding: '5px 0', height: 37 }}
				>
					<Iconify icon="uil:bars" width={25} height={25} color="white" />
				</MuiButton>
			</Box>

			{/* <Page title="PS">
				<Stack px={2} mt={7}>
					<Calendar />
				</Stack>
			</Page> */}
			{isDrawerOpen && <BasicTabs open={isDrawerOpen} setopen={setisDrawerOpen} />}
			{openRequestApproval && <RequestApproval />}
			<Page title="PS">
				{/* <Stack
					direction={'row'}
					justifyContent={'flex-end'}
					marginTop={'18px'}
					padding={'3px'}
					alignItems={'center'}
					spacing={2}
				>
					<Typography variant="body1" fontWeight="bold">
						Show SubTasks
					</Typography>
					<CompactSwitch checked={checked} onChange={handleToggle} />
				</Stack> */}
				<Stack px={2} mt={7}>
					<Calendar2
						isFilterOpen={isFilterOpen}
						SetIsFilterOpen={SetIsFilterOpen}
						isFilteredApplied={isFilteredApplied}
						SetIsFilterApplied={SetIsFilterApplied}
						filters={filters}
						SetFilters={SetFilters}
						taskGroup={taskGroup}
						SetTaskGroup={SetTaskGroup}
						allTaskGroup={allTaskGroup}
						SetAllTaskGroup={SetAllTaskGroup}
						allResources={allResources}
						SetAllRescources={SetAllRescources}
						resources={resources}
						SetResources={SetResources}
						taskType={taskType}
						SetTaskType={SetTaskType}
						showSubTasks={checked}
					/>
				</Stack>
			</Page>
			{/* <Page title="PS">
				<Stack px={2} mt={7}>
					<NestedTasks />
				</Stack>
			</Page> */}
		</div>
	)
}

export default ProjectImplementationSchedule
