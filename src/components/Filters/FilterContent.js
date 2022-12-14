import { Stack } from '@mui/system';
import React from 'react';
import style from './filter.module.scss';
import { Select } from 'components';
import { dummyArray } from 'utils/helper';
import Iconify from 'components/Iconify';

const FilterContent = ({ name, value, label, icon, handleChange, showDetail = true, handleUpdateFilter }) => (
  <Stack direction="row" gap={'50px'} alignItems="center">
    <Select
      icon={icon}
      label={label}
      handleChange={(e) => handleChange(e, name)}
      value={value}
      data={dummyArray(label, 5)}
    />
    {showDetail && (
      <Stack direction="row" gap={'10px'}>
        {value.map((e) => (
          <div className={style.rightContent} key={e}>
            {e}
            <span>
              <Iconify
                onClick={() => handleUpdateFilter(name, value, e)}
                icon={'eva:close-fill'}
                width={15}
                height={15}
              />
            </span>
          </div>
        ))}
      </Stack>
    )}
  </Stack>
);

export default FilterContent;
