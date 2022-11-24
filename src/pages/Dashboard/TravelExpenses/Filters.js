import React from 'react';
import { Stack, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCheckbox = styled(Checkbox)(({ theme }) => ({
  color: theme.palette.chart.green[0],
  '&.Mui-checked': {
    color: theme.palette.chart.green[0],
  },
  '& .MuiSvgIcon-root': { fontSize: 14 },
}));

const Filters = () => {
  return (
    <Stack direction="row" component={FormGroup}>
      <FormControlLabel
        componentsProps={{ typography: { variant: 'body2' } }}
        control={<StyledCheckbox defaultChecked size="small" />}
        label="Travel expenses"
      />
      <FormControlLabel
        componentsProps={{ typography: { variant: 'body2' } }}
        control={<StyledCheckbox defaultChecked size="small" />}
        label="Special travel expenses"
      />
      <FormControlLabel
        componentsProps={{ typography: { variant: 'body2' } }}
        control={<StyledCheckbox defaultChecked size="small" />}
        label="Outsourced teams & tasks"
      />
      <FormControlLabel
        componentsProps={{ typography: { variant: 'body2' } }}
        control={<StyledCheckbox defaultChecked size="small" />}
        label="Tasks"
      />
    </Stack>
  );
};

export default Filters;
