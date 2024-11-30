import React, { useEffect, useRef, useState } from 'react'
import { jspreadsheet } from '@jspreadsheet/react'

import 'jsuites/dist/jsuites.css'
import 'jspreadsheet/dist/jspreadsheet.css'
import 'material-icons/iconfont/material-icons.css'
import { createNewSpreadsheet, getSpreadsheetByProject, updateSpreadsheet } from 'supabase/spreadsheets'
import { Button } from '@mui/material'
import { useParams } from 'react-router-dom'

jspreadsheet.setLicense(
	'ZmI4OWRjNjE3NDQ1YWZmOTJhM2RmYTI2OTkzMWRhNTEyYjM4ZTZmNWExMDY2NWZiOWY3ZmI3Y2M3M2EyZDNkZWJkNjFiNWQ5Y2VmNWUxMmE5ODVhZjNkNzdhNWQyNmMxNGFlYTA4YzgxZGQ0YjE2Yjk4MDU0Njc4NDkxNjE4NjYsZXlKamJHbGxiblJKWkNJNklpSXNJbTVoYldVaU9pSktjM0J5WldGa2MyaGxaWFFpTENKa1lYUmxJam94TnpNek1EVXhPRGMxTENKa2IyMWhhVzRpT2xzaWFuTndjbVZoWkhOb1pXVjBMbU52YlNJc0ltTnZaR1Z6WVc1a1ltOTRMbWx2SWl3aWFuTm9aV3hzTG01bGRDSXNJbU56WWk1aGNIQWlMQ0ozWldJaUxDSnNiMk5oYkdodmMzUWlYU3dpY0d4aGJpSTZJak0wSWl3aWMyTnZjR1VpT2xzaWRqY2lMQ0oyT0NJc0luWTVJaXdpZGpFd0lpd2lkakV4SWl3aVkyaGhjblJ6SWl3aVptOXliWE1pTENKbWIzSnRkV3hoSWl3aWNHRnljMlZ5SWl3aWNtVnVaR1Z5SWl3aVkyOXRiV1Z1ZEhNaUxDSnBiWEJ2Y25SbGNpSXNJbUpoY2lJc0luWmhiR2xrWVhScGIyNXpJaXdpYzJWaGNtTm9JaXdpY0hKcGJuUWlMQ0p6YUdWbGRITWlMQ0pqYkdsbGJuUWlMQ0p6WlhKMlpYSWlMQ0p6YUdGd1pYTWlYU3dpWkdWdGJ5STZkSEoxWlgwPQ=='
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
