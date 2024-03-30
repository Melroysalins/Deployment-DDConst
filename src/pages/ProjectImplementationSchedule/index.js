// material
import { styled } from '@mui/material/styles'
import { Box, Stack, Typography } from '@mui/material'

import Calendar from './Calendar'
import { useState, useEffect } from 'react'
import { getProjectDetails } from 'supabase'
import { useParams } from 'react-router'
import EventHeader from 'components/EventHeader'

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
	const { project } = useParams()
	const [loading, setLoading] = useState(false)
	const [data, setData] = useState({})

	const fetchData = async (id) => {
		setLoading(true)
		const res = await getProjectDetails(id)
		if (res.status === 404) return
		setData(res.data)
		setLoading(false)
	}

	useEffect(() => {
		if (project) fetchData(project)
	}, [project])

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

			<EventHeader title={data?.title} breadcrumbElements={breadcrumbElements} />
			<Stack px={2} mt={7}>
				<Calendar />
			</Stack>
		</div>
	)
}

export default ProjectImplementationSchedule
