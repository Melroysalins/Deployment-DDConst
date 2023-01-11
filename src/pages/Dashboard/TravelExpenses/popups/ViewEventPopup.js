// @mui
import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, Box, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// components
import PopupForm from 'components/Popups/PopupForm';
import Iconify from 'components/Iconify';
import { AddTravelExpensesForm, AddSpecialTravelExpensesForm } from '../forms';
import Logs from './Logs';
import useTE from '../context/context';
import { TEActionType } from '../context/types';

import { deleteEvent } from 'supabase/events';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box pt={2} sx={{ p: 1 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
// ----------------------------------------------------------------------

ViewEventPopup.propTypes = {
  handleClose: PropTypes.func.isRequired,
  anchor: PropTypes.any,
  type: PropTypes.oneOf(['ste', 'te', null]).isRequired,
  data: PropTypes.object.isRequired,
  employees: PropTypes.array.isRequired,
};

const forms = {
  ste: {
    title: 'View Special Travel Expenses',
    component: AddSpecialTravelExpensesForm,
    variant: 'primary',
  },
  te: {
    title: 'View Travel Expenses',
    component: AddTravelExpensesForm,
    variant: 'primary',
  },
};

export default function ViewEventPopup({ handleClose, anchor, type, data, employees }) {
  const theme = useTheme();
  const { state, dispatch } = useTE();
  const [toast, setToast] = React.useState(null);

  const ref = React.useRef();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  React.useEffect(() => {}, []);
  const Form = forms[type].component;

  const handleSubmit = () => {
    ref?.current?.onSubmit();
  };

  const handleDeleteEvent = async () => {
    try {
      const res = await deleteEvent(data.id);
      if (res.status >= 200 && res.status < 300) {
        setToast({ severity: 'success', message: 'Succesfully deleted event!' });
        dispatch({ type: TEActionType.BEEP, payload: true });
        handleClose();
      } else {
        setToast({ severity: 'error', message: 'Failed to delete event!' });
      }
    } catch (err) {
      console.log(err);
    }
  };

  console.log(data);

  return (
    <>
      <PopupForm variant={forms[type].variant} handleSubmit={handleSubmit} handleClose={handleClose} anchor={anchor}>
        <Box sx={{ width: '100%' }}>
          <Tabs
            variant="fullWidth"
            value={value}
            onChange={handleChange}
            indicatorColor={forms[type].variant}
            aria-label="secondary tabs example"
          >
            <Tab label="Settings" {...a11yProps(0)} />
            <Tab label="Logs" {...a11yProps(0)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <Form edit handleClose={handleClose} employees={employees} data={data} ref={ref} />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              sx={{ color: (theme) => theme.palette.colors[8] }}
              startIcon={<Iconify icon="material-symbols:delete-outline" width={15} height={15} />}
              size="small"
              onClick={handleDeleteEvent}
            >
              Delete
            </Button>
          </div>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Logs />
        </TabPanel>
      </PopupForm>
    </>
  );
}
