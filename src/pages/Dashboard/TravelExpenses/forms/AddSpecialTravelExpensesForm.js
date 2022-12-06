// @mui
import React, { forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  TextField,
  FormHelperText,
  Typography,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import PopupForm from 'components/Popups/PopupForm';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useFormik } from 'formik';
import moment from 'moment-timezone';
import * as Yup from 'yup';
// components
// api
import { createNewProject } from 'supabase/projects';

// ----------------------------------------------------------------------
const validationSchema = Yup.object().shape({
  project_id: Yup.string().min(2, 'Too Short!').required('Required').nullable(),
  resource: Yup.string().min(2, 'Too Short!').required('Required').nullable(),
  expense_type: Yup.string().required('Required').nullable(),
  start: Yup.date().required('Required').nullable(),
});

const initialValues = {
  project_id: null,
  resource: null,
  expense_type: null,
  start: null,
};

const AddSpecialTravelExpensesForm = forwardRef((props, ref) => {
  const { data } = props;
  const theme = useTheme();
  const [loader, setLoader] = React.useState(false);
  const [toast, setToast] = React.useState(null);

  const { handleSubmit, errors, touched, handleChange, handleBlur, values, setFieldValue, setValues } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      setLoader(true);
      const res = await createNewProject(values);
      if (res.status === 201) {
        setToast({ severity: 'success', message: 'Succesfully added new project!' });
      } else {
        setToast({ severity: 'error', message: 'Failed to added new project!' });
      }
      setLoader(false);
    },
  });

  useImperativeHandle(ref, () => ({
    handleSubmit() {
      handleSubmit();
    },
  }));

  const handleCloseToast = () => {
    setToast(null);
  };

  React.useEffect(() => {
    if (data) setValues({ ...values, data });
  }, [data]);

  return (
    <>
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
              <InputLabel id="demo-simple-select-helper-label">Project</InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={values.project_id}
                label="Project"
                onChange={handleChange}
                onBlur={handleBlur}
                name="project_id"
                fullWidth
              >
                <MenuItem value={12434}>Iljin Electric _ 345KV Samcheok Thermal Power Plant</MenuItem>
              </Select>
              <FormHelperText error={errors.project_id && touched.project_id}>
                {errors.project_id && touched.project_id ? errors.project_id : null}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-helper-label">Employee</InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={values.resource}
                label="Employee"
                onChange={handleChange}
                onBlur={handleBlur}
                name="resource"
                fullWidth
              >
                <MenuItem value={2344}>EMployee_LGS</MenuItem>
              </Select>
              <FormHelperText error={errors.resource && touched.resource}>
                {touched.resource ? errors.resource : null}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-helper-label">Expense Type</InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={values.expense_type}
                label="Expense Type"
                onChange={handleChange}
                onBlur={handleBlur}
                name="expense_type"
                fullWidth
              >
                <MenuItem value="overtime">Overtime</MenuItem>
                <MenuItem value="nightTime">Night-time</MenuItem>
                <MenuItem value="restDayMove">Rest Day move</MenuItem>
              </Select>
              <FormHelperText error={errors.expense_type && touched.expense_type}>
                {touched.expense_type ? errors.expense_type : null}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
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
        </Grid>
      </Box>
    </>
  );
});

export default AddSpecialTravelExpensesForm;
