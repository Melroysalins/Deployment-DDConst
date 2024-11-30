import React from 'react'
import ExecutionBudget from './ExcecutionBudget'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import SpreadSheet from './SpreadSheet'

function Main() {
	const [value, setValue] = React.useState(0)
	const handleChange = (_, newValue) => {
		setValue(newValue)
	}

	return (
		<>
			<Tabs variant="fullWidth" value={value} onChange={handleChange}>
				<Tab label="Current flow" />
				<Tab label="New Xl Sheet flow" />
			</Tabs>
			<br />
			{!value ? <ExecutionBudget /> : <SpreadSheet />}
		</>
	)
}

export default Main
