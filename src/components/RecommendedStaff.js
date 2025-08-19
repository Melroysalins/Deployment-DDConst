import React, { useState } from 'react'
import {
	Box,
	Divider,
	Stack,
	Typography,
	Paper,
	Chip,
	Checkbox,
	Accordion,
	AccordionSummary,
	AccordionDetails,
} from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined'
import { useTranslation } from 'react-i18next'

const people = [
	{
		level: 'Special',
		isSpecial: true,
		employees: [
			{
				employeename: 'Kim Jinho',
				company: 'Daehan Construction',
				date: 'Apr 10 - May 30',
				isParticallyAvaiable: false,
				status: {
					status: 'Fully Available',
				},
			},
		],
	},
	{
		level: 'Level 1',
		isSpecial: false,
		employees: [
			{
				employeename: 'Park Minsu',
				company: 'Seoul Tech',
				date: 'Apr 10 - May 30',
				isOtherCompany: {
					company: 'Other Company',
				},
				isParticallyAvaiable: true,
				status: {
					status: 'Partially Available',
				},
			},
			{
				employeename: 'Lee Hajun',
				company: 'Daehan Construction',
				date: 'Apr 10 - May 30',
				isParticallyAvaiable: false,
				status: {
					status: 'Fully Available',
				},
			},
		],
	},
	{
		level: 'Level 2',
		isSpecial: true,
		employees: [
			{
				employeename: 'Choi Jiwon',
				company: 'Daehan Construction',
				date: 'Apr 10 - May 30',
				isParticallyAvaiable: false,
				status: {
					status: 'Fully Available',
				},
			},
		],
	},
	{
		level: 'Level 3',
		isSpecial: true,
		employees: [
			{
				employeename: 'Jung Sumin',
				company: 'Busan Tech',
				date: 'Apr 10 - May 30',
				isParticallyAvaiable: true,
				isOtherCompany: {
					company: 'Other Company',
				},
				status: {
					status: 'Fully Available',
				},
			},
			{
				employeename: 'Kim Minji',
				company: 'Daehan Construction',
				date: 'Apr 10 - May 30',
				isParticallyAvaiable: false,
				status: {
					status: 'Fully Available',
				},
			},
		],
	},
]

const RecommendedStaff = () => {
	const { t } = useTranslation(['workforce'])
	const [isSpecialRecommendedStaffOpen, SetIsSpecificRecommendedStaffOepn] = useState(true)
	return (
		<Box p={0} display={'flex'} flexDirection={'column'} gap={0}>
			{people?.map((item, index) => (
				<Accordion key={index} style={{ marginTop: '-8px' }}>
					<AccordionSummary
						expandIcon={
							isSpecialRecommendedStaffOpen ? (
								<KeyboardArrowDownIcon
									onClick={() => SetIsSpecificRecommendedStaffOepn(!isSpecialRecommendedStaffOpen)}
								/>
							) : (
								<KeyboardArrowUpIcon
									onClick={() => SetIsSpecificRecommendedStaffOepn(!isSpecialRecommendedStaffOpen)}
								/>
							)
						}
						aria-controls="panel1-content"
						id="panel1-header"
						style={{ fontWeight: '590', alignItems: 'center', gap: '10px', display: 'flex', fontSize: '13px' }}
					>
						{t(item?.level)}{' '}
						{item?.isSpecial && <CheckOutlinedIcon style={{ color: 'green', marginLeft: '4px', fontSize: '13px' }} />}
					</AccordionSummary>
					<AccordionDetails>
						<Box sx={{ backgroundColor: '#fff', cursor: 'pointer' }}>
							{item?.employees?.map((person, index) => (
								<Paper
									key={index}
									variant="outlined"
									sx={{
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
										p: '12px',
										mb: 1.5,
										borderRadius: 2,
										flexWrap: 'wrap',
										width: '100%',
										cursor: 'pointer',
										height: '100%',
									}}
								>
									<Box style={{ width: '100%' }}>
										<Stack direction={'row'} justifyContent={'space-between'}>
											<Typography variant="subtitle1" fontWeight="bold" style={{ fontSize: '14px' }}>
												{t(person.employeename)}
											</Typography>
											<Checkbox
												checked
												icon={<CheckIcon sx={{ display: 'none' }} />}
												checkedIcon={
													<Box
														sx={{
															width: 20,
															height: 20,
															borderRadius: '4px',
															backgroundColor: '#2563EB',
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'center',
														}}
													>
														<CheckIcon sx={{ color: '#fff', fontSize: 16 }} />
													</Box>
												}
											/>
										</Stack>
									</Box>

									<Box
										style={{
											display: 'flex',
											flexDirection: 'row',
											gap: '8px',

											flexWrap: 'wrap',
										}}
									>
										<Chip
											label={t(person.company)}
											sx={{
												backgroundColor: '#DBEAFE',
												color: '#2563EB',
												fontWeight: 500,
												mt: 1,
												fontSize: '12px',
												borderRadius: 1,
												height: '25px',
												cursor: 'pointer',
											}}
										/>
										{person?.isOtherCompany && (
											<Chip
												label={t(person.isOtherCompany?.company)}
												sx={{
													backgroundColor: '#F2F3F5',
													color: '#2F3845',
													fontWeight: 500,
													mt: 1,
													borderRadius: 1,
													height: '25px',
													cursor: 'pointer',
												}}
											/>
										)}
										{person?.status && (
											<Chip
												label={t(person.status?.status)}
												sx={{
													backgroundColor: person?.isParticallyAvaiable ? '#FEF9C3' : '#DCFCE7',
													color: '#2F3845',
													fontWeight: 500,
													mt: 1,
													borderRadius: 1,
													height: '25px',
													cursor: 'pointer',
												}}
											/>
										)}
									</Box>

									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginTop: '6px' }}>
										<Typography variant="body2" sx={{ color: '#6B7280', fontSize: '13px' }}>
											{t(person.date)}
										</Typography>
									</Box>
								</Paper>
							))}
						</Box>
					</AccordionDetails>
				</Accordion>
			))}
		</Box>
	)
}

export default RecommendedStaff
