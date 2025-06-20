import React, { forwardRef, useState } from 'react'
import { Box, Dialog, DialogTitle, Stack, Typography, Button } from '@mui/material'
import Iconify from 'components/Iconify'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import '../../../../ag-theme-ddconst.scss'
import { AgGridReact } from 'ag-grid-react'
import { updateTask } from 'supabase'

const TaskPopUp = forwardRef(
	(
		{
			open,
			onClose,
			rowData,
			columnDefs,
			defaultColDef,
			rowSelection,
			suppressRowClickSelection,
			suppressColumnVirtualisation,
			domLayout,
			getRowId,
			onRowSelected,
			onclick,
			SetIsSubTask,
			isSubTask,
			refetch,
			refetchFull,
			SetSubTasksData,
			myQueryClient,
			taskID,
			selectedRows,
			DeleteCellRenderer,
			task_group_id,
		},
		gridRef
	) => {
		const [toast, setToast] = useState(false)
		const handleClose = () => {
			onClose()
		}

		const rowHeight = 40 // or use gridOptions.getRowHeight if customized
		const maxRowsVisible = 6 // or whatever fits your modal best
		const gridHeight = Math.min(rowData.length, maxRowsVisible) * rowHeight + 60 // buffer for header, padding

		return (
			<Dialog
				open={open}
				onClose={handleClose}
				maxWidth={rowData?.length > 0 && rowData !== null ? false : 'xs'}
				fullWidth
				PaperProps={{
					sx: {
						background: '#fff',
						border: '1px solid #ccc',
						boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
						borderRadius: '20px',
						color: '#4f46e5',
						p: 5,
						overflowY: 'auto',
						minHeight: '400px',
					},
					onClick: (e) => e.stopPropagation(),
				}}
			>
				<Stack
					onClick={handleClose}
					style={{ cursor: 'pointer' }}
					display="flex"
					justifyContent="flex-end"
					width="100%"
					direction="row"
					alignItems="center"
				>
					<Iconify icon="eva:close-fill" width={24} height={24} />
				</Stack>
				<DialogTitle
					sx={{
						fontWeight: 600,
						fontSize: '1.4rem',
						textAlign: 'center',
						color: '#333',
						mb: 2,
					}}
				>
					SubTasks
				</DialogTitle>
				<div className="ag-theme-alpine" style={{ width: '100%', height: `${gridHeight || 350}px` }}>
					{rowData?.length > 0 && rowData !== null ? (
						<>
							<AgGridReact
								ref={gridRef}
								rowData={rowData}
								columnDefs={columnDefs}
								defaultColDef={defaultColDef}
								rowSelection={rowSelection}
								suppressRowClickSelection={suppressRowClickSelection}
								suppressColumnVirtualisation={suppressColumnVirtualisation}
								domLayout={domLayout}
								onCellValueChanged={async (event) => {
									const {
										data,
										newValue,
										colDef: { field },
									} = event

									const newItem = { ...data }
									newItem[field] = newValue
									const { id } = newItem

									console.log('onCellValueChanged', newItem)

									if (typeof id !== 'string') {
										try {
											await updateTask(
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

											await refetch()
											const { data: latestTasks } = await refetchFull()
											const filteredSubTasks = latestTasks?.filter((item) => item?.parent_task === taskID)
											SetSubTasksData(filteredSubTasks)
										} catch (error) {
											console.error('Error updating task:', error)
											setToast({
												severity: 'error',
												message: 'Failed to update task. Please try again.',
											})
										}
									}
								}}
								getRowId={getRowId}
								onRowSelected={onRowSelected}
							/>

							<Box display="flex" justifyContent="flex-end" padding={'7px'} marginBottom={'10px'} gap={'12px'}>
								<Button
									color="secondary"
									onClick={() => onclick(false)}
									sx={{ ml: 1, background: '#eeee', marginBottom: '10px' }}
								>
									Add Subtask
								</Button>
								{selectedRows?.length > 0 && (
									<Box>
										{selectedRows?.length} items selected:
										<DeleteCellRenderer
											value={selectedRows}
											task_group_id={task_group_id}
											gridRef={gridRef}
											isubTaskDelete={true}
										/>
									</Box>
								)}
							</Box>
						</>
					) : (
						<Box
							sx={{
								height: '100%',
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center',
								color: '#666',
								textAlign: 'center',
								padding: 7,
								cursor: 'pointer',
							}}
						>
							<Iconify
								icon="mdi:clipboard-outline"
								width={56}
								height={56}
								style={{ marginBottom: '20px', color: '#9e9e9e' }}
							/>
							<Typography variant="h6" sx={{ fontWeight: 600, marginBottom: 1 }}>
								No Subtasks Found
							</Typography>
							{/* <Typography
								variant="body2"
								sx={{
									maxWidth: 280,
									color: '#777',
									lineHeight: 1.6,
									fontWeight: 600,
								}}
							>
								This task doesn’t have any subtasks yet.
							</Typography> */}

							<Box display="flex" justifyContent="flex-end" padding={'7px'} marginBottom={'10px'}>
								<Button
									color="secondary"
									onClick={() => onclick(false)}
									sx={{ ml: 1, background: '#eeee', marginBottom: '10px' }}
								>
									Add Subtask
								</Button>
							</Box>
						</Box>
					)}
				</div>
			</Dialog>
		)
	}
)

export default TaskPopUp
