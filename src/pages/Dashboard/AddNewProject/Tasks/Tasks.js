/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

import { Button, MenuItem, Select } from '@mui/material'
import { AgGridReact } from 'ag-grid-react'
import Iconify from 'components/Iconify'
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import ReactDOM from 'react-dom'

const initialValues = {
	title: '',
	team: 'team',
	task_period: 'task_period',
	notes: 'Lorem ipsum dolor sit amet, consectetur',
}

const Tasks = () => {
	const gridRef = useRef()
	const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), [])
	const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), [])

	const DeleteCellRenderer = (params) => {
		console.log(params)

		const handleDelete = () => {
			setRowData((prev) => prev.filter((itm) => itm.id !== params.value))
		}

		return (
			<>
				<Button onClick={handleDelete}>
					<Iconify icon="material-symbols:delete-outline-rounded" width={20} height={20} />
				</Button>
			</>
		)
	}

	const [rowData, setRowData] = useState([
		{
			id: 2,
			title: 'task 1',
			team: 'Connection team 2',
			task_period: '12/01/2002',
			notes: 'NOTESSSS',
		},
	])
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
			headerName: 'Notes',
			field: 'id',
			cellRenderer: DeleteCellRenderer,
			headerComponent: AddButton,
			editable: false,
			maxWidth: 100,
		},
	])
	const defaultColDef = useMemo(
		() => ({
			flex: 1,
			minWidth: 100,
			editable: true,
		}),
		[]
	)

	const onGridReady = useCallback((params) => {
		// fetch('https://www.ag-grid.com/example-assets/small-olympic-winners.json')
		//   .then((resp) => resp.json())
		//   .then((data) => setRowData(data));
	}, [])

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
		const data = event.data
		const field = event.colDef.field
		const newValue = event.newValue
		const newItem = { ...data }
		newItem[field] = event.newValue
		console.log(`onCellEditRequest, updating ${field} to ${newValue}`)
		// rowImmutableStore = rowImmutableStore.map((oldItem) => (oldItem.id == newItem.id ? newItem : oldItem))
		setRowData((prev) => prev.map((oldItem) => (oldItem.id === newItem.id ? newItem : oldItem)))
	}

	return (
		<>
			<div style={containerStyle}>
				<div style={gridStyle} className=" ag-theme-ddconst">
					<AgGridReact
						ref={gridRef}
						rowData={rowData}
						columnDefs={columnDefs}
						defaultColDef={defaultColDef}
						rowSelection={'multiple'}
						suppressRowClickSelection={true}
						onGridReady={onGridReady}
						domLayout="autoHeight"
						onCellEditRequest={onCellEditRequest}
						readOnlyEdit
						//   onFirstDataRendered={onFirstDataRendered}
					/>
				</div>
			</div>
			<Button onClick={handleClick}>Add Task</Button>
		</>
	)
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

	const isLeftOrRight = (event) => {
		return ['ArrowLeft', 'ArrowRight'].indexOf(event.key) > -1
	}

	const isCharNumeric = (charStr) => {
		return !!/\d/.test(charStr)
	}

	const isKeyPressedNumeric = (event) => {
		const charStr = event.key
		return isCharNumeric(charStr)
	}

	const deleteOrBackspace = (event) => {
		return [KEY_DELETE, KEY_BACKSPACE].indexOf(event.key) > -1
	}

	const finishedEditingPressed = (event) => {
		const key = event.key
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
