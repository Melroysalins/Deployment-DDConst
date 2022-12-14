import { Drawer, Filters } from 'components';
import Iconify from 'components/Iconify';
import useMain from 'pages/context/context';
import React from 'react';
import { isNotEmpty } from 'utils/helper';
import style from './log.module.scss';
import Message from './Message';

export default function Logs({ open, setopen }) {
  const { state, dispatch } = useMain();
  const { companies, projects, employees, time } = state.filters || {};
  const showFilter = isNotEmpty(companies) || isNotEmpty(projects) || isNotEmpty(employees) || isNotEmpty(time);

  return (
    <Drawer
      open={open}
      setopen={setopen}
      headerIcon={'heroicons-outline:document-text'}
      header={
        <div className={style.headerContent}>
          <b>Logs</b>
          <Iconify color={showFilter ? 'secondary.main' : 'inherit'} icon="heroicons-funnel" width={20} height={20} />
        </div>
      }
    >
      {showFilter && <Filters showDetail={false} />}

      {[...Array(10).keys()].map((e, index) => (
        <React.Fragment key={index}>
          <Message />
        </React.Fragment>
      ))}
    </Drawer>
  );
}
