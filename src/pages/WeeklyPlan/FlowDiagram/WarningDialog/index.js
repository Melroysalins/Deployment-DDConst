import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Box, Typography, styled } from '@mui/material';
import { ICONS_MAP } from './dialogConfig';
import Iconify from 'components/Iconify';
import { useTranslation } from 'react-i18next';

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
	width: '496px',
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

const DialogHeading = styled(DialogContent)({
  textAlign: 'center',
  width: '100%',
  color: 'black',
  padding: '16px 24px 0px 24px',
})


const WarningDialog = ({ isOpen, onClose, title, dialogHeading, description, buttons, actionType }) => {
  const { t } = useTranslation(['diagram']);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <AddProjectPopupRoot>
        <PopupTitle sx={{ backgroundColor: actionType === 'delete' ? '#DA4C57' : '#8d99ff' }}>{dialogContent}</PopupTitle>
        <DialogHeading>
          <DialogTitle sx={{ fontWeight: 600}}>{dialogHeadingContent}</DialogTitle>
          <DialogContentText sx={{ fontSize: '14px'}}>{dialogDescription}</DialogContentText>
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
              onClick={buttons[0]?.onClick}
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
                {actionType === 'delete' ? t('No, don\'t delete') : t('Cancel')}
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
              onClick={() => buttons[1]?.onClick()}
            >
              <Iconify
                icon={ICONS_MAP[dialogButtonLabel]}
                width={20}
                height={20}
                style={{ color: `${actionType === 'delete' ? '#DA4C57' : '#8d99ff'}`, margin: 'auto' }}
              />
              <Typography
                variant="body2"
                sx={{
                  textDecoration: 'none',
                  fontSize: '14px',
                  lineHeight: '24px',
                  fontWeight: 600,
                  color: `${actionType === 'delete' ? '#DA4C57' : '#8d99ff'}`,
                  textAlign: 'left',
                  minWidth: '33px',
                }}
              >
                {dialogButtonLabel}
              </Typography>
            </Button>
          </Box>
      </AddProjectPopupRoot>
    </Dialog>
  )
}

export default WarningDialog;