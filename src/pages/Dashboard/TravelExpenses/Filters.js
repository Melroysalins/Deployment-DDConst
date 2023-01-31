import { Checkbox, FormControlLabel, FormGroup, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const StyledCheckbox = styled(Checkbox)(({ theme }) => ({
  color: theme.palette.chart.green[0],
  '&.Mui-checked': {
    color: theme.palette.chart.green[0],
  },
  '& .MuiSvgIcon-root': { fontSize: 14 },
}));

const initialFilters = { te: false, ste: false };

export default function Filters() {
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    let filters = searchParams.get('filters') ?? '';
    console.log(filters);
    filters = filters?.split(',').reduce((acc, cur) => ({ ...acc, [cur]: true }), initialFilters);
    setFilters(filters);
  }, [searchParams]);

  const handleChange = (e) => {
    let filters = searchParams.get('filters') ?? '';
    filters = filters?.split(',').reduce((acc, cur) => ({ ...acc, [cur]: true }), initialFilters);
    if (filters) filters = { ...initialFilters, ...filters };
    console.log(filters);
    const { name } = e.target;
    const updatedFilter = {
      ...filters,
      [name]: e.target.checked,
    };
    console.log(e.target.checked, updatedFilter, name);
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
  };

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
      {/* <FormControlLabel
        componentsProps={{ typography: { variant: 'body2' } }}
        control={<StyledCheckbox name="outsourced" checked={filters.outsourced} onChange={handleChange} size="small" />}
        label="Outsourced teams & tasks"
      />
      <FormControlLabel
        componentsProps={{ typography: { variant: 'body2' } }}
        control={<StyledCheckbox name="tasks" checked={filters.tasks} onChange={handleChange} size="small" />}
        label="Tasks"
      /> */}
    </Stack>
  );
}
