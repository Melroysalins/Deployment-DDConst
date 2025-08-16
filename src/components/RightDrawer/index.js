import React, { useState } from 'react'
import Drawer from '@mui/material/Drawer'
import './customStyle.css'
import { Box, Divider, Stack, Typography, Button } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import DateRange from 'components/DateRange'
import QuickNavigation from 'components/QuickNavigation'
import CertificateLevel from 'components/CertificateLevel'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import SettingsTab from 'components/SettingsTab'
import ConfirmedStaff from 'components/ConfirmedStaff'
import RecommendedStaff from 'components/RecommendedStaff'
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded'
import { useTranslation } from 'react-i18next'

const RightDrawer = ({ isRightDrawerOpen, SetIsRightDrawerOPen, dataConfig, SetDataConfig, handleConfirmFilter }) => {
	const [isDateRangeOpen, SetIsDateRangeOpen] = useState(true)
	const [isSettingsTabOpen, SetIsSettingsTabOpen] = useState(true)
	const [isConfirmedStaffTabOpen, setIsConfirmedTabOpen] = useState(true)
	const [isRecommendedStaff, SetIsRecommendedStaff] = useState(true)

	const { t } = useTranslation(['workforce'])

	const handleConfirm = () => {
		console.log('Confirm ', dataConfig)
		handleConfirmFilter()
	}
	return (
		<>
			{/* <Drawer open={isRightDrawerOpen} onClose={() => SetIsRightDrawerOPen(!isRightDrawerOpen)} anchor="right"> */}
			<Box
				display={'flex'}
				flexDirection={'column'}
				style={{ width: '450px', height: '100vh' }}
				overflow={'scroll'}
				sx={{ scrollBehavior: 'smooth' }}
			>
				{/* <Stack direction={'row'} justifyContent={'space-between'} p={2} alignItems={'center'} cursor={'pointer'}>
					<h3>{t('Find Employees')}</h3>
					<CloseIcon style={{ cursor: 'pointer' }} onClick={() => SetIsRightDrawerOPen(!isRightDrawerOpen)} />
				</Stack> */}
				{/* <Divider /> */}

				<Box marginTop={1} flex={1} marginBottom={'38px'}>
					<Accordion expanded={true}>
						<AccordionSummary
							expandIcon={
								isDateRangeOpen ? (
									<KeyboardArrowDownIcon onClick={() => SetIsDateRangeOpen(!isDateRangeOpen)} />
								) : (
									<KeyboardArrowUpIcon onClick={() => SetIsDateRangeOpen(!isDateRangeOpen)} />
								)
							}
							aria-controls="panel1-content"
							id="panel1-header"
						>
							<Typography style={{ color: 'black', fontWeight: '600', fontSize: '19px' }}>{t('Date Range')}</Typography>
						</AccordionSummary>

						{isDateRangeOpen && (
							<AccordionDetails style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
								<DateRange dataConfig={dataConfig} SetDataConfig={SetDataConfig} />
								<QuickNavigation isProjectLeadComponent={false} dataConfig={dataConfig} SetDataConfig={SetDataConfig} />
								<CertificateLevel dataConfig={dataConfig} SetDataConfig={SetDataConfig} />
								<QuickNavigation isProjectLeadComponent={true} dataConfig={dataConfig} SetDataConfig={SetDataConfig} />
							</AccordionDetails>
						)}
					</Accordion>

					<Divider style={{ marginTop: '10px' }} />

					{/* setting tab  */}

					<Accordion expanded={true}>
						<AccordionSummary
							expandIcon={
								isSettingsTabOpen ? (
									<KeyboardArrowDownIcon onClick={() => SetIsSettingsTabOpen(!isSettingsTabOpen)} />
								) : (
									<KeyboardArrowUpIcon onClick={() => SetIsSettingsTabOpen(!isSettingsTabOpen)} />
								)
							}
							aria-controls="panel1-content"
							id="panel1-header"
						>
							<Typography style={{ color: 'black', fontWeight: '600', fontSize: '19px' }}>{t('Settings')}</Typography>
						</AccordionSummary>
						{isSettingsTabOpen && (
							<AccordionDetails style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
								<SettingsTab dataConfig={dataConfig} SetDataConfig={SetDataConfig} />
							</AccordionDetails>
						)}
					</Accordion>
					<Divider />

					{/* Confirmed staff  */}
					<Accordion expanded={true}>
						<AccordionSummary
							expandIcon={
								isConfirmedStaffTabOpen ? (
									<KeyboardArrowDownIcon onClick={() => setIsConfirmedTabOpen(!isConfirmedStaffTabOpen)} />
								) : (
									<KeyboardArrowUpIcon onClick={() => setIsConfirmedTabOpen(!isConfirmedStaffTabOpen)} />
								)
							}
							aria-controls="panel1-content"
							id="panel1-header"
						>
							<Typography style={{ color: 'black', fontWeight: '600', fontSize: '19px' }}>
								{t('Confirmed Staff')}
							</Typography>
						</AccordionSummary>
						{isConfirmedStaffTabOpen && (
							<AccordionDetails style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
								<ConfirmedStaff />
							</AccordionDetails>
						)}
					</Accordion>

					<Divider />

					{/*  Recommended Staff */}

					<Accordion expanded={true}>
						<AccordionSummary
							expandIcon={
								isRecommendedStaff ? (
									<KeyboardArrowDownIcon onClick={() => SetIsRecommendedStaff(!isRecommendedStaff)} />
								) : (
									<KeyboardArrowUpIcon onClick={() => SetIsRecommendedStaff(!isRecommendedStaff)} />
								)
							}
							aria-controls="panel1-content"
							id="panel1-header"
						>
							<Typography style={{ color: 'black', fontWeight: '600', fontSize: '19px' }}>
								{t('Recommended Staff')}
							</Typography>
						</AccordionSummary>
						{isRecommendedStaff && (
							<AccordionDetails>
								<RecommendedStaff />
							</AccordionDetails>
						)}
					</Accordion>

					<Divider />
				</Box>
			</Box>

			<Box
				sx={{ padding: '0px' }}
				position={'fixed'}
				bottom={'14px'}
				right={'0'}
				zIndex={'100'}
				backgroundColor={'white'}
			>
				<Box sx={{ display: 'flex', gap: '12px' }} p={0}>
					{/* Blue primary button */}
					<Button
						variant="contained"
						startIcon={<AutorenewRoundedIcon sx={{ fontSize: 18 }} />}
						sx={{
							backgroundColor: '#2563EB', // Blue
							'&:hover': { backgroundColor: '#1D4ED8' },
							textTransform: 'none',
							fontSize: '1rem',
							fontWeight: 500,
							borderRadius: '10px',
							minWidth: '180px',
							padding: '8px 16px',
							lineHeight: 1.5, // closer spacing
							justifyContent: 'flex-start', // align text+icon to left if needed
						}}
					>
						{t('Find Available Staff')}
					</Button>

					{/* Grey button */}
					<Button
						variant="contained"
						sx={{
							backgroundColor: '#E5E7EB', // Light grey
							color: '#2F3845', // Dark text
							'&:hover': { backgroundColor: '#D1D5DB' },
							textTransform: 'none',
							fontSize: '1rem',
							fontWeight: 600,
							borderRadius: '10px',
							boxShadow: 'none',
							padding: '0px',
							width: '97px',
							height: '61px',
						}}
						onClick={() => handleConfirm()}
					>
						{t('Confirm')}
					</Button>

					{/* White outlined button */}
					<Button
						variant="outlined"
						sx={{
							backgroundColor: '#fff',
							color: '#2F3845',
							borderColor: '#CBD5E1',
							'&:hover': {
								backgroundColor: '#F8FAFC',
								borderColor: '#CBD5E1',
							},
							textTransform: 'none',
							fontSize: '16px',
							fontWeight: 500,
							borderRadius: '10px',
							padding: '3px',
							paddingY: '5px',
							width: '130px',
						}}
					>
						{t('Save Search')}
					</Button>
				</Box>
			</Box>

			{/* </Drawer> */}
		</>
	)
}

export default RightDrawer
