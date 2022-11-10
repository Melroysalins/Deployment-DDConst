// @mui
import { useTheme } from '@mui/material/styles';
import { useLocation, Outlet } from 'react-router-dom';
import { Button, Stack } from '@mui/material';
// components
import Iconify from 'components/Iconify';
import BreadCrumb from './BreadCrumb';

// ----------------------------------------------------------------------

export default function Projects() {
  const theme = useTheme();
  const location = useLocation();
  const paths = location.pathname.split('/').filter((path) => path);
  let selected = paths[paths.length - 1];
  switch (selected) {
    case 'projects':
      selected = 'projectsList';
      break;
    case 'add':
      selected = 'addNewProject';
      break;
    default:
      selected = 'viewProject';
      break;
  }

  const actions = {
    projectsList: (
      <Button
        variant="outlined"
        href="/dashboard/projects/add"
        startIcon={<Iconify icon={'fluent:add-16-filled'} sx={{ width: 16, height: 16, ml: 1 }} />}
        sx={{
          color: theme.palette.text.default,
          border: '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.04)',
          borderRadius: '8px',
        }}
      >
        Add New Project
      </Button>
    ),
    addNewProject: <></>,
    viewProject: <></>,
  };
  return (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between" pl={3} pr={3} mb={5}>
        <BreadCrumb selected={selected} />
        {actions[selected]}
      </Stack>
      <Outlet />
    </>
  );
}
