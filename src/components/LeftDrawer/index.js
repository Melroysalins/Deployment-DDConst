import { Box, Stack, Typography } from '@mui/material'
import Drawer from '@mui/material/Drawer'
import Iconify from 'components/Iconify'

export default function LeftDrawer({
	anchor = 'left',
	open = false,
	setopen,
	headerText,
	children,
	onBack,
	headerRightSide,
}) {
	const handleClose = () => {
		setopen(false)
	}

	return (
		<Drawer anchor={anchor} open={open} onClose={handleClose}>
			<Box sx={{ width: 370, maxWidth: 420 }}>
				{!!headerText && (
					<Stack
						direction="row"
						justifyContent={'space-between'}
						alignItems={'center'}
						sx={{ background: '#F9F9FA', height: 60, display: 'flex', alignItems: 'center', padding: '0 15px' }}
					>
						<Stack direction="row" gap={1} alignItems={'center'}>
							<Iconify icon="ion:arrow-back" width={20} height={20} onClick={onBack} />
							<Typography variant="h6">{headerText}</Typography>
						</Stack>
						{headerRightSide}
					</Stack>
				)}
				<div style={{ overflowY: 'auto' }}>{children}</div>
			</Box>
		</Drawer>
	)
}
