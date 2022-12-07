import { Drawer } from 'components';
import Iconify from 'components/Iconify';
import React from 'react';
import style from './log.module.scss';
import Message from './Message';

export default function Logs({ open, setopen }) {
  return (
    <Drawer
      open={open}
      setopen={setopen}
      headerIcon={'heroicons-outline:document-text'}
      header={
        <div className={style.headerContent}>
          <b>Logs</b>
          <Iconify color="secondary.main" icon="heroicons-funnel" width={20} height={20} />
        </div>
      }
    >
      {[...Array(10).keys()].map((e, index) => (
        <React.Fragment key={index}>
          <Message />
        </React.Fragment>
      ))}
    </Drawer>
  );
}
