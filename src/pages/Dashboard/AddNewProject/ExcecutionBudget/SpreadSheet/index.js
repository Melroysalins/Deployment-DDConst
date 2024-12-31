import React, { useEffect, useRef, useState } from 'react'
import { jspreadsheet } from '@jspreadsheet/react'

import 'jsuites/dist/jsuites.css'
import 'jspreadsheet/dist/jspreadsheet.css'
import 'material-icons/iconfont/material-icons.css'
import { createNewSpreadsheet, getSpreadsheetByProjectAndType, updateSpreadsheet } from 'supabase/spreadsheets'
import { Button } from '@mui/material'
import { useParams } from 'react-router-dom'

jspreadsheet.setLicense(
	'ODQ5NjVmNTViYTUwMzMxMDEwZDQzZTQ5MjNhZjljMTQyNTYxMDdiOGEzZGY0NzVlZTQxYzcxM2M4YjI1OWU1YzY3YmQwNWM1OGFjN2IxOGRjZTJjZmQzNzAxMzEyNjkwYThhNWNlMThhZDZmN2RmYTVjZTk2MTNmMjVlMzkzNzEsZXlKamJHbGxiblJKWkNJNklqVTJNR1UyWlRRMk5HSXdaalJtWWpreVptVmtNVFExTURSbU9XTTFNR0U1TURrM01qbGxPVGtpTENKdVlXMWxJam9pVkdGc2FHRWdUWFZ6ZEdGbVlTSXNJbVJoZEdVaU9qRTNNelUxTVRZNE1EQXNJbVJ2YldGcGJpSTZXeUozWldJaUxDSnNiMk5oYkdodmMzUWlYU3dpY0d4aGJpSTZNekVzSW5OamIzQmxJanBiSW5ZM0lpd2lkamdpTENKMk9TSXNJbll4TUNJc0luWXhNU0lzSW1admNtMTFiR0VpTENKbWIzSnRjeUlzSW5KbGJtUmxjaUlzSW5CaGNuTmxjaUlzSW1sdGNHOXlkR1Z5SWl3aWMyVmhjbU5vSWl3aVkyOXRiV1Z1ZEhNaUxDSjJZV3hwWkdGMGFXOXVjeUlzSW1Ob1lYSjBjeUlzSW5CeWFXNTBJaXdpWW1GeUlpd2ljMmhsWlhSeklpd2ljMmhoY0dWeklpd2ljMlZ5ZG1WeUlsMTk='
)

const worksheets = [
	{
		worksheetName: 'Consumables',
		nestedHeaders: [
			[
				{
					title: 'Consumables',
					colspan: '10',
				},
			],
		],
		minDimensions: [4, 3],
		data: [
			['EB-A', 1, 1, '=B1*C1'],
			['', null, null, '=B2*C2'],
			['Total', null, null, '=SUM(D1:D2)'],
		],
		columns: [
			{ title: 'Junction Box', width: '200px' },
			{ title: 'Count', width: '200px' },
			{ title: 'Unit Price', width: '200px' },
			{ title: 'SubTotal', width: '200px' },
		],
		allowInsertColumn: false,
		allowManualInsertColumn: false,
		allowDeleteColumn: false,
		allowRenameColumn: false,
		toolbar: false, // Removed toolbar from worksheet
	},
]

export default function SpreadSheet() {
	const spreadsheet = useRef(null)
	const { id } = useParams()
	const [gridInstance, setGridInstance] = useState(null)
	const [styleSheetId, setstyleSheetId] = useState(null)

	// Initialize the spreadsheet
	useEffect(() => {
		const grid = window.jspreadsheet(spreadsheet.current, {
			tabs: true,
			worksheets,
			oninsertrow: (instance, cell) => {
				const lastRowNum = instance.getData().length - 1
				const currentRowNum = cell[0].row
				if (currentRowNum !== lastRowNum) {
					// Add Data and Update the last Row
					instance.setRowData(currentRowNum, ['', 1, 1, `=B${currentRowNum + 1}*C${currentRowNum + 1}`])
					instance.setRowData(lastRowNum, ['Total', null, null, `=SUM(D1:D${lastRowNum})`])
				} else {
					// Last row ("Total") adjustment logic
					// instance.setRowData(lastRowNum, instance.getRowData(lastRowNum - 1))
					instance.setRowData(lastRowNum, ['Total', null, null, `=SUM(D1:D${lastRowNum})`])
					instance.setRowData(lastRowNum - 1, ['', 1, 1, `=B${currentRowNum}*C${currentRowNum}`])
				}
				// instance.updateCell(lastRowNum, 2, `=SUM(D1:D${lastRowNum})`)
			},
		})
		setGridInstance(grid)
		return () => {
			window.jspreadsheet.destroyAll()
		}
	}, [])

	useEffect(() => {
		const clone = async () => {
			const { data } = await getSpreadsheetByProjectAndType(id, false)
			const config = data?.data || {}

			if (!config?.worksheets || config?.worksheets.length === 0) {
				console.error('No worksheets data available')
				return
			}
			setstyleSheetId(data.id)
			window.jspreadsheet.destroy(spreadsheet.current)
			const newGridInstance = window.jspreadsheet(spreadsheet.current, config)
			setGridInstance(newGridInstance)
		}

		if (id) {
			clone()
		}
	}, [id])

	const handleSave = async () => {
		// All Sheet Data
		const object = { data: gridInstance[0].parent.getConfig(), project: id, consumablesData: gridInstance[0].data(), isFromSpreadsheetTwo: false }
		let result = null
		if (styleSheetId) {
			result = await updateSpreadsheet(object, styleSheetId)
		} else {
			result = await createNewSpreadsheet(object)
		}
		setstyleSheetId(result?.data?.[0]?.id)
	}

	return (
		<>
			<div>
				<Button
					sx={{
						float: 'right',
					}}
					variant="contained"
					onClick={handleSave}
				>
					{styleSheetId ? 'Update' : 'Save'}
				</Button>
			</div>
			<div ref={spreadsheet} />
		</>
	)
}
