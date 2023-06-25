import { Box, Divider, Grid, List, ListItem, Paper, Stack, Typography } from '@mui/material'
import Iconify from 'components/Iconify'
import React, { memo, useState } from 'react'

const Items = [
	{
		title: '소유자',
		right: '소유자',
		color: '#596570',
		icon: 'radix-icons:person',
	},
	{
		title: '소유자',
		right: '소유자',
		color: '#596570',
		icon: 'uil:calender',
	},
	{
		title: '소유자',
		right: '소유자',
		img: '/static/icons/Calender_expiration.svg',
	},
	{
		title: '소유자',
		right: '118',
		img: '/static/icons/Calender_tick.svg',
	},
	{
		title: '소유자',
		right: '소유자',
		color: '#FF62B5',
		icon: 'teenyicons:clock-outline',
	},
	{
		title: '소유자',
		right: '소유자',
		color: '#596570',
		img: '/static/icons/arrow_top.svg',
	},
]

const Funds = [
	{
		id: '1',
		title: 'Contruction Period',
		right: '20-01-2023 KRW',
		detail: '',
		icon: 'radix-icons:person',
	},
	{
		id: '2',
		title: 'Contract',
		right: '20/01/2023 KRW',
		detail: '',
	},
	{
		id: '3',
		title: 'Used Cons',
		right: '20/01/2023 - 20/01/2023',
		detail: '',
	},
	{
		id: '4',
		title: 'Construction',
		right: '20/01/2023 - 20/01/2023',
		detail: '',
	},
	{
		id: '5',
		title: 'Project Detals',
		detail: 'Constrction Sections',
	},
	{
		id: '6',
		title: 'Special situations',
		detail: 'Constrction Sections Constrction Sections Constrction Sections',
	},
]

const EventCardCost = ({ event }) => (
	<Grid item xs={6}>
		<Paper sx={{ padding: '10px 7px' }}>
			<Stack direction="row" justifyContent={'space-between'} width={'100%'}>
				<Stack direction="row" gap={1} justifyContent={'space-between'} alignItems={'center'}>
					<Box sx={{ width: 20, height: 20 }}>
						{event.img ? (
							<img src={event.img} alt={event?.title} />
						) : (
							<Iconify icon={event.icon} sx={{ width: 18, height: 18, color: event.color }} />
						)}
					</Box>
					<Typography fontSize={13}>{event?.title}</Typography>
				</Stack>
				<Typography fontSize={13} fontWeight={600}>
					{event?.right}
				</Typography>
			</Stack>
		</Paper>
	</Grid>
)

const ProcessListItem = ({ event }) => (
	<>
		{event.id > 1 && <Divider />}
		<ListItem sx={{ justifyContent: 'space-between' }}>
			<Stack>
				<Typography fontSize={13}>
					{event.id}. {event?.title}
				</Typography>
				{event?.detail && (
					<Typography fontSize={11} fontWeight={500}>
						{event?.detail}
					</Typography>
				)}
			</Stack>
			<Typography fontSize={11} fontWeight={500}>
				{event?.right}
			</Typography>
		</ListItem>
	</>
)

function LeftMenu() {
	const [isCollapsed, setisCollapsed] = useState(false)
	return (
		<>
			<Typography variant="h5" mb={1}>
				프로젝트 이름
			</Typography>
			<Grid container spacing={1}>
				{Items.map((event, index) => (
					<EventCardCost event={event} key={index} index={index} />
				))}
			</Grid>

			{/* Process Funds */}
			<Box
				sx={{ borderRadius: !isCollapsed ? '6px 6px 3px' : '6px', border: '1px solid rgba(145, 158, 171, 0.24)' }}
				mt={2}
			>
				<Paper sx={{ padding: 1, borderRadius: !isCollapsed ? '6px 6px 0 0' : '6px' }}>
					<Stack width={'100%'} direction="row" justifyContent={'space-between'}>
						<Typography color={'#DA4C57'} variant="body1" fontWeight={600}>
							Process/Funds
						</Typography>

						<Box
							sx={{ width: 24, height: 24, transform: isCollapsed ? ' rotate(180deg)' : 'inherit' }}
							onClick={() => setisCollapsed(!isCollapsed)}
						>
							<img src={'/static/icons/Sort-ascending.svg'} alt={'sort img'} />
						</Box>
					</Stack>
				</Paper>
				{!isCollapsed && (
					<List>
						{Funds.map((event, index) => (
							<ProcessListItem event={event} key={index} />
						))}
					</List>
				)}
			</Box>
		</>
	)
}

export default memo(LeftMenu)
