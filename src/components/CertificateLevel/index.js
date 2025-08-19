import { Box, Stack, TextField, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

/* eslint-disable react/prop-types */
const CertificateLevel = ({ dataConfig, SetDataConfig }) => {
	const cetficiationLevel = [
		{
			value: 'Special',
			key: 'Special',
			label: 'Special',
		},
		{
			value: 'Level1',
			key: 'Level1',
			label: 'Level 1',
		},
		{
			value: 'Level2',
			key: 'Level2',
			label: 'Level 2',
		},
		{
			value: 'Level3',
			key: 'Level3',
			label: 'Level 3',
		},
	]

	const { Special, Level1, Level2, Level3 } = dataConfig

	const { t } = useTranslation(['workforce'])

	const handleInputChange = (key, value) => {
		SetDataConfig((prev) => ({
			...prev,
			[key]: Number(value),
		}))
	}

	return (
		<Box display={'flex'} flexDirection={'column'} marginTop={'12px'}>
			<Box style={{ display: 'flex' }}>
				<h4 style={{ color: 'black', fontWeight: '600', fontSize: '15px' }}>{t('Certification Level Requirements')}</h4>
			</Box>
			<Box mt={2} display={'flex'} flexDirection={'row'} gap={'12px'}>
				<Stack
					direction={'row'}
					height={'80px'}
					alignContent={'center'}
					alignItems={'center'}
					width={'100%'}
					mt={1}
					gap={2}
				>
					{cetficiationLevel?.map((level, index) => (
						<Box
							key={level}
							sx={{
								backgroundColor: '#F8FAFC',
								borderRadius: '12px',
								padding: '16px',
								textAlign: 'center',
								width: '90px',
								height: '92px',
							}}
						>
							<Typography variant="subtitle1" sx={{ fontWeight: '500', fontSize: '11px', mb: 1 }}>
								{t(level?.label)}
							</Typography>

							<TextField
								defaultValue={dataConfig[level?.key] || 0}
								inputProps={{
									style: {
										textAlign: 'center',
										fontSize: '14px',
										fontWeight: 500,
										padding: '6px 0',
									},
								}}
								onChange={(e) => handleInputChange(level?.key, e.target.value)}
								variant="outlined"
								sx={{
									'& .MuiOutlinedInput-root': {
										borderRadius: '8px',
										'& fieldset': {
											borderColor: '#CBD5E1',
										},
										'&:hover fieldset': {
											borderColor: '#CBD5E1',
										},
										'&.Mui-focused fieldset': {
											borderColor: '#CBD5E1',
										},
									},
									width: '100%',
								}}
							/>
						</Box>
					))}
				</Stack>
			</Box>
		</Box>
	)
}

export default CertificateLevel

/* eslint-disable react/prop-types */
