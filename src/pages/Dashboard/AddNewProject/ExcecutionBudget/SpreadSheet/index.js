import React, { useEffect, useRef, useState } from 'react'
import { jspreadsheet } from '@jspreadsheet/react'

import 'jsuites/dist/jsuites.css'
import 'jspreadsheet/dist/jspreadsheet.css'
import 'material-icons/iconfont/material-icons.css'
import { createNewSpreadsheet, getSpreadsheetByProject, updateSpreadsheet } from 'supabase/spreadsheets'
import { Button } from '@mui/material'
import { useParams } from 'react-router-dom'

jspreadsheet.setLicense(
	'ZGIyOTJhNzQ4YmIxN2UyYzYzNmNhNTg0NmU5MDRkOTU1ODBkZGU3MDlmOGU2NTM3YjgxYmM5ZmJjNThjZTU1MjcwZTViMmY3NjMyNThiYzAzYzk4NWQ3NTdmMWFhNDdlNTcwOTBiYjQyMjU4ZjY3Mjg4MzdmMWQwMGRiZTczZjMsZXlKamJHbGxiblJKWkNJNklqUTFPVE0yWlRRMk5HSXdaalJtWWpreVptVmtNVFExTURSbU9XTTFNR0U1TURrM01qbGxPVGtpTENKdVlXMWxJam9pVkdGc2FHRWdUWFZ6ZEdGbVlTSXNJbVJoZEdVaU9qRTNNelUxTVRZNE1EQXNJbVJ2YldGcGJpSTZXeUozWldJaUxDSnNiMk5oYkdodmMzUWlYU3dpY0d4aGJpSTZNekVzSW5OamIzQmxJanBiSW5ZM0lpd2lkamdpTENKMk9TSXNJbll4TUNJc0luWXhNU0lzSW1admNtMTFiR0VpTENKbWIzSnRjeUlzSW5KbGJtUmxjaUlzSW5CaGNuTmxjaUlzSW1sdGNHOXlkR1Z5SWl3aWMyVmhjbU5vSWl3aVkyOXRiV1Z1ZEhNaUxDSjJZV3hwWkdGMGFXOXVjeUlzSW1Ob1lYSjBjeUlzSW5CeWFXNTBJaXdpWW1GeUlpd2ljMmhsWlhSeklpd2ljMmhoY0dWeklpd2ljMlZ5ZG1WeUlsMTk='
)

const minDimensions = [11, 11]

export default function SpreadSheet() {
	const spreadsheet = useRef(null)
	const { id } = useParams()
	const [gridInstance, setGridInstance] = useState(null)
	const [styleSheetId, setstyleSheetId] = useState(null)

	// Initialize the spreadsheet
	useEffect(() => {
		const grid = window.jspreadsheet(spreadsheet.current, {
			tabs: true,
			toolbar: true,
			worksheets: [
				{
					minDimensions,
				},
			],
		})
		setGridInstance(grid)

		return () => {
			window.jspreadsheet.destroyAll()
		}
	}, [])

	useEffect(() => {
		const clone = async () => {
			const { data } = await getSpreadsheetByProject(id)
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
		const config = gridInstance[0].parent.getConfig()
		const object = { data: config, project: id }
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
