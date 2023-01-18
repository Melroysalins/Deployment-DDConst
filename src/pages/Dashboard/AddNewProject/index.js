import '@mobiscroll/react/dist/css/mobiscroll.min.css'

import { styled } from '@mui/material/styles'
import { Datepicker } from '@mobiscroll/react'
import {
	Accordion as MuiAccordion,
	AccordionDetails as MuiAccordionDetails,
	AccordionSummary as MuiAccordionSummary,
	Stack,
} from '@mui/material'
import Iconify from 'components/Iconify'
import React from 'react'

import Contract from './Contract'
import ExecutionBudget from './ExcecutionBudget'
import Tasks from './Tasks/Tasks'

import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import 'ag-theme-ddconst.scss'

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({}))

const Accordion = styled((props) => <MuiAccordion disableGutters elevation={0} square {...props} />)(({ theme }) => ({
	background: 'transparent',
	border: '1px solid rgba(0, 0, 0, 0.1)',
	overflow: 'hidden',
	borderRadius: '8px',
	'&:not(:last-child)': {
		borderBottom: 0,
	},
	'&:before': {
		display: 'none',
	},
}))

const AccordionSummary = styled((props) => (
	<MuiAccordionSummary
		expandIcon={<Iconify icon="material-symbols:arrow-forward-ios-rounded" width={15} height={15} />}
		{...props}
	/>
))(({ theme }) => ({
	backgroundColor: theme.palette.background.paper,

	borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
	'& .Mui-expanded': {
		borderTopLeftRadius: '8px',
		borderTopRightRadius: '8px',
	},
}))

const AddNewProject = () => (
	<div>
		<Accordion>
			<AccordionSummary
				expandIcon={<Iconify icon="material-symbols:expand-more-rounded" width={20} height={20} />}
				aria-controls="panel1a-content"
				id="panel1a-header"
			>
				<Stack gap={2} direction="row" alignItems="center">
					<img style={{ height: 15 }} src="/static/images/contract.svg" alt="" />
					Contract / Project Information
				</Stack>
			</AccordionSummary>
			<AccordionDetails>
				<Contract />
			</AccordionDetails>
		</Accordion>
		<Accordion>
			<AccordionSummary
				expandIcon={<Iconify icon="material-symbols:expand-more-rounded" width={20} height={20} />}
				aria-controls="panel2a-content"
				id="panel2a-header"
			>
				<Stack gap={2} direction="row" alignItems="center">
					<Iconify sx={{ color: '#FF6B00' }} icon="tabler:clipboard-list" width={20} height={20} /> Tasks
				</Stack>
			</AccordionSummary>
			<AccordionDetails>
				{/* <Datepicker controls={['calendar']} select="range" touchUi={true} /> */}
				<Tasks />
			</AccordionDetails>
		</Accordion>
		<Accordion>
			<AccordionSummary
				expandIcon={<Iconify icon="material-symbols:expand-more-rounded" width={20} height={20} />}
				aria-controls="panel2a-content"
				id="panel2a-header"
			>
				<Stack gap={2} direction="row" alignItems="center">
					<Iconify sx={{ color: '#FF6B00' }} icon="heroicons-outline:calculator" width={20} height={20} /> Execution
					Budget
				</Stack>
			</AccordionSummary>
			<AccordionDetails sx={{ background: (theme) => theme.palette.background.default }}>
				{/* <Datepicker
					value={[new Date('20/01/2023'), new Date('25/01/2023')]}
					onChange={(e) => console.log(e)}
					controls={['calendar']}
					select="range"
				/> */}
				<ExecutionBudget />
			</AccordionDetails>
		</Accordion>
	</div>
)

export default AddNewProject
