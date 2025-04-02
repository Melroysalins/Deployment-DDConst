/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import '../../../../ag-theme-ddconst.scss' 

import { momentTimezone, setOptions } from '@mobiscroll/react'
import {
	Alert,
	Box,
	Button,
	MenuItem,
	Accordion as MuiAccordion,
	AccordionDetails as MuiAccordionDetails,
	AccordionSummary as MuiAccordionSummary,
	Select,
	Snackbar,
	Stack,
	Typography,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { AgGridReact } from 'ag-grid-react'
import Iconify from 'components/Iconify'
import moment from 'moment-timezone'
import PropTypes from 'prop-types'
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { useParams } from 'react-router'
import {
	createNewTasks,
	deleteTask,
	deleteTasks,
	listAllTeams,
	listFilteredTasks,
	updateTask,
	updateNestedTasks,
} from 'supabase'
import { createNewProjectDiagramTable, getTableByProjectDiagram, updateProjectDiagramTable } from 'supabase/project_diagrams_table'
import {
	createNewProjectDiagram,
	deleteDiagramById,
	getDiagramsByProject,
	updateProjectDiagram,
} from 'supabase/project_diagram'
import TimeRangeEditor from './TimeRangeEditor'
import useMain from 'pages/context/context'

setOptions({
	theme: 'ios',
	themeVariant: 'light',
})

momentTimezone.moment = moment

const Accordion = styled((props) => <MuiAccordion disableGutters elevation={0} square {...props} />)(({ theme }) => ({
	borderRadius: '8px',
	boxShadow: theme.customShadows.z1,
	background: 'transparent',
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
	borderLeft: `4px solid ${theme.palette.text.default}`,
	borderRadius: '8px',
	flexDirection: 'row-reverse',
	'& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
		transform: 'rotate(90deg)',
	},
	'&.Mui-expanded': {
		backgroundColor: 'transparent',
		borderLeft: 'none',
		borderRadius: '8px',
	},
	'& .MuiAccordionSummary-content': {
		marginLeft: theme.spacing(1),
	},
}))

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
	padding: theme.spacing(2),
}))

const Tasks = () => {
	const { id } = useParams()
	const { objs, setObjs } = useMain()
	const [ toast, setToast ] = useState(false)

	const getDiagram = useCallback(async () => {
		const { data } = await getDiagramsByProject(id);
		if (data?.length) {
			const updatedData = await Promise.all(
				data.map(async (diagram) => {
					const tableData1 = await getTableByProjectDiagram(diagram.id, false);
					const tableData2 = await getTableByProjectDiagram(diagram.id, true);

					// Set initial start time as current time
					const currentDate = new Date();
					const dayInMilliseconds = 24 * 60 * 60 * 1000; // One day in milliseconds
					const twoDaysInMilliseconds = 2 * dayInMilliseconds; // Two days in milliseconds

					const connections = tableData1.data.midpoints?.map((connection, i) => {
						// Calculate start and end dates for each connection with 2-day gaps
						const startDate = new Date(currentDate.getTime() + (i * twoDaysInMilliseconds));
						const endDate = new Date(startDate.getTime() + dayInMilliseconds);

						return {
							approval_status: connection.approval_status || null,
							created_at: connection.created_at || new Date().toISOString(),
							end: endDate.toISOString(),
							from_page: "projects",
							id: connection.id,
							notes: connection.notes || "",
							project: connection.project || id,
							start: startDate.toISOString(),
							task_group: connection.task_group || "Connection",
							task_group_id: connection.task_group_id || null,
							task_id: connection.task_id || null,
							task_period: [startDate.toISOString(), endDate.toISOString()],
							task_type: connection.task_type || null,
							team: connection.team || null,
							title: `#${connection.joinType + (i + 1)}` || ""
						};
					}) || [];

					// Updated installations to also use two-day gaps
					const installations = tableData1.data.installations?.map((installation, i) => {
						// Calculate start and end dates for each installation with 2-day gaps
						const startDate = new Date(currentDate.getTime() + (i * twoDaysInMilliseconds));
						const endDate = new Date(startDate.getTime() + dayInMilliseconds);

						return {
							approval_status: installation.approval_status || null,
							created_at: installation.created_at || new Date().toISOString(),
							end: endDate.toISOString(),
							from_page: "projects",
							id: installation.id,
							notes: installation.notes || "",
							project: installation.project || id,
							start: startDate.toISOString(),
							task_group: installation.task_group || "Installation",
							task_group_id: installation.task_group_id || null,
							task_id: installation.task_id || null,
							task_period: [startDate.toISOString(), endDate.toISOString()],
							task_type: installation.task_type || null,
							team: installation.team || null,
							title: i + 1 || ""
						};
					}) || [];

					return {
						...diagram,
						currentObj: {
							connections,
							installations,
							demolitions: tableData2.data?.midpoints || [],
							demolitionInstallations: tableData2.data?.installations || [],
							endpoints: tableData1.data?.endpoints || [],
							endpointsDemolition: tableData2.data?.endpoints || [],
						},
					};
				})
			);

			setObjs(updatedData);
		}
	}, [id, setObjs]);

	useEffect(() => {
		getDiagram()
	}, [id])

	useEffect(() => {
		console.log("objs con", objs?.[0]?.currentObj?.connections)
	}, [objs])

	return (
	<>
		<Stack gap={2}>
			<Accordion>
				<AccordionSummary aria-controls="metalFitting" id="metalFitting">
					<Typography variant="subtitle1" sx={{ color: 'text.default' }}>
						Metal Fittings Installation
					</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<Task task_group="Metal Fittings Installation" />
				</AccordionDetails>
			</Accordion>
			<Accordion>
				<AccordionSummary aria-controls="metalFitting" id="metalFitting">
					<Typography variant="subtitle1" sx={{ color: 'text.default' }}>
						Installation
					</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<Task task_group="Installation" rowData={objs?.[0]?.currentObj?.installations}  />
				</AccordionDetails>
			</Accordion>
			<Accordion>
				<AccordionSummary aria-controls="metalFitting" id="metalFitting">
					<Typography variant="subtitle1" sx={{ color: 'text.default' }}>
						Connection
					</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<Task 
						task_group="Connection" 
						rowData={objs?.[0]?.currentObj?.connections} 
					/>
				</AccordionDetails>
			</Accordion>
			<Accordion>
				<AccordionSummary aria-controls="metalFitting" id="metalFitting">
					<Typography variant="subtitle1" sx={{ color: 'text.default' }}>
						Completion Test (AC)
					</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<Task task_group="Completion Test (AC)" />
				</AccordionDetails>
			</Accordion>
		</Stack>
	</>
)}

const Task = ({ task_group, rowData }) => {
	const { id } = useParams()
	const { objs, setObjs } = useMain()
	const [toast, setToast] = useState(false)

	const handleClose = () => {
		setToast(null)
	}
	const gridRef = useRef()
	const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), [])
	const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), [])
	const [selectedRows, setSelectedRows] = useState([])

	const { data: teams } = useQuery(['Teams teams'], () => listAllTeams())

	const { refetch, data: list } = useQuery([`task ${task_group}`], () => listFilteredTasks(task_group, id), {
		select: (r) => r?.data.map((itm) => ({ ...itm, task_period: [itm.start, itm.end] })),
	})

	useEffect(() => {
		console.log("list", list)
	}, [list])

	useEffect(() => {
		console.log("row_data", rowData)
	}, [list])

	const DeleteCellRenderer = useCallback(({ value }) => {
		const handleDelete = () => {
			if (Array.isArray(value)) {
				deleteTasks(value).then(() => refetch())
			} else {
				deleteTask(value).then(() => refetch())
			}
		}

		return (
			<>
				<Button onClick={handleDelete}>
					<Iconify icon="material-symbols:delete-outline-rounded" width={20} height={20} />
				</Button>
			</>
		)
	})

	const TimeRangeRenderer = ({ value }) =>
		value && value[0] && value[1]
			? `${moment(value[0]).format('DD/MM/YYYY')} - ${moment(value[1]).format('DD/MM/YYYY')}`
			: '-'

	const TeamRenderer = ({ value }) => (value && teams ? teams?.data.find((team) => team.id === value)?.name : '-')

	DeleteCellRenderer.propTypes = {
		value: PropTypes.any,
	}

	const SelectCellEditor = forwardRef((props, ref) => {
		const createInitialState = () => {
			let startValue

			if (props.eventKey === KEY_BACKSPACE || props.eventKey === KEY_DELETE) {
				// if backspace or delete pressed, we clear the cell
				startValue = ''
			} else if (props.charPress) {
				// if a letter was pressed, we start with the letter
				startValue = props.charPress
			} else {
				// otherwise we start with the current value
				startValue = props.value
			}

			return {
				value: startValue,
			}
		}

		const initialState = createInitialState()
		const [value, setValue] = useState(initialState.value)
		const refInput = useRef(null)

		// focus on the input
		useEffect(() => {
			// get ref from React component
			window.setTimeout(() => {
				const eInput = refInput.current
				eInput.focus()
			})
		}, [])

		/* Utility Methods */
		const cancelBeforeStart = props.charPress && '1234567890'.indexOf(props.charPress) < 0

		const isLeftOrRight = (event) => ['ArrowLeft', 'ArrowRight'].indexOf(event.key) > -1

		const isCharNumeric = (charStr) => !!/\d/.test(charStr)

		const isKeyPressedNumeric = (event) => {
			const charStr = event.key
			return isCharNumeric(charStr)
		}

		const deleteOrBackspace = (event) => [KEY_DELETE, KEY_BACKSPACE].indexOf(event.key) > -1

		const finishedEditingPressed = (event) => {
			const { key } = event
			return key === KEY_ENTER || key === KEY_TAB
		}

		const onKeyDown = (event) => {
			if (isLeftOrRight(event) || deleteOrBackspace(event)) {
				event.stopPropagation()
				return
			}

			if (!finishedEditingPressed(event) && !isKeyPressedNumeric(event)) {
				if (event.preventDefault) event.preventDefault()
			}
		}

		/* Component Editor Lifecycle methods */
		useImperativeHandle(ref, () => ({
			// the final value to send to the grid, on completion of editing
			getValue() {
				return value
			},

			// Gets called once before editing starts, to give editor a chance to
			// cancel the editing before it even starts.
			isCancelBeforeStart() {
				return cancelBeforeStart
			},

			// Gets called once when editing is finished (eg if Enter is pressed).
			// If you return true, then the result of the edit will be ignored.
			isCancelAfterEnd() {
				// will reject the number if it greater than 1,000,000
				// not very practical, but demonstrates the method.
				return value > 1000000
			},
		}))

		return (
			<Select
				defaultOpen
				ref={refInput}
				labelId="demo-simple-select-helper-label"
				id="demo-simple-select-helper"
				value={value}
				label="Expense Type"
				onChange={(event) => setValue(event.target.value)}
				name="sub_type"
				fullWidth
				onKeyDown={(event) => onKeyDown(event)}
			>
				{teams?.data.map((team) => (
					<MenuItem value={team.id} key={team.id}>
						{team.name}
					</MenuItem>
				))}
			</Select>
		)
	})

	useEffect(() => {
		setSelectedRows(gridRef?.current?.api?.getSelectedRows().map(({ id }) => id) ?? [])
	}, [list])

	const AddButton = () => (
		<Button color="secondary" onClick={handleAdd}>
			<Iconify icon="material-symbols:add" width={20} height={20} />
		</Button>
	)
	const columnDefs = useMemo(
		() => [
			{
				headerName: 'Task Title',
				field: 'title',
				headerCheckboxSelection: true,
				checkboxSelection: (params) => !!params.data,
				showDisabledCheckboxes: true,
			},
			{
				headerName: 'Team',
				field: 'team',
				cellEditor: SelectCellEditor,
				cellRenderer: TeamRenderer,
			},
			{
				headerName: 'Task Period',
				field: 'task_period',
				cellEditor: TimeRangeEditor,
				cellRenderer: TimeRangeRenderer,
				cellClass: 'ag-grid-datepicker',
			},
			{
				headerName: 'Notes',
				field: 'notes',
			},
			{
				headerName: '',
				field: 'id',
				cellRenderer: DeleteCellRenderer,
				headerComponent: AddButton,
				cellStyle: { display: 'flex', justifyContent: 'flex-end' },
				headerClass: 'header',
				editable: false,
				maxWidth: 100,
			},
		],
		[AddButton, DeleteCellRenderer, SelectCellEditor, TeamRenderer]
	)
	const defaultColDef = useMemo(
		() => ({
			flex: 1,
			editable: true,
		}),
		[]
	)

	const handleAdd = () => {
		createNewTasks({ title: '', notes: '', task_group, project: id }).then(() => refetch())
	}

	const onCellEditRequest = (event) => {
		const {
			data,
			newValue,
			colDef: { field },
		} = event
		const newItem = { ...data }
		newItem[field] = newValue
		const { id } = newItem
		if (typeof id !== 'string') {
			if (newItem.task_period[0] && newItem.task_period[1]) {
				updateNestedTasks(newItem.task_period, newItem.id)
			}
			updateTask(
				{
					title: newItem.title,
					team: newItem.team,
					notes: newItem.notes,
					start: newItem.task_period ? newItem.task_period[0] : null,
					end: newItem.task_period ? newItem.task_period[1] : null,
				},
				newItem.id
			).then(() => refetch())
		}
	}

	return (
		<>
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
			<div style={containerStyle}>
				<div style={gridStyle} className="ag-theme-ddconst">
					<Stack gap={2}>
						<AgGridReact
							ref={gridRef}
							rowData={rowData}
							columnDefs={columnDefs}
							defaultColDef={defaultColDef}
							rowSelection={'multiple'}
							suppressRowClickSelection={true}
							domLayout="autoHeight"
							onCellEditRequest={onCellEditRequest}
							readOnlyEdit
							onRowSelected={() => {
								setSelectedRows(gridRef.current.api.getSelectedRows().map(({ id }) => id))
							}}
						/>
						<Box display="flex" justifyContent="space-between">
							<Button onClick={handleAdd}>Add Task</Button>
							{selectedRows.length > 0 && (
								<Box>
									{selectedRows.length} items selected:
									<DeleteCellRenderer value={selectedRows} />
								</Box>
							)}
						</Box>
					</Stack>
				</div>
			</div>
		</>
	)
}

Task.propTypes = {
	task_group: PropTypes.string.isRequired,
	rowData: PropTypes.array
}

export default Tasks

const KEY_BACKSPACE = 'Backspace'
const KEY_DELETE = 'Delete'
const KEY_ENTER = 'Enter'
const KEY_TAB = 'Tab'
