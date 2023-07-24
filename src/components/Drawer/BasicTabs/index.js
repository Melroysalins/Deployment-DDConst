import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { Drawer, Logs } from 'components'
import Approval from '../Approval'
import Info from '../Info'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import PropTypes from 'prop-types'

TabPanel.propTypes = {
	children: PropTypes.node,
	value: PropTypes.number,
	index: PropTypes.number,
}

function TabPanel(props) {
	const { children, value, index, ...other } = props

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{ p: 3 }}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	)
}

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	}
}

BasicTabs.propTypes = {
	open: PropTypes.bool,
	setopen: PropTypes.func,
}

export default function BasicTabs({ open, setopen }) {
	const [value, setValue] = React.useState(2)

	const handleChange = (event, newValue) => {
		setValue(newValue)
	}

	return (
		<Drawer open={open} setopen={setopen} headerIcon={'material-symbols:close'}>
			<Box sx={{ width: 380, maxWidth: 420 }}>
				<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
					<Tabs
						sx={{
							'.MuiTabs-flexContainer': {
								justifyContent: 'space-evenly',
							},
						}}
						value={value}
						onChange={handleChange}
						textColor="secondary"
						indicatorColor="secondary"
					>
						<Tab label="Info" {...a11yProps(0)} />
						<Tab label="Logs" {...a11yProps(1)} />
						<Tab icon={<SettingsOutlinedIcon sx={{ width: 18 }} />} iconPosition="end" label="Approval" />
					</Tabs>
				</Box>
				<TabPanel value={value} index={0}>
					<Info />
				</TabPanel>
				<TabPanel value={value} index={1}>
					<Logs />
				</TabPanel>
				<TabPanel value={value} index={2}>
					<Approval setopen={setopen} />
				</TabPanel>
			</Box>
		</Drawer>
	)
}
