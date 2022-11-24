import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
// material
import { styled, useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
//
import DashboardNavbar from './DashboardNavbar';
import DashboardSidebar from './DashboardSidebar';
import { DRAWER_WIDTH, APP_BAR_MOBILE, APP_BAR_DESKTOP } from 'constant';

// ----------------------------------------------------------------------

const RootStyle = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
});

const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  width: '100%',
  padding: '20px',
  borderRadius: `20px`,
  position: 'relative',
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const matchDownMd = useMediaQuery(theme.breakpoints.down('lg'));

  const handleLeftDrawerToggle = () => {
    setOpen(!open);
  };

  useEffect(() => {
    setOpen(false);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchDownMd]);
  return (
    <RootStyle>
      {/* <DashboardNavbar leftDrawerOpened={open} onOpenSidebar={handleLeftDrawerToggle} /> */}
      <DashboardSidebar leftDrawerOpened={open} onCloseSidebar={handleLeftDrawerToggle} />
      <MainStyle>
        <Outlet />
      </MainStyle>
    </RootStyle>
  );
}
