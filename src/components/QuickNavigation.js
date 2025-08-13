import React, { useState } from 'react'
import { TextField, InputAdornment, Box, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'

const NavigationInfo = ['1 Month', '2 Months', 'This Year', 'All Project']
const ProjectLeadCertificateInfo = ['Special', 'Level 1', 'Level 2', 'Level 3']

const QuickNavigation = ({ isProjectLeadComponent, dataConfig, SetDataConfig }) => {
	const [selectedQuickNavigation, SetSelectedQuickNavigation] = useState('')
	const [selectedProjectLead, SetSelectedProjectLead] = useState([])
	const { t } = useTranslation(['workforce'])

	const { quickNav, Speical, Tier1, Tier2, Tier3, projectLeadCertificate, startDate, endDate } = dataConfig

	const start_Date = dayjs(startDate)

	const end_Date = dayjs(endDate)

	let differenceInMonth = null

	const handleQuickNavigation = (key, item) => {
		SetDataConfig((prev) => ({
			...prev,
			[key]: item,
		}))
	}

	const handleLeadCertificate = (item) => {
		SetDataConfig((prev) => ({
			...prev,
			projectLeadCertificate: !prev?.projectLeadCertificate?.includes(item)
				? [item, ...prev.projectLeadCertificate]
				: prev?.projectLeadCertificate.filter((ele) => ele !== item),
		}))
	}

	if (startDate && endDate) {
		differenceInMonth = end_Date.diff(startDate, 'months')
		console.log('Yes startDate & endDate is present', startDate, endDate, differenceInMonth)
	} else {
		console.log('Yes No StartDate & endDate is not present ', startDate, endDate)
	}

	if (!isProjectLeadComponent) {
		return (
			<Stack direction={'row'} width={'100%'} marginTop={3} alignItems={'center'} alignContent={'center'}>
				<Box style={{ display: 'flex', width: '25%' }}>
					<span style={{ fontFamily: 'sans-serif', fontSize: '17px' }}>Quick Nav :</span>
				</Box>
				<Stack
					width={'75%'}
					overflow={'scroll'}
					direction={'row'}
					sx={{
						'&::-webkit-scrollbar': {
							display: 'none',
						},
						msOverflowStyle: 'none', // IE and Edge
						scrollbarWidth: 'none', // Firefox
					}}
				>
					<Stack direction={'row'} gap={2} style={{ cursor: 'pointer' }}>
						{NavigationInfo?.map((item, index) => (
							<Typography
								key={index}
								height={'40px'}
								border={'1px solid #CBD5E1'}
								width={'105px'}
								textAlign={'center'}
								alignContent={'center'}
								borderRadius={'20px'}
								style={{
									cursor: 'pointer',
									background: selectedQuickNavigation === item || quickNav === item ? '#3B82F6' : '',
									color: selectedQuickNavigation === item || quickNav === item ? 'white' : '',
								}}
								onClick={() => {
									SetSelectedQuickNavigation(item)
									handleQuickNavigation('quickNav', item)
								}}
							>
								{t(item)}
							</Typography>
						))}
					</Stack>
				</Stack>
			</Stack>
		)
	}

	return (
		<Box display={'flex'} flexDirection={'column'} marginTop={'15px'}>
			<Box style={{ display: 'flex' }}>
				<h4 style={{ color: 'black', fontWeight: '600', fontSize: '19px' }}>Possible Project Lead Certificate Tier</h4>
			</Box>
			<Stack
				width={'100%'}
				overflow={'scroll'}
				direction={'row'}
				sx={{
					'&::-webkit-scrollbar': {
						display: 'none',
					},
					msOverflowStyle: 'none', // IE and Edge
					scrollbarWidth: 'none', // Firefox
				}}
				marginTop={'15px'}
			>
				<Stack direction={'row'} gap={2} style={{ cursor: 'pointer' }}>
					{ProjectLeadCertificateInfo?.map((item, index) => (
						<Typography
							key={index}
							height={'40px'}
							border={'1px solid #CBD5E1'}
							width={'85px'}
							textAlign={'center'}
							alignContent={'center'}
							borderRadius={'20px'}
							style={{
								cursor: 'pointer',
								background: selectedProjectLead?.includes(item) ? '#3B82F6' : '',
								color: selectedProjectLead?.includes(item) ? 'white' : '',
							}}
							onClick={() => {
								handleLeadCertificate(item)
								if (selectedProjectLead?.includes(item)) {
									const filteredProjectLeadInfo = selectedProjectLead?.filter((ele) => ele !== item)

									SetSelectedProjectLead(filteredProjectLeadInfo)
								} else {
									SetSelectedProjectLead((prev) => [...prev, item])
								}
							}}
						>
							{t(item)}
						</Typography>
					))}
				</Stack>
			</Stack>
		</Box>
	)
}

export default QuickNavigation
