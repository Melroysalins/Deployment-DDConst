// @mui
import {
  Alert,
  Backdrop,
  Box,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useFormik } from 'formik';
import moment from 'moment-timezone';
import React, { forwardRef, useImperativeHandle } from 'react';
import { createNewEvent, editEvent } from 'supabase/events';
import * as Yup from 'yup';

import useTE from '../context/context';
import { TEActionType } from '../context/types';

// components
// api
// ----------------------------------------------------------------------
const validationSchema = Yup.object().shape({
  employee: Yup.string().min(2, 'Too Short!').required('Required').nullable(),
  sub_type: Yup.string().required('Required').nullable(),
  start: Yup.date().required('Required').nullable(),
  end: Yup.date().required('Required').nullable(),
  status: Yup.string().required('Required').nullable(),
});

const initialValues = {
  employee: null,
  sub_type: null,
  type: 'ste',
  start: null,
  status: 'Planned',
};

const AddSpecialTravelExpensesForm = forwardRef((props, ref) => {
  const { data = {}, employees, handleClose, edit = false } = props;
  const { dispatch } = useTE();
  const [loader, setLoader] = React.useState(false);
  const [toast, setToast] = React.useState(null);

  console.log(data);

  const { handleSubmit, errors, touched, handleChange, handleBlur, values, setFieldValue, setValues } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      setLoader(true);
      try {
        let res;
        const { id } = values;
        delete values.id;
        if (edit) {
          res = await editEvent(values, id);
          if (res.status >= 200 && res.status < 300) {
            setToast({ severity: 'success', message: 'Succesfully edited event!' });
            dispatch({ type: TEActionType.BEEP, payload: true });
            handleClose();
          } else {
            setToast({ severity: 'error', message: 'Failed to edit event!' });
          }
        } else {
          res = await createNewEvent(values);
          if (res.status >= 200 && res.status < 300) {
            setToast({ severity: 'success', message: 'Succesfully added new event!' });
            dispatch({ type: TEActionType.BEEP, payload: true });
            handleClose();
          } else {
            setToast({ severity: 'error', message: 'Failed to added new event!' });
          }
        }
      } catch (err) {
        console.log(err);
      }
      setLoader(false);
    },
  });

  useImperativeHandle(ref, () => ({
    onSubmit() {
      handleSubmit();
    },
  }));

  const handleCloseToast = () => {
    setToast(null);
  };

  React.useEffect(() => {
    if (data) setValues({ ...values, ...data });
  }, [data]);

  return (
    <>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loader}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        open={toast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={5000}
        onClose={handleCloseToast}
      >
        <Alert onClose={handleCloseToast} severity={toast?.severity} sx={{ width: '100%' }}>
          {toast?.message}
        </Alert>
      </Snackbar>
      <Box onSubmit={handleSubmit} component="form" noValidate autoComplete="off" p={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel shrink id="demo-simple-select-helper-label">
                Employee
              </InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={values.employee}
                label="Employee"
                onChange={handleChange}
                onBlur={handleBlur}
                name="employee"
                fullWidth
              >
                {employees.map((employee) => (
                  <MenuItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText error={errors.employee && touched.employee}>
                {touched.employee ? errors.employee : null}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel shrink id="demo-simple-select-helper-label">
                Expense Type
              </InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={values.sub_type}
                label="Expense Type"
                onChange={handleChange}
                onBlur={handleBlur}
                name="sub_type"
                fullWidth
              >
                <MenuItem value="overtime">Overtime</MenuItem>
                <MenuItem value="nightTime">Night-time</MenuItem>
                <MenuItem value="restDayMove">Rest Day move</MenuItem>
              </Select>
              <FormHelperText error={errors.sub_type && touched.sub_type}>
                {touched.sub_type ? errors.sub_type : null}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel shrink id="demo-simple-select-helper-label">
                Status
              </InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={values.status}
                label="Status"
                onChange={handleChange}
                onBlur={handleBlur}
                name="status"
                fullWidth
              >
                <MenuItem value="Planned">Planned</MenuItem>
                <MenuItem value="Approved">Approved</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
              </Select>
              <FormHelperText error={errors.status && touched.status}>
                {touched.status ? errors.status : null}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                inputFormat="YYYY-MM-DD"
                onChange={(newValue) => {
                  const start = moment(newValue).format('YYYY-MM-DD');
                  setFieldValue('start', start);
                }}
                onBlur={handleBlur}
                value={values.start}
                name="start"
                fullWidth
                id="outlined-textarea"
                label="start"
                placeholder=""
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={errors.start && touched.start}
                    helperText={touched.start ? errors.start : null}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                inputFormat="YYYY-MM-DD"
                onChange={(newValue) => {
                  const end = moment(newValue).format('YYYY-MM-DD');
                  setFieldValue('end', end);
                }}
                onBlur={handleBlur}
                value={values.end}
                name="end"
                fullWidth
                id="outlined-textarea"
                label="end"
                placeholder=""
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={errors.end && touched.end}
                    helperText={touched.end ? errors.end : null}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
      </Box>
    </>
  );
});

export default AddSpecialTravelExpensesForm;
