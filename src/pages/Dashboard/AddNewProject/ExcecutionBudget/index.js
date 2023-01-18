/* eslint-disable react/prop-types */
import { Button, Grid, Stack, Typography } from '@mui/material'
import { AgGridReact } from 'ag-grid-react'
import Iconify from 'components/Iconify'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import DoublingEditor from './DoublingEditor'
import NumericEditor from './numberEditor'

// import 'ag-grid-enterprise'

// eslint-disable-next-line
export default function ExecutionBudget() {
	return (
		<Grid container spacing={3} rowSpacing={5}>
			<Grid item md={12} lg={6}>
				<ExecutionBudgetTableTemplate
					title="Consumables"
					initialData={[{ id: 2, title: 'EB-A', count: 1, unit_price: 1 }]}
					initialValues={{ title: '', count: 0, unit_price: 0 }}
					_columnDefs={[
						{
							headerName: 'Junction Box',
							field: 'title',
							flex: 3,
						},
						{
							headerName: 'Count',
							field: 'count',
							aggFunc: 'sum',
							cellEditor: NumericEditor,
						},
						{
							headerName: 'Unit Price',
							field: 'unit_price',
							cellEditor: NumericEditor,
							aggFunc: 'sum',
						},
						{
							headerName: 'Sub Total',
							field: 'sub_total',
							editable: false,
							valueGetter: (params) => params?.data?.sub_total ?? params?.data?.count * params?.data?.unit_price,
						},
					]}
				/>
			</Grid>
			<Grid item md={12} lg={6}>
				<ExecutionBudgetTableTemplate
					title="Manpower"
					initialData={[{ id: 2, employees: 'On-site Worker', mandays: 26, people: 8, unit_price: 100 }]}
					initialValues={{ employees: '', mandays: 0, people: 0, unit_price: 0 }}
					_columnDefs={[
						{
							headerName: 'Employees',
							field: 'employees',
							flex: 3,
						},
						{
							headerName: 'Mandays',
							field: 'mandays',
							cellEditor: NumericEditor,
						},
						{
							headerName: 'People',
							field: 'people',
							cellEditor: NumericEditor,
						},
						{
							headerName: 'Unit Price',
							field: 'unit_price',
							cellEditor: NumericEditor,
							aggFunc: 'sum',
						},
						{
							headerName: 'Sub Total',
							field: 'sub_total',
							editable: false,
							valueGetter: (params) =>
								params?.data?.sub_total ?? params?.data?.mandays * params?.data?.people * params?.data?.unit_price,
						},
					]}
				/>{' '}
			</Grid>
			<Grid item md={12} lg={6}>
				<ExecutionBudgetTableTemplate
					title="Business Travel"
					initialData={[{ id: 2, employees: 'On-site Worker', mandays: 26, people: 8, unit_price: 100 }]}
					initialValues={{ employees: '', mandays: 0, people: 0, unit_price: 0 }}
					_columnDefs={[
						{
							headerName: 'Employees',
							field: 'employees',
							flex: 3,
						},
						{
							headerName: 'Mandays',
							field: 'mandays',
							cellEditor: NumericEditor,
						},
						{
							headerName: 'People',
							field: 'people',
							cellEditor: NumericEditor,
						},
						{
							headerName: 'Unit Price',
							field: 'unit_price',
							cellEditor: NumericEditor,
							aggFunc: 'sum',
						},
						{
							headerName: 'Sub Total',
							field: 'sub_total',
							editable: false,
							valueGetter: (params) =>
								params?.data?.sub_total ?? params?.data?.mandays * params?.data?.people * params?.data?.unit_price,
						},
					]}
				/>
			</Grid>
			<Grid item md={12} lg={6}>
				<ExecutionBudgetTableTemplate
					title="Non-Business Traveler"
					initialData={[{ id: 2, employees: 'On-site Worker', mandays: 26, people: 8, unit_price: 100 }]}
					initialValues={{ employees: '', mandays: 0, people: 0, unit_price: 0 }}
					_columnDefs={[
						{
							headerName: 'Employees',
							field: 'employees',
							flex: 3,
						},
						{
							headerName: 'Mandays',
							field: 'mandays',
							cellEditor: NumericEditor,
						},
						{
							headerName: 'People',
							field: 'people',
							cellEditor: NumericEditor,
						},
						{
							headerName: 'Unit Price',
							field: 'unit_price',
							cellEditor: NumericEditor,
							aggFunc: 'sum',
						},
						{
							headerName: 'Sub Total',
							field: 'sub_total',
							editable: false,

							valueGetter: (params) =>
								params?.data?.sub_total ?? params?.data?.mandays * params?.data?.people * params?.data?.unit_price,
						},
					]}
				/>
			</Grid>
			<Grid item md={12} lg={6}>
				<ExecutionBudgetTableTemplate
					title="Subcontract"
					initialData={[{ id: 2, employees: 'On-site Worker', mandays: 26, people: 8, unit_price: 100 }]}
					initialValues={{ employees: '', mandays: 0, people: 0, unit_price: 0 }}
					_columnDefs={[
						{
							headerName: 'Employees',
							field: 'employees',
							flex: 3,
						},
						{
							headerName: 'Mandays',
							field: 'mandays',
							cellEditor: NumericEditor,
						},
						{
							headerName: 'People',
							field: 'people',
							cellEditor: NumericEditor,
						},
						{
							headerName: 'Unit Price',
							field: 'unit_price',
							cellEditor: NumericEditor,
							aggFunc: 'sum',
						},
						{
							headerName: 'Sub Total',
							field: 'sub_total',
							editable: false,

							valueGetter: (params) =>
								params?.data?.sub_total ?? params?.data?.mandays * params?.data?.people * params?.data?.unit_price,
						},
					]}
				/>
			</Grid>
			<Grid item md={12} lg={6}>
				<ExecutionBudgetTableTemplate
					title="Non-business traveler"
					initialData={[{ id: 2, employees: 'On-site Worker', count: 1, unit_price: 1 }]}
					initialValues={{ employees: '', count: 0, unit_price: 0 }}
					_columnDefs={[
						{
							headerName: 'Subcontracts',
							field: 'subcontracts',
							flex: 3,
						},
						{
							headerName: 'Count',
							field: 'count',
							cellEditor: NumericEditor,
						},
						{
							headerName: 'Unit Price',
							field: 'unit_price',
							cellEditor: NumericEditor,
						},
						{
							headerName: 'Sub Total',
							field: 'sub_total',
							editable: false,
							valueGetter: (params) => params?.data?.sub_total ?? params?.data?.count * params?.data?.unit_price,
						},
					]}
				/>
			</Grid>
			<Grid item md={12} lg={6}>
				<ExecutionBudgetTableTemplate
					title="Other Costs"
					initialData={[{ id: 2, expense_title: 'Safety Maintenance Cost', sub_total: 100 }]}
					initialValues={{ expense_title: '', sub_total: 0 }}
					_columnDefs={[
						{
							headerName: 'Expense Title',
							field: 'expense_title',
							flex: 3,
						},
						{
							headerName: 'Sub Total',
							field: 'sub_total',
							cellEditor: NumericEditor,
						},
					]}
				/>
			</Grid>
			<Grid item md={12} lg={6}>
				<ExecutionBudgetTableTemplate
					title="Vehicle Maintenance"
					initialData={[
						{
							id: 2,
							maintenance_title: 'Safety Maintenance Cost',
							count: 0,
							months: 0,
							fuel_fee: 0,
							transportation_cost: 0,
						},
					]}
					initialValues={{ maintenance_title: '', count: 0, months: 0, fuel_fee: 0, transportation_cost: 0 }}
					_columnDefs={[
						{
							headerName: 'Maintenance Title',
							field: 'maintenance_title',
							flex: 3,
						},
						{
							headerName: 'Count',
							field: 'count',
							cellEditor: NumericEditor,
						},
						{
							headerName: 'Months',
							field: 'months',
							cellEditor: DoublingEditor,
						},
						{
							headerName: 'Fuel Fee/ Mo',
							field: 'fuel_fee',
							cellEditor: NumericEditor,
						},
						{
							headerName: 'Transportation Cost / Mo',
							field: 'transportation_cost',
							cellEditor: NumericEditor,
						},
						{
							headerName: 'Sub Total',
							field: 'sub_total',
							editable: false,
							valueGetter: (params) =>
								params?.data?.sub_total ??
								params?.data?.count * params?.data?.months * params?.data?.fuel_fee * params?.data?.transportation_cost,
						},
					]}
				/>
			</Grid>
		</Grid>
	)
}

const ExecutionBudgetTableTemplate = ({ initialValues, _columnDefs, initialData, title }) => {
	const gridRef = useRef()
	const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), [])

	const DeleteCellRenderer = (params) => {
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
	const AddButton = () => (
		<Button color="secondary" onClick={handleClick}>
			<Iconify icon="material-symbols:add" width={20} height={20} />
		</Button>
	)

	const [rowData, setRowData] = useState(initialData)
	const [pinnedBottomRowData, setPinnedBottomRowData] = useState(initialValues)
	const fields = _columnDefs.map(({ field }) => field)
	fields.shift(1)
	if (fields.length > 1) fields.pop()
	const getTotals = (data) =>
		data.reduce((accumulator, currentValue) => {
			let product = 1
			fields.forEach((field) => {
				product *= currentValue[field]
			})
			return product + accumulator
		}, 0)

	useEffect(() => {
		setPinnedBottomRowData({ [_columnDefs[0].field]: 'Totals', sub_total: getTotals(rowData) })
	}, [_columnDefs, initialValues, rowData])

	const [columnDefs, setColumnDefs] = useState([
		..._columnDefs,
		{
			headerName: '',
			field: 'id',
			cellRendererSelector: (params) => !params.node.rowPinned && { component: DeleteCellRenderer },
			headerComponent: AddButton,
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

	const handleClick = () => {
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
				<div className="ag-theme-ddconst">
					<Stack gap={2}>
						<Typography sx={{ color: 'text.default' }} variant="h6" className="">
							{title}
						</Typography>

						<AgGridReact
							ref={gridRef}
							rowData={rowData}
							columnDefs={columnDefs}
							defaultColDef={defaultColDef}
							animateRows
							rowSelection={'multiple'}
							suppressRowClickSelection={true}
							domLayout="autoHeight"
							onCellEditRequest={onCellEditRequest}
							pinnedBottomRowData={[pinnedBottomRowData]}
							readOnlyEdit
						/>
						<Button variant="outlined" color="secondary" onClick={handleClick}>
							<Iconify icon="material-symbols:add" width={20} height={20} />
							Add Task
						</Button>
					</Stack>
				</div>
			</div>
		</>
	)
}
