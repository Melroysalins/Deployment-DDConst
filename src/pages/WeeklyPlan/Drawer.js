import * as React from 'react'
import { Box, Stack, Popper, Typography, Divider, Button, Fade, Paper } from '@mui/material'
import Iconify from 'components/Iconify'
import { styled } from '@mui/material/styles'
import { colorApprovalSubTask, colorApprovalTask } from './WeeklyPlan'
import { ApprovalStatus } from 'constant'

const FilledBox = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'color',
})(({ color }) => ({
	width: '12px',
	height: '12px',
	background: color,
	borderRadius: '4px',
}))

export default function Drawer() {
	const [anchorEl, setAnchorEl] = React.useState(null)
	const [open, setOpen] = React.useState(false)
	const [placement, setPlacement] = React.useState()
	const handleClick = (newPlacement) => (event) => {
		setAnchorEl(event.currentTarget)
		setOpen((prev) => placement !== newPlacement || !prev)
		setPlacement(newPlacement)
	}

	return (
		<Box sx={{ position: 'absolute', right: 10, bottom: 10, zIndex: 124 }}>
			<Popper sx={{ zIndex: 25 }} open={open} anchorEl={anchorEl} placement={placement} transition>
				{({ TransitionProps }) => (
					<Fade {...TransitionProps} timeout={350}>
						<Paper
							sx={{
								padding: 2,
								background: 'rgba(255, 255, 255, 0.9)',
								border: '1px solid rgba(0, 0, 0, 0.1)',
								boxShadow: '0px 10px 24px rgba(0, 0, 0, 0.15)',
								backdropFilter: 'blur(15px)',
								borderRadius: '8px',
								zIndex: 2,
								height: '52px',
							}}
						>
							<Stack direction="row">
								<Typography sx={{ fontWeight: 700, marginRight: 3 }} variant="caption">
									Type:
								</Typography>

								<Typography sx={{ display: 'flex', alignItems: 'center', marginRight: 3 }} variant="caption">
									<FilledBox color={colorApprovalTask[ApprovalStatus.Planned]} />
									&nbsp;Task
								</Typography>

								<Typography sx={{ display: 'flex', alignItems: 'center', marginRight: 3 }} variant="caption">
									<FilledBox color={colorApprovalSubTask[ApprovalStatus.Planned]} />
									&nbsp;SubTask
								</Typography>

								<Divider sx={{ fontWeight: 700, marginRight: 3 }} orientation="vertical" flexItem />
								<Typography sx={{ fontWeight: 700, marginRight: 3 }} variant="caption">
									Status:
								</Typography>
								<Typography sx={{ display: 'flex', alignItems: 'center', marginRight: 3 }} variant="caption">
									<FilledBox color={colorApprovalTask[ApprovalStatus.Approved]} />
									&nbsp;Done / Approved
								</Typography>
								<Typography sx={{ display: 'flex', alignItems: 'center', marginRight: 3 }} variant="caption">
									<FilledBox color={colorApprovalTask[ApprovalStatus.Planned]} />
									&nbsp;Plan / Pending
								</Typography>

								<Typography sx={{ display: 'flex', alignItems: 'center', marginRight: 3 }} variant="caption">
									<FilledBox color={colorApprovalTask[ApprovalStatus.Rejected]} />
									&nbsp;Revision / Reject
								</Typography>
							</Stack>
						</Paper>
					</Fade>
				)}
			</Popper>
			<Button
				variant="contained"
				sx={{
					width: '52px',
					maxWidth: '52px',
					height: '52px',
					background: '#8D99FF',
					boxShadow: '0px 8px 16px rgba(141, 153, 255, 0.24)',
					borderRadius: '8px',
				}}
				onClick={handleClick('left-start')}
			>
				<Iconify color="#fff" icon="gis:map-legend" sx={{ width: 20, height: 20, color: '#fff' }} />
			</Button>
		</Box>
	)
}
