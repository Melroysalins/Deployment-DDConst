import React from 'react'
import { Box, Divider, Stack, Typography, Paper, Chip, Checkbox } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import { useTranslation } from 'react-i18next'

const StaffInformation = [
	{
		title: 'Leader',
		status: 'Unconfirmed',
		isStatus: false,
	},
	{
		title: 'Special',
		status: 'Confirmed',
		isStatus: true,
	},
	{
		title: 'Level 1',
		status: 'Unconfirmed',
		isStatus: false,
	},
	{
		title: 'Level 2',
		status: 'Confirmed',
		isStatus: true,
	},
	{
		title: 'Level 3',
		status: 'Unconfirmed',
		isStatus: false,
	},
]

const people = [
	{ name: 'Kim Jinho', company: 'Daehan Construction', date: 'Apr 10 - May 30' },
	{ name: 'Choi Jiwon', company: 'Daehan Construction', date: 'Apr 10 - May 30' },
]

const ConfirmedStaff = () => {
	const { t } = useTranslation(['workforce'])
	return (
		<Box style={{ display: 'flex', flexDirection: 'column' }}>
			<Box style={{ display: 'flex', flexDirection: 'row' }}>
				<React.Fragment key={101}>
					<Stack
						direction="row"
						alignItems="center"
						justifyContent="space-between"
						overflow={'scroll'}
						sx={{
							'&::-webkit-scrollbar': {
								display: 'none',
							},
							msOverflowStyle: 'none', // IE and Edge
							scrollbarWidth: 'none', // Firefox
							py: 1,
						}}
						gap={3}
					>
						{StaffInformation?.map((item, index) => (
							<Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
								<Typography variant="body1" sx={{ fontWeight: 590, fontSize: '14px', alignContent: 'center' }}>
									{t(item?.title)}
								</Typography>
								<Typography
									variant="body2"
									sx={{
										fontSize: '12px',
										height: '20px',
										padding: '4px',
										width: '105px',
										background: !item?.isStatus ? '#FEF9C3' : '#DCFCE7',
										color: !item?.isStatus ? '#804808' : '#166534',
										borderRadius: '10px',
										cursor: 'pointer',
										display: 'flex',
										alignItems: 'center',
										textAlign: 'center',
										justifyContent: 'center',
									}}
								>
									{t(item?.status)}
								</Typography>
							</Box>
						))}
					</Stack>
				</React.Fragment>
			</Box>
			<Box sx={{ p: 2, backgroundColor: '#fff' }}>
				{people.map((person, index) => (
					<Paper
						key={index}
						variant="outlined"
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							p: 2,
							mb: 1.5,
							borderRadius: 2,
							height: '85px',
						}}
					>
						<Box>
							<Stack direction={'row'} width={'280px'} alignItems={'center'} justifyContent={'space-between'}>
								<Typography variant="subtitle1" fontWeight="bold" fontSize={'14px'}>
									{t(person.name)}
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

							<Stack direction={'row'} width={'280px'} alignItems={'center'} justifyContent={'space-between'}>
								<Chip
									label={t(person.company)}
									sx={{
										backgroundColor: '#DBEAFE',
										color: '#2563EB',
										fontWeight: 500,
										mt: 0.5,
										fontSize: '12px',
										borderRadius: 1,
										height: '25px',
									}}
								/>
								<Typography variant="body2" sx={{ color: '#6B7280', fontSize: '12px' }}>
									{person.date}
								</Typography>
							</Stack>
						</Box>
					</Paper>
				))}

				<Box sx={{ mt: 2 }}>
					<Typography variant="subtitle1" fontWeight="bold" fontSize={'13px'}>
						{t('Level 1 Unconfirmed Period')}
					</Typography>
					<Typography variant="body2" sx={{ color: '#6B7280', fontSize: '13px' }}>
						Apr 15 - May 15
					</Typography>
				</Box>
			</Box>
		</Box>
	)
}

export default ConfirmedStaff
