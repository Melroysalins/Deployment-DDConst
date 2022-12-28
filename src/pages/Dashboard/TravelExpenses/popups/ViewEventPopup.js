// @mui
import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// components
import PopupForm from 'components/Popups/PopupForm';
import { AddTravelExpensesForm, AddSpecialTravelExpensesForm } from '../forms';
import Logs from './Logs';

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
    variant: 'inherit',
  },
  te: {
    title: 'View Travel Expenses',
    component: AddTravelExpensesForm,
    variant: 'primary',
  },
};

export default function ViewEventPopup({ handleClose, anchor, type, data, employees }) {
  const theme = useTheme();
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
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Logs />
        </TabPanel>
      </PopupForm>
    </>
  );
}
