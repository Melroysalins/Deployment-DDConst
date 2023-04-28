import * as React from 'react'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Paper from '@mui/material/Paper'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import { visuallyHidden } from '@mui/utils'
import { Avatar, CircularProgress, Stack } from '@mui/material'
import Iconify from 'components/Iconify'
import { certificateColors } from 'constant'

function descendingComparator(a, b, orderBy) {
	if (b[orderBy] < a[orderBy]) {
		return -1
	}
	if (b[orderBy] > a[orderBy]) {
		return 1
	}
	return 0
}

function getComparator(order, orderBy) {
	return order === 'desc'
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort(array, comparator) {
	const stabilizedThis = array.map((el, index) => [el, index])
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0])
		if (order !== 0) {
			return order
		}
		return a[1] - b[1]
	})
	return stabilizedThis.map((el) => el[0])
}

const DEFAULT_ORDER = 'asc'
const DEFAULT_ORDER_BY = 'name'
const DEFAULT_ROWS_PER_PAGE = 5

function EnhancedTableHead(props) {
	const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, headCells } = props
	const createSortHandler = (newOrderBy) => (event) => {
		onRequestSort(event, newOrderBy)
	}

	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={'center'}
						padding={'normal'}
						sortDirection={orderBy === headCell.id ? order : false}
					>
						<TableSortLabel
							active={orderBy === headCell.id}
							direction={orderBy === headCell.id ? order : 'asc'}
							onClick={createSortHandler(headCell.id)}
						>
							{headCell.label}
							{orderBy === headCell.id ? (
								<Box component="span" sx={visuallyHidden}>
									{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
								</Box>
							) : null}
						</TableSortLabel>
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	)
}

export default function EnhancedTable({
	headCells,
	rows,
	hasActions,
	handleDelete,
	handleView,
	handleEdit,
	loader,
	selectedId,
	type,
	hideActions,
}) {
	const [order, setOrder] = React.useState(DEFAULT_ORDER)
	const [orderBy, setOrderBy] = React.useState(DEFAULT_ORDER_BY)
	const [selected, setSelected] = React.useState([])
	const [page, setPage] = React.useState(0)
	const [dense, setDense] = React.useState(false)
	const [visibleRows, setVisibleRows] = React.useState(null)
	const [rowsPerPage, setRowsPerPage] = React.useState(DEFAULT_ROWS_PER_PAGE)
	const [paddingHeight, setPaddingHeight] = React.useState(0)

	React.useEffect(() => {
		let rowsOnMount = stableSort(rows, getComparator(DEFAULT_ORDER, DEFAULT_ORDER_BY))

		rowsOnMount = rowsOnMount.slice(0 * DEFAULT_ROWS_PER_PAGE, 0 * DEFAULT_ROWS_PER_PAGE + DEFAULT_ROWS_PER_PAGE)

		setVisibleRows(rowsOnMount)
	}, [rows])

	const handleRequestSort = React.useCallback(
		(event, newOrderBy) => {
			const isAsc = orderBy === newOrderBy && order === 'asc'
			const toggledOrder = isAsc ? 'desc' : 'asc'
			setOrder(toggledOrder)
			setOrderBy(newOrderBy)

			const sortedRows = stableSort(rows, getComparator(toggledOrder, newOrderBy))
			const updatedRows = sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

			setVisibleRows(updatedRows)
		},
		[order, orderBy, page, rowsPerPage]
	)

	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelected = rows.map((n) => n.name)
			setSelected(newSelected)
			return
		}
		setSelected([])
	}

	const handleChangePage = React.useCallback(
		(event, newPage) => {
			setPage(newPage)

			const sortedRows = stableSort(rows, getComparator(order, orderBy))
			const updatedRows = sortedRows.slice(newPage * rowsPerPage, newPage * rowsPerPage + rowsPerPage)

			setVisibleRows(updatedRows)

			// Avoid a layout jump when reaching the last page with empty rows.
			const numEmptyRows = newPage > 0 ? Math.max(0, (1 + newPage) * rowsPerPage - rows.length) : 0

			const newPaddingHeight = (dense ? 33 : 53) * numEmptyRows
			setPaddingHeight(newPaddingHeight)
		},
		[order, orderBy, dense, rowsPerPage]
	)

	const handleChangeRowsPerPage = React.useCallback(
		(event) => {
			const updatedRowsPerPage = parseInt(event.target.value, 10)
			setRowsPerPage(updatedRowsPerPage)

			setPage(0)

			const sortedRows = stableSort(rows, getComparator(order, orderBy))
			const updatedRows = sortedRows.slice(0 * updatedRowsPerPage, 0 * updatedRowsPerPage + updatedRowsPerPage)

			setVisibleRows(updatedRows)

			// There is no layout jump to handle on the first page.
			setPaddingHeight(0)
		},
		[order, orderBy, rows]
	)

	const handleChangeDense = (event) => {
		setDense(event.target.checked)
	}

	const AvatarRating = (value) => (
		<div style={{ display: 'flex', gap: 5, justifyContent: 'center', alignItems: 'center' }}>
			<Avatar sx={{ width: 20, height: 20, fontSize: 12, background: certificateColors[value] }}>{value}</Avatar>{' '}
			<span style={{ color: '#596570' }}>Certfication level</span>
		</div>
	)

	return (
		<Box sx={{ width: '100%' }}>
			<Paper sx={{ width: '100%', mb: 2 }}>
				<TableContainer>
					<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
						<EnhancedTableHead
							numSelected={selected.length}
							order={order}
							orderBy={orderBy}
							onSelectAllClick={handleSelectAllClick}
							onRequestSort={handleRequestSort}
							rowCount={rows.length}
							headCells={headCells}
						/>
						<TableBody>
							{visibleRows
								? visibleRows.map((row) => {
										let arr = Object.values(row)
										if (hasActions) {
											arr = arr.splice(0, arr.length - 1)
										}

										return (
											<TableRow hover tabIndex={-1} key={row.name} sx={{ cursor: 'pointer' }}>
												{arr?.map((value, index) => (
													<TableCell key={value} align="center">
														{type === 'employee' && index === 2 ? (
															<>{AvatarRating(value)}</>
														) : (
															<span style={{ color: '#596570' }}>{value || '-'} </span>
														)}
													</TableCell>
												))}
												{hasActions && !hideActions && (
													<TableCell align="center">
														<Box
															sx={{
																display: 'flex',
																alignItems: 'center',
																justifyContent: 'center',
																gap: 1,
															}}
														>
															{loader && selectedId === row.id ? (
																<CircularProgress />
															) : (
																<>
																	<Stack onClick={() => handleView(row.id)}>
																		<Iconify icon="ic:baseline-remove-red-eye" />
																	</Stack>
																	<Stack onClick={() => handleEdit(row.id)}>
																		<Iconify icon="material-symbols:edit" />
																	</Stack>
																	<Stack onClick={() => handleDelete(row.id)}>
																		<Iconify icon="material-symbols:delete-outline" />
																	</Stack>
																</>
															)}
														</Box>
													</TableCell>
												)}
											</TableRow>
										)
								  })
								: null}
							{paddingHeight > 0 && (
								<TableRow
									style={{
										height: paddingHeight,
									}}
								>
									<TableCell colSpan={6} />
								</TableRow>
							)}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[5, 10, 20]}
					component="div"
					count={rows.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</Paper>
			<FormControlLabel
				style={{ display: 'none' }}
				control={<Switch checked={dense} onChange={handleChangeDense} />}
				label="Dense padding"
			/>
		</Box>
	)
}
