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
import moment, { duration } from 'moment-timezone'
import PropTypes from 'prop-types'
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
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
	listTaskThatHasSubTasks,
} from 'supabase'
import { getSelectedWorkTypes } from 'supabase/projects'
import { getProjectDiagram } from 'supabase/project_diagram'
import TimeRangeEditor from './TimeRangeEditor'
import WorkType from './WorkType'
import WarningDialog from 'pages/WeeklyPlan/FlowDiagram/WarningDialog'
import FilterPopUp from 'components/FilterPopUp'
import TaskPopUp from './TaskPopUp'

// This disables the ResizeObserver error from appearing in the red React error overlay
const resizeObserver = new ResizeObserver((entries) => {
	window.requestAnimationFrame(() => {})
})

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

	const [isSubTaskCreated, SetIsSubTaskCreated] = useState(false)

	const { data: selectedWorkTypesData, isLoading: isLoadingWorkTypes } = useQuery(
		['selectedWorkTypes', projectId],
		() => getSelectedWorkTypes(projectId),
		{
			select: (data) => {
				console.log('mydata', projectId, data)
				return data?.selectedWorkTypes || [] // Return the selectedWorkTypes array or an empty array
			},
		}
	)

	// Update the state with existing and new work type IDs
	const handleWorkTypeChange = (newWorkTypeId) => {
		setTempSelectedWorkTypes(newWorkTypeId)
	}

	// Function to save selected work types to the database
	const handleApply = async () => {
		const updatedData = { selectedWorkTypes: tempSelectedWorkTypes }
		await updateProject(updatedData, projectId)

		setSelectedWorkTypes(tempSelectedWorkTypes)
		setShowSelectedWorkTypes(true)

		await queryClient.invalidateQueries(['selectedWorkTypes', projectId])

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

	const handleonClearFilter = () => {
		SetFilters({
			diagramName: '',
			lines: '',
			demolition: '',
			diagramId: '',
		})
	}

	useEffect(() => {
		if (selectedWorkTypesData?.length > 0) {
			setTempSelectedWorkTypes(selectedWorkTypesData)
			setSelectedWorkTypes(selectedWorkTypesData)
			setShowSelectedWorkTypes(true) // Automatically show Accordion if data is present
		}
	}, [selectedWorkTypesData])

	console.log('isLoadingWorkTypes', projectId, isLoadingWorkTypes, selectedWorkTypes)

	// ... (Your useQueries, useMemos, useCallbacks, etc.)

	// DO NOT put the conditional return here anymore
	// if (isLoadingWorkTypes) return <div>Loading ...</div> // <-- REMOVE THIS LINE

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
			{/* Create a relative container for the Accordion Stack to allow for absolute positioning of overlay */}
			<div style={{ position: 'relative' }}>
				{showSelectedWorkTypes && (
					<Stack gap={2} mt={2}>
						{selectedWorkTypes?.map((workType, index) => (
							<Accordion key={index} defaultExpanded>
								<AccordionSummary aria-controls="metalFitting" id="metalFitting">
									<Typography variant="subtitle1" sx={{ color: 'text.default' }}>
										{workType}
									</Typography>

									{(workTypeMap[workType] === 2 || workTypeMap[workType] === 3) && (
										<MuiButton
											size="small"
											variant="contained"
											sx={{ padding: 0.5, minWidth: 0, width: 30 }}
											onClick={(e) => {
												e.stopPropagation()
												handleopenFilter(workTypeMap[workType])
											}}
										>
											<Iconify icon="heroicons-funnel" width={20} height={20} />
										</MuiButton>
									)}
									{isFilterOpen && (
										<FilterPopUp
											open={isFilterOpen}
											onClose={() => {
												SetIsFilterOpen(false)
											}}
											onClearFilter={handleonClearFilter}
											onApplyFilters={handleApplyFilters}
											cableTypeData={cableTypeData}
											handleChange={handleChange}
											filters={filters}
											SetFilters={SetFilters}
										/>
									)}
								</AccordionSummary>
								<AccordionDetails>
									{/* This is where your Task (AgGridReact) component lives */}
									<Task
										task_group={workType}
										task_group_id={String(workTypeMap[workType])}
										SetCableTypeData={SetCableTypeData}
										cableTypeData={cableTypeData}
										activeTaskID={activeTaskID}
										filters={filters}
										isFilteredApplied={isFilteredApplied}
										SetIsSubTaskCreated={SetIsSubTaskCreated}
										isSubTaskCreated={isSubTaskCreated}
									/>
								</AccordionDetails>
							</Accordion>
						))}
					</Stack>
				)}

				{/* This is the loading overlay. It renders ON TOP of your content, not in place of it. */}
				{isLoadingWorkTypes && (
					<div
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							width: '100%',
							height: '100%',
							backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent white
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							zIndex: 1000, // Make sure it's on top of other content
							pointerEvents: 'none', // Allow clicks to pass through to the grid (if desired)
							// Or 'auto' if you want to block interaction
						}}
					>
						<div>Loading Work Types...</div>
					</div>
				)}
			</div>{' '}
		</>
	)
}

const Task = React.memo(
	({
		task_group,
		task_group_id,
		cableTypeData,
		SetCableTypeData,
		activeTaskID,
		filters,
		isFilteredApplied,
		isSubTaskCreated,
		SetIsSubTaskCreated,
	}) => {
		const { id } = useParams()
		const [diagrams, setDiagrams] = useState({}) // State to hold diagram data
		const [toast, setToast] = useState(false)
		const [List, SetList] = useState([])

		const handleClose = () => {
			setToast(null)
		}
		const gridRef = useRef()
		const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), [])
		const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), [])
		const [selectedRows, setSelectedRows] = useState([])
		const [subTasksData, SetSubTasksData] = useState([])
		const [taskID, SetTaskID] = useState('')
		const [isSubTaskOpen, SetIsSubTaskOpen] = useState(false)
		const [openSubTasks, SetOpenSubTaks] = useState(false)
		const [isSubTask, SetIsSubTask] = useState(false)

		const [parenTaskId, SetParentTaskID] = useState([])

		const myQueryClient = useQueryClient()

		const { data: allParentTasks } = useQuery(['project_tasks'], () => listTaskThatHasSubTasks(id))

		const { data: teams } = useQuery(['Teams teams'], () => listAllTeams())
		// first we need to find the task_group_id
		const { refetch, data: list } = useQuery([`task-${task_group}`], () => listFilteredTasks(task_group_id, id), {
			select: (r) => {
				const unfilteredList = r?.data
					?.filter((item) => item?.parent_task === null)
					?.map((ele) => ({
						...ele,
						task_period: [ele.start_date, ele?.end_date],
					}))

				if (!isFilteredApplied) {
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

		// code to fetch subTask For Selected Task on Click Of  View/Edit

		const { data: fullResponse, refetch: refetchFull } = useQuery(
			[`raw-task-${task_group}`],
			() => listFilteredTasks(task_group_id, id),
			{
				select: (res) => {
					const entireTaskData = res?.data?.map((ele) => ({
						...ele,
						task_period: [ele.start_date, ele?.end_date],
					}))

					return entireTaskData
				},
			}
		)

		console.log('allParentTasks', allParentTasks)

		const fetchSubTasks = useCallback(
			(id, data) => {
				const filteredSubTaskData = data?.filter((item) => item?.parent_task === id)
				console.log('Melroy', id, filteredSubTaskData)
				SetSubTasksData(filteredSubTaskData)
				SetIsSubTaskOpen(true)
				console.log('fulldata', data)
			},
			[taskID]
		)

		const existingSubTasks = fullResponse?.filter((task) => task?.parent_task === taskID)

		// Fetch all diagram data based on unique diagram IDs from tasks
		useEffect(() => {
			if (list) {
				const uniqueDiagramIds = [...new Set(list?.map((task) => task.project_diagram_id).filter((id) => id))] // Collect unique IDs
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
			return diagrams[value]
		}

		const DeleteCellRenderer = ({ value, task_group_id, gridRef, isubTaskDelete }) => {
			const [openPopup, setOpenPopup] = useState(false)

			const isRestricted = task_group_id === 2 || task_group_id === 3

			const handleDelete = async (event) => {
				if (isRestricted) {
					setOpenPopup(true) // Open the popup if the task group is restricted
					return // Exit early
				}

				// Handle deletion for non-restricted tasks
				if (Array.isArray(value)) {
					await deleteTasks(value)
				} else {
					await deleteTask(value)
				}
				await refetch()

				if (isubTaskDelete) {
					setSelectedRows([])
					const { data: latestTasks } = await refetchFull()
					const filteredSubTasks = latestTasks?.filter((item) => item?.parent_task === taskID)
					SetSubTasksData(filteredSubTasks)
				}
			}

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
				? `${moment(value[0]).format('YYYY/MM/DD')} - ${moment(value[1]).format('YYYY/MM/DD')}`
				: '-'

		const TeamRenderer = ({ value }) => (value && teams ? teams?.data.find((team) => team.id === value)?.name : '-')

		console.log('TimeRangeEditorCalled', TeamRenderer)

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
		}, [])

		const AddButton = () => (
			<Button color="secondary" onClick={handleAdd}>
				<Iconify icon="material-symbols:add" width={20} height={20} />
			</Button>
		)

		const SubtaskRenderer = (data) => {
			return (
				<button
					style={{
						color: '#6C5DD3',
						cursor: 'pointer',
						background: 'none',
						border: 'none',
						padding: 0,
						font: 'inherit',
						textDecoration: 'underline',
					}}
					onClick={() => {
						SetTaskID(data?.data?.id)
						fetchSubTasks(data?.data?.id, fullResponse)
					}}
				>
					View / Edit
				</button>
			)
		}

		const columnDefs = useMemo(
			() => [
				{
					headerName: '',
					field: 'isSelected',
					width: 50,
					headerCheckboxSelection: true,
					checkboxSelection: true,
					showDisabledCheckboxes: true,
					editable: false,
					resizable: false,
					sortable: false,
					filter: false,
				},
				{
					headerName: 'Task Name',
					field: 'title', // This remains the actual task name column
					flex: 2,
					editable: true, // If you want the task name to be editable
				},

				{
					headerName: 'Mandays',
					field: 'duration',
					flex: 2,
					valueGetter: (params) => {
						const [start, end] = params.data.task_period || []
						if (!start || !end) return 0

						const startDate = moment(start)
						const endDate = moment(end)

						let count = 0
						const current = moment(startDate)

						while (current <= endDate) {
							const day = current.day()
							if (day !== 0 && day !== 6) {
								count += 1
							}
							current.add(1, 'day')
						}

						return count
					},
					editable: false,
					cellStyle: { textAlign: 'center' },
				},
				{
					headerName: 'Work Days',
					field: 'task_period',
					cellEditor: TimeRangeEditor,
					cellRenderer: TimeRangeRenderer,
					cellClass: 'ag-grid-datepicker',
					flex: 2,
				},
				{
					headerName: 'Subtasks',
					field: 'subtasks',
					flex: 2,
					cellRenderer: SubtaskRenderer,
					editable: true,
				},
				{
					headerName: 'Team',
					field: 'team',
					cellEditor: SelectCellEditor,
					cellRenderer: TeamRenderer,
					flex: 2,
				},
				{
					headerName: 'Is Demolition',
					field: 'isDemolition',
					cellRenderer: (params) => (params.value ? 'Yes' : 'No'),
					flex: 1,
				},
				{
					headerName: 'Diagram Name',
					field: 'project_diagram_id',
					cellRenderer: DiagramRenderer,
					flex: 2,
				},
			],
			[
				AddButton,
				DeleteCellRenderer,
				SelectCellEditor,
				TeamRenderer,
				DiagramRenderer,
				TimeRangeEditor,
				TimeRangeRenderer,
				SubtaskRenderer,
			]
		)

		const subTaskColumnDefs = useMemo(
			() => [
				{
					headerName: 'Task Name',
					field: 'title',
					headerCheckboxSelection: true,
					checkboxSelection: (params) => !!params.data,
					showDisabledCheckboxes: true,
					flex: 2,
					editable: true,
				},
				{
					headerName: 'Mandays',
					field: 'duration',
					flex: 2,
					valueGetter: (params) => {
						const [start, end] = params.data.task_period || []
						if (!start || !end) return 0

						const startDate = moment(start)
						const endDate = moment(end)

						return endDate.diff(startDate, 'days')
					},
					editable: false,
				},
				{
					headerName: 'Work Days',
					field: 'task_period',
					cellEditor: TimeRangeEditor,
					cellRenderer: TimeRangeRenderer,
					cellClass: 'ag-grid-datepicker',
					flex: 2,
					cellEditorPopup: true,
				},
				{
					headerName: 'Team',
					field: 'team',
					cellEditor: SelectCellEditor,
					cellRenderer: TeamRenderer,
					flex: 2,
					editable: true,
				},
			],
			[
				AddButton,
				DeleteCellRenderer,
				SelectCellEditor,
				TeamRenderer,
				DiagramRenderer,
				TimeRangeEditor,
				TimeRangeRenderer,
				SubtaskRenderer,
			]
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

		const handleAddSubtask = (value) => {
			const tempDateData = new Map()

			const currentCount = existingSubTasks.length

			const nextIndex = currentCount

			if (value) {
				const selectedTaskId = selectedRows[0]

				const selectedTaskObj = list.find((task) => task.id === selectedTaskId)

				console.log('selectedTaskId', selectedTaskId, task_group_id, selectedTaskObj?.task_group_id)
				if (!selectedRows || selectedRows.length === 0) {
					setToast({
						severity: 'warning',
						message: 'Please select a task to add a subtask.',
					})
					return
				}
				if (selectedRows.length > 1) {
					setToast({
						severity: 'warning',
						message: 'Please select only one task to add a subtask.',
					})
					return
				}

				// Check if the selected task is from same task group
				if (selectedTaskObj.task_group_id !== Number(task_group_id)) {
					setToast({
						severity: 'warning',
						message: 'Please select a task from the same task group to add a subtask.',
					})
					return
				}

				// Check if the selected task is not a subtask
				if (selectedTaskObj.parent_task) {
					setToast({
						severity: 'warning',
						message: 'Please select a parent task to add a subtask not sub task.',
					})
					return
				}

				console.log('selectedRows', selectedRows)
				// return;
				//
				const parentId = selectedRows[0]
				console.log('new task created ')
				// return
				// add 5 subtask to the task each start will be end date of previous task
				// and end date will be 1 day after start date
				// const startDate = moment(selectedTaskObj.end_date).add(1, 'days').format('YYYY-MM-DD')
				// const endDate = moment(selectedTaskObj.end_date).add(2, 'days').format('YYYY-MM-DD')
				// const parentId = selectedTaskObj.id;
				const subtasks = []
				let currentStart = moment(selectedTaskObj.start_date)

				const defaultSubTaskNames = ['Line', 'Trim', 'Assemble', 'Galvanize', 'Install']

				for (let i = 0; i < 5; i += 1) {
					const start_date = currentStart.format('YYYY-MM-DD')
					const end_date = currentStart.clone().add(1, 'days').format('YYYY-MM-DD')
					subtasks.push({
						title: defaultSubTaskNames[i],
						team: selectedTaskObj.team,
						start_date,
						end_date,
						notes: '',
						task_group_id,
						project: id,
						parent_task: parentId,
					})
					currentStart = currentStart.clone().add(1, 'days')

					console.log('subTask', subtasks)

					console.log('currentStart', subtasks)
				}
				createNewTasks(subtasks).then(() => {
					console.log('Subtask created successfully')
					setToast({
						severity: 'success',
						message: 'Subtask has been created successfully',
					})
					myQueryClient.invalidateQueries({ queryKey: [`raw-task-${task_group}`] })
					myQueryClient.invalidateQueries(['project_tasks'])
				})
				console.log('HRT', fullResponse)
			}
			// else {
			// 	SetIsSubTaskCreated(true)

			// 	if (selectedRows?.length) {
			// 		setToast({
			// 			severity: 'warning',
			// 			message: 'Please deselect the current subtask before adding a new one.',
			// 		})
			// 		return
			// 	}

			// 	const selectedTaskObj = fullResponse?.find((task) => task.id === taskID)
			// 	const existingSubTasks = fullResponse?.filter((task) => task?.parent_task === taskID)

			// 	const parentId = selectedTaskObj?.id

			// 	const parentStart = moment(selectedTaskObj?.start_date)
			// 	const parentEnd = moment(selectedTaskObj?.end_date)

			// 	const nextStartDate = parentStart.clone().add(nextIndex, 'days')
			// 	const nextEndDate = nextStartDate.clone().add(1, 'days')

			// 	let subtasks = null

			// 	const currentStartDate = nextStartDate.format('YYYY-MM-DD')

			// 	const currentEndDate = nextEndDate.format('YYYY-MM-DD')

			// 	const startDay = new Date(currentStartDate).getDay()

			// 	const endDay = new Date(currentEndDate).getDay()

			// 	const parentStartDate = new Date(parentStart)

			// 	const parentEndDate = new Date(parentEnd)

			// 	if (startDay === 0 || startDay === 6) {
			// 		let newStartDate = null
			// 		let newEndDate = null
			// 		const isWeekend = (day) => day === 0 || day === 6

			// 		let currentStartDate = new Date(nextStartDate.format('YYYY-MM-DD'))

			// 		while (true) {
			// 			const day = currentStartDate.getDay()

			// 			if (!isWeekend(day)) {
			// 				newStartDate = new Date(currentStartDate)
			// 				newEndDate = new Date(newStartDate)
			// 				newEndDate.setDate(newStartDate.getDate() + 1)

			// 				// If newEndDate exceeds parent end, wrap to start
			// 				if (newEndDate > parentEndDate) {
			// 					currentStartDate = new Date(parentStartDate)
			// 				}

			// 				break // ✅ Exit loop when valid pair found
			// 			} else {
			// 				currentStartDate.setDate(currentStartDate.getDate() + 1)

			// 				if (currentStartDate > parentEndDate) {
			// 					currentStartDate = new Date(parentStartDate)
			// 				}
			// 			}
			// 		}

			// 		console.log('SUBTASKPOPUP IF', existingSubTasks)

			// 		subtasks = [
			// 			{
			// 				title: '',
			// 				team: selectedTaskObj.team,
			// 				start_date: moment(newStartDate).format('YYYY-MM-DD'),
			// 				end_date: moment(newEndDate).format('YYYY-MM-DD'),
			// 				notes: '',
			// 				task_group_id,
			// 				project: id,
			// 				parent_task: parentId,
			// 			},
			// 		]
			// 	} else {
			// 		subtasks = [
			// 			{
			// 				title: '',
			// 				team: selectedTaskObj.team,
			// 				start_date: nextStartDate.format('YYYY-MM-DD'),
			// 				end_date: nextEndDate.format('YYYY-MM-DD'),
			// 				notes: '',
			// 				task_group_id,
			// 				project: id,
			// 				parent_task: parentId,
			// 			},
			// 		]
			// 		console.log('SUBTASKPOPUP else', existingSubTasks, nextIndex)
			// 	}

			// 	createNewTasks(subtasks).then(async (res) => {
			// 		setToast({
			// 			severity: 'success',
			// 			message: `Subtask has been created successfully.`,
			// 		})

			// 		const { data: latestTasks } = await refetchFull()

			// 		const filteredSubTasks = latestTasks?.filter((item) => item?.parent_task === taskID)
			// 		SetSubTasksData(filteredSubTasks)
			// 		SetIsSubTaskCreated(false)

			// 		setTimeout(() => {
			// 			const rowIndex = filteredSubTasks.length - 1

			// 			// Ensure the row is visible (scroll if needed)
			// 			gridRef.current.api.stopEditing()
			// 			gridRef.current.api.ensureIndexVisible(rowIndex)

			// 			// Focus the 'title' (Task Name) cell with blinking cursor
			// 			gridRef.current.api.startEditingCell({
			// 				rowIndex,
			// 				colKey: 'title', // Column key for Task Name
			// 			})
			// 		}, 50)
			// 		return () => {}
			// 	})
			// }
			else {
				SetIsSubTaskCreated(true)

				if (selectedRows?.length) {
					setToast({
						severity: 'warning',
						message: 'Please deselect the current subtask before adding a new one.',
					})
					return
				}

				const selectedTaskObj = fullResponse?.find((task) => task.id === taskID)
				const existingSubTasks = fullResponse?.filter((task) => task?.parent_task === taskID)

				const parentId = selectedTaskObj?.id
				const parentStart = moment(selectedTaskObj?.start_date)
				const parentEnd = moment(selectedTaskObj?.end_date)

				const parentStartDate = new Date(parentStart.format('YYYY-MM-DD'))
				const parentEndDate = new Date(parentEnd.format('YYYY-MM-DD'))

				const tempEndDate = new Date(parentEndDate)

				tempEndDate.setDate(tempEndDate.getDate() + 1)

				const isWeekend = (day) => day === 0 || day === 6

				const validPairs = []
				const temp = new Date(parentStartDate)

				while (temp <= tempEndDate) {
					const next = new Date(temp)
					next.setDate(temp.getDate() + 1)

					if (!isWeekend(temp.getDay()) && next <= tempEndDate) {
						validPairs.push([new Date(temp), new Date(next)])
					}

					temp.setDate(temp.getDate() + 1)
				}

				
				const currentCount = existingSubTasks.length
				const pairIndex = currentCount % validPairs.length
				const [startDateObj, endDateObj] = validPairs[pairIndex]

				const subtasks = [
					{
						title: '', // You can assign a title from defaultSubTaskNames if needed
						team: selectedTaskObj.team,
						start_date: moment(startDateObj).format('YYYY-MM-DD'),
						end_date: moment(endDateObj).format('YYYY-MM-DD'),
						notes: '',
						task_group_id,
						project: id,
						parent_task: parentId,
					},
				]

				console.log('Creating MYSUbtask:', validPairs)

				createNewTasks(subtasks).then(async (res) => {
					setToast({
						severity: 'success',
						message: `Subtask has been created successfully.`,
					})

					const { data: latestTasks } = await refetchFull()
					const filteredSubTasks = latestTasks?.filter((item) => item?.parent_task === taskID)

					SetSubTasksData(filteredSubTasks)
					SetIsSubTaskCreated(false)

					setTimeout(() => {
						const rowIndex = filteredSubTasks.length - 1

						gridRef.current.api.stopEditing()
						gridRef.current.api.ensureIndexVisible(rowIndex)

						gridRef.current.api.startEditingCell({
							rowIndex,
							colKey: 'title',
						})
					}, 50)

					return () => {}
				})
			}
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

			console.log('onCellEditRequest', newItem)
			if (typeof id !== 'string') {
				console.log('newItem', newItem)
				updateTask(
					{
						title: newItem.title,
						team: newItem.team,
						notes: newItem.notes,
						duration: newItem.duration,
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

		// const updateTaskDates = async () => {
		// 	if (!list || list.length === 0) return

		// 	const formatDate = (date) => {
		// 		const yyyy = date.getFullYear()
		// 		const mm = String(date.getMonth() + 1).padStart(2, '0')
		// 		const dd = String(date.getDate()).padStart(2, '0')
		// 		return `${yyyy}-${mm}-${dd}`
		// 	}

		// 	const sortedList = [...list].sort((a, b) => {
		// 		if (a.tl !== b.tl) return a.tl - b.tl
		// 		if (a.priority !== b.priority) return a.priority - b.priority

		// 		const aStart = new Date(a.start_date)
		// 		const bStart = new Date(b.start_date)
		// 		if (aStart.getTime() !== bStart.getTime()) return aStart - bStart

		// 		const aEnd = new Date(a.end_date)
		// 		const bEnd = new Date(b.end_date)
		// 		return aEnd - bEnd
		// 	})

		// 	let currentEndDate = new Date(sortedList[0]?.end_date)
		// 	const updatePromises = []

		// 	console.log('updateTaskDates 1', sortedList)

		// 	for (let i = 1; i < list.length; i += 1) {
		// 		const task = sortedList[i]

		// 		const newStartDate = new Date(currentEndDate)
		// 		newStartDate.setDate(newStartDate.getDate() + 1)

		// 		const newEndDate = new Date(newStartDate)
		// 		newEndDate.setDate(newStartDate.getDate() + 4)

		// 		const updatedStart_date = formatDate(newStartDate)
		// 		const updatedEnd_date = formatDate(newEndDate)

		// 		currentEndDate = newEndDate

		// 		console.log(
		// 			`Updating Task ID: ${task.id}, Old: (${task.start_date} - ${task.end_date}) → New: (${updatedStart_date} - ${updatedEnd_date})`
		// 		)

		// 		const updatePromise = updateTask(
		// 			{
		// 				start_date: updatedStart_date,
		// 				end_date: updatedEnd_date,
		// 			},
		// 			task?.id
		// 		)
		// 			.then((res) => {
		// 				if (res?.error === null) {
		// 					console.log('✅ Updated Task ID:', task?.id)
		// 					// eslint-disable-next-line

		// 					// console.log('updateTaskDates', res?.data?.[0]?.title, 'Current ENd Date---->', newEndDate)
		// 				} else {
		// 					console.warn('⚠️ Update failed for Task ID:', task?.id)
		// 				}
		// 			})
		// 			.catch((error) => {
		// 				console.error('❌ Error while updating Task ID:', task?.id, error)
		// 			})

		// 		updatePromises.push(updatePromise)
		// 	}

		// 	await Promise.all(updatePromises)

		// 	refetch()
		// }

		const updateTaskDates = async () => {
			if (!list || list.length === 0) return

			const formatDate = (date) => {
				const yyyy = date.getFullYear()
				const mm = String(date.getMonth() + 1).padStart(2, '0')
				const dd = String(date.getDate()).padStart(2, '0')
				return `${yyyy}-${mm}-${dd}`
			}

			const addWorkingDays = (startDate, daysToAdd) => {
				const date = new Date(startDate)
				let addedDays = 0

				while (addedDays <= daysToAdd) {
					console.log('setDate', date)
					const day = date.getDay()
					if (day !== 0 && day !== 6) {
						addedDays += 1
					}
					if (addedDays < daysToAdd) {
						date.setDate(date.getDate() + 1)
					}
				}

				return date
			}

			const sortedList = [...list].sort((a, b) => {
				if (a.tl !== b.tl) return a.tl - b.tl
				if (a.priority !== b.priority) return a.priority - b.priority

				const aStart = new Date(a.start_date)
				const bStart = new Date(b.start_date)
				if (aStart.getTime() !== bStart.getTime()) return aStart - bStart

				const aEnd = new Date(a.end_date)
				const bEnd = new Date(b.end_date)
				return aEnd - bEnd
			})

			let currentEndDate = new Date(sortedList[0]?.end_date)
			const updatePromises = []

			for (let i = 1; i < list.length; i += 1) {
				const task = sortedList[i]

				const newStartDate = new Date(currentEndDate)
				newStartDate.setDate(newStartDate.getDate() + 1)

				const newEndDate = addWorkingDays(newStartDate, 5)

				console.log('updateTaskDates 1', currentEndDate)

				const updatedStart_date = formatDate(newStartDate)
				const updatedEnd_date = formatDate(newEndDate)

				currentEndDate = newEndDate

				console.log(
					`Updating Task ID: ${task.id}, Old: (${task.start_date} - ${task.end_date}) → New: (${updatedStart_date} - ${updatedEnd_date})`
				)

				const updatePromise = updateTask(
					{
						start_date: updatedStart_date,
						end_date: updatedEnd_date,
					},
					task?.id
				)
					.then((res) => {
						if (res?.error === null) {
							console.log('✅ Updated Task ID:', task?.id)
						} else {
							console.warn('⚠️ Update failed for Task ID:', task?.id)
						}
					})
					.catch((error) => {
						console.error('❌ Error while updating Task ID:', task?.id, error)
					})

				updatePromises.push(updatePromise)
			}

			await Promise.all(updatePromises)
			refetch()
		}

		useEffect(() => {
			updateTaskDates()
		}, [list])

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
						{console.log('rowData', list)}
						<Stack gap={2}>
							{console.log('updateTaskDates 2', list)}
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
								onRowSelected={(params) => {
									const api = params.api // Get the API directly from the event params
									const currentSelectedRows = api.getSelectedRows() // Use this API instance
									const selectedIds = currentSelectedRows.map(({ id }) => id)

									console.log('KLLL', selectedIds, list)
									setSelectedRows(selectedIds)
								}}
							/>

							{/* {console.log('list', list)} */}
							<Box display="flex" justifyContent="space-between">
								<Button onClick={handleAdd}>Add Task</Button>
								{selectedRows?.length > 0 && (
									<Box>
										{selectedRows?.length} items selected:
										<DeleteCellRenderer value={selectedRows} task_group_id={task_group_id} gridRef={gridRef} />
									</Box>
								)}
							</Box>
						</Stack>
					</div>
				</div>
				{console.log('onRowSelected', gridRef.current?.api?.getSelectedRows())}

				{isSubTaskOpen && (
					<TaskPopUp
						open={isSubTaskOpen}
						onClose={() => {
							SetIsSubTaskOpen(false)
							SetTaskID('')
						}}
						disableEnforceFocus
						ref={gridRef}
						rowData={subTasksData}
						columnDefs={subTaskColumnDefs}
						defaultColDef={defaultColDef}
						rowSelection={'multiple'}
						suppressRowClickSelection={true}
						suppressColumnVirtualisation={true}
						getRowId={(params) => params.data.id}
						onclick={handleAddSubtask}
						SetIsSubTask={SetIsSubTask}
						isSubTask={isSubTask}
						refetch={refetch}
						refetchFull={refetchFull}
						myQueryClient={myQueryClient}
						SetSubTasksData={SetSubTasksData}
						taskID={taskID}
						isSubTaskCreated={isSubTaskCreated}
						SetIsSubTaskCreated={SetIsSubTaskCreated}
						selectedRows={selectedRows}
						task_group_id={task_group_id}
						DeleteCellRenderer={DeleteCellRenderer}
						setSelectedRows={setSelectedRows}
						stopEditingWhenCellsLoseFocus={true}
						onCellEditRequest={onCellEditRequest}
						onRowSelected={() => {
							if (gridRef.current?.api) {
								const selected = gridRef.current?.api?.getSelectedRows()
								setSelectedRows(selected.map(({ id }) => id))
							}
						}}
					/>
				)}
			</>
		)
	}
)

Task.propTypes = {
	task_group: PropTypes.string.isRequired,
	task_group_id: PropTypes.string.isRequired,
}

export default Tasks

const KEY_BACKSPACE = 'Backspace'
const KEY_DELETE = 'Delete'
const KEY_ENTER = 'Enter'
const KEY_TAB = 'Tab'
