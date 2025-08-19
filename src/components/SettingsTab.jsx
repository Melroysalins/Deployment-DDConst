import React, { useState } from 'react'
import { TextField, InputAdornment, Box, Stack, Typography, Switch, Divider } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { styled } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'

const AvailabilityInfo = ['All', 'Fully Available', 'Partially Available']
const RadioButtonsInfo = [
	// {
	// 	title: 'Allow Split Assignment',
	// 	subtitle: 'Meet availability with multiple employee',
	// },
	{
		title: 'Allow Higher Tier',
		subtitle: 'Use higher tier staff when no match found',
		key: 'allowHigherTier',
	},
	{
		title: 'Allow Lower Tier',
		subtitle: 'Use lower tier staff when no match found',
		key: 'allowLowerTier',
	},
	{
		title: 'Allow Other Companies Staff',
		subtitle: 'Permit assignment of staff from other companies',
		key: 'allowOtherCompaniesStaff',
	},
	// {
	// 	title: 'Allow-select Single Recommendation',
	// 	subtitle: 'Select & show only one recommendation',
	// },
]

const CustomSwitch = styled(Switch)(({ theme }) => ({
	padding: 8,
	'& .MuiSwitch-track': {
		borderRadius: 20,
		height: '16px',
		backgroundColor: '#CBD5E1', // off state track color
		opacity: 1,
		transition: theme.transitions.create(['background-color'], {
			duration: 200,
		}),
	},
	'& .MuiSwitch-switchBase': {
		padding: 2,
		marginTop: '4px',
		left: '7px',
		'&.Mui-checked': {
			transform: 'translateX(16px)',
			marginTop: '4px',
			color: '#fff',
			'& + .MuiSwitch-track': {
				backgroundColor: '#2563EB', // on state track color
				opacity: 1,
			},
		},
	},
	'& .MuiSwitch-thumb': {
		boxShadow: 'none',
		width: 19,
		height: 19,
	},
}))

const SettingsTab = ({ dataConfig, SetDataConfig }) => {
	const [switches, setSwitches] = useState(Array(RadioButtonsInfo.length).fill(false))
	const [availabilityInfo, SetAvailabilityInfo] = useState('')
	const { t } = useTranslation(['workforce'])

	const { availability, allowHigherTier, allowLowerTier } = dataConfig
	const handleToggle = (index, event, key) => {
		setSwitches((prev) => {
			const newState = [...prev]
			newState[index] = !newState[index]
			return newState
		})

		SetDataConfig((prev) => ({
			...prev,
			[key]: event.target.checked,
		}))
	}

	const handleAvailability = (key, value) => {
		SetDataConfig((prev) => ({
			...prev,
			[key]: value,
		}))
	}

	return (
		<Box display={'flex'} flexDirection={'column'} marginTop={'0px'}>
			<Box style={{ display: 'flex' }}>
				<h4 style={{ color: 'black', fontWeight: '500', fontSize: '15px' }}>{t('Availability')}</h4>
			</Box>
			<Stack
				width={'auto'}
				direction={'row'}
				sx={{
					'&::-webkit-scrollbar': {
						display: 'none',
					},
					msOverflowStyle: 'none', // IE and Edge
					scrollbarWidth: 'none', // Firefox
				}}
				marginTop={'8px'}
			>
				<Stack
					direction={'row'}
					gap={2}
					style={{
						'&::-webkit-scrollbar': {
							display: 'none',
						},
						msOverflowStyle: 'none', // IE and Edge
						scrollbarWidth: 'none', // Firefox
						cursor: 'pointer',
						overflowX: 'scroll',
						overflowY: 'none',
					}}
				>
					{AvailabilityInfo?.map((item, index) => (
						<Typography
							key={index}
							height={'30px'}
							border={'1px solid #CBD5E1'}
							textAlign={'center'}
							width={'120px'}
							alignContent={'center'}
							borderRadius={'10px'}
							style={{
								cursor: 'pointer',
								fontSize: '12px',
								background: availability === item ? '#3B82F6' : '',
								color: availability === item ? 'white' : '',
							}}
							fontSize={'15px'}
							onClick={() => {
								SetAvailabilityInfo(item)
								handleAvailability('availability', item)
							}}
						>
							{t(item)}
						</Typography>
					))}
				</Stack>
			</Stack>
			<Box mt={4} display={'flex'} flexDirection={'column'} gap={'10px'}>
				{RadioButtonsInfo.map((item, index) => (
					<React.Fragment key={index}>
						<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 1 }}>
							<Box>
								<Typography
									variant="body1"
									sx={{ fontWeight: 550, fontSize: '14px', alignContent: 'center', fontFamily: 'sans-serif' }}
								>
									{t(item.title)} <InfoOutlinedIcon fontSize="14px" style={{ color: '#94A3B8' }} />
								</Typography>
								<Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '11px' }}>
									{t(item.subtitle)}
								</Typography>
							</Box>
							<CustomSwitch checked={dataConfig[item?.key]} onChange={(e) => handleToggle(index, e, item?.key)} />
						</Stack>
						{index < RadioButtonsInfo.length - 1 && <Divider sx={{ borderColor: '#E2E8F0' }} />}
					</React.Fragment>
				))}

				{/* <Typography style={{ fontSize: '14px', color: '#2563EB', cursor: 'pointer', fontFamily: 'sans-serif' }}>
					View Recommendation Logic
				</Typography> */}
			</Box>
		</Box>
	)
}

export default SettingsTab
