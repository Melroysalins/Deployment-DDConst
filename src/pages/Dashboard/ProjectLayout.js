import React from 'react';
// @mui
import { useLocation, Outlet } from 'react-router-dom';
import { Box, Stack } from '@mui/material';
// components
import BreadCrumb from './BreadCrumb';
import { StoreProvider, useStore } from './store/Store';
import { MainProvider } from 'pages/context/context';

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
      <Stack justifyContent="space-between">
        <Box pl={3} pr={3} mb={4} component="div">
          <ProjectHeader />
        </Box>

        <Outlet isprop={true} />
      </Stack>
    </StoreProvider>
  );
}

function ProjectHeader({ selected }) {
  const { actionFunction } = useStore();
  return (
    <>
      <BreadCrumb selected={selected} />
      {typeof actionFunction === 'function' && actionFunction()}
    </>
  );
}
