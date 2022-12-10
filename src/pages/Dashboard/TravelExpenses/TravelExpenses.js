import React from 'react';
import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import { styled } from '@mui/material/styles';
import { Avatar, Typography, Box, Button as MuiButton } from '@mui/material';

import './calendar.scss';

// components
import Header from './Header';
import { Loader } from 'reusables';
import Drawer from './Drawer';
import Timeline from './Timeline';
import { Filters } from 'components';
import { useSelector } from 'react-redux';

const TotalsButton = styled(MuiButton)(({ theme }) => ({
  transform: 'rotate(90deg)',
  position: 'absolute',
  top: '29px',
  right: '-70px',
  padding: '8px 30px',
  borderRadius: '8px 8px 0px 0px',
  background: '#FFA58D',
  color: '#fff',
  boxShadow: theme.customShadows.z8,
  zIndex: 1,
}));

function App() {
  const [loader, setLoader] = React.useState(false);
  const { isfilterOpen } = useSelector((s) => s.filter);
  return (
    <>
      <Header />

      {isfilterOpen ? (
        <Filters />
      ) : (
        <Box position="relative" marginLeft={3} marginRight={6} sx={{ boxShadow: (theme) => theme.customShadows.z8 }}>
          <Drawer />
          <TotalsButton size="small" variant="contained" color="inherit">
            Totals
          </TotalsButton>
          <Loader open={loader} setOpen={setLoader} />
          <Timeline />
        </Box>
      )}
    </>
  );
}

export default App;
