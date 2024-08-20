import React, { useState, useEffect } from 'react';
import { Popover, Grid, Select, FormControl, Box, Button, TextField, InputLabel, MenuItem, Typography, InputAdornment, Divider } from '@mui/material';
import Iconify from 'components/Iconify';
import Proptypes from 'prop-types';

const DropdownPopover = ({ type }) => {
  const initialInputValues = {
    first: {
      bigInput: '154',
      startLocation: 'Namyang',
      endLocation: 'Yeonsu',
    },
    second: {
      voltageLevel: '154',
      bigInput: 'XLPE',
      wiringArea: '200',
      tlCount: '2',
      tlLength: '2.8',
    },
    third: {
      voltageLevel: '154',
      bigInput: 'XLPE',
      wiringArea: '200',
      tlCount: '2',
      tlLength: '2.8',
    },
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [inputValues, setInputValues] = useState(initialInputValues[type]);
  const [selectedOptions, setSelectedOptions] = useState({
    first: '',
    second: '',
    third: '',
  });

  useEffect(() => {
    setInputValues(initialInputValues[type]);
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [type]: formatInputValues(inputValues), // or format the inputValues as needed
    }));
  }, [type]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
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
    console.log(formattedValues);
    return formattedValues.slice(0, -2); // Remove the trailing comma and space
  };

  const handleOkayClick = () => {
    
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [type]: formatInputValues(inputValues), // or format the inputValues as needed
    }));
    handleClose(); 
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
            <Box sx={{ display: 'flex', alignItems: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '94%' }}>
              {selected}
            </Box>
          )}
          IconComponent={() => <Iconify icon="material-symbols:expand-more-rounded" width={20} height={20} sx={{ marginRight: '5px'}} />}
          sx={{
            height: '40px', // Forcefully set the height to 40px
            width: '190px',
            '.MuiOutlinedInput-root': {
              height: '40px', // Ensure the input root also respects the height
              width: '190px',
            },
            '.MuiSelect-select': {
              height: '40px', // Ensure the select respects the height
              width: '190px',
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
              onClick={handleOkayClick}
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
};

export default DropdownPopover;