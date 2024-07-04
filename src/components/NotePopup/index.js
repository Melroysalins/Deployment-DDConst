import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Box, Typography, styled, TextField } from '@mui/material';
import { ICONS_MAP } from './dialogConfig';
import Iconify from 'components/Iconify';
import Proptypes from 'prop-types';

const PopupTitle = styled(DialogTitle)({
	alignSelf: 'stretch',
	borderRadius: '8px 8px 0px 0px',
  color: '#FFFFFF',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'flex-start',
	justifyContent: 'center',
	padding: '16px 24px',
	boxSizing: 'border-box',
	whiteSpace: 'nowrap',
	maxWidth: '100%',
})

const AddProjectPopupRoot = styled(Box)({
	width: '400px',
	boxShadow: '0px 10px 24px rgba(0, 0, 0, 0.15)',
	backdropFilter: 'blur(30px)',
	borderRadius: '8px',
	backgroundColor: 'rgba(255, 255, 255, 0.9)',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'flex-start',
	justifyContent: 'flex-start',
	letterSpacing: 'normal',
	lineHeight: 'normal',
	textAlign: 'left',
	fontSize: '20px',
	color: 'text.primary',
    alignSelf: 'stretch',
})

const DialogHeading = styled(Box)({
    textAlign: 'center',
    width: '100%',
    color: 'black',
    padding: '24px 24px 16px 24px',
    backgroundColor: '#F9FAFB',
  })

const NotePopup = ({ isOpen, onClose, title, button, inputValue, setInputValue }) => {

  return (
	<Dialog open={isOpen} onClose={onClose}>
      <AddProjectPopupRoot>
        <PopupTitle sx={{ backgroundColor: button.label === 'Yes, delete' ? '#DA4C57' : '#8d99ff' }}>{title}</PopupTitle>
        <DialogHeading>
        <Box
            sx={{
                width: 500,
                maxWidth: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
            }}
        >
            <Typography variant="body1" sx={{fontWeight: 400, fontSize: 12, color: '#212B36', lineHeight: '20px'}}>Note</Typography>
            <TextField 
                sx={{ backgroundColor: '#FFFFFF', '& .MuiInputBase-input': {
                    color: '#596570', fontSize: 14, lineHeight: '24px', fontWeight: 400, padding: 0,
                },}} 
                fullWidth 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                id="fullWidth" 
                multiline
                rows={4} 
            />
        </Box>
        </DialogHeading>
		<Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 3,
            boxSizing: 'border-box',
            width: '100%',
            gap: 2.5,
            backgroundColor: '#F9FAFB',
          }}
        >
          <Button
            sx={{
              cursor: 'pointer',
              border: 'none',
              p: 0,
              backgroundColor: 'transparent',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
            onClick={() => onClose()}
          >
            <Iconify
              icon="radix-icons:cross-2"
              width={20}
              height={20}
              style={{ color: '#919EAB', margin: 'auto' }}
            />
            <Typography
              variant="body2"
              sx={{
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 600,
                color: '#596570',
                textAlign: 'left',
                minWidth: '47px',
              }}
            >
              {button.label === 'Yes, delete' ? 'No, don\'t delete ' : 'Cancel'}
            </Typography>
          </Button>
          <Button
            sx={{
              cursor: 'pointer',
              border: 'none',
              p: 0,
              backgroundColor: 'transparent',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
            onClick={() => button.onClick()}
          >
            <Iconify
              icon={ICONS_MAP[button.label]}
              width={20}
              height={20}
              style={{ color: `${button.label === 'Yes, delete' ? '#DA4C57' : '#8d99ff'}`, margin: 'auto' }}
            />
            <Typography
              variant="body2"
              sx={{
                textDecoration: 'none',
                fontSize: '14px',
                lineHeight: '24px',
                fontWeight: 600,
                color: `${button.label === 'Yes, delete' ? '#DA4C57' : '#8d99ff'}`,
                textAlign: 'left',
                minWidth: '33px',
              }}
            >
              {button.label}
            </Typography>
          </Button>
        </Box>
	  </AddProjectPopupRoot>
	</Dialog>
  )
}

NotePopup.propTypes = {
    isOpen: Proptypes.bool.isRequired,
}

export default NotePopup;