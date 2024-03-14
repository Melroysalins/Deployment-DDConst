import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { Drawer } from 'components'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import FilterListIcon from '@mui/icons-material/FilterList'
import TuneIcon from '@mui/icons-material/Tune'
import Filters from '../Filters'
import Settings from '../Settings'

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

BasicTabs.propTypes = {
	open: PropTypes.bool,
	setopen: PropTypes.func,
}

export default function BasicTabs({ open, setopen }) {
	const [value, setValue] = React.useState(0)
	const { t } = useTranslation()
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
							'.MuiButtonBase-root': {
								minHeight: 'auto',
							},
						}}
						value={value}
						onChange={handleChange}
						textColor="secondary"
						indicatorColor="secondary"
					>
						<Tab label={t('filters')} icon={<FilterListIcon sx={{ width: 18 }} />} iconPosition="start" />
						<Tab label={t('settings')} icon={<TuneIcon sx={{ width: 18 }} />} iconPosition="start" />
					</Tabs>
				</Box>
				<TabPanel value={value} index={0}>
					<Filters setopen={setopen} />
				</TabPanel>
				<TabPanel value={value} index={1}>
					<Settings />
				</TabPanel>
			</Box>
		</Drawer>
	)
}
