import PropTypes from 'prop-types'
import Iconify from 'components/Iconify'
// @mui
import { Box, Button, Divider, Typography, Stack } from '@mui/material'
// utils
// components
import MenuPopover from 'components/MenuPopover'

// ----------------------------------------------------------------------

PopupForm.propTypes = {
	title: PropTypes.string.isRequired,
	variant: PropTypes.string,
	handleSubmit: PropTypes.func.isRequired,
	handleClose: PropTypes.func.isRequired,
	anchor: PropTypes.any.isRequired,
	handleDelete: PropTypes.func,
}

export default function PopupForm(props) {
	const { title, variant = 'primary', handleSubmit, anchor, handleClose, handleDelete } = props

	return (
		<>
			<MenuPopover
				open={Boolean(anchor)}
				anchorEl={anchor}
				onClose={handleClose}
				sx={{ width: 400, p: 0, mt: 1.5, ml: 0.75 }}
			>
				{title ? (
					<Box
						sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5, background: (theme) => color(variant, theme) }}
					>
						<Typography variant="subtitle1">{title}</Typography>
					</Box>
				) : (
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							py: 0.75,
							px: 2.5,
							background: (theme) => color(variant, theme),
						}}
					/>
				)}

				{props.children}

				<Divider sx={{ borderStyle: 'dashed' }} />

				{/* <Scrollbar sx={{ height: { xs: 30, sm: 'auto' } }}></Scrollbar> */}

				<Divider sx={{ borderStyle: 'dashed' }} />

				<Stack flexDirection="row" justifyContent="space-between" sx={{ p: 1 }}>
					<Button
						startIcon={<Iconify icon="material-symbols:close-rounded" width={15} height={15} />}
						size="small"
						color="inherit"
						onClick={handleClose}
					>
						Close
					</Button>
					{handleDelete && (
						<Button
							sx={{ color: (theme) => theme.palette.colors[8] }}
							startIcon={<Iconify icon="material-symbols:delete-outline" width={15} height={15} />}
							size="small"
							color="inherit"
							onClick={handleDelete}
						>
							Delete
						</Button>
					)}
					{handleSubmit && (
						<Button
							sx={{ color: (theme) => color(variant, theme) }}
							startIcon={<Iconify icon="ph:check-bold" width={15} height={15} />}
							size="small"
							onClick={handleSubmit}
						>
							Okay
						</Button>
					)}
				</Stack>
			</MenuPopover>
		</>
	)
}

// ----------------------------------------------------------------------

const color = (variant, theme) => {
	switch (variant) {
		case 'inherit':
			return theme.palette.colors[4]
		case 'primary':
			return theme.palette.colors[8]
		case 'secondary':
			return theme.palette.colors[6]
		default:
			return theme.palette.colors[0]
	}
}
