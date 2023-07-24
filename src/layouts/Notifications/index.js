import useMain from 'pages/context/context'
import React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import LeftDrawer from 'components/LeftDrawer'
import Messages from './Messages'
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

export default function Notifications() {
	const { openNotification, setopenNotification } = useMain()
	const [value, setValue] = React.useState(0)

	const handleChange = (event, newValue) => {
		setValue(newValue)
	}

	return (
		<LeftDrawer
			open={openNotification}
			setopen={setopenNotification}
			headerText={'Inbox'}
			onBack={() => setopenNotification(false)}
		>
			<Box>
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
						<Tab label="All" {...a11yProps(0)} />
						<Tab label="Unread" {...a11yProps(1)} />
						<Tab label="Tasks" />
					</Tabs>
				</Box>
				<TabPanel value={value} index={0}>
					<Messages />
				</TabPanel>
				<TabPanel value={value} index={1}>
					<Messages />
				</TabPanel>
				<TabPanel value={value} index={2}>
					<Messages />
				</TabPanel>
			</Box>
		</LeftDrawer>
	)
}
