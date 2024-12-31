// material
import { styled } from '@mui/material/styles'
import { Box, Stack, Typography, Button as MuiButton } from '@mui/material'
import Iconify from 'components/Iconify'
import Calendar from './Calendar'
import { useState, useEffect } from 'react'
import { getProjectDetails } from 'supabase'
import { useParams } from 'react-router'
import EventHeader from 'components/EventHeader'
import Page from 'components/Page'
import useMain from 'pages/context/context'
import BasicTabs from 'components/Drawer/BasicTabs'
import { useTranslation } from 'react-i18next'
import RequestApproval from 'layouts/RequestApproval'

const ProjectIntro = styled(Box)(({ theme }) => ({
	backgroundColor: theme.palette.background.paper,
	padding: 24,
	marginTop: 24,
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
	const {
		isDrawerOpen,
		setopenRequestApproval,
		openRequestApproval,
		setisDrawerOpen,
		setapprovalIdDrawerRight,
		setFromPage
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

			<Box sx={{ display: 'flex', gap: '10px', position: 'absolute', top: 28, right: 44 }}>
				<MuiButton
					variant="contained"
					size="medium"
					color="inherit"
					sx={{ border: '1px solid #596570' }}
					onClick={() => {
						setopenRequestApproval(!openRequestApproval)
						setFromPage("project_schedule")
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
						setFromPage("project_schedule")
					}}
					variant="contained"
					size="medium"
					color="inherit"
					sx={{ background: '#8D99FF', marginLeft: 1, minWidth: 40, width: 40, padding: '5px 0', height: 37 }}
				>
					<Iconify icon="uil:bars" width={25} height={25} color="white" />
				</MuiButton>
			</Box>

			<Page title="PS">
				<Stack px={2} mt={7}>
					<Calendar />
				</Stack>
			</Page>
			{isDrawerOpen && <BasicTabs open={isDrawerOpen} setopen={setisDrawerOpen} />}
			{openRequestApproval && <RequestApproval />}
		</div>
	)
}

export default ProjectImplementationSchedule
