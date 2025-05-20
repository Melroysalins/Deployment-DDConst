import { useState } from 'react'
import { Tabs, Tab, Stack, Box } from '@mui/material'
import Iconify from 'components/Iconify'
import PropTypes from 'prop-types'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import Contract from './Contract'
import ExecutionBudget from './ExcecutionBudget'
import Tasks from './Tasks/Tasks'
import FlowDiagram from 'pages/WeeklyPlan/FlowDiagram'
import { styled } from '@mui/material/styles'
import SpreadSheet2 from './Spreadsheet2'
import { useTranslation } from 'react-i18next'

const StyledBox = styled(Box)({
	padding: '0px',
})

const AddNewProject = ({ edit = false }) => {
	const [searchParams] = useSearchParams()
	const { pathname } = useLocation()
	const navigate = useNavigate()
	const { t } = useTranslation(['add_or_edit_project'])

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
		<Box
			border={1}
			borderColor={'lightgrey'}
			borderRadius={1}
			sx={{
				overflow: 'hidden',
				'@media (min-width: 1680px)': {
					marginLeft: '16px',
				},
				'@media (min-width: 1920px)': {
					marginLeft: '32px',
				},
			}}
		>
			<Tabs
				value={selectedTab}
				onChange={handleChange}
				variant="fullWidth"
				textColor="inherit"
				sx={{ bgcolor: 'white' }}
				TabIndicatorProps={{ hidden: true }}
			>
				<Tab
					value="1"
					label={
						<Stack gap={2} direction="row" alignItems="center" sx={{ fontFamily: 'manrope', fontWeight: 600 }}>
							{edit ? (
								<Iconify
									color={selectedTab === '1' ? '#FF6B00' : undefined}
									icon="ic:outline-design-services"
									width={20}
									height={20}
								/>
							) : (
								<img style={{ height: 15 }} src="/static/images/contract.svg" alt="" />
							)}
							{t('contract_or_project_information')}
						</Stack>
					}
					sx={{ borderRight: 1, borderColor: 'divider' }}
				/>
				<Tab
					value="2"
					label={
						<Stack gap={2} direction="row" alignItems="center" sx={{ fontFamily: 'manrope', fontWeight: 600 }}>
							<Iconify
								color={selectedTab === '2' ? '#FF6B00' : undefined}
								icon="tabler:clipboard-list"
								width={20}
								height={20}
							/>{' '}
							{t('diagram_builder')}
						</Stack>
					}
					disabled={!edit}
					sx={{ borderRight: 1, borderColor: 'divider' }}
				/>
				<Tab
					value="3"
					label={
						<Stack gap={2} direction="row" alignItems="center" sx={{ fontFamily: 'manrope', fontWeight: 600 }}>
							<Iconify
								color={selectedTab === '3' ? '#FF6B00' : undefined}
								icon="heroicons-outline:calculator"
								width={20}
								height={20}
							/>{' '}
							{t('tasks')}
						</Stack>
					}
					disabled={!edit}
					sx={{ borderRight: 1, borderColor: 'divider' }}
				/>
				<Tab
					value="4"
					label={
						<Stack gap={2} direction="row" alignItems="center" sx={{ fontFamily: 'manrope', fontWeight: 600 }}>
							<Iconify
								color={selectedTab === '4' ? '#FF6B00' : undefined}
								icon="raphael:diagram"
								width={20}
								height={20}
							/>{' '}
							{t('execution_budget')}
						</Stack>
					}
					disabled={!edit}
					sx={{ borderRight: 1, borderColor: 'divider' }}
				/>
				<Tab
					value="5"
					label={
						<Stack gap={2} direction="row" alignItems="center" sx={{ fontFamily: 'manrope', fontWeight: 600 }}>
							<Iconify
								color={selectedTab === '5' ? '#FF6B00' : undefined}
								icon="raphael:diagram"
								width={20}
								height={20}
							/>{' '}
							{t('spread_sheet')}
						</Stack>
					}
					disabled={!edit}
					sx={{ borderRight: 1, borderColor: 'divider' }}
				/>
			</Tabs>
			<Box
				sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', marginTop: '24px' }}
			>
				{selectedTab === '1' && (
					<StyledBox>
						<Contract edit={edit} />
					</StyledBox>
				)}
				{selectedTab === '2' && edit && (
					<StyledBox>
						<FlowDiagram isEditable={true} />
					</StyledBox>
				)}
				{selectedTab === '3' && edit && (
					<StyledBox>
						<Tasks isEditable={true} />
					</StyledBox>
				)}
				{selectedTab === '4' && edit && (
					<StyledBox>
						<ExecutionBudget />
					</StyledBox>
				)}
				{selectedTab === '5' && edit && (
					<StyledBox>
						<SpreadSheet2 />
					</StyledBox>
				)}
			</Box>
		</Box>
	)
}

AddNewProject.propTypes = {
	edit: PropTypes.bool,
}

export default AddNewProject
