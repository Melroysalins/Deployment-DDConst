import React, { useRef } from 'react'
import { Box, Dialog, DialogTitle, Stack, Typography } from '@mui/material'
import Iconify from 'components/Iconify'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import '../../../../ag-theme-ddconst.scss'
import { AgGridReact } from 'ag-grid-react'

const TaskPopUp = ({
	open,
	onClose,
	gridRef,
	rowData,
	columnDefs,
	defaultColDef,
	rowSelection,
	suppressRowClickSelection,
	suppressColumnVirtualisation,
	domLayout,
	onCellEditRequest,
	getRowId,
	onRowSelected,
}) => {
	const handleClose = () => {
		onClose()
	}

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
					p: 4,
					overflowY: 'auto',
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
			<div className="ag-theme-alpine" style={{ width: '100%', height: '300px' }}>
				{rowData?.length > 0 && rowData !== null ? (
					<AgGridReact
						ref={gridRef}
						rowData={rowData}
						columnDefs={columnDefs}
						defaultColDef={defaultColDef}
						rowSelection={rowSelection}
						suppressRowClickSelection={suppressRowClickSelection}
						suppressColumnVirtualisation={suppressColumnVirtualisation}
						// domLayout={domLayout}
						onCellEditRequest={onCellEditRequest}
						getRowId={getRowId}
						onRowSelected={onRowSelected}
					/>
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
							padding: 3,
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
						<Typography
							variant="body2"
							sx={{
								maxWidth: 280,
								color: '#777',
								lineHeight: 1.6,
								fontWeight: 600,
							}}
						>
							This task doesn’t have any subtasks yet.
							<br />
							You can add one using the <span style={{ fontWeight: 600, color: '#1976d2' }}>"Add Subtask"</span> button.
						</Typography>
					</Box>
				)}
			</div>
		</Dialog>
	)
}

export default TaskPopUp
