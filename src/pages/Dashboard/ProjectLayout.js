import React from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { useLocation, Outlet } from 'react-router-dom';
import { Button, Stack } from '@mui/material';
// components
import BreadCrumb from './BreadCrumb';
import { StoreProvider, useStore } from './store/Store';

// ----------------------------------------------------------------------

export default function Projects() {
  const location = useLocation();
  const paths = location.pathname.split('/').filter((path) => path);
  let selected = paths[paths.length - 1];
  switch (selected) {
    case 'list':
      selected = 'projectsList';
      break;
    case 'add':
      selected = 'addNewProject';
      break;
    default:
      selected = 'viewProject';
      break;
  }

  return (
    <StoreProvider>
      <Stack direction="row" alignItems="center" justifyContent="space-between" pl={3} pr={3} mb={5}>
        <ProjectHeader />
      </Stack>
      <Outlet />
    </StoreProvider>
  );
}

function ProjectHeader({ selected }) {
  const { actionFunction } = useStore();
  React.useEffect(() => {
    console.log(typeof actionFunction);
  });
  return (
    <>
      <BreadCrumb selected={selected} />
      {typeof actionFunction === 'function' && actionFunction()}
    </>
  );
}
