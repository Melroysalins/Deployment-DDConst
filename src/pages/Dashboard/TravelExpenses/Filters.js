import React from 'react';
import PropTypes from 'prop-types';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { Stack, FormGroup, FormControlLabel, Checkbox } from '@mui/material';

import { styled } from '@mui/material/styles';

const StyledCheckbox = styled(Checkbox)(({ theme }) => ({
  color: theme.palette.chart.green[0],
  '&.Mui-checked': {
    color: theme.palette.chart.green[0],
  },
  '& .MuiSvgIcon-root': { fontSize: 14 },
}));

Filters.propTypes = {
  filters: PropTypes.object.isRequired,
};

export default function Filters({ filters }) {
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleChange = React.useCallback(
    (e) => {
      const name = e.target.name;
      const updatedFilter = {
        ...filters,
        [name]: e.target.checked,
      };
      const filterTostring = Object.keys(updatedFilter)
        .filter((item) => updatedFilter[item])
        .join(',');
      if (filterTostring.length > 0) {
        navigate({
          pathname,
          search: `?filters=${filterTostring}`,
        });
      } else
        navigate({
          pathname,
        });
    },
    [searchParams, filters]
  );

  return (
    <Stack direction="row" component={FormGroup}>
      <FormControlLabel
        componentsProps={{ typography: { variant: 'body2' } }}
        control={<StyledCheckbox name="te" checked={filters.te} onChange={handleChange} size="small" />}
        label="Travel expenses"
      />
      <FormControlLabel
        componentsProps={{ typography: { variant: 'body2' } }}
        control={<StyledCheckbox name="ste" checked={filters.ste} onChange={handleChange} size="small" />}
        label="Special travel expenses"
      />
      <FormControlLabel
        componentsProps={{ typography: { variant: 'body2' } }}
        control={<StyledCheckbox name="outsourced" checked={filters.outsourced} onChange={handleChange} size="small" />}
        label="Outsourced teams & tasks"
      />
      <FormControlLabel
        componentsProps={{ typography: { variant: 'body2' } }}
        control={<StyledCheckbox name="tasks" checked={filters.tasks} onChange={handleChange} size="small" />}
        label="Tasks"
      />
    </Stack>
  );
}
