import * as React from 'react'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Box, InputAdornment, Stack, TextField, Typography } from '@mui/material'
import { fDateTime } from 'utils/formatTime'
import Iconify from 'components/Iconify'

export default function Message() {
	return (
		<Card sx={{ maxWidth: 310, padding: 2 }}>
			<Typography variant="body1" fontSize={16} fontWeight={600} mb={2}>
				All Comments (Metal fitting)
			</Typography>
			{[1, 2].map((e) => (
				<Stack direction="row" mb={2} mr={1} key={e}>
					<Avatar>sf</Avatar>
					<Box pl={1}>
						<Typography variant="body2">
							<Iconify icon="mdi:person-circle-outline" sx={{ color: (theme) => theme.palette.primary.light }} />
							<Typography variant="caption" sx={{ color: (theme) => theme.palette.primary.light, fontSize: '14px' }}>
								&nbsp;Name here&nbsp;
							</Typography>
							Confirmed to working on next week
						</Typography>
						<Typography variant="body2" fontSize={12} pt={'3px'}>
							Edited. {fDateTime(new Date())}
						</Typography>
					</Box>
					<IconButton aria-label="settings" style={{ position: 'absolute', right: 0 }}>
						<MoreVertIcon style={{ transform: 'rotate(90deg)' }} />
					</IconButton>
				</Stack>
			))}

			<Stack direction="row" mb={1} mr={1} style={{ alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
				<Avatar>S</Avatar>
				<TextField
					variant="outlined"
					size="small"
					label="Message"
					fullWidth
					sx={{ paddingLeft: 1 }}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<Iconify icon="carbon:send" style={{ transform: 'rotate(270deg)' }} />
							</InputAdornment>
						),
					}}
				/>
			</Stack>
		</Card>
	)
}
