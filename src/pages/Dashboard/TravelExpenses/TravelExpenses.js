import React, { useState } from 'react'
import '@mobiscroll/react/dist/css/mobiscroll.min.css'
import { styled } from '@mui/material/styles'
import { Avatar, Typography, Box, Button as MuiButton } from '@mui/material'
import { useTranslation } from 'react-i18next'
import './calendar.scss'

// components
import Header from './Header'
import { Loader } from 'reusables'
import Drawer from './Drawer'
import Timeline from './Timeline'
import { Filters } from 'components'
import TotalExpense from './TotalExpense'
import useMain from 'pages/context/context'

const TotalsButton = styled(MuiButton)(({ theme }) => ({
	transform: 'rotate(90deg)',
	position: 'absolute',
	top: '29px',
	right: '-70px',
	padding: '8px 30px',
	borderRadius: '8px 8px 0px 0px',
	background: '#FFA58D',
	color: '#fff',
	boxShadow: theme.customShadows.z8,
	zIndex: 1,
}))

function TravelExpenses() {
	const [loader, setLoader] = useState(false)
	const { state } = useMain()
	const { isfilterOpen } = state.filters || {}
	const [showTotal, setshowTotal] = useState(false)
	const { t } = useTranslation(['travel_expenses'])

	return (
		<>
			<Header t={t} />

			{isfilterOpen ? (
				<Filters />
			) : (
				<Box position="relative" marginLeft={3} marginRight={6} sx={{ boxShadow: (theme) => theme.customShadows.z8 }}>
					<Drawer />
					<TotalsButton size="small" variant="contained" color="inherit" onClick={() => setshowTotal(!showTotal)}>
						{showTotal ? t('Timeline') : t('Totals')}
					</TotalsButton>
					<Loader open={loader} setOpen={setLoader} />
					{showTotal ? <TotalExpense /> : <Timeline />}
				</Box>
			)}
		</>
	)
}

export default TravelExpenses
