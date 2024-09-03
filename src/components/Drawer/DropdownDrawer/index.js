import React, { useState, useEffect, useMemo } from 'react';
import { Popover, Grid, Select, FormControl, Box, Button, TextField, InputLabel, Typography, InputAdornment, Divider } from '@mui/material';
import Iconify from 'components/Iconify';
import Proptypes from 'prop-types';

const DropdownPopover = ({ type, newObj, handleChangeStatus }) => {

  const [anchorEl, setAnchorEl] = useState(null);
  const [inputValues, setInputValues] = useState({});
  const [selectedOptions, setSelectedOptions] = useState({
    cable_name: '',
    cable_type: '',
    demolition_type: '',
  });

  useEffect(() => {
    const updatedInputValues = {
      cable_name: newObj.cable_name,
      cable_type: {
        ...newObj.cable_type,
        tlCount: newObj?.currentObj?.connections[0]?.statuses?.length,
      },
      demolition_type: {
        ...newObj.demolition_type,
        tlCount: newObj?.currentObj?.demolitions[0]?.statuses?.length,
      },
    };

    setInputValues(updatedInputValues[type]);
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [type]: formatInputValues(updatedInputValues[type], type),
    }));
  }, [newObj, type]);

  useEffect(() => {
    if (type === "cable_name") {
      newObj.cable_name = inputValues;
    } else if (type === "cable_type") {
      newObj.cable_type = inputValues;
    } else if (type === "demolition_type") {
      newObj.demolition_type = inputValues;
    }
  }, [inputValues]);

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

  const formatInputValues = (values, type) => {
    const formattedValues = [];
    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        if (key === 'bigInput') { 
          if (type === "cable_name") {
            formattedValues[0] = `${value}kV`;
          }
          if (type === "cable_type" || type === "demolition_type") {
            formattedValues[1] = `${value}`;
          }
        }
        else if (key === 'voltageLevel') {
          formattedValues[0] = `${value}kV`;  
        } else if (key === 'wiringArea') {
          formattedValues[2] = `${value}sq`;
        } else if (key === 'tlLength') {
          formattedValues[4] = `${value}km`;
        } else if (key === 'tlCount') {
          formattedValues[3] = `${value}회선`;
        } else if (key === 'endLocation') {
          formattedValues[2] = `${value}T/L`;
        } else if (key === 'startLocation') {
          formattedValues[1] = `${value}-`;
        }
      }
    });
    return formattedValues.join(' ');
  };

  const handleOkayClick = (inputValues) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [type]: formatInputValues(inputValues, type),
    }));
    handleClose(); 
    handleChangeStatus(newObj.id, parseInt(inputValues?.tlCount, 10), type)
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
              maxWidth: '100%',
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
          height: '40px',
          width: '13.19vw',
          marginRight: '1rem',
          '.MuiOutlinedInput-root': {
            height: '40px',
            width: '13.19vw',
          },
          '.MuiSelect-select': {
            height: '40px',
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
            height: `${type === "cable_name" ? '100%' : '338px'}`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Grid container sx={{ padding: '24px 24px 6px 24px'}} spacing={2}>
            { type === "demolition_type" && (
              <>
                {renderGridItem("Voltage level", "voltageLevel", "kV")}
                {renderGridItem("Wiring Area", "wiringArea", "sq")}
              </>
            )} 
            <Grid item xs={12}>
              <InputLabel htmlFor="bigInput" sx={{ fontSize: '12px', color: '#212B36', marginBottom: '4px' }}>{type === "cable_name" ? "Voltage level": "Cable Type"}</InputLabel>
              <TextField
                fullWidth
                size="small"
                id="bigInput"
                value={inputValues.bigInput}
                onChange={handleInputChange}
                sx={{ marginBottom: 2, '& .MuiInputBase-input': { fontSize: '14px' } }}
                InputProps={{
                  endAdornment: type === "cable_name" ? (
                    <>
                      <Divider sx={{ height: 40, m: 0 }} orientation="vertical" />
                      <InputAdornment position="end">kV</InputAdornment>
                    </>
                  ): null
                }}
              />
            </Grid>
            { type === "cable_name" && (
              <>
                {renderGridItem('Start Location', 'startLocation')}
                {renderGridItem('End Location', 'endLocation', 'T/L')}
              </>
            )}
            { type === "cable_type" && (
              <>
                {renderGridItem("Voltage level", "voltageLevel", "kV")}
                {renderGridItem("Wiring Area", "wiringArea", "sq")}
                {renderGridItem('# T/L', 'tlCount')}
                {renderGridItem('T/L Length', 'tlLength', 'km')}
              </>
            )}
            { type === "demolition_type" && (
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
  type: Proptypes.oneOf(['cable_name', 'cable_type', 'demolition_type']).isRequired,
  newObj: Proptypes.object.isRequired,
  handleChangeStatus: Proptypes.func.isRequired,
};

export default DropdownPopover;