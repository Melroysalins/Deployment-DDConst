import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React, { useEffect } from 'react';
import style from './filter.module.scss';
import { getSelectValue, isEmpty, isNotEmpty } from 'utils/helper';
import Iconify from 'components/Iconify';
import FilterContent from './FilterContent';
import { Select, DatePicker } from 'components';
import useMain from 'pages/context/context';
import { MainActionType } from 'pages/context/types';
import moment from 'moment';

export default function Filters({ showDetail = true }) {
  const { state, dispatch } = useMain();
  const { companies, projects, employees, time, dateRange } = state.filters || {};
  const [valueRange, setvalueRange] = React.useState([null, null]);

  useEffect(() => {
    if (!!showDetail && time) {
      if (dateRange && dateRange[0] && dateRange[1]) {
        setvalueRange([dateRange[0], dateRange[1]]);
      } else {
        setvalueRange([moment().startOf('month'), moment().endOf('month')]);
      }
    }
  }, [time, showDetail]);

  useEffect(() => {
    if (valueRange[0] && valueRange[1]) {
      dispatch({
        type: MainActionType.UPDATE_FILTER_VALUES,
        payload: {
          name: 'dateRange',
          value: [
            valueRange[0]?.$d ? moment(valueRange[0].$d) : valueRange[0],
            valueRange[1]?.$d ? moment(valueRange[1].$d) : valueRange[1],
          ],
        },
      });
    }
  }, [valueRange]);

  const handleChange = ({ target: { value } }, name) => {
    const _value = getSelectValue(value);
    dispatch({ type: MainActionType.UPDATE_FILTER_VALUES, payload: { name, value: _value } });
  };

  const clearFilter = (name) => {
    dispatch({ type: MainActionType.UPDATE_FILTER_VALUES, payload: { name, value: [] } });
  };

  const handleUpdateFilter = (name, value, index) => {
    const _rm = value.filter((e) => e !== index);
    dispatch({ type: MainActionType.UPDATE_FILTER_VALUES, payload: { name, value: _rm } });
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

  const dummyDate = ['This month'];

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
        {!!showDetail && time && <DatePicker setvalueRange={setvalueRange} valueRange={valueRange} />}
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
