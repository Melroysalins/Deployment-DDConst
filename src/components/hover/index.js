import React from 'react'
import { Box, Button, Tooltip, styled } from '@mui/material';
import Iconify from 'components/Iconify';
import PropTypes from 'prop-types';

const HoverDiv = styled(Box)(({ index, scrollPosition }) => ({
	visibility: 'hidden', // Hide the box by default
	top: `${(19 + index * 37.5) - scrollPosition}px`, // Place the box at the top of the parent container
	right: '-16px', // Adjust based on your layout. This positions it outside the border.
	display: 'flex',
	position: 'absolute', // or 'fixed' if it needs to be positioned relative to the viewport
	flexDirection: 'column', // Stack the buttons vertically
	justifyContent: 'center', // Center horizontally
	alignItems: 'center', // Center vertically
	backgroundColor: '#fff', // Inherit the background from the parent or set a specific color
	boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Example shadow, adjust as needed
	borderRadius: '4px', // Example border radius, adjust to match your design
	border: '1px solid #e0e0e0', // Example border, adjust as needed
	zIndex: 10, // Place the box above other elements
	padding: '2px',	
	transform: 'translateY(-50%)',
	'&:hover': {
		boxShadow: 'none',
	},
	gap: '4px',
}));

const HoverBox = ({ index, setVisibleNotes, scrollPosition }) => {
    
	console.log('HoverBox index:', index)
	console.log('HoverBox scrollPosition:', scrollPosition)

  return (
	<HoverDiv
	sx={{
		visibility: 'visible', // Initially hidden
	}}
	index={index}
	scrollPosition={scrollPosition}
	>
		<Tooltip title="Add note" arrow placement='right'>
			<Button
				sx={{ 	
					padding: '0px',
					minWidth: 'auto', // Adjust as needed
					width: '24px',
					height: '24px',
					borderRadius: '2px', // Rounds the corners to create a circle
					backgroundColor: '#fff',
					'& .iconify': { // Assuming a className of 'iconify' is added to the Iconify component
						opacity: '0.5',
					},
					'&:hover': {
						backgroundColor: '#EDEDEF',
						'& .iconify': { // Assuming a className of 'iconify' is added to the Iconify component
						opacity: '1',
					},
					},
				}}
				onClick={() => setVisibleNotes(index)}
			>
				<Iconify icon="uil:clipboard-notes" width={20} height={20} sx={{ color: '#596570'}} />
			</Button>
		</Tooltip>
		<Button
			sx={{
				padding: '0px',
				minWidth: 'auto', // Adjust as needed
				width: '24px',
				height: '24px',
				borderRadius: '2px', // Rounds the corners to create a circle
				backgroundColor: '#fff',
				'& .iconify': { // Assuming a className of 'iconify' is added to the Iconify component
					opacity: '0.5',
				},
				'&:hover': {
					backgroundColor: '#EDEDEF',
					'& .iconify': { // Assuming a className of 'iconify' is added to the Iconify component
					opacity: '1',
				},
				},
			}}
			onClick={() => console.log('Delete icon clicked for connection')}
		>
			<Iconify icon="tabler:trash" width={20} height={20} sx={{ color: '#596570', Opacity: '0.5', '&: hover': { Opacity: 1}}} />
		</Button>
	</HoverDiv>
  )
}

HoverBox.propTypes = {
  index: PropTypes.any,
  setVisibleNotes: PropTypes.func,
}

export default HoverBox