import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Popover, Button, Box, styled, TextField, InputLabel, Grid, Switch, Typography, Alert, Backdrop } from '@mui/material';
import Iconify from 'components/Iconify';

const PopupTitle = styled('div')({
	alignSelf: 'stretch',
	borderRadius: '8px 8px 0px 0px',
	backgroundColor: '#8d99ff',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'flex-start',
	justifyContent: 'center',
	padding: '16px 24px',
	boxSizing: 'border-box',
	whiteSpace: 'nowrap',
	maxWidth: '100%',
});
  
const AddProjectPopupRoot = styled(Box)({
	width: "100%",
  maxWidth: 474,
	boxShadow: "0px 10px 24px rgba(0, 0, 0, 0.15)",
	backdropFilter: "blur(30px)",
	borderRadius: "8px",
	backgroundColor: "rgba(255, 255, 255, 0.9)",
	display: "flex",
	flexDirection: "column",
	alignItems: "flex-start",
	justifyContent: "flex-start",
	letterSpacing: "normal",
	lineHeight: "normal",
	textAlign: "left",
	fontSize: "18px",
	color: "text.primary",
});

const InputBox = styled(Box)({
  alignSelf: "stretch",
  borderRadius: "8px",
  backgroundColor: "#fff",
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  fontSize: "16px",
  color: "#596570",
})

const renderInputBox = (BoxText, value, handleChange, name) => {
  return (
    <InputBox>
      <TextField
        name={name}
        value={value}
        onChange={handleChange}
        style={{
          border: "none",
          backgroundColor: "transparent",
          height: "40px",
          flex: "1",
          fontFamily: "Manrope",
          fontSize: "14px",
          color: "#FFFFFF",
        }}
        variant="outlined"
        sx={{
          "& fieldset": { borderColor: "rgba(0, 0, 0, 0.1)" },
          "& .MuiInputBase-root": {
            height: "40px",
            borderRadius: "8px 0px 0px 8px",
          },
        }}
      />
      <Box
        sx={{
          height: 40,
          width: 62,
          borderRadius: '0px 8px 8px 0px',
          borderTop: '1px solid rgba(0, 0, 0, 0.1)',
          borderRight: '1px solid rgba(0, 0, 0, 0.1)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          p: '4px 11px',
          gap: 1,
          color: 'text.primary'
        }}
      >
        {BoxText}
      </Box>
    </InputBox>
  )
}

const QuickDiagramBuilderPopup = (
  { 
    onInputChange, 
    inputValues, 
    objId, 
    obj,
    handleAdd,
  }
) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [showDemolitionInput, setShowDemolitionInput] = useState(false);
    const [warningShown, setWarningShown] = useState(false);
    const [popoverOpen, setPopoverOpen] = useState(obj.firstOpen)

    const handleChange = (event) => {
      const { name, value } = event.target;
      onInputChange(name, value);
    };

    useEffect(() => {
      setAnchorEl(null); // Set anchorEl to null to position popover in the middle
    }, []);
    
    const handleClose = useCallback(() => {
      setPopoverOpen(false)
      obj.firstOpen = false
      handleAdd(objId, inputValues.midPoints);
    }, [objId, inputValues.midPoints]);

    const handleShowDemolition = useCallback((event) => {
      setShowDemolitionInput(event.target.checked);
    }, []);

    const handleCancel = useCallback(() => {
      if (!warningShown) {
      setWarningShown(true);
      } else {
      setPopoverOpen(false);
      obj.firstOpen = false;
      }
    }, [warningShown]);

  return (
    <>
      <Backdrop open={popoverOpen} style={{ zIndex: 999, color: '#fff', opacity: 0.5 }} />
      <Popover
        open={popoverOpen}
        anchorEl={anchorEl}
        onClose={() => {}}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
      >
        <AddProjectPopupRoot>
          <PopupTitle>
            <span style={{ color: '#fff' }}>Quick Diagram Builder</span>
            {warningShown && <Alert severity="warning" icon={false} sx={{ backgroundColor: 'transparent', padding: 0 }}>Add these points to save 75% of your time</Alert>}
          </PopupTitle>
          <Grid container spacing={1} sx={{ padding: '24px 24px 0px 24px' }}>
            <Grid item xs={10}>
              <InputLabel htmlFor="input-field" sx={{ fontSize: '12px' }}>
                MidPoint Connections({Number(inputValues.midPoints) +  Number(inputValues.midLines)} units)
              </InputLabel>
            </Grid>
            <Grid item xs={2} sx={{ fontSize: '12px' }}>
              Demolition
            </Grid>
            <Grid item xs={10} container spacing={1}>
              <Grid item xs={5.5}>
                {renderInputBox('units', inputValues.midPoints, handleChange, 'midPoints')}
              </Grid>
              <Grid item xs={1} sx={{ display: "flex", alignContent: "center"}}>
                <Iconify icon="radix-icons:cross-2" width={20} height={20} style={{ color: "#919EAB", margin: "auto"}} />
              </Grid>
              <Grid item xs={5.5}>
                {renderInputBox('lines', inputValues.midLines, handleChange, 'midLines')}
              </Grid>
            </Grid>
            <Grid item xs={2}>
              <Switch checked={showDemolitionInput} onChange={handleShowDemolition} />
            </Grid>
            {showDemolitionInput && (
              <>
                <Grid item xs={10}>
                  <InputLabel htmlFor="input-field" sx={{ fontSize: '12px' }}>
                    Demolition MidPoint Connections(14 units)
                  </InputLabel>
                </Grid>
                <Grid item xs={10} container spacing={1}>
                  <Grid item xs={5.5}>
                    {renderInputBox('units')}
                  </Grid>
                  <Grid item xs={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Iconify icon="radix-icons:cross-2" width={20} height={20} style={{ color: "#919EAB", margin: "auto"}} />
                  </Grid>
                  <Grid item xs={5.5}>
                    {renderInputBox('lines')}
                  </Grid>
                </Grid>
              </>
            )}
          </Grid>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              letterSpacing: 'normal',
              lineHeight: 'normal',
              textAlign: 'left',
              fontSize: '14px',
              color: '#98d2c3',
              fontFamily: 'Manrope',
            }}
          >
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center', // Center the content vertically
                justifyContent: 'space-between',
                p: 3, // This is equivalent to padding of 24px
                boxSizing: 'border-box',
                maxWidth: '100%',
                gap: 2.5, // This is equivalent to gap of 20px
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
                  alignItems: 'center', // Center the content vertically
                  justifyContent: 'flex-start',
                }}
                onClick={handleCancel}
              >
                <Iconify icon="radix-icons:cross-2" width={20} height={20} style={{ color: "#919EAB", margin: "auto"}} />
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
                  Cancel
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
                onClick={handleClose}
              >
                <Iconify icon="bi:check-lg" width="20" height="20" style={{ color: "#919EAB", margin: "auto"}} />
                <Typography
                  variant="body2"
                  sx={{
                    textDecoration: 'none',
                    fontSize: '14px',
                    lineHeight: '24px',
                    fontWeight: 600,
                    color: '#596570',
                    textAlign: 'left',
                    minWidth: '33px',
                  }}
                >
                  Okay
                </Typography>
              </Button>
            </Box>
          </Box>
        </AddProjectPopupRoot>
      </Popover>
    </>
  );
}
 
QuickDiagramBuilderPopup.propTypes = {
  onInputChange: PropTypes.func.isRequired,
  inputValues: PropTypes.any.isRequired,
  objId: PropTypes.any.isRequired,
  obj: PropTypes.any.isRequired,
  handleAdd: PropTypes.func.isRequired,
}

export default QuickDiagramBuilderPopup