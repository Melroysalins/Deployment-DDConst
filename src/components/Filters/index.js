import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React from 'react';
import style from './filter.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import filter from 'redux/actions/filter';
import { getSelectValue, isEmpty } from 'utils/helper';
import Iconify from 'components/Iconify';
import FilterContent from './FilterContent';
import { Select, DatePicker } from 'components';

export default function Filters({ showDetail = true }) {
  const dispatch = useDispatch();
  const { companies, projects, employees, time } = useSelector((s) => s.filter);

  const handleChange = ({ target: { value } }, name) => {
    dispatch(filter.updateFilterValues(name, getSelectValue(value)));
  };

  const clearFilter = (name) => {
    dispatch(filter.updateFilterValues(name, []));
  };

  const handleUpdateFilter = (name, value, index) => {
    const _rm = value.filter((e) => e !== index);
    dispatch(filter.updateFilterValues(name, _rm));
  };

  const HeaderFilterCount = (name, value, color) => {
    if (isEmpty(value)) return <></>;
    return (
      <div className={style.headerCount} style={{ color, border: `1px solid ${color}` }}>
        {value.length} {name}
        <span>
          <Iconify onClick={() => clearFilter(name)} icon="eva:close-fill" width={15} height={15} />
        </span>
      </div>
    );
  };

  const dummyDate = ['This month', 'This year', 'Today'];

  return (
    <div className={style.container}>
      {!!showDetail && (
        <Stack direction="row" gap={'10px'}>
          <Typography variant="h5">Filters:</Typography>

          <>
            {HeaderFilterCount('companies', companies, '#FF6B00')}
            {HeaderFilterCount('projects', projects, '#98D2C3')}
            {HeaderFilterCount('employees', employees, '#7FBCFE')}
          </>
        </Stack>
      )}

      <Stack direction="row" gap={'10px'} alignItems="center">
        <Select
          icon={'uil:calender'}
          label={'Select Time'}
          handleChange={(e) => handleChange(e, 'time')}
          value={time}
          data={dummyDate}
          multiple={false}
        />
        {!!showDetail && time && <DatePicker />}
      </Stack>

      <FilterContent
        name={'companies'}
        value={companies}
        icon={'ic:round-home-work'}
        label={'Companies'}
        handleChange={handleChange}
        showDetail={showDetail}
        handleUpdateFilter={handleUpdateFilter}
      />

      <FilterContent
        name={'projects'}
        value={projects}
        icon={'tabler:crane'}
        label={'Projects'}
        handleChange={handleChange}
        showDetail={showDetail}
        handleUpdateFilter={handleUpdateFilter}
      />

      <FilterContent
        name={'employees'}
        value={employees}
        icon={'ri:user-3-line'}
        label={'All Employees'}
        handleChange={handleChange}
        showDetail={showDetail}
        handleUpdateFilter={handleUpdateFilter}
      />
    </div>
  );
}
