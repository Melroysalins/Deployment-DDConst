import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { Drawer, Logs } from 'components'
import Info from '../Info'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import Approvals from '../Approval/Approvals'
import RightDrawer from 'components/RightDrawer'
import 'components/RightDrawer/customStyle.css'

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

export default function BasicTabs({
	open,
	setopen,
	isRightDrawerOpen,
	SetIsRightDrawerOPen,
	dataConfig,
	SetDataConfig,
	handleConfirmFilter,
	isWorkForcePage,
}) {
	const [value, setValue] = React.useState(!isWorkForcePage ? 2 : 3)
	const { t } = useTranslation(['weekly_plan'])
	const handleChange = (event, newValue) => {
		setValue(newValue)
		console.log('Confirm FIlter called 2', newValue)
	}

	return (
		<Drawer open={open} setopen={setopen} headerIcon={'material-symbols:close'}>
			<Box sx={{ width: 450, maxWidth: 450, padding: '8px' }}>
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
						{!isWorkForcePage && <Tab label={t('info')} {...a11yProps(0)} />}
						{!isWorkForcePage && <Tab label={t('logs')} {...a11yProps(1)} />}
						<Tab label={t('Find Employee')} />
						{/* <Tab label={t('approvals')} /> */}
						{/* icon={<SettingsOutlinedIcon sx={{ width: 18 }} />} iconPosition="end" */}
					</Tabs>
				</Box>
				{!isWorkForcePage && (
					<TabPanel value={value} index={0}>
						<Info />
					</TabPanel>
				)}

				{!isWorkForcePage && (
					<TabPanel value={value} index={1}>
						<Logs />
					</TabPanel>
				)}

				{isWorkForcePage && (
					<TabPanel value={value} index={3}>
						<RightDrawer
							isRightDrawerOpen={isRightDrawerOpen}
							SetIsRightDrawerOPen={SetIsRightDrawerOPen}
							dataConfig={dataConfig}
							SetDataConfig={SetDataConfig}
							handleConfirmFilter={handleConfirmFilter}
						/>
					</TabPanel>
				)}

				<TabPanel value={value} index={2}>
					{/* <Approval setopen={setopen} /> */}
					<Approvals setopen={setopen} />
				</TabPanel>
			</Box>
		</Drawer>
	)
}
