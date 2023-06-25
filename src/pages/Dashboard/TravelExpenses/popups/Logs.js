import React from 'react'
import PropTypes from 'prop-types'
import { Box, Avatar, Divider, Typography, IconButton, Stack } from '@mui/material'
import { fDateTime } from 'utils/formatTime'
import Scrollbar from 'components/Scrollbar'

const logsData = [
	{
		employee: {
			id: '12123',
			picture: null,
			name: 'Employee abc',
		},
		comment: 'Confrmed 4 days a week labor contract',
		timestamp: '2022-12-05T10:41:42.863Z',
	},
	{
		employee: {
			id: '12123',
			picture: null,
			name: 'Employee abc',
		},
		comment: 'Confrmed 4 days a week labor contract',
		timestamp: '2022-12-05T10:41:42.863Z',
	},
	{
		employee: {
			id: '12123',
			picture: null,
			name: 'Employee abc',
		},
		comment: 'Confrmed 4 days a week labor contract',
		timestamp: '2022-12-05T10:41:42.863Z',
	},
	{
		employee: {
			id: '12123',
			picture: null,
			name: 'Employee abc',
		},
		comment: 'Confrmed 4 days a week labor contract',
		timestamp: '2022-12-05T10:41:42.863Z',
	},
	{
		employee: {
			id: '12123',
			picture: null,
			name: 'Employee abc',
		},
		comment: 'Confrmed 4 days a week labor contract',
		timestamp: '2022-12-05T10:41:42.863Z',
	},
	{
		employee: {
			id: '12123',
			picture: null,
			name: 'Employee abc',
		},
		comment: 'Confrmed 4 days a week labor contract',
		timestamp: '2022-12-05T10:41:42.863Z',
	},
	{
		employee: {
			id: '12123',
			picture: null,
			name: 'Employee abc',
		},
		comment: 'Confrmed 4 days a week labor contract',
		timestamp: '2022-12-05T10:41:42.863Z',
	},
	{
		employee: {
			id: '12123',
			picture: null,
			name: 'Employee abc',
		},
		comment: 'Confrmed 4 days a week labor contract',
		timestamp: '2022-12-05T10:41:42.863Z',
	},
	{
		employee: {
			id: '12123',
			picture: null,
			name: 'Employee abc',
		},
		comment: 'Confrmed 4 days a week labor contract',
		timestamp: '2022-12-05T10:41:42.863Z',
	},
	{
		employee: {
			id: '12123',
			picture: null,
			name: 'Employee abc',
		},
		comment: 'Confrmed 4 days a week labor contract',
		timestamp: '2022-12-05T10:41:42.863Z',
	},
]

const Log = ({ data }) => {
	return (
		<>
			<Stack direction="row" mb={2} mr={1}>
				<Avatar>sf</Avatar>
				<Box pl={2}>
					<Typography variant="body2">
						<Typography variant="caption" sx={{ color: (theme) => theme.palette.primary.light, fontSize: '14px' }}>
							{data.employee.name}&nbsp;
						</Typography>
						{data.comment}
					</Typography>
					<Typography variant="body2">{fDateTime(data.timestamp)}</Typography>
				</Box>
			</Stack>
		</>
	)
}

const Logs = () => {
	return (
		<Scrollbar sx={{ height: { xs: 340, sm: '50vh' } }}>
			{logsData.map((log) => (
				<Log data={log} />
			))}
		</Scrollbar>
	)
}

export default Logs
