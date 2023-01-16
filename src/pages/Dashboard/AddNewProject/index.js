import '@mobiscroll/react/dist/css/mobiscroll.min.css'

import { Datepicker } from '@mobiscroll/react'
import { Accordion, AccordionDetails, AccordionSummary, Stack } from '@mui/material'
import Iconify from 'components/Iconify'
import React from 'react'

import Contract from './Contract'
import ExecutionBudget from './ExcecutionBudget'
import Tasks from './Tasks/Tasks'

import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import 'ag-theme-ddconst.scss'

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
				<Datepicker controls={['calendar']} select="range" touchUi={true} />
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
