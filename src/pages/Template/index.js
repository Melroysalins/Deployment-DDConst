import React, { useEffect, useRef } from 'react'
import { Spreadsheet, Worksheet, jspreadsheet } from '@jspreadsheet/react'
import 'jsuites/dist/jsuites.css'
import 'jspreadsheet/dist/jspreadsheet.css'
import { Box } from '@mui/material'
import SpreadSheet from 'pages/Dashboard/AddNewProject/Spreadsheet2'

const license =
	'MzkzZjE2NDQ3NWVhOTZjMzliMWExMjVlMzAxNzE4ZWJkYTI0YjIxNDBhMTg3MTRmNWUyODMxMTVlMjcxOTFkNzFjMTEyNmFkYmMzMTQzZjNhMmU4Mjg1OGQ1ZjliZGNiYzg0YTUxMWMwOTJkZDRmNjRhNzFhOTE2Nzk2YWRkZmMsZXlKamJHbGxiblJKWkNJNklpSXNJbTVoYldVaU9pSktjM0J5WldGa2MyaGxaWFFpTENKa1lYUmxJam94TnpRM01UTTFNek13TENKa2IyMWhhVzRpT2xzaWFuTndjbVZoWkhOb1pXVjBMbU52YlNJc0ltTnZaR1Z6WVc1a1ltOTRMbWx2SWl3aWFuTm9aV3hzTG01bGRDSXNJbU56WWk1aGNIQWlMQ0ozWldJaUxDSnNiMk5oYkdodmMzUWlYU3dpY0d4aGJpSTZJak0wSWl3aWMyTnZjR1VpT2xzaWRqY2lMQ0oyT0NJc0luWTVJaXdpZGpFd0lpd2lkakV4SWl3aVkyaGhjblJ6SWl3aVptOXliWE1pTENKbWIzSnRkV3hoSWl3aWNHRnljMlZ5SWl3aWNtVnVaR1Z5SWl3aVkyOXRiV1Z1ZEhNaUxDSnBiWEJ2Y25SbGNpSXNJbUpoY2lJc0luWmhiR2xrWVhScGIyNXpJaXdpYzJWaGNtTm9JaXdpY0hKcGJuUWlMQ0p6YUdWbGRITWlMQ0pqYkdsbGJuUWlMQ0p6WlhKMlpYSWlMQ0p6YUdGd1pYTWlYU3dpWkdWdGJ5STZkSEoxWlgwPQ=='

// Data
const data = [
	['Mazda', 2001, 2000],
	['Peugeot', 2010, 5000],
	['Honda Fit', 2009, 3000],
	['Honda CRV', 2010, 6000],
]
const columns = [
	{ title: 'Model', width: '300px' },
	{ title: 'Year', width: '80px' },
	{ title: 'Price', width: '100px' },
]
const Template = () => {
	const spreadsheet = useRef()
	useEffect(() => {
		jspreadsheet(document.getElementById('spreadsheet'), {
			worksheets: [{ minDimensions: [5, 5] }],
		})
	}, [])

	return (
		<Box>
			{' '}
			<Spreadsheet ref={spreadsheet} license={license} id="spreadsheet">
				<Worksheet data={data} columns={columns} />
			</Spreadsheet>
			{/* <SpreadSheet /> */}
		</Box>
	)
}

export default Template
