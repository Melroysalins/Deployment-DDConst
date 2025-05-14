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
	ButtonBase,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	MenuItem,
	Accordion as MuiAccordion,
	AccordionDetails as MuiAccordionDetails,
	AccordionSummary as MuiAccordionSummary,
	Select,
	Snackbar,
	Stack,
	Typography,
	Button as MuiButton,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { AgGridReact } from 'ag-grid-react'
import Iconify from 'components/Iconify'
import moment from 'moment-timezone'
import PropTypes from 'prop-types'
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { useParams } from 'react-router'
import {
	createNewTasks,
	deleteTask,
	deleteTasks,
	listAllTeams,
	listFilteredTasks,
	updateTask,
	updateNestedTasks,
	listAllTaskGroups,
	updateProject,
} from 'supabase'
import { getSelectedWorkTypes } from 'supabase/projects'
import { getProjectDiagram } from 'supabase/project_diagram'
import TimeRangeEditor from './TimeRangeEditor'
import WorkType from './WorkType'
import WarningDialog from 'pages/WeeklyPlan/FlowDiagram/WarningDialog'
import FilterPopUp from 'components/FilterPopUp'

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
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
	},
}))

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
	padding: theme.spacing(2),
}))

const workTypeMap = {
	'Office Work': 5,
	'Metal Fittings Installation': 1,
	Installation: 2,
	Connection: 3,
	'Completion Testing': 4,
	'Auxiliary Construction': 6,
}

const Tasks = () => {
	const { id: projectId } = useParams()
	const [selectedWorkTypes, setSelectedWorkTypes] = useState([])
	const [tempSelectedWorkTypes, setTempSelectedWorkTypes] = useState([])
	const [showSelectedWorkTypes, setShowSelectedWorkTypes] = useState(false) // State to control display
	const [isFilterOpen, SetIsFilterOpen] = useState(false)
	const [cableTypeData, SetCableTypeData] = useState([])
	const [isFilteredApplied, SetIsFilterApplied] = useState(false)
	const [activeTaskID, SetActiveTaskID] = useState(null)
	const queryClient = useQueryClient()
	const [filters, SetFilters] = useState({
		diagramName: '',
		lines: '',
		demolition: '',
		diagramId: '',
	})
	const { data: selectedWorkTypesData, isLoading: isLoadingWorkTypes } = useQuery(
		['selectedWorkTypes', projectId],
		() => getSelectedWorkTypes(projectId),
		{
			select: (data) => {
				console.log('mydata', projectId)
				return data?.selectedWorkTypes || [] // Return the selectedWorkTypes array or an empty array
			},
		}
	)

	console.log('selectedWorkTypes', selectedWorkTypesData)

	// Update the state with existing and new work type IDs
	const handleWorkTypeChange = (newWorkTypeId) => {
		setTempSelectedWorkTypes(newWorkTypeId)
	}

	// Function to save selected work types to the database
	const handleApply = async () => {
		// const updatedData = { selectedWorkTypes } // Prepare the data to be updated
		// await updateProject(updatedData, projectId) // Call the update function
		// setShowSelectedWorkTypes(true)
		// console.log('Work types updated:', selectedWorkTypes)
		// // Show selected work types after saving
		// setSelectedWorkTypes(tempSelectedWorkTypes)

		const updatedData = { selectedWorkTypes: tempSelectedWorkTypes } // Use temp state for update
		await updateProject(updatedData, projectId) // Save to DB

		setSelectedWorkTypes(tempSelectedWorkTypes) // Update local state
		setShowSelectedWorkTypes(true)

		await queryClient.invalidateQueries(['selectedWorkTypes', projectId]) // ✅ Refetch fresh data from DB

		console.log('Work types updated:', tempSelectedWorkTypes)
	}

	const handleopenFilter = (id) => {
		if (activeTaskID !== id) {
			SetFilters({
				diagramName: '',
				lines: '',
				demolition: '',
				diagramId: '',
			})
			SetActiveTaskID(id)
		} else {
			SetActiveTaskID(id)
		}
		console.log('Yes Clicked', id)
		SetIsFilterOpen(true)
	}

	const handleApplyFilters = (filters) => {
		SetIsFilterApplied(true)
		console.log('AppliedFilters', filters, activeTaskID)
	}

	const handleChange = (field, value) => {
		SetIsFilterApplied(false)

		if (field === 'diagramName') {
			SetFilters((prev) => ({ ...prev, [field]: value }))
		} else {
			SetFilters((prev) => ({ ...prev, [field]: value }))
		}
		console.log('value', value, filters)
	}

	useEffect(() => {
		if (selectedWorkTypesData?.length > 0) {
			setTempSelectedWorkTypes(selectedWorkTypesData)
			setSelectedWorkTypes(selectedWorkTypesData)
			setShowSelectedWorkTypes(true) // Automatically show Accordion if data is present
		}
	}, [selectedWorkTypesData])

	if (isLoadingWorkTypes) return <div>Loading ...</div>
	return (
		<>
			<Stack gap={2} mb={1}>
				<WorkType
					checkedItems={tempSelectedWorkTypes}
					setCheckedItems={handleWorkTypeChange}
					selectedWorkTypesData={selectedWorkTypesData}
				/>
				<Button onClick={handleApply} variant="contained" color="primary" sx={{ width: '40px', ml: 2 }}>
					Apply
				</Button>
			</Stack>
			{showSelectedWorkTypes && (
				<Stack gap={2} mt={2}>
					{selectedWorkTypes?.map((workType, index) => (
						<Accordion key={index}>
							<AccordionSummary aria-controls="metalFitting" id="metalFitting">
								<Typography variant="subtitle1" sx={{ color: 'text.default' }}>
									{workType} {/* Display the work type name */}
								</Typography>

								{(workTypeMap[workType] === 2 || workTypeMap[workType] === 3) && (
									<MuiButton
										size="small"
										variant="contained"
										sx={{ padding: 0.5, minWidth: 0, width: 30 }}
										onClick={(e) => {
											e.stopPropagation() // Stop Accordion behv(open or close) on click on button
											handleopenFilter(workTypeMap[workType])
											// SetActiveTaskID(workTypeMap[workType])
										}}
									>
										<Iconify icon="heroicons-funnel" width={20} height={20} />
									</MuiButton>
								)}
								{isFilterOpen && (
									<FilterPopUp
										open={isFilterOpen}
										onClose={() => SetIsFilterOpen(false)}
										onApplyFilters={handleApplyFilters}
										cableTypeData={cableTypeData}
										handleChange={handleChange}
										filters={filters}
										SetFilters={SetFilters}
									/>
								)}
							</AccordionSummary>
							<AccordionDetails>
								<Task
									task_group={workType}
									task_group_id={workTypeMap[workType]}
									SetCableTypeData={SetCableTypeData}
									cableTypeData={cableTypeData}
									activeTaskID={activeTaskID}
									filters={filters}
									isFilteredApplied={isFilteredApplied}
								/>
								{console.log('my', workTypeMap[workType])}
							</AccordionDetails>
						</Accordion>
					))}
				</Stack>
			)}
		</>
	)
}

const Task = ({
	task_group,
	task_group_id,
	cableTypeData,
	SetCableTypeData,
	activeTaskID,
	filters,
	isFilteredApplied,
}) => {
	const { id } = useParams()
	const [diagrams, setDiagrams] = useState({}) // State to hold diagram data
	const [toast, setToast] = useState(false)

	const handleClose = () => {
		setToast(null)
	}
	const gridRef = useRef()
	const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), [])
	const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), [])
	const [selectedRows, setSelectedRows] = useState([])

	const { data: teams } = useQuery(['Teams teams'], () => listAllTeams())
	// first we need to find the task_group_id
	const { refetch, data: list } = useQuery([`task-${task_group}`], () => listFilteredTasks(task_group_id, id), {
		select: (r) => {
			const unfilteredList = r?.data.map((itm) => ({
				...itm,
				task_period: [itm.start_date, itm.end_date],
			}))

			// If no filtering is applied, return the unfiltered list
			if (!isFilteredApplied) {
				console.log('list', unfilteredList)
				return unfilteredList
			}

			// TL values to check against
			const tlValues = ['1T/L', '2T/L', '3T/L', '4T/L']

			return unfilteredList
				.map((item) => {
					// Check if the current task group is the one being filtered
					const isTargetTaskGroup = item.task_group_id === activeTaskID

					// If the current item belongs to the filtered task group, apply the filter logic
					if (isTargetTaskGroup) {
						const matchesLines = filters.lines.trim() === '' || item?.title?.includes(filters?.lines)

						const matchesDiagram = !filters.diagramName?.id || item.project_diagram_id === filters.diagramName.id

						const matchesDemolition =
							filters.demolition.trim() === '' || String(item.isDemolition) === filters.demolition

						// Apply filter logic and return the item if it matches
						return matchesLines && matchesDiagram && matchesDemolition ? item : null
					}

					// If the current item does not belong to the filtered task group, return it as-is
					return item
				})
				.filter(Boolean) // Remove any null values
		},
	})

	// Fetch all diagram data based on unique diagram IDs from tasks
	useEffect(() => {
		if (list) {
			const uniqueDiagramIds = [...new Set(list.map((task) => task.project_diagram_id).filter((id) => id))] // Collect unique IDs
			if (uniqueDiagramIds.length > 0) {
				const diagramMap = {}
				const fetchDiagrams = async () => {
					const diagramPromises = uniqueDiagramIds.map((diagramId) =>
						getProjectDiagram(diagramId)
							.then((res) => {
								console.log('cable', res)

								const cableTypeString = `${res.data.cable_name.bigInput}KV ${res.data.cable_name.startLocation}-${res.data.cable_name.endLocation}`
								const cableId = res.data.id

								SetCableTypeData((prev) => {
									const existingTypes = prev ? [...prev] : []

									// Check if the cableId already exists to avoid duplicates
									const isExisting = existingTypes.some((item) => item.id === cableId)

									if (!isExisting) {
										existingTypes.push({
											id: cableId,
											cableName: cableTypeString,
										})
									}

									return existingTypes
								})

								if (res.data && res.data.id) {
									diagramMap[
										res.data.id
									] = `${res.data.cable_name.bigInput}KV ${res.data.cable_name.startLocation}-${res.data.cable_name.endLocation}` // Assuming it has id and name
								} else {
									console.error('Unexpected response format for diagram ID:', diagramId, res.data)
								}
							})
							.catch((error) => {
								console.error('Error fetching diagram for ID:', diagramId, error)
							})
					)

					// Wait for all promises to resolve
					await Promise.all(diagramPromises)
					setDiagrams(diagramMap) // Set the state after all diagrams are fetched
				}
				fetchDiagrams()
			}
		}
	}, [list])

	const DiagramRenderer = ({ value }) => {
		if (!value || !diagrams[value]) return '-'
		return diagrams[value] // Return the diagram name
	}

	const DeleteCellRenderer = ({ value, task_group_id, gridRef }) => {
		const [openPopup, setOpenPopup] = useState(false)

		const isRestricted = task_group_id === 2 || task_group_id === 3

		const handleDelete = (event) => {
			if (isRestricted) {
				setOpenPopup(true) // Open the popup if the task group is restricted
				return // Exit early
			}

			// Now handle the case when the task is not restricted
			if (Array.isArray(value)) {
				deleteTasks(value).then(() => refetch())
			} else {
				deleteTask(value).then(() => refetch())
			}
		}

		// Close the popup
		const handleClosePopup = () => {
			setOpenPopup(false)

			// Deselect restricted rows
			if (gridRef?.current?.api) {
				const selectedNodes = gridRef.current.api.getSelectedNodes()
				selectedNodes.forEach((node) => {
					if (node.data.task_group_id === 2 || node.data.task_group_id === 3) {
						node.setSelected(false)
					}
				})
			}
		}

		return (
			<>
				<Button onClick={handleDelete}>
					<Iconify icon="material-symbols:delete-outline-rounded" width={20} height={20} />
				</Button>
				<WarningDialog
					isOpen={openPopup}
					onClose={handleClosePopup}
					title="Action Not Allowed"
					dialogHeading="Restricted Task Deletion"
					description="You can only delete Installation and Connection tasks from the Diagram Builder page."
					actionType="info"
					buttons={[
						{
							label: 'Cancel',
							onClick: handleClosePopup,
						},
						{
							label: 'Got It',
							onClick: handleClosePopup,
						},
					]}
				/>
			</>
		)
	}
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

	const customSortComparator = (a, b) => {
		const getOrderValue = (title) => {
			const isNamyang = title.includes('Namyang')
			const isYeonsu = title.includes('Yeonsu')

			const matchTL = title.match(/(\d+)T\/L/)
			const tlValue = matchTL ? parseInt(matchTL[1], 10) : 0

			return { isNamyang, isYeonsu, tlValue, title }
		}

		const sortedData = (data) => {
			const namyangItems = data
				.filter((item) => item.includes('Namyang'))
				.sort((a, b) => getOrderValue(a).tlValue - getOrderValue(b).tlValue)

			const midpoints = data.filter((item) => !item.includes('Namyang'))

			const sortedMidpoints = midpoints.sort((a, b) => {
				const aOrder = getOrderValue(a)
				const bOrder = getOrderValue(b)

				if (aOrder.tlValue !== bOrder.tlValue) {
					return aOrder.tlValue - bOrder.tlValue
				}

				if (aOrder.isYeonsu && !bOrder.isYeonsu) return 1
				if (!aOrder.isYeonsu && bOrder.isYeonsu) return -1

				return aOrder.title.localeCompare(bOrder.title)
			})

			const topNamyang = namyangItems.slice(0, 3)
			const bottomNamyang = namyangItems.slice(-3)

			return [...topNamyang, ...sortedMidpoints, ...bottomNamyang]
		}

		const sortedArray = sortedData([a, b])
		return sortedArray.indexOf(a) - sortedArray.indexOf(b)
	}

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
				sortable: true,
				comparator: customSortComparator,
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
				headerName: 'Is Demolition',
				field: 'isDemolition',
				cellRenderer: (params) => (params.value ? 'Yes' : 'No'),
				sortable: true,
				sort: 'asc',
			},
			{
				headerName: 'Diagram Name',
				field: 'project_diagram_id', // Assuming this is the field for diagram ID
				cellRenderer: DiagramRenderer, // Use the new renderer
				sortable: true,
				sort: 'asc',
			},
		],
		[AddButton, DeleteCellRenderer, SelectCellEditor, TeamRenderer, DiagramRenderer]
	)
	const defaultColDef = useMemo(
		() => ({
			flex: 1,
			editable: true,
		}),
		[]
	)

	const handleAdd = () => {
		createNewTasks({ title: '', notes: '', task_group_id, project: id }).then(() => refetch())
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
			// if (newItem.task_period[0] && newItem.task_period[1]) {
			// 	updateNestedTasks(newItem.task_period, newItem.id)
			// }
			console.log('newItem', newItem)
			updateTask(
				{
					title: newItem.title,
					team: newItem.team,
					notes: newItem.notes,
					start_date: newItem.task_period ? newItem.task_period[0] : null,
					end_date: newItem.task_period ? newItem.task_period[1] : null,
				},
				newItem.id
			)
				.then(() => refetch())
				.catch((error) => {
					console.error('Error updating task:', error)
					setToast({
						severity: 'error',
						message: 'Failed to update task. Please try again.',
					})
				})
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
							rowData={list}
							columnDefs={columnDefs}
							defaultColDef={defaultColDef}
							rowSelection={'multiple'}
							suppressRowClickSelection={true}
							domLayout="autoHeight"
							onCellEditRequest={onCellEditRequest}
							getRowId={(params) => params.data.id}
							readOnlyEdit
							onRowSelected={() => {
								setSelectedRows(gridRef.current.api.getSelectedRows().map(({ id }) => id))
							}}
							//   onFirstDataRendered={onFirstDataRendered}
						/>
						{/* {console.log('list', list)} */}
						<Box display="flex" justifyContent="space-between">
							<Button onClick={handleAdd}>Add Task</Button>
							{selectedRows.length > 0 && (
								<Box>
									{selectedRows.length} items selected:
									<DeleteCellRenderer value={selectedRows} task_group_id={task_group_id} gridRef={gridRef} />
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
	task_group_id: PropTypes.string.isRequired,
}

export default Tasks

const KEY_BACKSPACE = 'Backspace'
const KEY_DELETE = 'Delete'
const KEY_ENTER = 'Enter'
const KEY_TAB = 'Tab'
