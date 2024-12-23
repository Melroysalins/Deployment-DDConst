import { Button as MuiButton, Stack } from '@mui/material';
import Iconify from 'components/Iconify';
import React from 'react';

import Filters from './Filters';
import BasicTabs from 'components/Drawer/BasicTabs';
import useMain from 'pages/context/context';
import RequestApproval from 'layouts/RequestApproval';

// components
const Header = ({t}) => {
  const {
		openRequestApproval,
		setopenRequestApproval,
		isDrawerOpen,
		setisDrawerOpen,
    setFromPage
	} = useMain()

  return (
    <Stack direction="row" alignItems="center" spacing={2} sx={{ position: 'absolute', top: '24px', right: '40px' }}>
      {/* Not responsive */}
      <Filters t={t} />
      <MuiButton
        variant="contained"
        size="medium"
        color="inherit"
        sx={{ border: '1px solid #596570' }}
        onClick={() => setopenRequestApproval(!openRequestApproval)}
      >
        {t('request_approval')}
      </MuiButton>
      <MuiButton
        size="small"
        variant="contained"
        color="inherit"
        sx={{ padding: 1, minWidth: 0 }}
        onClick={() => {
          setisDrawerOpen(true)
          setFromPage("travel_expenses")
        }}
      >
        <Iconify icon="heroicons-outline:document-text" width={20} height={20} />
      </MuiButton>
      <MuiButton size="small" variant="contained" color="inherit" sx={{ padding: 1, minWidth: 0 }}>
        <Iconify icon="material-symbols:download-rounded" width={20} height={20} />
      </MuiButton>
      <MuiButton
        startIcon={<Iconify icon="ph:hourglass-simple-bold" width={20} height={20} />}
        size="small"
        variant="outlined"
        color="inherit"
        sx={{ padding: '8px 24px', minWidth: 0 }}
      >
        {t('Pending')}
      </MuiButton>
      {isDrawerOpen &&  <BasicTabs open={isDrawerOpen} setopen={setisDrawerOpen} />}
      {openRequestApproval && <RequestApproval />}
    </Stack>
  );
};

export default Header;
