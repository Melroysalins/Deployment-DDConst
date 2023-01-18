/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { styled } from '@mui/material/styles'

import {
	Accordion as MuiAccordion,
	AccordionDetails as MuiAccordionDetails,
	AccordionSummary as MuiAccordionSummary,
	Box,
	Button,
	MenuItem,
	Select,
	Stack,
	Typography,
	CircularProgress,
} from '@mui/material'
import { AgGridReact } from 'ag-grid-react'
import Iconify from 'components/Iconify'
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'

const initialValues = {
	title: '',
	team: '',
	task_period: '',
	notes: '',
}

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
	const [metalFitting, setMetalFitting] = useState([])
	const [installation, setInstallation] = useState([])
	const [connection, setConnection] = useState([])
	const [completionTest, setCompletionTest] = useState([])
	const [loader, setLoader] = useState(false)

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
						<Task rowData={metalFitting} setRowData={setMetalFitting} />
					</AccordionDetails>
				</Accordion>
				<Accordion>
					<AccordionSummary aria-controls="metalFitting" id="metalFitting">
						<Typography variant="subtitle1" sx={{ color: 'text.default' }}>
							Installation
						</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Task rowData={installation} setRowData={setInstallation} />
					</AccordionDetails>
				</Accordion>
				<Accordion>
					<AccordionSummary aria-controls="metalFitting" id="metalFitting">
						<Typography variant="subtitle1" sx={{ color: 'text.default' }}>
							Connection
						</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Task rowData={connection} setRowData={setConnection} />
					</AccordionDetails>
				</Accordion>
				<Accordion>
					<AccordionSummary aria-controls="metalFitting" id="metalFitting">
						<Typography variant="subtitle1" sx={{ color: 'text.default' }}>
							Completion Test (AC)
						</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Task rowData={completionTest} setRowData={setCompletionTest} />
					</AccordionDetails>
				</Accordion>
				<Button fullWidth={false} variant="contained" color="secondary" type="submit" disabled={loader}>
					{loader ? <CircularProgress size={17} fontSize="inherit" /> : 'Submit'}
				</Button>
			</Stack>
		</>
	)
}

const Task = ({ rowData, setRowData }) => {
	const gridRef = useRef()
	const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), [])
	const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), [])
	const [selectedRows, setSelectedRows] = useState([])

	// DELETE CELL BUTTON

	const DeleteCellRenderer = ({ value }) => {
		const handleDelete = () => {
			console.log(value)
			if (Array.isArray(value)) {
				setRowData((prev) => {
					const res = prev.filter(({ id }) => !value.includes(id))
					console.log(prev, res)
					return res
				})
			} else {
				setRowData((prev) => prev.filter((itm) => itm.id !== value))
			}
		}

		return (
			<>
				<Button onClick={handleDelete}>
					<Iconify icon="material-symbols:delete-outline-rounded" width={20} height={20} />
				</Button>
			</>
		)
	}

	DeleteCellRenderer.propTypes = {
		value: PropTypes.any,
	}

	useEffect(() => {
		setSelectedRows(gridRef?.current?.api?.getSelectedRows().map(({ id }) => id) ?? [])
	}, [rowData])

	const AddButton = () => (
		<Button color="secondary" onClick={handleClick}>
			<Iconify icon="material-symbols:add" width={20} height={20} />
		</Button>
	)
	const [columnDefs, setColumnDefs] = useState([
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
		},
		{
			headerName: 'Task Period',
			field: 'task_period',
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
			cellStyle: { display: 'flex', 'justify-content': 'flex-end' },
			headerClass: 'header',
			editable: false,
			maxWidth: 100,
		},
	])
	const defaultColDef = useMemo(
		() => ({
			flex: 1,
			editable: true,
		}),
		[]
	)

	// const onGridReady = useCallback((params) => {
	// 	fetch('https://www.ag-grid.com/example-assets/small-olympic-winners.json')
	// 	  .then((resp) => resp.json())
	// 	  .then((data) => setRowData(data));
	// }, [])

	//   const onFirstDataRendered = useCallback((params) => {
	//     gridRef.current.api.forEachNode((node) =>
	//       node.setSelected(!!node.data && node.data.year !== 2012)
	//     );
	//   }, []);

	const handleClick = (event) => {
		setRowData((prev) => [
			...prev,
			{
				id: new Date().getTime(),
				...initialValues,
			},
		])
	}

	const onCellEditRequest = (event) => {
		const {
			data,
			newValue,
			colDef: { field },
		} = event
		const newItem = { ...data }
		newItem[field] = newValue
		setRowData((prev) => prev.map((oldItem) => (oldItem.id === newItem.id ? newItem : oldItem)))
	}

	return (
		<>
			<div style={containerStyle}>
				<div style={gridStyle} className=" ag-theme-ddconst">
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
							//   onFirstDataRendered={onFirstDataRendered}
						/>
						<Box display="flex" justifyContent="space-between">
							<Button onClick={handleClick}>Add Task</Button>
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
	rowData: PropTypes.array.isRequired,
	setRowData: PropTypes.func.isRequired,
}

export default Tasks

const KEY_BACKSPACE = 'Backspace'
const KEY_DELETE = 'Delete'
const KEY_ENTER = 'Enter'
const KEY_TAB = 'Tab'

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
		console.log(event)
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
			<MenuItem value="Installation team">Installation team</MenuItem>
			<MenuItem value="Connection team 1">Connection team 1</MenuItem>
			<MenuItem value="Connection team 2">Connection team 2</MenuItem>
		</Select>
	)
})
