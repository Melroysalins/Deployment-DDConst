import { useState } from 'react'
import { Tabs, Tab, Stack, Box } from '@mui/material'
import Iconify from 'components/Iconify'
import PropTypes from 'prop-types'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import Contract from './Contract'
import ExecutionBudget from './ExcecutionBudget'
import Tasks from './Tasks/Tasks'
import FlowDiagram from 'pages/WeeklyPlan/FlowDiagram'
import FlowDiagram2 from 'pages/WeeklyPlan/FlowDiagram2'
import { styled } from '@mui/material/styles'

const StyledBox = styled(Box)({
	padding: '8px 16px 16px',
})

const AddNewProject = ({ edit = false }) => {
	const [searchParams] = useSearchParams()
	const { pathname } = useLocation() 
	const navigate = useNavigate()

	const tab = searchParams.get('tab')
	const [selectedTab, setSelectedTab] = useState(tab || '1')

	const handleChange = (event, newTab) => {
		setSelectedTab(newTab)
		navigate({
			pathname,
			search: newTab !== '1' ? `?tab=${newTab}` : '',
		})
	}

	return (
		<Box border={1} borderColor={'lightgrey'} borderRadius={1} sx={{ overflow: "hidden"}}>
			<Tabs
				value={selectedTab}
				onChange={handleChange}
				variant="fullWidth"
				textColor='inherit'
				sx={{ bgcolor: 'white'}}
				TabIndicatorProps={{ hidden: true }}
				
			>
				<Tab
					value="1"
					label={
						<Stack gap={2} direction="row" alignItems="center" sx={{ fontFamily: 'manrope', fontWeight: 600 }}>
							{edit ? (
								<Iconify color={selectedTab === '1' ? "#FF6B00" : undefined} icon="ic:outline-design-services" width={20} height={20} />
							) : (
								<img style={{ height: 15 }} src="/static/images/contract.svg" alt="" />
							)}
							Contract / Project Information
						</Stack>
					}
					sx={{  borderRight: 1, borderColor: 'divider' }}
				/>
				<Tab
					value="2"
					label={
						<Stack gap={2} direction="row" alignItems="center" sx={{ fontFamily: 'manrope', fontWeight: 600 }}>
							<Iconify color={selectedTab === '2' ? '#FF6B00' : undefined} icon="tabler:clipboard-list" width={20} height={20} /> Tasks
						</Stack>
					}
					disabled={!edit}
					sx={{  borderRight: 1, borderColor: 'divider' }}
				/>
				<Tab
					value="3"
					label={
						<Stack gap={2} direction="row" alignItems="center" sx={{ fontFamily: 'manrope', fontWeight: 600 }}>
							<Iconify color={selectedTab === '3' ? '#FF6B00' : undefined} icon="heroicons-outline:calculator" width={20} height={20} /> Execution Budget
						</Stack>
					}
					disabled={!edit}
					sx={{  borderRight: 1, borderColor: 'divider' }}
				/>
				<Tab
					value="4"
					label={
						<Stack gap={2} direction="row" alignItems="center" sx={{ fontFamily: 'manrope', fontWeight: 600 }}>
							<Iconify color={selectedTab === '4' ? '#FF6B00' : undefined} icon="raphael:diagram" width={20} height={20} /> Diagram Builder
						</Stack>
					}
					disabled={!edit}
					sx={{  borderRight: 1, borderColor: 'divider' }}
				/>
				<Tab
					value="5"
					label={
						<Stack gap={2} direction="row" alignItems="center" sx={{ fontFamily: 'manrope', fontWeight: 600 }}>
							<Iconify color={selectedTab === '5' ? '#FF6B00' : undefined} icon="raphael:diagram" width={20} height={20} /> Old Diagram Builder
						</Stack>
					}
					disabled={!edit}
					sx={{  borderRight: 1, borderColor: 'divider' }}
				/>
			</Tabs>
			<Box>
				{selectedTab === '1' && (<StyledBox ><Contract edit={edit} /></StyledBox>)}
				{selectedTab === '2' && edit && (<StyledBox ><Tasks /></StyledBox>)}
				{selectedTab === '3' && edit && (<StyledBox ><ExecutionBudget /></StyledBox>)}
				{selectedTab === '4' && edit && (<StyledBox ><FlowDiagram isEditable={true} /></StyledBox>)}
				{selectedTab === '5' && edit && (<StyledBox ><FlowDiagram2 isEditable={true} /></StyledBox>)}
			</Box>
		</Box>
	)
}

AddNewProject.propTypes = {
	edit: PropTypes.bool,
}

export default AddNewProject
