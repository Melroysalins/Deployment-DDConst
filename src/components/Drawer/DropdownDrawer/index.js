import React, { useState, useEffect, useMemo } from 'react';
import { Popover, Grid, Select, FormControl, Box, Button, TextField, InputLabel, Typography, InputAdornment, Divider } from '@mui/material';
import Iconify from 'components/Iconify';
import Proptypes from 'prop-types';

const DropdownPopover = ({ type, newObj, handleChangeStatus }) => {
  const initialInputValues = useMemo(() => ({
    first: {
      bigInput: newObj?.currentObj?.inputValues?.first?.bigInput || '154',
      startLocation: newObj?.currentObj?.inputValues?.first?.startLocation || 'Namyang',
      endLocation: newObj?.currentObj?.inputValues?.first?.endLocation || 'Yeonsu',
    },
    second: {
      voltageLevel: newObj?.currentObj?.inputValues?.second?.voltageLevel || '154',
      bigInput: newObj?.currentObj?.inputValues?.second?.bigInput || 'XLPE',
      wiringArea: newObj?.currentObj?.inputValues?.second?.wiringArea || '200',
      tlCount: parseInt(newObj?.currentObj?.connections?.[0]?.statuses?.length, 10),
      tlLength: newObj?.currentObj?.inputValues?.second?.tlLength || '2.8',
    },
    third: {
      voltageLevel: newObj?.currentObj?.inputValues?.third?.voltageLevel || '154',
      bigInput: newObj?.currentObj?.inputValues?.third?.bigInput || 'XLPE',
      wiringArea: newObj?.currentObj?.inputValues?.third?.wiringArea || '200',
      tlCount: parseInt(newObj?.currentObj?.demolitions?.[0]?.statuses?.length, 10),
      tlLength: newObj?.currentObj?.inputValues?.third?.tlLength || '2.8',
    },
  }), [newObj]);

  newObj.currentObj.inputValues = newObj.currentObj.inputValues || {};
  const [anchorEl, setAnchorEl] = useState(null);
  const [inputValues, setInputValues] = useState(initialInputValues[type]);
  const [selectedOptions, setSelectedOptions] = useState({
    first: '',
    second: '',
    third: '',
  });

  useEffect(() => {
    const updatedInputValues = {
      first: {
        bigInput: newObj?.currentObj?.inputValues?.first?.bigInput || '154',
        startLocation: newObj?.currentObj?.inputValues?.first?.startLocation || 'Namyang',
        endLocation: newObj?.currentObj?.inputValues?.first?.endLocation || 'Yeonsu',
      },
      second: {
        voltageLevel: newObj?.currentObj?.inputValues?.second?.voltageLevel || '154',
        bigInput: newObj?.currentObj?.inputValues?.second?.bigInput || 'XLPE',
        wiringArea: newObj?.currentObj?.inputValues?.second?.wiringArea || '200',
        tlCount: parseInt(newObj?.currentObj?.connections?.[0]?.statuses?.length, 10),
        tlLength: newObj?.currentObj?.inputValues?.second?.tlLength || '2.8',
      },
      third: {
        voltageLevel: newObj?.currentObj?.inputValues?.third?.voltageLevel || '154',
        bigInput: newObj?.currentObj?.inputValues?.third?.bigInput || 'XLPE',
        wiringArea: newObj?.currentObj?.inputValues?.third?.wiringArea || '200',
        tlCount: parseInt(newObj?.currentObj?.demolitions?.[0]?.statuses?.length, 10),
        tlLength: newObj?.currentObj?.inputValues?.third?.tlLength || '2.8',
      },
    };

    setInputValues(updatedInputValues[type]);
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [type]: formatInputValues(updatedInputValues[type]), // or format the inputValues as needed
    }));
  }, [newObj, type]);

  useEffect(() => {
    if (newObj?.currentObj?.inputValues) {
      newObj.currentObj.inputValues[type] = inputValues;
    }
  }, [inputValues, type]);

  const handleClick = (event) => {
    if (newObj.isEditing) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setInputValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  const formatInputValues = (values) => {
    let formattedValues = '';
    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        formattedValues += `${value}`;
        if (key === 'voltageLevel' || (key === 'bigInput' && type === 'first')) {
          formattedValues += 'kV ';
        } else if (key === 'wiringArea') {
          formattedValues += 'sq, ';
        } else if (key === 'tlLength') {
          formattedValues += 'km ';
        } else if (key === 'endLocation') {
            formattedValues += 'T/L ';
        } else if (key === 'startLocation') {
            formattedValues += '-';
        } else {
            formattedValues += ' ';
        }
      }
    });
    return formattedValues.slice(0, -2); // Remove the trailing comma and space
  };

  const handleOkayClick = (inputValues) => {
    
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [type]: formatInputValues(inputValues), // or format the inputValues as needed
    }));
    handleClose(); 
    handleChangeStatus(newObj.id, parseInt(inputValues.tlCount, 10), type)
  };

  const renderGridItem = (label, id, inputAdornment) => {
    return (
      <Grid item xs={6}>
        <InputLabel htmlFor={id} sx={{ fontSize: '12px', color: '#212B36', marginBottom: '4px' }}>{label}</InputLabel>
        <TextField
          fullWidth
          size="small"
          value={inputValues[id]}
          id={id}
          onChange={handleInputChange}
          sx={{ 
            '& .MuiInputBase-root': { height: '40px' },
            '& .MuiInputBase-input': { fontSize: '14px' } 
          }}
          InputProps={{
            endAdornment: inputAdornment ? (
              <>
                <Divider sx={{ height: 40, m: 0 }} orientation="vertical" />
                <InputAdornment position="end">{inputAdornment}</InputAdornment>
              </>
            ) : null
          }}
        />
      </Grid>
    );
  };

  return (
    <>
      <FormControl variant="outlined">
      <Select
        value={selectedOptions[type]}
        onClick={handleClick}
        readOnly
        renderValue={(selected) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '100%', // Ensure the Box takes the full width of the parent
            }}
          >
            {selected}
          </Box>
        )}
        IconComponent={() => (
          <Iconify
            icon="material-symbols:expand-more-rounded"
            width={20}
            height={20}
            sx={{ marginRight: '5px' }}
          />
        )}
        sx={{
          height: '40px', // Forcefully set the height to 40px
          width: '13.19vw',
          marginRight: '1rem',
          '.MuiOutlinedInput-root': {
            height: '40px', // Ensure the input root also respects the height
            width: '13.19vw',
          },
          '.MuiSelect-select': {
            height: '40px', // Ensure the select respects the height
            width: '13.19vw',
            display: 'flex',
            alignItems: 'center',
            padding: '8px !important',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        }}
      />
      </FormControl>
      <Popover
        id="simple-popover"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box
          sx={{
            width: '284px',
            height: `${type === "first" ? '100%' : '338px'}`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Grid container sx={{ padding: '24px 24px 6px 24px'}} spacing={2}>
            { type === "third" && (
              <>
                {renderGridItem("Voltage level", "voltageLevel", "kV")}
                {renderGridItem("Wiring Area", "wiringArea", "sq")}
              </>
            )} 
            <Grid item xs={12}>
              <InputLabel htmlFor="bigInput" sx={{ fontSize: '12px', color: '#212B36', marginBottom: '4px' }}>{type === "first" ? "Voltage level": "Cable Type"}</InputLabel>
              <TextField
                fullWidth
                size="small"
                id='bigInput'
                value={type === "first" ? inputValues.voltageLevel : inputValues.cableType}
                onChange={handleInputChange}
                sx={{ marginBottom: 2, '& .MuiInputBase-input': { fontSize: '14px' } }}
                InputProps={{
                  endAdornment: type === "first" ? (
                    <>
                      <Divider sx={{ height: 40, m: 0 }} orientation="vertical" />
                      <InputAdornment position="end">kV</InputAdornment>
                    </>
                  ): null
                }}
              />
            </Grid>
            { type === "first" && (
              <>
                {renderGridItem('Start Location', 'startLocation')}
                {renderGridItem('End Location', 'endLocation', 'T/L')}
              </>
            )}
            { type === "second" && (
              <>
                {renderGridItem("Voltage level", "voltageLevel", "kV")}
                {renderGridItem("Wiring Area", "wiringArea", "sq")}
                {renderGridItem('# T/L', 'tlCount')}
                {renderGridItem('T/L Length', 'tlLength', 'km')}
              </>
            )}
            { type === "third" && (
              <>
                {renderGridItem('# T/L', 'tlCount')}
                {renderGridItem('T/L Length', 'tlLength', 'km')}
              </>
            )}
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', height: '8.11vh', marginTop: 2, padding: '6px 24px 24px 24px' }}>
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
              <Iconify
                icon={'radix-icons:cross-2'}
                width={20}
                height={20}
                style={{ color: '#596570', margin: 'auto' }}
              />
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
              onClick={() => {handleOkayClick(inputValues)}}
            >
              <Iconify
                icon={'tabler:check'}
                width={20}
                height={20}
                style={{ color: '#FF6B00', margin: 'auto' }}
              />
              <Typography
                variant="body2"
                sx={{
                  textDecoration: 'none',
                  fontSize: '14px',
                  lineHeight: '24px',
                  fontWeight: 600,
                  color: '#FF6B00',
                  textAlign: 'left',
                  minWidth: '33px',
                }}
              >
                Okay
              </Typography>
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
};

DropdownPopover.propTypes = {
  type: Proptypes.oneOf(['first', 'second', 'third']).isRequired,
  newObj: Proptypes.object.isRequired,
  handleChangeStatus: Proptypes.func.isRequired,
};

export default DropdownPopover;